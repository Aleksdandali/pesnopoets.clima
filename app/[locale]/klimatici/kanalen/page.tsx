import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wrench,
  CalendarClock,
  EyeOff,
  Wind,
  Building2,
  Gauge,
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

const SLUG = "kanalen";

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
    title: "Канални климатици във Варна — скрит монтаж за дома и офиса",
    description:
      "Канални климатици Daikin, Mitsubishi, Gree, Toshiba във Варна. Скрит монтаж в окачен таван, разпределение на въздуха през въздуховоди в няколко стаи. Проектиране и монтаж от наша бригада.",
    h1: "Канални климатици във Варна",
    subtitle:
      "Скрит монтаж в окачен таван — само решетките се виждат. Едно вътрешно тяло обслужва няколко стаи чрез въздуховоди. Идеално за вили, офиси, ресторанти и луксозни апартаменти, където естетиката е приоритет.",
    breadcrumbHome: "Начало",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Канални климатици",
    badge: "Скрит монтаж в окачен таван",
    whyTitle: "Защо канален климатик",
    whySubtitle:
      "Каналният климатик се монтира в окачения таван и разпределя обработения въздух през въздуховоди до няколко стаи. По стените и таваните се виждат само дискретни решетки.",
    whyItems: [
      {
        title: "Невидим в интериора",
        desc: "Цялото тяло е скрито в окачения таван. Виждат се само дискретни решетки за подаване и засмукване на въздуха — без търговски климатик на стената.",
      },
      {
        title: "Едно тяло — няколко стаи",
        desc: "Един канален блок може да обслужва 3–6 помещения чрез разклонения на въздуховодите. Идеално за вили и офиси с отворени пространства.",
      },
      {
        title: "Тих режим",
        desc: "Тялото е в тавана, далеч от хората. Реалният шум в стаята е значително по-нисък от стенен сплит. Подходящо за конферентни зали и хотели.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японски и качествени азиатски марки. Предлагаме тънки модели за нисък окачен таван (от 20 cm) и стандартни за по-голяма мощност.",
      },
    ],
    explainerTitle: "Канален или касетъчен — кое е по-добре?",
    explainerDesc:
      "И двата типа са скрити в окачения таван, но работят по различен начин. Изборът зависи от планировката и колко стаи трябва да се обслужват.",
    explainer: [
      {
        title: "Канален (с въздуховоди)",
        desc: "Едно тяло обслужва няколко стаи чрез разклонения. Подходящо когато искате един уред да охлажда коридор, спалня и хол. Изисква място в окачения таван и проектиране на трасетата. Препоръчително при ремонт от нулата.",
      },
      {
        title: "Касетъчен (за една стая)",
        desc: "Тялото обслужва само една голяма стая (хол, ресторант, конферентна зала). Подава въздух в 4 посоки през лицев панел. По-лесен монтаж, не изисква въздуховоди. Подходящ за отворени пространства до 80 m².",
      },
    ],
    productsTitle: "Популярни канални модели",
    productsSubtitle:
      "Подбраните модели са най-търсени за вили, офиси и луксозни апартаменти във Варна. Цените са фиксирани и включват ДДС. Монтажът се изчислява според проекта на въздуховодите.",
    productsCta: "Виж всички канални модели",
    installTitle: "Монтаж на канален климатик",
    installDesc:
      "Каналният монтаж е сложен и изисква проектиране на въздуховодите, координация със строителните работи и прецизно балансиране на въздушните потоци. Препоръчваме монтажа да става по време на основен ремонт.",
    installItems: [
      "Безплатен оглед и проект",
      "Монтаж 9–18K BTU — от 480 €",
      "Монтаж 24–48K BTU — от 720 €",
      "12 месеца гаранция на труда",
    ],
    installCta: "Виж монтаж и цени",
    maintenanceTitle: "Сервиз и профилактика",
    maintenanceDesc:
      "Профилактика на канален климатик от 95 € — почистване на филтри и изпарител, проверка на хладилния агент, почистване на въздуховодите при необходимост. Препоръчваме веднъж годишно.",
    maintenanceCta: "Заявка за профилактика",
    faqTitle: "Често задавани въпроси",
    faq: [
      {
        q: "Какво е канален климатик и как се монтира?",
        a: "Каналният климатик е вътрешно тяло, което се монтира в окачен таван. Обработеният въздух се разпределя през въздуховоди до няколко стаи, като в стаите се виждат само решетки за подаване и засмукване на въздух. Самото тяло е невидимо.",
      },
      {
        q: "Каква височина окачен таван е нужна за канален климатик?",
        a: "Стандартните канални модели са с височина 25–30 cm + 5–10 cm място за въздуховодите. Общо нужни са 35–40 cm над окачения таван. Има тънки модели (slim duct) с височина 20 cm — подходящи за апартаменти с по-нисък таван.",
      },
      {
        q: "Колко стаи може да обслужва един канален климатик?",
        a: "Един канален блок може да обслужва 2–6 стаи в зависимост от мощността и общата площ. Например 18K BTU модел може да охлажда 80 m² разпределени на 3–4 стаи. За по-големи площи (200+ m²) се използват няколко канални блока или VRF/VRV система.",
      },
      {
        q: "Колко струва канален климатик във Варна?",
        a: "Базови модели 12–18K BTU — от 1 500 €. Премиум Daikin/Mitsubishi 18–24K BTU — от 2 200 €. Мощни модели 36–48K BTU за големи площи — от 3 500 €. Цените са с ДДС, без монтаж. Монтаж и въздуховоди — допълнително 480–1200 € според проекта.",
      },
      {
        q: "Може ли да се сложи канален в готов апартамент?",
        a: "Технически — да, но изисква пробиване на стените за въздуховодите и изграждане на окачен таван (поне в коридора и спалните). Препоръчваме монтажа да се планира заедно с ремонт. Ако ремонтът не е възможен — обмислете касетъчен или мултисплит.",
      },
      {
        q: "Колко издържа канален климатик?",
        a: "При професионален монтаж и редовна годишна профилактика — 12–18 години. Каналните модели често са по-натоварени от стенните (по-голям обем въздух), затова годишната профилактика е особено важна.",
      },
    ],
    ctaTitle: "Канален климатик за вашия обект?",
    ctaDesc:
      "Свържете се с нас — ще направим безплатен оглед и проект на въздуховодите, ще предложим оптимална конфигурация.",
    ctaPrimary: "Виж канални модели",
    ctaSecondary: "Поискайте проект",
  },
  en: {
    title: "Ducted AC Systems in Varna — Concealed Installation for Homes and Offices",
    description:
      "Ducted ACs Daikin, Mitsubishi, Gree, Toshiba in Varna. Concealed installation in a suspended ceiling, air distribution through ducts to several rooms. Design and installation by our team.",
    h1: "Ducted AC Systems in Varna",
    subtitle:
      "Concealed installation in a suspended ceiling — only the grilles are visible. One indoor unit serves several rooms via ducts. Ideal for villas, offices, restaurants and luxury apartments where aesthetics are a priority.",
    breadcrumbHome: "Home",
    breadcrumbCatalog: "Catalog",
    breadcrumbCurrent: "Ducted ACs",
    badge: "Concealed in a suspended ceiling",
    whyTitle: "Why a ducted AC",
    whySubtitle:
      "A ducted AC is installed in a suspended ceiling and distributes conditioned air through ducts to several rooms. Only discreet supply and return grilles are visible.",
    whyItems: [
      {
        title: "Invisible interior",
        desc: "The whole unit is hidden in the suspended ceiling. Only discreet supply/return grilles are visible — no commercial AC on the wall.",
      },
      {
        title: "One unit — several rooms",
        desc: "A single ducted indoor can serve 3–6 rooms via duct branches. Ideal for villas and offices with open layouts.",
      },
      {
        title: "Quiet operation",
        desc: "The unit is in the ceiling, away from people. Actual room noise is significantly lower than wall splits. Suitable for conference rooms and hotels.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Japanese premium and quality Asian brands. We offer slim models for low ceilings (from 20 cm) and standard ones for higher capacity.",
      },
    ],
    explainerTitle: "Ducted or cassette — which is better?",
    explainerDesc:
      "Both types are concealed in a suspended ceiling but work differently. The choice depends on layout and how many rooms need to be served.",
    explainer: [
      {
        title: "Ducted (with duct runs)",
        desc: "One unit serves several rooms via duct branches. Suitable when you want one device to cool a corridor, bedroom and living room. Requires ceiling space and route design. Recommended during a full renovation.",
      },
      {
        title: "Cassette (single room)",
        desc: "The unit serves a single large room (living room, restaurant, conference hall). Supplies air in 4 directions through a face panel. Easier installation, no ducts needed. Suitable for open spaces up to 80 m².",
      },
    ],
    productsTitle: "Popular ducted models",
    productsSubtitle:
      "Selected models are most popular for villas, offices and luxury apartments in Varna. Prices are fixed and include VAT. Installation is calculated based on the duct design.",
    productsCta: "View all ducted models",
    installTitle: "Ducted AC installation",
    installDesc:
      "Ducted installation is complex and requires duct route design, coordination with construction work and precise airflow balancing. We recommend installation during a full renovation.",
    installItems: [
      "Free site visit and design",
      "Installation 9–18K BTU — from €480",
      "Installation 24–48K BTU — from €720",
      "12 months workmanship warranty",
    ],
    installCta: "See installation pricing",
    maintenanceTitle: "Service and maintenance",
    maintenanceDesc:
      "Ducted AC maintenance from €95 — filter and evaporator cleaning, refrigerant check, duct cleaning if needed. We recommend annual servicing.",
    maintenanceCta: "Request maintenance",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is a ducted AC and how is it installed?",
        a: "A ducted AC is an indoor unit installed in a suspended ceiling. Conditioned air is distributed via ducts to several rooms, with only supply/return grilles visible in the rooms. The unit itself is invisible.",
      },
      {
        q: "What suspended ceiling height is needed for a ducted AC?",
        a: "Standard ducted models are 25–30 cm high + 5–10 cm for ducts. Total 35–40 cm above the suspended ceiling. There are slim duct models 20 cm high — suitable for apartments with lower ceilings.",
      },
      {
        q: "How many rooms can one ducted AC serve?",
        a: "A single ducted unit can serve 2–6 rooms depending on capacity and total area. For example an 18K BTU model can cool 80 m² split across 3–4 rooms. For larger areas (200+ m²) several ducted units or a VRF/VRV system are used.",
      },
      {
        q: "How much does a ducted AC cost in Varna?",
        a: "Entry-level 12–18K BTU — from €1,500. Premium Daikin/Mitsubishi 18–24K BTU — from €2,200. Powerful models 36–48K BTU for large areas — from €3,500. Prices include VAT, excluding installation. Installation and ducts — additional €480–1,200 depending on design.",
      },
      {
        q: "Can a ducted AC be added to a finished apartment?",
        a: "Technically — yes, but it requires drilling walls for ducts and building a suspended ceiling (at least in the corridor and bedrooms). We recommend planning installation alongside renovation. If renovation isn't possible — consider a cassette or multi-split.",
      },
      {
        q: "How long does a ducted AC last?",
        a: "With professional installation and regular annual maintenance — 12–18 years. Ducted models are often more loaded than wall splits (larger air volume), so annual maintenance is especially important.",
      },
    ],
    ctaTitle: "Ducted AC for your project?",
    ctaDesc:
      "Contact us — we'll do a free site visit and duct design and propose an optimal configuration.",
    ctaPrimary: "View ducted models",
    ctaSecondary: "Request a design",
  },
  ru: {
    title: "Канальные кондиционеры в Варне — скрытый монтаж для дома и офиса",
    description:
      "Канальные кондиционеры Daikin, Mitsubishi, Gree, Toshiba в Варне. Скрытый монтаж в подвесном потолке, распределение воздуха по воздуховодам в несколько комнат. Проектирование и монтаж нашей бригадой.",
    h1: "Канальные кондиционеры в Варне",
    subtitle:
      "Скрытый монтаж в подвесном потолке — видны только решётки. Один внутренний блок обслуживает несколько комнат через воздуховоды. Идеально для вилл, офисов, ресторанов и элитных квартир, где эстетика — приоритет.",
    breadcrumbHome: "Главная",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Канальные кондиционеры",
    badge: "Скрытый монтаж в подвесном потолке",
    whyTitle: "Зачем канальный кондиционер",
    whySubtitle:
      "Канальный кондиционер монтируется в подвесном потолке и распределяет обработанный воздух через воздуховоды в несколько комнат. На стенах и потолках видны только дискретные решётки.",
    whyItems: [
      {
        title: "Невидим в интерьере",
        desc: "Сам блок полностью скрыт в подвесном потолке. Видны только дискретные решётки подачи и забора воздуха — никакого торгового кондиционера на стене.",
      },
      {
        title: "Один блок — несколько комнат",
        desc: "Один канальный блок может обслуживать 3–6 помещений через ответвления воздуховодов. Идеально для вилл и офисов с открытыми пространствами.",
      },
      {
        title: "Тихий режим",
        desc: "Блок в потолке, далеко от людей. Реальный шум в комнате значительно ниже, чем у настенного сплита. Подходит для конференц-залов и отелей.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Премиум японские и качественные азиатские марки. Тонкие модели для низких потолков (от 20 см) и стандартные для большей мощности.",
      },
    ],
    explainerTitle: "Канальный или кассетный — что лучше?",
    explainerDesc:
      "Оба типа скрыты в подвесном потолке, но работают по-разному. Выбор зависит от планировки и количества обслуживаемых комнат.",
    explainer: [
      {
        title: "Канальный (с воздуховодами)",
        desc: "Один блок обслуживает несколько комнат через ответвления. Подходит, когда нужно одним устройством охлаждать коридор, спальню и гостиную. Требует места в подвесном потолке и проектирования трасс. Рекомендуем при капитальном ремонте.",
      },
      {
        title: "Кассетный (для одной комнаты)",
        desc: "Блок обслуживает одну большую комнату (гостиная, ресторан, конференц-зал). Подаёт воздух в 4 стороны через лицевую панель. Проще в монтаже, без воздуховодов. Подходит для открытых пространств до 80 м².",
      },
    ],
    productsTitle: "Популярные канальные модели",
    productsSubtitle:
      "Подобранные модели — самые востребованные для вилл, офисов и элитных квартир в Варне. Цены фиксированные и включают НДС. Монтаж рассчитывается по проекту воздуховодов.",
    productsCta: "Все канальные модели",
    installTitle: "Монтаж канального кондиционера",
    installDesc:
      "Канальный монтаж сложен и требует проектирования воздуховодов, координации со строительными работами и точной балансировки воздушных потоков. Рекомендуем монтаж во время капитального ремонта.",
    installItems: [
      "Бесплатный выезд и проект",
      "Монтаж 9–18K BTU — от 480 €",
      "Монтаж 24–48K BTU — от 720 €",
      "12 месяцев гарантии на работу",
    ],
    installCta: "Цены на монтаж",
    maintenanceTitle: "Сервис и профилактика",
    maintenanceDesc:
      "Профилактика канального кондиционера от 95 € — чистка фильтров и испарителя, проверка хладагента, чистка воздуховодов при необходимости. Рекомендуем раз в год.",
    maintenanceCta: "Заявка на профилактику",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Что такое канальный кондиционер и как он монтируется?",
        a: "Канальный кондиционер — это внутренний блок, который монтируется в подвесном потолке. Обработанный воздух распределяется по воздуховодам в несколько комнат, в комнатах видны только решётки подачи и забора воздуха. Сам блок невидим.",
      },
      {
        q: "Какая высота подвесного потолка нужна для канального кондиционера?",
        a: "Стандартные канальные модели имеют высоту 25–30 см + 5–10 см на воздуховоды. Всего нужно 35–40 см над подвесным потолком. Есть тонкие модели (slim duct) высотой 20 см — подходят для квартир с более низкими потолками.",
      },
      {
        q: "Сколько комнат может обслуживать один канальный кондиционер?",
        a: "Один канальный блок может обслуживать 2–6 комнат в зависимости от мощности и общей площади. Например, модель 18K BTU охлаждает 80 м², распределённых на 3–4 комнаты. Для больших площадей (200+ м²) используют несколько канальных блоков или VRF/VRV систему.",
      },
      {
        q: "Сколько стоит канальный кондиционер в Варне?",
        a: "Базовые модели 12–18K BTU — от 1 500 €. Премиум Daikin/Mitsubishi 18–24K BTU — от 2 200 €. Мощные модели 36–48K BTU для больших площадей — от 3 500 €. Цены с НДС, без монтажа. Монтаж и воздуховоды — дополнительно 480–1200 € по проекту.",
      },
      {
        q: "Можно ли поставить канальный в готовую квартиру?",
        a: "Технически — да, но требуется штробление стен под воздуховоды и устройство подвесного потолка (хотя бы в коридоре и спальнях). Рекомендуем планировать монтаж вместе с ремонтом. Если ремонт невозможен — рассмотрите кассетный или мульти-сплит.",
      },
      {
        q: "Сколько служит канальный кондиционер?",
        a: "При профессиональном монтаже и регулярной годовой профилактике — 12–18 лет. Канальные модели часто загружены сильнее настенных (больший объём воздуха), поэтому годовая профилактика особенно важна.",
      },
    ],
    ctaTitle: "Канальный кондиционер для вашего объекта?",
    ctaDesc:
      "Свяжитесь с нами — сделаем бесплатный выезд и проект воздуховодов, предложим оптимальную конфигурацию.",
    ctaPrimary: "Канальные модели",
    ctaSecondary: "Заказать проект",
  },
  ua: {
    title: "Канальні кондиціонери у Варні — прихований монтаж для дому та офісу",
    description:
      "Канальні кондиціонери Daikin, Mitsubishi, Gree, Toshiba у Варні. Прихований монтаж у підвісній стелі, розподіл повітря повітроводами у декілька кімнат. Проєктування та монтаж нашою бригадою.",
    h1: "Канальні кондиціонери у Варні",
    subtitle:
      "Прихований монтаж у підвісній стелі — видно лише решітки. Один внутрішній блок обслуговує кілька кімнат через повітроводи. Ідеально для вілл, офісів, ресторанів та елітних квартир, де естетика — пріоритет.",
    breadcrumbHome: "Головна",
    breadcrumbCatalog: "Каталог",
    breadcrumbCurrent: "Канальні кондиціонери",
    badge: "Прихований монтаж у підвісній стелі",
    whyTitle: "Навіщо канальний кондиціонер",
    whySubtitle:
      "Канальний кондиціонер монтується в підвісній стелі та розподіляє оброблене повітря через повітроводи у кілька кімнат. На стінах і стелях видно лише дискретні решітки.",
    whyItems: [
      {
        title: "Невидимий в інтер'єрі",
        desc: "Сам блок повністю прихований у підвісній стелі. Видно лише дискретні решітки подачі та забору повітря — жодного торгового кондиціонера на стіні.",
      },
      {
        title: "Один блок — кілька кімнат",
        desc: "Один канальний блок може обслуговувати 3–6 приміщень через відгалуження повітроводів. Ідеально для вілл та офісів з відкритими просторами.",
      },
      {
        title: "Тихий режим",
        desc: "Блок у стелі, далеко від людей. Реальний шум у кімнаті значно нижчий, ніж у настінного спліта. Підходить для конференц-залів і готелів.",
      },
      {
        title: "Daikin, Mitsubishi, Gree",
        desc: "Преміум японські та якісні азійські марки. Тонкі моделі для низьких стель (від 20 см) і стандартні для більшої потужності.",
      },
    ],
    explainerTitle: "Канальний чи касетний — що краще?",
    explainerDesc:
      "Обидва типи приховані в підвісній стелі, але працюють по-різному. Вибір залежить від планування та кількості обслуговуваних кімнат.",
    explainer: [
      {
        title: "Канальний (з повітроводами)",
        desc: "Один блок обслуговує кілька кімнат через відгалуження. Підходить, коли потрібно одним пристроєм охолоджувати коридор, спальню і вітальню. Потребує місця в підвісній стелі та проєктування трас. Рекомендуємо при капітальному ремонті.",
      },
      {
        title: "Касетний (для однієї кімнати)",
        desc: "Блок обслуговує одну велику кімнату (вітальня, ресторан, конференц-зал). Подає повітря в 4 сторони через лицьову панель. Простіший монтаж, без повітроводів. Підходить для відкритих просторів до 80 м².",
      },
    ],
    productsTitle: "Популярні канальні моделі",
    productsSubtitle:
      "Підібрані моделі — найзатребуваніші для вілл, офісів та елітних квартир у Варні. Ціни фіксовані та включають ПДВ. Монтаж розраховується за проєктом повітроводів.",
    productsCta: "Усі канальні моделі",
    installTitle: "Монтаж канального кондиціонера",
    installDesc:
      "Канальний монтаж складний і потребує проєктування повітроводів, координації з будівельними роботами та точного балансування повітряних потоків. Рекомендуємо монтаж під час капітального ремонту.",
    installItems: [
      "Безкоштовний виїзд і проєкт",
      "Монтаж 9–18K BTU — від 480 €",
      "Монтаж 24–48K BTU — від 720 €",
      "12 місяців гарантії на роботу",
    ],
    installCta: "Ціни на монтаж",
    maintenanceTitle: "Сервіс та профілактика",
    maintenanceDesc:
      "Профілактика канального кондиціонера від 95 € — чищення фільтрів та випарника, перевірка холодоагенту, чищення повітроводів за потреби. Рекомендуємо раз на рік.",
    maintenanceCta: "Заявка на профілактику",
    faqTitle: "Часті питання",
    faq: [
      {
        q: "Що таке канальний кондиціонер і як він монтується?",
        a: "Канальний кондиціонер — це внутрішній блок, який монтується в підвісній стелі. Оброблене повітря розподіляється повітроводами в кілька кімнат, у кімнатах видно лише решітки подачі та забору повітря. Сам блок невидимий.",
      },
      {
        q: "Яка висота підвісної стелі потрібна для канального кондиціонера?",
        a: "Стандартні канальні моделі мають висоту 25–30 см + 5–10 см на повітроводи. Всього потрібно 35–40 см над підвісною стелею. Є тонкі моделі (slim duct) висотою 20 см — підходять для квартир з нижчими стелями.",
      },
      {
        q: "Скільки кімнат може обслуговувати один канальний кондиціонер?",
        a: "Один канальний блок може обслуговувати 2–6 кімнат залежно від потужності та загальної площі. Наприклад, модель 18K BTU охолоджує 80 м², розподілених на 3–4 кімнати. Для великих площ (200+ м²) використовують кілька канальних блоків або VRF/VRV систему.",
      },
      {
        q: "Скільки коштує канальний кондиціонер у Варні?",
        a: "Базові моделі 12–18K BTU — від 1 500 €. Преміум Daikin/Mitsubishi 18–24K BTU — від 2 200 €. Потужні моделі 36–48K BTU для великих площ — від 3 500 €. Ціни з ПДВ, без монтажу. Монтаж і повітроводи — додатково 480–1200 € за проєктом.",
      },
      {
        q: "Чи можна поставити канальний у готову квартиру?",
        a: "Технічно — так, але потрібно штробити стіни під повітроводи та робити підвісну стелю (принаймні в коридорі та спальнях). Рекомендуємо планувати монтаж разом з ремонтом. Якщо ремонт неможливий — розгляньте касетний або мульти-спліт.",
      },
      {
        q: "Скільки служить канальний кондиціонер?",
        a: "При професійному монтажі та регулярній річній профілактиці — 12–18 років. Канальні моделі часто завантажені сильніше настінних (більший об'єм повітря), тому річна профілактика особливо важлива.",
      },
    ],
    ctaTitle: "Канальний кондиціонер для вашого об'єкта?",
    ctaDesc:
      "Зв'яжіться з нами — зробимо безкоштовний виїзд і проєкт повітроводів, запропонуємо оптимальну конфігурацію.",
    ctaPrimary: "Канальні моделі",
    ctaSecondary: "Замовити проєкт",
  },
};

const whyIcons = [EyeOff, Wind, Building2, Gauge] as const;

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

export default async function KanalenCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = copy[locale] || copy.bg;
  const siteUrl = "https://pesnopoets-clima.com";

  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("subgroup_code", "30_КАНАЛЕН.ТИП");
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
      lowPrice: "1500",
      highPrice: "6000",
      offerCount: "15",
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
