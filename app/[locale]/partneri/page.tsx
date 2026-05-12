import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  HardHat,
  Home,
  Building2,
  Paintbrush,
  Key,
  Users,
  Hammer,
  PhoneCall,
  Receipt,
  ShieldCheck,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import PartnerForm from "@/components/forms/PartnerForm";

type Locale = "bg" | "en" | "ru" | "ua";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const SUPPORTED: Locale[] = ["bg", "en", "ru", "ua"];
const SITE_URL = "https://pesnopoets-clima.com";
const COMMISSION_PERCENT = 10;

function pickLocale(raw: string): Locale {
  return (SUPPORTED as string[]).includes(raw) ? (raw as Locale) : "bg";
}

// ─────────────────────────────────────────────────────────────────────
//  CONTENT
// ─────────────────────────────────────────────────────────────────────

interface AudienceItem {
  label: string;
  desc: string;
}
interface StepItem {
  title: string;
  desc: string;
}
interface EarningsRow {
  job: string;
  total: string;
  payout: string;
}
interface ReasonItem {
  title: string;
  desc: string;
}
interface TermItem {
  title: string;
  desc: string;
}
interface FaqItem {
  q: string;
  a: string;
}

interface PageCopy {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  h1: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  highlights: string[]; // 3 short bullets right under hero

  audienceTitle: string;
  audienceSubtitle: string;
  audience: AudienceItem[]; // 6 items

  howTitle: string;
  howSubtitle: string;
  steps: StepItem[]; // 3 items

  earningsTitle: string;
  earningsSubtitle: string;
  earningsHeaders: { job: string; total: string; payout: string };
  earnings: EarningsRow[];
  earningsNote: string;

  whyTitle: string;
  why: ReasonItem[]; // 4 items

  termsTitle: string;
  terms: TermItem[]; // 6 items

  formTitle: string;
  formSubtitle: string;
  form: React.ComponentProps<typeof PartnerForm>["copy"];

  faqTitle: string;
  faq: FaqItem[]; // 5 items

  finalTitle: string;
  finalSubtitle: string;
  finalCta: string;
}

