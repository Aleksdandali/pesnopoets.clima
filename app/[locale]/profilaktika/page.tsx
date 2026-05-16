import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Sparkles,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { PROFILAKTIKA_BGN, bgnToEur } from "@/lib/pricing";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";

interface PageProps {
  params: Promise<{ locale: string }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${dict.profilaktika.pageTitle} | ${dict.common.siteName}`,
    description: dict.profilaktika.pageSubtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/profilaktika`,
      languages: {
        bg: `${siteUrl}/bg/profilaktika`,
        en: `${siteUrl}/en/profilaktika`,
        ru: `${siteUrl}/ru/profilaktika`,
        uk: `${siteUrl}/ua/profilaktika`,
        "x-default": `${siteUrl}/bg/profilaktika`,
      },
    },
  };
}

const profilaktikaFaq: Record<string, { q: string; a: string }[]> = {
  bg: [
    { q: "Колко често е необходима профилактика на климатик?", a: "Препоръчваме веднъж годишно — най-добре пролетта, преди активното използване. При интензивна работа (офис, ресторант, домашен любимец) — два пъти годишно." },
    { q: "Какво включва стандартната профилактика?", a: "Пълно почистване на вътрешен и външен блок, измиване на филтри и радиатор, проверка на фреон и налягане, дезинфекция на дренажа и електрически контакт. Виждате веднага мръсотията, която се отделя." },
    { q: "Колко струва профилактика на климатик във Варна?", a: "Стандартна еднократна профилактика — 42 € (82 лв) за един уред. Пълен сервиз с разглобяване — 82 € (160 лв). Цената е фиксирана, без скрити такси." },
    { q: "Колко време отнема профилактиката?", a: "Стандартна профилактика — 60–90 минути за един уред. Пълен сервиз с разглобяване и измиване — до 2 часа." },
    { q: "Защо е важна редовната профилактика?", a: "Чистите филтри и радиатор намаляват сметката за ток с до 25%, удължават живота на климатика с години и предпазват от прах, бактерии и плесен във въздуха в дома." },
    { q: "Можете ли да дойдете в същия ден?", a: "Да, при заявка преди обяд — обикновено идваме същия ден. Покриваме всички квартали на Варна и областта в радиус до 30 км." },
    { q: "Кога е най-доброто време за профилактика?", a: "Април–май, преди активния летен сезон. Влажността от морския бриз във Варна (75%+) през лятото натоварва вътрешния блок, затова пролетна профилактика дава максимален ефект." },
    { q: "Какъв е рискът от пропусната профилактика?", a: "Запушени филтри увеличават разхода на ток с 20–25%, плесен в дренажа причинява неприятна миризма и алергии, а ниско налягане на фреона води до изгаряне на компресора (ремонт от 400 €+)." },
  ],
  en: [
    { q: "How often does an AC need maintenance?", a: "We recommend once a year — preferably in spring, before active use. For intensive operation (office, restaurant, pets) — twice a year." },
    { q: "What does standard maintenance include?", a: "Full cleaning of indoor and outdoor units, washing of filters and radiator, freon and pressure check, drainage disinfection and electrical inspection. You see the dirt that comes out immediately." },
    { q: "How much does AC maintenance cost in Varna?", a: "Standard one-off maintenance — €42 (82 BGN) for one unit. Full service with disassembly — €82 (160 BGN). Fixed price, no hidden fees." },
    { q: "How long does maintenance take?", a: "Standard maintenance — 60–90 minutes for one unit. Full service with disassembly and washing — up to 2 hours." },
    { q: "Why is regular maintenance important?", a: "Clean filters and radiator reduce electricity bills by up to 25%, extend AC lifespan by years and protect indoor air from dust, bacteria and mold." },
    { q: "Can you come the same day?", a: "Yes, when requested before noon — usually we come the same day. We cover all neighborhoods of Varna and the region within a 30 km radius." },
    { q: "When is the best time for AC maintenance?", a: "April–May, before the active summer season. The humidity from Varna's sea breeze (75%+) in summer strains the indoor unit, so spring maintenance delivers maximum benefit." },
    { q: "What's the risk of skipping maintenance?", a: "Clogged filters increase electricity use by 20–25%, mold in drainage causes bad odor and allergies, and low refrigerant pressure leads to compressor burnout (repair from €400+)." },
  ],
  ru: [
    { q: "Как часто нужна профилактика кондиционера?", a: "Рекомендуем раз в год — лучше весной, до активного использования. При интенсивной работе (офис, ресторан, домашние животные) — два раза в год." },
    { q: "Что входит в стандартную профилактику?", a: "Полная чистка внутреннего и внешнего блоков, мойка фильтров и радиатора, проверка фреона и давления, дезинфекция дренажа и электрического контакта. Вы сразу видите грязь, которая выходит." },
    { q: "Сколько стоит профилактика кондиционера в Варне?", a: "Стандартная разовая профилактика — 42 € (82 лв) за один блок. Полный сервис с разборкой — 82 € (160 лв). Цена фиксированная, без скрытых доплат." },
    { q: "Сколько времени занимает профилактика?", a: "Стандартная профилактика — 60–90 минут на один блок. Полный сервис с разборкой и мойкой — до 2 часов." },
    { q: "Почему важна регулярная профилактика?", a: "Чистые фильтры и радиатор снижают счёт за электричество до 25%, продлевают срок службы кондиционера на годы и защищают воздух дома от пыли, бактерий и плесени." },
    { q: "Можете приехать в тот же день?", a: "Да, при заявке до обеда — обычно приезжаем в тот же день. Покрываем все районы Варны и область в радиусе до 30 км." },
    { q: "Когда лучшее время для профилактики?", a: "Апрель–май, до активного летнего сезона. Влажность от морского бриза в Варне (75%+) летом нагружает внутренний блок, поэтому весенняя профилактика даёт максимальный эффект." },
    { q: "Чем опасен пропуск профилактики?", a: "Забитые фильтры увеличивают расход тока на 20–25%, плесень в дренаже вызывает запах и аллергию, а низкое давление фреона приводит к сгоранию компрессора (ремонт от 400 €+)." },
  ],
  ua: [
    { q: "Як часто потрібна профілактика кондиціонера?", a: "Рекомендуємо раз на рік — краще навесні, перед активним використанням. При інтенсивній роботі (офіс, ресторан, домашні тварини) — двічі на рік." },
    { q: "Що входить у стандартну профілактику?", a: "Повне чищення внутрішнього та зовнішнього блоків, миття фільтрів і радіатора, перевірка фреону й тиску, дезінфекція дренажу та електричного контакту. Ви одразу бачите бруд, який виходить." },
    { q: "Скільки коштує профілактика кондиціонера у Варні?", a: "Стандартна разова профілактика — 42 € (82 лв) за один блок. Повний сервіс з розбиранням — 82 € (160 лв). Ціна фіксована, без прихованих доплат." },
    { q: "Скільки часу займає профілактика?", a: "Стандартна профілактика — 60–90 хвилин на один блок. Повний сервіс з розбиранням і миттям — до 2 годин." },
    { q: "Чому важлива регулярна профілактика?", a: "Чисті фільтри й радіатор знижують рахунок за електрику на 25%, продовжують термін служби кондиціонера на роки та захищають повітря вдома від пилу, бактерій і плісняви." },
    { q: "Чи можете приїхати того ж дня?", a: "Так, при заявці до обіду — зазвичай приїздимо того ж дня. Обслуговуємо всі райони Варни та область у радіусі до 30 км." },
    { q: "Коли найкращий час для профілактики?", a: "Квітень–травень, до активного літнього сезону. Вологість від морського бризу у Варні (75%+) влітку навантажує внутрішній блок, тому весняна профілактика дає максимальний ефект." },
    { q: "Чим небезпечний пропуск профілактики?", a: "Забиті фільтри збільшують витрату струму на 20–25%, пліснява у дренажі викликає запах і алергію, а низький тиск фреону призводить до згорання компресора (ремонт від 400 €+)." },
  ],
};

