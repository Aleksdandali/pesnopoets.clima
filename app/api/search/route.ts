import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Locale = "bg" | "en" | "ru" | "ua";

interface ProductRow {
  slug: string;
  title: string;
  title_override: string | null;
  title_en: string | null;
  title_ru: string | null;
  title_ua: string | null;
  manufacturer: string | null;
  bittel_id: string | null;
  barcode: string | null;
  btu: number | null;
  availability: string | null;
  is_promo: boolean | null;
  price_client: number | string | null;
  price_override: number | string | null;
  price_promo: number | string | null;
  gallery: unknown;
}

// Fields scanned per token (kept tight: ILIKE w/o indexes is sequential).
// Description fields excluded — too slow & noisy for instant search.
const SEARCHABLE_FIELDS = [
  "title",
  "title_override",
  "title_en",
  "title_ru",
  "title_ua",
  "manufacturer",
  "slug",
  "bittel_id",
  "barcode",
];

function pickTitle(p: ProductRow, locale: Locale): string {
  if (p.title_override) return p.title_override;
  if (locale === "en" && p.title_en) return p.title_en;
  if (locale === "ru" && p.title_ru) return p.title_ru;
  if (locale === "ua" && p.title_ua) return p.title_ua;
  return p.title;
}

function escapeIlike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

function tokenize(q: string): string[] {
  return q
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
    .slice(0, 5); // safety cap
}

function buildOrClause(token: string): string {
  const pattern = `%${escapeIlike(token)}%`;
  return SEARCHABLE_FIELDS.map((f) => `${f}.ilike.${pattern}`).join(",");
}

function scoreRow(row: ProductRow, tokens: string[], rawQuery: string): number {
  const q = rawQuery.toLowerCase();
  const bittel = (row.bittel_id || "").toLowerCase();
  const barcode = (row.barcode || "").toLowerCase();
  const slug = row.slug.toLowerCase();
  const title = (row.title_override || row.title || "").toLowerCase();
  const mfg = (row.manufacturer || "").toLowerCase();

  let score = 0;

  // SKU / bittel_id
  if (bittel && bittel === q) score += 1000;
  else if (bittel && bittel.startsWith(q)) score += 500;
  else if (bittel && bittel.includes(q)) score += 200;

  // Barcode
  if (barcode && barcode === q) score += 900;
  else if (barcode && barcode.includes(q)) score += 150;

  // Slug
  if (slug === q) score += 400;
  else if (slug.startsWith(q)) score += 250;
  else if (slug.includes(q)) score += 60;

  // Title
  if (title.startsWith(q)) score += 300;
  else if (title.includes(q)) score += 100;

  // Manufacturer
  if (mfg) {
    if (mfg === q) score += 200;
    else if (q.startsWith(mfg + " ")) score += 150;
    else if (mfg.includes(q)) score += 50;
  }

  // BTU numeric match
  if (row.btu) {
    for (const t of tokens) {
      if (/^\d{4,5}$/.test(t) && parseInt(t, 10) === row.btu) {
        score += 200;
        break;
      }
    }
  }

  // Per-token bonuses across fields
  let allTokensCovered = true;
  for (const t of tokens) {
    const tl = t.toLowerCase();
    let hit = false;
    if (title.includes(tl)) {
      score += 20;
      hit = true;
    }
    if (mfg.includes(tl)) {
      score += 15;
      hit = true;
    }
    if (bittel.includes(tl)) {
      score += 10;
      hit = true;
    }
    if (!hit) allTokensCovered = false;
  }
  if (tokens.length > 1 && allTokensCovered) score += 100;

  // Boost in-stock and promos
  if (row.availability === "Наличен") score += 20;
  else if (row.availability === "Ограничена наличност") score += 8;
  if (row.is_promo) score += 5;

  return score;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery = searchParams.get("q")?.trim() ?? "";
  const locale = (searchParams.get("locale") || "bg") as Locale;

  if (!rawQuery || rawQuery.length < 2) {
    return Response.json({ results: [] });
  }

  const supabase = createAnonClient();

  // Tokenize. If no qualifying tokens (e.g. all single chars), fall back to raw query.
  const tokens = tokenize(rawQuery);
  const effectiveTokens = tokens.length > 0 ? tokens : [rawQuery];

  // Build query: AND across tokens, each token = OR across searchable fields.
  let query = supabase
    .from("products")
    .select(
      "slug, title, title_override, title_en, title_ru, title_ua, manufacturer, bittel_id, barcode, btu, availability, is_promo, price_client, price_override, price_promo, gallery"
    )
    .eq("is_active", true)
    .eq("is_hidden", false);

  for (const token of effectiveTokens) {
    query = query.or(buildOrClause(token));
  }

  const { data, error } = await query.limit(40);

  // BTU-shortcut: if any token is purely 4–5 digits, also fetch BTU exact matches.
  // Crucially, also enforce all NON-numeric tokens via .or() so "daikin 12000"
  // doesn't return Mitsubishi just because it has btu=12000.
  let btuRows: ProductRow[] = [];
  const btuToken = effectiveTokens.find((t) => /^\d{4,5}$/.test(t));
  if (btuToken) {
    let btuQuery = supabase
      .from("products")
      .select(
        "slug, title, title_override, title_en, title_ru, title_ua, manufacturer, bittel_id, barcode, btu, availability, is_promo, price_client, price_override, price_promo, gallery"
      )
      .eq("is_active", true)
      .eq("is_hidden", false)
      .eq("btu", parseInt(btuToken, 10));

    const nonNumericTokens = effectiveTokens.filter((t) => !/^\d+$/.test(t));
    for (const t of nonNumericTokens) {
      btuQuery = btuQuery.or(buildOrClause(t));
    }

    const { data: btuData } = await btuQuery.limit(20);
    btuRows = (btuData as ProductRow[]) || [];
  }

  if (error) {
    console.error("Search API error:", error);
    return Response.json({ results: [] }, { status: 500 });
  }

  // Merge & dedupe
  const merged = new Map<string, ProductRow>();
  for (const r of (data as ProductRow[]) || []) merged.set(r.slug, r);
  for (const r of btuRows) if (!merged.has(r.slug)) merged.set(r.slug, r);

  const ranked = Array.from(merged.values())
    .map((row) => ({ row, score: scoreRow(row, effectiveTokens, rawQuery) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const total = ranked.length;
  const results = ranked.slice(0, 8).map(({ row }) => {
    const priceEur = Number(
      row.price_override ??
        (row.is_promo && row.price_promo ? row.price_promo : row.price_client)
    );
    const image =
      Array.isArray(row.gallery) && row.gallery.length > 0
        ? (row.gallery[0] as string)
        : null;

    return {
      slug: row.slug,
      title: pickTitle(row, locale),
      manufacturer: row.manufacturer,
      bittel_id: row.bittel_id,
      btu: row.btu,
      availability: row.availability,
      is_promo: !!row.is_promo,
      price_eur: Math.round(priceEur),
      image_url: image,
      url: `/${locale}/klimatici/${row.slug}`,
    };
  });

  return Response.json({ results, total });
}
