import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";
import FilterBar from "@/components/catalog/FilterBar";
import CategorySidebar from "@/components/catalog/CategorySidebar";

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

const catalogLabels: Record<string, {
  title: string;
  home: string;
  allProducts: string;
  categories: string;
  filters: string;
  noResults: string;
}> = {
  bg: { title: "Климатици", home: "Начало", allProducts: "Всички продукти", categories: "Категории", filters: "Филтри", noResults: "Няма намерени продукти. Опитайте с други филтри." },
  en: { title: "Air Conditioners", home: "Home", allProducts: "All products", categories: "Categories", filters: "Filters", noResults: "No products found. Try different filters." },
  ru: { title: "Кондиционеры", home: "Главная", allProducts: "Все товары", categories: "Категории", filters: "Фильтры", noResults: "Товары не найдены. Попробуйте другие фильтры." },
  ua: { title: "Кондиціонери", home: "Головна", allProducts: "Усі товари", categories: "Категорії", filters: "Фільтри", noResults: "Товари не знайдено. Спробуйте інші фільтри." },
};

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

async function getCategoriesWithCounts(supabase: Awaited<ReturnType<typeof createClient>>) {
  // Get all categories with product counts
  const { data: categories } = await supabase
    .from("categories")
    .select("id, group_name, subgroup_name, slug")
    .order("group_name")
    .order("subgroup_name");

  if (!categories) return { groups: [], total: 0 };

  // Count products per category
  const { data: productCounts } = await supabase
    .from("products")
    .select("category_id")
    .eq("is_active", true)
    .eq("is_hidden", false);

  const countMap: Record<number, number> = {};
  let total = 0;
  for (const p of productCounts || []) {
    if (p.category_id) {
      countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
      total++;
    }
  }

  // Group categories
  const groupMap: Record<string, {
    group_name: string;
    subcategories: Array<{ id: number; subgroup_name: string; slug: string; product_count: number }>;
    total_count: number;
  }> = {};

  for (const cat of categories) {
    if (!groupMap[cat.group_name]) {
      groupMap[cat.group_name] = { group_name: cat.group_name, subcategories: [], total_count: 0 };
    }
    const count = countMap[cat.id] || 0;
    if (count > 0) {
      groupMap[cat.group_name].subcategories.push({
        id: cat.id,
        subgroup_name: cat.subgroup_name,
        slug: cat.slug,
        product_count: count,
      });
      groupMap[cat.group_name].total_count += count;
    }
  }

  // Filter out empty groups and sort by count
  const groups = Object.values(groupMap)
    .filter((g) => g.total_count > 0)
    .sort((a, b) => b.total_count - a.total_count);

  return { groups, total };
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const dictionary = await getDictionary(locale);
  const supabase = await createClient();
  const labels = catalogLabels[locale] || catalogLabels.bg;

  // Get categories with counts
  const { groups: categoryGroups, total: totalProducts } = await getCategoriesWithCounts(supabase);
  const activeCategoryId = filters.category ? parseInt(filters.category) : undefined;

  // Find active category name for breadcrumb
  let activeCategoryName: string | null = null;
  let activeGroupName: string | null = null;
  if (activeCategoryId) {
    for (const group of categoryGroups) {
      for (const sub of group.subcategories) {
        if (sub.id === activeCategoryId) {
          activeCategoryName = sub.subgroup_name;
          activeGroupName = group.group_name;
          break;
        }
      }
    }
  }

  // Build query
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .eq("is_hidden", false);

  // Category filter
  if (activeCategoryId) {
    query = query.eq("category_id", activeCategoryId);
  }

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
  const sort = sortMap[filters.sort || ""] || { column: "manufacturer", ascending: true };
  query = query.order(sort.column, { ascending: sort.ascending });

  // Pagination
  const page = Math.max(1, parseInt(filters.page || "1"));
  const from = (page - 1) * PRODUCTS_PER_PAGE;
  query = query.range(from, from + PRODUCTS_PER_PAGE - 1);

  const { data: products, count } = await query;

  // Get unique manufacturers
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

  const showingLabels: Record<string, string> = {
    bg: `Показваме ${products?.length || 0} от ${count || 0} продукта`,
    en: `Showing ${products?.length || 0} of ${count || 0} products`,
    ru: `Показано ${products?.length || 0} из ${count || 0} товаров`,
    ua: `Показано ${products?.length || 0} з ${count || 0} товарів`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <a href={`/${locale}`} className="hover:text-primary">{labels.home}</a>
        <span className="mx-2">/</span>
        {activeCategoryName ? (
          <>
            <a href={`/${locale}/klimatici`} className="hover:text-primary">{labels.title}</a>
            <span className="mx-2">/</span>
            {activeGroupName && (
              <>
                <span className="text-muted-foreground">{activeGroupName}</span>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-foreground">{activeCategoryName}</span>
          </>
        ) : (
          <span className="text-foreground">{labels.title}</span>
        )}
      </nav>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        {activeCategoryName || labels.title}
      </h1>
      <p className="text-muted-foreground mb-6">
        {showingLabels[locale] || showingLabels.bg}
      </p>

      {/* Layout: Sidebar + Content */}
      <div className="flex gap-8">
        {/* Category Sidebar */}
        <CategorySidebar
          locale={locale}
          categories={categoryGroups}
          activeCategoryId={activeCategoryId}
          labels={{
            allProducts: labels.allProducts,
            categories: labels.categories,
            filters: labels.filters,
          }}
          totalProducts={totalProducts}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <FilterBar
            locale={locale}
            manufacturers={manufacturers}
            dictionary={dictionary}
          />

          {/* Product Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
              <p className="text-lg text-muted-foreground">{labels.noResults}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({
                    ...(filters.brand && { brand: filters.brand }),
                    ...(filters.btu && { btu: filters.btu }),
                    ...(filters.energy && { energy: filters.energy }),
                    ...(filters.available && { available: filters.available }),
                    ...(filters.sort && { sort: filters.sort }),
                    ...(filters.category && { category: filters.category }),
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
              {totalPages > 10 && (
                <span className="text-muted-foreground text-sm">... {totalPages}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
