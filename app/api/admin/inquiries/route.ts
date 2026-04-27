import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();

  let query = supabase
    .from("inquiries")
    .select("id, name, phone, email, message, source, status, admin_notes, locale, product_id, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Inquiries fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({
    inquiries: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, admin_notes, password } = body as {
    id: number;
    status?: string;
    admin_notes?: string;
    password?: string;
  };

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const validStatuses = ["new", "contacted", "completed", "cancelled"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
  }

  if (admin_notes !== undefined) {
    update.admin_notes = admin_notes.slice(0, 1000);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").update(update).eq("id", id);

  if (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
