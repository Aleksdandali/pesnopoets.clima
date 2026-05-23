import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Sparkles } from "lucide-react";
import BtuCalculator from "@/components/calculator/BtuCalculator";

type Locale = "bg" | "en" | "ru" | "ua";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const DATE_PUBLISHED = "2026-05-23";
const DATE_MODIFIED = "2026-05-23";

const META: Record<Locale, { title: string; description: string }> = {
  bg: {
    title: "Калкулатор BTU — колко мощен климатик ми трябва? (2026)",
    description:
      "Безплатен онлайн калкулатор: изчислете точно колко BTU климатик трябва за стая във Варна. 9 000, 12 000, 18 000 или 24 000 BTU — отговорът за 30 секунди.",
  },
  en: {
    title: "BTU Calculator 2026 — what size AC do I need?",
    description:
      "Free online calculator: find out exactly how many BTU AC you need for a room in Varna. 9,000, 12,000, 18,000 or 24,000 BTU — answer in 30 seconds.",
  },
  ru: {
    title: "Калькулятор BTU 2026 — какой кондиционер выбрать по площади?",
    description:
      "Бесплатный онлайн-калькулятор: рассчитайте, сколько BTU нужно кондиционеру для комнаты во Варне. 9 000, 12 000, 18 000 или 24 000 BTU — ответ за 30 секунд.",
  },
  ua: {
    title: "Калькулятор BTU 2026 — який кондиціонер вибрати за площею?",
    description:
      "Безкоштовний онлайн-калькулятор: розрахуйте, скільки BTU потрібно кондиціонеру для кімнати у Варні. 9 000, 12 000, 18 000 чи 24 000 BTU — відповідь за 30 секунд.",
  },
};

const HERO: Record<Locale, { title: string; subtitle: string; breadcrumbHome: string; breadcrumbHere: string }> = {
  bg: {
    title: "Колко BTU климатик ми трябва?",
    subtitle:
      "Точният размер на климатика влияе пряко на сметката за ток и комфорта. Слабомощен уред работи постоянно на максимум, прекалено мощен — циклира често и не подсушава въздуха. Изчислете препоръката за 30 секунди.",
    breadcrumbHome: "Начало",
    breadcrumbHere: "Калкулатор BTU",
  },
  en: {
    title: "How many BTU AC do I need?",
    subtitle:
      "Right-sizing your AC directly impacts your power bill and comfort. An undersized unit runs flat-out non-stop; an oversized one short-cycles and doesn't dehumidify. Get a recommendation in 30 seconds.",
    breadcrumbHome: "Home",
    breadcrumbHere: "BTU calculator",
  },
  ru: {
    title: "Сколько BTU кондиционеру нужно для моей комнаты?",
    subtitle:
      "Правильный подбор мощности напрямую влияет на счёт за электричество и комфорт. Маломощный кондиционер работает всё время на максимуме, слишком мощный — циклирует и не осушает воздух. Получите рекомендацию за 30 секунд.",
    breadcrumbHome: "Главная",
    breadcrumbHere: "Калькулятор BTU",
  },
  ua: {
    title: "Скільки BTU потрібно кондиціонеру для моєї кімнати?",
    subtitle:
      "Правильний підбір потужності прямо впливає на рахунок за електрику та комфорт. Слабкий кондиціонер працює весь час на максимумі, надто потужний — циклює та не осушує повітря. Отримайте рекомендацію за 30 секунд.",
    breadcrumbHome: "Головна",
    breadcrumbHere: "Калькулятор BTU",
  },
};

