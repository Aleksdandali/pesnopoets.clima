import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Banners fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ banners: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, ...fields } = body as Record<string, unknown>;

  const auth = verifyAdminWithBody(req, password as string);
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();

  const banner = {
    title: fields.title || {},
    subtitle: fields.subtitle || {},
    image_desktop: (fields.image_desktop as string) || null,
    image_mobile: (fields.image_mobile as string) || null,
    link: (fields.link as string) || "/",
    sort_order: typeof fields.sort_order === "number" ? fields.sort_order : 0,
    is_active: fields.is_active !== false,
  };

  const { data, error } = await supabase.from("banners").insert(banner).select().single();

  if (error) {
    console.error("Banner create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ banner: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, password, ...fields } = body as Record<string, unknown>;

  const auth = verifyAdminWithBody(req, password as string);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const ALLOWED = ["title", "subtitle", "image_desktop", "image_mobile", "link", "sort_order", "is_active"];
  for (const key of ALLOWED) {
    if (key in fields) {
      update[key] = fields[key];
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("banners").update(update).eq("id", id);

  if (error) {
    console.error("Banner update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) {
    console.error("Banner delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
