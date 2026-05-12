import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Sparkles,
  Wrench,
  ShieldCheck,
  Compass,
} from "lucide-react";
import {
  INSTALLATION_TIERS,
  EXTRA_SERVICES_EUR,
  bgnToEur,
} from "@/lib/pricing";
import { DISTRICTS, getDistrict, type Locale } from "@/lib/districts";

interface PageProps {
  params: Promise<{ locale: string; district: string }>;
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

const SUPPORTED_LOCALES: Locale[] = ["bg", "en", "ru", "ua"];
const SITE_URL = "https://pesnopoets-clima.com";

export function generateStaticParams() {
  // Locale is also dynamic; Next.js will combine with parent's params.
  return DISTRICTS.flatMap((d) =>
    SUPPORTED_LOCALES.map((l) => ({ locale: l, district: d.slug }))
  );
}

function formatPowerLabel(maxBtu: number): string {
  const kw = (maxBtu * 0.000293).toFixed(1);
  return `≤ ${(maxBtu / 1000).toFixed(0)}K BTU (~${kw} kW)`;
}

function pickLocale(raw: string): Locale {
  return (SUPPORTED_LOCALES as string[]).includes(raw) ? (raw as Locale) : "bg";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, district: districtSlug } = await params;
  const locale = pickLocale(rawLocale);
  const d = getDistrict(districtSlug);
  if (!d) return {};
  const c = d.content[locale];

