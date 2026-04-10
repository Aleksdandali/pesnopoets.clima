import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";

interface SimilarProductsProps {
  currentProductId: number;
  categoryId: number | null;
  manufacturer: string;
  locale: string;
}

const sectionTitles: Record<string, string> = {
  bg: "Подобни продукти",
  en: "Similar Products",
  ru: "Похожие товары",
  ua: "Схожі товари",
};

export default async function SimilarProducts({
  currentProductId,
  categoryId,
  manufacturer,
  locale,
}: SimilarProductsProps) {
  const supabase = await createClient();
  const TARGET = 4;
  let products: any[] = [];

  // First: same category, exclude current product
  if (categoryId) {
    const { data } = await supabase
      .from("products")
      .select("*")
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
      .select("*")
      .eq("manufacturer", manufacturer)
      .eq("is_active", true)
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(TARGET - products.length);

    if (data) products = [...products, ...data];
  }

  if (products.length === 0) return null;

  const title = sectionTitles[locale] || sectionTitles.bg;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 snap-x snap-mandatory">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[260px] sm:min-w-[280px] lg:min-w-0 snap-start"
          >
            <ProductCard product={product} locale={locale} currency="BGN" />
          </div>
        ))}
      </div>
    </section>
  );
}
