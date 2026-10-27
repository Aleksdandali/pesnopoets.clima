import { getInstallationEur } from "../pricing";

export type CatalogueOffer = {
  id: number;
  title: string;
  title_override?: string | null;
  manufacturer?: string | null;
  price_client: number | string | null;
  price_override?: number | string | null;
  price_promo?: number | string | null;
  is_promo?: boolean;
  btu?: number | null;
  category_id?: number | null;
  is_active?: boolean;
  is_hidden?: boolean;
  is_ask?: boolean;
  availability?: string | null;
};

export const cents = (value: number) => Math.round((value + Number.EPSILON) * 100);
export function productPrice(row: CatalogueOffer): number {
  const value = row.price_override != null
    ? Number(row.price_override)
    : row.is_promo && Number(row.price_promo) > 0
      ? Number(row.price_promo)
      : Number(row.price_client);
  return Number.isFinite(value) && value > 0 ? cents(value) / 100 : 0;
}

// This fixed offer is for complete wall-mounted split systems, not loose
// multi-split units, accessories, heat pumps or installations needing a survey.
export function supportsStandardInstallation(row: Pick<CatalogueOffer, "btu" | "category_id">): boolean {
  return [1, 14].includes(row.category_id ?? 0) && !!row.btu && row.btu > 0 && row.btu <= 24000;
}
export function installationPrice(row: Pick<CatalogueOffer, "btu" | "category_id">): number {
  return supportsStandardInstallation(row) ? cents(getInstallationEur(row.btu)) / 100 : 0;
}

export type RequestedLine = { id: number; quantity: number; withInstallation: boolean };
export type QuotedLine = RequestedLine & { title: string; manufacturer: string; productEur: number; installationEur: number; totalEur: number };
export class QuoteError extends Error {}

export function parseLines(input: unknown): RequestedLine[] {
  if (!Array.isArray(input) || input.length < 1 || input.length > 20) throw new QuoteError("Изберете от 1 до 20 продукта.");
  const combined = new Map<string, RequestedLine>();
  for (const item of input) {
    if (!item || typeof item !== "object" || !Number.isSafeInteger(item.id) || item.id <= 0 || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 10 || (item.withInstallation !== undefined && typeof item.withInstallation !== "boolean")) throw new QuoteError("Проверете продуктите и количествата в количката.");
    const line = { id: item.id, quantity: item.quantity, withInstallation: item.withInstallation === true };
    const key = `${line.id}-${Number(line.withInstallation)}`;
    const quantity = line.quantity + (combined.get(key)?.quantity ?? 0);
    if (quantity > 10) throw new QuoteError("За повече от 10 броя от един вариант се свържете с нас.");
    combined.set(key, { ...line, quantity });
  }
  return [...combined.values()];
}

export function quoteCart(requested: RequestedLine[], products: CatalogueOffer[]) {
  const lookup = new Map(products.map(product => [product.id, product]));
  const lines: QuotedLine[] = requested.map(line => {
    const product = lookup.get(line.id);
    if (!product || product.is_active === false || product.is_hidden || product.is_ask || product.availability === "Неналичен" || !productPrice(product)) throw new QuoteError("Един от избраните продукти вече не е достъпен за заявка. Проверете количката или се свържете с нас.");
    if (line.withInstallation && !supportsStandardInstallation(product)) throw new QuoteError("Монтажът за този продукт се уточнява след консултация.");
    const productEur = productPrice(product);
    const installationEur = line.withInstallation ? installationPrice(product) : 0;
    return { ...line, title: product.title_override || product.title, manufacturer: product.manufacturer || "", productEur, installationEur, totalEur: (cents(productEur) + cents(installationEur)) * line.quantity / 100 };
  });
  return { lines, totalEur: lines.reduce((sum, line) => sum + cents(line.totalEur), 0) / 100 };
}
