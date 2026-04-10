import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllProducts } from "./client";
import {
  parseFeatures,
  generateProductSlug,
  generateCategorySlug,
  mapAvailability,
} from "./parser";
import type { BittelProduct } from "./types";

export interface SyncReport {
  total: number;
  created: number;
  updated: number;
  deactivated: number;
  errors: number;
  duration: number;
}

export async function syncProducts(): Promise<SyncReport> {
  const startTime = Date.now();
  const supabase = createAdminClient();

  const report: SyncReport = {
    total: 0,
    created: 0,
    updated: 0,
    deactivated: 0,
    errors: 0,
    duration: 0,
  };

  try {
    // 1. Fetch all products from Bittel
    const products = await fetchAllProducts();
    report.total = products.length;

    const processedBittelIds: string[] = [];

    // 2. Process each product
    for (const product of products) {
      try {
        await processProduct(supabase, product, report);
        processedBittelIds.push(product.id);
      } catch (err) {
        console.error(
          `[Sync] Error processing product ${product.id}:`,
          err
        );
        report.errors++;
      }
    }

    // 3. Deactivate products not in current feed
    if (processedBittelIds.length > 0) {
      const { data: activeProducts } = await supabase
        .from("products")
        .select("bittel_id")
        .eq("is_active", true);

      if (activeProducts) {
        const toDeactivate = activeProducts
          .filter((p) => !processedBittelIds.includes(p.bittel_id))
          .map((p) => p.bittel_id);

        if (toDeactivate.length > 0) {
          const { error } = await supabase
            .from("products")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .in("bittel_id", toDeactivate);

          if (!error) {
            report.deactivated = toDeactivate.length;
          }
        }
      }
    }
  } catch (err) {
    console.error("[Sync] Fatal error:", err);
    report.errors++;
  }

  report.duration = Date.now() - startTime;
  return report;
}

async function processProduct(
  supabase: ReturnType<typeof createAdminClient>,
  product: BittelProduct,
  report: SyncReport
): Promise<void> {
  // Upsert category
  const categoryId = await upsertCategory(supabase, product);

  // Parse specs
  const specs = parseFeatures(product.features);

  // Generate slug
  const slug = generateProductSlug(product.title);

  // Check if product exists
  const { data: existing } = await supabase
    .from("products")
    .select("id, price_client, availability, stock_size")
    .eq("bittel_id", product.id)
    .single();

  const priceClient = parseFloat(product.price_client) || 0;
  const pricePromo =
    product.is_promo && product.price_client_promo
      ? parseFloat(String(product.price_client_promo)) || 0
      : 0;
  const availability = mapAvailability(product.availability);

  const productData = {
    bittel_id: product.id,
    category_id: categoryId,
    title: product.title,
    slug,
    manufacturer: product.manufacturer,
    description: product.description,
    color: product.color,
    barcode: product.barcode,
    link_bittel: product.link,
    price_client: priceClient,
    price_promo: pricePromo,
    is_promo: product.is_promo === 1,
    availability,
    stock_size: product.stock_size,
    is_ask: product.is_ask === 1,
    gallery: product.gallery || [],
    features: product.features,
    transport_packages: product.transport_packages || [],
    btu: specs.btu,
    energy_class: specs.energy_class,
    area_m2: specs.area_m2,
    noise_db_indoor: specs.noise_db_indoor,
    refrigerant: specs.refrigerant,
    warranty_months: specs.warranty_months,
    seer: specs.seer,
    scop: specs.scop,
    is_active: true,
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    // Update — but don't overwrite admin overrides
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("bittel_id", product.id);

    if (error) {
      console.error(`[Sync] Update error for ${product.id}:`, error);
      report.errors++;
    } else {
      report.updated++;
    }

    // Track price/availability changes
    if (
      existing.price_client !== priceClient ||
      existing.availability !== availability ||
      existing.stock_size !== product.stock_size
    ) {
      await supabase.from("price_history").insert({
        product_id: existing.id,
        price_client: priceClient,
        price_promo: pricePromo,
        availability,
        stock_size: product.stock_size,
      });
    }
  } else {
    // Insert new product
    const { error } = await supabase
      .from("products")
      .insert({ ...productData, created_at: new Date().toISOString() });

    if (error) {
      // Handle slug conflict by appending bittel_id
      if (error.code === "23505" && error.message.includes("slug")) {
        productData.slug = `${slug}-${product.id}`;
        const { error: retryError } = await supabase
          .from("products")
          .insert({ ...productData, created_at: new Date().toISOString() });
        if (retryError) {
          console.error(
            `[Sync] Insert retry error for ${product.id}:`,
            retryError
          );
          report.errors++;
        } else {
          report.created++;
        }
      } else {
        console.error(`[Sync] Insert error for ${product.id}:`, error);
        report.errors++;
      }
    } else {
      report.created++;
    }
  }
}

// Category cache to avoid repeated DB lookups
const categoryCache = new Map<string, number>();

async function upsertCategory(
  supabase: ReturnType<typeof createAdminClient>,
  product: BittelProduct
): Promise<number> {
  const cacheKey = `${product.group}|${product.subgroup}`;

  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!;
  }

  const slug = generateCategorySlug(
    product.group_description,
    product.subgroup_description
  );

  // Try to find existing
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("group_code", product.group)
    .eq("subgroup_code", product.subgroup)
    .single();

  if (existing) {
    categoryCache.set(cacheKey, existing.id);
    return existing.id;
  }

  // Insert new category
  const { data: created, error } = await supabase
    .from("categories")
    .insert({
      group_code: product.group,
      group_name: product.group_description,
      subgroup_code: product.subgroup,
      subgroup_name: product.subgroup_description,
      slug,
    })
    .select("id")
    .single();

  if (error) {
    // Race condition — try to fetch again
    const { data: retry } = await supabase
      .from("categories")
      .select("id")
      .eq("group_code", product.group)
      .eq("subgroup_code", product.subgroup)
      .single();

    if (retry) {
      categoryCache.set(cacheKey, retry.id);
      return retry.id;
    }
    throw error;
  }

  categoryCache.set(cacheKey, created.id);
  return created.id;
}
