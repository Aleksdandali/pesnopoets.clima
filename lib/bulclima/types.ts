/**
 * One <product> from the Bulclima XML feed
 * (https://www.bulclima.com/tools/api/items/<brandId>).
 * The feed has no stock data and no structured specs.
 */
export interface BulclimaProduct {
  id: string;
  product_code: string;
  title: string;
  /** HTML bullet list — the only description Bulclima fills in. */
  short_description: string;
  description: string;
  category: string;
  sub_category: string;
  manufacturer: string;
  /** Retail price in EUR incl. VAT, the same as on bulclima.com. */
  price: string;
  /** Pre-discount price, present on some promo items. */
  old_price: string | null;
  sku: string;
  images: string[];
}