const FAQ: Record<Locale, { q: string; a: string }[]> = {
  bg: [
    { q: "Колко BTU климатик трябва на стая 20 м²?", a: "За стандартна стая 20 м² с таван 2,7 м, средно слънце и добра изолация — около 12 000 BTU (12K). При южно изложение или последен етаж — 14 000–18 000 BTU." },
    { q: "Колко BTU са нужни за хол 30 м²?", a: "За хол 30 м² препоръчваме 18 000 BTU (5,3 kW). При силно слънчево изложение или висок таван — 24 000 BTU." },
    { q: "Какво е BTU и kW?", a: "BTU/h е британска единица за топлинна мощност, която показва колко енергия охлажда уредът за час. 1 kW охлаждане = приблизително 3 412 BTU/h. Тоест 12 000 BTU ≈ 3,5 kW." },
    { q: "По-голяма мощност = по-добре ли е?", a: "Не. Прекалено мощен климатик циклира често (включва/изключва), не подсушава добре въздуха и хаби повече ток. Точният размер пести 15–25% от сметката." },
    { q: "Колко струва монтаж на 12 000 BTU климатик във Варна?", a: "Стандартен монтаж на климатик до 14 000 BTU във Варна — 190 € (372 лв.) с включена 3 м медна тръба, материали и гаранция 12 месеца. Демонтаж на стария уред — 32 € допълнително." },
    { q: "Колко BTU за спалня 12 м²?", a: "За спалня 12 м² — 9 000 BTU (2,6 kW) е напълно достатъчно. Това е и най-икономичният клас за енергопотребление." },
  ],
  en: [
    { q: "How many BTU AC do I need for a 20 m² room?", a: "For a standard 20 m² room with a 2.7 m ceiling, average sun and good insulation — about 12,000 BTU (12K). For a south-facing room or top floor — 14,000–18,000 BTU." },
    { q: "How many BTU for a 30 m² living room?", a: "For a 30 m² living room we recommend 18,000 BTU (5.3 kW). For strong sun exposure or high ceiling — 24,000 BTU." },
    { q: "What are BTU and kW?", a: "BTU/h is a British unit of thermal power showing how much energy the unit removes per hour. 1 kW of cooling ≈ 3,412 BTU/h. So 12,000 BTU ≈ 3.5 kW." },
    { q: "Is more power always better?", a: "No. An oversized AC short-cycles (turns on/off too often), doesn't dehumidify well and uses more electricity. The right size saves 15–25% on the bill." },
    { q: "How much does installing a 12,000 BTU AC cost in Varna?", a: "Standard installation of an AC up to 14,000 BTU in Varna — €190 (372 BGN) including 3 m of copper pipe, materials and 12-month warranty. Dismantling of the old unit — €32 extra." },
    { q: "How many BTU for a 12 m² bedroom?", a: "For a 12 m² bedroom — 9,000 BTU (2.6 kW) is plenty. This is also the most energy-efficient class." },
  ],
  ru: [
    { q: "Сколько BTU кондиционеру нужно для комнаты 20 м²?", a: "Для стандартной комнаты 20 м² с потолком 2,7 м, средним солнцем и хорошим утеплением — около 12 000 BTU (12K). При южной стороне или последнем этаже — 14 000–18 000 BTU." },
    { q: "Сколько BTU для гостиной 30 м²?", a: "Для гостиной 30 м² рекомендуем 18 000 BTU (5,3 кВт). При сильной инсоляции или высоком потолке — 24 000 BTU." },
    { q: "Что такое BTU и кВт?", a: "BTU/ч — британская единица тепловой мощности, показывающая, сколько энергии охлаждает прибор за час. 1 кВт охлаждения ≈ 3 412 BTU/ч. То есть 12 000 BTU ≈ 3,5 кВт." },
    { q: "Чем больше мощность — тем лучше?", a: "Нет. Слишком мощный кондиционер циклирует (часто включается/выключается), плохо осушает воздух и потребляет больше тока. Правильный размер экономит 15–25% счёта." },
    { q: "Сколько стоит монтаж кондиционера 12 000 BTU во Варне?", a: "Стандартный монтаж кондиционера до 14 000 BTU во Варне — 190 € (372 лв.), включая 3 м медной трубы, материалы и гарантию 12 месяцев. Демонтаж старого — 32 € дополнительно." },
    { q: "Сколько BTU для спальни 12 м²?", a: "Для спальни 12 м² — 9 000 BTU (2,6 кВт) более чем достаточно. Это и самый экономичный класс по энергопотреблению." },
  ],
  ua: [
    { q: "Скільки BTU потрібно кондиціонеру для кімнати 20 м²?", a: "Для стандартної кімнати 20 м² зі стелею 2,7 м, середнім сонцем і добрим утепленням — близько 12 000 BTU (12K). При південній стороні або останньому поверсі — 14 000–18 000 BTU." },
    { q: "Скільки BTU для вітальні 30 м²?", a: "Для вітальні 30 м² рекомендуємо 18 000 BTU (5,3 кВт). При сильному сонці або високій стелі — 24 000 BTU." },
    { q: "Що таке BTU і кВт?", a: "BTU/год — британська одиниця теплової потужності, що показує, скільки енергії охолоджує прилад за годину. 1 кВт охолодження ≈ 3 412 BTU/год. Тобто 12 000 BTU ≈ 3,5 кВт." },
    { q: "Що більше потужність — то краще?", a: "Ні. Надто потужний кондиціонер циклює (часто вмикається/вимикається), погано осушує повітря та споживає більше струму. Правильний розмір економить 15–25% рахунку." },
    { q: "Скільки коштує монтаж кондиціонера 12 000 BTU у Варні?", a: "Стандартний монтаж кондиціонера до 14 000 BTU у Варні — 190 € (372 лв.), з 3 м мідної труби, матеріалами та гарантією 12 місяців. Демонтаж старого — 32 € додатково." },
    { q: "Скільки BTU для спальні 12 м²?", a: "Для спальні 12 м² — 9 000 BTU (2,6 кВт) більш ніж достатньо. Це найекономічніший клас за енергоспоживанням." },
  ],
};