  const languages: Record<string, string> = {};
  const hreflangMap: Record<Locale, string> = { bg: "bg", en: "en", ru: "ru", ua: "uk" };
  for (const l of SUPPORTED_LOCALES) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/montazh/${districtSlug}`;
  }
  languages["x-default"] = `${SITE_URL}/bg/montazh/${districtSlug}`;

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/montazh/${districtSlug}`,
      languages,
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${SITE_URL}/${locale}/montazh/${districtSlug}`,
      type: "website",
      locale: locale === "bg" ? "bg_BG" : locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : "uk_UA",
    },
  };
}

// District-specific FAQ — short, locale-aware, dynamically inserts district name.
function buildFaq(locale: Locale, districtName: string) {
  switch (locale) {
    case "en":
      return [
        { q: `Do you install AC in ${districtName}?`, a: `Yes — ${districtName} is part of our regular daily service area in Varna. We arrive within 30–60 minutes when booked before noon.` },
        { q: `How much does AC installation cost in ${districtName}?`, a: `Standard install starts at €190 for units up to 14,000 BTU and €230 for up to 24,000 BTU. Price includes 3m line set, materials, vacuum, and commissioning. Same rate as anywhere in Varna — no extra fee for ${districtName}.` },
        { q: "Same-day installation?", a: "Yes, if you call before noon and the unit is in stock. Typical job takes 2–4 hours." },
        { q: "Do you bring your own materials?", a: "Yes. Copper pipe, cable, brackets, drainage hose, vacuum pump — everything. No mid-job runs to the shop." },
        { q: "Warranty?", a: "12 months on installation workmanship + manufacturer warranty on the unit (5 years compressor for Daikin & Mitsubishi)." },
      ];
    case "ru":
      return [
        { q: `Делаете монтаж в ${districtName}?`, a: `Да — ${districtName} входит в ежедневную зону обслуживания по Варне. Приезжаем за 30–60 минут при заявке до обеда.` },
        { q: `Сколько стоит монтаж в ${districtName}?`, a: `Стандартный монтаж — от 190 € для аппаратов до 14 000 BTU и от 230 € до 24 000 BTU. Цена включает 3 м трассы, материалы, вакуумирование и пусконаладку. Без доплат за ${districtName} — тариф такой же, как везде по Варне.` },
        { q: "Монтаж в день обращения?", a: "Да, если звонок до обеда и аппарат в наличии. Типовой монтаж — 2–4 часа." },
        { q: "Свои материалы?", a: "Да — медная труба, кабель, кронштейны, дренаж, вакуумный насос. Без отлучек в магазин." },
        { q: "Гарантия?", a: "12 месяцев на монтажные работы + заводская гарантия на аппарат (5 лет компрессор для Daikin и Mitsubishi)." },
      ];
    case "ua":
      return [
        { q: `Робите монтаж у ${districtName}?`, a: `Так — ${districtName} входить у щоденну зону обслуговування по Варні. Приїжджаємо за 30–60 хв при заявці до обіду.` },
        { q: `Скільки коштує монтаж у ${districtName}?`, a: `Стандартний монтаж — від 190 € до 14 000 BTU і від 230 € до 24 000 BTU. Ціна включає 3 м траси, матеріали, вакуумування і пусконалагодження. Без доплат за ${districtName}.` },
        { q: "Монтаж того ж дня?", a: "Так, якщо дзвінок до обіду і апарат у наявності. Типовий монтаж — 2–4 години." },
        { q: "Свої матеріали?", a: "Так — мідна труба, кабель, кронштейни, дренаж, вакуумний насос. Без відлучок у магазин." },
        { q: "Гарантія?", a: "12 місяців на монтажні роботи + заводська гарантія на апарат (5 років компресор для Daikin та Mitsubishi)." },
      ];
    default: // bg
      return [
        { q: `Правите ли монтаж в ${districtName}?`, a: `Да — ${districtName} е част от ежедневния ни район във Варна. Идваме за 30–60 минути при заявка преди обяд.` },
        { q: `Колко струва монтажът в ${districtName}?`, a: `Стандартен монтаж — от 190 € за уред до 14 000 BTU и от 230 € до 24 000 BTU. Цената включва 3 м трасе, материали, вакуумиране и пускане в експлоатация. Без допълнителни такси за ${districtName}.` },
        { q: "Монтаж в същия ден?", a: "Да, при обаждане преди обяд и наличност на уреда. Типичен монтаж — 2–4 часа." },
        { q: "Носите ли си материалите?", a: "Да — медна тръба, кабел, скоби, дренаж, вакуум-помпа. Без отскачания до магазина по средата на монтажа." },
        { q: "Гаранция?", a: "12 месеца за монтажа + заводска гаранция на уреда (5 г. на компресора за Daikin и Mitsubishi)." },
      ];
  }
}

function tr(locale: Locale, key: string): string {
  const map: Record<string, Record<Locale, string>> = {
    crumbHome: { bg: "Начало", en: "Home", ru: "Главная", ua: "Головна" },
    crumbMontazh: { bg: "Монтаж", en: "Installation", ru: "Монтаж", ua: "Монтаж" },
    badge: { bg: "Свободни слотове този ден", en: "Slots open today", ru: "Свободные слоты сегодня", ua: "Вільні слоти сьогодні" },
    landmarksTitle: { bg: "Какво включва районът", en: "What's in the district", ru: "Что входит в район", ua: "Що входить у район" },
    jobsTitle: { bg: "Какво обикновено правим тук", en: "Typical jobs here", ru: "Что обычно делаем здесь", ua: "Що зазвичай робимо тут" },
    tipTitle: { bg: "Локален технически съвет", en: "Local technical tip", ru: "Локальный технический совет", ua: "Локальна технічна порада" },
    priceTitle: { bg: "Цени за монтаж", en: "Installation prices", ru: "Цены на монтаж", ua: "Ціни на монтаж" },
    priceSubtitle: {
      bg: "Фиксирани цени с включени материали и пускане в експлоатация. Без скрити такси.",
      en: "Fixed prices, materials and commissioning included. No hidden fees.",
      ru: "Фиксированные цены с материалами и пусконаладкой. Без скрытых платежей.",
      ua: "Фіксовані ціни з матеріалами та пусконалагодженням. Без прихованих платежів.",
    },
    thPower: { bg: "Мощност", en: "Power", ru: "Мощность", ua: "Потужність" },
    thPrice: { bg: "Цена", en: "Price", ru: "Цена", ua: "Ціна" },
    thExtraPipe: { bg: "Доп. тръба", en: "Extra pipe", ru: "Доп. трубы", ua: "Дод. труба" },
    extrasTitle: { bg: "Допълнителни услуги", en: "Extras", ru: "Дополнительно", ua: "Додатково" },
    extraDismantleSmall: { bg: "Демонтаж до 14K BTU", en: "Dismantle up to 14K BTU", ru: "Демонтаж до 14K BTU", ua: "Демонтаж до 14K BTU" },
    extraDismantleLarge: { bg: "Демонтаж над 14K BTU", en: "Dismantle over 14K BTU", ru: "Демонтаж свыше 14K BTU", ua: "Демонтаж понад 14K BTU" },
    extraDiagnostic: { bg: "Диагностика", en: "Diagnostics", ru: "Диагностика", ua: "Діагностика" },
    extraInspection: { bg: "Оглед на място", en: "On-site inspection", ru: "Выезд для осмотра", ua: "Виїзд для огляду" },
    noteTitle: { bg: "Важно", en: "Important", ru: "Важно", ua: "Важливо" },
    noteText: {
      bg: "Цените са с ДДС. Точна оферта след оглед. При нестандартни условия (височина над 4м, твърди стени, дълга трасе) — възможна е доплата след съгласуване с клиента.",
      en: "Prices include VAT. Exact quote after inspection. Non-standard conditions (height over 4m, hard walls, long pipe run) may incur surcharge after client approval.",
      ru: "Цены с НДС. Точная смета после осмотра. Нестандартные условия (высота свыше 4 м, твёрдые стены, длинная трасса) — возможна доплата после согласования.",
      ua: "Ціни з ПДВ. Точна оцінка після огляду. Нестандартні умови (висота понад 4 м, тверді стіни, довга траса) — можлива доплата після узгодження.",
    },
    ctaTitle: { bg: "Готови ли сте за монтаж?", en: "Ready to book?", ru: "Готовы записаться?", ua: "Готові записатися?" },
    ctaDesc: {
      bg: "Свободни слотове този ден. Безплатна консултация и точна оферта в рамките на 30 минути.",
      en: "Open slots today. Free consultation and exact quote within 30 minutes.",
      ru: "Свободные слоты сегодня. Бесплатная консультация и точная смета за 30 минут.",
      ua: "Вільні слоти сьогодні. Безкоштовна консультація і точна оцінка за 30 хвилин.",
    },
    ctaButton: { bg: "Изпратете заявка", en: "Send request", ru: "Отправить заявку", ua: "Надіслати запит" },
    seeAllDistricts: { bg: "Други квартали на Варна", en: "Other Varna districts", ru: "Другие районы Варны", ua: "Інші райони Варни" },
    seeMontazh: { bg: "Всичко за монтажа", en: "All about installation", ru: "Всё о монтаже", ua: "Все про монтаж" },
    seeCatalog: { bg: "Вижте каталога с климатици", en: "Browse AC catalogue", ru: "Каталог кондиционеров", ua: "Каталог кондиціонерів" },
    crumbDistrict: { bg: "квартал", en: "district", ru: "район", ua: "район" },
    introTitle: { bg: "Защо ние", en: "Why us", ru: "Почему мы", ua: "Чому ми" },
  };
  return map[key]?.[locale] ?? map[key]?.bg ?? key;
}

export default async function MontazhDistrictPage({ params }: PageProps) {
  const { locale: rawLocale, district: districtSlug } = await params;
  const locale = pickLocale(rawLocale);
  const district = getDistrict(districtSlug);
  if (!district) notFound();

  const c = district.content[locale];
  const dict = await getDictionary(locale);
  const common = dict.common;

  const faqItems = buildFaq(locale, c.name);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: locale === "bg" ? "Монтаж на климатици" : locale === "en" ? "AC installation" : locale === "ru" ? "Монтаж кондиционеров" : "Монтаж кондиціонерів",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "Place",
      name: `${c.name}, Варна`,
      ...(district.geo && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: district.geo.lat,
          longitude: district.geo.lng,
        },
      }),
    },
    name: c.metaTitle,
    description: c.metaDescription,
    url: `${SITE_URL}/${locale}/montazh/${districtSlug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "190",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        price: "190",
        valueAddedTaxIncluded: true,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tr(locale, "crumbHome"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: tr(locale, "crumbMontazh"), item: `${SITE_URL}/${locale}/montazh` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE_URL}/${locale}/montazh/${districtSlug}` },
    ],
  };

  const otherDistricts = DISTRICTS.filter((d) => d.slug !== districtSlug).slice(0, 7);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {tr(locale, "crumbHome")}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href={`/${locale}/montazh`} className="hover:text-white/80">
              {tr(locale, "crumbMontazh")}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{c.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {tr(locale, "badge")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {c.metaTitle.split(" | ")[0]}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed">
              {c.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Landmarks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
            {tr(locale, "landmarksTitle")} — {c.name}
          </h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {c.landmarks.map((name) => (
            <li
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground"
            >
              <MapPin className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      </section>

      {/* Typical jobs + local tip */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
                  {tr(locale, "jobsTitle")}
                </h2>
              </div>
              <ul className="grid grid-cols-1 gap-3">
                {c.typicalJobs.map((j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 p-4 bg-white border border-border/60 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-foreground leading-relaxed">{j}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1.5">
                  {tr(locale, "tipTitle")}
                </h3>
                <p className="text-sm text-amber-900/90 leading-relaxed">{c.localTip}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Price table — reuses /montazh tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-6 sm:mb-8 flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {tr(locale, "priceTitle")} — {c.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {tr(locale, "priceSubtitle")}
            </p>
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-border rounded-2xl shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
          <table className="w-full">
            <thead className="bg-[#0a1628] text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  {tr(locale, "thPower")}
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  {tr(locale, "thPrice")}
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">
                  {tr(locale, "thExtraPipe")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INSTALLATION_TIERS.map((tier) => {
                const priceEur = Math.round(bgnToEur(tier.price));
                const extraEur = Math.round(bgnToEur(tier.extraPipePerM));
                return (
                  <tr key={tier.maxBtu} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-foreground font-medium">
                      {formatPowerLabel(tier.maxBtu)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className="text-base sm:text-lg font-extrabold text-foreground tabular-nums">
                        {priceEur}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">€</span>
                      <div className="sm:hidden text-[11px] text-muted-foreground mt-1">
                        +{extraEur} €/м
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {extraEur}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">€/м</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Extras */}
        <div className="mt-8 sm:mt-10">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
            {tr(locale, "extrasTitle")}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: tr(locale, "extraDismantleSmall"), price: EXTRA_SERVICES_EUR.dismantleSmall },
              { label: tr(locale, "extraDismantleLarge"), price: EXTRA_SERVICES_EUR.dismantleLarge },
              { label: tr(locale, "extraDiagnostic"), price: EXTRA_SERVICES_EUR.diagnostic },
              { label: tr(locale, "extraInspection"), price: EXTRA_SERVICES_EUR.inspection },
            ].map((it) => (
              <li key={it.label} className="flex items-baseline justify-between p-4 bg-white border border-border/60 rounded-xl">
                <span className="text-sm text-foreground pr-2">{it.label}</span>
                <span className="whitespace-nowrap">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    {Math.round(it.price)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">€</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Note */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">
              {tr(locale, "noteTitle")}
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              {tr(locale, "noteText")}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-10">
            FAQ — {c.name}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group bg-white border border-border/60 rounded-xl p-5 sm:p-6 [&[open]]:shadow-[0_4px_16px_rgb(0_0_0/0.04)]"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {item.q}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other districts internal linking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          {tr(locale, "seeAllDistricts")}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {otherDistricts.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/${locale}/montazh/${d.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
                {d.content[locale].name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/montazh`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            {tr(locale, "seeMontazh")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link
            href={`/${locale}/klimatici`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            {tr(locale, "seeCatalog")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {common?.authorizedDealer ?? "Authorized dealer"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {tr(locale, "ctaTitle")} {c.name}?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
                {tr(locale, "ctaDesc")}
              </p>
            </div>
            <Link
              href={`/${locale}/inquiry`}
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[var(--primary-dark)] font-semibold rounded-xl hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_14px_0_rgb(0_0_0/0.15)] min-h-[48px]"
            >
              {tr(locale, "ctaButton")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
