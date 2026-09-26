import { createAdminClient } from "@/lib/supabase/admin";
import type { SyncReport } from "@/lib/bittel/sync";
import { fetchAllProducts } from "./client";
import { mapProduct, modelCodes, type MappedProduct } from "./parser";

export interface BulclimaSyncReport extends SyncReport {
  skipped: { outOfScope: number; unmappedCategory: number; noPrice: number; duplicate: number };
  /** Bulclima "category|sub_category" pairs with no mapping — extend CATEGORY_MAP in parser.ts. */
  unmappedCategories: string[];
}

type Admin = ReturnType<typeof createAdminClient>;

interface ProductRow {
  id: number;
  bittel_id: string;
  supplier: string;
  slug: string;
  title: string;
  manufacturer: string | null;
  price_client: number | null;
  availability: string | null;
  is_active: boolean;
}

const SUPPLIER = "bulclima";
// The feed has no stock data; Bulclima itself sells every listed item.
const AVAILABILITY = "Наличен";
const BATCH = 100;
const PAGE = 1000;

export async function syncBulclimaProducts(options: { dryRun?: boolean } = {}): Promise<BulclimaSyncReport> {
  const startTime = Date.now();
  const supabase = createAdminClient();
  const report: BulclimaSyncReport = {
    total: 0,
    created: 0,
    updated: 0,
    deactivated: 0,
    errors: 0,
    duration: 0,
    skipped: { outOfScope: 0, unmappedCategory: 0, noPrice: 0, duplicate: 0 },
    unmappedCategories: [],
  };

  try {
    // 1. Fetch and map. A failed fetch throws before anything is written.
    const feed = await fetchAllProducts();
    report.total = feed.length;

    const mapped: MappedProduct[] = [];
    const unmapped = new Set<string>();
    for (const item of feed) {
      const result = mapProduct(item);
      if (result.ok) mapped.push(result.product);
      else if (result.reason === "out_of_scope") report.skipped.outOfScope++;
      else if (result.reason === "no_price") report.skipped.noPrice++;
      else {
        report.skipped.unmappedCategory++;
        unmapped.add(result.categoryKey);
      }
    }
    report.unmappedCategories = [...unmapped];

    // 2. Current state: categories, and every product (all suppliers) for
    //    brand spelling, slug uniqueness and cross-supplier duplicates.
    const [categoryIds, rows] = await Promise.all([loadCategoryIds(supabase), loadProducts(supabase)]);
    const own = new Map(rows.filter((r) => r.supplier === SUPPLIER).map((r) => [r.bittel_id, r]));
    const takenSlugs = new Set(rows.map((r) => r.slug));

    // A brand both suppliers carry keeps the existing spelling (filters match exact names).
    const brandNames = new Map<string, string>();
    const otherModels = new Map<string, Set<string>>();
    for (const r of rows) {
      if (r.supplier === SUPPLIER || !r.manufacturer) continue;
      const brand = r.manufacturer.toLowerCase();
      brandNames.set(brand, r.manufacturer);
      if (!r.is_active) continue;
      const models = otherModels.get(brand) ?? new Set<string>();
      for (const code of modelCodes(r.title)) models.add(code);
      otherModels.set(brand, models);
    }

    // 3. Build insert / update rows.
    const now = new Date().toISOString();
    const inserts: Record<string, unknown>[] = [];
    const updates: Record<string, unknown>[] = [];
    const history: Record<string, unknown>[] = [];
    const seen = new Set<string>();

    for (const p of mapped) {
      const manufacturer = brandNames.get(p.manufacturer.toLowerCase()) ?? p.manufacturer;
      // Same model already sold from another supplier (which has stock data) — keep that one.
      const firstModel = modelCodes(p.title)[0];
      if (firstModel && otherModels.get(manufacturer.toLowerCase())?.has(firstModel)) {
        report.skipped.duplicate++;
        continue;
      }

      const categoryId = categoryIds.get(`${p.category.group_code}|${p.category.subgroup_code}`);
      if (!categoryId) {
        console.error(`[Bulclima sync] Missing category ${p.category.group_code}/${p.category.subgroup_code} for ${p.bittel_id}`);
        report.errors++;
        continue;
      }

      seen.add(p.bittel_id);
      const row = {
        bittel_id: p.bittel_id,
        supplier: SUPPLIER,
        category_id: categoryId,
        title: p.title,
        manufacturer,
        description: p.description,
        price_client: p.price_client,
        price_promo: 0,
        is_promo: false,
        availability: AVAILABILITY,
        stock_size: null,
        is_ask: false,
        gallery: p.gallery,
        features: p.features,
        transport_packages: [],
        btu: p.btu,
        energy_class: p.energy_class,
        area_m2: null,
        noise_db_indoor: p.noise_db_indoor,
        refrigerant: p.refrigerant,
        warranty_months: p.warranty_months,
        seer: p.seer,
        scop: p.scop,
        is_active: true,
        synced_at: now,
        updated_at: now,
      };

      const existing = own.get(p.bittel_id);
      if (existing) {
        // Keep the URL stable once published.
        updates.push({ ...row, slug: existing.slug });
        if (Number(existing.price_client) !== p.price_client || existing.availability !== AVAILABILITY) {
          history.push({
            product_id: existing.id,
            price_client: p.price_client,
            price_promo: 0,
            availability: AVAILABILITY,
            stock_size: null,
          });
        }
      } else {
        let slug = p.slug;
        if (takenSlugs.has(slug)) slug = `${slug}-${p.bittel_id.slice(3)}`;
        takenSlugs.add(slug);
        inserts.push({ ...row, slug, created_at: now });
      }
    }

    // 4. Products that left the feed. Guard against a half-empty feed wiping the catalog.
    const active = [...own.values()].filter((r) => r.is_active);
    const gone = active.filter((r) => !seen.has(r.bittel_id)).map((r) => r.bittel_id);
    const feedLooksBroken = active.length > 0 && seen.size < active.length * 0.5;
    if (feedLooksBroken) {
      console.error(`[Bulclima sync] Only ${seen.size} of ${active.length} active products in feed — skipping deactivation`);
      report.errors++;
    }

    if (options.dryRun) {
      report.created = inserts.length;
      report.updated = updates.length;
      report.deactivated = feedLooksBroken ? 0 : gone.length;
    } else {
      report.created = await write(inserts, report, (chunk) => supabase.from("products").insert(chunk));
      report.updated = await write(updates, report, (chunk) =>
        supabase.from("products").upsert(chunk, { onConflict: "bittel_id" })
      );
      await write(history, report, (chunk) => supabase.from("price_history").insert(chunk));
      if (!feedLooksBroken && gone.length > 0) {
        report.deactivated = await write(gone, report, (chunk) =>
          supabase
            .from("products")
            .update({ is_active: false, updated_at: now })
            .eq("supplier", SUPPLIER)
            .in("bittel_id", chunk)
        );
      }
    }
  } catch (err) {
    console.error("[Bulclima sync] Fatal error:", err);
    report.errors++;
  }

  report.duration = Date.now() - startTime;
  return report;
}

