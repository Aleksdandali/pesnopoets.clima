/**
 * Tool definitions for the AI consultant.
 * Each tool has a JSON-schema definition (sent to Claude) and an `execute` function.
 */

import type Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/telegram";
import { FAQ, recommendBTU } from "./knowledge";
import { EUR_TO_BGN, getBaseInstallationBgn } from "@/lib/pricing";
import { upsertClient } from "@/lib/clients";

type Locale = "bg" | "en" | "ru" | "ua";

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "search_products",
    description:
      "Search the catalog for air conditioners matching given criteria. Returns up to 8 products with id, slug, title, manufacturer, price (BGN), BTU, area_m2, noise_db_indoor, energy_class, availability, image, and semantic enrichment (selling_points, best_for, warnings). noise_db_indoor may be null for some products — do NOT claim a noise level you don't have. Use this whenever you need to recommend products. ALL parameters are optional — omit what's unknown.",
    input_schema: {
      type: "object" as const,
      properties: {
        btu_min: { type: "number", description: "Minimum BTU (e.g. 9000)" },
        btu_max: { type: "number", description: "Maximum BTU (e.g. 18000)" },
        area_m2_min: { type: "number", description: "Min area the unit covers, m²" },
        max_noise_db: {
          type: "number",
          description: "Max indoor noise in dB. Use 25 for bedrooms, 30 for living rooms.",
        },
        max_price_bgn: { type: "number", description: "Maximum price in BGN" },
        min_price_bgn: { type: "number", description: "Minimum price in BGN" },
        manufacturers: {
          type: "array",
          items: { type: "string" },
          description: "Brand filter, e.g. ['Toshiba', 'Daikin']",
        },
        energy_classes: {
          type: "array",
          items: { type: "string" },
          description: "Energy class filter, e.g. ['A+++', 'A++']",
        },
        only_in_stock: {
          type: "boolean",
          description: "If true, exclude unavailable items. Default false.",
        },
        sort: {
          type: "string",
          enum: ["price_asc", "price_desc", "noise_asc", "btu_asc"],
          description: "Sort order. Default: price_asc.",
        },
        limit: { type: "number", description: "Max results. Default 6, cap 8." },
      },
    },
  },
  {
    name: "get_catalog_summary",
    description:
      "Get a high-level overview of the entire catalog: total product count, list of brands with product counts, price range (BGN), BTU range, and energy classes available. Use this when the customer asks 'what brands do you carry?', 'how many ACs do you have?', 'what's your price range?', or any overview question. Do NOT guess catalog contents — always call this tool first.",
    input_schema: {
      type: "object" as const,
      properties: {
        only_in_stock: {
          type: "boolean",
          description: "If true, only count products currently in stock. Default false.",
        },
      },
    },
  },
  {
    name: "get_product_details",
    description:
      "Fetch full specs for a single product by slug. Use AFTER search_products when the customer asks for more details on a specific item.",
    input_schema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "Product slug from search_products results." },
      },
      required: ["slug"],
    },
  },
  {
    name: "calculate_btu",
    description:
      "Calculate recommended BTU for a room based on area and conditions. Returns min/recommended/max BTU and reasoning notes. Use before search_products when customer gives you a room.",
    input_schema: {
      type: "object" as const,
      properties: {
        area_m2: { type: "number", description: "Room area in square meters" },
        orientation: {
          type: "string",
          enum: ["north", "south", "east", "west", "unknown"],
          description: "Which side the room faces. Default unknown.",
        },
        top_floor: { type: "boolean", description: "Is it the top floor?" },
        insulation: {
          type: "string",
          enum: ["good", "average", "poor"],
          description: "Insulation quality. Default average.",
        },
        occupants: { type: "number", description: "Number of people regularly in the room" },
        heat_sources: {
          type: "boolean",
          description: "Kitchen nearby, many electronics, south-facing windows with no blinds",
        },
        ceiling_height_m: { type: "number", description: "Ceiling height in meters" },
      },
      required: ["area_m2"],
    },
  },
  {
    name: "get_faq",
    description:
      "Retrieve FAQ entries matching a topic. Use for questions about warranty, installation price/time, payment, service area, multi-split, inverter, noise explanations. Always call this before answering such questions — do not guess numbers.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description:
            "Keyword(s) matching the user's question, e.g. 'warranty', 'installation price', 'multi-split'.",
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "get_installation_price",
    description:
      "Get the standard installation price in BGN for an AC of given BTU. Returns base price (includes 3m pipe, materials, commissioning) plus extra-pipe rate.",
    input_schema: {
      type: "object" as const,
      properties: {
        btu: { type: "number", description: "Cooling capacity in BTU" },
      },
      required: ["btu"],
    },
  },
  {
    name: "collect_lead",
    description:
      "Save the customer's contact details as a new inquiry in the CRM. Use when the customer agrees to be contacted by a human manager, mentions a specific product to purchase, or asks a question only a human can answer. Always confirm with the customer before calling this.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Customer name" },
        phone: {
          type: "string",
          description: "Phone number in any format; will be normalized to +359 if local",
        },
        message: {
          type: "string",
          description: "Short summary of what the customer wants — in their language",
        },
        product_slug: {
          type: "string",
          description: "If customer showed interest in a specific product, its slug",
        },
      },
      required: ["name", "phone", "message"],
    },
  },
];

