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
  Volume2,
  Wind,
  Wrench,
  CalendarClock,
  Building2,
  Factory,
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
    title: `${dict.mitsubishiVarna.pageTitle} | ${dict.common.siteName}`,
    description: dict.mitsubishiVarna.pageSubtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/mitsubishi-varna`,
      languages: {
        bg: `${siteUrl}/bg/mitsubishi-varna`,
        en: `${siteUrl}/en/mitsubishi-varna`,
        ru: `${siteUrl}/ru/mitsubishi-varna`,
        uk: `${siteUrl}/ua/mitsubishi-varna`,
        "x-default": `${siteUrl}/bg/mitsubishi-varna`,
      },
    },
  };
}

const mitsubishiFaq: Record<string, { q: string; a: string }[]> = {
  bg: [
    { q: "Каква е разликата между Mitsubishi Electric и Mitsubishi Heavy?", a: "Това са две различни японски компании, споделящи името Mitsubishi от 1870-те. Mitsubishi Electric е по-известна в Европа, с серии MSZ-HR (практична) и MSZ-LN (дизайнерска). Mitsubishi Heavy Industries предлага по-достъпни цени при същото японско качество — серии SRK ZSP (бестселър) и SRK ZS-W (премиум). И двете марки са отлични — изборът зависи от бюджета и предпочитанията към дизайн." },
    { q: "Колко струва Mitsubishi във Варна?", a: "Mitsubishi Heavy SRK25ZSP-W (9K BTU) — от 370 €. Mitsubishi Electric MSZ-HR25VF (9K BTU) — от 391 €. Mitsubishi Heavy SRK ZS-W Premium — от 480 €. Цените са с ДДС, без монтаж. Монтажът е допълнително 190–230 € в зависимост от мощността." },
    { q: "Каква е гаранцията на Mitsubishi?", a: "5 години на компресора, 3 години на останалата част от уреда — заводска гаранция. Плюс 12 месеца гаранция на труда от наша бригада. Mitsubishi е известна с това, че гаранцията се изпълнява без съдебни спорове." },
    { q: "Какъв е сервизът на Mitsubishi във Варна?", a: "Имаме собствена бригада във Варна — обслужваме всички модели Mitsubishi Electric и Mitsubishi Heavy. Не пращаме нищо в София. Профилактика, ремонт и гаранционно обслужване — всичко на място." },
    { q: "Кой е по-тих — Mitsubishi Electric или Heavy?", a: "И двете марки са сред най-тихите в света. Mitsubishi Electric MSZ-HR работи на 19 dB в режим Quiet — по-тихо от шепот в библиотека. Mitsubishi Heavy SRK ZSP-W достига 21 dB. Разликата е практически незабележима за човешкото ухо." },
    { q: "Колко време чакам за доставка на Mitsubishi?", a: "За най-популярните модели (Heavy SRK ZSP, Electric MSZ-HR) — 1–3 дни. За мулти-сплит и големи мощности — до 7 дни. При наличност от наш склад — монтаж в същия ден." },
  ],
  en: [
    { q: "What's the difference between Mitsubishi Electric and Mitsubishi Heavy?", a: "These are two different Japanese companies sharing the Mitsubishi name since the 1870s. Mitsubishi Electric is more well-known in Europe, with the MSZ-HR (practical) and MSZ-LN (designer) series. Mitsubishi Heavy Industries offers more affordable prices at the same Japanese quality — SRK ZSP (bestseller) and SRK ZS-W (premium) series. Both brands are excellent — choice depends on budget and design preferences." },
    { q: "How much does Mitsubishi cost in Varna?", a: "Mitsubishi Heavy SRK25ZSP-W (9K BTU) — from €370. Mitsubishi Electric MSZ-HR25VF (9K BTU) — from €391. Mitsubishi Heavy SRK ZS-W Premium — from €480. Prices include VAT, excluding installation. Installation costs €190–230 extra depending on capacity." },
    { q: "What is the Mitsubishi warranty?", a: "5 years on the compressor, 3 years on the rest of the unit — factory warranty. Plus 12 months workmanship warranty from our team. Mitsubishi is known for honouring its warranty without legal disputes." },
    { q: "What is the Mitsubishi service in Varna?", a: "We have our own team in Varna — servicing all Mitsubishi Electric and Mitsubishi Heavy models. We don't ship anything to Sofia. Maintenance, repair and warranty service — all on-site." },
    { q: "Which is quieter — Mitsubishi Electric or Heavy?", a: "Both brands are among the quietest in the world. Mitsubishi Electric MSZ-HR runs at 19 dB in Quiet mode — quieter than a library whisper. Mitsubishi Heavy SRK ZSP-W reaches 21 dB. The difference is practically imperceptible to the human ear." },
    { q: "How long does Mitsubishi delivery take?", a: "For the most popular models (Heavy SRK ZSP, Electric MSZ-HR) — 1–3 days. For multi-split and large capacities — up to 7 days. When in stock — same-day installation." },
  ],
  ru: [
    { q: "В чём разница между Mitsubishi Electric и Mitsubishi Heavy?", a: "Это две разные японские компании, делящие имя Mitsubishi с 1870-х. Mitsubishi Electric более известна в Европе, с сериями MSZ-HR (практичная) и MSZ-LN (дизайнерская). Mitsubishi Heavy Industries предлагает более доступные цены при том же японском качестве — серии SRK ZSP (бестселлер) и SRK ZS-W (премиум). Оба бренда отличные — выбор зависит от бюджета и дизайна." },
    { q: "Сколько стоит Mitsubishi в Варне?", a: "Mitsubishi Heavy SRK25ZSP-W (9K BTU) — от 370 €. Mitsubishi Electric MSZ-HR25VF (9K BTU) — от 391 €. Mitsubishi Heavy SRK ZS-W Premium — от 480 €. Цены с НДС, без монтажа. Монтаж — дополнительно 190–230 € в зависимости от мощности." },
    { q: "Какая гарантия на Mitsubishi?", a: "5 лет на компрессор, 3 года на остальную часть аппарата — заводская гарантия. Плюс 12 месяцев гарантии на работу нашей бригады. Mitsubishi известна тем, что гарантия выполняется без судебных споров." },
    { q: "Какой сервис Mitsubishi в Варне?", a: "У нас собственная бригада в Варне — обслуживаем все модели Mitsubishi Electric и Mitsubishi Heavy. Не отправляем ничего в Софию. Профилактика, ремонт и гарантийное обслуживание — всё на месте." },
    { q: "Кто тише — Mitsubishi Electric или Heavy?", a: "Оба бренда среди самых тихих в мире. Mitsubishi Electric MSZ-HR работает на 19 dB в режиме Quiet — тише шёпота в библиотеке. Mitsubishi Heavy SRK ZSP-W достигает 21 dB. Разница практически незаметна для человеческого уха." },
    { q: "Сколько ждать доставку Mitsubishi?", a: "Для самых популярных моделей (Heavy SRK ZSP, Electric MSZ-HR) — 1–3 дня. Для мульти-сплит и больших мощностей — до 7 дней. При наличии на нашем складе — монтаж в тот же день." },
  ],
  ua: [
    { q: "У чому різниця між Mitsubishi Electric і Mitsubishi Heavy?", a: "Це дві різні японські компанії, які поділяють ім'я Mitsubishi з 1870-х. Mitsubishi Electric більш відома в Європі, з серіями MSZ-HR (практична) і MSZ-LN (дизайнерська). Mitsubishi Heavy Industries пропонує доступніші ціни при тій же японській якості — серії SRK ZSP (бестселер) і SRK ZS-W (преміум). Обидва бренди відмінні — вибір залежить від бюджету і дизайну." },
    { q: "Скільки коштує Mitsubishi у Варні?", a: "Mitsubishi Heavy SRK25ZSP-W (9K BTU) — від 370 €. Mitsubishi Electric MSZ-HR25VF (9K BTU) — від 391 €. Mitsubishi Heavy SRK ZS-W Premium — від 480 €. Ціни з ПДВ, без монтажу. Монтаж — додатково 190–230 € залежно від потужності." },
    { q: "Яка гарантія на Mitsubishi?", a: "5 років на компресор, 3 роки на решту частини апарата — заводська гарантія. Плюс 12 місяців гарантії на роботу нашої бригади. Mitsubishi відома тим, що гарантія виконується без судових суперечок." },
    { q: "Який сервіс Mitsubishi у Варні?", a: "У нас власна бригада у Варні — обслуговуємо всі моделі Mitsubishi Electric і Mitsubishi Heavy. Не відправляємо нічого до Софії. Профілактика, ремонт і гарантійне обслуговування — все на місці." },
    { q: "Хто тихіший — Mitsubishi Electric чи Heavy?", a: "Обидва бренди серед найтихіших у світі. Mitsubishi Electric MSZ-HR працює на 19 dB у режимі Quiet — тихіше за шепіт у бібліотеці. Mitsubishi Heavy SRK ZSP-W досягає 21 dB. Різниця практично непомітна для людського вуха." },
    { q: "Скільки чекати доставку Mitsubishi?", a: "Для найпопулярніших моделей (Heavy SRK ZSP, Electric MSZ-HR) — 1–3 дні. Для мульти-спліт і великих потужностей — до 7 днів. За наявності на нашому складі — монтаж того ж дня." },
  ],
};

const whyIcons = [Award, Sparkles, Volume2, Wind] as const;
const twoLinesIcons = [Building2, Factory] as const;

export default async function MitsubishiVarnaPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.mitsubishiVarna;

  const faqItems = mitsubishiFaq[locale] || mitsubishiFaq.bg;
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
    name: "Mitsubishi",
    brand: { "@type": "Brand", name: "Mitsubishi" },
    description: t.pageSubtitle,
    url: `${siteUrl}/${locale}/mitsubishi-varna`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "370",
      highPrice: "1800",
      offerCount: "135",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "City", name: "Варна" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.common?.home || "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: t.pageTitle, item: `${siteUrl}/${locale}/mitsubishi-varna` },
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
            <span className="text-white/80">{t.breadcrumbMitsubishi}</span>
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
                href={`/${locale}/klimatici?brand=Mitsubishi`}
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

      {/* Why Mitsubishi */}
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

      {/* Two lines explanation — UNIQUE to mitsubishi-varna */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.twoLinesTitle}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t.twoLinesDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {(t.twoLines as { title: string; desc: string }[]).map((item, idx) => {
              const Icon = twoLinesIcons[idx % twoLinesIcons.length];
              return (
                <article
                  key={item.title}
                  className="flex flex-col bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgb(0_0_0/0.03)]"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Range */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/klimatici?brand=Mitsubishi`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t.rangeCtaElectric}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href={`/${locale}/klimatici?brand=Mitsubishi%20Heavy`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-border/80 hover:bg-muted/40 text-foreground text-sm font-semibold rounded-xl transition-colors"
          >
            {t.rangeCtaHeavy}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Install + Maintenance cross-links */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        </div>
      </section>

      {/* Warranty */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
      </section>

      {/* Neighborhoods */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
              href={`/${locale}/klimatici?brand=Mitsubishi`}
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
