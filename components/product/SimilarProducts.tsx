import { createPublicClient } from "@/lib/supabase/public";
import ProductCard from "@/components/catalog/ProductCard";
import type { ComponentProps } from "react";

type CardProduct = ComponentProps<typeof ProductCard>["product"];

interface SimilarProductsProps {
  currentProductId: number;
  categoryId: number | null;
  manufacturer: string;
  btu: number | null;
  locale: string;
  dictionary: {
    product: {
      similarProducts: string;
      availability: {
        inStock: string;
        limited: string;
        outOfStock: string;
      };
    };
    common: {
      currency: { bgn: string; eur: string };
      upTo: string;
      sqm: string;
      promoBadge: string;
    };
  };
}

const ALT_TITLES: Record<string, (btu: number) => string> = {
  bg: (btu) => `Алтернативи с ${btu.toLocaleString("bg-BG")} BTU от други марки`,
  en: (btu) => `${btu.toLocaleString("en-US")} BTU alternatives from other brands`,
  ru: (btu) => `Альтернативы на ${btu.toLocaleString("ru-RU")} BTU от других марок`,
  ua: (btu) => `Альтернативи на ${btu.toLocaleString("uk-UA")} BTU від інших марок`,
};

// Two blocks (same series/brand + same-BTU alternatives) so every SKU gets
// 8–12 inbound links from sibling pages. Product URLs were previously reachable
// only through catalog pagination, which is the main reason GSC listed 214 BG
// products as "discovered, not indexed".
export default async function SimilarProducts({
  currentProductId,
  categoryId,
  manufacturer,
  btu,
  locale,
  dictionary,
}: SimilarProductsProps) {
  const supabase = createPublicClient();
  const TARGET = 8;
  const ALT_TARGET = 4;
  let products: CardProduct[] = [];

  const selectColumns = "id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor";

  // First: same category AND same manufacturer (other capacities of the
  // series), ordered by BTU so the row reads as a capacity ladder.
  if (categoryId) {
    const { data } = await supabase
      .from("products")
      .select(selectColumns)
      .eq("category_id", categoryId)
      .eq("manufacturer", manufacturer)
      .eq("is_active", true)
      .eq("is_hidden", false)
      .neq("id", currentProductId)
      .order("btu", { ascending: true, nullsFirst: false })
      .limit(TARGET);

    if (data) products = data;
  }

  // Then: same category, any manufacturer
  if (products.length < TARGET && categoryId) {
    const existingIds = [currentProductId, ...products.map((p) => p.id)];
    const { data } = await supabase
      .from("products")
      .select(selectColumns)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .eq("is_hidden", false)
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(TARGET - products.length);

    if (data) products = [...products, ...data];
  }

  // Fill remaining with same manufacturer
  if (products.length < TARGET && manufacturer) {
    const existingIds = [currentProductId, ...products.map((p) => p.id)];
    const { data } = await supabase
      .from("products")
      .select(selectColumns)
      .eq("manufacturer", manufacturer)
      .eq("is_active", true)
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(TARGET - products.length);

    if (data) products = [...products, ...data];
  }

  // Same BTU class, other brands — the comparison a buyer actually makes.
  let alternatives: CardProduct[] = [];
  if (btu) {
    const existingIds = [currentProductId, ...products.map((p) => p.id)];
    const { data } = await supabase
      .from("products")
      .select(selectColumns)
      .eq("btu", btu)
      .neq("manufacturer", manufacturer)
      .eq("is_active", true)
      .eq("is_hidden", false)
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(ALT_TARGET);
    if (data) alternatives = data;
  }

  if (products.length === 0 && alternatives.length === 0) return null;

  const title = dictionary.product.similarProducts;
  const altTitle = btu ? (ALT_TITLES[locale] || ALT_TITLES.bg)(btu) : "";

  const row = (items: CardProduct[]) => (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
      {items.map((product) => (
        <div
          key={product.id}
          className="min-w-[240px] sm:min-w-[280px] lg:min-w-0 snap-start"
        >
          <ProductCard product={product} locale={locale} currency="EUR" dictionary={dictionary} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {products.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">{title}</h2>
          {row(products)}
        </section>
      )}
      {alternatives.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">{altTitle}</h2>
          {row(alternatives)}
        </section>
      )}
    </>
  );
}
