import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import SpecsTable from "@/components/product/SpecsTable";
import InquiryForm from "@/components/forms/InquiryForm";
import OneClickOrder from "@/components/product/OneClickOrder";
import SimilarProducts from "@/components/product/SimilarProducts";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import {
  Zap,
  Maximize,
  Volume2,
  Snowflake,
  ShieldCheck,
  Thermometer,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

// Breadcrumb labels from dictionary
const breadcrumbLabels: Record<string, { home: string; catalog: string }> = {
  bg: { home: "Начало", catalog: "Климатици" },
  en: { home: "Home", catalog: "Air Conditioners" },
  ru: { home: "Главная", catalog: "Кондиционеры" },
  ua: { home: "Головна", catalog: "Кондиціонери" },
};

// Installment labels
const installmentLabels: Record<string, { prefix: string; suffix: string }> = {
  bg: { prefix: "или 12 x", suffix: "лв./мес." },
  en: { prefix: "or 12 x", suffix: "BGN/mo." },
  ru: { prefix: "или 12 x", suffix: "лв./мес." },
  ua: { prefix: "або 12 x", suffix: "лв./міс." },
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const dictionary = await getDictionary(locale);
  const t = dictionary.product;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const bc = breadcrumbLabels[locale] || breadcrumbLabels.bg;

  const displayTitle = product.title_override || product.title;
  const displayDescription =
    product.description_override || product.description;
  const displayPrice = product.price_override || product.price_client;
  const priceBGN = (displayPrice * EUR_TO_BGN).toFixed(0);
  const installmentMonthly = Math.ceil((displayPrice * EUR_TO_BGN) / 12);
  const instLabels = installmentLabels[locale] || installmentLabels.bg;

  const jsonLd = generateProductJsonLd(product, locale, siteUrl);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      {
        name: bc.home,
        url: `/${locale}`,
      },
      {
        name: bc.catalog,
        url: `/${locale}/klimatici`,
      },
      { name: displayTitle, url: `/${locale}/klimatici/${slug}` },
    ],
    siteUrl
  );

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <a href={`/${locale}`} className="hover:text-primary">
            {bc.home}
          </a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/klimatici`} className="hover:text-primary">
            {bc.catalog}
          </a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.manufacturer}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Left: Gallery */}
          <ProductGallery
            images={product.gallery || []}
            title={displayTitle}
          />

          {/* Right: Info */}
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              {product.manufacturer}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">
              {displayTitle}
            </h1>

            {/* Availability */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  availColors[product.availability] || availColors["Неналичен"]
                }`}
              >
                {availLabels[product.availability]?.[locale] || product.availability}
                {product.stock_size && product.stock_size <= 5 && (
                  <span className="ml-1.5">
                    ({product.stock_size}{" "}
                    {locale === "bg" ? "бр." : locale === "ru" ? "шт." : locale === "ua" ? "шт." : "pcs"})
                  </span>
                )}
              </span>
            </div>

            {/* Price */}
            <div className="bg-muted rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {priceBGN} лв.
                </span>
                <span className="text-lg text-muted-foreground">
                  ({displayPrice.toFixed(2)} &euro;)
                </span>
              </div>
              {/* Installment display */}
              <p className="text-sm text-muted-foreground mt-1.5">
                {instLabels.prefix}{" "}
                <span className="font-semibold text-foreground">
                  {installmentMonthly}
                </span>{" "}
                {instLabels.suffix}
              </p>
              {product.is_promo && product.price_promo > 0 && (
                <p className="text-sm text-danger font-medium mt-1">
                  {locale === "bg" ? "Промоционална цена!" : locale === "en" ? "Promo price!" : locale === "ru" ? "Акционная цена!" : "Акційна ціна!"}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {t?.priceVat || "Цената е с включен ДДС"}
              </p>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
              {product.btu && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <Zap className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">BTU</p>
                    <p className="text-sm font-semibold">
                      {product.btu.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {product.area_m2 && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <Maximize className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t?.area || "Area"}
                    </p>
                    <p className="text-sm font-semibold">
                      {locale === "en" ? `up to ${product.area_m2} sq.m` : `до ${product.area_m2} кв.м`}
                    </p>
                  </div>
                </div>
              )}
              {product.energy_class && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t?.energyClass || "Energy Class"}
                    </p>
                    <p className="text-sm font-semibold">
                      {product.energy_class}
                    </p>
                  </div>
                </div>
              )}
              {product.noise_db_indoor && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <Volume2 className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t?.noise || "Noise"}
                    </p>
                    <p className="text-sm font-semibold">
                      {product.noise_db_indoor} dB
                    </p>
                  </div>
                </div>
              )}
              {product.refrigerant && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <Snowflake className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t?.refrigerant || "Refrigerant"}
                    </p>
                    <p className="text-sm font-semibold">
                      {product.refrigerant}
                    </p>
                  </div>
                </div>
              )}
              {product.warranty_months && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t?.warranty || "Warranty"}
                    </p>
                    <p className="text-sm font-semibold">
                      {product.warranty_months}{" "}
                      {t?.months || "mo."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 1-Click Order — prominent, ABOVE the full form */}
            <OneClickOrder
              locale={locale}
              productId={product.id}
              productTitle={displayTitle}
            />

            {/* Inquiry form */}
            <div
              id="inquiry-form-section"
              className="bg-white border border-border rounded-xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                {dictionary.inquiry?.title || t?.inquiryButton || "Make an Inquiry"}
              </h2>
              <InquiryForm
                locale={locale}
                productId={product.id}
                productTitle={displayTitle}
                dictionary={dictionary}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {displayDescription && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t?.description || "Description"}
            </h2>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: displayDescription }}
            />
          </div>
        )}

        {/* Specs */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {t?.specifications || "Technical Specifications"}
          </h2>
          <SpecsTable features={product.features} locale={locale} />
        </div>

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
