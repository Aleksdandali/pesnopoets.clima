import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Minimal JWT (HS256) for Telegram Mini App sessions.
 * Zero dependencies — uses Node.js crypto.
 * Secret derived from bot token via HMAC (no extra env var needed).
 */

export interface TgSession {
  tgId: number;
  clientId: number | null;
  name: string;
  type: "session" | "temp";
}

interface JwtPayload extends TgSession {
  iat: number;
  exp: number;
  jti: string;
}

const SESSION_TTL = 30 * 60;  // 30 minutes
const TEMP_TTL = 10 * 60;     // 10 minutes

function getSecret(): Buffer {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");
  // Derive JWT secret from bot token — cryptographically distinct
  return createHmac("sha256", "miniapp-jwt-secret").update(token).digest();
}

function b64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64url");
}

export function createToken(payload: TgSession): string {
  const now = Math.floor(Date.now() / 1000);
  const ttl = payload.type === "temp" ? TEMP_TTL : SESSION_TTL;
  const full: JwtPayload = { ...payload, iat: now, exp: now + ttl, jti: randomBytes(16).toString("hex") };

  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(full));
  const sig = createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) throw new JwtError("MALFORMED", "Invalid token format");
  const [header, body, sig] = parts;

  // Verify signature first
  const expected = createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    throw new JwtError("INVALID_SIGNATURE", "Signature mismatch");
  }

  // Reject non-HS256
  const hdr = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
  if (hdr.alg !== "HS256") throw new JwtError("INVALID_ALG", "Unsupported algorithm");

  // Parse payload
  const payload: JwtPayload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new JwtError("EXPIRED", "Token expired");
  }
  if (!payload.tgId) throw new JwtError("INVALID_PAYLOAD", "Missing tgId");

  return payload;
}

export class JwtError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "JwtError";
  }
}