const faqHeadings: Record<string, { title: string; subtitle: string }> = {
  bg: { title: "Често задавани въпроси", subtitle: "Бързи отговори за цени, периодичност, симптоми и какво включва профилактиката." },
  en: { title: "Frequently asked questions", subtitle: "Quick answers about pricing, frequency, warning signs and what maintenance includes." },
  ru: { title: "Частые вопросы", subtitle: "Быстрые ответы о ценах, периодичности, симптомах и что входит в профилактику." },
  ua: { title: "Часті запитання", subtitle: "Швидкі відповіді про ціни, періодичність, симптоми та що входить у профілактику." },
};

const includedLead: Record<string, string> = {
  bg: "Стандартната профилактика на климатик във Варна обхваща пълно почистване на вътрешен и външен блок, измиване на филтри и радиатор, проверка на фреон и налягане, дезинфекция на дренажа и електрически контрол — обикновено 60–90 минути на уред, цена от 42 € (82 лв).",
  en: "Standard AC maintenance in Varna covers full cleaning of indoor and outdoor units, washing of filters and radiator, freon and pressure check, drainage disinfection and electrical inspection — typically 60–90 minutes per unit, price from €42 (82 BGN).",
  ru: "Стандартная профилактика кондиционера в Варне охватывает полную чистку внутреннего и внешнего блоков, мойку фильтров и радиатора, проверку фреона и давления, дезинфекцию дренажа и электрический контроль — обычно 60–90 минут на блок, цена от 42 € (82 лв).",
  ua: "Стандартна профілактика кондиціонера у Варні охоплює повне чищення внутрішнього та зовнішнього блоків, миття фільтрів і радіатора, перевірку фреону та тиску, дезінфекцію дренажу та електричний контроль — зазвичай 60–90 хвилин на блок, ціна від 42 € (82 лв).",
};

