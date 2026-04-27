import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("last_inquiry_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  return NextResponse.json({ clients: data ?? [], total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});
