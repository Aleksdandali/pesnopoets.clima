import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";

interface SimilarProductsProps {
  currentProductId: number;
  categoryId: number | null;
  manufacturer: string;
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

export default async function SimilarProducts({
  currentProductId,
  categoryId,
  manufacturer,
  locale,
  dictionary,
}: SimilarProductsProps) {
  const supabase = await createClient();
  const TARGET = 4;
  let products: any[] = [];

  const selectColumns = "id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor";

  // First: same category, exclude current product
  if (categoryId) {
    const { data } = await supabase
      .from("products")
      .select(selectColumns)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", currentProductId)
      .limit(TARGET);

    if (data) products = data;
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

  if (products.length === 0) return null;

  const title = dictionary.product.similarProducts;

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">{title}</h2>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[240px] sm:min-w-[280px] lg:min-w-0 snap-start"
          >
            <ProductCard product={product} locale={locale} currency="BGN" dictionary={dictionary} />
          </div>
        ))}
      </div>
    </section>
  );
}