const COPY: Record<Locale, PageCopy> = {
  bg: {
    metaTitle:
      "Партньорска програма 10% — Песнопоец Клима Варна | Прорабе, агенти, дизайнери",
    metaDescription:
      "Препоръчвате нашите климатици и монтаж във Варна — получавате 10% от стойността на всяка поръчка. Прозрачни условия, плащане след монтажа, без таван.",
    badge: "Партньорство",
    h1: "10% от всяка поръчка — за вашата препоръка",
    subtitle:
      "Търсим дългосрочни партньори във Варна: прорабе, риелтори, дизайнери на интериор, домоуправители, строителни фирми. Препоръчвате клиент — ние доставяме, монтираме и обслужваме, вие получавате 10% от общата сума.",
    ctaPrimary: "Заявка за партньорство",
    ctaSecondary: "Видео обаждане преди подпис",
    highlights: [
      "10% от всяка завършена поръчка — без таван",
      "Плащане в рамките на 5 работни дни след монтажа",
      "Прозрачен отчет за всяка ваша препоръка",
    ],

    audienceTitle: "За кого е тази програма",
    audienceSubtitle:
      "Ако работите с хора, които ремонтират, обзавеждат или продават имот във Варна — клиент за климатик имате почти всеки месец.",
    audience: [
      {
        label: "Прорабе и строителни фирми",
        desc: "Обектът ви е готов — ние идваме с климатиците, монтираме и затваряме точката от чеклиста.",
      },
      {
        label: "Риелтори и брокери",
        desc: "Купувачът след сделката пита за климатик. Препоръката ви става реални 10%.",
      },
      {
        label: "Дизайнери на интериор",
        desc: "Скрит монтаж, канален климатик, мулти-сплит — даваме спец и каталог, не товарим клиента.",
      },
      {
        label: "Домоуправители",
        desc: "Цял вход с климатици на 3 години — повтарящ се бизнес: монтаж + годишна профилактика.",
      },
      {
        label: "Електро- и ВиК-майстори",
        desc: "Виждате клиента първи. Свържете — ние затваряме поръчката, вие взимате процента.",
      },
      {
        label: "Управители на офиси и хотели",
        desc: "Голям обем = по-добри условия + индивидуален план плащане.",
      },
    ],

    howTitle: "Как работи — 3 стъпки",
    howSubtitle: "Без договори върху 20 страници и без бюрокрация.",
    steps: [
      {
        title: "Изпращате клиента",
        desc: "Обаждане, SMS, WhatsApp или попълвате формата по-долу — кажете името и телефона на клиента и какво му трябва.",
      },
      {
        title: "Ние затваряме поръчката",
        desc: "Консултация, оферта, доставка, монтаж — от наша страна. Държим ви в течение на всяка стъпка.",
      },
      {
        title: "Плащаме 10%",
        desc: "До 5 работни дни след подписан приемо-предавателен протокол — по банков превод, в брой или ваучер за услуги.",
      },
    ],

    earningsTitle: "Колко можете да изкарате",
    earningsSubtitle:
      "Реални средни поръчки от последните месеци. Пресметнато върху крайната цена (климатик + монтаж).",
    earningsHeaders: {
      job: "Типична поръчка",
      total: "Обща сума",
      payout: "Вашите 10%",
    },
    earnings: [
      { job: "Сплит 9–12K BTU + стандартен монтаж", total: "€650", payout: "€65" },
      { job: "Инвертор 18K Daikin/Mitsubishi + монтаж", total: "€1 100", payout: "€110" },
      { job: "Мулти-сплит за 2 стаи", total: "€1 900", payout: "€190" },
      { job: "Мулти-сплит за 3 стаи + допълнения", total: "€2 800", payout: "€280" },
      { job: "Цял апартамент — 3 тела premium", total: "€4 200", payout: "€420" },
    ],
    earningsNote:
      "При 4–6 препоръки на месец — стабилни €400–€900 пасивен доход. Без таван — колкото препоръчате, толкова получавате.",

    whyTitle: "Защо клиентите ви ще останат доволни",
    why: [
      {
        title: "Собствена бригада",
        desc: "Не подизпълнители. Едни и същи майстори във Варна от години — носите им клиент, не лотариен билет.",
      },
      {
        title: "Фиксирани цени",
        desc: "Без 'допълнително установяване на място'. Калкулатор и оферта преди монтажа — клиентът знае точно колко плаща.",
      },
      {
        title: "Daikin, Mitsubishi, Gree — оторизирани",
        desc: "Оригинална гаранция, реални каталози, реални наличности. Без сив пазар.",
      },
      {
        title: "Бърз монтаж",
        desc: "Заявка преди обяд — монтаж в същия ден за Варна. Клиентът не чака седмици.",
      },
    ],

    termsTitle: "Прозрачни условия",
    terms: [
      {
        title: "10% от крайната сума",
        desc: "Изчислява се върху платеното от клиента (климатик + монтаж + допълнения). ДДС вече включено.",
      },
      {
        title: "Без таван и без лимит препоръки",
        desc: "Колкото и клиента да изпратите — всички се броят. Никакви седмични или месечни лимити.",
      },
      {
        title: "Плащане в 5 работни дни",
        desc: "След подписан приемо-предавателен протокол. Банков превод, в брой или ваучер за наши услуги.",
      },
      {
        title: "Атрибуция по телефон",
        desc: "Клиентът се закрепва за вас по телефонния номер, който подадете. Валидно 90 дни.",
      },
      {
        title: "Без скрита смяна на цени",
        desc: "Цената за клиента е същата, която намира в сайта. Вашата комисионна не я повишава.",
      },
      {
        title: "Можете да наблюдавате статуса",
        desc: "По заявка — споделяме къде е поръчката (контакт / оферта / монтаж / завършена) през Telegram бота.",
      },
    ],

    formTitle: "Започнете партньорството",
    formSubtitle:
      "Попълнете формата — ще ви се обадим в рамките на 1 час и ще обясним 3 неща за 5 минути.",
    form: {
      name: "Име",
      namePh: "Иван Петров",
      phone: "Телефон",
      email: "Email (по желание)",
      emailPh: "you@example.com",
      profession: "Каква е дейността ви",
      professionOptions: [
        "Прораб / строителна фирма",
        "Риелтор / брокер",
        "Дизайнер на интериор",
        "Домоуправител",
        "Електро- / ВиК-майстор",
        "Управител на офис / хотел",
        "Друго",
      ],
      volume: "Очакван брой препоръки / месец",
      volumeOptions: ["1–3", "4–10", "10+", "Голям обект (наведнъж)"],
      message: "Кратко за вас (по желание)",
      messagePh: "С какви обекти работите, район, кога мислите за първа препоръка…",
      submit: "Изпрати заявка",
      submitting: "Изпращане…",
      successTitle: "Получихме заявката!",
      successText:
        "Ще ви се обадим в рамките на 1 час. Препоръчваме да отговорите — обикновено сме в обекти и звъним веднъж.",
      errorText: "Нещо се обърка. Опитайте отново или ни звъннете директно.",
      required: "Задължително поле",
      reassurance: "Без ангажимент. Първото обаждане е 5 минути.",
      privacy:
        "Данните ви не се споделят с трети страни и се използват само за партньорската програма.",
    },

    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Трябва ли да съм юридическо лице?",
        a: "Не. Работим с физически лица, ЕТ и фирми. За плащане над 1000 € месечно препоръчваме фактура (помагаме с шаблон).",
      },
      {
        q: "Какво ако клиентът се обади сам, без да ме спомене?",
        a: "Затова закачаме по телефон. Дайте ни телефона на клиента предварително — закрепваме за вас за 90 дни. Без това, за съжаление, не можем да гарантираме атрибуция.",
      },
      {
        q: "Какво плащате — пари или ваучери?",
        a: "Вие избирате: банков превод (по подразбиране), в брой при среща във Варна, или ваучер за наши услуги (профилактика, монтаж) на 110% от номинала.",
      },
      {
        q: "Има ли минимум?",
        a: "Не. Една препоръка — една комисионна. Колко често — зависи от вас.",
      },
      {
        q: "Какво ако клиентът се откаже след оферта?",
        a: "Комисионна се изплаща само за завършени поръчки (подписан протокол). Ако клиентът се откаже — нищо лошо, опитваме отново след 1–2 месеца.",
      },
    ],

    finalTitle: "Хайде да започнем",
    finalSubtitle:
      "Едно обаждане — и сте в програмата. Без договори, без депозити, без сложности.",
    finalCta: "Заявка за партньорство",
  },

  en: {
    metaTitle:
      "Partner Program 10% — Pesnopoets Clima Varna | Foremen, Realtors, Designers",
    metaDescription:
      "Recommend our AC units and installation in Varna — earn 10% of every completed order. Transparent terms, payout within 5 business days, no caps.",
    badge: "Partnership",
    h1: "Earn 10% of every order you send our way",
    subtitle:
      "We're looking for long-term partners in Varna: foremen, real estate agents, interior designers, building managers, construction firms. You send us the client — we deliver, install, and service. You get 10% of the total.",
    ctaPrimary: "Apply to partner with us",
    ctaSecondary: "Video call before you commit",
    highlights: [
      "10% of every completed order — no caps",
      "Paid within 5 business days after install",
      "Transparent reporting on every lead you send",
    ],

    audienceTitle: "Who this program is for",
    audienceSubtitle:
      "If you work with people renovating, furnishing, or selling property in Varna — an AC client lands in your lap almost every month.",
    audience: [
      {
        label: "Foremen & construction firms",
        desc: "Job site is ready — we arrive with the units, install, and close that item on your punch list.",
      },
      {
        label: "Real estate agents",
        desc: "After closing, buyers ask about AC. Your recommendation becomes a real 10%.",
      },
      {
        label: "Interior designers",
        desc: "Concealed install, ducted, multi-split — we provide spec sheets and catalogs, no burden on the client.",
      },
      {
        label: "Building managers",
        desc: "An entire building re-installed every 3 years — recurring revenue: install + annual service.",
      },
      {
        label: "Electricians & plumbers",
        desc: "You see the client first. Refer — we close the order, you keep your cut.",
      },
      {
        label: "Office & hotel managers",
        desc: "Larger volume = better terms + custom payout schedule.",
      },
    ],

    howTitle: "How it works — 3 steps",
    howSubtitle: "No 20-page contracts, no bureaucracy.",
    steps: [
      {
        title: "You send the client",
        desc: "A call, SMS, WhatsApp, or the form below — give us their name, phone, and what they need.",
      },
      {
        title: "We close the order",
        desc: "Consultation, quote, delivery, install — on us. We keep you posted at every step.",
      },
      {
        title: "We pay you 10%",
        desc: "Within 5 business days of a signed handover — bank transfer, cash, or service voucher.",
      },
    ],

    earningsTitle: "How much you can earn",
    earningsSubtitle:
      "Real average orders from recent months. Commission is on the final paid price (unit + install).",
    earningsHeaders: { job: "Typical order", total: "Total", payout: "Your 10%" },
    earnings: [
      { job: "9–12K BTU split + standard install", total: "€650", payout: "€65" },
      { job: "18K BTU Daikin/Mitsubishi inverter + install", total: "€1,100", payout: "€110" },
      { job: "Multi-split for 2 rooms", total: "€1,900", payout: "€190" },
      { job: "Multi-split for 3 rooms + extras", total: "€2,800", payout: "€280" },
      { job: "Whole apartment — 3 premium units", total: "€4,200", payout: "€420" },
    ],
    earningsNote:
      "At 4–6 referrals/month — a steady €400–€900 passive income. No cap — the more you refer, the more you earn.",

    whyTitle: "Why your clients will be happy",
    why: [
      {
        title: "Our own crew",
        desc: "No subcontractors. Same installers in Varna for years — you're sending a client to a known team, not a lottery.",
      },
      {
        title: "Fixed prices",
        desc: "No 'we'll adjust on site'. A calculator and written quote before install — the client knows exactly what they pay.",
      },
      {
        title: "Daikin, Mitsubishi, Gree — authorized",
        desc: "Genuine warranty, real catalogs, real stock. No grey market.",
      },
      {
        title: "Fast install",
        desc: "Order before noon — same-day install for Varna. The client doesn't wait weeks.",
      },
    ],

    termsTitle: "Transparent terms",
    terms: [
      {
        title: "10% of the final paid sum",
        desc: "Calculated on what the client paid (unit + install + extras). VAT already included.",
      },
      {
        title: "No caps, no referral limits",
        desc: "Send as many as you can — all count. No weekly or monthly limits.",
      },
      {
        title: "Paid in 5 business days",
        desc: "After signed handover. Bank transfer, cash, or a voucher for our services.",
      },
      {
        title: "Attribution by phone number",
        desc: "The client is locked to you by the phone number you submit. Valid for 90 days.",
      },
      {
        title: "No hidden price changes",
        desc: "The client's price is the same one shown on our site. Your commission does not inflate it.",
      },
      {
        title: "You can track status",
        desc: "On request — we share where the order stands (contact / quote / install / done) via our Telegram bot.",
      },
    ],

    formTitle: "Start the partnership",
    formSubtitle:
      "Fill in the form — we'll call you within 1 hour and walk through 3 things in 5 minutes.",
    form: {
      name: "Name",
      namePh: "John Smith",
      phone: "Phone",
      email: "Email (optional)",
      emailPh: "you@example.com",
      profession: "What you do",
      professionOptions: [
        "Foreman / construction firm",
        "Real estate agent",
        "Interior designer",
        "Building manager",
        "Electrician / plumber",
        "Office / hotel manager",
        "Other",
      ],
      volume: "Expected referrals / month",
      volumeOptions: ["1–3", "4–10", "10+", "Large single site"],
      message: "A line about you (optional)",
      messagePh: "What kind of projects you work on, area of Varna, when you expect your first referral…",
      submit: "Submit",
      submitting: "Submitting…",
      successTitle: "Got it!",
      successText:
        "We'll call you within 1 hour. Please pick up — we're usually on-site and call only once.",
      errorText: "Something went wrong. Try again or call us directly.",
      required: "Required",
      reassurance: "No commitment. First call is 5 minutes.",
      privacy:
        "Your data is not shared with third parties — used only for the partner program.",
    },

    faqTitle: "Frequently asked",
    faq: [
      {
        q: "Do I need to be a registered business?",
        a: "No. We work with individuals, sole traders, and companies. For payouts over €1,000/month we recommend an invoice (we help with a template).",
      },
      {
        q: "What if the client calls us themselves without mentioning me?",
        a: "That's why we attribute by phone. Send us the client's phone first — we lock them to you for 90 days. Without that we unfortunately can't guarantee attribution.",
      },
      {
        q: "What do you pay — cash or vouchers?",
        a: "Your choice: bank transfer (default), cash in person in Varna, or a voucher for our services (maintenance, install) at 110% of face value.",
      },
      {
        q: "Is there a minimum?",
        a: "No. One referral = one commission. Frequency is up to you.",
      },
      {
        q: "What if the client backs out after a quote?",
        a: "Commission is paid only for completed orders (signed handover). If a client walks — no hard feelings, we try again in 1–2 months.",
      },
    ],

    finalTitle: "Let's get started",
    finalSubtitle:
      "One call — and you're in. No contracts, no deposits, no fine print.",
    finalCta: "Apply to partner",
  },

  ru: {
    metaTitle:
      "Партнёрская программа 10% — Песнопоец Клима Варна | Прорабам, риелторам, дизайнерам",
    metaDescription:
      "Рекомендуете наши кондиционеры и монтаж в Варне — получаете 10% с каждого выполненного заказа. Прозрачные условия, выплата за 5 дней, без лимитов.",
    badge: "Партнёрство",
    h1: "10% с каждого заказа — за вашу рекомендацию",
    subtitle:
      "Ищем долгосрочных партнёров в Варне: прорабы, риелторы, дизайнеры интерьера, домоуправители, строительные фирмы. Вы приводите клиента — мы поставляем, монтируем и обслуживаем. Вы получаете 10% от итоговой суммы.",
    ctaPrimary: "Заявка на партнёрство",
    ctaSecondary: "Видеозвонок до подписания",
    highlights: [
      "10% с каждого закрытого заказа — без лимитов",
      "Выплата за 5 рабочих дней после монтажа",
      "Прозрачный отчёт по каждой вашей рекомендации",
    ],

    audienceTitle: "Кому подходит программа",
    audienceSubtitle:
      "Если вы работаете с теми, кто ремонтирует, обставляет или продаёт недвижимость в Варне — клиент на кондиционер у вас почти каждый месяц.",
    audience: [
      {
        label: "Прорабы и строительные фирмы",
        desc: "Объект готов — мы приезжаем с кондиционерами, монтируем, закрываем пункт чек-листа.",
      },
      {
        label: "Риелторы и брокеры",
        desc: "После сделки покупатель спрашивает про кондёр. Ваша рекомендация = реальные 10%.",
      },
      {
        label: "Дизайнеры интерьера",
        desc: "Скрытый монтаж, канальник, мульти-сплит — даём спецификации и каталог, не грузим клиента.",
      },
      {
        label: "Домоуправители",
        desc: "Целый подъезд с кондиционерами раз в 3 года — повторный бизнес: монтаж + ежегодная профилактика.",
      },
      {
        label: "Электрики и сантехники",
        desc: "Вы видите клиента первым. Передайте — мы закрываем заказ, вы получаете процент.",
      },
      {
        label: "Управляющие офисов и отелей",
        desc: "Большой объём = лучшие условия + индивидуальный график выплат.",
      },
    ],

    howTitle: "Как это работает — 3 шага",
    howSubtitle: "Без 20 страниц договора и бюрократии.",
    steps: [
      {
        title: "Передаёте клиента",
        desc: "Звонок, SMS, WhatsApp или форма ниже — имя клиента, телефон, что нужно.",
      },
      {
        title: "Мы закрываем заказ",
        desc: "Консультация, расчёт, доставка, монтаж — на нас. Держим вас в курсе на каждом этапе.",
      },
      {
        title: "Платим 10%",
        desc: "За 5 рабочих дней после подписанного акта приёмки — банковский перевод, наличные или ваучер.",
      },
    ],

    earningsTitle: "Сколько можно заработать",
    earningsSubtitle:
      "Реальные средние заказы за последние месяцы. Процент считается с итоговой цены (кондиционер + монтаж).",
    earningsHeaders: {
      job: "Типичный заказ",
      total: "Итог",
      payout: "Ваши 10%",
    },
    earnings: [
      { job: "Сплит 9–12K BTU + стандартный монтаж", total: "€650", payout: "€65" },
      { job: "Инвертор 18K Daikin/Mitsubishi + монтаж", total: "€1 100", payout: "€110" },
      { job: "Мульти-сплит на 2 комнаты", total: "€1 900", payout: "€190" },
      { job: "Мульти-сплит на 3 комнаты + допы", total: "€2 800", payout: "€280" },
      { job: "Квартира целиком — 3 premium блока", total: "€4 200", payout: "€420" },
    ],
    earningsNote:
      "При 4–6 рекомендациях в месяц — стабильные €400–€900 пассивного дохода. Без потолка — сколько привели, столько и получили.",

    whyTitle: "Почему ваши клиенты останутся довольны",
    why: [
      {
        title: "Своя бригада",
        desc: "Не субподряд. Одни и те же монтажники в Варне годами — вы отправляете клиента к команде, а не в лотерею.",
      },
      {
        title: "Фиксированные цены",
        desc: "Без 'уточним на месте'. Калькулятор и письменный счёт до монтажа — клиент знает точную цену.",
      },
      {
        title: "Daikin, Mitsubishi, Gree — официально",
        desc: "Заводская гарантия, реальные каталоги, реальный склад. Без серого рынка.",
      },
      {
        title: "Быстрый монтаж",
        desc: "Заявка до обеда — монтаж в тот же день по Варне. Клиент не ждёт неделями.",
      },
    ],

    termsTitle: "Прозрачные условия",
    terms: [
      {
        title: "10% от итоговой суммы",
        desc: "Считается с того, что заплатил клиент (кондиционер + монтаж + допы). НДС уже включён.",
      },
      {
        title: "Без потолка и лимита рекомендаций",
        desc: "Сколько привели — все идут в зачёт. Никаких недельных или месячных лимитов.",
      },
      {
        title: "Выплата за 5 рабочих дней",
        desc: "После подписанного акта приёмки. Банк, наличные или ваучер на наши услуги.",
      },
      {
        title: "Атрибуция по телефону",
        desc: "Клиент закрепляется за вами по номеру, который вы передадите. Действует 90 дней.",
      },
      {
        title: "Без скрытого подъёма цены",
        desc: "Цена клиенту — та же, что на сайте. Ваш процент её не повышает.",
      },
      {
        title: "Можно отслеживать статус",
        desc: "По запросу — даём доступ к статусу заказа (контакт / счёт / монтаж / закрыт) через Telegram бот.",
      },
    ],

    formTitle: "Начнём партнёрство",
    formSubtitle:
      "Заполните форму — перезвоним в течение часа и объясним 3 вещи за 5 минут.",
    form: {
      name: "Имя",
      namePh: "Иван Петров",
      phone: "Телефон",
      email: "Email (по желанию)",
      emailPh: "you@example.com",
      profession: "Кем вы работаете",
      professionOptions: [
        "Прораб / строительная фирма",
        "Риелтор / брокер",
        "Дизайнер интерьера",
        "Домоуправитель",
        "Электрик / сантехник",
        "Управляющий офисом / отелем",
        "Другое",
      ],
      volume: "Сколько рекомендаций в месяц ожидаете",
      volumeOptions: ["1–3", "4–10", "10+", "Один крупный объект"],
      message: "Пара слов о себе (по желанию)",
      messagePh: "С какими объектами работаете, район, когда первая рекомендация…",
      submit: "Отправить заявку",
      submitting: "Отправка…",
      successTitle: "Заявка получена!",
      successText:
        "Перезвоним в течение часа. Просим взять трубку — мы обычно в объектах и звоним один раз.",
      errorText: "Что-то пошло не так. Попробуйте ещё раз или позвоните нам.",
      required: "Обязательное поле",
      reassurance: "Без обязательств. Первый звонок — 5 минут.",
      privacy:
        "Ваши данные не передаём третьим сторонам — используем только для партнёрской программы.",
    },

    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Нужно ли быть юрлицом?",
        a: "Нет. Работаем с физлицами, ИП и фирмами. При выплатах >€1000/мес рекомендуем счёт-фактуру (поможем с шаблоном).",
      },
      {
        q: "Что если клиент позвонит сам, без упоминания меня?",
        a: "Поэтому привязываем по телефону. Передайте номер клиента заранее — фиксируем за вами на 90 дней. Без этого, к сожалению, атрибуцию не гарантируем.",
      },
      {
        q: "Чем платите — деньги или ваучеры?",
        a: "На ваш выбор: банковский перевод (по умолчанию), наличные при встрече в Варне или ваучер на наши услуги (профилактика, монтаж) по курсу 110% от номинала.",
      },
      {
        q: "Минимум есть?",
        a: "Нет. Одна рекомендация — одна выплата. Частоту определяете вы.",
      },
      {
        q: "Что если клиент откажется после счёта?",
        a: "Выплата только за выполненные заказы (подписан акт). Если клиент передумал — не страшно, попробуем через 1–2 месяца.",
      },
    ],

    finalTitle: "Поехали",
    finalSubtitle:
      "Один звонок — и вы в программе. Без договоров, депозитов и мелкого шрифта.",
    finalCta: "Заявка на партнёрство",
  },

  ua: {
    metaTitle:
      "Партнерська програма 10% — Песнопоец Клима Варна | Прорабам, ріелторам, дизайнерам",
    metaDescription:
      "Рекомендуєте наші кондиціонери та монтаж у Варні — отримуєте 10% з кожного виконаного замовлення. Прозорі умови, виплата за 5 днів, без лімітів.",
    badge: "Партнерство",
    h1: "10% з кожного замовлення — за вашу рекомендацію",
    subtitle:
      "Шукаємо довгострокових партнерів у Варні: прорабів, ріелторів, дизайнерів інтер'єру, керівників будинків, будівельні фірми. Ви приводите клієнта — ми постачаємо, монтуємо й обслуговуємо. Ви отримуєте 10% від підсумкової суми.",
    ctaPrimary: "Заявка на партнерство",
    ctaSecondary: "Відеодзвінок до підпису",
    highlights: [
      "10% з кожного закритого замовлення — без лімітів",
      "Виплата за 5 робочих днів після монтажу",
      "Прозорий звіт по кожній вашій рекомендації",
    ],

    audienceTitle: "Кому підходить програма",
    audienceSubtitle:
      "Якщо ви працюєте з тими, хто робить ремонт, обставляє чи продає нерухомість у Варні — клієнт на кондиціонер у вас майже щомісяця.",
    audience: [
      {
        label: "Прорабі та будівельні фірми",
        desc: "Об'єкт готовий — ми приїжджаємо з кондиціонерами, монтуємо, закриваємо пункт чек-листа.",
      },
      {
        label: "Ріелтори та брокери",
        desc: "Після угоди покупець питає про кондиціонер. Ваша рекомендація = реальні 10%.",
      },
      {
        label: "Дизайнери інтер'єру",
        desc: "Прихований монтаж, канальник, мульти-спліт — даємо специфікації й каталог, не вантажимо клієнта.",
      },
      {
        label: "Керівники будинків",
        desc: "Цілий під'їзд із кондиціонерами раз на 3 роки — повторний бізнес: монтаж + щорічна профілактика.",
      },
      {
        label: "Електрики та сантехніки",
        desc: "Ви бачите клієнта першим. Передайте — ми закриваємо замовлення, ви отримуєте відсоток.",
      },
      {
        label: "Керуючі офісами й готелями",
        desc: "Великий обсяг = кращі умови + індивідуальний графік виплат.",
      },
    ],

    howTitle: "Як це працює — 3 кроки",
    howSubtitle: "Без 20 сторінок договору й бюрократії.",
    steps: [
      {
        title: "Передаєте клієнта",
        desc: "Дзвінок, SMS, WhatsApp або форма нижче — ім'я клієнта, телефон, що потрібно.",
      },
      {
        title: "Ми закриваємо замовлення",
        desc: "Консультація, розрахунок, доставка, монтаж — на нас. Тримаємо вас у курсі на кожному етапі.",
      },
      {
        title: "Платимо 10%",
        desc: "За 5 робочих днів після підписаного акта — банк, готівка або ваучер.",
      },
    ],

    earningsTitle: "Скільки можна заробити",
    earningsSubtitle:
      "Реальні середні замовлення за останні місяці. Відсоток рахується з підсумкової ціни (кондиціонер + монтаж).",
    earningsHeaders: {
      job: "Типове замовлення",
      total: "Разом",
      payout: "Ваші 10%",
    },
    earnings: [
      { job: "Спліт 9–12K BTU + стандартний монтаж", total: "€650", payout: "€65" },
      { job: "Інвертор 18K Daikin/Mitsubishi + монтаж", total: "€1 100", payout: "€110" },
      { job: "Мульти-спліт на 2 кімнати", total: "€1 900", payout: "€190" },
      { job: "Мульти-спліт на 3 кімнати + допи", total: "€2 800", payout: "€280" },
      { job: "Квартира повністю — 3 premium блоки", total: "€4 200", payout: "€420" },
    ],
    earningsNote:
      "При 4–6 рекомендаціях на місяць — стабільні €400–€900 пасивного доходу. Без стелі — скільки привели, стільки й отримали.",

    whyTitle: "Чому клієнти будуть задоволені",
    why: [
      {
        title: "Власна бригада",
        desc: "Не субпідряд. Одні й ті самі монтажники у Варні роками — ви відправляєте клієнта до команди, а не в лотерею.",
      },
      {
        title: "Фіксовані ціни",
        desc: "Без 'уточнимо на місці'. Калькулятор і письмовий рахунок до монтажу — клієнт знає точну ціну.",
      },
      {
        title: "Daikin, Mitsubishi, Gree — офіційно",
        desc: "Заводська гарантія, реальні каталоги, реальний склад. Без сірого ринку.",
      },
      {
        title: "Швидкий монтаж",
        desc: "Заявка до обіду — монтаж того ж дня по Варні. Клієнт не чекає тижнями.",
      },
    ],

    termsTitle: "Прозорі умови",
    terms: [
      {
        title: "10% від підсумкової суми",
        desc: "Рахується з того, що заплатив клієнт (кондиціонер + монтаж + допи). ПДВ уже включено.",
      },
      {
        title: "Без стелі й ліміту рекомендацій",
        desc: "Скільки привели — усі йдуть у залік. Жодних тижневих чи місячних лімітів.",
      },
      {
        title: "Виплата за 5 робочих днів",
        desc: "Після підписаного акта. Банк, готівка або ваучер на наші послуги.",
      },
      {
        title: "Атрибуція за телефоном",
        desc: "Клієнт закріплюється за вами за номером, який ви передасте. Діє 90 днів.",
      },
      {
        title: "Без прихованого підняття ціни",
        desc: "Ціна клієнту — та сама, що на сайті. Ваш відсоток її не підвищує.",
      },
      {
        title: "Можна відстежувати статус",
        desc: "На запит — даємо доступ до статусу замовлення (контакт / рахунок / монтаж / закрито) через Telegram бот.",
      },
    ],

    formTitle: "Почнемо партнерство",
    formSubtitle:
      "Заповніть форму — передзвонимо протягом години й пояснимо 3 речі за 5 хвилин.",
    form: {
      name: "Ім'я",
      namePh: "Іван Петренко",
      phone: "Телефон",
      email: "Email (за бажанням)",
      emailPh: "you@example.com",
      profession: "Ким ви працюєте",
      professionOptions: [
        "Прораб / будівельна фірма",
        "Ріелтор / брокер",
        "Дизайнер інтер'єру",
        "Керівник будинку",
        "Електрик / сантехнік",
        "Керуючий офісом / готелем",
        "Інше",
      ],
      volume: "Скільки рекомендацій на місяць очікуєте",
      volumeOptions: ["1–3", "4–10", "10+", "Один великий об'єкт"],
      message: "Пара слів про себе (за бажанням)",
      messagePh: "З якими об'єктами працюєте, район, коли перша рекомендація…",
      submit: "Надіслати заявку",
      submitting: "Надсилання…",
      successTitle: "Заявку отримали!",
      successText:
        "Передзвонимо протягом години. Будь ласка, візьміть слухавку — ми зазвичай на об'єктах і телефонуємо один раз.",
      errorText: "Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.",
      required: "Обов'язкове поле",
      reassurance: "Без зобов'язань. Перший дзвінок — 5 хвилин.",
      privacy:
        "Ваші дані не передаємо третім сторонам — використовуємо лише для партнерської програми.",
    },

    faqTitle: "Часті питання",
    faq: [
      {
        q: "Потрібно бути юрособою?",
        a: "Ні. Працюємо з фізособами, ФОП і компаніями. При виплатах >€1000/міс рекомендуємо рахунок (допоможемо з шаблоном).",
      },
      {
        q: "А якщо клієнт зателефонує сам, без згадки про мене?",
        a: "Саме тому прив'язуємо за телефоном. Передайте номер клієнта заздалегідь — фіксуємо за вами на 90 днів. Без цього, на жаль, атрибуцію не гарантуємо.",
      },
      {
        q: "Чим платите — гроші чи ваучери?",
        a: "На ваш вибір: банк (за замовчуванням), готівка при зустрічі у Варні, або ваучер на наші послуги (профілактика, монтаж) за курсом 110% від номіналу.",
      },
      {
        q: "Мінімум є?",
        a: "Ні. Одна рекомендація — одна виплата. Частоту визначаєте ви.",
      },
      {
        q: "А якщо клієнт відмовиться після рахунка?",
        a: "Виплата лише за виконані замовлення (підписаний акт). Якщо клієнт передумав — нічого страшного, спробуємо через 1–2 місяці.",
      },
    ],

    finalTitle: "Поїхали",
    finalSubtitle:
      "Один дзвінок — і ви у програмі. Без договорів, депозитів і дрібного шрифту.",
    finalCta: "Заявка на партнерство",
  },
};

