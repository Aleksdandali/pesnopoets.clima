import type { MetadataRoute } from "next";

/**
 * robots.txt — explicit allow rules for AI crawlers to maximise visibility in
 * Google AI Overviews, Perplexity, ChatGPT search, and Claude's web tools.
 * Aligns with ongoing AIO citation strategy (see memory/goal_aio_optimization.md).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  const disallow = ["/api/", "/admin/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // AI training & retrieval crawlers — explicit allow so default-disallow
      // policies (some have one) don't block citation in AI answers.
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Claude-Web", allow: "/", disallow },
      { userAgent: "anthropic-ai", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Perplexity-User", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
      { userAgent: "Bytespider", allow: "/", disallow },
      { userAgent: "CCBot", allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
