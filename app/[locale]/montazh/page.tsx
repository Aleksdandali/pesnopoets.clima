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
} from "lucide-react";
import BeforeAfterSlider from "@/components/montazh/BeforeAfterSlider";
import {
  INSTALLATION_TIERS,
  EXTRA_SERVICES_EUR,
  bgnToEur,
} from "@/lib/pricing";
import { DISTRICTS, type Locale } from "@/lib/districts";

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
    title: `${dict.montazh.pageTitle} | ${dict.common.siteName}`,
    description: dict.montazh.pageSubtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/montazh`,
      languages: {
        bg: `${siteUrl}/bg/montazh`,
        en: `${siteUrl}/en/montazh`,
        ru: `${siteUrl}/ru/montazh`,
        uk: `${siteUrl}/ua/montazh`,
        "x-default": `${siteUrl}/bg/montazh`,
      },
    },
  };
}

/** Short BTU → "up to Y kW" style label for the first column of the price table. */
function formatPowerLabel(maxBtu: number): string {
  const kw = (maxBtu * 0.000293).toFixed(1);
  return `≤ ${(maxBtu / 1000).toFixed(0)}K BTU (~${kw} kW)`;
}

const montazhFaq: Record<string, { q: string; a: string }[]> = {
  bg: [
    { q: "Колко струва монтажът на климатик?", a: "Стандартният монтаж започва от 190 € за уреди до 14 000 BTU и 230 € за до 24 000 BTU. Цената включва 3 м тръба, материали, вакуумиране и пускане в експлоатация." },
    { q: "Какво включва стандартният монтаж?", a: "Стандартният монтаж включва до 3 метра медна тръба, всички материали и фитинги, вакуумиране, електрическо свързване, монтаж на вътрешно и външно тяло и пускане в експлоатация." },
    { q: "Колко бързо можете да монтирате?", a: "Предлагаме монтаж в същия ден, ако се свържете с нас преди обяд. Типичният монтаж отнема 2–4 часа." },
    { q: "Давате ли гаранция за монтажа?", a: "Да, предоставяме 12 месеца гаранция върху монтажните дейности. При проблем, свързан с монтажа, го отстраняваме безплатно." },
    { q: "Какви райони покривате?", a: "Покриваме всички квартали на Варна и околността в радиус до около 30 км по договаряне." },
    { q: "Кога е най-добре да се монтира климатик?", a: "Най-добрите месеци са март–май и септември–октомври — търсенето е по-ниско и можем да дойдем в рамките на 1–3 дни. През юли и август изчакването често достига 1–2 седмици." },
    { q: "Кой плаща за монтажа — наемателят или собственикът?", a: "Обикновено собственикът заплаща монтажа, тъй като климатикът остава в имота след изнасянето на наемателя. Препоръчваме това да се запише в договора за наем." },
    { q: "Каква е максималната дължина на тръбата между вътрешното и външното тяло?", a: "При битови сплит климатици техническият максимум е 15–25 м (зависи от модела), но за оптимална ефективност препоръчваме до 7–10 м. Над 10 м обикновено се изисква дозареждане с фреон." },
  ],
  en: [
    { q: "How much does AC installation cost?", a: "Standard installation starts from 190 € for units up to 14,000 BTU and 230 € for up to 24,000 BTU. Price includes 3m pipe, materials, vacuum, and commissioning." },
    { q: "What does standard installation include?", a: "Standard installation includes up to 3 meters of copper pipe, all fittings and materials, vacuum evacuation, electrical connection, mounting of indoor and outdoor units, and commissioning." },
    { q: "How fast can you install?", a: "We offer same-day installation if you contact us before noon. Typical installation takes 2–4 hours." },
    { q: "Do you offer warranty on installation?", a: "Yes, we provide 12 months warranty on all installation work. Any installation-related issue within that period is fixed at no charge." },
    { q: "What areas do you cover?", a: "We cover all neighborhoods in Varna city and the surrounding region up to approximately 30km by arrangement." },
    { q: "When is the best time to install an AC?", a: "Best months are March–May and September–October — demand is lower and we can come within 1–3 days. In July and August the wait often reaches 1–2 weeks." },
    { q: "Who pays for installation — tenant or landlord?", a: "Typically the landlord pays, as the AC stays in the property after the tenant moves out. We recommend documenting this in the lease agreement." },
    { q: "What is the maximum pipe length between indoor and outdoor units?", a: "For residential split systems the technical maximum is 15–25 m (varies by model), but for optimal efficiency we recommend up to 7–10 m. Above 10 m usually requires additional refrigerant top-up." },
  ],
  ru: [
    { q: "Сколько стоит установка кондиционера?", a: "Стандартная установка — от 190 € для моделей до 14 000 BTU и 230 € до 24 000 BTU. В цену входят 3 м трубы, материалы, вакуумирование и пусконаладка." },
    { q: "Что входит в стандартную установку?", a: "Стандартная установка включает до 3 метров медной трубы, все материалы и фитинги, вакуумирование, электроподключение, монтаж внутреннего и наружного блоков и пусконаладку." },
    { q: "Как быстро вы можете установить?", a: "Мы предлагаем установку в тот же день, если вы свяжетесь с нами до обеда. Типичная установка занимает 2–4 часа." },
    { q: "Даёте ли вы гарантию на монтаж?", a: "Да, мы предоставляем 12 месяцев гарантии на монтажные работы. Любая проблема, связанная с монтажом, устраняется бесплатно." },
    { q: "Какие районы вы обслуживаете?", a: "Мы обслуживаем все районы Варны и окрестности в радиусе до 30 км по договорённости." },
    { q: "Когда лучше всего устанавливать кондиционер?", a: "Лучшие месяцы — март–май и сентябрь–октябрь, когда спрос ниже и мы можем приехать в течение 1–3 дней. В июле и августе ожидание часто достигает 1–2 недель." },
    { q: "Кто платит за установку — арендатор или собственник?", a: "Обычно собственник, так как кондиционер остаётся в квартире после съезда арендатора. Рекомендуем закрепить это в договоре аренды." },
    { q: "Какова максимальная длина трассы между внутренним и наружным блоками?", a: "Технический максимум для бытовых сплит-систем — 15–25 м (зависит от модели), но для оптимальной эффективности рекомендуем до 7–10 м. Свыше 10 м обычно требуется дозаправка фреоном." },
  ],
  ua: [
    { q: "Скільки коштує монтаж кондиціонера?", a: "Стандартний монтаж — від 190 € для моделей до 14 000 BTU та 230 € до 24 000 BTU. Ціна включає 3 м труби, матеріали, вакуумування та пусконалагодження." },
    { q: "Що входить у стандартний монтаж?", a: "Стандартний монтаж включає до 3 метрів мідної труби, всі матеріали та фітинги, вакуумування, електропідключення, монтаж внутрішнього та зовнішнього блоків і пусконалагодження." },
    { q: "Як швидко ви можете встановити?", a: "Ми пропонуємо монтаж у той самий день, якщо ви зв'яжетесь до обіду. Типовий монтаж займає 2–4 години." },
    { q: "Чи надаєте гарантію на монтаж?", a: "Так, ми надаємо 12 місяців гарантії на монтажні роботи. Будь-яка проблема, пов'язана з монтажем, усувається безкоштовно." },
    { q: "Які райони ви обслуговуєте?", a: "Ми обслуговуємо всі райони Варни та околиці в радіусі до 30 км за домовленістю." },
    { q: "Коли найкраще встановлювати кондиціонер?", a: "Найкращі місяці — березень–травень і вересень–жовтень, коли попит нижчий і ми можемо приїхати протягом 1–3 днів. У липні та серпні очікування часто сягає 1–2 тижнів." },
    { q: "Хто платить за монтаж — орендар чи власник?", a: "Зазвичай власник, оскільки кондиціонер залишається у квартирі після виїзду орендаря. Рекомендуємо зафіксувати це в договорі оренди." },
    { q: "Яка максимальна довжина траси між внутрішнім і зовнішнім блоками?", a: "Технічний максимум для побутових спліт-систем — 15–25 м (залежить від моделі), але для оптимальної ефективності рекомендуємо до 7–10 м. Понад 10 м зазвичай потрібна дозаправка фреоном." },
  ],
};

const faqHeadings: Record<string, { title: string; subtitle: string }> = {
  bg: { title: "Често задавани въпроси", subtitle: "Бързи отговори за цени, гаранция, срокове и технически детайли." },
  en: { title: "Frequently asked questions", subtitle: "Quick answers about pricing, warranty, timing and technical details." },
  ru: { title: "Частые вопросы", subtitle: "Быстрые ответы о ценах, гарантии, сроках и технических деталях." },
  ua: { title: "Часті запитання", subtitle: "Швидкі відповіді про ціни, гарантію, терміни та технічні деталі." },
};

export default async function MontazhPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.montazh;
  const common = dict.common;

  const faqItems = montazhFaq[locale] || montazhFaq.bg;

  // Map localized district names → slugs so neighborhood chips become real links
  // for the 8 districts we have dedicated SEO pages for.
  const districtLocale: Locale = (["bg", "en", "ru", "ua"] as const).includes(
    locale as Locale
  )
    ? (locale as Locale)
    : "bg";
  const districtSlugByName: Record<string, string> = {};
  for (const d of DISTRICTS) {
    districtSlugByName[d.content[districtLocale].name] = d.slug;
  }
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
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Монтаж на климатици",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Варна" },
      { "@type": "City", name: "Девня" },
      { "@type": "City", name: "Аксаково" },
      { "@type": "AdministrativeArea", name: "Варненска област" },
    ],
    name: t.pageTitle,
    description: t.pageSubtitle,
    url: `${siteUrl}/${locale}/montazh`,
    category: "HVAC Installation",
    priceRange: "€190 – €350",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "190",
      highPrice: "350",
      offerCount: INSTALLATION_TIERS.length,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        price: "190",
        valueAddedTaxIncluded: true,
        description:
          locale === "bg"
            ? "От 190 € за стандартен монтаж до 3м тръба"
            : locale === "en"
            ? "From €190 for standard install up to 3m line set"
            : locale === "ru"
            ? "От 190 € за стандартный монтаж до 3м трассы"
            : "Від 190 € за стандартний монтаж до 3м траси",
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
      { "@type": "ListItem", position: 2, name: t.pageTitle, item: `${siteUrl}/${locale}/montazh` },
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
          {/* Breadcrumbs */}
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{t.breadcrumbMontazh}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <Wrench className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
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

      {/* Neighborhoods — local-intent signal for "монтаж климатик [квартал] варна" */}
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
          {(t.neighborhoods as string[]).map((name) => {
            const slug = districtSlugByName[name];
            if (slug) {
              return (
                <li key={name}>
                  <Link
                    href={`/${locale}/montazh/${slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground hover:bg-primary-light/40 hover:border-primary/40 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
                    {name}
                  </Link>
                </li>
              );
            }
            return (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/60 rounded-full text-sm text-foreground"
              >
                <MapPin className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
                {name}
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          {t.neighborhoodsCta}
        </p>
      </section>

      {/* What's included */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="flex items-start gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
            {t.includedTitle}
          </h2>
        </div>
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

      {/* Installation process showcase */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/montazh/installation-process.jpg"
                alt={t.processImageAlt || "Installation process"}
                width={1731}
                height={909}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                {t.processTitle || (locale === "ru" ? "Качественная установка" : locale === "ua" ? "Якісна установка" : locale === "en" ? "Quality installation" : "Качествен монтаж")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {t.processDesc || (locale === "ru" ? "Чисто в вашей квартире. Аккуратно и по стандартам. Надежно — с заботой о деталях." : locale === "ua" ? "Чисто у вашій квартирі. Акуратно і за стандартами. Надійно — з турботою про деталі." : locale === "en" ? "Clean in your apartment. Neat and to standards. Reliable — with attention to detail." : "Чисто в апартамента ви. Акуратно и по стандарти. Надеждно — с грижа за детайлите.")}
              </p>
              <ul className="space-y-3">
                {[
                  { icon: "clean", text: locale === "ru" ? "Чисто в вашей квартире" : locale === "ua" ? "Чисто у вашій квартирі" : locale === "en" ? "Clean in your apartment" : "Чисто в апартамента ви" },
                  { icon: "neat", text: locale === "ru" ? "Аккуратно и по стандартам" : locale === "ua" ? "Акуратно і за стандартами" : locale === "en" ? "Neat and to standards" : "Акуратно и по стандарти" },
                  { icon: "reliable", text: locale === "ru" ? "Надежно — с заботой о деталях" : locale === "ua" ? "Надійно — з турботою про деталі" : locale === "en" ? "Reliable — with attention to detail" : "Надеждно — с грижа за детайлите" },
                ].map((item) => (
                  <li key={item.icon} className="flex items-center gap-3 p-3 bg-white border border-border/60 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
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
                    {t.thPower}
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {t.thPrice}
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {t.thExtraPipe}
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
                        {/* Mobile: show extra pipe here too */}
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
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">
              {t.extrasTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 sm:mb-5">
              {t.extrasSubtitle}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-baseline justify-between p-4 bg-white border border-border/60 rounded-xl">
                <span className="text-sm text-foreground pr-2">{t.extraDismantleSmall}</span>
                <span className="whitespace-nowrap">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    {Math.round(EXTRA_SERVICES_EUR.dismantleSmall)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">€</span>
                </span>
              </li>
              <li className="flex items-baseline justify-between p-4 bg-white border border-border/60 rounded-xl">
                <span className="text-sm text-foreground pr-2">{t.extraDismantleLarge}</span>
                <span className="whitespace-nowrap">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    {Math.round(EXTRA_SERVICES_EUR.dismantleLarge)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">€</span>
                </span>
              </li>
              <li className="flex items-baseline justify-between p-4 bg-white border border-border/60 rounded-xl">
                <span className="text-sm text-foreground pr-2">{t.extraDiagnostic}</span>
                <span className="whitespace-nowrap">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    {Math.round(EXTRA_SERVICES_EUR.diagnostic)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">€</span>
                </span>
              </li>
              <li className="flex items-baseline justify-between p-4 bg-white border border-border/60 rounded-xl">
                <span className="text-sm text-foreground pr-2">{t.extraInspection}</span>
                <span className="whitespace-nowrap">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    {Math.round(EXTRA_SERVICES_EUR.inspection)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">€</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Note */}
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

      {/* Before / After gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {t.beforeAfterTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t.beforeAfterSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <BeforeAfterSlider
            beforeSrc="/images/montazh/before-indoor.jpg"
            afterSrc="/images/montazh/after-indoor.jpg"
            beforeLabel={t.beforeLabel}
            afterLabel={t.afterLabel}
            dragHint={t.dragHint}
            alt={locale === "ru" ? "Монтаж внутреннего блока" : locale === "ua" ? "Монтаж внутрішнього блоку" : locale === "en" ? "Indoor unit installation" : "Монтаж на вътрешно тяло"}
          />
          <BeforeAfterSlider
            beforeSrc="/images/montazh/before-outdoor.jpg"
            afterSrc="/images/montazh/after-outdoor.jpg"
            beforeLabel={t.beforeLabel}
            afterLabel={t.afterLabel}
            dragHint={t.dragHint}
            alt={locale === "ru" ? "Монтаж наружного блока" : locale === "ua" ? "Монтаж зовнішнього блоку" : locale === "en" ? "Outdoor unit installation" : "Монтаж на външно тяло"}
          />
        </div>
      </section>

      {/* Recent cases — E-E-A-T signal: real anonymized jobs */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.casesTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t.casesSubtitle}
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {(t.cases as Array<{ district: string; type: string; model: string; result: string }>).map((c) => (
              <li
                key={c.district + c.model}
                className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.04)]"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-light/60 rounded-full mb-3">
                  <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span className="text-xs font-medium text-primary-dark">{c.district}</span>
                </div>
                <p className="text-sm text-foreground font-semibold mb-1">{c.type}</p>
                <p className="text-sm text-muted-foreground mb-4">{c.model}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{c.result}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
              href={`/${locale}/inquiry`}
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
