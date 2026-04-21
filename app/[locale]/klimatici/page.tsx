import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";
import FilterBar from "@/components/catalog/FilterBar";
import CategorySidebar from "@/components/catalog/CategorySidebar";
import { translateGroupName } from "@/lib/i18n/feature-names";

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

async function getCategoriesWithCounts(supabase: Awaited<ReturnType<typeof createClient>>, locale: string) {
  // Run both queries in parallel
  const [categoriesResult, productCountsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, group_name, subgroup_name, slug, name_en, name_ru, name_ua")
      .order("group_name")
      .order("subgroup_name"),
    supabase
      .from("products")
      .select("category_id")
      .eq("is_active", true)
      .eq("is_hidden", false),
  ]);

  const { data: categories } = categoriesResult;
  const { data: productCounts } = productCountsResult;

  if (!categories) return { groups: [], total: 0 };

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
      groupMap[cat.group_name] = { group_name: translateGroupName(cat.group_name, locale), subcategories: [], total_count: 0 };
    }
    const count = countMap[cat.id] || 0;
    if (count > 0) {
      // Use translated subgroup name if available
      const translatedSubName = locale === "en" ? cat.name_en : locale === "ru" ? cat.name_ru : locale === "ua" ? cat.name_ua : null;
      groupMap[cat.group_name].subcategories.push({
        id: cat.id,
        subgroup_name: translatedSubName || cat.subgroup_name,
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
  const catalogDict = dictionary.catalog;

  // Get categories with counts
  const { groups: categoryGroups, total: totalProducts } = await getCategoriesWithCounts(supabase, locale);
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

  // Build query — select only needed columns for catalog cards
  let query = supabase
    .from("products")
    .select("id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor, refrigerant, stock_size, features, category_id", { count: "exact" })
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

  // Run product query and manufacturer query in parallel
  const [productResult, manufacturerResult] = await Promise.all([
    query,
    supabase
      .from("products")
      .select("manufacturer")
      .eq("is_active", true)
      .eq("is_hidden", false)
      .not("manufacturer", "is", null),
  ]);

  const { data: products, count } = productResult;
  const { data: manufacturerRows } = manufacturerResult;

  const manufacturers = [
    ...new Set(
      (manufacturerRows || []).map((r: { manufacturer: string }) => r.manufacturer).filter(Boolean)
    ),
  ].sort() as string[];

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  const showingText = catalogDict.showing
    .replace("{count}", String(products?.length || 0))
    .replace("{total}", String(count || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-muted-foreground mb-4 overflow-x-auto scrollbar-hide" role="navigation" aria-label="Breadcrumb">
        <ol className="flex items-center whitespace-nowrap">
          <li className="flex items-center shrink-0">
            <a href={`/${locale}`} className="hover:text-primary transition-colors">{catalogDict.home}</a>
            <svg className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </li>
          {activeCategoryName ? (
            <>
              <li className="flex items-center shrink-0">
                <a href={`/${locale}/klimatici`} className="hover:text-primary transition-colors">{catalogDict.title}</a>
                <svg className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </li>
              <li><span className="text-foreground">{activeCategoryName}</span></li>
            </>
          ) : (
            <li><span className="text-foreground">{catalogDict.title}</span></li>
          )}
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {activeCategoryName || catalogDict.title}
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-6">
        {showingText}
      </p>

      {/* Layout: On mobile — full width. On desktop — sidebar + content */}
      <div className="lg:flex lg:gap-8">
        {/* Category Sidebar — button on mobile, sidebar on desktop */}
        <CategorySidebar
          locale={locale}
          categories={categoryGroups}
          activeCategoryId={activeCategoryId}
          labels={{
            allProducts: catalogDict.allProducts,
            categories: catalogDict.categories,
            filters: catalogDict.filtersLabel,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  currency="EUR"
                  dictionary={dictionary}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-base sm:text-lg text-muted-foreground">{catalogDict.noResults}</p>
            </div>
          )}

          {/* Pagination — 44px tap targets, prev/next + ellipsis + last page */}
          {totalPages > 1 && (() => {
            const pg = catalogDict.pagination;
            const buildHref = (p: number) =>
              `?${new URLSearchParams({
                ...(filters.brand && { brand: filters.brand }),
                ...(filters.btu && { btu: filters.btu }),
                ...(filters.energy && { energy: filters.energy }),
                ...(filters.available && { available: filters.available }),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.category && { category: filters.category }),
                page: String(p),
              }).toString()}`;

            // Build visible page list: [1..min(totalPages,10)] + optional ellipsis + last
            const windowEnd = Math.min(totalPages, 10);
            const pages = Array.from({ length: windowEnd }, (_, i) => i + 1);
            const showLast = totalPages > 10;

            const baseCell =
              "min-w-11 h-11 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
            const inactive = "border border-border text-muted-foreground hover:bg-muted";
            const active = "bg-primary text-primary-foreground";
            const disabled = "border border-border text-muted-foreground/40 pointer-events-none";

            return (
              <nav
                aria-label={pg.label}
                className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 flex-wrap"
              >
                {/* Prev */}
                {page > 1 ? (
                  <a
                    href={buildHref(page - 1)}
                    rel="prev"
                    aria-label={pg.prev}
                    className={`${baseCell} ${inactive}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only sm:not-sr-only sm:ml-1">{pg.prev}</span>
                  </a>
                ) : (
                  <span aria-hidden="true" className={`${baseCell} ${disabled}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                )}

                {pages.map((p) => {
                  const isCurrent = p === page;
                  const label = (isCurrent ? pg.current : pg.page).replace("{n}", String(p));
                  return (
                    <a
                      key={p}
                      href={buildHref(p)}
                      aria-label={label}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`${baseCell} ${isCurrent ? active : inactive}`}
                    >
                      {p}
                    </a>
                  );
                })}

                {showLast && (
                  <>
                    <span aria-hidden="true" className="text-muted-foreground text-sm px-1">
                      …
                    </span>
                    <a
                      href={buildHref(totalPages)}
                      aria-label={(page === totalPages ? pg.current : pg.page).replace(
                        "{n}",
                        String(totalPages)
                      )}
                      aria-current={page === totalPages ? "page" : undefined}
                      className={`${baseCell} ${page === totalPages ? active : inactive}`}
                    >
                      {totalPages}
                    </a>
                  </>
                )}

                {/* Next */}
                {page < totalPages ? (
                  <a
                    href={buildHref(page + 1)}
                    rel="next"
                    aria-label={pg.next}
                    className={`${baseCell} ${inactive}`}
                  >
                    <span className="sr-only sm:not-sr-only sm:mr-1">{pg.next}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : (
                  <span aria-hidden="true" className={`${baseCell} ${disabled}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </nav>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
