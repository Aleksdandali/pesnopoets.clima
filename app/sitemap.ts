import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getAllPosts } from "@/lib/blog/posts";

const locales = ["bg", "en", "ru", "ua"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
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

  // Static pages per locale
  for (const locale of locales) {
    entries.push(
      {
        url: `${siteUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${siteUrl}/${locale}/klimatici`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${locale}/inquiry`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }
    );

    // Category pages
    if (categories) {
      for (const cat of categories) {
        entries.push({
          url: `${siteUrl}/${locale}/klimatici/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    }

    // Product pages
    if (products) {
      for (const product of products) {
        entries.push({
          url: `${siteUrl}/${locale}/klimatici/${product.slug}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    }
  }

  // Blog listing + individual posts
  const blogPosts = getAllPosts();
  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });

    for (const post of blogPosts) {
      entries.push({
        url: `${siteUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
