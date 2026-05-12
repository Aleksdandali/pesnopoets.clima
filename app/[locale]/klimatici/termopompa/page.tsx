import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wrench,
  CalendarClock,
  TrendingDown,
  Flame,
  Snowflake,
  Euro,
  Droplets,
  Box,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";

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

const SLUG = "termopompa";

const copy: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
    breadcrumbHome: string;
    breadcrumbCatalog: string;
    breadcrumbCurrent: string;
    badge: string;
    whyTitle: string;
    whySubtitle: string;
    whyItems: { title: string; desc: string }[];
    explainerTitle: string;
    explainerDesc: string;
    explainer: { title: string; desc: string }[];
    productsTitle: string;
    productsSubtitle: string;
    productsCta: string;
    installTitle: string;
    installDesc: string;
    installItems: string[];
    installCta: string;
    maintenanceTitle: string;
    maintenanceDesc: string;
    maintenanceCta: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
    ctaTitle: string;
    ctaDesc: string;
    ctaPrimary: string;
    ctaSecondary: string;
  }
> = {
  bg: {
    title: "Термопомпи във Варна — въздух-вода и моноблок, монтаж и сервиз",
    description:
      "Термопомпи въздух-вода и моноблок във Варна — Daikin Altherma, Mitsubishi Ecodan, Gree Versati. До 70% по-нисък разход за отопление спрямо газ или ток. EU субсидии. Монтаж и сервиз от наша бригада.",
    h1: "Термопомпи във Варна — въздух-вода и моноблок",
    subtitle:
      "Термопомпата е най-ефективният начин за отопление на дом или вила в България днес — до 70% по-нисък разход спрямо газ или електрически котел. Daikin, Mitsubishi, Gree и Hitachi с доставка, монтаж и сервиз от наша бригада във Варна и областта.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Термопомпи",
    badge: "Допустими за EU субсидии",
    whyTitle: "Защо термопомпа",
    whySubtitle:
      "Термопомпата извлича топлина от външния въздух и я пренася в дома ви. Само 1 kW електричество се превръща в 3-5 kW топлина — това е COP коефициент. Резултат: най-нисък разход за отопление спрямо всяка алтернатива.",
    whyItems: [
      {
        title: "До 70% по-малко разход",
        desc: "Спрямо газов или електрически котел. На къща 150 м² разликата е 1500-2500 € годишно при цените за ток в България 2026.",
      },
      {
        title: "Отопление + охлаждане + БГВ",
        desc: "Едно устройство покрива три нужди — зимно отопление, лятно охлаждане и битова гореща вода. Замества газов котел, бойлер и климатик.",
      },
      {
        title: "Работа до –25°C",
        desc: "Модерните инверторни термопомпи (Daikin Altherma 3, Mitsubishi Ecodan Zubadan) работят надеждно до –25°C — повече от достатъчно за всяка точка на България.",
      },
      {
        title: "EU субсидии 35-50%",
        desc: "Чрез програма REPowerEU и националните схеми за енергийна ефективност можете да получите 35-50% безвъзмездна помощ за термопомпа.",
      },
    ],
    explainerTitle: "Моноблок vs сплит термопомпа — каква е разликата?",
    explainerDesc:
      "Двата основни типа термопомпи въздух-вода. Изборът зависи от мястото, бюджета и инсталационните условия.",
    explainer: [
      {
        title: "Моноблок (всичко в едно)",
        desc: "Цялата хладилна верига е във външното тяло — на покрива или до къщата. Вътре има само хидромодул, тръби с антифриз. По-лесен монтаж, не изисква лиценз за работа с фреон. Малко по-висока цена. Подходящ за повечето случаи.",
      },
      {
        title: "Сплит (външно + вътрешно)",
        desc: "Външен компресор + вътрешен хидромодул, свързани с медни тръби и фреон. Тръбопроводът между тях е по-сложен, изисква лицензиран техник. По-достъпна цена. Подходящ за случаи с ограничено външно пространство.",
      },
    ],
    productsTitle: "Налични модели термопомпи",
    productsSubtitle:
      "Подбрахме популярни модели за дом или вила във Варна и областта. Цените са с ДДС, без монтаж. Монтажът се офертира индивидуално в зависимост от мощността и условията на обекта.",
    productsCta: "Вижте всички термопомпи",
    installTitle: "Монтаж на термопомпа",
    installDesc:
      "Монтажът на термопомпа въздух-вода е значително по-сложен от климатик — изисква хидравлична схема, разширителен съд, циркулационна помпа, буферен резервоар. Работим само с лицензирани техници.",
    installItems: [
      "Стандартен моноблок до 12 kW — от 1500 €",
      "Моноблок 14-16 kW — от 1800 €",
      "Хидравлична схема, всички материали включени",
      "12 месеца гаранция на труда",
    ],
    installCta: "Заявка за оферта",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Годишна профилактика на термопомпа — почистване на изпарителя, проверка на хладилната верига, тест на електрониката, проверка на циркулационната помпа. Запазва ефективността и гаранцията.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е термопомпа въздух-вода и как работи?",
        a: "Термопомпата въздух-вода е устройство, което извлича топлина от външния въздух и я пренася във водата на отоплителната ви система (радиатори, подово отопление, бойлер). Работи на същия принцип като хладилника, но в обратна посока — от 1 kW електричество получава 3-5 kW топлина.",
      },
      {
        q: "Колко спестявам с термопомпа спрямо газ или електрически котел?",
        a: "Спрямо електрически котел — 60-70% (термопомпата дава 4 kW топлина за 1 kW ток). Спрямо газов котел — 30-50% в зависимост от цената на газа. На къща 150 м² разликата е 1500-2500 € годишно при сегашните цени.",
      },
      {
        q: "Колко струва термопомпа във Варна?",
        a: "Моноблок 8 kW (за апартамент или малка къща до 100 м²) — от 4500 €. Моноблок 12 kW (къща 150-180 м²) — от 6500 €. Моноблок 16 kW (голяма къща 200-250 м²) — от 8500 €. Цените са с ДДС, без монтаж. Монтажът е 1500-2500 € допълнително.",
      },
      {
        q: "Какъв е COP/SCOP и защо има значение?",
        a: "COP е отношението топлина:електричество в момента на работа. SCOP е средното за целия отоплителен сезон. Качествена термопомпа има SCOP 4.0-4.5 — значи дава 4-4.5 kW топлина за 1 kW ток. Премиум модели (Daikin Altherma 3 R) — до SCOP 5.0.",
      },
      {
        q: "Има ли EU субсидии за термопомпа в България?",
        a: "Да — чрез програма REPowerEU и националните схеми за енергийна ефективност можете да получите 35-50% безвъзмездна помощ. Сумата зависи от региона, типа жилище и енергийния клас. Процедурата изисква проектна документация и сертифициран монтаж — помагаме с двете.",
      },
      {
        q: "Колко време чакам за доставка и монтаж на термопомпа?",
        a: "За налични модели (Daikin, Mitsubishi, Gree) — 7-14 дни доставка. Монтажът отнема 2-4 дни в зависимост от обекта (нова инсталация vs замяна). За субсидирани проекти срокът е по-дълъг заради документацията — 1-2 месеца обща дължина.",
      },
    ],
    ctaTitle: "Готови ли сте за термопомпа?",
    ctaDesc:
      "Свържете се с нас — ще изчислим топлинните загуби на вашия дом, ще предложим подходящ модел и ще оформим документите за субсидия.",
    ctaPrimary: "Вижте термопомпите",
    ctaSecondary: "Попитайте AI консултанта",
  },
  en: {
    title: "Heat Pumps in Varna — Air-to-Water and Monoblock, Installation",
    description:
      "Air-to-water and monoblock heat pumps in Varna — Daikin Altherma, Mitsubishi Ecodan, Gree Versati. Up to 70% lower heating costs vs gas or electric. EU subsidies. Installation and service by our team.",
    h1: "Heat Pumps in Varna — Air-to-Water and Monoblock",
    subtitle:
      "A heat pump is the most efficient way to heat a home or villa in Bulgaria today — up to 70% lower running cost vs a gas or electric boiler. Daikin, Mitsubishi, Gree and Hitachi with delivery, installation and service by our team in Varna.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Heat Pumps",
    badge: "Eligible for EU subsidies",
    whyTitle: "Why a heat pump",
    whySubtitle:
      "A heat pump extracts heat from outdoor air and transfers it into your home. Just 1 kW of electricity becomes 3-5 kW of heat — that's the COP coefficient. Result: lowest heating cost vs any alternative.",
    whyItems: [
      {
        title: "Up to 70% lower running cost",
        desc: "Vs gas or electric boiler. On a 150 m² house the difference is €1500-2500 per year at current Bulgarian electricity prices.",
      },
      {
        title: "Heating + cooling + DHW",
        desc: "One device covers three needs — winter heating, summer cooling and domestic hot water. Replaces gas boiler, water heater and AC.",
      },
      {
        title: "Operates down to –25°C",
        desc: "Modern inverter heat pumps (Daikin Altherma 3, Mitsubishi Ecodan Zubadan) operate reliably to –25°C — more than enough for any part of Bulgaria.",
      },
      {
        title: "EU subsidies 35-50%",
        desc: "Through the REPowerEU programme and national energy efficiency schemes you can receive 35-50% non-refundable aid for a heat pump.",
      },
    ],
    explainerTitle: "Monoblock vs split heat pump — what's the difference?",
    explainerDesc:
      "Two main types of air-to-water heat pumps. The choice depends on location, budget and installation conditions.",
    explainer: [
      {
        title: "Monoblock (all-in-one)",
        desc: "The entire refrigeration circuit is in the outdoor unit — on the roof or beside the house. Inside there's only a hydraulic module with antifreeze pipes. Easier installation, no F-gas licence required. Slightly higher price. Suitable for most cases.",
      },
      {
        title: "Split (outdoor + indoor)",
        desc: "Outdoor compressor + indoor hydraulic module, connected by copper pipes and refrigerant. The piping between them is more complex, requires a licensed technician. More affordable price. Suitable when outdoor space is limited.",
      },
    ],
    productsTitle: "Available heat pump models",
    productsSubtitle:
      "We've selected popular models for a home or villa in Varna. Prices include VAT, excluding installation. Installation is quoted individually based on capacity and site conditions.",
    productsCta: "View all heat pumps",
    installTitle: "Heat pump installation",
    installDesc:
      "Air-to-water heat pump installation is significantly more complex than an AC — it requires a hydraulic schematic, expansion tank, circulation pump, buffer tank. We work only with licensed technicians.",
    installItems: [
      "Standard monoblock up to 12 kW — from €1500",
      "Monoblock 14-16 kW — from €1800",
      "Hydraulic schematic, all materials included",
      "12 months workmanship warranty",
    ],
    installCta: "Request a quote",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Annual heat pump maintenance — evaporator cleaning, refrigeration circuit check, electronics test, circulation pump check. Preserves efficiency and warranty.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is an air-to-water heat pump and how does it work?",
        a: "An air-to-water heat pump extracts heat from outdoor air and transfers it into the water of your heating system (radiators, underfloor heating, water heater). It works on the same principle as a refrigerator but in reverse — from 1 kW of electricity it produces 3-5 kW of heat.",
      },
      {
        q: "How much do I save vs gas or electric boiler?",
        a: "Vs electric boiler — 60-70% (the heat pump produces 4 kW of heat from 1 kW of electricity). Vs gas boiler — 30-50% depending on gas price. On a 150 m² house the difference is €1500-2500 per year at current prices.",
      },
      {
        q: "How much does a heat pump cost in Varna?",
        a: "Monoblock 8 kW (for an apartment or small house up to 100 m²) — from €4500. Monoblock 12 kW (house 150-180 m²) — from €6500. Monoblock 16 kW (large house 200-250 m²) — from €8500. Prices include VAT, excluding installation (€1500-2500 extra).",
      },
      {
        q: "What is COP/SCOP and why does it matter?",
        a: "COP is the heat:electricity ratio at the moment of operation. SCOP is the seasonal average. A quality heat pump has SCOP 4.0-4.5 — it produces 4-4.5 kW of heat per 1 kW of electricity. Premium models (Daikin Altherma 3 R) — up to SCOP 5.0.",
      },
      {
        q: "Are there EU subsidies for heat pumps in Bulgaria?",
        a: "Yes — through the REPowerEU programme and national energy efficiency schemes you can receive 35-50% non-refundable aid. The amount depends on region, dwelling type and energy class. The procedure requires project documentation and certified installation — we help with both.",
      },
      {
        q: "How long does delivery and installation take?",
        a: "For models in stock (Daikin, Mitsubishi, Gree) — 7-14 days delivery. Installation takes 2-4 days depending on the site (new install vs replacement). For subsidised projects the timeline is longer due to paperwork — 1-2 months total.",
      },
    ],
    ctaTitle: "Ready for a heat pump?",
    ctaDesc:
      "Contact us — we'll calculate your home's heat loss, suggest a suitable model, and prepare the subsidy paperwork.",
    ctaPrimary: "View heat pumps",
    ctaSecondary: "Ask the AI consultant",
  },
  ru: {
    title: "Тепловые насосы в Варне — воздух-вода и моноблок, монтаж",
    description:
      "Тепловые насосы воздух-вода и моноблок в Варне — Daikin Altherma, Mitsubishi Ecodan, Gree Versati. До 70% меньше расходов на отопление по сравнению с газом или электричеством. EU субсидии. Монтаж и сервис нашей бригадой.",
    h1: "Тепловые насосы в Варне — воздух-вода и моноблок",
    subtitle:
      "Тепловой насос — самый эффективный способ отопления дома или виллы в Болгарии сегодня. До 70% меньше расходов по сравнению с газовым или электрическим котлом. Daikin, Mitsubishi, Gree и Hitachi с доставкой, монтажом и сервисом нашей бригадой в Варне.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Тепловые насосы",
    badge: "Подходят под EU субсидии",
    whyTitle: "Зачем тепловой насос",
    whySubtitle:
      "Тепловой насос извлекает тепло из наружного воздуха и переносит в дом. Из 1 kW электричества получается 3-5 kW тепла — это коэффициент COP. Результат — самые низкие расходы на отопление по сравнению с любой альтернативой.",
    whyItems: [
      {
        title: "До 70% меньше расходов",
        desc: "По сравнению с газовым или электрическим котлом. На дом 150 м² разница составляет 1500-2500 € в год при текущих ценах на электричество в Болгарии.",
      },
      {
        title: "Отопление + охлаждение + ГВС",
        desc: "Одно устройство покрывает три задачи — зимнее отопление, летнее охлаждение и горячая вода. Заменяет газовый котёл, бойлер и кондиционер.",
      },
      {
        title: "Работа до –25°C",
        desc: "Современные инверторные тепловые насосы (Daikin Altherma 3, Mitsubishi Ecodan Zubadan) надёжно работают до –25°C — более чем достаточно для любой точки Болгарии.",
      },
      {
        title: "EU субсидии 35-50%",
        desc: "Через программу REPowerEU и национальные схемы энергоэффективности можно получить 35-50% безвозвратной помощи на тепловой насос.",
      },
    ],
    explainerTitle: "Моноблок vs сплит тепловой насос — в чём разница?",
    explainerDesc:
      "Два основных типа тепловых насосов воздух-вода. Выбор зависит от места, бюджета и условий монтажа.",
    explainer: [
      {
        title: "Моноблок (всё в одном)",
        desc: "Вся холодильная цепь — во внешнем блоке, на крыше или возле дома. Внутри только гидромодуль с трубами с антифризом. Проще монтаж, не требует лицензии на работу с фреоном. Цена немного выше. Подходит в большинстве случаев.",
      },
      {
        title: "Сплит (внешний + внутренний)",
        desc: "Внешний компрессор + внутренний гидромодуль, соединённые медными трубами и фреоном. Трассировка между ними сложнее, требует лицензированного техника. Цена доступнее. Подходит при ограниченном внешнем пространстве.",
      },
    ],
    productsTitle: "Доступные модели тепловых насосов",
    productsSubtitle:
      "Подобрали популярные модели для дома или виллы в Варне. Цены с НДС, без монтажа. Монтаж рассчитывается индивидуально по мощности и условиям объекта.",
    productsCta: "Все тепловые насосы",
    installTitle: "Монтаж теплового насоса",
    installDesc:
      "Монтаж теплового насоса воздух-вода значительно сложнее монтажа кондиционера — требует гидравлическую схему, расширительный бак, циркуляционный насос, буферный бак. Работаем только с лицензированными техниками.",
    installItems: [
      "Стандартный моноблок до 12 kW — от 1500 €",
      "Моноблок 14-16 kW — от 1800 €",
      "Гидравлическая схема и все материалы включены",
      "12 месяцев гарантии на работу",
    ],
    installCta: "Заявка на оферту",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Годовая профилактика теплового насоса — чистка испарителя, проверка холодильного контура, тест электроники, проверка циркуляционного насоса. Сохраняет эффективность и гарантию.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое тепловой насос воздух-вода и как он работает?",
        a: "Тепловой насос воздух-вода извлекает тепло из наружного воздуха и переносит в воду вашей системы отопления (радиаторы, тёплый пол, бойлер). Работает по тому же принципу что и холодильник, но в обратную сторону — из 1 kW электричества получает 3-5 kW тепла.",
      },
      {
        q: "Сколько экономлю с тепловым насосом против газа или электрокотла?",
        a: "Против электрокотла — 60-70% (тепловой насос даёт 4 kW тепла из 1 kW тока). Против газового котла — 30-50% в зависимости от цены газа. На дом 150 м² разница 1500-2500 € в год при текущих ценах.",
      },
      {
        q: "Сколько стоит тепловой насос в Варне?",
        a: "Моноблок 8 kW (для квартиры или небольшого дома до 100 м²) — от 4500 €. Моноблок 12 kW (дом 150-180 м²) — от 6500 €. Моноблок 16 kW (большой дом 200-250 м²) — от 8500 €. Цены с НДС, без монтажа. Монтаж — 1500-2500 € дополнительно.",
      },
      {
        q: "Что такое COP/SCOP и почему это важно?",
        a: "COP — отношение тепло:электричество в момент работы. SCOP — среднее за весь отопительный сезон. Качественный тепловой насос имеет SCOP 4.0-4.5 — даёт 4-4.5 kW тепла на 1 kW тока. Премиум-модели (Daikin Altherma 3 R) — до SCOP 5.0.",
      },
      {
        q: "Есть ли EU субсидии на тепловой насос в Болгарии?",
        a: "Да — через программу REPowerEU и национальные схемы энергоэффективности можно получить 35-50% безвозвратной помощи. Сумма зависит от региона, типа жилья и энергокласса. Процедура требует проектной документации и сертифицированного монтажа — помогаем с обоими.",
      },
      {
        q: "Сколько ждать доставку и монтаж теплового насоса?",
        a: "Для моделей в наличии (Daikin, Mitsubishi, Gree) — 7-14 дней доставка. Монтаж занимает 2-4 дня в зависимости от объекта (новый монтаж vs замена). Для субсидируемых проектов сроки длиннее из-за документации — 1-2 месяца суммарно.",
      },
    ],
    ctaTitle: "Готовы к тепловому насосу?",
    ctaDesc:
      "Свяжитесь с нами — рассчитаем теплопотери вашего дома, предложим подходящую модель и оформим документы на субсидию.",
    ctaPrimary: "Тепловые насосы",
    ctaSecondary: "Спросите AI консультанта",
  },
  ua: {
    title: "Теплові помпи у Варні — повітря-вода та моноблок, монтаж",
    description:
      "Теплові помпи повітря-вода та моноблок у Варні — Daikin Altherma, Mitsubishi Ecodan, Gree Versati. До 70% менше витрат на опалення проти газу або електрики. EU субсидії. Монтаж і сервіс нашою бригадою.",
    h1: "Теплові помпи у Варні — повітря-вода та моноблок",
    subtitle:
      "Теплова помпа — найефективніший спосіб опалення дому чи вілли в Болгарії сьогодні. До 70% менше витрат проти газового чи електричного котла. Daikin, Mitsubishi, Gree та Hitachi з доставкою, монтажем та сервісом нашою бригадою у Варні.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Теплові помпи",
    badge: "Підходять під EU субсидії",
    whyTitle: "Навіщо теплова помпа",
    whySubtitle:
      "Теплова помпа витягує тепло з зовнішнього повітря та переносить у дім. З 1 kW електрики виходить 3-5 kW тепла — це коефіцієнт COP. Результат — найнижчі витрати на опалення проти будь-якої альтернативи.",
    whyItems: [
      {
        title: "До 70% менше витрат",
        desc: "Проти газового чи електричного котла. На дім 150 м² різниця становить 1500-2500 € на рік за поточних цін на електрику в Болгарії.",
      },
      {
        title: "Опалення + охолодження + ГВП",
        desc: "Один пристрій покриває три задачі — зимове опалення, літнє охолодження та гаряча вода. Замінює газовий котел, бойлер та кондиціонер.",
      },
      {
        title: "Робота до –25°C",
        desc: "Сучасні інверторні теплові помпи (Daikin Altherma 3, Mitsubishi Ecodan Zubadan) надійно працюють до –25°C — більш ніж достатньо для будь-якої точки Болгарії.",
      },
      {
        title: "EU субсидії 35-50%",
        desc: "Через програму REPowerEU та національні схеми енергоефективності можна отримати 35-50% безповоротної допомоги на теплову помпу.",
      },
    ],
    explainerTitle: "Моноблок vs спліт теплова помпа — у чому різниця?",
    explainerDesc:
      "Два основних типи теплових помп повітря-вода. Вибір залежить від місця, бюджету та умов монтажу.",
    explainer: [
      {
        title: "Моноблок (все в одному)",
        desc: "Уся холодильна схема — у зовнішньому блоці, на даху або біля будинку. Усередині лише гідромодуль із трубами з антифризом. Простіший монтаж, не потребує ліцензії на роботу з фреоном. Ціна трохи вища. Підходить у більшості випадків.",
      },
      {
        title: "Спліт (зовнішній + внутрішній)",
        desc: "Зовнішній компресор + внутрішній гідромодуль, з'єднані мідними трубами та фреоном. Прокладка між ними складніша, потребує ліцензованого техніка. Ціна доступніша. Підходить при обмеженому зовнішньому просторі.",
      },
    ],
    productsTitle: "Доступні моделі теплових помп",
    productsSubtitle:
      "Підібрали популярні моделі для дому або вілли у Варні. Ціни з ПДВ, без монтажу. Монтаж розраховується індивідуально за потужністю та умовами об'єкта.",
    productsCta: "Усі теплові помпи",
    installTitle: "Монтаж теплової помпи",
    installDesc:
      "Монтаж теплової помпи повітря-вода значно складніший за монтаж кондиціонера — потребує гідравлічну схему, розширювальний бак, циркуляційний насос, буферний бак. Працюємо лише з ліцензованими техніками.",
    installItems: [
      "Стандартний моноблок до 12 kW — від 1500 €",
      "Моноблок 14-16 kW — від 1800 €",
      "Гідравлічна схема і всі матеріали включені",
      "12 місяців гарантії на роботу",
    ],
    installCta: "Заявка на оферту",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Річна профілактика теплової помпи — чищення випарника, перевірка холодильного контуру, тест електроніки, перевірка циркуляційного насоса. Зберігає ефективність та гарантію.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке теплова помпа повітря-вода і як вона працює?",
        a: "Теплова помпа повітря-вода витягує тепло з зовнішнього повітря і переносить у воду вашої системи опалення (радіатори, тепла підлога, бойлер). Працює за тим же принципом що й холодильник, але у зворотний бік — з 1 kW електрики отримує 3-5 kW тепла.",
      },
      {
        q: "Скільки економлю з тепловою помпою проти газу чи електрокотла?",
        a: "Проти електрокотла — 60-70% (теплова помпа дає 4 kW тепла з 1 kW струму). Проти газового котла — 30-50% залежно від ціни газу. На дім 150 м² різниця 1500-2500 € на рік за поточних цін.",
      },
      {
        q: "Скільки коштує теплова помпа у Варні?",
        a: "Моноблок 8 kW (для квартири або невеликого будинку до 100 м²) — від 4500 €. Моноблок 12 kW (дім 150-180 м²) — від 6500 €. Моноблок 16 kW (великий дім 200-250 м²) — від 8500 €. Ціни з ПДВ, без монтажу. Монтаж — 1500-2500 € додатково.",
      },
      {
        q: "Що таке COP/SCOP і чому це важливо?",
        a: "COP — співвідношення тепло:електрика у момент роботи. SCOP — середнє за весь опалювальний сезон. Якісна теплова помпа має SCOP 4.0-4.5 — дає 4-4.5 kW тепла на 1 kW струму. Преміум-моделі (Daikin Altherma 3 R) — до SCOP 5.0.",
      },
      {
        q: "Чи є EU субсидії на теплову помпу в Болгарії?",
        a: "Так — через програму REPowerEU та національні схеми енергоефективності можна отримати 35-50% безповоротної допомоги. Сума залежить від регіону, типу житла та енергокласу. Процедура потребує проектної документації та сертифікованого монтажу — допомагаємо з обома.",
      },
      {
        q: "Скільки чекати доставку і монтаж теплової помпи?",
        a: "Для моделей у наявності (Daikin, Mitsubishi, Gree) — 7-14 днів доставка. Монтаж займає 2-4 дні залежно від об'єкта (новий монтаж vs заміна). Для субсидованих проектів терміни довші через документацію — 1-2 місяці сумарно.",
      },
    ],
    ctaTitle: "Готові до теплової помпи?",
    ctaDesc:
      "Зв'яжіться з нами — розрахуємо тепловтрати вашого дому, запропонуємо відповідну модель і оформимо документи на субсидію.",
    ctaPrimary: "Теплові помпи",
    ctaSecondary: "Запитайте AI консультанта",
  },
};

