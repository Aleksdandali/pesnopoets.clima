import {
  SITEMAP_FILES,
  SITEMAP_LOCALES,
  fetchSitemapProducts,
  pageEntries,
  productEntries,
  urlsetXml,
  xmlResponse,
} from "@/lib/seo/sitemap";

// Child sitemaps listed by /sitemap.xml. A Route Handler, not the `sitemap.ts`
// convention: on Vercel that file was served as a static asset, so the hourly
// revalidate never ran and the sitemap stayed at its build-time contents.
// Rebuilt hourly: supplier syncs add and retire products between deploys.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SITEMAP_FILES.map((file) => ({ file }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const products = await fetchSitemapProducts();
  // An empty list means the query failed. Throwing keeps the last good
  // sitemap in the ISR cache instead of publishing one without products.
  if (products.length === 0) throw new Error("[sitemap] no active products returned");

  const locale = SITEMAP_LOCALES.find((l) => file === `products-${l}.xml`);
  return xmlResponse(urlsetXml(locale ? productEntries(products, locale) : pageEntries(products)));
}
