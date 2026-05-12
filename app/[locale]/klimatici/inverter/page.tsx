import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Snowflake,
  Wind,
  Wrench,
  CalendarClock,
  Zap,
  TrendingDown,
  Volume2,
  Clock,
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

const SLUG = "inverter";

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
    title: "Инверторни климатици във Варна — каталог, цени и монтаж",
    description:
      "Инверторни климатици от Daikin, Mitsubishi, Gree, Toshiba във Варна. Енергиен клас A++/A+++, нисък шум, до 40% по-нисък разход на ток. Доставка и монтаж от наша бригада.",
    h1: "Инверторни климатици във Варна",
    subtitle:
      "Най-ефективният тип климатик за дома и офиса — до 40% по-нисък разход на ток в сравнение с традиционните on/off модели. Над 100 модела от Daikin, Mitsubishi, Gree, Toshiba и Hitachi с доставка и монтаж във Варна.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Инверторни климатици",
    whyTitle: "Защо инверторен климатик",
    whySubtitle:
      "Инверторната технология плавно регулира мощността на компресора вместо постоянно да го включва и изключва. Резултатът — по-малко ток, по-малко шум и по-дълъг живот на уреда.",
    whyItems: [
      {
        title: "До 40% по-малко ток",
        desc: "Реалното спестяване на електроенергия спрямо on/off модели. При интензивна употреба климатикът се изплаща за 2–3 сезона.",
      },
      {
        title: "Стабилна температура",
        desc: "Без скокове ±3°C на всеки 10 минути. Инверторът поддържа зададената температура с точност до 0.5°C през цялото време.",
      },
      {
        title: "От 19 dB шум",
        desc: "Най-тихите модели работят под нивото на тих шепот. Перфектно за спалня — няма да ви събуди.",
      },
      {
        title: "12–15 години живот",
        desc: "DC компресорите на инверторните модели работят значително по-дълго от традиционните — по-малко стрес от честото включване/изключване.",
      },
    ],
    explainerTitle: "Инвертор или on/off — каква е разликата?",
    explainerDesc:
      "On/off климатиците имат само 2 режима — пълна мощност или изключен. Инверторът регулира оборотите на компресора плавно, като педала на колата.",
    explainer: [
      {
        title: "On/off (старо поколение)",
        desc: "Компресорът работи на 100% докато стаята достигне зададената температура, после се изключва. След няколко минути се включва отново. Резултат: висок разход на ток, скокове на температурата, по-голям шум, кратък живот на компресора.",
      },
      {
        title: "Инвертор (модерно поколение)",
        desc: "Компресорът работи плавно — на 30–50% през повечето време, само в началото на 100%. Резултат: до 40% по-малко ток, стабилна температура, тих режим, дълъг живот. Цената е малко по-висока, но се отплаща за 2–3 сезона.",
      },
    ],
    productsTitle: "Популярни инверторни модели",
    productsSubtitle:
      "Подбрахме най-търсените инверторни климатици за апартамент или малка къща във Варна. Цените са фиксирани и включват ДДС. Монтажът е допълнително.",
    productsCta: "Вижте всички инверторни модели",
    installTitle: "Монтаж на инверторен климатик",
    installDesc:
      "Инверторните климатици изискват професионален монтаж с вакуумиране — задължително условие за валидна заводска гаранция. Работим с медна тръба, всички материали и пускане в експлоатация са включени.",
    installItems: [
      "Стандартен монтаж 7–14K BTU — 190 €",
      "Стандартен монтаж 15–24K BTU — 230 €",
      "12 месеца гаранция на труда",
      "Запазваме пълната заводска гаранция",
    ],
    installCta: "Вижте монтаж и цени",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Годишна профилактика от 42 € — почистване на филтри и изпарител, проверка на хладилния агент, тест на компресора. Запазва ефективността и удължава живота с години.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е инверторен климатик и каква е разликата от обикновения?",
        a: "Инверторният климатик плавно регулира оборотите на компресора, докато обикновеният (on/off) работи само на пълна мощност или изключен. Инверторът харчи до 40% по-малко ток, поддържа стабилна температура, по-тих е и трае значително по-дълго.",
      },
      {
        q: "Колко ток спестява инверторен климатик?",
        a: "В реални условия — 25–40% по-малко в сравнение с on/off модел със същата мощност. При интензивна употреба (целогодишно отопление и охлаждане) разликата в сметката за ток за един сезон обикновено покрива надбавката към цената.",
      },
      {
        q: "Колко струва инверторен климатик във Варна?",
        a: "Базови модели 9K BTU (Gree, Toshiba) — от 320 €. Премиум 9K BTU (Daikin, Mitsubishi) — от 350 €. По-големи мощности 18–24K BTU — от 550 €. Цените са с ДДС, без монтаж. Монтажът е 190–230 € в зависимост от мощността.",
      },
      {
        q: "Кои са най-добрите марки инверторни климатици?",
        a: "Японски премиум — Daikin и Mitsubishi (Electric и Heavy). Корейски — LG и Samsung. Китайски качествени — Gree, Hisense, TCL. Изборът зависи от бюджет и предпочитания. Всички водещи марки имат отлична инверторна технология.",
      },
      {
        q: "Колко издържа инверторен климатик?",
        a: "При професионален монтаж и редовна годишна профилактика — 12–15 години и повече. DC компресорите на инверторните модели работят значително по-дълго от традиционните, защото не се стресират от постоянно включване и изключване.",
      },
      {
        q: "Подходящ ли е инверторът за студени зими във Варна?",
        a: "Да — съвременните инвертори работят надеждно до –15°C, а премиум моделите (Daikin Ururu, Mitsubishi Zubadan) — до –25°C. Във Варна, където минималните температури рядко падат под –5°C, всеки инверторен климатик ще работи отлично цяла зима.",
      },
    ],
    ctaTitle: "Готови ли сте за инверторен климатик?",
    ctaDesc:
      "Свържете се с нас — ще предложим модел за вашата стая и бюджет, монтаж в удобен за вас ден.",
    ctaPrimary: "Вижте инверторни модели",
    ctaSecondary: "Попитайте AI консултанта",
  },
  en: {
    title: "Inverter Air Conditioners in Varna — Catalog, Prices, Installation",
    description:
      "Inverter air conditioners from Daikin, Mitsubishi, Gree, Toshiba in Varna. Energy class A++/A+++, low noise, up to 40% lower power consumption. Delivery and installation by our team.",
    h1: "Inverter Air Conditioners in Varna",
    subtitle:
      "The most efficient type of AC for home and office — up to 40% lower power consumption compared to traditional on/off models. Over 100 models from Daikin, Mitsubishi, Gree, Toshiba and Hitachi with delivery and installation in Varna.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Inverter ACs",
    whyTitle: "Why an inverter AC",
    whySubtitle:
      "Inverter technology smoothly regulates compressor power instead of constantly switching it on and off. The result — less power, less noise and longer device life.",
    whyItems: [
      {
        title: "Up to 40% less power",
        desc: "Real electricity savings vs on/off models. With heavy use, the AC pays for itself within 2–3 seasons.",
      },
      {
        title: "Stable temperature",
        desc: "No ±3°C swings every 10 minutes. The inverter holds the set temperature within 0.5°C all the time.",
      },
      {
        title: "From 19 dB noise",
        desc: "The quietest models run below a soft whisper. Perfect for the bedroom — won't wake you up.",
      },
      {
        title: "12–15 years lifespan",
        desc: "DC compressors in inverter models last significantly longer than traditional ones — less stress from frequent on/off cycles.",
      },
    ],
    explainerTitle: "Inverter or on/off — what's the difference?",
    explainerDesc:
      "On/off ACs have only 2 modes — full power or off. The inverter regulates compressor speed smoothly, like a car's accelerator pedal.",
    explainer: [
      {
        title: "On/off (old generation)",
        desc: "Compressor runs at 100% until the room reaches the set temperature, then turns off. A few minutes later it turns on again. Result: high power consumption, temperature swings, more noise, short compressor life.",
      },
      {
        title: "Inverter (modern generation)",
        desc: "Compressor runs smoothly — at 30–50% most of the time, only at 100% at startup. Result: up to 40% less power, stable temperature, quiet mode, long life. The price is slightly higher but pays off in 2–3 seasons.",
      },
    ],
    productsTitle: "Popular inverter models",
    productsSubtitle:
      "We selected the most popular inverter ACs for an apartment or small house in Varna. Prices are fixed and include VAT. Installation is extra.",
    productsCta: "View all inverter models",
    installTitle: "Inverter AC installation",
    installDesc:
      "Inverter ACs require professional installation with vacuuming — a mandatory requirement for valid factory warranty. We use copper pipe, all materials and commissioning are included.",
    installItems: [
      "Standard installation 7–14K BTU — €190",
      "Standard installation 15–24K BTU — €230",
      "12 months workmanship warranty",
      "Full factory warranty preserved",
    ],
    installCta: "See installation pricing",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Annual maintenance from €42 — filter and evaporator cleaning, refrigerant check, compressor test. Preserves efficiency and extends life by years.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is an inverter AC and how is it different from a regular one?",
        a: "An inverter AC smoothly regulates compressor speed, while a regular (on/off) one only runs at full power or is off. The inverter uses up to 40% less power, holds a stable temperature, runs quieter and lasts significantly longer.",
      },
      {
        q: "How much power does an inverter AC save?",
        a: "In real conditions — 25–40% less compared to an on/off model of the same capacity. With heavy use (year-round heating and cooling) the difference in the electricity bill for one season usually covers the price premium.",
      },
      {
        q: "How much does an inverter AC cost in Varna?",
        a: "Entry-level 9K BTU (Gree, Toshiba) — from €320. Premium 9K BTU (Daikin, Mitsubishi) — from €350. Higher capacities 18–24K BTU — from €550. Prices include VAT, excluding installation. Installation is €190–230 depending on capacity.",
      },
      {
        q: "Which are the best inverter AC brands?",
        a: "Japanese premium — Daikin and Mitsubishi (Electric and Heavy). Korean — LG and Samsung. Quality Chinese — Gree, Hisense, TCL. Choice depends on budget and preference. All leading brands have excellent inverter technology.",
      },
      {
        q: "How long does an inverter AC last?",
        a: "With professional installation and regular annual maintenance — 12–15 years and more. DC compressors in inverter models last significantly longer than traditional ones because they aren't stressed by constant on/off cycles.",
      },
      {
        q: "Is the inverter suitable for cold winters in Varna?",
        a: "Yes — modern inverters operate reliably down to –15°C, while premium models (Daikin Ururu, Mitsubishi Zubadan) work down to –25°C. In Varna, where minimum temperatures rarely drop below –5°C, any inverter AC will work excellently all winter.",
      },
    ],
    ctaTitle: "Ready for an inverter AC?",
    ctaDesc:
      "Contact us — we'll suggest a model for your room and budget, with installation on a day that suits you.",
    ctaPrimary: "View inverter models",
    ctaSecondary: "Ask the AI consultant",
  },
  ru: {
    title: "Инверторные кондиционеры в Варне — каталог, цены, монтаж",
    description:
      "Инверторные кондиционеры Daikin, Mitsubishi, Gree, Toshiba в Варне. Класс энергоэффективности A++/A+++, низкий шум, до 40% меньше расхода электричества. Доставка и монтаж нашей бригадой.",
    h1: "Инверторные кондиционеры в Варне",
    subtitle:
      "Самый эффективный тип кондиционера для дома и офиса — до 40% меньше расхода электричества по сравнению с традиционными on/off моделями. Более 100 моделей Daikin, Mitsubishi, Gree, Toshiba и Hitachi с доставкой и монтажом в Варне.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Инверторные кондиционеры",
    whyTitle: "Зачем инверторный кондиционер",
    whySubtitle:
      "Инверторная технология плавно регулирует мощность компрессора вместо постоянного включения и выключения. Результат — меньше тока, меньше шума и более долгий срок службы.",
    whyItems: [
      {
        title: "До 40% меньше тока",
        desc: "Реальная экономия электроэнергии по сравнению с on/off моделями. При интенсивной эксплуатации кондиционер окупается за 2–3 сезона.",
      },
      {
        title: "Стабильная температура",
        desc: "Без скачков ±3°C каждые 10 минут. Инвертор поддерживает заданную температуру с точностью до 0.5°C всё время.",
      },
      {
        title: "От 19 dB шума",
        desc: "Самые тихие модели работают тише шёпота. Идеально для спальни — не разбудит.",
      },
      {
        title: "12–15 лет службы",
        desc: "DC компрессоры инверторных моделей служат значительно дольше традиционных — меньше стресса от частых включений и выключений.",
      },
    ],
    explainerTitle: "Инвертор или on/off — в чём разница?",
    explainerDesc:
      "On/off кондиционеры имеют только 2 режима — полная мощность или выключен. Инвертор регулирует обороты компрессора плавно, как педаль газа в машине.",
    explainer: [
      {
        title: "On/off (старое поколение)",
        desc: "Компрессор работает на 100% пока комната не достигнет заданной температуры, потом выключается. Через несколько минут включается снова. Результат: высокий расход тока, скачки температуры, больше шума, короткий срок службы компрессора.",
      },
      {
        title: "Инвертор (современное поколение)",
        desc: "Компрессор работает плавно — на 30–50% большую часть времени, только в начале на 100%. Результат: до 40% меньше тока, стабильная температура, тихий режим, долгий срок службы. Цена немного выше, но окупается за 2–3 сезона.",
      },
    ],
    productsTitle: "Популярные инверторные модели",
    productsSubtitle:
      "Подобрали самые востребованные инверторные кондиционеры для квартиры или небольшого дома в Варне. Цены фиксированные и включают НДС. Монтаж — дополнительно.",
    productsCta: "Все инверторные модели",
    installTitle: "Монтаж инверторного кондиционера",
    installDesc:
      "Инверторные кондиционеры требуют профессионального монтажа с вакуумированием — обязательное условие для действия заводской гарантии. Работаем с медной трубой, все материалы и пуско-наладка включены.",
    installItems: [
      "Стандартный монтаж 7–14K BTU — 190 €",
      "Стандартный монтаж 15–24K BTU — 230 €",
      "12 месяцев гарантии на работу",
      "Сохраняем полную заводскую гарантию",
    ],
    installCta: "Цены на монтаж",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Годовая профилактика от 42 € — чистка фильтров и испарителя, проверка хладагента, тест компрессора. Сохраняет эффективность и продлевает срок службы.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое инверторный кондиционер и чем отличается от обычного?",
        a: "Инверторный кондиционер плавно регулирует обороты компрессора, а обычный (on/off) работает только на полной мощности или выключен. Инвертор тратит до 40% меньше тока, держит стабильную температуру, работает тише и служит значительно дольше.",
      },
      {
        q: "Сколько электричества экономит инверторный кондиционер?",
        a: "В реальных условиях — 25–40% меньше по сравнению с on/off моделью той же мощности. При интенсивной эксплуатации (круглогодичное отопление и охлаждение) разница в счёте за электричество за один сезон обычно покрывает доплату к цене.",
      },
      {
        q: "Сколько стоит инверторный кондиционер в Варне?",
        a: "Базовые модели 9K BTU (Gree, Toshiba) — от 320 €. Премиум 9K BTU (Daikin, Mitsubishi) — от 350 €. Большая мощность 18–24K BTU — от 550 €. Цены с НДС, без монтажа. Монтаж — 190–230 € в зависимости от мощности.",
      },
      {
        q: "Какие лучшие марки инверторных кондиционеров?",
        a: "Японский премиум — Daikin и Mitsubishi (Electric и Heavy). Корейские — LG и Samsung. Качественные китайские — Gree, Hisense, TCL. Выбор зависит от бюджета и предпочтений. Все ведущие марки имеют отличную инверторную технологию.",
      },
      {
        q: "Сколько служит инверторный кондиционер?",
        a: "При профессиональном монтаже и регулярной годовой профилактике — 12–15 лет и больше. DC компрессоры инверторных моделей служат значительно дольше традиционных, потому что не испытывают стресса от постоянных включений и выключений.",
      },
      {
        q: "Подходит ли инвертор для холодных зим в Варне?",
        a: "Да — современные инверторы надёжно работают до –15°C, а премиум-модели (Daikin Ururu, Mitsubishi Zubadan) — до –25°C. В Варне, где минимальные температуры редко опускаются ниже –5°C, любой инверторный кондиционер будет работать отлично всю зиму.",
      },
    ],
    ctaTitle: "Готовы к инверторному кондиционеру?",
    ctaDesc:
      "Свяжитесь с нами — предложим модель под вашу комнату и бюджет, монтаж в удобный для вас день.",
    ctaPrimary: "Инверторные модели",
    ctaSecondary: "Спросите AI консультанта",
  },
  ua: {
    title: "Інверторні кондиціонери у Варні — каталог, ціни, монтаж",
    description:
      "Інверторні кондиціонери Daikin, Mitsubishi, Gree, Toshiba у Варні. Клас енергоефективності A++/A+++, низький шум, до 40% менше витрати електрики. Доставка та монтаж нашою бригадою.",
    h1: "Інверторні кондиціонери у Варні",
    subtitle:
      "Найефективніший тип кондиціонера для дому та офісу — до 40% менше витрати електрики порівняно з традиційними on/off моделями. Понад 100 моделей Daikin, Mitsubishi, Gree, Toshiba та Hitachi з доставкою та монтажем у Варні.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Інверторні кондиціонери",
    whyTitle: "Навіщо інверторний кондиціонер",
    whySubtitle:
      "Інверторна технологія плавно регулює потужність компресора замість постійного вмикання та вимикання. Результат — менше струму, менше шуму та довший термін служби.",
    whyItems: [
      {
        title: "До 40% менше струму",
        desc: "Реальна економія електроенергії проти on/off моделей. При інтенсивній експлуатації кондиціонер окупається за 2–3 сезони.",
      },
      {
        title: "Стабільна температура",
        desc: "Без стрибків ±3°C кожні 10 хвилин. Інвертор тримає задану температуру з точністю до 0.5°C весь час.",
      },
      {
        title: "Від 19 dB шуму",
        desc: "Найтихіші моделі працюють тихіше за шепіт. Ідеально для спальні — не розбудить.",
      },
      {
        title: "12–15 років служби",
        desc: "DC компресори інверторних моделей служать значно довше за традиційні — менше стресу від частих вмикань і вимикань.",
      },
    ],
    explainerTitle: "Інвертор або on/off — у чому різниця?",
    explainerDesc:
      "On/off кондиціонери мають лише 2 режими — повна потужність або вимкнений. Інвертор регулює оберти компресора плавно, як педаль газу в машині.",
    explainer: [
      {
        title: "On/off (старе покоління)",
        desc: "Компресор працює на 100% поки кімната не досягне заданої температури, потім вимикається. Через кілька хвилин вмикається знову. Результат: висока витрата струму, стрибки температури, більше шуму, короткий термін служби компресора.",
      },
      {
        title: "Інвертор (сучасне покоління)",
        desc: "Компресор працює плавно — на 30–50% більшу частину часу, лише на початку на 100%. Результат: до 40% менше струму, стабільна температура, тихий режим, довгий термін служби. Ціна трохи вища, але окупається за 2–3 сезони.",
      },
    ],
    productsTitle: "Популярні інверторні моделі",
    productsSubtitle:
      "Підібрали найзатребуваніші інверторні кондиціонери для квартири або невеликого будинку у Варні. Ціни фіксовані та включають ПДВ. Монтаж — додатково.",
    productsCta: "Всі інверторні моделі",
    installTitle: "Монтаж інверторного кондиціонера",
    installDesc:
      "Інверторні кондиціонери потребують професійного монтажу з вакуумуванням — обов'язкова умова для дії заводської гарантії. Працюємо з мідною трубою, всі матеріали та пуско-наладка включені.",
    installItems: [
      "Стандартний монтаж 7–14K BTU — 190 €",
      "Стандартний монтаж 15–24K BTU — 230 €",
      "12 місяців гарантії на роботу",
      "Зберігаємо повну заводську гарантію",
    ],
    installCta: "Ціни на монтаж",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Річна профілактика від 42 € — чищення фільтрів та випарника, перевірка холодоагенту, тест компресора. Зберігає ефективність та подовжує термін служби.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке інверторний кондиціонер і чим відрізняється від звичайного?",
        a: "Інверторний кондиціонер плавно регулює оберти компресора, а звичайний (on/off) працює лише на повній потужності або вимкнений. Інвертор витрачає до 40% менше струму, тримає стабільну температуру, працює тихіше та служить значно довше.",
      },
      {
        q: "Скільки електрики економить інверторний кондиціонер?",
        a: "У реальних умовах — 25–40% менше порівняно з on/off моделлю тієї ж потужності. При інтенсивній експлуатації (цілорічне опалення і охолодження) різниця в рахунку за електрику за один сезон зазвичай покриває доплату до ціни.",
      },
      {
        q: "Скільки коштує інверторний кондиціонер у Варні?",
        a: "Базові моделі 9K BTU (Gree, Toshiba) — від 320 €. Преміум 9K BTU (Daikin, Mitsubishi) — від 350 €. Велика потужність 18–24K BTU — від 550 €. Ціни з ПДВ, без монтажу. Монтаж — 190–230 € залежно від потужності.",
      },
      {
        q: "Які найкращі марки інверторних кондиціонерів?",
        a: "Японський преміум — Daikin і Mitsubishi (Electric і Heavy). Корейські — LG і Samsung. Якісні китайські — Gree, Hisense, TCL. Вибір залежить від бюджету та вподобань. Усі провідні марки мають відмінну інверторну технологію.",
      },
      {
        q: "Скільки служить інверторний кондиціонер?",
        a: "При професійному монтажі та регулярній річній профілактиці — 12–15 років і більше. DC компресори інверторних моделей служать значно довше за традиційні, бо не зазнають стресу від постійних вмикань і вимикань.",
      },
      {
        q: "Чи підходить інвертор для холодних зим у Варні?",
        a: "Так — сучасні інвертори надійно працюють до –15°C, а преміум-моделі (Daikin Ururu, Mitsubishi Zubadan) — до –25°C. У Варні, де мінімальні температури рідко опускаються нижче –5°C, будь-який інверторний кондиціонер працюватиме відмінно всю зиму.",
      },
    ],
    ctaTitle: "Готові до інверторного кондиціонера?",
    ctaDesc:
      "Зв'яжіться з нами — запропонуємо модель під вашу кімнату і бюджет, монтаж у зручний для вас день.",
    ctaPrimary: "Інверторні моделі",
    ctaSecondary: "Запитайте AI консультанта",
  },
};

