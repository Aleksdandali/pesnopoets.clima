import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

const ALLOWED_KEYS = new Set([
  "meta_pixel_id",
  "tiktok_pixel_id",
  "google_ads_id",
  "custom_head_scripts",
]);

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { settings, password } = body as { settings: Record<string, string>; password?: string };

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

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