// ---- Tool executors ----

export interface ToolContext {
  locale: Locale;
}

export async function executeTool(
  toolName: string,
  input: Record<string, unknown>,
  ctx: ToolContext
): Promise<unknown> {
  switch (toolName) {
    case "search_products":
      return searchProducts(input, ctx);
    case "get_catalog_summary":
      return getCatalogSummary(input);
    case "get_product_details":
      return getProductDetails(input as { slug: string }, ctx);
    case "calculate_btu":
      return calculateBTU(input as Parameters<typeof recommendBTU>[0]);
    case "get_faq":
      return getFAQ(input as { topic: string }, ctx);
    case "get_installation_price":
      return getInstallationPrice(input as { btu: number });
    case "collect_lead":
      return collectLead(input as unknown as CollectLeadInput, ctx);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function searchProducts(
  input: Record<string, unknown>,
  ctx: ToolContext
): Promise<unknown> {
  const supabase = await createClient();
  const limit = Math.min((input.limit as number) ?? 6, 8);

  let q = supabase
    .from("products")
    .select(
      "id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, area_m2, noise_db_indoor, energy_class, stock_size, selling_points, best_for, warnings"
    )
    .eq("is_active", true)
    .eq("is_hidden", false);

  if (input.btu_min) q = q.gte("btu", input.btu_min as number);
  if (input.btu_max) q = q.lte("btu", input.btu_max as number);
  if (input.area_m2_min) q = q.gte("area_m2", input.area_m2_min as number);
  // Null-safe: include products where noise data is missing (they might be quiet
  // but the spec wasn't parsed). The AI can note "noise data unavailable" for those.
  if (input.max_noise_db) {
    q = q.or(`noise_db_indoor.lte.${input.max_noise_db},noise_db_indoor.is.null`);
  }
  if (input.manufacturers && Array.isArray(input.manufacturers)) {
    q = q.in("manufacturer", input.manufacturers as string[]);
  }
  if (input.energy_classes && Array.isArray(input.energy_classes)) {
    q = q.in("energy_class", input.energy_classes as string[]);
  }
  if (input.only_in_stock) q = q.gt("stock_size", 0);

  const sort = (input.sort as string) ?? "price_asc";
  if (sort === "price_asc" || sort === "price_desc") {
    q = q.order("price_client", { ascending: sort === "price_asc" });
  } else if (sort === "noise_asc") {
    q = q.order("noise_db_indoor", { ascending: true, nullsFirst: false });
  } else if (sort === "btu_asc") {
    q = q.order("btu", { ascending: true, nullsFirst: false });
  }

  // Price filter applied after effective-price resolution (client-side)
  q = q.limit(limit * 2); // fetch extra to allow price filtering post-query
  const { data, error } = await q;
  if (error) return { error: error.message };
  if (!data) return { products: [] };

  const minPrice = input.min_price_bgn as number | undefined;
  const maxPrice = input.max_price_bgn as number | undefined;

  const products = (data as ProductListRow[])
    .map((p) => {
      // price_client from Bittel is in EUR — primary display currency
      const priceEur = Number(
        p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client)
      );
      const title = pickTitle(p, ctx.locale);
      const image = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0] : null;
      return {
        id: p.id,
        slug: p.slug,
        title,
        manufacturer: p.manufacturer,
        price_eur: Math.round(priceEur),
        price_bgn: Math.round(priceEur * EUR_TO_BGN),
        btu: p.btu,
        area_m2: p.area_m2,
        noise_db_indoor: p.noise_db_indoor,
        energy_class: p.energy_class,
        availability: p.availability,
        in_stock: (p.stock_size ?? 0) > 0,
        image_url: image,
        url: `/${ctx.locale}/klimatici/${p.slug}`,
        // Semantic enrichment (optional — may be null for products not yet tagged).
        // AI uses these to craft expert-sounding hooks instead of raw spec listing.
        selling_points: (p as ProductListRow & { selling_points?: unknown }).selling_points ?? null,
        best_for: (p as ProductListRow & { best_for?: unknown }).best_for ?? null,
        warnings: (p as ProductListRow & { warnings?: unknown }).warnings ?? null,
      };
    })
    .filter((p: { price_bgn: number }) => {
      if (minPrice && p.price_bgn < minPrice) return false;
      if (maxPrice && p.price_bgn > maxPrice) return false;
      return true;
    })
    .slice(0, limit);

  return { products, count: products.length };
}

