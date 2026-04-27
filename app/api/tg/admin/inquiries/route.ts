import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("inquiries")
    .select("id, name, phone, email, message, source, status, admin_notes, locale, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  return NextResponse.json({ inquiries: data ?? [], total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});

export const PATCH = withTgAuth(async (req) => {
  const body = await req.json();
  const { id, status, admin_notes } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const validStatuses = ["new", "contacted", "completed", "cancelled"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status && validStatuses.includes(status)) update.status = status;
  if (admin_notes !== undefined) update.admin_notes = String(admin_notes).slice(0, 1000);

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  return NextResponse.json({ ok: true });
});
