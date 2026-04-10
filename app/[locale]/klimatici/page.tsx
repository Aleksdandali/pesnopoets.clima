import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";
import FilterBar from "@/components/catalog/FilterBar";

interface CatalogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    brand?: string;
    btu?: string;
    energy?: string;
    available?: string;
    sort?: string;
    page?: string;
    category?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 24;

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const dictionary = await getDictionary(locale);
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("products")
    .select("*, categories!inner(slug, group_name, subgroup_name)", {
      count: "exact",
    })
    .eq("is_active", true)
    .eq("is_hidden", false);

  // Apply filters
  if (filters.brand) {
    query = query.eq("manufacturer", filters.brand);
  }

  if (filters.btu) {
    const [min, max] = filters.btu.split("-").map(Number);
    if (min) query = query.gte("btu", min);
    if (max) query = query.lte("btu", max);
  }

  if (filters.energy) {
    query = query.ilike("energy_class", `%${filters.energy}%`);
  }

  if (filters.available === "1") {
    query = query.eq("availability", "Наличен");
  }

  // Sorting
  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    price_asc: { column: "price_client", ascending: true },
    price_desc: { column: "price_client", ascending: false },
    btu_asc: { column: "btu", ascending: true },
    btu_desc: { column: "btu", ascending: false },
    name_asc: { column: "title", ascending: true },
  };

  const sort = sortMap[filters.sort || ""] || {
    column: "manufacturer",
    ascending: true,
  };
  query = query.order(sort.column, { ascending: sort.ascending });

  // Pagination
  const page = Math.max(1, parseInt(filters.page || "1"));
  const from = (page - 1) * PRODUCTS_PER_PAGE;
  query = query.range(from, from + PRODUCTS_PER_PAGE - 1);

  const { data: products, count } = await query;

  // Get unique manufacturers for filter dropdown
  const { data: manufacturerRows } = await supabase
    .from("products")
    .select("manufacturer")
    .eq("is_active", true)
    .eq("is_hidden", false)
    .not("manufacturer", "is", null);

  const manufacturers = [
    ...new Set(
      (manufacturerRows || []).map((r: { manufacturer: string }) => r.manufacturer).filter(Boolean)
    ),
  ].sort() as string[];

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  const catalogTitle: Record<string, string> = {
    bg: "Климатици",
    en: "Air Conditioners",
    ru: "Кондиционеры",
    ua: "Кондиціонери",
  };

  const showingText: Record<string, string> = {
    bg: `Показваме ${products?.length || 0} от ${count || 0} продукта`,
    en: `Showing ${products?.length || 0} of ${count || 0} products`,
    ru: `Показано ${products?.length || 0} из ${count || 0} товаров`,
    ua: `Показано ${products?.length || 0} з ${count || 0} товарів`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <a href={`/${locale}`} className="hover:text-primary">
          {locale === "bg" ? "Начало" : locale === "ru" ? "Главная" : locale === "ua" ? "Головна" : "Home"}
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{catalogTitle[locale] || catalogTitle.bg}</span>
      </nav>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        {catalogTitle[locale] || catalogTitle.bg}
      </h1>
      <p className="text-muted-foreground mb-6">
        {showingText[locale] || showingText.bg}
      </p>

      {/* Filters */}
      <FilterBar
        locale={locale}
        manufacturers={manufacturers}
        dictionary={dictionary}
      />

      {/* Product Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              currency="BGN"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">
            {locale === "bg"
              ? "Няма намерени продукти. Опитайте с други филтри."
              : locale === "ru"
                ? "Товары не найдены. Попробуйте другие фильтры."
                : locale === "ua"
                  ? "Товари не знайдено. Спробуйте інші фільтри."
                  : "No products found. Try different filters."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({
                ...filters,
                page: String(p),
              }).toString()}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
