import { XMLParser } from "fast-xml-parser";
import type { BulclimaProduct } from "./types";

// /items/0 is the brand index; each brand's products live at the URL it lists
// (/items/<brandId>). Public, no token.
const INDEX_URL = "https://www.bulclima.com/tools/api/items/0";

const xml = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  trimValues: true,
  isArray: (name) => name === "brand" || name === "product" || name === "image",
});

type XmlNode = Record<string, unknown>;

/**
 * Fetch every brand feed. Throws if the index or any feed fails, so a
 * partial catalog never reaches the sync (it would deactivate the rest).
 */
export async function fetchAllProducts(): Promise<BulclimaProduct[]> {
  const index = await fetchXml(INDEX_URL);
  const brands = ((index.brands as XmlNode)?.brand as XmlNode[] | undefined) ?? [];
  const urls = brands.map((b) => String(b.url ?? "")).filter(Boolean);
  if (urls.length === 0) throw new Error("Bulclima brand index is empty");

  const products: BulclimaProduct[] = [];
  // Sequential: 13 feeds, the largest ~5 s — no reason to hit their server in parallel.
  for (const url of urls) {
    const feed = await fetchXml(url);
    const items = ((feed.products as XmlNode)?.product as XmlNode[] | undefined) ?? [];
    for (const item of items) products.push(toProduct(item));
  }
  return products;
}

async function fetchXml(url: string): Promise<XmlNode> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    throw new Error(`Bulclima API error: ${res.status} ${res.statusText} for ${url}`);
  }
  return xml.parse(await res.text()) as XmlNode;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toProduct(node: XmlNode): BulclimaProduct {
  const images = ((node.images as XmlNode)?.image as unknown[] | undefined) ?? [];
  return {
    id: text(node.id),
    product_code: text(node.product_code),
    title: text(node.title),
    short_description: text(node.short_description),
    description: text(node.description),
    category: text(node.category),
    sub_category: text(node.sub_category),
    manufacturer: text(node.manufacturer),
    price: text(node.price),
    old_price: text(node.old_price) || null,
    sku: text(node.sku),
    images: images.map(text).filter(Boolean),
  };
}
