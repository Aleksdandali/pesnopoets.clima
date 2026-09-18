import Link from "next/link";
import { brandLandingPath } from "@/lib/product/insights";
import Image from "next/image";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";

// Revalidate brands page every 10 minutes
export const revalidate = 600;

// Brand profile copy per locale. Added 2026-05-28 because SerpStat flagged
// /brands as thin content (74-81 words). These paragraphs ship our positioning
// for each major manufacturer and double the page's editorial weight without
// touching the brand card grid above.
interface BrandProfile {
  name: string;
  body: string;
}

interface BrandsContent {
  introHeading: string;
  intro: string;
  brands: BrandProfile[];
  whyHeading: string;
  whyBullets: string[];
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
}

const BRANDS_CONTENT: Record<string, BrandsContent> = {
  bg: {
    introHeading: "Кои марки климатици продаваме във Варна",
    intro:
      "Песнопоец Клима е оторизиран дилер на най-надеждните световни производители на климатична техника. Работим само с марки, които имат официален сервиз в България и доказана надеждност в крайбрежен климат — солта, влагата и температурните амплитуди на Варна не са дребен детайл. Всеки климатик в каталога идва с фабрична гаранция и оригинален сериен номер, проверяем директно при вносителя.",
    brands: [
      {
        name: "Daikin",
        body: "Японски лидер в инверторната технология и системите за термопомпи. Препоръчваме Daikin за дълготрайни монтажи в апартаменти и къщи, където клиентът държи на тиха работа, енергиен клас A+++ и 5-годишна гаранция. Серия Perfera и Sensira покриват най-честите BTU стойности за варненския пазар.",
      },
      {
        name: "Mitsubishi Electric & Heavy",
        body: "Две различни компании, и двете японски — Mitsubishi Electric (серия MSZ-AP, MSZ-LN) се отличава с премиум филтрация и тих режим, Mitsubishi Heavy Industries (SRK ZSX) залага на по-голяма мощност при ниски температури. Подходящи и за термопомпени конфигурации за отопление през зимата.",
      },
      {
        name: "Toshiba",
        body: "Японска инженерия със силна позиция в инверторните компресори (Twin-Rotary). Toshiba Seiya и Shorai Edge са решения с добро съотношение цена–функционалност за стандартни помещения 14–18 м².",
      },
      {
        name: "Gree",
        body: "Най-големият производител на климатична техника в света по обем. Gree предлагат отлична надеждност в средния ценови сегмент — серии Bora, Lomo и Amber. Препоръчваме ги за обекти, където бюджетът е приоритет, но клиентът иска официална гаранция и сервиз в България.",
      },
      {
        name: "TechPoint, AUX, Nippon и други",
        body: "Допълваме каталога с по-достъпни марки за бюджетни проекти и втори климатик в спалня/детска. Всички модели минават през същия стандарт на монтаж и поддръжка — фиксирани цени и 12-месечна гаранция върху монтажа независимо от марката на уреда.",
      },
    ],
    whyHeading: "Защо да купите климатик от оторизиран дилер",
    whyBullets: [
      "Оригинална фабрична гаранция (обикновено 3–5 г.) — пълно покритие на компресор и електроника.",
      "Реална наличност в складовете на вносителя — без сив внос и без 4-седмично чакане.",
      "Сервиз по гаранция със същите марки, без сваляне и пренасяне до Варна или София.",
      "Прозрачни цени с ДДС — една и съща цифра в офертата, в договора и във фактурата.",
    ],
    ctaHeading: "Не знаете коя марка ви подхожда?",
    ctaBody:
      "Кажете ни площта на помещението, изложението и бюджета — ще ви предложим 2–3 модела от различни марки с конкретно сравнение по цена, мощност, шум и гаранция. Безплатно и без задължение.",
    ctaButton: "Безплатна консултация",
  },
  en: {
    introHeading: "Which AC brands we sell in Varna",
    intro:
      "Pesnopoets Clima is an authorised dealer for the most reliable air conditioning manufacturers worldwide. We only carry brands that have an official service network in Bulgaria and a proven track record in coastal climates — Varna's salt, humidity and temperature swings are not trivial. Every unit in our catalog ships with a factory warranty and an original serial number we can verify with the importer.",
    brands: [
      {
        name: "Daikin",
        body: "Japanese leader in inverter technology and heat-pump systems. We recommend Daikin for long-term residential installs where the client values quiet operation, A+++ efficiency and a 5-year warranty. The Perfera and Sensira series cover the most common BTU sizes for the Varna market.",
      },
      {
        name: "Mitsubishi Electric & Heavy",
        body: "Two separate Japanese companies — Mitsubishi Electric (MSZ-AP, MSZ-LN) stands out with premium filtration and quiet mode; Mitsubishi Heavy Industries (SRK ZSX) delivers stronger output at low ambient temperatures. Both are excellent in heat-pump configurations for winter heating.",
      },
      {
        name: "Toshiba",
        body: "Japanese engineering with a strong position in twin-rotary inverter compressors. Toshiba Seiya and Shorai Edge offer balanced price-to-feature value for standard 14–18 m² rooms.",
      },
      {
        name: "Gree",
        body: "The world's largest AC manufacturer by volume. Gree delivers excellent reliability in the mid-price segment — Bora, Lomo and Amber series. We recommend Gree when budget matters but the client still wants an official warranty and Bulgarian service.",
      },
      {
        name: "TechPoint, AUX, Nippon and others",
        body: "We round out the catalog with more affordable brands for budget projects and second-bedroom installs. Every unit goes through the same install and service standard — fixed pricing and a 12-month installation warranty regardless of the brand on the box.",
      },
    ],
    whyHeading: "Why buy from an authorised dealer",
    whyBullets: [
      "Genuine factory warranty (typically 3–5 years) — full coverage on compressor and electronics.",
      "Real stock at the importer — no grey imports and no 4-week waiting list.",
      "Warranty service from the same brands — no removal and shipping to Sofia.",
      "Transparent VAT-inclusive prices — the same figure on quote, contract and invoice.",
    ],
    ctaHeading: "Not sure which brand fits you?",
    ctaBody:
      "Tell us the room size, exposure and budget — we'll propose 2–3 models from different brands with a side-by-side comparison on price, output, noise and warranty. Free, no commitment.",
    ctaButton: "Free consultation",
  },
  ru: {
    introHeading: "Какие бренды кондиционеров мы продаём в Варне",
    intro:
      "Песнопоец Клима — официальный дилер самых надёжных мировых производителей климатической техники. Мы работаем только с брендами, у которых есть официальный сервис в Болгарии и подтверждённая надёжность в приморском климате — соль, влажность и перепады температуры Варны нельзя игнорировать. Каждый кондиционер в каталоге идёт с заводской гарантией и оригинальным серийным номером, который мы проверяем у импортёра.",
    brands: [
      {
        name: "Daikin",
        body: "Японский лидер в инверторных технологиях и тепловых насосах. Рекомендуем Daikin для долгосрочных бытовых монтажей, где важна тихая работа, класс A+++ и 5-летняя гарантия. Серии Perfera и Sensira покрывают самые ходовые BTU для рынка Варны.",
      },
      {
        name: "Mitsubishi Electric & Heavy",
        body: "Две разные японские компании — Mitsubishi Electric (MSZ-AP, MSZ-LN) выделяется премиальной фильтрацией и тихим режимом, Mitsubishi Heavy Industries (SRK ZSX) — более высокой мощностью при низких температурах. Обе линейки хороши и для теплонасосных схем зимой.",
      },
      {
        name: "Toshiba",
        body: "Японская инженерия с сильной позицией в twin-rotary инверторных компрессорах. Toshiba Seiya и Shorai Edge — сбалансированные решения по цене и характеристикам для стандартных помещений 14–18 м².",
      },
      {
        name: "Gree",
        body: "Крупнейший в мире производитель кондиционеров по объёму. Gree предлагает отличную надёжность в среднем ценовом сегменте — серии Bora, Lomo и Amber. Рекомендуем, когда важен бюджет, но клиент хочет официальную гарантию и сервис в Болгарии.",
      },
      {
        name: "TechPoint, AUX, Nippon и другие",
        body: "Дополняем каталог более доступными брендами для бюджетных проектов и второго кондиционера в спальне или детской. Все модели проходят тот же стандарт монтажа и обслуживания — фиксированные цены и 12-месячная гарантия на монтаж независимо от бренда устройства.",
      },
    ],
    whyHeading: "Зачем покупать у официального дилера",
    whyBullets: [
      "Оригинальная заводская гарантия (обычно 3–5 лет) — полное покрытие компрессора и электроники.",
      "Реальное наличие у импортёра — без серого ввоза и без ожидания по 4 недели.",
      "Сервис по гарантии у тех же брендов — без демонтажа и перевозки в Софию.",
      "Прозрачные цены с НДС — одна и та же цифра в счёте, договоре и фактуре.",
    ],
    ctaHeading: "Не знаете, какой бренд вам подходит?",
    ctaBody:
      "Назовите площадь помещения, ориентацию по сторонам света и бюджет — предложим 2–3 модели разных брендов с прямым сравнением по цене, мощности, шуму и гарантии. Бесплатно и без обязательств.",
    ctaButton: "Бесплатная консультация",
  },
  ua: {
    introHeading: "Які бренди кондиціонерів ми продаємо у Варні",
    intro:
      "Піснопоєць Кліма — офіційний дилер найнадійніших світових виробників кліматичної техніки. Ми працюємо лише з брендами, які мають офіційний сервіс у Болгарії та доведену надійність у приморському кліматі — сіль, вологість і температурні перепади Варни не дрібниця. Кожен кондиціонер у каталозі йде з заводською гарантією та оригінальним серійним номером, який ми перевіряємо у імпортера.",
    brands: [
      {
        name: "Daikin",
        body: "Японський лідер в інверторних технологіях і теплових насосах. Рекомендуємо Daikin для довгострокових монтажів у квартирах і будинках, де клієнт цінує тиху роботу, клас A+++ і 5 років гарантії. Серії Perfera та Sensira покривають найходовіші BTU для ринку Варни.",
      },
      {
        name: "Mitsubishi Electric & Heavy",
        body: "Дві окремі японські компанії — Mitsubishi Electric (MSZ-AP, MSZ-LN) виділяється преміальною фільтрацією та тихим режимом, Mitsubishi Heavy Industries (SRK ZSX) — більшою потужністю за низьких температур. Обидві лінійки добре працюють і в теплонасосних схемах узимку.",
      },
      {
        name: "Toshiba",
        body: "Японська інженерія з сильною позицією в twin-rotary інверторних компресорах. Toshiba Seiya та Shorai Edge — збалансовані рішення за ціною і характеристиками для стандартних приміщень 14–18 м².",
      },
      {
        name: "Gree",
        body: "Найбільший у світі виробник кондиціонерів за обсягом. Gree пропонує чудову надійність у середньому ціновому сегменті — серії Bora, Lomo та Amber. Рекомендуємо, коли важливий бюджет, але клієнт хоче офіційну гарантію та сервіс у Болгарії.",
      },
      {
        name: "TechPoint, AUX, Nippon та інші",
        body: "Доповнюємо каталог доступнішими брендами для бюджетних проєктів і другого кондиціонера у спальні чи дитячій. Усі моделі проходять той самий стандарт монтажу та обслуговування — фіксовані ціни та 12-місячна гарантія на монтаж незалежно від бренду пристрою.",
      },
    ],
    whyHeading: "Чому варто купувати в офіційного дилера",
    whyBullets: [
      "Оригінальна заводська гарантія (зазвичай 3–5 років) — повне покриття компресора й електроніки.",
      "Реальна наявність у імпортера — без сірого ввезення і без очікування 4 тижні.",
      "Сервіс за гарантією у тих самих брендів — без демонтажу та перевезення до Софії.",
      "Прозорі ціни з ПДВ — та сама цифра в рахунку, договорі та фактурі.",
    ],
    ctaHeading: "Не знаєте, який бренд вам підходить?",
    ctaBody:
      "Назвіть площу приміщення, орієнтацію за сторонами світу та бюджет — запропонуємо 2–3 моделі різних брендів з прямим порівнянням за ціною, потужністю, шумом і гарантією. Безкоштовно та без зобов'язань.",
    ctaButton: "Безкоштовна консультація",
  },
};

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.brands;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${t.title} | ${dictionary.common.siteName}`,
    description: t.subtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/brands`,
      languages: {
        bg: `${siteUrl}/bg/brands`,
        en: `${siteUrl}/en/brands`,
        ru: `${siteUrl}/ru/brands`,
        uk: `${siteUrl}/ua/brands`,
        "x-default": `${siteUrl}/bg/brands`,
      },
    },
  };
}

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("products")
    .select("manufacturer, gallery")
    .eq("is_active", true)
    .not("manufacturer", "is", null);

  const brandMap: Record<string, { count: number; image: string | null }> = {};
  for (const row of data || []) {
    if (!brandMap[row.manufacturer]) brandMap[row.manufacturer] = { count: 0, image: row.gallery?.[0] || null };
    brandMap[row.manufacturer].count++;
    if (!brandMap[row.manufacturer].image && row.gallery?.[0]) brandMap[row.manufacturer].image = row.gallery[0];
  }

  const brands = Object.entries(brandMap).map(([name, info]) => ({ name, ...info })).sort((a, b) => b.count - a.count);
  const t = dictionary.brands;
  const c = BRANDS_CONTENT[locale] || BRANDS_CONTENT.bg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-3">{t.title}</h1>
      <p className="text-muted-foreground mb-10">{t.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={brandLandingPath(brand.name) ? `/${locale}${brandLandingPath(brand.name)}` : `/${locale}/klimatici?brand=${encodeURIComponent(brand.name)}`}
            className="group flex flex-col items-center gap-4 p-6 bg-white border border-border/80 rounded-2xl hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-300"
          >
            {brand.image ? (
              <div className="relative w-full h-24 rounded-xl bg-[#fafbfc] overflow-hidden">
                <Image src={brand.image} alt={brand.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" sizes="25vw" loading="lazy" />
              </div>
            ) : (
              <div className="w-full h-24 rounded-xl bg-[#fafbfc] flex items-center justify-center text-2xl font-bold text-muted-foreground/20">{brand.name[0]}</div>
            )}
            <div className="text-center">
              <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</span>
              <span className="block text-xs text-muted-foreground mt-1">{brand.count} {t.productsCount}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial copy — added 2026-05-28 to lift the page off "thin content"
          (SerpStat flagged 74-81 words). Sits below the brand grid so the
          shopping UX above is unchanged. */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{c.introHeading}</h2>
        <p className="mt-4 text-base text-foreground/75 leading-relaxed">{c.intro}</p>

        <div className="mt-10 space-y-8">
          {c.brands.map((b) => (
            <article key={b.name}>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{b.name}</h3>
              <p className="mt-2 text-sm sm:text-base text-foreground/75 leading-relaxed">{b.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-14 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{c.whyHeading}</h2>
        <ul className="mt-4 space-y-2.5 text-foreground/75">
          {c.whyBullets.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-sm sm:text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] border border-primary/15 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{c.ctaHeading}</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground/75 leading-relaxed">{c.ctaBody}</p>
          <Link
            href={`/${locale}/kontakti`}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {c.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
