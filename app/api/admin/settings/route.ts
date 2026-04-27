import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pesnopoets2026";

function getPassword(req: NextRequest): string | null {
  // From Authorization header
  const auth = req.headers.get("authorization");
  if (auth) {
    return auth.replace(/^Bearer\s+/i, "").trim();
  }
  // From query param
  const url = new URL(req.url);
  return url.searchParams.get("pw");
}

/** GET /api/admin/settings?pw=xxx — read all settings */
export async function GET(req: NextRequest) {
  const pw = getPassword(req);
  if (pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, updated_at")
    .order("key");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

/** POST /api/admin/settings — update settings */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { settings, password } = body as { settings: Record<string, string>; password?: string };

  // Auth from body or header
  const pw = password || getPassword(req);
  if (pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!settings || typeof settings !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createAdminClient();

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