const HOWTO: Record<Locale, { name: string; description: string; steps: { name: string; text: string }[] }> = {
  bg: {
    name: "Как да изберете правилния размер климатик за стаята",
    description: "Стъпки за изчисляване на необходимата мощност BTU за климатик във Варна.",
    steps: [
      { name: "Измерете площта", text: "Измерете дължина и широчина на стаята в метри и умножете — получавате площта в м²." },
      { name: "Изчислете базовата мощност", text: "Умножете площта по 600 BTU/h. Например 20 м² × 600 = 12 000 BTU." },
      { name: "Приложете корекции", text: "Прибавете +20% за южно слънце, +15% за слаба изолация, +10% за последен етаж, +600 BTU за всеки човек над 2, +4 000 BTU за кухня." },
      { name: "Изберете подходящ клас", text: "Закръглете към най-близкия стандартен клас: 9K, 12K, 18K или 24K BTU." },
      { name: "Поискайте оглед", text: "За точна препоръка с отчитане на дограма, ориентация и съседни помещения — заявете безплатен оглед." },
    ],
  },
  en: {
    name: "How to choose the right AC size for a room",
    description: "Steps for calculating the required BTU power for an AC in Varna.",
    steps: [
      { name: "Measure the area", text: "Measure the length and width of the room in meters and multiply — that gives the area in m²." },
      { name: "Calculate the base power", text: "Multiply area by 600 BTU/h. E.g. 20 m² × 600 = 12,000 BTU." },
      { name: "Apply adjustments", text: "Add +20% for south sun, +15% for poor insulation, +10% for top floor, +600 BTU per person above 2, +4,000 BTU for a kitchen." },
      { name: "Pick a class", text: "Round to the nearest standard class: 9K, 12K, 18K or 24K BTU." },
      { name: "Request a survey", text: "For an exact recommendation accounting for glazing, orientation and adjacent rooms — request a free on-site survey." },
    ],
  },
  ru: {
    name: "Как правильно выбрать размер кондиционера для комнаты",
    description: "Шаги расчёта необходимой мощности BTU для кондиционера во Варне.",
    steps: [
      { name: "Измерьте площадь", text: "Измерьте длину и ширину комнаты в метрах и умножьте — получите площадь в м²." },
      { name: "Рассчитайте базовую мощность", text: "Умножьте площадь на 600 BTU/ч. Например 20 м² × 600 = 12 000 BTU." },
      { name: "Примените корректировки", text: "Прибавьте +20% за южное солнце, +15% за слабое утепление, +10% за последний этаж, +600 BTU за каждого человека сверх 2, +4 000 BTU за кухню." },
      { name: "Выберите класс", text: "Округлите к ближайшему стандартному классу: 9K, 12K, 18K или 24K BTU." },
      { name: "Закажите осмотр", text: "Для точной рекомендации с учётом стеклопакетов, ориентации и соседних помещений — закажите бесплатный осмотр." },
    ],
  },
  ua: {
    name: "Як правильно вибрати розмір кондиціонера для кімнати",
    description: "Кроки розрахунку необхідної потужності BTU для кондиціонера у Варні.",
    steps: [
      { name: "Виміряйте площу", text: "Виміряйте довжину та ширину кімнати в метрах і помножте — отримаєте площу в м²." },
      { name: "Розрахуйте базову потужність", text: "Помножте площу на 600 BTU/год. Наприклад 20 м² × 600 = 12 000 BTU." },
      { name: "Застосуйте коригування", text: "Додайте +20% за південне сонце, +15% за слабке утеплення, +10% за останній поверх, +600 BTU за кожну особу понад 2, +4 000 BTU за кухню." },
      { name: "Виберіть клас", text: "Округліть до найближчого стандартного класу: 9K, 12K, 18K або 24K BTU." },
      { name: "Замовте огляд", text: "Для точної рекомендації з урахуванням склопакетів, орієнтації та сусідніх кімнат — замовте безкоштовний огляд." },
    ],
  },
};

