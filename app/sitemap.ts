import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getAllPosts } from "@/lib/blog/posts";

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

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(...localized("", { changeFrequency: "daily", priority: 1.0 }));
  entries.push(
    ...localized("/klimatici", { changeFrequency: "daily", priority: 0.9 })
  );
  entries.push(
    ...localized("/montazh", { changeFrequency: "weekly", priority: 0.9 })
  );
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
    ...localized("/uslugi", { changeFrequency: "weekly", priority: 0.85 })
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

  // Category pages
  if (categories) {
    for (const cat of categories) {
      entries.push(
        ...localized(`/klimatici/${cat.slug}`, {
          changeFrequency: "daily",
          priority: 0.8,
        })
      );
    }
  }

  // Product pages
  if (products) {
    for (const product of products) {
      const lastMod = product.updated_at
        ? new Date(product.updated_at)
        : new Date();
      entries.push(
        ...localized(`/klimatici/${product.slug}`, {
          lastModified: lastMod,
          changeFrequency: "daily",
          priority: 0.8,
        })
      );
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
