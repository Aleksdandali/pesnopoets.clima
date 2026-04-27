import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.warn("ADMIN_PASSWORD env var is not set — admin panel disabled");
}

/** Allowed settings keys — reject anything else */
const ALLOWED_KEYS = new Set([
  "meta_pixel_id",
  "tiktok_pixel_id",
  "google_ads_id",
  "custom_head_scripts",
]);

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

/** Timing-safe password comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function getPassword(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth) {
    return auth.replace(/^Bearer\s+/i, "").trim();
  }
  const url = new URL(req.url);
  return url.searchParams.get("pw");
}

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** GET /api/admin/settings?pw=xxx */
export async function GET(req: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin disabled" }, { status: 503 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const pw = getPassword(req);
  if (!pw || !safeCompare(pw, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, updated_at")
    .order("key");

  if (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

/** POST /api/admin/settings */
export async function POST(req: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin disabled" }, { status: 503 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const body = await req.json();
  const { settings, password } = body as { settings: Record<string, string>; password?: string };

  const pw = password || getPassword(req);
  if (!pw || !safeCompare(pw, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!settings || typeof settings !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createAdminClient();

  for (const [key, value] of Object.entries(settings)) {
    if (!ALLOWED_KEYS.has(key)) continue;

    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) {
      console.error("Settings save error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
