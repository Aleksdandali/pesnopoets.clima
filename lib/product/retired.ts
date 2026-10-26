import { BRANDS } from "@/lib/brands";
import { brandLandingPath } from "@/lib/product/insights";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

// Brands with a landing page, keyed by how they are spelled in slugs. Longer
// keys first so "mitsubishi-heavy" wins over "mitsubishi".
const BRAND_SLUGS: Array<[string, string]> = [
  ...BRANDS.map((b): [string, string] => [b.slug, b.manufacturer]),
  ["general", "General"] as [string, string],
  ["daikin", "Daikin"] as [string, string],
  ["mitsubishi", "Mitsubishi"] as [string, string],
].sort((a, b) => b[0].split("-").length - a[0].split("-").length);

const KNOWN_MANUFACTURERS = new Set(BRAND_SLUGS.map(([, m]) => m.toLowerCase()));

/**
 * The brand a product slug names before its model code (the first token with
 * a digit): "vatreshno-tyalo-stenen-tip-invertor-kaisai-klb-18hrhi" → Kaisai.
 */
function brandFromSlug(slug: string): string | null {
  const tokens = slug.split("-");
  const model = tokens.findIndex((t) => /\d/.test(t));
  const head = `-${(model < 0 ? tokens : tokens.slice(0, model)).join("-")}-`;
  return BRAND_SLUGS.find(([key]) => head.includes(`-${key}-`))?.[1] ?? null;
}

/**
 * Where a product URL that is no longer public (deactivated by a supplier
 * sync, hidden, or from before slugs were stable) should 308 to, or null for
 * a 404. Preference: the same product relisted under `<slug>-<id>`, then the
 * brand page, then the catalog for a known row without a brand.
 */
export async function retiredProductRedirect(slug: string): Promise<string | null> {
  const { data: relisted } = await createPublicClient()
    .from("products")
    .select("slug")
    .like("slug", `${slug}-%`)
    .limit(5);
  const twin = relisted?.find(
    (p) => p.slug.startsWith(`${slug}-`) && /^\d+$/.test(p.slug.slice(slug.length + 1))
  );
  if (twin) return `/klimatici/${twin.slug}`;

  // Inactive and hidden rows are invisible to the anon client (RLS policy
  // "Public can read active products"), so look the row up server-side.
  let row: { manufacturer: string | null } | null = null;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data } = await createAdminClient()
      .from("products")
      .select("manufacturer")
      .eq("slug", slug)
      .maybeSingle();
    row = data;
  }

  const manufacturer =
    row?.manufacturer && KNOWN_MANUFACTURERS.has(row.manufacturer.toLowerCase())
      ? row.manufacturer
      : brandFromSlug(slug);
  if (manufacturer) return brandLandingPath(manufacturer);
  return row ? "/klimatici" : null;
}
