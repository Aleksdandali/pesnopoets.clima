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
    .from("products")
    .select("id, title, title_override, manufacturer, price_client, price_override, availability, stock_size, btu, energy_class, is_active, gallery", { count: "exact" })
    .order("manufacturer").order("title")
    .range(offset, offset + limit - 1);

  if (search) query = query.or(`title.ilike.%${search}%,manufacturer.ilike.%${search}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  return NextResponse.json({ products: data ?? [], total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});
