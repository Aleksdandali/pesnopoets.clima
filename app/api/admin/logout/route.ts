/**
 * POST /api/admin/logout — clear the admin session cookie.
 *
 * No auth required: an unauth caller hitting this is a no-op (cookie already
 * absent or invalid), which is fine.
 */

import { NextResponse } from "next/server";
import { buildAdminLogoutCookie } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", buildAdminLogoutCookie());
  return res;
}
