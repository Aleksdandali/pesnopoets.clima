import { headers } from "next/headers";

/**
 * Verify that a cron request comes from Vercel Cron
 * Uses CRON_SECRET env var as shared secret
 */
export async function verifyCronSecret(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

/**
 * Simple in-memory rate limiter for form submissions
 * In production, use Vercel KV or Supabase for distributed rate limiting
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 submissions per minute per IP

export async function checkRateLimit(identifier?: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  // Get IP from headers
  const headersList = await headers();
  const ip =
    identifier ||
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Sanitize user input — strip HTML tags, trim, limit length
 */
export function sanitizeInput(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/[<>'"]/g, "") // strip dangerous chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate phone number (Bulgarian format)
 * Accepts: +359XXXXXXXXX, 0XXXXXXXXX, 08XXXXXXXX
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+359|0)\d{8,9}$/.test(cleaned);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
