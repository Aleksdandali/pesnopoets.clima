import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wrench,
  CalendarClock,
  Layers,
  Home,
  Settings2,
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

const SLUG = "multisplit";

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
    title: "Мултисплит климатици във Варна — едно външно за целия дом",
    description:
      "Мултисплит системи Daikin, Mitsubishi, Gree, Toshiba във Варна. Едно външно тяло обслужва 2–5 вътрешни. Спестявате място на фасадата, по-тихо, проектиране и монтаж от наша бригада.",
    h1: "Мултисплит системи във Варна",
    subtitle:
      "Едно външно тяло за 2 до 5 стаи. Идеално за апартаменти и къщи, където няма място за няколко външни на фасадата. Над 25 конфигурации от Daikin, Mitsubishi, Gree и Toshiba с проектиране, доставка и монтаж във Варна.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Мултисплит системи",
    badge: "2–5 вътрешни тела на 1 външно",
    whyTitle: "Защо мултисплит",
    whySubtitle:
      "Мултисплит системата свързва няколко вътрешни тела с едно външно. По-малко място на фасадата, по-малко шум за съседите, единен дизайн на сградата.",
    whyItems: [
      {
        title: "Едно външно за 2–5 стаи",
        desc: "Вместо 3 външни тела на фасадата — само едно. Запазвате чист външен вид на сградата и спестявате място за съседите.",
      },
      {
        title: "Място на фасадата",
        desc: "В апартаменти с малък балкон или ограничения от етажната собственост едно външно тяло е често единственото решение.",
      },
      {
        title: "Независим контрол",
        desc: "Всяка стая има собствен термостат и режим. Можете да охлаждате спалнята и едновременно да отоплявате хола.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Работим с водещи производители — японски премиум, корейски и качествени китайски марки. Подбираме конфигурацията спрямо стаите.",
      },
    ],
    explainerTitle: "Мултисплит или няколко самостоятелни сплит-системи?",
    explainerDesc:
      "Изборът зависи от броя стаи, мястото на фасадата и бюджета. Ето кога мултисплитът е по-добрият вариант, и кога — не.",
    explainer: [
      {
        title: "Няколко самостоятелни сплита",
        desc: "По-евтино за 2 стаи, всеки уред работи независимо — ако едно външно се счупи, другите остават активни. Но: повече външни тела на фасадата, повече тръби, по-сложна естетика. Подходящо когато стаите са далеч една от друга.",
      },
      {
        title: "Мултисплит система",
        desc: "Едно външно за 2–5 вътрешни — чист външен вид, по-малко място, по-тихо за съседите. Цената е по-висока за 2 стаи, но за 3+ става по-изгодна. Внимание: ако външното тяло се повреди, всички вътрешни спират едновременно.",
      },
    ],
    productsTitle: "Популярни мултисплит конфигурации",
    productsSubtitle:
      "Подбраните модели са най-търсени за 2–4 стаи в апартамент или малка къща. Цените са фиксирани и включват ДДС. Монтажът се изчислява според разпределението на стаите.",
    productsCta: "Вижте всички мултисплит модели",
    installTitle: "Монтаж на мултисплит система",
    installDesc:
      "Мултисплитът изисква по-сложен монтаж — повече тръби, прецизно проектиране на трасетата, балансиране на хладилния агент. Препоръчваме посещение преди оферта.",
    installItems: [
      "Безплатен оглед и проект на трасетата",
      "Стандартен монтаж 2 стаи — от 380 €",
      "Стандартен монтаж 3 стаи — от 540 €",
      "12 месеца гаранция на труда",
    ],
    installCta: "Вижте монтаж и цени",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Профилактика на мултисплит система от 78 € (2 вътрешни) — почистване на филтри и изпарители, проверка на хладилния агент във външното тяло, тест на компресора. Запазва ефективността и удължава живота.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е мултисплит климатик и как работи?",
        a: "Мултисплитът свързва няколко вътрешни тела с едно външно — типично 2 до 5 вътрешни на 1 външно. Едно външно тяло компресира хладилния агент, който се разпределя по медни тръби до всяко вътрешно. Всяка стая има отделен термостат и режим.",
      },
      {
        q: "Колко вътрешни тела могат да се свържат към едно външно?",
        a: "Стандартните мултисплит системи поддържат 2, 3, 4 или 5 вътрешни тела. Външното тяло има фиксирана максимална мощност (например 9 kW) — сборът на мощностите на вътрешните не трябва да я превишава. При 5+ стаи е по-добре да се обмисли VRF/VRV система.",
      },
      {
        q: "Може ли да смесвам различни модели вътрешни тела?",
        a: "Да — стенни, касетъчни, канални и колонни вътрешни могат да се свържат към едно външно тяло (от същата серия и марка). Например: стенно в спалнята + касетъчно в хола + канално в коридора. Внимание: всички вътрешни трябва да са от една и съща серия мултисплит.",
      },
      {
        q: "Колко струва мултисплит система във Варна?",
        a: "Мултисплит за 2 стаи (9K + 9K BTU) — от 1 200 €. За 3 стаи — от 1 800 €. За 4 стаи — от 2 500 €. Премиум Daikin/Mitsubishi струва 30–50% повече. Цените са с ДДС, без монтаж. Монтажът зависи от разпределението на стаите.",
      },
      {
        q: "Може ли едновременно да охлаждам една стая и да отоплявам друга?",
        a: "При стандартен мултисплит — не. Системата работи в общ режим (или охлаждане, или отопление) за всички вътрешни. Ако ви трябва едновременна работа в различни режими, е необходима VRF/VRV система с топлообмен — това е професионално решение за големи къщи и офиси.",
      },
      {
        q: "Колко издържа мултисплит системата?",
        a: "При професионален монтаж и редовна годишна профилактика — 12–15 години. Слабото място е компресорът във външното тяло — ако той се повреди, всички вътрешни спират едновременно. Затова препоръчваме годишна профилактика особено след 5-та година.",
      },
    ],
    ctaTitle: "Мултисплит за вашия дом?",
    ctaDesc:
      "Свържете се с нас — ще направим безплатен оглед, ще предложим конфигурация спрямо стаите и бюджета.",
    ctaPrimary: "Вижте мултисплит модели",
    ctaSecondary: "Поискайте оглед",
  },
  en: {
    title: "Multi-Split AC Systems in Varna — One Outdoor Unit for the Whole Home",
    description:
      "Multi-split systems Daikin, Mitsubishi, Gree, Toshiba in Varna. One outdoor unit serves 2–5 indoor units. Save facade space, quieter, design and installation by our team.",
    h1: "Multi-Split AC Systems in Varna",
    subtitle:
      "One outdoor unit for 2 to 5 rooms. Ideal for apartments and houses where there's no room for several outdoor units on the facade. Over 25 configurations from Daikin, Mitsubishi, Gree and Toshiba with design, delivery and installation in Varna.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Multi-Split Systems",
    badge: "2–5 indoor units on 1 outdoor",
    whyTitle: "Why a multi-split",
    whySubtitle:
      "A multi-split system connects several indoor units to one outdoor unit. Less facade space, less noise for neighbors, unified building aesthetics.",
    whyItems: [
      {
        title: "One outdoor for 2–5 rooms",
        desc: "Instead of 3 outdoor units on the facade — just one. You keep a clean exterior look and save space for neighbors.",
      },
      {
        title: "Facade space",
        desc: "In apartments with a small balcony or HOA restrictions, one outdoor unit is often the only solution.",
      },
      {
        title: "Independent control",
        desc: "Each room has its own thermostat and mode. You can cool the bedroom and heat the living room simultaneously*.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "We work with leading manufacturers — Japanese premium, Korean and quality Chinese brands. We pick the configuration to match the rooms.",
      },
    ],
    explainerTitle: "Multi-split or several stand-alone splits?",
    explainerDesc:
      "The choice depends on the number of rooms, facade space and budget. Here's when multi-split is the better option — and when it isn't.",
    explainer: [
      {
        title: "Several stand-alone splits",
        desc: "Cheaper for 2 rooms, each unit runs independently — if one outdoor breaks, the others stay active. But: more outdoor units on the facade, more pipework, more complex aesthetics. Suitable when rooms are far apart.",
      },
      {
        title: "Multi-split system",
        desc: "One outdoor for 2–5 indoor units — clean look, less space, quieter for neighbors. Price is higher for 2 rooms, but for 3+ becomes more economical. Caveat: if the outdoor unit fails, all indoor units stop simultaneously.",
      },
    ],
    productsTitle: "Popular multi-split configurations",
    productsSubtitle:
      "The selected models are most popular for 2–4 rooms in an apartment or small house. Prices are fixed and include VAT. Installation is calculated based on room layout.",
    productsCta: "View all multi-split models",
    installTitle: "Multi-split system installation",
    installDesc:
      "Multi-split requires more complex installation — more pipework, precise route design, refrigerant balancing. We recommend a site visit before quotation.",
    installItems: [
      "Free site visit and route design",
      "Standard installation 2 rooms — from €380",
      "Standard installation 3 rooms — from €540",
      "12 months workmanship warranty",
    ],
    installCta: "See installation pricing",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Multi-split maintenance from €78 (2 indoor units) — filter and evaporator cleaning, refrigerant check at the outdoor unit, compressor test. Preserves efficiency and extends life.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is a multi-split AC and how does it work?",
        a: "A multi-split connects several indoor units to one outdoor unit — typically 2 to 5 indoor units on 1 outdoor. The outdoor unit compresses refrigerant, which is distributed via copper pipes to each indoor unit. Each room has a separate thermostat and mode.",
      },
      {
        q: "How many indoor units can connect to one outdoor?",
        a: "Standard multi-split systems support 2, 3, 4 or 5 indoor units. The outdoor unit has a fixed max capacity (e.g. 9 kW) — the sum of indoor capacities must not exceed it. For 5+ rooms a VRF/VRV system is usually a better fit.",
      },
      {
        q: "Can I mix different indoor unit types?",
        a: "Yes — wall, cassette, ducted and column indoor units can connect to one outdoor (from the same series and brand). For example: wall in the bedroom + cassette in the living room + ducted in the corridor. Note: all indoor units must be from the same multi-split series.",
      },
      {
        q: "How much does a multi-split system cost in Varna?",
        a: "Multi-split for 2 rooms (9K + 9K BTU) — from €1,200. For 3 rooms — from €1,800. For 4 rooms — from €2,500. Premium Daikin/Mitsubishi costs 30–50% more. Prices include VAT, excluding installation. Installation depends on room layout.",
      },
      {
        q: "Can I cool one room and heat another at the same time?",
        a: "On a standard multi-split — no. The system runs in a common mode (either cooling or heating) for all indoor units. If you need simultaneous mixed-mode operation, you need a VRF/VRV heat-recovery system — a professional solution for large houses and offices.",
      },
      {
        q: "How long does a multi-split system last?",
        a: "With professional installation and regular annual maintenance — 12–15 years. The weak link is the compressor in the outdoor unit — if it fails, all indoor units stop simultaneously. We strongly recommend annual maintenance, especially after year 5.",
      },
    ],
    ctaTitle: "Multi-split for your home?",
    ctaDesc:
      "Contact us — we'll do a free site visit and propose a configuration matched to your rooms and budget.",
    ctaPrimary: "View multi-split models",
    ctaSecondary: "Request a site visit",
  },
  ru: {
    title: "Мульти-сплит кондиционеры в Варне — один внешний блок на весь дом",
    description:
      "Мульти-сплит системы Daikin, Mitsubishi, Gree, Toshiba в Варне. Один внешний блок обслуживает 2–5 внутренних. Экономия места на фасаде, тише, проектирование и монтаж нашей бригадой.",
    h1: "Мульти-сплит системы в Варне",
    subtitle:
      "Один внешний блок для 2–5 комнат. Идеально для квартир и домов, где нет места для нескольких внешних блоков на фасаде. Более 25 конфигураций Daikin, Mitsubishi, Gree и Toshiba с проектированием, доставкой и монтажом в Варне.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Мульти-сплит системы",
    badge: "2–5 внутренних на 1 внешний",
    whyTitle: "Зачем мульти-сплит",
    whySubtitle:
      "Мульти-сплит соединяет несколько внутренних блоков с одним внешним. Меньше места на фасаде, меньше шума для соседей, единый дизайн здания.",
    whyItems: [
      {
        title: "Один внешний на 2–5 комнат",
        desc: "Вместо 3 внешних блоков на фасаде — только один. Сохраняете чистый внешний вид здания и экономите место для соседей.",
      },
      {
        title: "Место на фасаде",
        desc: "В квартирах с маленьким балконом или ограничениями ОСМД один внешний блок часто — единственное решение.",
      },
      {
        title: "Независимое управление",
        desc: "У каждой комнаты свой термостат и режим. Можно охлаждать спальню и одновременно отапливать гостиную*.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Работаем с ведущими производителями — японский премиум, корейские и качественные китайские марки. Подбираем конфигурацию под комнаты.",
      },
    ],
    explainerTitle: "Мульти-сплит или несколько отдельных сплитов?",
    explainerDesc:
      "Выбор зависит от количества комнат, места на фасаде и бюджета. Когда мульти-сплит лучше — и когда нет.",
    explainer: [
      {
        title: "Несколько отдельных сплитов",
        desc: "Дешевле для 2 комнат, каждый блок работает независимо — если один внешний сломается, остальные продолжат работать. Но: больше внешних блоков на фасаде, больше трасс, сложнее эстетика. Подходит, когда комнаты далеко друг от друга.",
      },
      {
        title: "Мульти-сплит система",
        desc: "Один внешний на 2–5 внутренних — чистый вид, меньше места, тише для соседей. Цена выше для 2 комнат, но для 3+ становится выгоднее. Внимание: при поломке внешнего блока все внутренние останавливаются одновременно.",
      },
    ],
    productsTitle: "Популярные мульти-сплит конфигурации",
    productsSubtitle:
      "Подобранные модели — самые востребованные для 2–4 комнат в квартире или небольшом доме. Цены фиксированные и включают НДС. Монтаж рассчитывается по планировке комнат.",
    productsCta: "Все мульти-сплит модели",
    installTitle: "Монтаж мульти-сплит системы",
    installDesc:
      "Мульти-сплит требует более сложного монтажа — больше трасс, точное проектирование маршрутов, балансировка хладагента. Рекомендуем выезд перед расчётом.",
    installItems: [
      "Бесплатный выезд и проект трасс",
      "Стандартный монтаж 2 комнаты — от 380 €",
      "Стандартный монтаж 3 комнаты — от 540 €",
      "12 месяцев гарантии на работу",
    ],
    installCta: "Цены на монтаж",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Профилактика мульти-сплит системы от 78 € (2 внутренних) — чистка фильтров и испарителей, проверка хладагента во внешнем блоке, тест компрессора. Сохраняет эффективность и продлевает срок службы.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое мульти-сплит кондиционер и как он работает?",
        a: "Мульти-сплит соединяет несколько внутренних блоков с одним внешним — обычно 2–5 внутренних на 1 внешний. Внешний блок сжимает хладагент, который распределяется по медным трубам к каждому внутреннему. У каждой комнаты — свой термостат и режим.",
      },
      {
        q: "Сколько внутренних блоков можно подключить к одному внешнему?",
        a: "Стандартные мульти-сплит системы поддерживают 2, 3, 4 или 5 внутренних блоков. У внешнего блока фиксированная максимальная мощность (например 9 кВт) — сумма мощностей внутренних не должна её превышать. Для 5+ комнат лучше рассматривать VRF/VRV систему.",
      },
      {
        q: "Можно ли смешивать разные типы внутренних блоков?",
        a: "Да — настенные, кассетные, канальные и колонные внутренние блоки могут подключаться к одному внешнему (из одной серии и марки). Например: настенный в спальне + кассетный в гостиной + канальный в коридоре. Внимание: все внутренние должны быть из одной серии мульти-сплит.",
      },
      {
        q: "Сколько стоит мульти-сплит система в Варне?",
        a: "Мульти-сплит на 2 комнаты (9K + 9K BTU) — от 1 200 €. На 3 комнаты — от 1 800 €. На 4 комнаты — от 2 500 €. Премиум Daikin/Mitsubishi на 30–50% дороже. Цены с НДС, без монтажа. Монтаж зависит от планировки.",
      },
      {
        q: "Можно ли одновременно охлаждать одну комнату и отапливать другую?",
        a: "На стандартном мульти-сплите — нет. Система работает в общем режиме (либо охлаждение, либо отопление) для всех внутренних. Если нужна одновременная работа в разных режимах — нужна VRF/VRV система с теплообменом, это профессиональное решение для больших домов и офисов.",
      },
      {
        q: "Сколько служит мульти-сплит система?",
        a: "При профессиональном монтаже и регулярной годовой профилактике — 12–15 лет. Слабое место — компрессор во внешнем блоке: если он выйдет из строя, все внутренние останавливаются одновременно. Поэтому годовая профилактика, особенно после 5-го года, обязательна.",
      },
    ],
    ctaTitle: "Мульти-сплит для вашего дома?",
    ctaDesc:
      "Свяжитесь с нами — сделаем бесплатный выезд, предложим конфигурацию под комнаты и бюджет.",
    ctaPrimary: "Мульти-сплит модели",
    ctaSecondary: "Заказать выезд",
  },
  ua: {
    title: "Мульти-спліт кондиціонери у Варні — один зовнішній блок на весь дім",
    description:
      "Мульти-спліт системи Daikin, Mitsubishi, Gree, Toshiba у Варні. Один зовнішній блок обслуговує 2–5 внутрішніх. Економія місця на фасаді, тихіше, проєктування та монтаж нашою бригадою.",
    h1: "Мульти-спліт системи у Варні",
    subtitle:
      "Один зовнішній блок для 2–5 кімнат. Ідеально для квартир і будинків, де немає місця для кількох зовнішніх блоків на фасаді. Понад 25 конфігурацій Daikin, Mitsubishi, Gree та Toshiba з проєктуванням, доставкою та монтажем у Варні.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Мульти-спліт системи",
    badge: "2–5 внутрішніх на 1 зовнішній",
    whyTitle: "Навіщо мульти-спліт",
    whySubtitle:
      "Мульти-спліт з'єднує кілька внутрішніх блоків з одним зовнішнім. Менше місця на фасаді, менше шуму для сусідів, єдиний дизайн будівлі.",
    whyItems: [
      {
        title: "Один зовнішній на 2–5 кімнат",
        desc: "Замість 3 зовнішніх блоків на фасаді — лише один. Зберігаєте чистий вигляд будівлі та економите місце для сусідів.",
      },
      {
        title: "Місце на фасаді",
        desc: "У квартирах з маленьким балконом або обмеженнями ОСББ один зовнішній блок часто — єдине рішення.",
      },
      {
        title: "Незалежне керування",
        desc: "У кожної кімнати свій термостат і режим. Можна охолоджувати спальню і одночасно опалювати вітальню*.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Працюємо з провідними виробниками — японський преміум, корейські та якісні китайські марки. Підбираємо конфігурацію під кімнати.",
      },
    ],
    explainerTitle: "Мульти-спліт або кілька окремих сплітів?",
    explainerDesc:
      "Вибір залежить від кількості кімнат, місця на фасаді та бюджету. Коли мульти-спліт кращий — і коли ні.",
    explainer: [
      {
        title: "Кілька окремих сплітів",
        desc: "Дешевше для 2 кімнат, кожен блок працює незалежно — якщо один зовнішній зламається, інші продовжать працювати. Але: більше зовнішніх блоків на фасаді, більше трас, складніша естетика. Підходить, коли кімнати далеко одна від одної.",
      },
      {
        title: "Мульти-спліт система",
        desc: "Один зовнішній на 2–5 внутрішніх — чистий вигляд, менше місця, тихіше для сусідів. Ціна вища для 2 кімнат, але для 3+ стає вигіднішою. Увага: при поломці зовнішнього блока всі внутрішні зупиняються одночасно.",
      },
    ],
    productsTitle: "Популярні мульти-спліт конфігурації",
    productsSubtitle:
      "Підібрані моделі — найзатребуваніші для 2–4 кімнат у квартирі або невеликому будинку. Ціни фіксовані та включають ПДВ. Монтаж розраховується за планом кімнат.",
    productsCta: "Усі мульти-спліт моделі",
    installTitle: "Монтаж мульти-спліт системи",
    installDesc:
      "Мульти-спліт потребує складнішого монтажу — більше трас, точне проєктування маршрутів, балансування холодоагенту. Рекомендуємо виїзд перед розрахунком.",
    installItems: [
      "Безкоштовний виїзд і проєкт трас",
      "Стандартний монтаж 2 кімнати — від 380 €",
      "Стандартний монтаж 3 кімнати — від 540 €",
      "12 місяців гарантії на роботу",
    ],
    installCta: "Ціни на монтаж",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Профілактика мульти-спліт системи від 78 € (2 внутрішніх) — чищення фільтрів та випарників, перевірка холодоагенту в зовнішньому блоці, тест компресора. Зберігає ефективність та подовжує термін служби.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке мульти-спліт кондиціонер і як він працює?",
        a: "Мульти-спліт з'єднує кілька внутрішніх блоків з одним зовнішнім — зазвичай 2–5 внутрішніх на 1 зовнішній. Зовнішній блок стискає холодоагент, який розподіляється мідними трубами до кожного внутрішнього. У кожної кімнати — свій термостат і режим.",
      },
      {
        q: "Скільки внутрішніх блоків можна під'єднати до одного зовнішнього?",
        a: "Стандартні мульти-спліт системи підтримують 2, 3, 4 або 5 внутрішніх блоків. У зовнішнього блока фіксована максимальна потужність (наприклад 9 кВт) — сума потужностей внутрішніх не повинна її перевищувати. Для 5+ кімнат краще розглядати VRF/VRV систему.",
      },
      {
        q: "Чи можна змішувати різні типи внутрішніх блоків?",
        a: "Так — настінні, касетні, канальні та колонні внутрішні блоки можна під'єднати до одного зовнішнього (з однієї серії та марки). Наприклад: настінний у спальні + касетний у вітальні + канальний у коридорі. Увага: всі внутрішні мають бути з однієї серії мульти-спліт.",
      },
      {
        q: "Скільки коштує мульти-спліт система у Варні?",
        a: "Мульти-спліт на 2 кімнати (9K + 9K BTU) — від 1 200 €. На 3 кімнати — від 1 800 €. На 4 кімнати — від 2 500 €. Преміум Daikin/Mitsubishi на 30–50% дорожчий. Ціни з ПДВ, без монтажу. Монтаж залежить від планування.",
      },
      {
        q: "Чи можна одночасно охолоджувати одну кімнату й опалювати іншу?",
        a: "На стандартному мульти-спліті — ні. Система працює в спільному режимі (або охолодження, або опалення) для всіх внутрішніх. Якщо потрібна одночасна робота у різних режимах — потрібна VRF/VRV система з теплообміном, це професійне рішення для великих будинків і офісів.",
      },
      {
        q: "Скільки служить мульти-спліт система?",
        a: "При професійному монтажі та регулярній річній профілактиці — 12–15 років. Слабке місце — компресор у зовнішньому блоці: якщо він вийде з ладу, всі внутрішні зупиняються одночасно. Тому річна профілактика, особливо після 5-го року, обов'язкова.",
      },
    ],
    ctaTitle: "Мульти-спліт для вашого дому?",
    ctaDesc:
      "Зв'яжіться з нами — зробимо безкоштовний виїзд, запропонуємо конфігурацію під кімнати і бюджет.",
    ctaPrimary: "Мульти-спліт моделі",
    ctaSecondary: "Замовити виїзд",
  },
};

const whyIcons = [Layers, Home, Settings2, Award] as const;

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

export default async function MultisplitCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("group_code", "20_ИНВ.МУЛТИСПЛИ.СИС");
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
      lowPrice: "1200",
      highPrice: "5000",
      offerCount: "25",
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

        {/* Explainer */}
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