async function getCatalogSummary(
  input: Record<string, unknown>
): Promise<unknown> {
  const supabase = await createClient();
  let q = supabase
    .from("products")
    .select("manufacturer, price_client, price_override, price_promo, is_promo, btu, energy_class, stock_size")
    .eq("is_active", true)
    .eq("is_hidden", false);

  if (input.only_in_stock) q = q.gt("stock_size", 0);

  const { data, error } = await q;
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { total: 0, brands: [], note: "Catalog is empty." };

  // Aggregate brands with counts
  const brandCounts: Record<string, number> = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  let minBtu = Infinity;
  let maxBtu = 0;
  const energyClasses = new Set<string>();

  for (const p of data) {
    const brand = (p.manufacturer as string) || "Unknown";
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;

    const priceEur = Number(
      p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client)
    );
    if (priceEur > 0) {
      if (priceEur < minPrice) minPrice = priceEur;
      if (priceEur > maxPrice) maxPrice = priceEur;
    }
    if (p.btu) {
      if ((p.btu as number) < minBtu) minBtu = p.btu as number;
      if ((p.btu as number) > maxBtu) maxBtu = p.btu as number;
    }
    if (p.energy_class) energyClasses.add(p.energy_class as string);
  }

  const brands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return {
    total: data.length,
    brands,
    price_range_eur: { min: Math.round(minPrice), max: Math.round(maxPrice) },
    btu_range: { min: minBtu === Infinity ? null : minBtu, max: maxBtu === 0 ? null : maxBtu },
    energy_classes: [...energyClasses].sort(),
  };
}

async function getProductDetails(
  input: { slug: string },
  ctx: ToolContext
): Promise<unknown> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, title, title_override, title_en, title_ru, title_ua, manufacturer, description, description_override, price_client, price_override, price_promo, is_promo, availability, gallery, btu, area_m2, noise_db_indoor, energy_class, refrigerant, seer, scop, stock_size, features, selling_points, best_for, warnings")
    .eq("slug", input.slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: "Product not found" };

  // price_client from Bittel is in EUR — primary display currency
  const priceEur = Number(
    data.price_override ?? (data.is_promo && data.price_promo ? data.price_promo : data.price_client)
  );
  return {
    slug: data.slug,
    title: pickTitle(data, ctx.locale),
    manufacturer: data.manufacturer,
    description: pickDescription(data, ctx.locale),
    price_eur: Math.round(priceEur),
    price_bgn: Math.round(priceEur * EUR_TO_BGN),
    btu: data.btu,
    area_m2: data.area_m2,
    noise_db_indoor: data.noise_db_indoor,
    energy_class: data.energy_class,
    refrigerant: data.refrigerant,
    seer: data.seer,
    scop: data.scop,
    availability: data.availability,
    in_stock: (data.stock_size ?? 0) > 0,
    features: data.features,
    url: `/${ctx.locale}/klimatici/${data.slug}`,
  };
}

function calculateBTU(input: Parameters<typeof recommendBTU>[0]): unknown {
  return recommendBTU(input);
}