const whyIcons = [TrendingDown, Flame, Snowflake, Euro] as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = copy[locale] || copy.bg;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/klimatici/${SLUG}`,
      languages: {
        bg: `${siteUrl}/bg/klimatici/${SLUG}`,
        en: `${siteUrl}/en/klimatici/${SLUG}`,
        ru: `${siteUrl}/ru/klimatici/${SLUG}`,
        uk: `${siteUrl}/ua/klimatici/${SLUG}`,
        "x-default": `${siteUrl}/bg/klimatici/${SLUG}`,
      },
    },
  };
}

export default async function TermopompaCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("group_code", "30_ТЕРМОПОМПИ");
  const catIds = (cats || []).map((c: { id: number }) => c.id);

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, title, title_override, title_en, title_ru, title_ua, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor, refrigerant, stock_size, features, category_id"
    )
    .eq("is_active", true)
    .eq("is_hidden", false)
    .in("category_id", catIds.length ? catIds : [-1])
    .order("price_client", { ascending: true })
    .limit(6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: t.h1,
    description: t.description,
    url: `${siteUrl}/${locale}/klimatici/${SLUG}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "2500",
      highPrice: "12000",
      offerCount: "30",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "City", name: "Варна" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.breadcrumbHome,
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.breadcrumbCatalog,
        item: `${siteUrl}/${locale}/klimatici`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t.breadcrumbCurrent,
        item: `${siteUrl}/${locale}/klimatici/${SLUG}`,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-white">
        <nav
          aria-label="Breadcrumb"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs sm:text-sm text-muted-foreground"
        >
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                {t.breadcrumbHome}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            <li>
              <Link href={`/${locale}/klimatici`} className="hover:text-primary transition-colors">
                {t.breadcrumbCatalog}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            <li className="text-foreground">{t.breadcrumbCurrent}</li>
          </ol>
        </nav>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light/15 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {t.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t.h1}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/klimatici#products`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors"
              >
                {t.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/kontakti`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.whyTitle}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">
              {t.whySubtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.whyItems.map((item, i) => {
                const Icon = whyIcons[i] || Sparkles;
                return (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-border">
                    <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.explainerTitle}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">{t.explainerDesc}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {t.explainer.map((item, i) => {
                const Icon = i === 0 ? Box : Droplets;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-6 border ${
                      i === 0 ? "bg-primary-light/10 border-primary-light/40" : "bg-muted/40 border-border"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {products && products.length > 0 ? (
          <section id="products" className="bg-muted/30 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.productsTitle}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">{t.productsSubtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} currency="EUR" dictionary={dict} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href={`/${locale}/klimatici`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors"
                >
                  {t.productsCta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t.installTitle}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">{t.installDesc}</p>
              <ul className="space-y-2 mb-5">
                {t.installItems.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/montazh`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                {t.installCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                <CalendarClock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t.maintenanceTitle}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed">{t.maintenanceDesc}</p>
              <Link href={`/${locale}/profilaktika`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                {t.maintenanceCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">{t.faqTitle}</h2>
            <div className="space-y-3">
              {t.faq.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-semibold text-foreground pr-2">{item.q}</h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.ctaTitle}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">{t.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/klimatici`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors">
                {t.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/${locale}/kontakti`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
