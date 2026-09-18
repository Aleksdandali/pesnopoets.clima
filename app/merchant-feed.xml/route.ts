import { createPublicClient } from "@/lib/supabase/public";

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace).
 *
 * Submit https://pesnopoets-clima.com/merchant-feed.xml as a scheduled fetch
 * in Merchant Center → Products → Feeds. Enables free listings in the Google
 * Shopping tab for every active SKU without paid ads.
 *
 * Spec: https://support.google.com/merchants/answer/7052112
 */

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

const AVAILABILITY: Record<string, string> = {
  Наличен: "in_stock",
  "Ограничена наличност": "limited_availability",
  Неналичен: "out_of_stock",
};

// Google product taxonomy — full path strings are accepted and safer than
// numeric ids. Heat pumps (cat 11, 12) sit on the parent node; everything
// else is an air conditioner.
const AC_CATEGORY = "Home & Garden > Household Appliances > Climate Control Appliances > Air Conditioners";
const HEAT_PUMP_CATEGORY = "Home & Garden > Household Appliances > Climate Control Appliances";
const googleCategory = (categoryId: number | null) =>
  categoryId === 11 || categoryId === 12 ? HEAT_PUMP_CATEGORY : AC_CATEGORY;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET() {
  const supabase = createPublicClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, title, title_override, description, description_override, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, barcode, bittel_id, category_id, btu, energy_class"
    )
    .eq("is_active", true)
    .eq("is_hidden", false);

  const items = (products ?? [])
    .filter((p) => (p.price_override || p.price_client) > 0 && p.gallery?.[0])
    .map((p) => {
      const title = stripHtml(p.title_override || p.title).slice(0, 150);
      const description = stripHtml(p.description_override || p.description || title).slice(0, 5000);
      const listPrice = p.price_override || p.price_client;
      const promo = p.is_promo && p.price_promo > 0 ? p.price_promo : null;
      const link = `${SITE_URL}/bg/klimatici/${p.slug}`;
      const gtin = p.barcode?.split(",")[0]?.trim();
      const validGtin = gtin && /^\d{8,14}$/.test(gtin) ? gtin : null;
      const extraImages = (p.gallery as string[]).slice(1, 11);

      const lines = [
        `<item>`,
        `<g:id>${esc(String(p.id))}</g:id>`,
        `<g:title>${esc(title)}</g:title>`,
        `<g:description>${esc(description)}</g:description>`,
        `<g:link>${esc(link)}</g:link>`,
        `<g:image_link>${esc(p.gallery[0])}</g:image_link>`,
        ...extraImages.map((u: string) => `<g:additional_image_link>${esc(u)}</g:additional_image_link>`),
        `<g:availability>${AVAILABILITY[p.availability] || "out_of_stock"}</g:availability>`,
        `<g:price>${listPrice.toFixed(2)} EUR</g:price>`,
        ...(promo ? [`<g:sale_price>${promo.toFixed(2)} EUR</g:sale_price>`] : []),
        `<g:brand>${esc(p.manufacturer)}</g:brand>`,
        ...(validGtin ? [`<g:gtin>${validGtin}</g:gtin>`] : []),
        ...(p.bittel_id ? [`<g:mpn>${esc(p.bittel_id)}</g:mpn>`] : []),
        ...(!validGtin && !p.bittel_id ? [`<g:identifier_exists>no</g:identifier_exists>`] : []),
        `<g:condition>new</g:condition>`,
        `<g:google_product_category>${esc(googleCategory(p.category_id))}</g:google_product_category>`,
        `<g:product_type>${esc(p.manufacturer)}${p.btu ? ` &gt; ${p.btu} BTU` : ""}</g:product_type>`,
        ...(p.energy_class ? [`<g:energy_efficiency_class>${esc(String(p.energy_class).split("/")[0].trim())}</g:energy_efficiency_class>`] : []),
        `<g:shipping><g:country>BG</g:country><g:region>Варна</g:region><g:service>Доставка с монтаж</g:service><g:price>0.00 EUR</g:price></g:shipping>`,
        `</item>`,
      ];
      return lines.join("");
    });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">` +
    `<channel>` +
    `<title>Песнопоец Клима — климатици Варна</title>` +
    `<link>${SITE_URL}</link>` +
    `<description>Климатици с монтаж във Варна: Daikin, Mitsubishi, Gree, Toshiba, AUX и други.</description>` +
    items.join("") +
    `</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
