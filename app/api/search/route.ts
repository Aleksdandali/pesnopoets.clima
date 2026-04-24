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
  price_client: number | string | null;
  price_override: number | string | null;
  price_promo: number | string | null;
  is_promo: boolean | null;
  gallery: unknown;
}

function pickTitle(p: ProductRow, locale: Locale): string {
  if (p.title_override) return p.title_override;
  if (locale === "en" && p.title_en) return p.title_en;
  if (locale === "ru" && p.title_ru) return p.title_ru;
  if (locale === "ua" && p.title_ua) return p.title_ua;
  return p.title;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim();
  const locale = (searchParams.get("locale") || "bg") as Locale;

  if (!q || q.length < 2) {
    return Response.json({ results: [] });
  }

  const supabase = createAnonClient();
  const escaped = q.replace(/[%_\\]/g, "\\$&");
  const pattern = `%${escaped}%`;

  const { data, error } = await supabase
    .from("products")
    .select(
      "slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, gallery"
    )
    .eq("is_active", true)
    .eq("is_hidden", false)
    .or(
      `title.ilike.${pattern},title_override.ilike.${pattern},title_en.ilike.${pattern},title_ru.ilike.${pattern},title_ua.ilike.${pattern},manufacturer.ilike.${pattern},slug.ilike.${pattern}`
    )
    .limit(8);

  if (error) {
    console.error("Search API error:", error);
    return Response.json({ results: [] }, { status: 500 });
  }

  const results = ((data as ProductRow[]) || []).map((p) => {
    const priceEur = Number(
      p.price_override ??
        (p.is_promo && p.price_promo ? p.price_promo : p.price_client)
    );
    const image =
      Array.isArray(p.gallery) && p.gallery.length > 0
        ? (p.gallery[0] as string)
        : null;

    return {
      slug: p.slug,
      title: pickTitle(p, locale),
      manufacturer: p.manufacturer,
      price_eur: Math.round(priceEur),
      image_url: image,
      url: `/${locale}/klimatici/${p.slug}`,
    };
  });

  return Response.json({ results });
}
