import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getAllPosts } from "@/lib/blog/posts";
import { DISTRICTS } from "@/lib/districts";

const locales = ["bg", "en", "ru", "ua"] as const;
const siteUrl =
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
  for (const l of locales) {
    out[hreflangMap[l]] = `${siteUrl}/${l}${path}`;
  }
  // x-default → bulgarian (primary market)
  out["x-default"] = `${siteUrl}/bg${path}`;
  return out;
}

/** Build one sitemap entry per locale, with hreflang alternates pointing to all locales. */
function localized(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap {
  const languages = buildLanguages(path);
  return locales.map((l) => ({
    url: `${siteUrl}/${l}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.7,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all active products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true)
    .eq("is_hidden", false);

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
  entries.push(
    ...localized("/za-nas", { changeFrequency: "monthly", priority: 0.6 })
  );
  entries.push(
    ...localized("/kontakti", { changeFrequency: "monthly", priority: 0.7 })
  );

  // Product pages — primary market only (BG)
  // RU/EN/UA product pages remain crawlable + indexable via hreflang on /bg pages,
  // but excluded from sitemap to focus crawl budget on the primary market while
  // the domain is still building authority. Re-add other locales once BG indexing stabilises.
  if (products) {
    for (const product of products) {
      const path = `/klimatici/${product.slug}`;
      const lastMod = product.updated_at
        ? new Date(product.updated_at)
        : new Date();
      entries.push({
        url: `${siteUrl}/bg${path}`,
        lastModified: lastMod,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: { languages: buildLanguages(path) },
      });
    }
  }

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
