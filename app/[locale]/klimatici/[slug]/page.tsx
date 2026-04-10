import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import SpecsTable from "@/components/product/SpecsTable";
import InquiryForm from "@/components/forms/InquiryForm";
import OneClickOrder from "@/components/product/OneClickOrder";
import SimilarProducts from "@/components/product/SimilarProducts";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";
import ProductDescription from "@/components/product/ProductDescription";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import {
  Zap,
  Maximize,
  Volume2,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Leaf,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const EUR_TO_BGN = 1.95583;
const PHONE_NUMBER = "+359 888 123 456";

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(slug, group_name, subgroup_name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

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

// Installment labels
const installmentLabels: Record<string, { prefix: string; suffix: string }> = {
  bg: { prefix: "или 12 x", suffix: "лв./мес." },
  en: { prefix: "or 12 x", suffix: "BGN/mo." },
  ru: { prefix: "или 12 x", suffix: "лв./мес." },
  ua: { prefix: "або 12 x", suffix: "лв./міс." },
};

// Energy class color mapping
function getEnergyClassColor(energyClass: string): string {
  const cls = energyClass.toUpperCase().replace(/\s/g, "");
  if (cls.includes("A+++")) return "bg-emerald-500 text-white";
  if (cls.includes("A++")) return "bg-emerald-400 text-white";
  if (cls.includes("A+")) return "bg-green-500 text-white";
  if (cls === "A") return "bg-lime-500 text-white";
  if (cls === "B") return "bg-yellow-400 text-foreground";
  if (cls === "C") return "bg-orange-400 text-white";
  if (cls === "D") return "bg-red-500 text-white";
  return "bg-success text-white";
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const dictionary = await getDictionary(locale);
  const t = dictionary.product;
  const trust = dictionary.trust;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  const displayTitle = product.title_override || product.title;
  const displayDescription =
    product.description_override || product.description;
  const displayPrice = product.price_override || product.price_client;
  const priceBGN = (displayPrice * EUR_TO_BGN).toFixed(0);
  const installmentMonthly = Math.ceil((displayPrice * EUR_TO_BGN) / 12);
  const instLabels = installmentLabels[locale] || installmentLabels.bg;

  // Category info for breadcrumb
  const categoryName = product.categories?.subgroup_name;
  const categoryGroupName = product.categories?.group_name;

  const bcHome = dictionary.common.nav.home;
  const bcCatalog = dictionary.common.nav.catalog;

  const jsonLd = generateProductJsonLd(product, locale, siteUrl);
  const breadcrumbItems = [
    { name: bcHome, url: `/${locale}` },
    { name: bcCatalog, url: `/${locale}/klimatici` },
  ];
  if (categoryGroupName && categoryGroupName !== categoryName) {
    breadcrumbItems.push({ name: categoryGroupName, url: `/${locale}/klimatici` });
  }
  if (categoryName) {
    breadcrumbItems.push({ name: categoryName, url: `/${locale}/klimatici` });
  }
  breadcrumbItems.push({ name: displayTitle, url: `/${locale}/klimatici/${slug}` });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems, siteUrl);

  const availLabels: Record<string, Record<string, string>> = {
    Наличен: { bg: "Наличен", en: "In Stock", ru: "В наличии", ua: "В наявності" },
    "Ограничена наличност": { bg: "Ограничена наличност", en: "Limited Stock", ru: "Ограниченно", ua: "Обмежено" },
    Неналичен: { bg: "Неналичен", en: "Out of Stock", ru: "Нет в наличии", ua: "Немає в наявності" },
  };

  const availColors: Record<string, string> = {
    Наличен: "bg-success-light text-success",
    "Ограничена наличност": "bg-warning-light text-warning",
    Неналичен: "bg-danger-light text-danger",
  };

  // Count available highlight specs for grid sizing
  const hasHighlightBtu = !!product.btu;
  const hasHighlightArea = !!product.area_m2;
  const hasHighlightEnergy = !!product.energy_class;
  const hasHighlightNoise = !!product.noise_db_indoor;
  const highlightCount = [hasHighlightBtu, hasHighlightArea, hasHighlightEnergy, hasHighlightNoise].filter(Boolean).length;

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 sm:pb-28 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4 sm:mb-5" role="navigation" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-0">
            <li className="flex items-center">
              <a href={`/${locale}`} className="hover:text-primary transition-colors py-1">
                {bcHome}
              </a>
              <span className="mx-1.5 sm:mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <a href={`/${locale}/klimatici`} className="hover:text-primary transition-colors py-1">
                {bcCatalog}
              </a>
              <span className="mx-1.5 sm:mx-2" aria-hidden="true">/</span>
            </li>
            {categoryGroupName && categoryGroupName !== categoryName && (
              <li className="flex items-center">
                <span className="text-muted-foreground py-1">{categoryGroupName}</span>
                <span className="mx-1.5 sm:mx-2" aria-hidden="true">/</span>
              </li>
            )}
            {categoryName && (
              <li className="flex items-center">
                <span className="text-muted-foreground py-1">{categoryName}</span>
                <span className="mx-1.5 sm:mx-2" aria-hidden="true">/</span>
              </li>
            )}
            <li>
              <span className="text-foreground py-1" aria-current="page">{product.manufacturer}</span>
            </li>
          </ol>
        </nav>

        {/* ============================================================ */}
        {/* MAIN TWO-COLUMN LAYOUT                                       */}
        {/* Mobile order is controlled via order-* classes                */}
        {/* ============================================================ */}
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

            {/* 2. Product Title (h1) */}
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
              {displayTitle}
            </h1>

            {/* 3. Availability Badge (prominent) */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold ${
                  availColors[product.availability] || availColors["Неналичен"]
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    product.availability === "Наличен"
                      ? "bg-success animate-pulse"
                      : product.availability === "Ограничена наличност"
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                  aria-hidden="true"
                />
                {availLabels[product.availability]?.[locale] || product.availability}
                {product.stock_size && product.stock_size <= 5 && (
                  <span className="ml-1.5">
                    ({product.stock_size} {dictionary.common.pcs})
                  </span>
                )}
              </span>
            </div>

            {/* 4. Price Block (large, prominent) */}
            <div className="bg-muted rounded-xl p-4 sm:p-5 mb-4">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {priceBGN} {dictionary.common.currency.bgn}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  ({displayPrice.toFixed(2)} &euro;)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {instLabels.prefix}{" "}
                <span className="font-semibold text-foreground">
                  {installmentMonthly}
                </span>{" "}
                {instLabels.suffix}
              </p>
              {product.is_promo && product.price_promo > 0 && (
                <p className="text-sm text-danger font-semibold mt-1">
                  {dictionary.common.promoPrice}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {t?.priceVat}
              </p>
            </div>

            {/* 5. Key Specs Grid (2 columns, compact) */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {product.btu && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Zap className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.power || "BTU"}</p>
                    <p className="text-sm font-semibold leading-tight truncate">
                      {product.btu.toLocaleString()} BTU
                    </p>
                  </div>
                </div>
              )}
              {product.area_m2 && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Maximize className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.area}</p>
                    <p className="text-sm font-semibold leading-tight truncate">
                      {dictionary.common.upTo} {product.area_m2} {dictionary.common.sqm}
                    </p>
                  </div>
                </div>
              )}
              {product.energy_class && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Leaf className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.energyClass}</p>
                    <p className="text-sm font-semibold leading-tight">{product.energy_class}</p>
                  </div>
                </div>
              )}
              {product.noise_db_indoor && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Volume2 className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.noise}</p>
                    <p className="text-sm font-semibold leading-tight">{product.noise_db_indoor} dB</p>
                  </div>
                </div>
              )}
              {product.refrigerant && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <Snowflake className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.refrigerant}</p>
                    <p className="text-sm font-semibold leading-tight">{product.refrigerant}</p>
                  </div>
                </div>
              )}
              {product.warranty_months && (
                <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 bg-white border border-border rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">{t?.warranty}</p>
                    <p className="text-sm font-semibold leading-tight">
                      {product.warranty_months} {t?.months}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 6. 1-Click Order */}
            <OneClickOrder
              locale={locale}
              productId={product.id}
              productTitle={displayTitle}
            />

            {/* 7. Trust Block (between CTA and inquiry form) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.freeDelivery}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.professionalInstallation}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.warrantyLong}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-success-light/30">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{trust.freeConsultation}</span>
              </div>
            </div>

            {/* 8. Full Inquiry Form */}
            <div
              id="inquiry-form-section"
              className="bg-white border border-border rounded-xl p-4 sm:p-6"
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

        {/* ============================================================ */}
        {/* BELOW THE FOLD CONTENT                                       */}
        {/* ============================================================ */}

        {/* Product Highlights — large visual cards for key specs */}
        {highlightCount > 0 && (
          <section className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">
              {t?.highlights}
            </h2>
            <div
              className={`grid gap-3 sm:gap-4 ${
                highlightCount === 1
                  ? "grid-cols-1"
                  : highlightCount === 2
                  ? "grid-cols-2"
                  : highlightCount === 3
                  ? "grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-4"
              }`}
            >
              {hasHighlightBtu && (
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-light to-white border border-primary/10 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {product.btu.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    BTU — {t?.power || "BTU"}
                  </p>
                </div>
              )}
              {hasHighlightArea && (
                <div className="relative overflow-hidden bg-gradient-to-br from-accent-light to-white border border-accent/10 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-accent" aria-hidden="true" />
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {dictionary.common.upTo} {product.area_m2}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {dictionary.common.sqm} — {t?.area}
                  </p>
                </div>
              )}
              {hasHighlightEnergy && (
                <div className="relative overflow-hidden bg-gradient-to-br from-success-light to-white border border-success/10 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-success" aria-hidden="true" />
                  </div>
                  <span
                    className={`inline-block text-base sm:text-xl font-extrabold px-3 sm:px-4 py-1 rounded-full ${getEnergyClassColor(
                      product.energy_class
                    )}`}
                  >
                    {product.energy_class}
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {t?.energyClass}
                  </p>
                </div>
              )}
              {hasHighlightNoise && (
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" aria-hidden="true" />
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {product.noise_db_indoor} <span className="text-sm sm:text-lg font-bold">dB</span>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {t?.noiseLevel || t?.noise}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

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

        {/* Similar Products */}
        <SimilarProducts
          currentProductId={product.id}
          categoryId={product.category_id}
          manufacturer={product.manufacturer}
          locale={locale}
        />
      </div>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA
        locale={locale}
        priceBGN={priceBGN}
        phoneNumber={PHONE_NUMBER}
      />
    </>
  );
}
