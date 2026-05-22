/**
 * /api/admin/team
 *
 *   GET     — list team members + onboarding state, sorted (pending first)
 *   PATCH   — update one member { telegram_user_id, action: approve|reject|deactivate|reactivate|set_role, role? }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

interface MemberRow {
  id: number;
  telegram_user_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  position: string | null;
  role: string;
  status: string;
  is_active: boolean;
  requested_at: string | null;
  decided_at: string | null;
  decided_by: number | null;
  created_at: string | null;
}

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const db = createAdminClient();
  const { data, error } = await db
    .from("telegram_team_members")
    .select(
      "id, telegram_user_id, telegram_username, first_name, last_name, name, position, role, status, is_active, requested_at, decided_at, decided_by, created_at",
    )
    .order("status", { ascending: true }) // 'approved' < 'pending' < 'rejected' alphabetically
    .order("requested_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sort: pending first, approved second, rejected last; within each group, newest first.
  const ORDER: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };
  const sorted = (data || []).sort((a, b) => {
    const da = ORDER[a.status] ?? 99;
    const dbi = ORDER[b.status] ?? 99;
    if (da !== dbi) return da - dbi;
    return (b.requested_at || b.created_at || "").localeCompare(
      a.requested_at || a.created_at || "",
    );
  });

  return NextResponse.json({ members: sorted as MemberRow[] });
}

export async function PATCH(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => null)) as {
    telegram_user_id?: number;
    action?: "approve" | "reject" | "deactivate" | "reactivate" | "set_role";
    role?: "owner" | "manager" | "operator";
  } | null;

  if (!body?.telegram_user_id || !body.action) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const db = createAdminClient();
  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: now };

  switch (body.action) {
    case "approve":
      updates.status = "approved";
      updates.is_active = true;
      updates.decided_at = now;
      break;
    case "reject":
      updates.status = "rejected";
      updates.is_active = false;
      updates.decided_at = now;
      break;
    case "deactivate":
      updates.is_active = false;
      break;
    case "reactivate":
      updates.is_active = true;
      updates.status = "approved";
      break;
    case "set_role":
      if (!body.role || !["owner", "manager", "operator"].includes(body.role)) {
        return NextResponse.json({ error: "Bad role" }, { status: 400 });
      }
      updates.role = body.role;
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { error } = await db
    .from("telegram_team_members")
    .update(updates)
    .eq("telegram_user_id", body.telegram_user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // For approve/reject: notify the applicant via Telegram (best-effort).
  if (body.action === "approve" || body.action === "reject") {
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    if (token) {
      const text =
        body.action === "approve"
          ? "✅ Ваша заявка одобрена! Вы можете пользоваться ботом. Отправьте /help."
          : "❌ Заявка отклонена. Свяжитесь с владельцем, если это ошибка.";
      void fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: body.telegram_user_id, text }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
