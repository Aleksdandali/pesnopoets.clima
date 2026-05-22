/**
 * POST /api/admin/login/start
 *
 * Step 1 of passwordless admin login. Issues a short code, sends the owner
 * an approve/deny prompt in Telegram, and returns the code to the browser
 * (which will poll /api/admin/login/poll until status changes).
 *
 * No auth required — but rate-limited per IP so randoms can't spam the bot.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateLoginCode } from "@/lib/admin-session";

export const runtime = "nodejs";

const TELEGRAM_API = "https://api.telegram.org/bot";
const TTL_SECONDS = 5 * 60; // attempt expires in 5 min

// Per-IP rate limit: max 3 start requests per minute. In-memory (per instance).
const recentStarts = new Map<string, { count: number; resetAt: number }>();
const START_RATE_WINDOW = 60_000;
const START_RATE_MAX = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = recentStarts.get(ip);
  if (!entry || entry.resetAt < now) {
    recentStarts.set(ip, { count: 1, resetAt: now + START_RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > START_RATE_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const ownerId = (process.env.TELEGRAM_OWNER_ID || "").trim();
  if (!token || !ownerId) {
    return NextResponse.json({ error: "Telegram bot not configured" }, { status: 503 });
  }

  const code = generateLoginCode();
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString();

  const db = createAdminClient();
  const { error: insertError } = await db.from("admin_login_attempts").insert({
    code,
    status: "pending",
    ip,
    user_agent: userAgent,
    expires_at: expiresAt,
  });
  if (insertError) {
    console.error("[admin/login/start] insert failed", insertError);
    return NextResponse.json({ error: "Could not start login" }, { status: 500 });
  }

  // Send approve / deny prompt to owner
  const text =
    "🔐 <b>Запрос входа в админ-панель</b>\n\n" +
    `IP: <code>${escapeHtml(ip)}</code>\n` +
    `Браузер: <code>${escapeHtml(userAgent ?? "—")}</code>\n` +
    "Действует 5 минут.";

  try {
    const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ownerId,
        text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Разрешить", callback_data: `adm:ok:${code}` },
              { text: "❌ Отклонить", callback_data: `adm:no:${code}` },
            ],
          ],
        },
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | { ok: boolean; result?: { message_id: number } }
      | null;

    if (!res.ok || !json?.ok) {
      console.error("[admin/login/start] TG send failed", res.status, json);
      // Clean up the attempt — the owner will never approve it.
      await db.from("admin_login_attempts").delete().eq("code", code);
      return NextResponse.json({ error: "Could not notify owner" }, { status: 502 });
    }

    // Stash message_id so the callback handler can edit the message after a decision.
    if (json.result?.message_id) {
      await db
        .from("admin_login_attempts")
        .update({ message_id: json.result.message_id })
        .eq("code", code);
    }
  } catch (err) {
    console.error("[admin/login/start] TG fetch error", err);
    await db.from("admin_login_attempts").delete().eq("code", code);
    return NextResponse.json({ error: "Could not notify owner" }, { status: 502 });
  }

  return NextResponse.json({ code, expires_in: TTL_SECONDS });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (ch) => (ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : "&gt;"));
}
