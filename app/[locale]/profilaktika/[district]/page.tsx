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
  ShieldCheck,
  Compass,
  CalendarClock,
} from "lucide-react";
import { PROFILAKTIKA_BGN, bgnToEur } from "@/lib/pricing";
import { DISTRICTS, getDistrict, type Locale } from "@/lib/districts";
import { getProfilaktikaContent, PROFILAKTIKA_BY_DISTRICT } from "@/lib/profilaktika-districts";

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
const DATE_PUBLISHED = "2026-05-23";
const DATE_MODIFIED = "2026-05-23";

export function generateStaticParams() {
  const slugs = Object.keys(PROFILAKTIKA_BY_DISTRICT);
  return slugs.flatMap((slug) =>
    SUPPORTED_LOCALES.map((l) => ({ locale: l, district: slug }))
  );
}

function pickLocale(raw: string): Locale {
  return (SUPPORTED_LOCALES as string[]).includes(raw) ? (raw as Locale) : "bg";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, district: districtSlug } = await params;
  const locale = pickLocale(rawLocale);
  const c = getProfilaktikaContent(districtSlug, locale);
  if (!c) return {};

  const languages: Record<string, string> = {};
  const hreflangMap: Record<Locale, string> = { bg: "bg", en: "en", ru: "ru", ua: "uk" };
  for (const l of SUPPORTED_LOCALES) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/profilaktika/${districtSlug}`;
  }
  languages["x-default"] = `${SITE_URL}/bg/profilaktika/${districtSlug}`;

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/profilaktika/${districtSlug}`,
      languages,
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${SITE_URL}/${locale}/profilaktika/${districtSlug}`,
      type: "website",
      locale: locale === "bg" ? "bg_BG" : locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : "uk_UA",
    },
  };
}

function buildFaq(locale: Locale, districtName: string) {
  switch (locale) {
    case "en":
      return [
        { q: `Do you do AC maintenance in ${districtName}?`, a: `Yes — ${districtName} is part of our daily service area in Varna. We arrive within 30–60 minutes when booked before noon.` },
        { q: `How much does AC maintenance cost in ${districtName}?`, a: `Standard maintenance — €42 (82 BGN) incl. VAT per unit. Full service with disassembly — €82 (160 BGN). Same rate as anywhere in Varna, no surcharge for ${districtName}.` },
        { q: "How long does maintenance take?", a: "Standard service — 60–90 minutes per unit. Full service with disassembly — up to 2 hours." },
        { q: "How often should I service my AC?", a: "Once a year for residential use; twice a year for offices, restaurants, or homes with pets. Best months: March and October." },
        { q: "Warranty?", a: "We guarantee the service workmanship for 6 months. If a problem appears within that period related to what we cleaned, we fix it free." },
      ];
    case "ru":
      return [
        { q: `Делаете профилактику в ${districtName}?`, a: `Да — ${districtName} входит в ежедневную зону обслуживания по Варне. Приезжаем за 30–60 минут при заявке до обеда.` },
        { q: `Сколько стоит профилактика в ${districtName}?`, a: `Стандартная профилактика — 42 € (82 лв.) с НДС за аппарат. Полный сервис с разбором — 82 € (160 лв.). Тариф такой же, как везде по Варне.` },
        { q: "Сколько времени занимает?", a: "Стандартная профилактика — 60–90 минут на аппарат. Полный сервис с разбором — до 2 часов." },
        { q: "Как часто нужна профилактика?", a: "Раз в год для дома; дважды в год для офисов, ресторанов или дома с питомцем. Лучшие месяцы: март и октябрь." },
        { q: "Гарантия?", a: "На работы профилактики — 6 месяцев. Если в этот срок появится проблема в обслуженном узле, исправим бесплатно." },
      ];
    case "ua":
      return [
        { q: `Робите профілактику в ${districtName}?`, a: `Так — ${districtName} входить у щоденну зону обслуговування по Варні. Приїжджаємо за 30–60 хв при заявці до обіду.` },
        { q: `Скільки коштує профілактика в ${districtName}?`, a: `Стандартна профілактика — 42 € (82 лв.) з ПДВ за апарат. Повний сервіс з розбиранням — 82 € (160 лв.).` },
        { q: "Скільки часу займає?", a: "Стандартна — 60–90 хв на апарат. Повний сервіс з розбиранням — до 2 годин." },
        { q: "Як часто потрібна?", a: "Раз на рік для дому; двічі на рік для офісів, ресторанів або дому з тваринами. Найкращі місяці: березень і жовтень." },
        { q: "Гарантія?", a: "На роботи профілактики — 6 місяців. Якщо у цей термін з'явиться проблема в обслугованому вузлі — виправимо безкоштовно." },
      ];
    default:
      return [
        { q: `Правите ли профилактика в ${districtName}?`, a: `Да — ${districtName} е част от ежедневния ни район във Варна. Идваме за 30–60 минути при заявка преди обяд.` },
        { q: `Колко струва профилактиката в ${districtName}?`, a: `Стандартна профилактика — 42 € (82 лв.) с ДДС за уред. Пълен сервиз с разглобяване — 82 € (160 лв.). Без допълнителни такси за ${districtName}.` },
        { q: "Колко време отнема?", a: "Стандартна профилактика — 60–90 минути за един уред. Пълен сервиз с разглобяване — до 2 часа." },
        { q: "Колко често е необходима?", a: "Веднъж годишно за дома; два пъти годишно за офиси, ресторанти или дом с домашен любимец. Най-добрите месеци: март и октомври." },
        { q: "Гаранция?", a: "За работата по профилактиката — 6 месеца. Ако в този срок се появи проблем в обслужения възел, отстраняваме безплатно." },
      ];
  }
}

function tr(locale: Locale, key: string): string {
  const map: Record<string, Record<Locale, string>> = {
    crumbHome: { bg: "Начало", en: "Home", ru: "Главная", ua: "Головна" },
    crumbProfilaktika: { bg: "Профилактика", en: "Maintenance", ru: "Профилактика", ua: "Профілактика" },
    badge: { bg: "Свободни слотове този ден", en: "Slots open today", ru: "Свободные слоты сегодня", ua: "Вільні слоти сьогодні" },
    landmarksTitle: { bg: "Какво обслужваме в района", en: "What we cover here", ru: "Что обслуживаем в районе", ua: "Що обслуговуємо в районі" },
    jobsTitle: { bg: "Какво обикновено правим тук", en: "Typical jobs here", ru: "Что обычно делаем здесь", ua: "Що зазвичай робимо тут" },
    tipTitle: { bg: "Локален технически съвет", en: "Local technical tip", ru: "Локальный технический совет", ua: "Локальна технічна порада" },
    priceTitle: { bg: "Цени за профилактика", en: "Maintenance prices", ru: "Цены на профилактику", ua: "Ціни на профілактику" },
    priceSubtitle: {
      bg: "Фиксирани цени с включени материали. Без скрити такси.",
      en: "Fixed prices, materials included. No hidden fees.",
      ru: "Фиксированные цены с материалами. Без скрытых платежей.",
      ua: "Фіксовані ціни з матеріалами. Без прихованих платежів.",
    },
    tierStandard: { bg: "Стандартна профилактика (1 уред)", en: "Standard maintenance (1 unit)", ru: "Стандартная профилактика (1 аппарат)", ua: "Стандартна профілактика (1 апарат)" },
    tierFull: { bg: "Пълен сервиз с разглобяване", en: "Full service with disassembly", ru: "Полный сервис с разбором", ua: "Повний сервіс з розбиранням" },
    tierSub: { bg: "Абонамент 3 г. (7–14K BTU)", en: "3-yr subscription (7–14K BTU)", ru: "Абонемент 3 г. (7–14K BTU)", ua: "Абонемент 3 р. (7–14K BTU)" },
    noteTitle: { bg: "Кога е най-добре", en: "Best timing", ru: "Когато лучше", ua: "Коли краще" },
    noteText: {
      bg: "Най-добре март–април (преди жегата) или октомври–ноември (преди отоплителния сезон). Цените с ДДС, фиксирани без скрити такси.",
      en: "Best in March–April (before heat) or October–November (before heating). Prices include VAT, fixed, no hidden fees.",
      ru: "Лучше всего март–апрель (до жары) или октябрь–ноябрь (до отопления). Цены с НДС, фиксированные.",
      ua: "Найкраще березень–квітень (до спеки) або жовтень–листопад (до опалення). Ціни з ПДВ, фіксовані.",
    },
    ctaTitle: { bg: "Готови ли сте за профилактика?", en: "Ready to book?", ru: "Готовы записаться?", ua: "Готові записатися?" },
    ctaDesc: {
      bg: "Безплатна консултация и точна оферта в рамките на 30 минути.",
      en: "Free consultation and exact quote within 30 minutes.",
      ru: "Бесплатная консультация и точная смета за 30 минут.",
      ua: "Безкоштовна консультація і точна оцінка за 30 хвилин.",
    },
    ctaButton: { bg: "Изпратете заявка", en: "Send request", ru: "Отправить заявку", ua: "Надіслати запит" },
    seeAllDistricts: { bg: "Профилактика в други квартали", en: "Maintenance in other districts", ru: "Профилактика в других районах", ua: "Профілактика в інших районах" },
    seeProfilaktika: { bg: "Всичко за профилактика", en: "All about maintenance", ru: "Всё о профилактике", ua: "Все про профілактику" },
    seeMontazh: { bg: "Монтаж във Варна", en: "Installation in Varna", ru: "Монтаж в Варне", ua: "Монтаж у Варні" },
  };
  return map[key]?.[locale] ?? map[key]?.bg ?? key;
}

export default async function ProfilaktikaDistrictPage({ params }: PageProps) {
  const { locale: rawLocale, district: districtSlug } = await params;
  const locale = pickLocale(rawLocale);
  const districtBase = getDistrict(districtSlug);
  const c = getProfilaktikaContent(districtSlug, locale);
  if (!districtBase || !c) notFound();

  const baseContent = districtBase.content[locale];
  const dict = await getDictionary(locale);
  const common = dict.common;

  const faqItems = buildFaq(locale, baseContent.name);

  const inLanguageMap: Record<Locale, string> = {
    bg: "bg-BG", en: "en-GB", ru: "ru-RU", ua: "uk-UA",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: inLanguageMap[locale],
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const singleEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.single));
  const fullEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.fullService));
  const subSmallEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.subscription3y_small));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      locale === "bg"
        ? "Профилактика на климатици"
        : locale === "en"
        ? "AC preventive maintenance"
        : locale === "ru"
        ? "Профилактика кондиционеров"
        : "Профілактика кондиціонерів",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "Place",
      name: `${baseContent.name}, Варна`,
      ...(districtBase.geo && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: districtBase.geo.lat,
          longitude: districtBase.geo.lng,
        },
      }),
    },
    name: c.metaTitle,
    description: c.metaDescription,
    url: `${SITE_URL}/${locale}/profilaktika/${districtSlug}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(singleEur),
      highPrice: String(fullEur),
      offerCount: "2",
      offers: [
        {
          "@type": "Offer",
          name: tr(locale, "tierStandard"),
          priceCurrency: "EUR",
          price: String(singleEur),
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "EUR", price: String(singleEur), valueAddedTaxIncluded: true },
        },
        {
          "@type": "Offer",
          name: tr(locale, "tierFull"),
          priceCurrency: "EUR",
          price: String(fullEur),
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "EUR", price: String(fullEur), valueAddedTaxIncluded: true },
        },
      ],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tr(locale, "crumbHome"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: tr(locale, "crumbProfilaktika"), item: `${SITE_URL}/${locale}/profilaktika` },
      { "@type": "ListItem", position: 3, name: baseContent.name, item: `${SITE_URL}/${locale}/profilaktika/${districtSlug}` },
    ],
  };

  const otherSlugs = Object.keys(PROFILAKTIKA_BY_DISTRICT).filter((s) => s !== districtSlug).slice(0, 7);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">{tr(locale, "crumbHome")}</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href={`/${locale}/profilaktika`} className="hover:text-white/80">{tr(locale, "crumbProfilaktika")}</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{baseContent.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <CalendarClock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
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

      {/* Landmarks (reused from base district) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
            {tr(locale, "landmarksTitle")} — {baseContent.name}
          </h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {baseContent.landmarks.map((name) => (
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

      {/* Price tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-6 sm:mb-8 flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {tr(locale, "priceTitle")} — {baseContent.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {tr(locale, "priceSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: tr(locale, "tierStandard"), priceEur: singleEur, priceBgn: PROFILAKTIKA_BGN.single },
            { label: tr(locale, "tierFull"), priceEur: fullEur, priceBgn: PROFILAKTIKA_BGN.fullService },
            { label: tr(locale, "tierSub"), priceEur: subSmallEur, priceBgn: PROFILAKTIKA_BGN.subscription3y_small },
          ].map((tier) => (
            <div key={tier.label} className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6">
              <p className="text-sm text-muted-foreground mb-2">{tier.label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">
                {tier.priceEur} <span className="text-base font-semibold text-muted-foreground">€</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                {tier.priceBgn} лв. с ДДС
              </p>
            </div>
          ))}
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
            FAQ — {baseContent.name}
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
          {otherSlugs.map((slug) => {
            const d = DISTRICTS.find((x) => x.slug === slug);
            if (!d) return null;
            return (
              <li key={slug}>
                <Link
                  href={`/${locale}/profilaktika/${slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
                  {d.content[locale].name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/profilaktika`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            {tr(locale, "seeProfilaktika")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link
            href={`/${locale}/montazh/${districtSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            {tr(locale, "seeMontazh")} — {baseContent.name}
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
                {tr(locale, "ctaTitle")} {baseContent.name}?
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
