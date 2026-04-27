import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import SpecsTable from "@/components/product/SpecsTable";
import InquiryForm from "@/components/forms/InquiryForm";
import OneClickOrder from "@/components/product/OneClickOrder";
import SimilarProducts from "@/components/product/SimilarProducts";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";
import StickyProductHeader from "@/components/product/StickyProductHeader";
import ProductDescription from "@/components/product/ProductDescription";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { generateBadges } from "@/lib/bittel/badges";
import ProductBadges from "@/components/catalog/ProductBadges";
import ProductViewTracker from "@/components/product/ProductViewTracker";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { BUSINESS_PHONE_DISPLAY } from "@/lib/constants";
import {
  Zap,
  Maximize,
  Volume2,
  CheckCircle2,
  Leaf,
} from "lucide-react";

// ISR: revalidate product pages every 10 minutes
export const revalidate = 600;

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const EUR_TO_BGN = 1.95583;

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

const getProduct = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(slug, group_name, subgroup_name, name_en, name_ru, name_ua)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = product.meta_title || product.title_override || product.title;
  const description =
    product.meta_description ||
    (product.description_override || product.description || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 160);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.gallery?.[0] ? [product.gallery[0]] : [],
      url: `${siteUrl}/${locale}/klimatici/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/klimatici/${slug}`,
      languages: {
        bg: `${siteUrl}/bg/klimatici/${slug}`,
        en: `${siteUrl}/en/klimatici/${slug}`,
        ru: `${siteUrl}/ru/klimatici/${slug}`,
        uk: `${siteUrl}/ua/klimatici/${slug}`,
      },
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const dictionary = await getDictionary(locale);
  const t = dictionary.product;
  const trust = dictionary.trust;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  // Use translated title/description for non-bg locales
  const localeTitle = locale === "en" ? product.title_en : locale === "ru" ? product.title_ru : locale === "ua" ? product.title_ua : null;
  const displayTitle = product.title_override || localeTitle || product.title;
  const localeDesc = locale === "en" ? product.description_en : locale === "ru" ? product.description_ru : locale === "ua" ? product.description_ua : null;
  const displayDescription = product.description_override || localeDesc || product.description;
  const displayPrice = product.price_override || product.price_client;

  // Price — clean API price in EUR (no conversion). Bittel is the source of truth.
  const priceEUR = displayPrice.toFixed(0);

  // Category info for breadcrumb — use translated name if available
  // categories relation returns array from explicit select; take first item
  const catData = Array.isArray(product.categories) ? product.categories[0] : product.categories;
  const categoryName = locale === "en" ? catData?.name_en : locale === "ru" ? catData?.name_ru : locale === "ua" ? catData?.name_ua : null;
  const categoryNameFinal = categoryName || catData?.subgroup_name;
  const categoryGroupName = catData?.group_name;

  const bcHome = dictionary.common.nav.home;
  const bcCatalog = dictionary.common.nav.catalog;

  const jsonLd = generateProductJsonLd(product, locale, siteUrl);
  const breadcrumbItems = [
    { name: bcHome, url: `/${locale}` },
    { name: bcCatalog, url: `/${locale}/klimatici` },
  ];
  if (categoryGroupName && categoryGroupName !== categoryNameFinal) {
    breadcrumbItems.push({ name: categoryGroupName, url: `/${locale}/klimatici` });
  }
  if (categoryNameFinal) {
    breadcrumbItems.push({ name: categoryNameFinal, url: `/${locale}/klimatici` });
  }
  breadcrumbItems.push({ name: displayTitle, url: `/${locale}/klimatici/${slug}` });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems, siteUrl);

  // Map availability DB values to dictionary keys
  const availKeyMap: Record<string, "inStock" | "limited" | "outOfStock"> = {
    "Наличен": "inStock",
    "Ограничена наличност": "limited",
    "Неналичен": "outOfStock",
  };

  const availKey = availKeyMap[product.availability] || "outOfStock";
  const availLabel = t.availability[availKey];

  const availColors: Record<string, string> = {
    inStock: "bg-success-light text-success",
    limited: "bg-warning-light text-warning",
    outOfStock: "bg-danger-light text-danger",
  };

  const availDotColors: Record<string, string> = {
    inStock: "bg-success animate-pulse",
    limited: "bg-warning",
    outOfStock: "bg-danger",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <ProductViewTracker productId={product.id} title={displayTitle} priceEur={displayPrice} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-28 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 overflow-x-auto scrollbar-hide" role="navigation" aria-label="Breadcrumb">
          <ol className="flex items-center whitespace-nowrap gap-0 min-w-0">
            <li className="flex items-center shrink-0">
              <a href={`/${locale}`} className="hover:text-primary transition-colors py-1">
                {bcHome}
              </a>
              <svg className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </li>
            <li className="flex items-center shrink-0">
              <a href={`/${locale}/klimatici`} className="hover:text-primary transition-colors py-1">
                {bcCatalog}
              </a>
              <svg className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </li>
            {categoryNameFinal && (
              <li className="flex items-center shrink-0">
                <a href={`/${locale}/klimatici?category=${product.category_id}`} className="hover:text-primary transition-colors py-1">{categoryNameFinal.toLowerCase()}</a>
                <svg className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </li>
            )}
            <li>
              <span className="text-foreground font-medium py-1 truncate max-w-[200px] inline-block align-bottom" aria-current="page">{displayTitle}</span>
            </li>
          </ol>
        </nav>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">

          {/* LEFT COLUMN: Gallery */}
          <div className="order-1">
            <ProductGallery
              images={product.gallery || []}
              title={displayTitle}
            />
          </div>

          {/* RIGHT COLUMN: Product Info (conversion-optimized order) */}
          <div className="order-2 flex flex-col">

            {/* 1. Manufacturer */}
            <p className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-1.5">
              {product.manufacturer}
            </p>

            {/* Product Badges */}
            {(() => {
              const badges = generateBadges(product, locale, 6);
              return badges.length > 0 ? (
                <div className="mb-2">
                  <ProductBadges badges={badges} max={6} />
                </div>
              ) : null;
            })()}

            {/* 2. Product Title (h1) */}
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
              {displayTitle}
            </h1>

            {/* 3. Availability Badge + SKU */}
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold ${
                  availColors[availKey]
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${availDotColors[availKey]}`}
                  aria-hidden="true"
                />
                {availLabel}
                {product.stock_size && product.stock_size <= 5 && (
                  <span className="ml-1.5">
                    ({product.stock_size} {dictionary.common.pcs})
                  </span>
                )}
              </span>
              {product.bittel_id && (
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {t?.sku || "Код"}:{" "}
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {product.bittel_id}
                  </span>
                </span>
              )}
            </div>

            {/* 4. Price Block (large, prominent) — EUR + BGN equivalent */}
            <div className="bg-muted rounded-xl p-4 sm:p-5 mb-4">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {priceEUR} €
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  ({Math.round(displayPrice * EUR_TO_BGN)} лв.)
                </span>
              </div>
              {product.is_promo && product.price_promo > 0 && (
                <p className="text-sm text-danger font-semibold mt-1">
                  {dictionary.common.promoPrice}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {t?.priceVat}
              </p>
            </div>

            {/* 5. Trust Block — before CTA for reassurance */}
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.freeDelivery}</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.professionalInstallation}</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.warrantyLong}</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.freeConsultation}</span>
              </li>
            </ul>

            {/* 6. Primary CTA — Add to Cart */}
            <div className="mb-3">
              <AddToCartButton
                locale={locale}
                variant="full"
                className="w-full"
                item={{
                  id: product.id,
                  slug: product.slug,
                  title: displayTitle,
                  manufacturer: product.manufacturer,
                  priceEur: displayPrice,
                  image: product.gallery?.[0],
                  btu: product.btu ?? null,
                }}
                label={
                  t?.addToCart ||
                  (locale === "en"
                    ? "Add to cart"
                    : locale === "ua"
                    ? "У кошик"
                    : locale === "ru"
                    ? "В корзину"
                    : "В количката")
                }
                addedLabel={
                  t?.addedToCart ||
                  (locale === "en"
                    ? "Added"
                    : locale === "ua"
                    ? "Додано"
                    : locale === "ru"
                    ? "Добавлено"
                    : "Добавено")
                }
              />
            </div>

            {/* 6b. Secondary CTA — 1-Click callback */}
            <OneClickOrder
              locale={locale}
              productId={product.id}
              productTitle={displayTitle}
            />

            {/* 7. Key Specs Grid (4 decision-critical specs only) */}
            <dl className="grid grid-cols-2 gap-2 mt-6 mb-6">
              {product.btu && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Zap className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground leading-none mb-0.5">{t?.power || "BTU"}</dt>
                    <dd className="text-sm font-semibold leading-tight truncate">
                      {product.btu.toLocaleString()} BTU
                    </dd>
                  </div>
                </div>
              )}
              {product.area_m2 && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Maximize className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground leading-none mb-0.5">{t?.area}</dt>
                    <dd className="text-sm font-semibold leading-tight truncate">
                      {dictionary.common.upTo} {product.area_m2} {dictionary.common.sqm}
                    </dd>
                  </div>
                </div>
              )}
              {product.energy_class && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Leaf className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground leading-none mb-0.5">{t?.energyClass}</dt>
                    <dd className="text-sm font-semibold leading-tight">{product.energy_class}</dd>
                  </div>
                </div>
              )}
              {product.noise_db_indoor && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Volume2 className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground leading-none mb-0.5">{t?.noise}</dt>
                    <dd className="text-sm font-semibold leading-tight">{product.noise_db_indoor} dB</dd>
                  </div>
                </div>
              )}
            </dl>

            {/* 8. Full Inquiry Form — desktop only; on mobile it lives below Similar Products */}
            <div
              id="inquiry-form-section"
              className="hidden lg:block bg-white border border-border rounded-xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-1">
                {dictionary.inquiry?.title || t?.inquiryButton}
              </h2>
              {dictionary.inquiry?.subtitle && (
                <p className="text-sm text-muted-foreground mb-4">
                  {dictionary.inquiry.subtitle}
                </p>
              )}
              <InquiryForm
                locale={locale}
                productId={product.id}
                productTitle={displayTitle}
                dictionary={dictionary}
              />
            </div>
          </div>
        </div>

        {/* BELOW THE FOLD CONTENT */}

        {/* Description (collapsible, smart-hidden if empty/duplicate) */}
        {displayDescription && (
          <section className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              {t?.description}
            </h2>
            <ProductDescription
              html={displayDescription}
              title={displayTitle}
              readMoreLabel={t?.readMore}
              readLessLabel={t?.readLess}
            />
          </section>
        )}

        {/* Specs Table */}
        <section className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">
            {t?.specifications}
          </h2>
          <SpecsTable features={product.features} locale={locale} />
        </section>

        {/* Mobile-only Inquiry Form — before Similar Products so it's reachable */}
        <section
          id="inquiry-form-section-mobile"
          className="lg:hidden mt-10 sm:mt-12 bg-white border border-border rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-1">
            {dictionary.inquiry?.title || t?.inquiryButton}
          </h2>
          {dictionary.inquiry?.subtitle && (
            <p className="text-sm text-muted-foreground mb-4">
              {dictionary.inquiry.subtitle}
            </p>
          )}
          <InquiryForm
            locale={locale}
            productId={product.id}
            productTitle={displayTitle}
            dictionary={dictionary}
          />
        </section>

        {/* Similar Products */}
        <SimilarProducts
          currentProductId={product.id}
          categoryId={product.category_id}
          manufacturer={product.manufacturer}
          locale={locale}
          dictionary={dictionary}
        />
      </div>

      {/* Sticky top header on scroll (all breakpoints) */}
      <StickyProductHeader
        locale={locale}
        title={displayTitle}
        priceEUR={priceEUR}
        cartItem={{
          id: product.id,
          slug: product.slug,
          title: displayTitle,
          manufacturer: product.manufacturer,
          priceEur: displayPrice,
          image: product.gallery?.[0],
          btu: product.btu ?? null,
        }}
        labels={{
          buy:
            t?.buyNow ||
            (locale === "en"
              ? "Buy"
              : locale === "ua"
              ? "Купити"
              : locale === "ru"
              ? "Купить"
              : "Купи"),
          added:
            t?.addedToCart ||
            (locale === "en"
              ? "Added"
              : locale === "ua"
              ? "Додано"
              : locale === "ru"
              ? "Добавлено"
              : "Добавено"),
          inquiry: dictionary.stickyBar.inquiry,
          eur: dictionary.common.currency.eur,
        }}
      />

      {/* Sticky mobile CTA (bottom, mobile-only) */}
      <StickyMobileCTA
        locale={locale}
        priceEUR={priceEUR}
        phoneNumber={BUSINESS_PHONE_DISPLAY}
        cartItem={{
          id: product.id,
          slug: product.slug,
          title: displayTitle,
          manufacturer: product.manufacturer,
          priceEur: displayPrice,
          image: product.gallery?.[0],
          btu: product.btu ?? null,
        }}
        labels={{
          call: dictionary.stickyBar.call,
          buy:
            t?.buyNow ||
            (locale === "en"
              ? "Buy"
              : locale === "ua"
              ? "Купити"
              : locale === "ru"
              ? "Купить"
              : "Купи"),
          added:
            t?.addedToCart ||
            (locale === "en"
              ? "Added"
              : locale === "ua"
              ? "Додано"
              : locale === "ru"
              ? "Добавлено"
              : "Добавено"),
          eur: dictionary.common.currency.eur,
        }}
      />
    </>
  );
}