// Audience icons for cards 4–6 (first 3 use photo portraits instead).
const AUDIENCE_ICONS = [HardHat, Home, Paintbrush, Building2, Hammer, Key];

// Photo portraits for the first 3 audience cards — bigger emotional pull.
const AUDIENCE_PHOTOS: (string | null)[] = [
  "/images/partners/foreman.jpg",
  "/images/partners/realtor.jpg",
  "/images/partners/designer.jpg",
  null,
  null,
  null,
];

const AUDIENCE_PHOTO_ALT: Record<Locale, string[]> = {
  bg: [
    "Прораб на обект във Варна",
    "Риелтор в апартамент с морски изглед",
    "Дизайнер на интериор в студио",
  ],
  en: [
    "Foreman at a Varna construction site",
    "Real estate agent in an apartment with sea view",
    "Interior designer in studio",
  ],
  ru: [
    "Прораб на объекте в Варне",
    "Риелтор в квартире с видом на море",
    "Дизайнер интерьера в студии",
  ],
  ua: [
    "Прораб на об'єкті у Варні",
    "Ріелтор у квартирі з видом на море",
    "Дизайнер інтер'єру у студії",
  ],
};

// ─────────────────────────────────────────────────────────────────────
//  METADATA
// ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = pickLocale(rawLocale);
  const c = COPY[locale];

  const hreflangMap: Record<Locale, string> = {
    bg: "bg",
    en: "en",
    ru: "ru",
    ua: "uk",
  };
  const languages: Record<string, string> = {};
  for (const l of SUPPORTED) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/partneri`;
  }
  languages["x-default"] = `${SITE_URL}/bg/partneri`;

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/partneri`,
      languages,
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${SITE_URL}/${locale}/partneri`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return SUPPORTED.map((l) => ({ locale: l }));
}

// ─────────────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────────────

export default async function PartnersPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = pickLocale(rawLocale);
  const c = COPY[locale];

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: c.h1,
        item: `${SITE_URL}/${locale}/partneri`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="bg-background text-foreground">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white">
          {/* subtle pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-xs sm:text-sm font-medium ring-1 ring-white/20 mb-5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                {c.badge}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {c.h1}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
                {c.subtitle}
              </p>

              {/* Highlights */}
              <ul className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl">
                {c.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2.5 bg-white/10 backdrop-blur rounded-xl p-3.5 ring-1 ring-white/15"
                  >
                    <CheckCircle2
                      className="w-5 h-5 text-white shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#partner-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary font-semibold rounded-lg shadow-sm hover:bg-white/90 transition min-h-[48px]"
                >
                  {c.ctaPrimary}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur text-white font-medium rounded-lg ring-1 ring-white/20 hover:bg-white/15 transition min-h-[48px]"
                >
                  {c.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {c.audienceTitle}
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {c.audienceSubtitle}
            </p>
          </div>
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.audience.map((a, i) => {
              const photo = AUDIENCE_PHOTOS[i];
              const Icon = AUDIENCE_ICONS[i] || Users;
              const photoAlt = AUDIENCE_PHOTO_ALT[locale][i] || a.label;
              return (
                <div
                  key={a.label}
                  className="group rounded-2xl border border-border/60 bg-white overflow-hidden hover:border-primary/40 hover:shadow-sm transition flex flex-col"
                >
                  {photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={photo}
                        alt={photoAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    {!photo && (
                      <div className="w-11 h-11 rounded-xl bg-primary-light/60 flex items-center justify-center mb-4">
                        <Icon
                          className="w-5 h-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-foreground">
                      {a.label}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-muted/40 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {c.howTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {c.howSubtitle}
              </p>
            </div>
            <ol className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="relative rounded-2xl bg-white border border-border/60 p-6"
                >
                  <div className="absolute -top-4 left-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                    {i + 1}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* EARNINGS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-success-light/60 flex items-center justify-center shrink-0">
              <Banknote
                className="w-5 h-5 sm:w-6 sm:h-6 text-success"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {c.earningsTitle}
              </h2>
              <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-2xl">
                {c.earningsSubtitle}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 sm:px-6 py-3">
                    {c.earningsHeaders.job}
                  </th>
                  <th className="text-right font-semibold px-4 sm:px-6 py-3 tabular-nums">
                    {c.earningsHeaders.total}
                  </th>
                  <th className="text-right font-semibold px-4 sm:px-6 py-3 tabular-nums">
                    {c.earningsHeaders.payout}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.earnings.map((row, i) => (
                  <tr
                    key={row.job}
                    className={i % 2 === 1 ? "bg-muted/30" : undefined}
                  >
                    <td className="px-4 sm:px-6 py-3.5 text-foreground">
                      {row.job}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-muted-foreground tabular-nums">
                      {row.total}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-success font-bold tabular-nums">
                      {row.payout}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {c.earningsNote}
          </p>
        </section>

        {/* WHY */}
        <section className="bg-muted/40 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground max-w-3xl">
              {c.whyTitle}
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.why.map((w, i) => {
                const icons = [ShieldCheck, Receipt, Sparkles, Clock];
                const Icon = icons[i] || ShieldCheck;
                return (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-border/60 bg-white p-5 flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-light/60 flex items-center justify-center shrink-0">
                      <Icon
                        className="w-5 h-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {w.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {w.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TERMS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground max-w-3xl">
            {c.termsTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.terms.map((t) => (
              <li
                key={t.title}
                className="rounded-2xl border border-border/60 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-success shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FORM */}
        <section
          id="partner-form"
          className="bg-gradient-to-b from-muted/30 to-background scroll-mt-20 border-t border-border/40"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light/60 text-primary rounded-full text-xs font-semibold mb-4">
                <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                {COMMISSION_PERCENT}%
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {c.formTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {c.formSubtitle}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-border/60 p-6 sm:p-8 shadow-sm">
              <PartnerForm locale={locale} copy={c.form} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary-light/60 flex items-center justify-center shrink-0">
              <HelpCircle
                className="w-5 h-5 text-primary"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground pt-1">
              {c.faqTitle}
            </h2>
          </div>
          <div className="space-y-3">
            {c.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border/60 bg-white p-5 open:shadow-sm transition"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-base font-semibold text-foreground">
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-primary shrink-0 transition-transform group-open:rotate-45 text-2xl leading-none mt-[-2px]"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-primary-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {c.finalTitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              {c.finalSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#partner-form"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-semibold rounded-lg shadow-sm hover:bg-white/90 transition min-h-[48px]"
              >
                {c.finalCta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <Link
                href={`/${locale}/kontakti`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur text-white font-medium rounded-lg ring-1 ring-white/20 hover:bg-white/15 transition min-h-[48px]"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