const FAQ_HEADINGS: Record<Locale, { title: string; subtitle: string }> = {
  bg: { title: "Често задавани въпроси", subtitle: "Бързи отговори за BTU, kW и практически препоръки за стаи във Варна." },
  en: { title: "Frequently asked questions", subtitle: "Quick answers about BTU, kW and practical sizing for rooms in Varna." },
  ru: { title: "Часто задаваемые вопросы", subtitle: "Быстрые ответы про BTU, кВт и практический подбор для комнат во Варне." },
  ua: { title: "Часті запитання", subtitle: "Швидкі відповіді про BTU, кВт та практичний підбір для кімнат у Варні." },
};

const inLanguage = (l: Locale) =>
  l === "bg" ? "bg-BG" : l === "en" ? "en-GB" : l === "ru" ? "ru-RU" : "uk-UA";

const localeKey = (locale: string): Locale =>
  (["bg", "en", "ru", "ua"] as const).includes(locale as Locale) ? (locale as Locale) : "bg";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const l = localeKey(locale);
  const siteUrl = "https://pesnopoets-clima.com";
  const m = META[l];
  return {
    title: `${m.title} | Песнопоец Клима`,
    description: m.description,
    alternates: {
      canonical: `${siteUrl}/${l}/kalkulator-btu`,
      languages: {
        bg: `${siteUrl}/bg/kalkulator-btu`,
        en: `${siteUrl}/en/kalkulator-btu`,
        ru: `${siteUrl}/ru/kalkulator-btu`,
        uk: `${siteUrl}/ua/kalkulator-btu`,
        "x-default": `${siteUrl}/bg/kalkulator-btu`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      url: `${siteUrl}/${l}/kalkulator-btu`,
    },
  };
}

export async function generateStaticParams() {
  return (["bg", "en", "ru", "ua"] as const).map((locale) => ({ locale }));
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const l = localeKey(locale);
  const siteUrl = "https://pesnopoets-clima.com";
  const hero = HERO[l];
  const faqItems = FAQ[l];
  const howto = HOWTO[l];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    inLanguage: inLanguage(l),
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howtoJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howto.name,
    description: howto.description,
    inLanguage: inLanguage(l),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    step: howto.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: hero.breadcrumbHome, item: `${siteUrl}/${l}` },
      { "@type": "ListItem", position: 2, name: hero.breadcrumbHere, item: `${siteUrl}/${l}/kalkulator-btu` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href={`/${l}`} className="hover:text-primary transition">
              {hero.breadcrumbHome}
            </Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5" aria-hidden="true" /></li>
          <li className="text-foreground font-medium">{hero.breadcrumbHere}</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary-light/60 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {hero.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <BtuCalculator locale={l} />
      </section>

      <section className="border-t border-border/40 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {FAQ_HEADINGS[l].title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            {FAQ_HEADINGS[l].subtitle}
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group bg-white border border-border/60 rounded-2xl p-5 open:shadow-sm transition"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
                  <span className="text-sm sm:text-base font-semibold text-foreground">{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5 group-open:rotate-90 transition" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
