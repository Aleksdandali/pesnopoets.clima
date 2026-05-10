import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Snowflake,
  Wind,
  Wrench,
  CalendarClock,
} from "lucide-react";

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
    title: `${dict.daikinVarna.pageTitle} | ${dict.common.siteName}`,
    description: dict.daikinVarna.pageSubtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/daikin-varna`,
      languages: {
        bg: `${siteUrl}/bg/daikin-varna`,
        en: `${siteUrl}/en/daikin-varna`,
        ru: `${siteUrl}/ru/daikin-varna`,
        uk: `${siteUrl}/ua/daikin-varna`,
        "x-default": `${siteUrl}/bg/daikin-varna`,
      },
    },
  };
}

const daikinFaq: Record<string, { q: string; a: string }[]> = {
  bg: [
    { q: "Какъв е сервизът на Daikin във Варна?", a: "Имаме собствена бригада във Варна — обслужваме всички модели Daikin. Не пращаме нищо в София. Профилактика, ремонт и гаранционно обслужване — всичко на място." },
    { q: "Колко струва Daikin във Варна?", a: "Daikin Sensira (9K BTU) — от 353 €. Daikin Emura (9K BTU) — от 366 €. Daikin Sensira (18K BTU) — от 636 €. Цените са с ДДС, без монтаж. Монтажът е допълнително 190–230 € в зависимост от мощността." },
    { q: "Каква е гаранцията на Daikin?", a: "5 години на компресора, 3 години на останалата част от уреда — заводска гаранция. Плюс 12 месеца гаранция на труда от наша бригада. За валидна гаранция е задължителен професионален монтаж и редовна профилактика." },
    { q: "Кой е официален вносител на Daikin в България?", a: "Ние работим с официалния вносител на Daikin за България — оригинални продукти, заводска гаранция, оригинални резервни части. Не препродаваме сив внос." },
    { q: "Какво да избера — Daikin Sensira или Emura?", a: "Sensira е практичен избор за всекидневна употреба — отличен SCOP, стандартен бял корпус, по-достъпна цена. Emura е дизайнерска серия с стъклен преден панел — за интериори, в които климатикът трябва да изглежда добре." },
    { q: "Колко време чакам за доставка на Daikin?", a: "За най-популярните модели (Sensira, Emura) — 1–3 дни. За мулти-сплит и големи мощности — до 7 дни. При наличност от наш склад — монтаж в същия ден." },
  ],
  en: [
    { q: "What is the Daikin service in Varna?", a: "We have our own team in Varna — servicing all Daikin models. We don't ship anything to Sofia. Maintenance, repair and warranty service — all on-site." },
    { q: "How much does Daikin cost in Varna?", a: "Daikin Sensira (9K BTU) — from €353. Daikin Emura (9K BTU) — from €366. Daikin Sensira (18K BTU) — from €636. Prices include VAT, excluding installation. Installation costs €190–230 extra depending on capacity." },
    { q: "What is the Daikin warranty?", a: "5 years on the compressor, 3 years on the rest of the unit — factory warranty. Plus 12 months workmanship warranty from our team. For valid warranty, professional installation and regular maintenance are required." },
    { q: "Who is the official Daikin importer in Bulgaria?", a: "We work with the official Daikin importer for Bulgaria — original products, factory warranty, original spare parts. We don't resell grey imports." },
    { q: "Which to choose — Daikin Sensira or Emura?", a: "Sensira is a practical choice for everyday use — excellent SCOP, standard white casing, more affordable price. Emura is a designer range with glass front panel — for interiors where the AC needs to look good." },
    { q: "How long does Daikin delivery take?", a: "For the most popular models (Sensira, Emura) — 1–3 days. For multi-split and large capacities — up to 7 days. When in stock — same-day installation." },
  ],
  ru: [
    { q: "Какой сервис Daikin в Варне?", a: "У нас собственная бригада в Варне — обслуживаем все модели Daikin. Не отправляем ничего в Софию. Профилактика, ремонт и гарантийное обслуживание — всё на месте." },
    { q: "Сколько стоит Daikin в Варне?", a: "Daikin Sensira (9K BTU) — от 353 €. Daikin Emura (9K BTU) — от 366 €. Daikin Sensira (18K BTU) — от 636 €. Цены с НДС, без монтажа. Монтаж — дополнительно 190–230 € в зависимости от мощности." },
    { q: "Какая гарантия на Daikin?", a: "5 лет на компрессор, 3 года на остальную часть аппарата — заводская гарантия. Плюс 12 месяцев гарантии на работу нашей бригады. Для действия гарантии обязателен профессиональный монтаж и регулярная профилактика." },
    { q: "Кто официальный импортёр Daikin в Болгарии?", a: "Мы работаем с официальным импортёром Daikin для Болгарии — оригинальные продукты, заводская гарантия, оригинальные запчасти. Не перепродаём серый импорт." },
    { q: "Что выбрать — Daikin Sensira или Emura?", a: "Sensira — практичный выбор на каждый день — отличный SCOP, стандартный белый корпус, более доступная цена. Emura — дизайнерская серия со стеклянной передней панелью — для интерьеров, где кондиционер должен выглядеть хорошо." },
    { q: "Сколько ждать доставку Daikin?", a: "Для самых популярных моделей (Sensira, Emura) — 1–3 дня. Для мульти-сплит и больших мощностей — до 7 дней. При наличии на нашем складе — монтаж в тот же день." },
  ],
  ua: [
    { q: "Який сервіс Daikin у Варні?", a: "У нас власна бригада у Варні — обслуговуємо всі моделі Daikin. Не відправляємо нічого до Софії. Профілактика, ремонт і гарантійне обслуговування — все на місці." },
    { q: "Скільки коштує Daikin у Варні?", a: "Daikin Sensira (9K BTU) — від 353 €. Daikin Emura (9K BTU) — від 366 €. Daikin Sensira (18K BTU) — від 636 €. Ціни з ПДВ, без монтажу. Монтаж — додатково 190–230 € залежно від потужності." },
    { q: "Яка гарантія на Daikin?", a: "5 років на компресор, 3 роки на решту частини апарата — заводська гарантія. Плюс 12 місяців гарантії на роботу нашої бригади. Для дії гарантії обов'язковий професійний монтаж і регулярна профілактика." },
    { q: "Хто офіційний імпортер Daikin у Болгарії?", a: "Ми працюємо з офіційним імпортером Daikin для Болгарії — оригінальні продукти, заводська гарантія, оригінальні запчастини. Не перепродаємо сірий імпорт." },
    { q: "Що обрати — Daikin Sensira чи Emura?", a: "Sensira — практичний вибір на кожен день — відмінний SCOP, стандартний білий корпус, доступніша ціна. Emura — дизайнерська серія зі скляною передньою панеллю — для інтер'єрів, де кондиціонер має виглядати добре." },
    { q: "Скільки чекати доставку Daikin?", a: "Для найпопулярніших моделей (Sensira, Emura) — 1–3 дні. Для мульти-спліт і великих потужностей — до 7 днів. За наявності на нашому складі — монтаж того ж дня." },
  ],
};

const whyIcons = [Award, Sparkles, Snowflake, Wind] as const;

export default async function DaikinVarnaPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.daikinVarna;

  const faqItems = daikinFaq[locale] || daikinFaq.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: "Daikin",
    brand: { "@type": "Brand", name: "Daikin" },
    description: t.pageSubtitle,
    url: `${siteUrl}/${locale}/daikin-varna`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "353",
      highPrice: "1500",
      offerCount: "12",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "City", name: "Варна" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.common?.home || "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: t.pageTitle, item: `${siteUrl}/${locale}/daikin-varna` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_60%)]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 mb-6" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{t.breadcrumbDaikin}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === "bg" ? "Официален вносител" : locale === "en" ? "Authorized importer" : locale === "ru" ? "Официальный импортёр" : "Офіційний імпортер"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-5">
              {t.pageTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
              {t.pageSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/klimatici?brand=Daikin`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {t.ctaPrimary}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/inquiry`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Daikin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t.whyTitle}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t.whySubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {(t.whyItems as { title: string; desc: string }[]).map((item, idx) => {
            const Icon = whyIcons[idx % whyIcons.length];
            return (
              <article
                key={item.title}
                className="bg-white border border-border/60 rounded-xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.03)]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Range */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.rangeTitle}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t.rangeSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {(t.rangeItems as { name: string; btu: string; desc: string; fromLabel: string; fromPrice: string }[]).map((item) => (
              <article
                key={item.name}
                className="flex flex-col bg-white border border-border/60 rounded-2xl p-6 shadow-[0_2px_8px_rgb(0_0_0/0.03)]"
              >
                <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                  {item.btu}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {item.desc}
                </p>
                <div className="flex items-baseline gap-1.5 mb-4 pt-4 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">{item.fromLabel}</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums">
                    {item.fromPrice}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${locale}/klimatici?brand=Daikin`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t.rangeCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Install + Maintenance cross-links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <article className="flex flex-col bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgb(0_0_0/0.03)]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {t.installTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t.installDesc}
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {(t.installItems as string[]).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/montazh`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {t.installCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </article>

          <article className="flex flex-col bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgb(0_0_0/0.03)]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
              <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {t.maintenanceTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              {t.maintenanceDesc}
            </p>
            <Link
              href={`/${locale}/profilaktika`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {t.maintenanceCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      {/* Warranty */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.warrantyTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {(t.warrantyItems as { title: string; desc: string }[]).map((item) => (
              <article
                key={item.title}
                className="bg-white border border-border/60 rounded-xl p-5 sm:p-6"
              >
                <div className="w-10 h-10 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t.neighborhoodsTitle}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t.neighborhoodsSubtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(t.neighborhoods as string[]).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-10">
            FAQ
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

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t.ctaTitle}
          </h2>
          <p className="text-base text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.ctaDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/klimatici?brand=Daikin`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t.ctaPrimary}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/inquiry`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
