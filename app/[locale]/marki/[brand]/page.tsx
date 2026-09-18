import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import ProductCard from "@/components/catalog/ProductCard";
import { BRANDS, getBrand, type BrandLocale } from "@/lib/brands";
import { getInstallationEur } from "@/lib/pricing";

interface PageProps {
  params: Promise<{ locale: string; brand: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brand: b.slug }));
}

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

const PRODUCT_COLUMNS =
  "id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor, refrigerant, stock_size, features, category_id, warranty_months";

const UI: Record<
  BrandLocale,
  {
    home: string;
    brands: string;
    stats: (n: number, min: number, max: number, btuMin: number, btuMax: number) => string;
    warranty: (months: number) => string;
    seriesTitle: string;
    whyTitle: string;
    productsTitle: (name: string) => string;
    productsSubtitle: (n: number) => string;
    allModels: string;
    installTitle: string;
    installDesc: string;
    installCta: string;
    maintenanceTitle: string;
    maintenanceDesc: string;
    maintenanceCta: string;
    faqTitle: string;
    otherBrands: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaPrimary: string;
    ctaSecondary: string;
  }
> = {
  bg: {
    home: "Начало",
    brands: "Марки",
    stats: (n, min, max, btuMin, btuMax) => `${n} модела на склад · от ${min} € до ${max} € · ${btuMin / 1000}–${btuMax / 1000}k BTU`,
    warranty: (m) => `гаранция ${Math.round(m / 12)} г.`,
    seriesTitle: "Серии, които държим на склад във Варна",
    whyTitle: "Защо клиентите ни избират тази марка",
    productsTitle: (name) => `Всички модели ${name} с цени`,
    productsSubtitle: (n) => `${n} модела с актуална наличност. Цената с монтаж е на страницата на всеки модел.`,
    allModels: "Целият каталог",
    installTitle: "Монтаж от 190 € с ДДС",
    installDesc: "Собствен екип, 3 м трасе, всички материали, вакуумиране и пуск. Обикновено до 3 дни след заявка.",
    installCta: "Как протича монтажът",
    maintenanceTitle: "Профилактика от 42 €",
    maintenanceDesc: "Годишното почистване запазва гаранцията на производителя и до 30 % от разхода на ток.",
    maintenanceCta: "Профилактика на климатик",
    faqTitle: "Често задавани въпроси",
    otherBrands: "Други марки във Варна",
    ctaTitle: "Не сте сигурни кой модел?",
    ctaDesc: "Кажете ни квадратурата и изложението на стаята — ще предложим 2–3 модела с точна цена с монтаж.",
    ctaPrimary: "Безплатна консултация",
    ctaSecondary: "Калкулатор BTU",
  },
  en: {
    home: "Home",
    brands: "Brands",
    stats: (n, min, max, btuMin, btuMax) => `${n} models in stock · €${min} to €${max} · ${btuMin / 1000}–${btuMax / 1000}k BTU`,
    warranty: (m) => `${Math.round(m / 12)}-year warranty`,
    seriesTitle: "Series we keep in stock in Varna",
    whyTitle: "Why our customers pick this brand",
    productsTitle: (name) => `All ${name} models with prices`,
    productsSubtitle: (n) => `${n} models with live stock. Installed price is on each model's page.`,
    allModels: "Full catalog",
    installTitle: "Installation from €190 incl. VAT",
    installDesc: "Own crew, 3 m pipe run, all materials, vacuum and commissioning. Usually within 3 days of the order.",
    installCta: "How installation works",
    maintenanceTitle: "Maintenance from €42",
    maintenanceDesc: "Annual cleaning keeps the manufacturer warranty and up to 30 % of the electricity bill.",
    maintenanceCta: "AC maintenance",
    faqTitle: "Frequently asked questions",
    otherBrands: "Other brands in Varna",
    ctaTitle: "Not sure which model?",
    ctaDesc: "Tell us the room size and exposure — we will suggest 2–3 models with an exact installed price.",
    ctaPrimary: "Free consultation",
    ctaSecondary: "BTU calculator",
  },
  ru: {
    home: "Главная",
    brands: "Марки",
    stats: (n, min, max, btuMin, btuMax) => `${n} моделей на складе · от ${min} € до ${max} € · ${btuMin / 1000}–${btuMax / 1000}k BTU`,
    warranty: (m) => `гарантия ${Math.round(m / 12)} г.`,
    seriesTitle: "Серии, которые держим на складе в Варне",
    whyTitle: "Почему клиенты выбирают эту марку",
    productsTitle: (name) => `Все модели ${name} с ценами`,
    productsSubtitle: (n) => `${n} моделей с актуальным наличием. Цена с монтажом — на странице каждой модели.`,
    allModels: "Весь каталог",
    installTitle: "Монтаж от 190 € с НДС",
    installDesc: "Своя бригада, 3 м трассы, все материалы, вакуумирование и запуск. Обычно в течение 3 дней после заявки.",
    installCta: "Как проходит монтаж",
    maintenanceTitle: "Профилактика от 42 €",
    maintenanceDesc: "Ежегодная чистка сохраняет гарантию производителя и до 30 % расхода электричества.",
    maintenanceCta: "Профилактика кондиционера",
    faqTitle: "Частые вопросы",
    otherBrands: "Другие марки в Варне",
    ctaTitle: "Не уверены, какая модель?",
    ctaDesc: "Назовите площадь и ориентацию комнаты — предложим 2–3 модели с точной ценой с монтажом.",
    ctaPrimary: "Бесплатная консультация",
    ctaSecondary: "Калькулятор BTU",
  },
  ua: {
    home: "Головна",
    brands: "Марки",
    stats: (n, min, max, btuMin, btuMax) => `${n} моделей на складі · від ${min} € до ${max} € · ${btuMin / 1000}–${btuMax / 1000}k BTU`,
    warranty: (m) => `гарантія ${Math.round(m / 12)} р.`,
    seriesTitle: "Серії, які тримаємо на складі у Варні",
    whyTitle: "Чому клієнти обирають цю марку",
    productsTitle: (name) => `Усі моделі ${name} з цінами`,
    productsSubtitle: (n) => `${n} моделей з актуальною наявністю. Ціна з монтажем — на сторінці кожної моделі.`,
    allModels: "Увесь каталог",
    installTitle: "Монтаж від 190 € з ПДВ",
    installDesc: "Власна бригада, 3 м траси, всі матеріали, вакуумування та запуск. Зазвичай протягом 3 днів після заявки.",
    installCta: "Як проходить монтаж",
    maintenanceTitle: "Профілактика від 42 €",
    maintenanceDesc: "Щорічне чищення зберігає гарантію виробника та до 30 % витрати електрики.",
    maintenanceCta: "Профілактика кондиціонера",
    faqTitle: "Часті запитання",
    otherBrands: "Інші марки у Варні",
    ctaTitle: "Не впевнені, яка модель?",
    ctaDesc: "Назвіть площу й орієнтацію кімнати — запропонуємо 2–3 моделі з точною ціною з монтажем.",
    ctaPrimary: "Безкоштовна консультація",
    ctaSecondary: "Калькулятор BTU",
  },
};

