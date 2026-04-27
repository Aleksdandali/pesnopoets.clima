import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

const PRODUCT_LIST_FIELDS = "id, bittel_id, title, title_override, manufacturer, price_client, price_override, price_promo, is_promo, availability, stock_size, btu, energy_class, is_active, is_hidden, gallery, synced_at";
const PRODUCT_DETAIL_FIELDS = "*, categories(slug, group_name, subgroup_name)";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const productId = url.searchParams.get("id");

  const supabase = createAdminClient();

  // Single product detail
  if (productId) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_DETAIL_FIELDS)
      .eq("id", parseInt(productId))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: data });
  }

  // Product list
  const search = url.searchParams.get("search")?.trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select(PRODUCT_LIST_FIELDS, { count: "exact" })
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

/** Allowed fields for PATCH */
const ALLOWED_FIELDS = new Set([
  "price_override", "title_override", "description_override",
  "meta_title", "meta_description",
  "is_active", "is_hidden", "is_promo", "price_promo",
]);

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, password, ...fields } = body as Record<string, unknown>;

  const auth = verifyAdminWithBody(req, password as string);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_FIELDS.has(key)) continue;

    if (typeof value === "string") {
      update[key] = value.slice(0, 500) || null;
    } else if (typeof value === "number" || typeof value === "boolean" || value === null) {
      update[key] = value;
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(update).eq("id", id);

  if (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
