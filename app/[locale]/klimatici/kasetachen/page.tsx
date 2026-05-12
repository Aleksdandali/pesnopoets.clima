import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wrench,
  CalendarClock,
  Compass,
  Square,
  Users,
  Award,
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

const SLUG = "kasetachen";

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
    title: "Касетъчни климатици във Варна — за офиси, ресторанти и магазини",
    description:
      "Касетъчни климатици Daikin, Mitsubishi, Gree, Toshiba във Варна. Монтаж в окачен таван, разпределение на въздуха в 4 посоки. Идеално за офиси, ресторанти и магазини. Доставка и монтаж от наша бригада.",
    h1: "Касетъчни климатици във Варна",
    subtitle:
      "Монтират се в окачения таван, въздухът се разпределя в 4 посоки през лицев панел. Перфектно решение за офиси, ресторанти, магазини и големи стаи (до 80 m²) — равномерно охлаждане без течение в едно конкретно лице.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Касетъчни климатици",
    badge: "4-посочно разпределение на въздуха",
    whyTitle: "Защо касетъчен климатик",
    whySubtitle:
      "Касетъчният климатик подава въздух равномерно в 4 посоки, осигурявайки еднаква температура в цялата стая. Идеално за пространства с маси, бюра и клиенти.",
    whyItems: [
      {
        title: "Равномерно охлаждане",
        desc: "Въздухът излиза в 4 посоки през централен таванен панел. Няма зони с течение или 'мъртви' ъгли — всеки клиент или служител получава еднакъв комфорт.",
      },
      {
        title: "До 80 m² от един уред",
        desc: "Един 24K BTU модел охлажда до 70 m² отворено пространство. За зали 80–120 m² използваме 36K или 48K BTU. По-икономично от няколко стенни сплита.",
      },
      {
        title: "Дискретен дизайн",
        desc: "Виждате само бял лицев панел в окачения таван — никакъв търговски климатик на стената. Запазвате интериора чист и професионален.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японски и качествени азиатски марки. Стандартни 600×600 mm панели се вписват в типичния офис таван от Armstrong.",
      },
    ],
    explainerTitle: "Касетъчен или стенен — кое е подходящо за офис?",
    explainerDesc:
      "За офис до 30 m² стенният сплит често е достатъчен. За по-големи помещения и обекти с клиенти касетъчният е по-добрият избор.",
    explainer: [
      {
        title: "Стенен сплит",
        desc: "По-евтино и по-просто за монтаж. Подходящо за малки офиси, кабинети, магазини до 30 m². Недостатък: въздушният поток е насочен само в една посока — служителят непосредствено под уреда чувства течение, а отдалечените места — по-топло. Външен вид на стената.",
      },
      {
        title: "Касетъчен климатик",
        desc: "Равномерно охлаждане в 4 посоки, перфектно за зали с много клиенти и служители. Скрит в окачения таван — професионален вид. По-висока цена и сложен монтаж, но за пространства 50+ m² това е стандартът. Препоръчваме за ресторанти, магазини, офиси с open-space.",
      },
    ],
    productsTitle: "Популярни касетъчни модели",
    productsSubtitle:
      "Подбраните модели са най-търсени за офиси, ресторанти и магазини във Варна. Цените са фиксирани и включват ДДС. Монтажът се изчислява според обекта.",
    productsCta: "Вижте всички касетъчни модели",
    installTitle: "Монтаж на касетъчен климатик",
    installDesc:
      "Касетъчният монтаж изисква готов окачен таван (Armstrong, гипсокартон или алуминиев), достатъчно място над него (мин. 35 cm) и точно позициониране в центъра на стаята за равномерно разпределение на въздуха.",
    installItems: [
      "Безплатен оглед и оферта",
      "Монтаж 12–24K BTU — от 380 €",
      "Монтаж 36–48K BTU — от 580 €",
      "12 месеца гаранция на труда",
    ],
    installCta: "Вижте монтаж и цени",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Профилактика на касетъчен климатик от 75 € — почистване на филтри и изпарител, проверка на хладилния агент, тест на вентилатора. За търговски обекти препоръчваме 2 пъти годишно.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е касетъчен климатик?",
        a: "Касетъчният климатик е вътрешно тяло, което се монтира в окачения таван. Въздухът излиза в 4 посоки през лицев панел, осигурявайки равномерно охлаждане. Виждате само бял или черен панел в тавана — самият уред е скрит.",
      },
      {
        q: "За какви помещения е подходящ касетъчен климатик?",
        a: "Касетъчният е оптимален за офиси над 40 m², ресторанти, магазини, конферентни зали и хотелски лобита. За домашна употреба — подходящ за големи холове 50+ m² с окачен таван. За малки стаи (под 30 m²) стенният сплит е по-икономичен.",
      },
      {
        q: "Каква площ охлажда касетъчен климатик?",
        a: "12K BTU — до 25 m². 18K BTU — до 40 m². 24K BTU — до 60 m². 36K BTU — до 90 m². 48K BTU — до 120 m². В обекти с много клиенти, прозорци или електроника избираме модел с 20–30% по-голяма мощност.",
      },
      {
        q: "Колко струва касетъчен климатик във Варна?",
        a: "Базови 12–18K BTU — от 1 300 €. Премиум Daikin/Mitsubishi 18–24K BTU — от 1 900 €. Мощни 36–48K BTU за големи зали — от 3 000 €. Цените са с ДДС, без монтаж. Монтаж — допълнително 380–700 € според обекта.",
      },
      {
        q: "Може ли да се монтира касетъчен в готов окачен таван?",
        a: "Да — стандартните 600×600 mm панели се вписват директно в Armstrong таван. За гипсокартонов таван правим прецизен изрез. Изисква се мин. 35 cm място над тавана за самото тяло и тръбите. Препоръчваме оглед преди оферта.",
      },
      {
        q: "Колко издържа касетъчен климатик?",
        a: "При професионален монтаж и редовна годишна профилактика — 12–15 години. В търговски обекти (ресторанти, магазини) уредите работят 12+ часа на ден, затова препоръчваме профилактика 2 пъти годишно за запазване на ефективността.",
      },
    ],
    ctaTitle: "Касетъчен климатик за вашия обект?",
    ctaDesc:
      "Свържете се с нас — ще направим безплатен оглед, ще предложим модел според размера и натоварването на помещението.",
    ctaPrimary: "Вижте касетъчни модели",
    ctaSecondary: "Поискайте оферта",
  },
  en: {
    title: "Cassette ACs in Varna — for Offices, Restaurants and Shops",
    description:
      "Cassette air conditioners Daikin, Mitsubishi, Gree, Toshiba in Varna. Suspended-ceiling installation, 4-way airflow distribution. Ideal for offices, restaurants and shops. Delivery and installation by our team.",
    h1: "Cassette Air Conditioners in Varna",
    subtitle:
      "Installed in a suspended ceiling, air is distributed in 4 directions through a face panel. Perfect solution for offices, restaurants, shops and large rooms (up to 80 m²) — even cooling without drafts on a single occupant.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Cassette ACs",
    badge: "4-way airflow distribution",
    whyTitle: "Why a cassette AC",
    whySubtitle:
      "A cassette AC supplies air evenly in 4 directions, ensuring uniform temperature throughout the room. Ideal for spaces with desks, tables and customers.",
    whyItems: [
      {
        title: "Even cooling",
        desc: "Air exits in 4 directions through a central ceiling panel. No drafts or 'dead' corners — every customer or employee gets the same comfort.",
      },
      {
        title: "Up to 80 m² from one unit",
        desc: "A 24K BTU model cools up to 70 m² of open space. For halls 80–120 m² we use 36K or 48K BTU. More economical than several wall splits.",
      },
      {
        title: "Discreet design",
        desc: "You see only a white face panel in the suspended ceiling — no commercial AC on the wall. The interior stays clean and professional.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Japanese premium and quality Asian brands. Standard 600×600 mm panels fit a typical Armstrong office ceiling.",
      },
    ],
    explainerTitle: "Cassette or wall split — which suits an office?",
    explainerDesc:
      "For an office up to 30 m² a wall split is often enough. For larger rooms and customer-facing spaces a cassette is the better choice.",
    explainer: [
      {
        title: "Wall split",
        desc: "Cheaper and simpler to install. Suitable for small offices, cabinets, shops up to 30 m². Drawback: airflow is directed in one direction — staff right under the unit feel a draft, distant spots are warmer. Visible on the wall.",
      },
      {
        title: "Cassette AC",
        desc: "Even 4-way cooling, perfect for halls with many customers and staff. Concealed in the ceiling — professional look. Higher price and complex install, but for 50+ m² spaces it's the standard. Recommended for restaurants, shops, open-space offices.",
      },
    ],
    productsTitle: "Popular cassette models",
    productsSubtitle:
      "Selected models are most popular for offices, restaurants and shops in Varna. Prices are fixed and include VAT. Installation is calculated per site.",
    productsCta: "View all cassette models",
    installTitle: "Cassette AC installation",
    installDesc:
      "Cassette installation requires a finished suspended ceiling (Armstrong, drywall or aluminum), enough space above (min. 35 cm) and precise positioning in the center of the room for even airflow.",
    installItems: [
      "Free site visit and quote",
      "Installation 12–24K BTU — from €380",
      "Installation 36–48K BTU — from €580",
      "12 months workmanship warranty",
    ],
    installCta: "See installation pricing",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Cassette AC maintenance from €75 — filter and evaporator cleaning, refrigerant check, fan test. For commercial sites we recommend twice-yearly maintenance.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is a cassette AC?",
        a: "A cassette AC is an indoor unit installed in a suspended ceiling. Air exits in 4 directions through a face panel, providing uniform cooling. You see only a white or black panel in the ceiling — the unit itself is hidden.",
      },
      {
        q: "What spaces are cassette ACs suitable for?",
        a: "Cassette is optimal for offices over 40 m², restaurants, shops, conference rooms and hotel lobbies. For home use — suitable for large living rooms 50+ m² with a suspended ceiling. For small rooms (under 30 m²) a wall split is more economical.",
      },
      {
        q: "What area does a cassette AC cool?",
        a: "12K BTU — up to 25 m². 18K BTU — up to 40 m². 24K BTU — up to 60 m². 36K BTU — up to 90 m². 48K BTU — up to 120 m². In sites with many customers, windows or electronics, we choose a unit with 20–30% extra capacity.",
      },
      {
        q: "How much does a cassette AC cost in Varna?",
        a: "Entry-level 12–18K BTU — from €1,300. Premium Daikin/Mitsubishi 18–24K BTU — from €1,900. Powerful 36–48K BTU for large halls — from €3,000. Prices include VAT, excluding installation. Installation — additional €380–700 depending on the site.",
      },
      {
        q: "Can a cassette be installed in an existing suspended ceiling?",
        a: "Yes — standard 600×600 mm panels fit directly into an Armstrong ceiling. For a drywall ceiling we make a precise cutout. Min. 35 cm space above the ceiling is needed for the unit and pipes. We recommend a site visit before quoting.",
      },
      {
        q: "How long does a cassette AC last?",
        a: "With professional installation and regular annual maintenance — 12–15 years. In commercial sites (restaurants, shops) units run 12+ hours a day, so we recommend twice-yearly maintenance to preserve efficiency.",
      },
    ],
    ctaTitle: "Cassette AC for your project?",
    ctaDesc:
      "Contact us — we'll do a free site visit and propose a model based on the room size and load.",
    ctaPrimary: "View cassette models",
    ctaSecondary: "Request a quote",
  },
  ru: {
    title: "Кассетные кондиционеры в Варне — для офисов, ресторанов и магазинов",
    description:
      "Кассетные кондиционеры Daikin, Mitsubishi, Gree, Toshiba в Варне. Монтаж в подвесном потолке, распределение воздуха в 4 стороны. Идеально для офисов, ресторанов и магазинов. Доставка и монтаж нашей бригадой.",
    h1: "Кассетные кондиционеры в Варне",
    subtitle:
      "Монтируются в подвесном потолке, воздух распределяется в 4 стороны через лицевую панель. Идеальное решение для офисов, ресторанов, магазинов и больших комнат (до 80 м²) — равномерное охлаждение без сквозняка на одного человека.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Кассетные кондиционеры",
    badge: "4-стороннее распределение воздуха",
    whyTitle: "Зачем кассетный кондиционер",
    whySubtitle:
      "Кассетный кондиционер равномерно подаёт воздух в 4 стороны, обеспечивая одинаковую температуру по всей комнате. Идеально для пространств со столами, рабочими местами и клиентами.",
    whyItems: [
      {
        title: "Равномерное охлаждение",
        desc: "Воздух выходит в 4 стороны через центральную потолочную панель. Нет зон со сквозняком или 'мёртвых' углов — каждый клиент или сотрудник получает одинаковый комфорт.",
      },
      {
        title: "До 80 м² от одного блока",
        desc: "Один 24K BTU охлаждает до 70 м² открытого пространства. Для залов 80–120 м² используем 36K или 48K BTU. Экономичнее нескольких настенных сплитов.",
      },
      {
        title: "Дискретный дизайн",
        desc: "Видна только белая лицевая панель в подвесном потолке — никакого торгового кондиционера на стене. Интерьер остаётся чистым и профессиональным.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японские и качественные азиатские марки. Стандартные панели 600×600 мм вписываются в типичный офисный потолок Armstrong.",
      },
    ],
    explainerTitle: "Кассетный или настенный — что подходит для офиса?",
    explainerDesc:
      "Для офиса до 30 м² настенного сплита часто достаточно. Для больших помещений и объектов с клиентами кассетный — лучший выбор.",
    explainer: [
      {
        title: "Настенный сплит",
        desc: "Дешевле и проще в монтаже. Подходит для маленьких офисов, кабинетов, магазинов до 30 м². Минус: поток воздуха направлен только в одну сторону — сотрудник прямо под блоком чувствует сквозняк, дальние места — теплее. Виден на стене.",
      },
      {
        title: "Кассетный кондиционер",
        desc: "Равномерное 4-стороннее охлаждение, идеально для залов с большим количеством клиентов и сотрудников. Скрыт в потолке — профессиональный вид. Цена выше и монтаж сложнее, но для пространств 50+ м² это стандарт. Рекомендуем для ресторанов, магазинов, open-space офисов.",
      },
    ],
    productsTitle: "Популярные кассетные модели",
    productsSubtitle:
      "Подобранные модели — самые востребованные для офисов, ресторанов и магазинов в Варне. Цены фиксированные и включают НДС. Монтаж рассчитывается по объекту.",
    productsCta: "Все кассетные модели",
    installTitle: "Монтаж кассетного кондиционера",
    installDesc:
      "Кассетный монтаж требует готового подвесного потолка (Armstrong, гипсокартон или алюминий), достаточного места над ним (мин. 35 см) и точного позиционирования в центре комнаты для равномерного распределения воздуха.",
    installItems: [
      "Бесплатный выезд и расчёт",
      "Монтаж 12–24K BTU — от 380 €",
      "Монтаж 36–48K BTU — от 580 €",
      "12 месяцев гарантии на работу",
    ],
    installCta: "Цены на монтаж",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Профилактика кассетного кондиционера от 75 € — чистка фильтров и испарителя, проверка хладагента, тест вентилятора. Для коммерческих объектов рекомендуем 2 раза в год.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое кассетный кондиционер?",
        a: "Кассетный кондиционер — это внутренний блок, который монтируется в подвесном потолке. Воздух выходит в 4 стороны через лицевую панель, обеспечивая равномерное охлаждение. Видна только белая или чёрная панель в потолке — сам блок скрыт.",
      },
      {
        q: "Для каких помещений подходит кассетный кондиционер?",
        a: "Кассетный оптимален для офисов более 40 м², ресторанов, магазинов, конференц-залов и гостиничных лобби. Для дома — подходит для больших гостиных 50+ м² с подвесным потолком. Для маленьких комнат (до 30 м²) настенный сплит экономичнее.",
      },
      {
        q: "Какую площадь охлаждает кассетный кондиционер?",
        a: "12K BTU — до 25 м². 18K BTU — до 40 м². 24K BTU — до 60 м². 36K BTU — до 90 м². 48K BTU — до 120 м². На объектах с большим количеством клиентов, окнами или электроникой выбираем модель с запасом мощности 20–30%.",
      },
      {
        q: "Сколько стоит кассетный кондиционер в Варне?",
        a: "Базовые 12–18K BTU — от 1 300 €. Премиум Daikin/Mitsubishi 18–24K BTU — от 1 900 €. Мощные 36–48K BTU для больших залов — от 3 000 €. Цены с НДС, без монтажа. Монтаж — дополнительно 380–700 € по объекту.",
      },
      {
        q: "Можно ли монтировать кассетный в готовый подвесной потолок?",
        a: "Да — стандартные панели 600×600 мм вписываются прямо в потолок Armstrong. Для гипсокартонного потолка делаем точный вырез. Нужно мин. 35 см над потолком для блока и труб. Рекомендуем выезд перед расчётом.",
      },
      {
        q: "Сколько служит кассетный кондиционер?",
        a: "При профессиональном монтаже и регулярной годовой профилактике — 12–15 лет. В коммерческих объектах (рестораны, магазины) блоки работают 12+ часов в день, поэтому рекомендуем профилактику 2 раза в год для сохранения эффективности.",
      },
    ],
    ctaTitle: "Кассетный кондиционер для вашего объекта?",
    ctaDesc:
      "Свяжитесь с нами — сделаем бесплатный выезд, предложим модель под размер и нагрузку помещения.",
    ctaPrimary: "Кассетные модели",
    ctaSecondary: "Заказать расчёт",
  },
  ua: {
    title: "Касетні кондиціонери у Варні — для офісів, ресторанів і магазинів",
    description:
      "Касетні кондиціонери Daikin, Mitsubishi, Gree, Toshiba у Варні. Монтаж у підвісній стелі, розподіл повітря в 4 сторони. Ідеально для офісів, ресторанів і магазинів. Доставка та монтаж нашою бригадою.",
    h1: "Касетні кондиціонери у Варні",
    subtitle:
      "Монтуються у підвісній стелі, повітря розподіляється в 4 сторони через лицьову панель. Ідеальне рішення для офісів, ресторанів, магазинів та великих кімнат (до 80 м²) — рівномірне охолодження без протягу на одну людину.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Касетні кондиціонери",
    badge: "4-стороннє розподілення повітря",
    whyTitle: "Навіщо касетний кондиціонер",
    whySubtitle:
      "Касетний кондиціонер рівномірно подає повітря в 4 сторони, забезпечуючи однакову температуру по всій кімнаті. Ідеально для просторів зі столами, робочими місцями та клієнтами.",
    whyItems: [
      {
        title: "Рівномірне охолодження",
        desc: "Повітря виходить у 4 сторони через центральну стельову панель. Немає зон зі протягом або 'мертвих' кутів — кожен клієнт чи співробітник отримує однаковий комфорт.",
      },
      {
        title: "До 80 м² від одного блока",
        desc: "Один 24K BTU охолоджує до 70 м² відкритого простору. Для залів 80–120 м² використовуємо 36K або 48K BTU. Економніше за кілька настінних сплітів.",
      },
      {
        title: "Дискретний дизайн",
        desc: "Видно лише білу лицьову панель у підвісній стелі — жодного торгового кондиціонера на стіні. Інтер'єр залишається чистим і професійним.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Преміум японські та якісні азійські марки. Стандартні панелі 600×600 мм вписуються у типову офісну стелю Armstrong.",
      },
    ],
    explainerTitle: "Касетний чи настінний — що підходить для офісу?",
    explainerDesc:
      "Для офісу до 30 м² настінного спліта часто достатньо. Для більших приміщень та об'єктів з клієнтами касетний — кращий вибір.",
    explainer: [
      {
        title: "Настінний спліт",
        desc: "Дешевше і простіше в монтажі. Підходить для маленьких офісів, кабінетів, магазинів до 30 м². Мінус: потік повітря направлений лише в одну сторону — співробітник прямо під блоком відчуває протяг, дальші місця — тепліше. Видно на стіні.",
      },
      {
        title: "Касетний кондиціонер",
        desc: "Рівномірне 4-стороннє охолодження, ідеально для залів з великою кількістю клієнтів та співробітників. Прихований у стелі — професійний вигляд. Ціна вища і монтаж складніший, але для просторів 50+ м² це стандарт. Рекомендуємо для ресторанів, магазинів, open-space офісів.",
      },
    ],
    productsTitle: "Популярні касетні моделі",
    productsSubtitle:
      "Підібрані моделі — найзатребуваніші для офісів, ресторанів і магазинів у Варні. Ціни фіксовані та включають ПДВ. Монтаж розраховується за об'єктом.",
    productsCta: "Усі касетні моделі",
    installTitle: "Монтаж касетного кондиціонера",
    installDesc:
      "Касетний монтаж потребує готової підвісної стелі (Armstrong, гіпсокартон чи алюміній), достатнього місця над нею (мін. 35 см) та точного позиціонування в центрі кімнати для рівномірного розподілу повітря.",
    installItems: [
      "Безкоштовний виїзд і розрахунок",
      "Монтаж 12–24K BTU — від 380 €",
      "Монтаж 36–48K BTU — від 580 €",
      "12 місяців гарантії на роботу",
    ],
    installCta: "Ціни на монтаж",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Профілактика касетного кондиціонера від 75 € — чищення фільтрів та випарника, перевірка холодоагенту, тест вентилятора. Для комерційних об'єктів рекомендуємо 2 рази на рік.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке касетний кондиціонер?",
        a: "Касетний кондиціонер — це внутрішній блок, який монтується у підвісній стелі. Повітря виходить у 4 сторони через лицьову панель, забезпечуючи рівномірне охолодження. Видно лише білу або чорну панель у стелі — сам блок прихований.",
      },
      {
        q: "Для яких приміщень підходить касетний кондиціонер?",
        a: "Касетний оптимальний для офісів понад 40 м², ресторанів, магазинів, конференц-залів та готельних лобі. Для дому — підходить для великих віталень 50+ м² з підвісною стелею. Для маленьких кімнат (до 30 м²) настінний спліт економніший.",
      },
      {
        q: "Яку площу охолоджує касетний кондиціонер?",
        a: "12K BTU — до 25 м². 18K BTU — до 40 м². 24K BTU — до 60 м². 36K BTU — до 90 м². 48K BTU — до 120 м². На об'єктах з великою кількістю клієнтів, вікнами чи електронікою обираємо модель із запасом потужності 20–30%.",
      },
      {
        q: "Скільки коштує касетний кондиціонер у Варні?",
        a: "Базові 12–18K BTU — від 1 300 €. Преміум Daikin/Mitsubishi 18–24K BTU — від 1 900 €. Потужні 36–48K BTU для великих залів — від 3 000 €. Ціни з ПДВ, без монтажу. Монтаж — додатково 380–700 € за об'єктом.",
      },
      {
        q: "Чи можна монтувати касетний у готову підвісну стелю?",
        a: "Так — стандартні панелі 600×600 мм вписуються прямо у стелю Armstrong. Для гіпсокартонної стелі робимо точний виріз. Потрібно мін. 35 см над стелею для блока і труб. Рекомендуємо виїзд перед розрахунком.",
      },
      {
        q: "Скільки служить касетний кондиціонер?",
        a: "При професійному монтажі та регулярній річній профілактиці — 12–15 років. У комерційних об'єктах (ресторани, магазини) блоки працюють 12+ годин на день, тому рекомендуємо профілактику 2 рази на рік для збереження ефективності.",
      },
    ],
    ctaTitle: "Касетний кондиціонер для вашого об'єкта?",
    ctaDesc:
      "Зв'яжіться з нами — зробимо безкоштовний виїзд, запропонуємо модель під розмір і навантаження приміщення.",
    ctaPrimary: "Касетні моделі",
    ctaSecondary: "Замовити розрахунок",
  },
};

const whyIcons = [Compass, Square, Users, Award] as const;

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

export default async function KasetachenCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("subgroup_code", "20_КАСЕТЪЧЕН.ТИП");
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
      lowPrice: "1300",
      highPrice: "5500",
      offerCount: "12",
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
