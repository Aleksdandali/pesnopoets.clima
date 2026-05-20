import type { Metadata } from "next";
import { Suspense } from "react";
import PromoLanding, { type Locale, type PromoCopy } from "./PromoLanding";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

const TITLES: Record<Locale, string> = {
  bg: "Монтаж €50 — промо за абонати на Telegram | Песнопоец Клима",
  en: "€50 Install — Telegram Subscriber Promo | Pesnopoets Klima",
  ru: "Монтаж €50 — акция для подписчиков Telegram | Песнопоец Клима",
  ua: "Монтаж €50 — акція для підписників Telegram | Песнопоец Клима",
};

const DESCRIPTIONS: Record<Locale, string> = {
  bg: "До 31.05: монтаж €50 при покупка на климатик от каталога. Само за абонати от Telegram групи на Варна. Промокод VAR50.",
  en: "Until May 31: €50 installation with any AC purchase. Exclusive to Telegram subscribers in Varna. Code VAR50.",
  ru: "До 31.05: монтаж €50 при покупке кондиционера из каталога. Только для подписчиков Telegram групп Варны. Промокод VAR50.",
  ua: "До 31.05: монтаж €50 при купівлі кондиціонера з каталогу. Лише для підписників Telegram груп Варни. Промокод VAR50.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lc = (["bg", "en", "ru", "ua"].includes(locale) ? locale : "bg") as Locale;
  return {
    title: TITLES[lc],
    description: DESCRIPTIONS[lc],
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE}/${lc}/tg` },
  };
}

const COPY: Record<Locale, PromoCopy> = {
  bg: {
    badge: "Само за абонати от Telegram групи",
    headline: "Монтаж за €50 при покупка на климатик",
    subheadline:
      "Промоция до 31 май — спестявате ~€140 на стандартния монтаж. Само първите 20 заявки от Telegram групи на Варна.",
    priceWas: "Обикновена цена",
    priceWasValue: "≈ €190",
    priceNow: "Промо цена",
    priceNowValue: "€50",
    perInstall: "за стандартен монтаж",
    promoCodeLabel: "Промокод",
    countdownLabel: "Промоцията завършва след:",
    countdownDays: "дни",
    countdownHours: "ч",
    countdownMins: "мин",
    countdownEnded: "Промоцията приключи. Очаквайте следваща акция.",
    ctaCall: "Обади се",
    ctaWhatsapp: "WhatsApp",
    ctaCatalog: "Виж каталога",
    catalogHref: "/klimatici",
    trustTitle: "Защо Песнопоец Клима",
    trust: [
      {
        title: "12 мес. писмена гаранция",
        desc: "Гаранция на монтажа в писмен договор — не „на думи“.",
      },
      {
        title: "Локална служба във Варна",
        desc: "Реална компания — ЕИК в договора, адрес ул. Хисарлъка 6, Варна.",
      },
      {
        title: "Собственикът на всеки обект",
        desc: "Без подизпълнители. На монтажа е лично шефът — отговорността не се прехвърля.",
      },
      {
        title: "Оригинална техника",
        desc: "Daikin, Mitsubishi, Toshiba, Gree — официален внос.",
      },
    ],
    conditionsTitle: "Условия на промоцията",
    conditions: [
      "Валидно до 23:59 ч. на 31.05.2026",
      "При покупка на климатик от нашия каталог",
      "Стандартен монтаж: до 3,5 m тръба, до 30 km от Варна",
      "1 промокод на клиент",
      "Допълнителни услуги (пробиване на стена, удължаване на тръби) — по тарифа",
    ],
    formTitle: "Поръчай монтаж за €50",
    formSubtitle: "Ще ти се обадим в рамките на 30 минути.",
    formName: "Име",
    formPhone: "Телефон",
    formMessage: "Бележка (по желание)",
    formMessagePlaceholder: "Например: климатик за стая 20 m², 5-ти етаж",
    formCodeLabel: "Твоят промокод:",
    formSubmit: "Изпрати заявка",
    formSubmitting: "Изпращане...",
    formSuccess: "Заявката е получена!",
    formSuccessMessage:
      "Ще ти се обадим в рамките на 30 минути с конкретна оферта и свободна дата за монтажа.",
    formError: "Грешка при изпращане. Опитай отново или се обади директно.",
    formRequired: "Полето е задължително",
    formPrivacy:
      "Данните се обработват само за връзка с теб — не споделяме с трети лица.",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво включва монтажът за €50?",
        a: "Стандартен монтаж до 3,5 m тръба: продухване с вакуумна помпа, монтаж на конзоли вътре/вън, свързване на електро- и фреонова система, тест и пускане. До 30 km от Варна.",
      },
      {
        q: "Какво НЕ е включено?",
        a: "Пробиване на стена (от €15), удължаване на тръбите над 3,5 m (€8/m), декоративни канали, дренажна помпа. Тарифът се обявява предварително — без изненади.",
      },
      {
        q: "Колко време отнема монтажът?",
        a: "Стандартен монтаж — 2–4 часа в един работен ден. Идваме на уговорена дата.",
      },
      {
        q: "Промоцията важи ли за всички климатици?",
        a: "Да — €50 монтаж важи за всеки модел от нашия каталог, независимо от мощност или марка.",
      },
      {
        q: "Има ли гаранция?",
        a: "Да — 12 месеца писмена гаранция на монтажа в договора + фабричната гаранция на климатика (2–5 г. зависи от модела).",
      },
    ],
    whatsappPrefilled:
      "Здравейте, искам да използвам промокод VAR50 за монтаж за €50.",
  },
  en: {
    badge: "Exclusive to Telegram subscribers",
    headline: "€50 installation with any AC purchase",
    subheadline:
      "Until May 31 — save ~€140 on standard installation. First 20 requests from Varna Telegram groups only.",
    priceWas: "Standard price",
    priceWasValue: "≈ €190",
    priceNow: "Promo price",
    priceNowValue: "€50",
    perInstall: "for standard install",
    promoCodeLabel: "Promo code",
    countdownLabel: "Promo ends in:",
    countdownDays: "d",
    countdownHours: "h",
    countdownMins: "min",
    countdownEnded: "Promo has ended. Stay tuned for the next one.",
    ctaCall: "Call",
    ctaWhatsapp: "WhatsApp",
    ctaCatalog: "Browse catalog",
    catalogHref: "/klimatici",
    trustTitle: "Why Pesnopoets Klima",
    trust: [
      {
        title: "12-month written warranty",
        desc: "Installation warranty in a written contract — not 'word-of-mouth'.",
      },
      {
        title: "Local Varna company",
        desc: "Registered company — reg.№ in contract, address Hisarlaka 6, Varna.",
      },
      {
        title: "Owner on every site",
        desc: "No subcontractors. The owner attends every installation personally — accountability stays in-house.",
      },
      {
        title: "Original equipment",
        desc: "Daikin, Mitsubishi, Toshiba, Gree — official import.",
      },
    ],
    conditionsTitle: "Promo conditions",
    conditions: [
      "Valid until 23:59 on May 31, 2026",
      "With any AC purchase from our catalog",
      "Standard install: up to 3.5 m piping, up to 30 km from Varna",
      "1 promo code per customer",
      "Extra services (wall drilling, pipe extension) — per rate card",
    ],
    formTitle: "Request your €50 install",
    formSubtitle: "We'll call you back within 30 minutes.",
    formName: "Name",
    formPhone: "Phone",
    formMessage: "Note (optional)",
    formMessagePlaceholder: "e.g. AC for a 20 m² room, 5th floor",
    formCodeLabel: "Your promo code:",
    formSubmit: "Send request",
    formSubmitting: "Sending...",
    formSuccess: "Request received!",
    formSuccessMessage:
      "We'll call you within 30 minutes with a concrete quote and an available date.",
    formError: "Failed to send. Please try again or call us directly.",
    formRequired: "This field is required",
    formPrivacy:
      "Your data is processed only to contact you — never shared with third parties.",
    faqTitle: "Frequently asked",
    faq: [
      {
        q: "What's included in the €50 install?",
        a: "Standard install up to 3.5 m piping: vacuum pump, bracket mounting indoors/outdoors, electrical and refrigerant connections, test and startup. Up to 30 km from Varna.",
      },
      {
        q: "What's NOT included?",
        a: "Wall drilling (from €15), pipe extension over 3.5 m (€8/m), decorative ducts, drainage pump. Pricing is announced upfront — no surprises.",
      },
      {
        q: "How long does install take?",
        a: "Standard install — 2–4 hours in one working day. We come on the scheduled date.",
      },
      {
        q: "Does the promo apply to all ACs?",
        a: "Yes — the €50 install applies to any model from our catalog, regardless of power or brand.",
      },
      {
        q: "Is there a warranty?",
        a: "Yes — 12-month written warranty on installation in the contract + factory warranty on the AC (2–5 years depending on model).",
      },
    ],
    whatsappPrefilled:
      "Hi, I'd like to use code VAR50 for the €50 install promo.",
  },
  ru: {
    badge: "Только для подписчиков Telegram групп",
    headline: "Монтаж €50 при покупке кондиционера",
    subheadline:
      "Акция до 31 мая — экономия ~€140 на стандартном монтаже. Только первые 20 заявок из Telegram-групп Варны.",
    priceWas: "Обычная цена",
    priceWasValue: "≈ €190",
    priceNow: "Цена по акции",
    priceNowValue: "€50",
    perInstall: "за стандартный монтаж",
    promoCodeLabel: "Промокод",
    countdownLabel: "До конца акции:",
    countdownDays: "дн",
    countdownHours: "ч",
    countdownMins: "мин",
    countdownEnded: "Акция завершена. Следите за следующей.",
    ctaCall: "Позвонить",
    ctaWhatsapp: "WhatsApp",
    ctaCatalog: "Смотреть каталог",
    catalogHref: "/klimatici",
    trustTitle: "Почему Песнопоец Клима",
    trust: [
      {
        title: "12 мес. письменной гарантии",
        desc: "Гарантия монтажа в письменном договоре — не на словах.",
      },
      {
        title: "Локальная служба в Варне",
        desc: "Реальная компания — ЕИК в договоре, адрес ул. Хисарлъка 6, Варна.",
      },
      {
        title: "Собственник на каждом объекте",
        desc: "Без подрядчиков. На монтаже лично руководитель — ответственность не передаётся.",
      },
      {
        title: "Оригинальная техника",
        desc: "Daikin, Mitsubishi, Toshiba, Gree — официальный импорт.",
      },
    ],
    conditionsTitle: "Условия акции",
    conditions: [
      "Действительно до 23:59 31.05.2026",
      "При покупке кондиционера из нашего каталога",
      "Стандартный монтаж: до 3,5 m трубы, до 30 km от Варны",
      "1 промокод на клиента",
      "Дополнительные услуги (пробивка стены, удлинение труб) — по тарифу",
    ],
    formTitle: "Заказать монтаж за €50",
    formSubtitle: "Перезвоним в течение 30 минут.",
    formName: "Имя",
    formPhone: "Телефон",
    formMessage: "Заметка (необязательно)",
    formMessagePlaceholder: "Например: кондиционер для комнаты 20 m², 5-й этаж",
    formCodeLabel: "Ваш промокод:",
    formSubmit: "Отправить заявку",
    formSubmitting: "Отправка...",
    formSuccess: "Заявка получена!",
    formSuccessMessage:
      "Перезвоним в течение 30 минут с конкретным предложением и свободной датой.",
    formError: "Ошибка отправки. Попробуйте ещё раз или позвоните напрямую.",
    formRequired: "Поле обязательно",
    formPrivacy:
      "Данные обрабатываются только для связи с вами — не передаём третьим лицам.",
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      {
        q: "Что входит в монтаж за €50?",
        a: "Стандартный монтаж до 3,5 m трубы: вакуумирование, монтаж кронштейнов внутри/снаружи, подключение электро- и фреоновой системы, тест и запуск. До 30 km от Варны.",
      },
      {
        q: "Что НЕ входит?",
        a: "Пробивка стены (от €15), удлинение труб свыше 3,5 m (€8/m), декоративные короба, дренажный насос. Тариф объявляется заранее — без сюрпризов.",
      },
      {
        q: "Сколько занимает монтаж?",
        a: "Стандартный — 2–4 часа в один рабочий день. Приезжаем в согласованную дату.",
      },
      {
        q: "Акция действует на все кондиционеры?",
        a: "Да — монтаж €50 действует для любой модели из каталога, независимо от мощности или бренда.",
      },
      {
        q: "Есть ли гарантия?",
        a: "Да — 12 месяцев письменной гарантии на монтаж в договоре + заводская гарантия кондиционера (2–5 лет в зависимости от модели).",
      },
    ],
    whatsappPrefilled:
      "Здравствуйте, хочу воспользоваться промокодом VAR50 для монтажа за €50.",
  },
  ua: {
    badge: "Лише для підписників Telegram груп",
    headline: "Монтаж €50 при купівлі кондиціонера",
    subheadline:
      "Акція до 31 травня — економія ~€140 на стандартному монтажі. Лише перші 20 заявок з Telegram-груп Варни.",
    priceWas: "Звичайна ціна",
    priceWasValue: "≈ €190",
    priceNow: "Ціна за акцією",
    priceNowValue: "€50",
    perInstall: "за стандартний монтаж",
    promoCodeLabel: "Промокод",
    countdownLabel: "До кінця акції:",
    countdownDays: "дн",
    countdownHours: "год",
    countdownMins: "хв",
    countdownEnded: "Акцію завершено. Очікуйте наступну.",
    ctaCall: "Зателефонувати",
    ctaWhatsapp: "WhatsApp",
    ctaCatalog: "Дивитись каталог",
    catalogHref: "/klimatici",
    trustTitle: "Чому Песнопоец Клима",
    trust: [
      {
        title: "12 міс. письмової гарантії",
        desc: "Гарантія монтажу в письмовому договорі — не на словах.",
      },
      {
        title: "Локальна служба у Варні",
        desc: "Реальна компанія — ЕІК у договорі, адреса вул. Хісарлъка 6, Варна.",
      },
      {
        title: "Власник на кожному об'єкті",
        desc: "Без підрядників. На монтажі особисто керівник — відповідальність не передається.",
      },
      {
        title: "Оригінальна техніка",
        desc: "Daikin, Mitsubishi, Toshiba, Gree — офіційний імпорт.",
      },
    ],
    conditionsTitle: "Умови акції",
    conditions: [
      "Дійсно до 23:59 31.05.2026",
      "При купівлі кондиціонера з нашого каталогу",
      "Стандартний монтаж: до 3,5 m труби, до 30 km від Варни",
      "1 промокод на клієнта",
      "Додаткові послуги (пробивання стіни, подовження труб) — за тарифом",
    ],
    formTitle: "Замовити монтаж за €50",
    formSubtitle: "Зателефонуємо протягом 30 хвилин.",
    formName: "Ім'я",
    formPhone: "Телефон",
    formMessage: "Нотатка (необов'язково)",
    formMessagePlaceholder: "Наприклад: кондиціонер для кімнати 20 m², 5-й поверх",
    formCodeLabel: "Ваш промокод:",
    formSubmit: "Надіслати заявку",
    formSubmitting: "Надсилання...",
    formSuccess: "Заявку отримано!",
    formSuccessMessage:
      "Зателефонуємо протягом 30 хвилин з конкретною пропозицією та вільною датою.",
    formError: "Помилка надсилання. Спробуйте ще раз або зателефонуйте напряму.",
    formRequired: "Поле обов'язкове",
    formPrivacy:
      "Дані обробляємо лише для зв'язку з вами — не передаємо третім особам.",
    faqTitle: "Часті запитання",
    faq: [
      {
        q: "Що входить у монтаж за €50?",
        a: "Стандартний монтаж до 3,5 m труби: вакуумування, монтаж кронштейнів усередині/зовні, підключення електро- та фреонової системи, тест та запуск. До 30 km від Варни.",
      },
      {
        q: "Що НЕ входить?",
        a: "Пробивання стіни (від €15), подовження труб понад 3,5 m (€8/m), декоративні короби, дренажний насос. Тариф оголошується заздалегідь — без сюрпризів.",
      },
      {
        q: "Скільки займає монтаж?",
        a: "Стандартний — 2–4 години за один робочий день. Приїжджаємо в узгоджену дату.",
      },
      {
        q: "Чи діє акція на всі кондиціонери?",
        a: "Так — монтаж €50 діє для будь-якої моделі з каталогу, незалежно від потужності чи бренду.",
      },
      {
        q: "Чи є гарантія?",
        a: "Так — 12 місяців письмової гарантії на монтаж у договорі + заводська гарантія кондиціонера (2–5 років залежно від моделі).",
      },
    ],
    whatsappPrefilled:
      "Вітаю, хочу скористатися промокодом VAR50 для монтажу за €50.",
  },
};

export default async function TgPromoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lc = (["bg", "en", "ru", "ua"].includes(locale) ? locale : "bg") as Locale;
  const copy = COPY[lc];

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: copy.headline,
    description: copy.subheadline,
    url: `${SITE}/${lc}/tg`,
    price: 50,
    priceCurrency: "EUR",
    priceValidUntil: "2026-05-31",
    eligibleQuantity: { "@type": "QuantitativeValue", value: 20 },
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "Песнопоец Клима",
      url: SITE,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Suspense fallback={null}>
        <PromoLanding locale={lc} copy={copy} />
      </Suspense>
    </>
  );
}
