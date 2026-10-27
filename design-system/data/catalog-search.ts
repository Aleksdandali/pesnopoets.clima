import type { RetailProduct } from "./storefront-products";

function normalize(value: string) {
  return value.toLocaleLowerCase("bg-BG")
    .replace(/(\d)[\s.,]+(?=\d{3}(?:\D|$))/g, "$1")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Match words independently so model codes do not interrupt a brand + series query. */
export function matchesProductQuery(product: RetailProduct, query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = normalize(`${product.brand} ${product.model} ${product.series} ${product.btu} BTU климатик климатици инверторен`);
  return words.every(word => haystack.includes(word));
}
