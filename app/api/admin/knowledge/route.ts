import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ai_knowledge")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Knowledge fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, password } = body;

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Заполните заголовок и содержание" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("ai_knowledge").insert({
    title: title.trim().slice(0, 200),
    content: content.trim().slice(0, 5000),
  });

  if (error) {
    console.error("Knowledge insert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, title, content, is_active, password } = body;

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) update.title = title.trim().slice(0, 200);
  if (content !== undefined) update.content = content.trim().slice(0, 5000);
  if (is_active !== undefined) update.is_active = is_active;

  const supabase = createAdminClient();
  const { error } = await supabase.from("ai_knowledge").update(update).eq("id", id);

  if (error) {
    console.error("Knowledge update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, password } = body;

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("ai_knowledge").delete().eq("id", id);

  if (error) {
    console.error("Knowledge delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
