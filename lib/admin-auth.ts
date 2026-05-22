import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, verifyAdminCookie } from "./admin-session";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/** Rate limiting: max 10 attempts per IP per 5 minutes */
const attempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function getPassword(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth) return auth.replace(/^Bearer\s+/i, "").trim();
  const url = new URL(req.url);
  return url.searchParams.get("pw");
}

export type AuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/**
 * Verify admin auth.
 *
 * Accepts in order:
 *   1. HttpOnly cookie `admin_session` (set by /api/admin/login/poll after
 *      TG approval) — this is the new primary path.
 *   2. Legacy `?pw=` / Authorization: Bearer — kept as a break-glass fallback
 *      while we migrate every endpoint and confirm the TG flow works.
 *
 * Once the TG flow is proven on prod, the password branch can be removed.
 */
export function verifyAdmin(req: NextRequest): AuthResult {
  // 1. Cookie session (new path)
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (verifyAdminCookie(cookie)) return { ok: true };

  // 2. Legacy password path (still rate-limited)
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return { ok: false, response: NextResponse.json({ error: "Too many attempts" }, { status: 429 }) };
  }

  if (!ADMIN_PASSWORD) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const pw = getPassword(req);
  if (!pw || !safeCompare(pw, ADMIN_PASSWORD)) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true };
}

/** Same as verifyAdmin but also accepts a password from the request body. */
export function verifyAdminWithBody(req: NextRequest, bodyPassword?: string): AuthResult {
  // 1. Cookie session
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (verifyAdminCookie(cookie)) return { ok: true };

  // 2. Legacy password
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return { ok: false, response: NextResponse.json({ error: "Too many attempts" }, { status: 429 }) };
  }
  if (!ADMIN_PASSWORD) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const pw = bodyPassword || getPassword(req);
  if (!pw || !safeCompare(pw, ADMIN_PASSWORD)) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true };
}