const whyIcons = [TrendingDown, Zap, Volume2, Clock] as const;

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

export default async function InverterCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  // Fetch top 6 inverter products from Bittel categories with group_code "10_ ИНВЕРТОРНИ.КЛ"
  const supabase = await createClient();
  const { data: invertCats } = await supabase
    .from("categories")
    .select("id")
    .eq("group_code", "10_ ИНВЕРТОРНИ.КЛ");
  const catIds = (invertCats || []).map((c: { id: number }) => c.id);

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
      lowPrice: "320",
      highPrice: "1800",
      offerCount: "100",
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
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs sm:text-sm text-muted-foreground"
        >
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link
                href={`/${locale}`}
                className="hover:text-primary transition-colors"
              >
                {t.breadcrumbHome}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            <li>
              <Link
                href={`/${locale}/klimatici`}
                className="hover:text-primary transition-colors"
              >
                {t.breadcrumbCatalog}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            <li className="text-foreground">{t.breadcrumbCurrent}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light/15 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === "bg"
                ? "Енергиен клас A++ / A+++"
                : locale === "en"
                  ? "Energy class A++ / A+++"
                  : locale === "ru"
                    ? "Класс энергоэффективности A++ / A+++"
                    : "Клас енергоефективності A++ / A+++"}
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

        {/* Why */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.whyTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">
              {t.whySubtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.whyItems.map((item, i) => {
                const Icon = whyIcons[i] || Sparkles;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 border border-border"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Explainer: inverter vs on/off */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.explainerTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">
              {t.explainerDesc}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {t.explainer.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 border ${
                    i === 0
                      ? "bg-muted/40 border-border"
                      : "bg-primary-light/10 border-primary-light/40"
                  }`}
                >
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid */}
        {products && products.length > 0 ? (
          <section id="products" className="bg-muted/30 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {t.productsTitle}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-3xl">
                {t.productsSubtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    currency="EUR"
                    dictionary={dict}
                  />
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

        {/* Install + Maintenance */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t.installTitle}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                {t.installDesc}
              </p>
              <ul className="space-y-2 mb-5">
                {t.installItems.map((it, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/montazh`}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                {t.installCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary-light/15 text-primary flex items-center justify-center mb-3">
                <CalendarClock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t.maintenanceTitle}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed">
                {t.maintenanceDesc}
              </p>
              <Link
                href={`/${locale}/profilaktika`}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                {t.maintenanceCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
              {t.faqTitle}
            </h2>
            <div className="space-y-3">
              {t.faq.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-semibold text-foreground pr-2">
                      {item.q}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              {t.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/klimatici`}
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
      </div>
    </>
  );
}