/** Write in batches; a failing batch is retried row by row so one bad row doesn't sink 99. */
async function write<T>(
  items: T[],
  report: SyncReport,
  run: (chunk: T[]) => PromiseLike<{ error: { message: string } | null }>
): Promise<number> {
  let written = 0;
  for (let i = 0; i < items.length; i += BATCH) {
    const chunk = items.slice(i, i + BATCH);
    const { error } = await run(chunk);
    if (!error) {
      written += chunk.length;
      continue;
    }
    for (const item of chunk) {
      const { error: rowError } = await run([item]);
      if (rowError) {
        console.error("[Bulclima sync] Write error:", rowError.message, item);
        report.errors++;
      } else {
        written++;
      }
    }
  }
  return written;
}

async function loadCategoryIds(supabase: Admin): Promise<Map<string, number>> {
  const { data, error } = await supabase.from("categories").select("id, group_code, subgroup_code");
  if (error) throw error;
  return new Map((data ?? []).map((c) => [`${c.group_code}|${c.subgroup_code}`, c.id]));
}

async function loadProducts(supabase: Admin): Promise<ProductRow[]> {
  const rows: ProductRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("products")
      .select("id, bittel_id, supplier, slug, title, manufacturer, price_client, availability, is_active")
      .order("id")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as ProductRow[]));
    if (!data || data.length < PAGE) return rows;
  }
}
