/**
 * HttpOnly cookie JWT for /admin sessions (passwordless TG flow).
 *
 * Secret derivation matches lib/tg-miniapp/jwt.ts conventions: derive from
 * TELEGRAM_BOT_TOKEN with a fresh HMAC label so the two scopes can't sign
 * each other's tokens.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";
const TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

interface AdminPayload {
  sub: "admin";
  iat: number;
  exp: number;
  jti: string;
  tgId?: number; // telegram user id of approver (audit)
}

function getSecret(): Buffer {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");
  return createHmac("sha256", "admin-session-secret").update(token).digest();
}

function b64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64url");
}

export function signAdminCookie(tgId?: number): { value: string; maxAge: number } {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminPayload = {
    sub: "admin",
    iat: now,
    exp: now + TTL_SECONDS,
    jti: randomBytes(16).toString("hex"),
    tgId,
  };
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  return { value: `${header}.${body}.${sig}`, maxAge: TTL_SECONDS };
}

export function verifyAdminCookie(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, body, sig] = parts;

  try {
    const expected = createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
    const sigBuf = Buffer.from(sig, "utf8");
    const expBuf = Buffer.from(expected, "utf8");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

    const hdr = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
    if (hdr.alg !== "HS256") return false;

    const payload: AdminPayload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.sub !== "admin") return false;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

/** Build a Set-Cookie header value for the admin session. */
export function buildAdminCookieHeader(tgId?: number): string {
  const { value, maxAge } = signAdminCookie(tgId);
  const parts = [
    `${ADMIN_COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
    "Secure",
  ];
  return parts.join("; ");
}

export function buildAdminLogoutCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;
}

/** Generate a short, human-readable login code: 8 hex chars (~32 bits entropy). */
export function generateLoginCode(): string {
  return randomBytes(4).toString("hex"); // e.g. "a3f1c2d8"
}
