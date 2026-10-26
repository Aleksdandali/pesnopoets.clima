import { SITEMAP_FILES, siteUrl, xmlResponse } from "@/lib/seo/sitemap";

// Sitemap index at the URL robots.txt and Search Console already use. The
// URLs live in /sitemap/<file> (app/sitemap/[file]/route.ts), split so no
// single response nears the 4.5 MB function response limit.
export const dynamic = "force-static";

export function GET() {
  const items = SITEMAP_FILES.map(
    (file) => `<sitemap>\n<loc>${siteUrl}/sitemap/${file}</loc>\n</sitemap>\n`
  ).join("");
  return xmlResponse(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      items +
      "</sitemapindex>\n"
  );
}
