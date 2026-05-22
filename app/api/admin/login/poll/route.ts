/**
 * GET /api/admin/login/poll?code=XXXX
 *
 * Step 2/3 of passwordless admin login. Browser polls this until the row's
 * status flips from 'pending'. On 'approved' the response also carries a
 * Set-Cookie header that opens the actual session (HttpOnly, 90d).
 *
 * Returns:
 *   { status: 'pending'  }                — keep polling
 *   { status: 'approved' } + Set-Cookie    — done, navigate
 *   { status: 'denied'   }                — owner said no
 *   { status: 'expired'  }                — too slow
 *   { status: 'unknown'  } (404)          — bad code
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildAdminCookieHeader } from "@/lib/admin-session";

export const runtime = "nodejs";

interface AttemptRow {
  status: string;
  expires_at: string;
  approved_by: number | null;
}

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code")?.trim();
  if (!code || !/^[a-f0-9]{8}$/.test(code)) {
    return NextResponse.json({ status: "unknown" }, { status: 404 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("admin_login_attempts")
    .select("status, expires_at, approved_by")
    .eq("code", code)
    .maybeSingle<AttemptRow>();

  if (error) {
    console.error("[admin/login/poll] read failed", error);
    return NextResponse.json({ status: "unknown" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ status: "unknown" }, { status: 404 });
  }

  // Expire if past TTL and still pending
  if (data.status === "pending" && Date.parse(data.expires_at) < Date.now()) {
    await db.from("admin_login_attempts").update({ status: "expired" }).eq("code", code);
    return NextResponse.json({ status: "expired" });
  }

  if (data.status !== "approved") {
    // pending / denied / expired / consumed — just report
    return NextResponse.json({ status: data.status });
  }

  // Approved: mark consumed so the same code can't yield two sessions, set cookie.
  const { error: consumeError } = await db
    .from("admin_login_attempts")
    .update({ status: "consumed" })
    .eq("code", code)
    .eq("status", "approved"); // optimistic — fails silently if someone else already consumed

  if (consumeError) {
    console.error("[admin/login/poll] consume failed", consumeError);
    return NextResponse.json({ status: "pending" });
  }

  const cookie = buildAdminCookieHeader(data.approved_by ?? undefined);
  const res = NextResponse.json({ status: "approved" });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
