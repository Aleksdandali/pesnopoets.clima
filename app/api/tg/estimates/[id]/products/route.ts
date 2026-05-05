import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../../lib/supabase/admin";

/** GET /api/tg/estimates/[id]/products — products filtered by BTU range and optional `q` text */
export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const minBtu = parseInt(url.searchParams.get("min_btu") || "0");
  const maxBtu = parseInt(url.searchParams.get("max_btu") || "100000");
  const q = (url.searchParams.get("q") || "").trim();

  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select(
      "id, title, title_override, manufacturer, price_client, price_override, price_promo, is_promo, btu, gallery, availability, stock_size"
    )
    .eq("is_active", true)
    .eq("is_hidden", false)
    .gte("btu", minBtu)
    .lte("btu", maxBtu)
    .gt("stock_size", 0)
    .order("price_client", { ascending: true })
    .limit(q ? 30 : 20);

  if (q) {
    // Escape Postgres reserved chars for `or` filter values
    const safe = q.replace(/[(),]/g, " ").trim();
    query = query.or(`title.ilike.%${safe}%,title_override.ilike.%${safe}%,manufacturer.ilike.%${safe}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
});