function getFAQ(input: { topic: string }, ctx: ToolContext): unknown {
  const q = input.topic.toLowerCase();
  const hits = FAQ.filter((f) => f.keywords.some((k) => q.includes(k.toLowerCase())))
    .slice(0, 3)
    .map((f) => ({ id: f.id, question: f.q[ctx.locale], answer: f.a[ctx.locale] }));
  if (hits.length === 0) {
    return {
      note: "No exact FAQ match. Topics available: warranty, install-price, delivery-time, coverage-area, payment, inverter-explained, multi-split, noise-levels. Try a keyword from these.",
    };
  }
  return { entries: hits };
}

function getInstallationPrice(input: { btu: number }): unknown {
  const base = getBaseInstallationBgn(input.btu);
  return {
    btu: input.btu,
    base_price_bgn: base,
    base_includes: "3m copper pipe, materials, commissioning, vacuum service",
    note: "Extra 3+ m pipe, drilling, chasing, and high-floor access billed separately. Final price after site visit or photos.",
  };
}

interface CollectLeadInput {
  name: string;
  phone: string;
  message: string;
  product_slug?: string;
}

async function collectLead(input: CollectLeadInput, ctx: ToolContext): Promise<unknown> {
  const supabase = await createClient();

  // Normalize phone: strip spaces/dashes/parens, prepend +359 if local
  let phone = input.phone.replace(/[\s\-()]/g, "");
  if (!phone.startsWith("+")) {
    phone = phone.replace(/^0+/, "");
    phone = `+359${phone}`;
  }

  // Resolve product_id (and title/price for Telegram) if slug given
  let productId: number | null = null;
  let productTitle: string | null = null;
  let productPrice: number | null = null;
  if (input.product_slug) {
    const { data } = await supabase
      .from("products")
      .select("id, title, title_override, price_client, price_override")
      .eq("slug", input.product_slug)
      .maybeSingle();
    productId = data?.id ?? null;
    productTitle = data?.title_override ?? data?.title ?? null;
    productPrice = data ? Number(data.price_override ?? data.price_client) : null;
  }

  // Upsert client (non-blocking)
  const clientId = await upsertClient(supabase, { phone, name: input.name, locale: ctx.locale });

  const insertData: Record<string, unknown> = {
    name: input.name,
    phone,
    message: input.message,
    locale: ctx.locale,
    source: "consultant-chat",
    product_id: productId,
    status: "new",
  };
  if (clientId) insertData.client_id = clientId;

  const { data, error } = await supabase
    .from("inquiries")
    .insert(insertData)
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  // Telegram notification — non-blocking, same pattern as /api/inquiry
  sendInquiryNotification({
    name: input.name,
    phone,
    message: input.message,
    productTitle,
    productPrice,
    locale: ctx.locale,
  }).catch(() => {});

  return {
    success: true,
    inquiry_id: data?.id,
    message_to_customer:
      ctx.locale === "bg"
        ? "Благодарим! Нашият специалист ще Ви звънне скоро."
        : ctx.locale === "ru"
          ? "Спасибо! Наш специалист скоро с вами свяжется."
          : ctx.locale === "ua"
            ? "Дякуємо! Наш спеціаліст скоро з вами зв'яжеться."
            : "Thank you! Our specialist will call you soon.",
  };
}

// ---- Helpers ----

interface ProductRow {
  title: string;
  title_override?: string | null;
  title_en?: string | null;
  title_ru?: string | null;
  title_ua?: string | null;
  description?: string | null;
  description_override?: string | null;
}

interface ProductListRow extends ProductRow {
  id: number;
  slug: string;
  manufacturer: string | null;
  price_client: number | string | null;
  price_override: number | string | null;
  price_promo: number | string | null;
  is_promo: boolean | null;
  availability: string | null;
  gallery: unknown;
  btu: number | null;
  area_m2: number | null;
  noise_db_indoor: number | null;
  energy_class: string | null;
  stock_size: number | null;
  // Optional AI enrichment (migration 003). May be null for un-tagged rows.
  selling_points?: unknown;
  best_for?: unknown;
  warnings?: unknown;
}

function pickTitle(p: ProductRow, locale: Locale): string {
  if (p.title_override) return p.title_override;
  if (locale === "en" && p.title_en) return p.title_en;
  if (locale === "ru" && p.title_ru) return p.title_ru;
  if (locale === "ua" && p.title_ua) return p.title_ua;
  return p.title;
}

function pickDescription(p: ProductRow, locale: Locale): string {
  if (p.description_override) return p.description_override;
  // locale-specific description fields don't exist yet — fall back to base
  return p.description ?? "";
}
