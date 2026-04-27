import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select("id, bittel_id, title, title_override, manufacturer, price_client, price_override, price_promo, is_promo, availability, stock_size, btu, energy_class, is_active, is_hidden, gallery, synced_at", { count: "exact" })
    .order("manufacturer", { ascending: true })
    .order("title", { ascending: true })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`title.ilike.%${search}%,manufacturer.ilike.%${search}%,bittel_id.ilike.%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({
    products: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, price_override, title_override, is_active, is_hidden, password } = body as {
    id: number;
    price_override?: number | null;
    title_override?: string | null;
    is_active?: boolean;
    is_hidden?: boolean;
    password?: string;
  };

  const auth = verifyAdminWithBody(req, password);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (price_override !== undefined) {
    update.price_override = price_override;
  }
  if (title_override !== undefined) {
    update.title_override = title_override ? title_override.slice(0, 300) : null;
  }
  if (is_active !== undefined) {
    update.is_active = is_active;
  }
  if (is_hidden !== undefined) {
    update.is_hidden = is_hidden;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(update).eq("id", id);

  if (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
