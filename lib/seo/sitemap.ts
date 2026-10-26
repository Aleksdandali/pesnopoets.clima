import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchAll } from "@/lib/supabase/fetch-all";
import { getAllPosts } from "@/lib/blog/posts";
import { DISTRICTS } from "@/lib/districts";
import { BRANDS } from "@/lib/brands";
import { brandLandingPath } from "@/lib/product/insights";

export const SITEMAP_LOCALES = ["bg", "en", "ru", "ua"] as const;
export type SitemapLocale = (typeof SITEMAP_LOCALES)[number];

/** Child sitemaps under /sitemap/, listed by the /sitemap.xml index. */
export const SITEMAP_FILES = [
  "pages.xml",
  ...SITEMAP_LOCALES.map((l) => `products-${l}.xml`),
];

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

// hreflang map: ua → uk per ISO 639-1
const hreflangMap: Record<string, string> = {
  bg: "bg",
  en: "en",
  ru: "ru",
  ua: "uk",
};

function buildLanguages(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of SITEMAP_LOCALES) {
    out[hreflangMap[l]] = `${siteUrl}/${l}${path}`;
  }
  // x-default → bulgarian (primary market)
  out["x-default"] = `${siteUrl}/bg${path}`;
  return out;
}

/**
 * Build one sitemap entry per locale (or only `opts.locale`), with hreflang
 * alternates pointing to all locales.
 */
export function localized(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
    locale?: SitemapLocale;
  } = {}
): MetadataRoute.Sitemap {
  const languages = buildLanguages(path);
  return (opts.locale ? [opts.locale] : SITEMAP_LOCALES).map((l) => ({
    url: `${siteUrl}/${l}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.7,
    alternates: { languages },
  }));
}

export type SitemapProduct = { slug: string; updated_at: string | null; manufacturer: string | null };

/** Every public product. On a query error fetchAll logs and returns the rows fetched so far. */
export function fetchSitemapProducts(): Promise<SitemapProduct[]> {
  const supabase = createPublicClient();
  return fetchAll<SitemapProduct>((from, to) =>
    supabase
      .from("products")
      .select("slug, updated_at, manufacturer")
      .eq("is_active", true)
      .eq("is_hidden", false)
      .order("id")
      .range(from, to)
  );
}

export function pageEntries(products: SitemapProduct[]): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(...localized("", { changeFrequency: "daily", priority: 1.0 }));
  entries.push(
    ...localized("/klimatici", { changeFrequency: "daily", priority: 0.9 })
  );
  entries.push(
    ...localized("/montazh", { changeFrequency: "weekly", priority: 0.9 })
  );

  // District landing pages for /montazh/[district]
  for (const district of DISTRICTS) {
    entries.push(
      ...localized(`/montazh/${district.slug}`, {
        changeFrequency: "weekly",
        priority: 0.85,
      })
    );
  }
  entries.push(
    ...localized("/profilaktika", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/kalkulator-btu", { changeFrequency: "monthly", priority: 0.8 })
  );

  // District landing pages for /profilaktika/[district]
  for (const district of DISTRICTS) {
    entries.push(
      ...localized(`/profilaktika/${district.slug}`, {
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );
  }
  entries.push(
    ...localized("/daikin-varna", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/mitsubishi-varna", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/partneri", { changeFrequency: "monthly", priority: 0.7 })
  );
  entries.push(
    ...localized("/uslugi", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/abonament-biznes", { changeFrequency: "weekly", priority: 0.85 })
  );

  // SEO category landing pages
  entries.push(
    ...localized("/klimatici/inverter", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/klimatici/termopompa", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/klimatici/multisplit", { changeFrequency: "weekly", priority: 0.85 })
  );
  entries.push(
    ...localized("/klimatici/kanalen", { changeFrequency: "weekly", priority: 0.8 })
  );
  entries.push(
    ...localized("/klimatici/kasetachen", { changeFrequency: "weekly", priority: 0.8 })
  );
  entries.push(
    ...localized("/klimatici/kolonen", { changeFrequency: "weekly", priority: 0.8 })
  );
  entries.push(
    ...localized("/brands", { changeFrequency: "weekly", priority: 0.8 })
  );
  // Hand-written brand pages plus the generated page of every other catalog brand
  const brandPaths = new Set(BRANDS.map((b) => `/marki/${b.slug}`));
  for (const p of products) {
    const path = p.manufacturer ? brandLandingPath(p.manufacturer) : null;
    if (path?.startsWith("/marki/")) brandPaths.add(path);
  }
  for (const path of brandPaths) {
    entries.push(...localized(path, { changeFrequency: "weekly", priority: 0.85 }));
  }
  entries.push(
    ...localized("/za-nas", { changeFrequency: "monthly", priority: 0.6 })
  );
  entries.push(
    ...localized("/kontakti", { changeFrequency: "monthly", priority: 0.7 })
  );

  // Blog
  entries.push(
    ...localized("/blog", { changeFrequency: "weekly", priority: 0.7 })
  );
  const blogPosts = getAllPosts();
  for (const post of blogPosts) {
    entries.push(
      ...localized(`/blog/${post.slug}`, {
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  }

  return entries;
}

// Product pages — all four locales, one file each. EN product URLs are the
// ones that rank for model-code queries (GSC, summer 2026); keeping them out of
// the sitemap and noindexed cost ~8x impressions, while BG products stayed uncrawled.
export function productEntries(products: SitemapProduct[], locale: SitemapLocale): MetadataRoute.Sitemap {
  return products.flatMap((product) =>
    localized(`/klimatici/${product.slug}`, {
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      locale,
    })
  );
}

/** All URLs of every child sitemap (used by the IndexNow cron). */
export async function sitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchSitemapProducts();
  return [
    ...pageEntries(products),
    ...SITEMAP_LOCALES.flatMap((l) => productEntries(products, l)),
  ];
}

/** Same XML as Next's `sitemap.ts` convention produced. */
export function urlsetXml(entries: MetadataRoute.Sitemap): string {
  let xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const e of entries) {
    xml += `<url>\n<loc>${e.url}</loc>\n`;
    for (const [lang, href] of Object.entries(e.alternates?.languages ?? {})) {
      xml += `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />\n`;
    }
    if (e.lastModified) {
      const lastmod = e.lastModified instanceof Date ? e.lastModified.toISOString() : e.lastModified;
      xml += `<lastmod>${lastmod}</lastmod>\n`;
    }
    if (e.changeFrequency) xml += `<changefreq>${e.changeFrequency}</changefreq>\n`;
    if (e.priority !== undefined) xml += `<priority>${e.priority}</priority>\n`;
    xml += "</url>\n";
  }
  return xml + "</urlset>\n";
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
