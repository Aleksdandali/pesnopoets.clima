import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wrench,
  CalendarClock,
  Box,
  Wind,
  Building,
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

const SLUG = "kolonen";

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
    title: "Колонни климатици във Варна — мощни решения за големи зали",
    description:
      "Колонни климатици Daikin, Mitsubishi, Gree, Toshiba във Варна. Мощни подови уреди за големи зали, шоуруми, ресторанти и хотели. Доставка и монтаж от наша бригада.",
    h1: "Колонни климатици във Варна",
    subtitle:
      "Подови (стоящи) уреди с висока мощност 24–60K BTU. Идеални за големи зали, шоуруми, ресторанти, фоайета и магазини, където стенен или касетъчен модел не достига. Силен въздушен поток на голямо разстояние.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Колонни климатици",
    badge: "Висока мощност 24–60K BTU",
    whyTitle: "Защо колонен климатик",
    whySubtitle:
      "Колонният климатик е стационарен подов уред с голяма мощност и силен въздушен поток. Идеален за големи помещения, където стенен сплит не справя.",
    whyItems: [
      {
        title: "Мощност 24–60K BTU",
        desc: "Една колона охлажда зали до 150 m² — площ, за която иначе ще трябват 2–3 стенни сплита. По-икономично за реално големи пространства.",
      },
      {
        title: "Далечен въздушен поток",
        desc: "Силна струя въздух 12–15 метра напред. Отлично за дълги зали, шоуруми и ресторанти, където температурата трябва да е стабилна в цялото пространство.",
      },
      {
        title: "Не пробивате стени",
        desc: "Колоната стои на пода — нужно е само свързване с външното тяло през медни тръби. Подходяща за обекти с високи стени или защитени фасади.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японски и качествени азиатски марки. Външен дизайн в бяло или черно — вписва се в съвременни шоуруми и обществени пространства.",
      },
    ],
    explainerTitle: "Колонен или касетъчен — за каква зала?",
    explainerDesc:
      "Двата типа са за големи помещения, но решават различни задачи. Изборът зависи от формата на залата и наличието на окачен таван.",
    explainer: [
      {
        title: "Колонен (подов)",
        desc: "Силен направен поток за дълги, високи зали — фоайета, шоуруми, банкетни зали. Не изисква окачен таван. Заема място на пода (около 0.5 m²). Идеален за обекти със стени, които не може да се пробиват, или за временни инсталации.",
      },
      {
        title: "Касетъчен (таванен)",
        desc: "4-посочно равномерно разпределение за квадратни/правоъгълни зали с маси (ресторанти, офиси, конферентни). Изисква окачен таван и място над него. По-дискретен — не се вижда. По-подходящ за обекти, където естетиката е приоритет.",
      },
    ],
    productsTitle: "Популярни колонни модели",
    productsSubtitle:
      "Подбраните модели са най-търсени за големи обекти във Варна — шоуруми, ресторанти, фоайета и магазини. Цените са фиксирани и включват ДДС. Монтажът се изчислява според обекта.",
    productsCta: "Виж всички колонни модели",
    installTitle: "Монтаж на колонен климатик",
    installDesc:
      "Колонният монтаж е сравнително прост — уредът се позиционира на пода, свързва се с външното тяло през медни тръби. Изисква стабилен под и електрозахранване в близост до уреда.",
    installItems: [
      "Безплатен оглед и оферта",
      "Монтаж 24–36K BTU — от 350 €",
      "Монтаж 48–60K BTU — от 520 €",
      "12 месеца гаранция на труда",
    ],
    installCta: "Виж монтаж и цени",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Профилактика на колонен климатик от 85 € — почистване на филтри и изпарител, проверка на хладилния агент, тест на компресора и вентилаторите. За търговски обекти препоръчваме 2 пъти годишно.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е колонен климатик?",
        a: "Колонният климатик е подов (стоящ) уред с висока мощност, обикновено 24–60K BTU. Вътрешното тяло стои на пода във вид на колона (висока около 175 cm), външното тяло е традиционно — на фасадата. Силен въздушен поток на голямо разстояние.",
      },
      {
        q: "За какви помещения е подходящ колонен климатик?",
        a: "За големи зали 60–150 m² — шоуруми, ресторанти, фоайета на хотели, магазини, конферентни зали. Не е подходящ за домашна употреба (твърде мощен и заема място). Не разглеждайте колонен за стая под 50 m² — стенен или касетъчен ще е по-добър избор.",
      },
      {
        q: "Каква площ охлажда колонен климатик?",
        a: "24K BTU — до 60 m². 36K BTU — до 90 m². 48K BTU — до 120 m². 60K BTU — до 150 m². В обекти с високи тавани (4+ метра), големи прозорци или много хора избираме модел с 25–35% по-голяма мощност.",
      },
      {
        q: "Колко струва колонен климатик във Варна?",
        a: "Базови 24–36K BTU — от 1 800 €. Премиум Daikin/Mitsubishi 36–48K BTU — от 2 800 €. Мощни 48–60K BTU за големи зали — от 4 200 €. Цените са с ДДС, без монтаж. Монтаж — допълнително 350–700 € според обекта и дължината на трасето.",
      },
      {
        q: "Колко място заема колонен климатик?",
        a: "Стандартните колони имат размери около 50×35×175 cm — заемат площ 0.18 m² на пода и височина около 175 cm. Препоръчваме поне 50 cm свободно пространство пред уреда за нормален въздушен поток. Не може да се монтира зад мебели или в плътен ъгъл.",
      },
      {
        q: "Колко издържа колонен климатик?",
        a: "При професионален монтаж и редовна профилактика — 12–15 години. В търговски обекти, където уредите работят 12+ часа на ден, препоръчваме профилактика 2 пъти годишно — особено почистване на филтрите, защото в магазини и ресторанти въздухът е по-замърсен.",
      },
    ],
    ctaTitle: "Колонен климатик за вашия обект?",
    ctaDesc:
      "Свържете се с нас — ще направим безплатен оглед, ще предложим модел според размера и натоварването на залата.",
    ctaPrimary: "Виж колонни модели",
    ctaSecondary: "Поискайте оферта",
  },
  en: {
    title: "Floor-Standing (Column) ACs in Varna — Powerful Solutions for Large Halls",
    description:
      "Floor-standing column ACs Daikin, Mitsubishi, Gree, Toshiba in Varna. Powerful units for large halls, showrooms, restaurants and hotels. Delivery and installation by our team.",
    h1: "Floor-Standing Column ACs in Varna",
    subtitle:
      "Floor-standing units with high capacity 24–60K BTU. Ideal for large halls, showrooms, restaurants, lobbies and shops where a wall or cassette unit isn't enough. Strong long-throw airflow.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Column ACs",
    badge: "High capacity 24–60K BTU",
    whyTitle: "Why a column AC",
    whySubtitle:
      "A column AC is a floor-standing unit with high capacity and strong airflow. Ideal for large rooms where a wall split can't cope.",
    whyItems: [
      {
        title: "Capacity 24–60K BTU",
        desc: "One column cools halls up to 150 m² — an area that would otherwise need 2–3 wall splits. More economical for genuinely large spaces.",
      },
      {
        title: "Long-throw airflow",
        desc: "Strong airflow 12–15 metres forward. Excellent for long halls, showrooms and restaurants where temperature must be stable across the whole space.",
      },
      {
        title: "No wall drilling",
        desc: "The column stands on the floor — only connection to the outdoor unit via copper pipes is needed. Suitable for sites with tall walls or protected facades.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Japanese premium and quality Asian brands. Exterior design in white or black — fits modern showrooms and public spaces.",
      },
    ],
    explainerTitle: "Column or cassette — for which kind of hall?",
    explainerDesc:
      "Both types are for large rooms but solve different problems. The choice depends on hall shape and whether a suspended ceiling exists.",
    explainer: [
      {
        title: "Column (floor-standing)",
        desc: "Strong directed flow for long, tall halls — lobbies, showrooms, banquet halls. No suspended ceiling needed. Takes floor space (about 0.5 m²). Ideal for sites where walls cannot be drilled, or for temporary installs.",
      },
      {
        title: "Cassette (ceiling)",
        desc: "Even 4-way distribution for square/rectangular halls with tables (restaurants, offices, conference rooms). Requires a suspended ceiling and space above. More discreet — invisible. Better when aesthetics is a priority.",
      },
    ],
    productsTitle: "Popular column models",
    productsSubtitle:
      "Selected models are most popular for large sites in Varna — showrooms, restaurants, lobbies and shops. Prices are fixed and include VAT. Installation is calculated per site.",
    productsCta: "View all column models",
    installTitle: "Column AC installation",
    installDesc:
      "Column installation is relatively simple — the unit is positioned on the floor, connected to the outdoor unit via copper pipes. Requires a stable floor and a power supply near the unit.",
    installItems: [
      "Free site visit and quote",
      "Installation 24–36K BTU — from €350",
      "Installation 48–60K BTU — from €520",
      "12 months workmanship warranty",
    ],
    installCta: "See installation pricing",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Column AC maintenance from €85 — filter and evaporator cleaning, refrigerant check, compressor and fan test. For commercial sites we recommend twice-yearly servicing.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is a column AC?",
        a: "A column AC is a floor-standing unit with high capacity, typically 24–60K BTU. The indoor unit stands on the floor as a column (about 175 cm tall), the outdoor unit is conventional — on the facade. Strong long-throw airflow.",
      },
      {
        q: "What spaces are column ACs suitable for?",
        a: "For large halls 60–150 m² — showrooms, restaurants, hotel lobbies, shops, conference rooms. Not suited to home use (too powerful and takes space). Don't consider a column for a room under 50 m² — wall or cassette will be a better choice.",
      },
      {
        q: "What area does a column AC cool?",
        a: "24K BTU — up to 60 m². 36K BTU — up to 90 m². 48K BTU — up to 120 m². 60K BTU — up to 150 m². In sites with high ceilings (4+ metres), large windows or many people, we choose a unit with 25–35% extra capacity.",
      },
      {
        q: "How much does a column AC cost in Varna?",
        a: "Entry-level 24–36K BTU — from €1,800. Premium Daikin/Mitsubishi 36–48K BTU — from €2,800. Powerful 48–60K BTU for large halls — from €4,200. Prices include VAT, excluding installation. Installation — additional €350–700 depending on site and pipe length.",
      },
      {
        q: "How much space does a column AC take?",
        a: "Standard columns are about 50×35×175 cm — taking 0.18 m² of floor and ~175 cm of height. We recommend at least 50 cm of free space in front of the unit for normal airflow. Cannot be mounted behind furniture or in a tight corner.",
      },
      {
        q: "How long does a column AC last?",
        a: "With professional installation and regular maintenance — 12–15 years. In commercial sites where units run 12+ hours a day, we recommend twice-yearly maintenance — especially filter cleaning, since shop and restaurant air is dirtier.",
      },
    ],
    ctaTitle: "Column AC for your project?",
    ctaDesc:
      "Contact us — we'll do a free site visit and propose a model based on the hall size and load.",
    ctaPrimary: "View column models",
    ctaSecondary: "Request a quote",
  },
  ru: {
    title: "Колонные кондиционеры в Варне — мощные решения для больших залов",
    description:
      "Колонные (напольные) кондиционеры Daikin, Mitsubishi, Gree, Toshiba в Варне. Мощные блоки для больших залов, шоурумов, ресторанов и отелей. Доставка и монтаж нашей бригадой.",
    h1: "Колонные кондиционеры в Варне",
    subtitle:
      "Напольные (стоящие) блоки высокой мощности 24–60K BTU. Идеальны для больших залов, шоурумов, ресторанов, фойе и магазинов, где настенный или кассетный не справляется. Сильный поток воздуха на большое расстояние.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Колонные кондиционеры",
    badge: "Высокая мощность 24–60K BTU",
    whyTitle: "Зачем колонный кондиционер",
    whySubtitle:
      "Колонный кондиционер — это стационарный напольный блок с большой мощностью и сильным потоком воздуха. Идеален для больших помещений, где настенный сплит не справляется.",
    whyItems: [
      {
        title: "Мощность 24–60K BTU",
        desc: "Одна колонна охлаждает залы до 150 м² — площадь, для которой иначе нужны 2–3 настенных сплита. Экономичнее для действительно больших пространств.",
      },
      {
        title: "Дальний поток воздуха",
        desc: "Сильная струя воздуха на 12–15 метров вперёд. Отлично для длинных залов, шоурумов и ресторанов, где температура должна быть стабильной по всей площади.",
      },
      {
        title: "Не сверлите стены",
        desc: "Колонна стоит на полу — нужно только подключение к внешнему блоку медными трубами. Подходит для объектов с высокими стенами или защищёнными фасадами.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японские и качественные азиатские марки. Внешний дизайн в белом или чёрном — вписывается в современные шоурумы и общественные пространства.",
      },
    ],
    explainerTitle: "Колонный или кассетный — для какого зала?",
    explainerDesc:
      "Оба типа для больших помещений, но решают разные задачи. Выбор зависит от формы зала и наличия подвесного потолка.",
    explainer: [
      {
        title: "Колонный (напольный)",
        desc: "Сильный направленный поток для длинных, высоких залов — фойе, шоурумов, банкетных залов. Не требует подвесного потолка. Занимает место на полу (около 0.5 м²). Идеален для объектов, где стены нельзя сверлить, или для временных установок.",
      },
      {
        title: "Кассетный (потолочный)",
        desc: "4-стороннее равномерное распределение для квадратных/прямоугольных залов со столами (рестораны, офисы, конференц-залы). Требует подвесного потолка и места над ним. Дискретный — невидим. Лучше для объектов, где эстетика — приоритет.",
      },
    ],
    productsTitle: "Популярные колонные модели",
    productsSubtitle:
      "Подобранные модели — самые востребованные для больших объектов в Варне — шоурумов, ресторанов, фойе и магазинов. Цены фиксированные и включают НДС. Монтаж рассчитывается по объекту.",
    productsCta: "Все колонные модели",
    installTitle: "Монтаж колонного кондиционера",
    installDesc:
      "Колонный монтаж сравнительно прост — блок устанавливается на полу, подключается к внешнему блоку медными трубами. Требуется стабильный пол и электропитание рядом с блоком.",
    installItems: [
      "Бесплатный выезд и расчёт",
      "Монтаж 24–36K BTU — от 350 €",
      "Монтаж 48–60K BTU — от 520 €",
      "12 месяцев гарантии на работу",
    ],
    installCta: "Цены на монтаж",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Профилактика колонного кондиционера от 85 € — чистка фильтров и испарителя, проверка хладагента, тест компрессора и вентиляторов. Для коммерческих объектов рекомендуем 2 раза в год.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое колонный кондиционер?",
        a: "Колонный кондиционер — это напольный (стоящий) блок высокой мощности, обычно 24–60K BTU. Внутренний блок стоит на полу в виде колонны (высотой около 175 см), внешний блок традиционный — на фасаде. Сильный поток воздуха на большое расстояние.",
      },
      {
        q: "Для каких помещений подходит колонный кондиционер?",
        a: "Для больших залов 60–150 м² — шоурумов, ресторанов, гостиничных фойе, магазинов, конференц-залов. Не подходит для дома (слишком мощный и занимает место). Не рассматривайте колонный для комнаты до 50 м² — настенный или кассетный будет лучшим выбором.",
      },
      {
        q: "Какую площадь охлаждает колонный кондиционер?",
        a: "24K BTU — до 60 м². 36K BTU — до 90 м². 48K BTU — до 120 м². 60K BTU — до 150 м². В объектах с высокими потолками (4+ метра), большими окнами или большим количеством людей выбираем модель с запасом мощности 25–35%.",
      },
      {
        q: "Сколько стоит колонный кондиционер в Варне?",
        a: "Базовые 24–36K BTU — от 1 800 €. Премиум Daikin/Mitsubishi 36–48K BTU — от 2 800 €. Мощные 48–60K BTU для больших залов — от 4 200 €. Цены с НДС, без монтажа. Монтаж — дополнительно 350–700 € по объекту и длине трассы.",
      },
      {
        q: "Сколько места занимает колонный кондиционер?",
        a: "Стандартные колонны имеют размеры около 50×35×175 см — занимают 0.18 м² пола и около 175 см высоты. Рекомендуем минимум 50 см свободного пространства перед блоком для нормального потока воздуха. Нельзя монтировать за мебелью или в тесном углу.",
      },
      {
        q: "Сколько служит колонный кондиционер?",
        a: "При профессиональном монтаже и регулярной профилактике — 12–15 лет. В коммерческих объектах, где блоки работают 12+ часов в день, рекомендуем профилактику 2 раза в год — особенно чистку фильтров, потому что в магазинах и ресторанах воздух более загрязнён.",
      },
    ],
    ctaTitle: "Колонный кондиционер для вашего объекта?",
    ctaDesc:
      "Свяжитесь с нами — сделаем бесплатный выезд, предложим модель под размер и нагрузку зала.",
    ctaPrimary: "Колонные модели",
    ctaSecondary: "Заказать расчёт",
  },
  ua: {
    title: "Колонні кондиціонери у Варні — потужні рішення для великих залів",
    description:
      "Колонні (підлогові) кондиціонери Daikin, Mitsubishi, Gree, Toshiba у Варні. Потужні блоки для великих залів, шоурумів, ресторанів і готелів. Доставка та монтаж нашою бригадою.",
    h1: "Колонні кондиціонери у Варні",
    subtitle:
      "Підлогові (стоячі) блоки високої потужності 24–60K BTU. Ідеальні для великих залів, шоурумів, ресторанів, фойє та магазинів, де настінний або касетний не справляється. Сильний потік повітря на велику відстань.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Колонні кондиціонери",
    badge: "Висока потужність 24–60K BTU",
    whyTitle: "Навіщо колонний кондиціонер",
    whySubtitle:
      "Колонний кондиціонер — це стаціонарний підлоговий блок з великою потужністю та сильним потоком повітря. Ідеальний для великих приміщень, де настінний спліт не справляється.",
    whyItems: [
      {
        title: "Потужність 24–60K BTU",
        desc: "Одна колона охолоджує зали до 150 м² — площа, для якої інакше потрібні 2–3 настінних спліта. Економніше для дійсно великих просторів.",
      },
      {
        title: "Дальній потік повітря",
        desc: "Сильний струмінь повітря на 12–15 метрів вперед. Чудово для довгих залів, шоурумів та ресторанів, де температура має бути стабільною по всій площі.",
      },
      {
        title: "Не свердлите стіни",
        desc: "Колона стоїть на підлозі — потрібне лише підключення до зовнішнього блока мідними трубами. Підходить для об'єктів з високими стінами або захищеними фасадами.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Преміум японські та якісні азійські марки. Зовнішній дизайн у білому або чорному — вписується в сучасні шоуруми та громадські простори.",
      },
    ],
    explainerTitle: "Колонний чи касетний — для якого залу?",
    explainerDesc:
      "Обидва типи для великих приміщень, але вирішують різні задачі. Вибір залежить від форми залу та наявності підвісної стелі.",
    explainer: [
      {
        title: "Колонний (підлоговий)",
        desc: "Сильний направлений потік для довгих, високих залів — фойє, шоурумів, банкетних залів. Не потребує підвісної стелі. Займає місце на підлозі (близько 0.5 м²). Ідеальний для об'єктів, де стіни не можна свердлити, або для тимчасових установок.",
      },
      {
        title: "Касетний (стельовий)",
        desc: "4-стороннє рівномірне розподілення для квадратних/прямокутних залів зі столами (ресторани, офіси, конференц-зали). Потребує підвісної стелі та місця над нею. Дискретний — невидимий. Краще для об'єктів, де естетика — пріоритет.",
      },
    ],
    productsTitle: "Популярні колонні моделі",
    productsSubtitle:
      "Підібрані моделі — найзатребуваніші для великих об'єктів у Варні — шоурумів, ресторанів, фойє та магазинів. Ціни фіксовані та включають ПДВ. Монтаж розраховується за об'єктом.",
    productsCta: "Усі колонні моделі",
    installTitle: "Монтаж колонного кондиціонера",
    installDesc:
      "Колонний монтаж порівняно простий — блок встановлюється на підлозі, підключається до зовнішнього блока мідними трубами. Потрібна стабільна підлога і електроживлення поруч з блоком.",
    installItems: [
      "Безкоштовний виїзд і розрахунок",
      "Монтаж 24–36K BTU — від 350 €",
      "Монтаж 48–60K BTU — від 520 €",
      "12 місяців гарантії на роботу",
    ],
    installCta: "Ціни на монтаж",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Профілактика колонного кондиціонера від 85 € — чищення фільтрів та випарника, перевірка холодоагенту, тест компресора та вентиляторів. Для комерційних об'єктів рекомендуємо 2 рази на рік.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке колонний кондиціонер?",
        a: "Колонний кондиціонер — це підлоговий (стоячий) блок високої потужності, зазвичай 24–60K BTU. Внутрішній блок стоїть на підлозі у вигляді колони (висотою близько 175 см), зовнішній блок традиційний — на фасаді. Сильний потік повітря на велику відстань.",
      },
      {
        q: "Для яких приміщень підходить колонний кондиціонер?",
        a: "Для великих залів 60–150 м² — шоурумів, ресторанів, готельних фойє, магазинів, конференц-залів. Не підходить для дому (надто потужний і займає місце). Не розглядайте колонний для кімнати до 50 м² — настінний або касетний буде кращим вибором.",
      },
      {
        q: "Яку площу охолоджує колонний кондиціонер?",
        a: "24K BTU — до 60 м². 36K BTU — до 90 м². 48K BTU — до 120 м². 60K BTU — до 150 м². На об'єктах з високими стелями (4+ метра), великими вікнами чи великою кількістю людей обираємо модель із запасом потужності 25–35%.",
      },
      {
        q: "Скільки коштує колонний кондиціонер у Варні?",
        a: "Базові 24–36K BTU — від 1 800 €. Преміум Daikin/Mitsubishi 36–48K BTU — від 2 800 €. Потужні 48–60K BTU для великих залів — від 4 200 €. Ціни з ПДВ, без монтажу. Монтаж — додатково 350–700 € за об'єктом і довжиною траси.",
      },
      {
        q: "Скільки місця займає колонний кондиціонер?",
        a: "Стандартні колони мають розміри близько 50×35×175 см — займають 0.18 м² підлоги та близько 175 см висоти. Рекомендуємо мінімум 50 см вільного простору перед блоком для нормального потоку повітря. Не можна монтувати за меблями або в тісному куті.",
      },
      {
        q: "Скільки служить колонний кондиціонер?",
        a: "При професійному монтажі та регулярній профілактиці — 12–15 років. У комерційних об'єктах, де блоки працюють 12+ годин на день, рекомендуємо профілактику 2 рази на рік — особливо чищення фільтрів, бо в магазинах і ресторанах повітря брудніше.",
      },
    ],
    ctaTitle: "Колонний кондиціонер для вашого об'єкта?",
    ctaDesc:
      "Зв'яжіться з нами — зробимо безкоштовний виїзд, запропонуємо модель під розмір і навантаження залу.",
    ctaPrimary: "Колонні моделі",
    ctaSecondary: "Замовити розрахунок",
  },
};

const whyIcons = [Box, Wind, Building, Award] as const;

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

export default async function KolonenCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("subgroup_code", "50_КОЛОННИ.КЛ");
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
      lowPrice: "1800",
      highPrice: "7500",
      offerCount: "8",
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
                      ? "bg-primary-light/10 border-primary-light/40"
                      : "bg-muted/40 border-border"
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