export default async function ProfilaktikaPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.profilaktika;
  const common = dict.common;

  const faqItems = profilaktikaFaq[locale] || profilaktikaFaq.bg;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const siteUrl = "https://pesnopoets-clima.com";
  const singleEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.single));
  const lowEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.turbineCleanMin));
  const highEur = Math.round(bgnToEur(PROFILAKTIKA_BGN.fullService));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: locale === "bg" ? "Профилактика на климатик" : locale === "en" ? "AC preventive maintenance" : locale === "ru" ? "Профилактика кондиционера" : "Профілактика кондиціонера",
    category: "HVAC Maintenance",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Варна" },
      { "@type": "City", name: "Девня" },
      { "@type": "City", name: "Аксаково" },
      { "@type": "AdministrativeArea", name: "Варненска област" },
    ],
    name: t.pageTitle,
    description: t.pageSubtitle,
    url: `${siteUrl}/${locale}/profilaktika`,
    priceRange: `€${lowEur} – €${highEur}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(lowEur),
      highPrice: String(highEur),
      offerCount: 4,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        price: String(singleEur),
        valueAddedTaxIncluded: true,
        description:
          locale === "bg"
            ? `От ${singleEur} € за стандартна профилактика`
            : locale === "en"
            ? `From €${singleEur} for standard maintenance`
            : locale === "ru"
            ? `От ${singleEur} € за стандартную профилактику`
            : `Від ${singleEur} € за стандартну профілактику`,
      },
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.common?.home || "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: t.pageTitle, item: `${siteUrl}/${locale}/profilaktika` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{t.breadcrumbProfilaktika}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {common.deliveryBanner}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {t.pageTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
              {t.pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-start gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
            {t.includedTitle}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6 sm:mb-8">
          {includedLead[locale] || includedLead.bg}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {(t.includedItems as string[]).map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 p-4 bg-white border border-border/60 rounded-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Showcase image + benefits */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/blog/ac-maintenance-guide.jpg"
                alt={t.imageAlt}
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                {t.benefitsTitle}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {t.benefitsDesc}
              </p>
              <ul className="space-y-3">
                {(t.benefitsItems as string[]).map((item) => (
                  <li key={item} className="flex items-center gap-3 p-3 bg-white border border-border/60 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Price table */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.tableTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {t.tableSubtitle}
            </p>
          </div>

          <div className="overflow-hidden bg-white border border-border rounded-2xl shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            <table className="w-full">
              <thead className="bg-[#0a1628] text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {t.thService}
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {t.thPrice}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: t.priceSingleLabel, bgn: PROFILAKTIKA_BGN.single },
                  { label: t.priceFullLabel, bgn: PROFILAKTIKA_BGN.fullService },
                  { label: t.priceOutdoorLabel, bgn: PROFILAKTIKA_BGN.outdoorUnitClean },
                  {
                    label: t.priceTurbineLabel,
                    bgnRange: [PROFILAKTIKA_BGN.turbineCleanMin, PROFILAKTIKA_BGN.turbineCleanMax] as const,
                  },
                ].map((row) => {
                  const range = (row as { bgnRange?: readonly [number, number] }).bgnRange;
                  const isRange = range !== undefined;
                  const eurMin = Math.round(bgnToEur(isRange ? range[0] : (row as { bgn: number }).bgn));
                  const eurMax = isRange ? Math.round(bgnToEur(range[1])) : eurMin;
                  return (
                    <tr key={row.label} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-sm text-foreground font-medium">
                        {row.label}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <span className="text-base sm:text-lg font-extrabold text-foreground tabular-nums">
                          {isRange ? `${eurMin}–${eurMax}` : eurMin}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">€</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                {t.noteTitle}
              </h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                {t.noteText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to schedule — symptoms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-start gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.symptomsTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {t.symptomsSubtitle}
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {(t.symptomsItems as string[]).map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 p-4 bg-white border border-border/60 rounded-xl"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Frequency */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.frequencyTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {t.frequencySubtitle}
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {(t.frequencyItems as Array<{ when: string; who: string }>).map((c) => (
              <li
                key={c.when}
                className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.04)]"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-light/60 rounded-full mb-3">
                  <CalendarClock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span className="text-xs font-medium text-primary-dark">{c.when}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{c.who}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.neighborhoodsTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {t.neighborhoodsSubtitle}
            </p>
          </div>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {(t.neighborhoods as string[]).map((name) => (
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

      {/* Related: link to /montazh */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
              {t.relatedMontazhTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.relatedMontazhDesc}
            </p>
          </div>
          <Link
            href={`/${locale}/montazh`}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            {t.relatedMontazhCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Portfolio — real maintenance work */}
      <PortfolioGallery locale={locale} tags={["maintenance", "detail"]} limit={6} />

      {/* FAQ — visible content mirrors FAQPage JSON-LD, primary AIO citation source */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {(faqHeadings[locale] || faqHeadings.bg).title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {(faqHeadings[locale] || faqHeadings.bg).subtitle}
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={item.q}
                className="group bg-white border border-border/60 rounded-2xl overflow-hidden"
                open={i < 2}
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none p-5 sm:p-6 hover:bg-muted/30 transition-colors">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug pr-2">
                    {item.q}
                  </h3>
                  <ChevronRight
                    className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
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
                  {common.authorizedDealer}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t.ctaTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
                {t.ctaDesc}
              </p>
            </div>
            <Link
              href={`/${locale}/inquiry?service=profilaktika`}
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[var(--primary-dark)] font-semibold rounded-xl hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_14px_0_rgb(0_0_0/0.15)] min-h-[48px]"
            >
              {t.ctaButton}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