function toLocale(locale: string): BrandLocale {
  return (["bg", "en", "ru", "ua"] as const).includes(locale as BrandLocale) ? (locale as BrandLocale) : "bg";
}

async function getBrandProducts(manufacturer: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("manufacturer", manufacturer)
    .eq("is_active", true)
    .eq("is_hidden", false)
    .order("btu", { ascending: true, nullsFirst: false })
    .order("price_client", { ascending: true });
  return data ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  const l = toLocale(locale);
  const t = brand.copy[l];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  const path = `/marki/${slug}`;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages: {
        bg: `${siteUrl}/bg${path}`,
        en: `${siteUrl}/en${path}`,
        ru: `${siteUrl}/ru${path}`,
        uk: `${siteUrl}/ua${path}`,
        "x-default": `${siteUrl}/bg${path}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${siteUrl}/${locale}${path}`,
      type: "website",
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { locale, brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const l = toLocale(locale);
  const t = brand.copy[l];
  const ui = UI[l];
  const dict = await getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  const products = await getBrandProducts(brand.manufacturer);

  const prices = products.map((p) => p.price_override || p.price_client).filter((n): n is number => typeof n === "number" && n > 0);
  const btus = products.map((p) => p.btu).filter((n): n is number => typeof n === "number" && n > 0);
  const minPrice = prices.length ? Math.round(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.round(Math.max(...prices)) : 0;
  const btuMin = btus.length ? Math.min(...btus) : 0;
  const btuMax = btus.length ? Math.max(...btus) : 0;
  const warrantyCounts = new Map<number, number>();
  for (const p of products) if (p.warranty_months) warrantyCounts.set(p.warranty_months, (warrantyCounts.get(p.warranty_months) || 0) + 1);
  const commonWarranty = [...warrantyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const cheapestInstalled = minPrice ? minPrice + getInstallationEur(btuMin || 9000) : 0;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const groupJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: t.h1,
    brand: { "@type": "Brand", name: brand.name },
    description: t.description,
    url: `${siteUrl}/${locale}/marki/${slug}`,
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: String(minPrice),
            highPrice: String(maxPrice),
            offerCount: String(products.length),
            availability: "https://schema.org/InStock",
            areaServed: { "@type": "City", name: "Варна" },
          },
        }
      : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.home, item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: ui.brands, item: `${siteUrl}/${locale}/brands` },
      { "@type": "ListItem", position: 3, name: brand.name, item: `${siteUrl}/${locale}/marki/${slug}` },
    ],
  };

  const otherBrands = BRANDS.filter((b) => b.slug !== slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(groupJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_60%)]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 mb-6" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">{ui.home}</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href={`/${locale}/brands`} className="hover:text-white/80">{ui.brands}</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{brand.name}</span>
          </nav>
          <div className="max-w-3xl">
            {commonWarranty && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{ui.warranty(commonWarranty)}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-5">{t.h1}</h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-4">{t.intro}</p>
            {products.length > 0 && (
              <p className="text-sm text-white/60 mb-8">{ui.stats(products.length, minPrice, maxPrice, btuMin, btuMax)}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors"
              >
                {ui.productsTitle(brand.name)}
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href={`/${locale}/kontakti`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {ui.ctaPrimary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Series + Why */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">{ui.seriesTitle}</h2>
            <ul role="list" className="space-y-3">
              {t.series.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">{ui.whyTitle}</h2>
            <div className="space-y-4">
              {t.why.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section id="products" className="bg-muted/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{ui.productsTitle(brand.name)}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">{ui.productsSubtitle(products.length)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} currency="EUR" dictionary={dict} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                {ui.allModels}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Install + Maintenance */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{ui.installTitle}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
              {ui.installDesc}
              {cheapestInstalled ? ` ${brand.name}: ${cheapestInstalled} €+` : ""}
            </p>
            <Link href={`/${locale}/montazh`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              {ui.installCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{ui.maintenanceTitle}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">{ui.maintenanceDesc}</p>
            <Link href={`/${locale}/profilaktika`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              {ui.maintenanceCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">{ui.faqTitle}</h2>
          <div className="space-y-3">
            {t.faq.map((item) => (
              <details key={item.q} className="group bg-white rounded-xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-start justify-between gap-4 cursor-pointer">
                  <h3 className="font-semibold text-foreground pr-2">{item.q}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other brands */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5">{ui.otherBrands}</h2>
          <ul role="list" className="flex flex-wrap gap-2">
            <li>
              <Link href={`/${locale}/daikin-varna`} className="inline-flex px-3 py-1.5 rounded-full border border-border bg-muted text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">Daikin</Link>
            </li>
            <li>
              <Link href={`/${locale}/mitsubishi-varna`} className="inline-flex px-3 py-1.5 rounded-full border border-border bg-muted text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">Mitsubishi Electric</Link>
            </li>
            {otherBrands.map((b) => (
              <li key={b.slug}>
                <Link href={`/${locale}/marki/${b.slug}`} className="inline-flex px-3 py-1.5 rounded-full border border-border bg-muted text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">{b.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{ui.ctaTitle}</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">{ui.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/kontakti`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors">
              {ui.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${locale}/kalkulator-btu`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors">
              {ui.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
