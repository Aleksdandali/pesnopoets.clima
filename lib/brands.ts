/**
 * Brand landing pages (/[locale]/marki/[brand]).
 *
 * Daikin and Mitsubishi Electric already have hand-written pages
 * (/daikin-varna, /mitsubishi-varna). Every other manufacturer in the catalog
 * gets a data-driven page: copy from BRANDS below where it exists, otherwise
 * generatedBrandCopy() builds it; numbers (model count, price range, BTU
 * range, warranty) come from Supabase at render time.
 */

export type BrandLocale = "bg" | "en" | "ru" | "ua";

export interface BrandCopy {
  /** <title>, ≤60 chars, includes "Варна". */
  title: string;
  /** meta description, ≤160 chars. */
  description: string;
  h1: string;
  intro: string;
  /** Product lines the shop actually stocks, one line each. */
  series: string[];
  /** Three concrete reasons buyers pick this brand. */
  why: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
}

export interface Brand {
  slug: string;
  /** Exact `products.manufacturer` value in the DB. */
  manufacturer: string;
  /** Display name, as printed on the unit. */
  name: string;
  country: string;
  copy: Record<BrandLocale, BrandCopy>;
}

export const BRANDS: Brand[] = [
  {
    slug: "mitsubishi-heavy",
    manufacturer: "Mitsubishi Heavy",
    name: "Mitsubishi Heavy Industries",
    country: "Япония",
    copy: {
      bg: {
        title: "Климатици Mitsubishi Heavy Варна — цени с монтаж 2026",
        description: "Mitsubishi Heavy Industries във Варна: серии SRK ZS, ZSX и ZR, 19 dB, отопление до -15 °C. Цени с монтаж, наличности, гаранция. Собствен монтажен екип.",
        h1: "Климатици Mitsubishi Heavy Industries във Варна",
        intro: "Mitsubishi Heavy Industries е японски производител с над 100 години история в индустриалната техника — климатиците са малка част от концерн, който прави и турбини, и корабни двигатели. За купувача това означава едно: консервативна, надеждна конструкция, която не гони моди. Сериите SRK са сред най-тихите на пазара (19 dB на най-ниска степен) и се справят с отопление при варненските зими без да губят мощност.",
        series: [
          "SRK ZS-W — базовата серия: A++ на охлаждане и отопление, R32, 19 dB, най-търсеният избор за апартамент.",
          "SRK ZSX-W — премиум серия: A+++ / A++, по-мощно отопление при минусови температури, Wi-Fi.",
          "SRK ZR-W — по-голямите мощности (21–24k BTU) за хол с трапезария или офис.",
          "SCM мултисплит външни тела — едно външно тяло за 2–5 стаи.",
        ],
        why: [
          { title: "Наистина тих", desc: "19 dB на вътрешното тяло в нощен режим — под нивото на шепот. Най-честият избор на клиентите ни за спалня." },
          { title: "Работи до -15 °C", desc: "Отоплителната мощност се запазва при варненския студ, което прави SRK серията основно отопление, не допълнение." },
          { title: "Сервизна база", desc: "Резервни части и сервиз в България, без месеци чакане. Гаранцията се запазва при годишна профилактика от нашия екип." },
        ],
        faq: [
          { q: "Mitsubishi Heavy или Mitsubishi Electric — каква е разликата?", a: "Две отделни японски компании. Mitsubishi Electric е по-скъпата марка с по-широка премиум гама; Mitsubishi Heavy Industries дава сходно качество на компресора и шума на по-достъпна цена. За стандартен апартамент във Варна разликата в реалната работа е малка." },
          { q: "Кой модел Mitsubishi Heavy е подходящ за спалня?", a: "SRK25ZS-W (9 000 BTU) за стаи до 20 кв.м или SRK35ZS-W (12 000 BTU) за до 25 кв.м. И двата са 19 dB на най-ниска степен и имат нощен режим." },
          { q: "Колко струва монтажът на Mitsubishi Heavy във Варна?", a: "Стандартният монтаж е 190 € с ДДС за модели до 14 000 BTU и 230 € за до 24 000 BTU — 3 м медна тръба, всички материали, вакуумиране и пуск. Цената е еднаква за всички марки." },
        ],
      },
      en: {
        title: "Mitsubishi Heavy Air Conditioners Varna — Installed Prices",
        description: "Mitsubishi Heavy Industries in Varna: SRK ZS, ZSX and ZR series, 19 dB, heating down to -15 °C. Prices with installation, stock, warranty. In-house crew.",
        h1: "Mitsubishi Heavy Industries air conditioners in Varna",
        intro: "Mitsubishi Heavy Industries is a Japanese industrial group with over a century of history — air conditioners are a small part of a company that also builds turbines and ship engines. For a buyer that means a conservative, reliable design that does not chase trends. The SRK series is among the quietest on the market (19 dB on the lowest setting) and keeps its heating output through Varna winters.",
        series: [
          "SRK ZS-W — the core series: A++ cooling and heating, R32, 19 dB, the usual pick for an apartment.",
          "SRK ZSX-W — premium series: A+++ / A++, stronger heating below zero, Wi-Fi.",
          "SRK ZR-W — larger capacities (21–24k BTU) for a living/dining room or office.",
          "SCM multi-split outdoor units — one outdoor unit for 2–5 rooms.",
        ],
        why: [
          { title: "Genuinely quiet", desc: "19 dB indoor in night mode — below a whisper. Our customers' most common bedroom choice." },
          { title: "Heats down to -15 °C", desc: "Heating output holds in Varna cold, which makes the SRK series primary heating rather than a backup." },
          { title: "Service network", desc: "Spare parts and service in Bulgaria without months of waiting. Warranty stays valid with annual maintenance by our crew." },
        ],
        faq: [
          { q: "Mitsubishi Heavy vs Mitsubishi Electric — what is the difference?", a: "Two separate Japanese companies. Mitsubishi Electric is the pricier brand with a wider premium range; Mitsubishi Heavy Industries offers similar compressor quality and noise levels at a more accessible price. For a standard Varna apartment the real-world difference is small." },
          { q: "Which Mitsubishi Heavy model suits a bedroom?", a: "SRK25ZS-W (9,000 BTU) for rooms up to 20 m² or SRK35ZS-W (12,000 BTU) for up to 25 m². Both run at 19 dB on the lowest setting and have a night mode." },
          { q: "How much is Mitsubishi Heavy installation in Varna?", a: "Standard installation is €190 incl. VAT for units up to 14,000 BTU and €230 for up to 24,000 BTU — 3 m copper pipe, all materials, vacuum and commissioning. The price is the same for every brand." },
        ],
      },
      ru: {
        title: "Кондиционеры Mitsubishi Heavy Варна — цены с монтажом",
        description: "Mitsubishi Heavy Industries в Варне: серии SRK ZS, ZSX и ZR, 19 дБ, обогрев до -15 °C. Цены с монтажом, наличие, гарантия. Своя бригада.",
        h1: "Кондиционеры Mitsubishi Heavy Industries в Варне",
        intro: "Mitsubishi Heavy Industries — японский промышленный концерн с вековой историей: кондиционеры — малая часть компании, которая строит турбины и судовые двигатели. Для покупателя это значит консервативную, надёжную конструкцию без погони за модой. Серия SRK — одна из самых тихих на рынке (19 дБ на минимальной скорости) и сохраняет мощность обогрева в варненские зимы.",
        series: [
          "SRK ZS-W — базовая серия: A++ на охлаждение и обогрев, R32, 19 дБ, самый частый выбор для квартиры.",
          "SRK ZSX-W — премиум: A+++ / A++, сильнее обогрев при минусе, Wi-Fi.",
          "SRK ZR-W — большие мощности (21–24k BTU) для гостиной со столовой или офиса.",
          "SCM мультисплит — один наружный блок на 2–5 комнат.",
        ],
        why: [
          { title: "Действительно тихий", desc: "19 дБ внутреннего блока в ночном режиме — тише шёпота. Самый частый выбор наших клиентов для спальни." },
          { title: "Работает до -15 °C", desc: "Мощность обогрева сохраняется в варненский холод — серия SRK становится основным отоплением, а не дополнением." },
          { title: "Сервисная база", desc: "Запчасти и сервис в Болгарии без месяцев ожидания. Гарантия сохраняется при ежегодной профилактике нашей бригадой." },
        ],
        faq: [
          { q: "Mitsubishi Heavy или Mitsubishi Electric — в чём разница?", a: "Две отдельные японские компании. Mitsubishi Electric — более дорогой бренд с широкой премиум-линейкой; Mitsubishi Heavy Industries даёт сопоставимое качество компрессора и уровень шума по более доступной цене. Для стандартной квартиры в Варне разница в работе невелика." },
          { q: "Какая модель Mitsubishi Heavy подходит для спальни?", a: "SRK25ZS-W (9 000 BTU) для комнат до 20 м² или SRK35ZS-W (12 000 BTU) до 25 м². Обе — 19 дБ на минимальной скорости и с ночным режимом." },
          { q: "Сколько стоит монтаж Mitsubishi Heavy в Варне?", a: "Стандартный монтаж — 190 € с НДС для моделей до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, все материалы, вакуумирование и запуск. Цена одинакова для всех марок." },
        ],
      },
      ua: {
        title: "Кондиціонери Mitsubishi Heavy Варна — ціни з монтажем",
        description: "Mitsubishi Heavy Industries у Варні: серії SRK ZS, ZSX і ZR, 19 дБ, обігрів до -15 °C. Ціни з монтажем, наявність, гарантія. Власна бригада.",
        h1: "Кондиціонери Mitsubishi Heavy Industries у Варні",
        intro: "Mitsubishi Heavy Industries — японський промисловий концерн зі столітньою історією: кондиціонери — мала частина компанії, що будує турбіни й суднові двигуни. Для покупця це означає консервативну, надійну конструкцію без гонитви за модою. Серія SRK — одна з найтихіших на ринку (19 дБ на мінімальній швидкості) і зберігає потужність обігріву у варненські зими.",
        series: [
          "SRK ZS-W — базова серія: A++ на охолодження та обігрів, R32, 19 дБ, найчастіший вибір для квартири.",
          "SRK ZSX-W — преміум: A+++ / A++, потужніший обігрів при мінусі, Wi-Fi.",
          "SRK ZR-W — великі потужності (21–24k BTU) для вітальні з їдальнею або офісу.",
          "SCM мультиспліт — один зовнішній блок на 2–5 кімнат.",
        ],
        why: [
          { title: "Справді тихий", desc: "19 дБ внутрішнього блока в нічному режимі — тихіше за шепіт. Найчастіший вибір наших клієнтів для спальні." },
          { title: "Працює до -15 °C", desc: "Потужність обігріву зберігається у варненський холод — серія SRK стає основним опаленням, а не доповненням." },
          { title: "Сервісна база", desc: "Запчастини й сервіс у Болгарії без місяців очікування. Гарантія зберігається за щорічної профілактики нашою бригадою." },
        ],
        faq: [
          { q: "Mitsubishi Heavy чи Mitsubishi Electric — у чому різниця?", a: "Дві окремі японські компанії. Mitsubishi Electric — дорожчий бренд із ширшою преміум-лінійкою; Mitsubishi Heavy Industries дає співставну якість компресора й рівень шуму за доступнішу ціну. Для стандартної квартири у Варні різниця в роботі невелика." },
          { q: "Яка модель Mitsubishi Heavy підходить для спальні?", a: "SRK25ZS-W (9 000 BTU) для кімнат до 20 м² або SRK35ZS-W (12 000 BTU) до 25 м². Обидві — 19 дБ на мінімальній швидкості та з нічним режимом." },
          { q: "Скільки коштує монтаж Mitsubishi Heavy у Варні?", a: "Стандартний монтаж — 190 € з ПДВ для моделей до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, всі матеріали, вакуумування й запуск. Ціна однакова для всіх марок." },
        ],
      },
    },
  },
  {
    slug: "gree",
    manufacturer: "Gree",
    name: "Gree",
    country: "Китай",
    copy: {
      bg: {
        title: "Климатици Gree Варна — цени с монтаж, Amber, Soyal 2026",
        description: "Gree във Варна: Airy, Soyal, Amber, Clivia, Pular — от 9 000 до 24 000 BTU, отопление до -20 °C, Wi-Fi. Цени с монтаж и наличности. Собствен екип.",
        h1: "Климатици Gree във Варна",
        intro: "Gree е най-големият производител на климатици в света — над 60 милиона уреда годишно, собствени компресори и фабрики, а не сглобяване на чужди компоненти. Затова марката дава най-доброто съотношение цена–характеристики в средния клас: A++ и A+++ модели с Wi-Fi и отопление до -20 °C на цената на базов японски уред. Във Варна Gree е най-продаваната ни марка за апартаменти и къщи.",
        series: [
          "Airy — най-широката серия на склад: A++, R32, Wi-Fi, 9–24k BTU за всяка стая.",
          "Soyal II / Amber — флагманите: A+++, около 19 dB, отопление до -20/-22 °C, йонизатор при Amber.",
          "Clivia / S-Cool — среден клас A++ с Wi-Fi за апартамент.",
          "Pular / Pular II ECO+ — базовите модели за бюджетно решение с пълна гаранция.",
        ],
        why: [
          { title: "Собствен компресор", desc: "Gree произвежда компресорите си сама — най-важният и най-скъп компонент в климатика не идва от подизпълнител." },
          { title: "Отопление в студ", desc: "Amber и Soyal работят до -20/-22 °C без загуба на мощност — за Варна това е отопление за цялата зима." },
          { title: "Цена за клас", desc: "A+++ с Wi-Fi на цената на японски A++. При еднакъв бюджет Gree дава по-висок клас." },
        ],
        faq: [
          { q: "Gree добра марка ли е?", a: "Да — Gree е най-големият производител на климатици в света и прави компресори за много други марки. Качеството на сглобяване и надеждността са на нивото на японските производители в средния клас; разликата е основно в шума на най-ниска степен при базовите серии." },
          { q: "Кой Gree да избера за апартамент във Варна?", a: "За спалня до 20 кв.м — Soyal II или Airy 9 000 BTU; за хол до 30 кв.м — Clivia или Amber 12 000 BTU. Ако климатикът ще е основно отопление, вземете Amber или Soyal заради работата до -20 °C." },
          { q: "Каква е гаранцията на Gree?", a: "Производителят дава гаранция при монтаж от оторизиран сервиз. Ние сме оторизиран партньор, добавяме 12 месеца гаранция на монтажа и правим годишната профилактика, която запазва гаранцията." },
        ],
      },
      en: {
        title: "Gree Air Conditioners Varna — Installed Prices, Amber, Soyal",
        description: "Gree in Varna: Airy, Soyal, Amber, Clivia, Pular — 9,000 to 24,000 BTU, heating down to -20 °C, Wi-Fi. Installed prices and stock. In-house crew.",
        h1: "Gree air conditioners in Varna",
        intro: "Gree is the world's largest air-conditioner manufacturer — over 60 million units a year, its own compressors and factories rather than assembled third-party parts. That is why the brand gives the best price-to-spec ratio in the mid range: A++ and A+++ models with Wi-Fi and heating down to -20 °C at the price of a basic Japanese unit. In Varna Gree is our best-selling brand for apartments and houses.",
        series: [
          "Airy — the widest series in stock: A++, R32, Wi-Fi, 9–24k BTU for any room.",
          "Soyal II / Amber — the flagships: A+++, about 19 dB, heating to -20/-22 °C, ioniser on Amber.",
          "Clivia / S-Cool — mid range A++ with Wi-Fi for an apartment.",
          "Pular / Pular II ECO+ — entry models for a budget solution with full warranty.",
        ],
        why: [
          { title: "Own compressor", desc: "Gree makes its own compressors — the most important and most expensive part of an AC is not outsourced." },
          { title: "Heating in the cold", desc: "Amber and Soyal run down to -20/-22 °C without losing output — in Varna that is heating for the whole winter." },
          { title: "Class for the money", desc: "A+++ with Wi-Fi at the price of a Japanese A++. Same budget, higher class." },
        ],
        faq: [
          { q: "Is Gree a good brand?", a: "Yes — Gree is the largest AC manufacturer in the world and makes compressors for many other brands. Build quality and reliability match Japanese mid-range makers; the difference is mainly lowest-setting noise on the entry series." },
          { q: "Which Gree should I pick for a Varna apartment?", a: "Bedroom up to 20 m² — Soyal II or Airy 9,000 BTU; living room up to 30 m² — Clivia or Amber 12,000 BTU. If the AC will be your main heating, choose Amber or Soyal for the -20 °C operation." },
          { q: "What is the Gree warranty?", a: "The manufacturer warranty applies with installation by an authorised service. We are an authorised partner, add 12 months on the installation and do the annual maintenance that keeps the warranty valid." },
        ],
      },
      ru: {
        title: "Кондиционеры Gree Варна — цены с монтажом, Amber, Soyal",
        description: "Gree в Варне: Airy, Soyal, Amber, Clivia, Pular — от 9 000 до 24 000 BTU, обогрев до -20 °C, Wi-Fi. Цены с монтажом и наличие. Своя бригада.",
        h1: "Кондиционеры Gree в Варне",
        intro: "Gree — крупнейший производитель кондиционеров в мире: более 60 миллионов устройств в год, собственные компрессоры и заводы, а не сборка чужих компонентов. Поэтому бренд даёт лучшее соотношение цены и характеристик в среднем классе: A++ и A+++ с Wi-Fi и обогревом до -20 °C по цене базового японского аппарата. В Варне Gree — наш самый продаваемый бренд для квартир и домов.",
        series: [
          "Airy — самая широкая серия на складе: A++, R32, Wi-Fi, 9–24k BTU для любой комнаты.",
          "Soyal II / Amber — флагманы: A+++, около 19 дБ, обогрев до -20/-22 °C, ионизатор у Amber.",
          "Clivia / S-Cool — средний класс A++ с Wi-Fi для квартиры.",
          "Pular / Pular II ECO+ — базовые модели для бюджетного решения с полной гарантией.",
        ],
        why: [
          { title: "Собственный компрессор", desc: "Gree сама производит компрессоры — самый важный и дорогой узел кондиционера не приходит от подрядчика." },
          { title: "Обогрев в мороз", desc: "Amber и Soyal работают до -20/-22 °C без потери мощности — для Варны это отопление на всю зиму." },
          { title: "Класс за деньги", desc: "A+++ с Wi-Fi по цене японского A++. При равном бюджете Gree даёт класс выше." },
        ],
        faq: [
          { q: "Gree — хороший бренд?", a: "Да — Gree крупнейший производитель кондиционеров в мире и делает компрессоры для многих других марок. Качество сборки и надёжность на уровне японских производителей среднего класса; разница в основном в шуме на минимальной скорости у базовых серий." },
          { q: "Какой Gree выбрать для квартиры в Варне?", a: "Спальня до 20 м² — Soyal II или Airy 9 000 BTU; гостиная до 30 м² — Clivia или Amber 12 000 BTU. Если кондиционер будет основным отоплением — берите Amber или Soyal из-за работы до -20 °C." },
          { q: "Какая гарантия у Gree?", a: "Гарантия производителя действует при монтаже авторизованным сервисом. Мы авторизованный партнёр, добавляем 12 месяцев на монтаж и делаем ежегодную профилактику, которая сохраняет гарантию." },
        ],
      },
      ua: {
        title: "Кондиціонери Gree Варна — ціни з монтажем, Amber, Soyal",
        description: "Gree у Варні: Airy, Soyal, Amber, Clivia, Pular — від 9 000 до 24 000 BTU, обігрів до -20 °C, Wi-Fi. Ціни з монтажем і наявність. Власна бригада.",
        h1: "Кондиціонери Gree у Варні",
        intro: "Gree — найбільший виробник кондиціонерів у світі: понад 60 мільйонів пристроїв на рік, власні компресори й заводи, а не збирання чужих компонентів. Тому бренд дає найкраще співвідношення ціни й характеристик у середньому класі: A++ і A+++ з Wi-Fi та обігрівом до -20 °C за ціною базового японського апарата. У Варні Gree — наш найпродаваніший бренд для квартир і будинків.",
        series: [
          "Airy — найширша серія на складі: A++, R32, Wi-Fi, 9–24k BTU для будь-якої кімнати.",
          "Soyal II / Amber — флагмани: A+++, близько 19 дБ, обігрів до -20/-22 °C, іонізатор в Amber.",
          "Clivia / S-Cool — середній клас A++ з Wi-Fi для квартири.",
          "Pular / Pular II ECO+ — базові моделі для бюджетного рішення з повною гарантією.",
        ],
        why: [
          { title: "Власний компресор", desc: "Gree сама виробляє компресори — найважливіший і найдорожчий вузол кондиціонера не приходить від підрядника." },
          { title: "Обігрів у мороз", desc: "Amber і Soyal працюють до -20/-22 °C без втрати потужності — для Варни це опалення на всю зиму." },
          { title: "Клас за гроші", desc: "A+++ з Wi-Fi за ціною японського A++. За однакового бюджету Gree дає вищий клас." },
        ],
        faq: [
          { q: "Gree — хороший бренд?", a: "Так — Gree найбільший виробник кондиціонерів у світі й робить компресори для багатьох інших марок. Якість збирання й надійність на рівні японських виробників середнього класу; різниця здебільшого в шумі на мінімальній швидкості в базових серіях." },
          { q: "Який Gree обрати для квартири у Варні?", a: "Спальня до 20 м² — Soyal II або Airy 9 000 BTU; вітальня до 30 м² — Clivia або Amber 12 000 BTU. Якщо кондиціонер буде основним опаленням — беріть Amber або Soyal через роботу до -20 °C." },
          { q: "Яка гарантія у Gree?", a: "Гарантія виробника діє за монтажу авторизованим сервісом. Ми авторизований партнер, додаємо 12 місяців на монтаж і робимо щорічну профілактику, яка зберігає гарантію." },
        ],
      },
    },
  },
  {
    slug: "toshiba",
    manufacturer: "Toshiba",
    name: "Toshiba",
    country: "Япония",
    copy: {
      bg: {
        title: "Климатици Toshiba Варна — Yukai, Shorai, цени с монтаж",
        description: "Toshiba във Варна: Shorai, Yukai, Essento, Haori, Daiseikai. Японски twin-rotary компресор, до -15 °C. Цени с монтаж и наличности.",
        h1: "Климатици Toshiba във Варна",
        intro: "Toshiba е компанията, която през 1981 г. пуска първия инверторен климатик в света. Днес марката е част от групата Carrier, но компресорите остават собствена японска разработка — twin-rotary конструкция с два ротора, която работи по-плавно и по-тихо от единичните. Toshiba е изборът за хора, които искат японска надеждност без премиум надценката на Daikin и Mitsubishi Electric.",
        series: [
          "Yukai / Yukai+ — най-достъпната японска серия: A++, R32, компактно вътрешно тяло.",
          "Shorai Edge / New Shorai — среден клас A+++ / A++ с Wi-Fi и отопление до -15 °C.",
          "Essento / Haori — обновените серии с подобрен SEER; Haori е с текстилен сменяем панел.",
          "Super Daiseikai 10 — флагман с плазмен филтър и най-тихата работа в гамата (бял или дървесен панел).",
        ],
        why: [
          { title: "Twin-rotary компресор", desc: "Два ротора вместо един: по-малко вибрации, по-тиха работа и по-дълъг живот — фирмена технология на Toshiba." },
          { title: "Изобретател на инвертора", desc: "40+ години опит с инверторното управление — най-стабилната работа при частично натоварване." },
          { title: "Японски клас без надценка", desc: "Yukai и Shorai струват колкото среден клас, но носят японски компресор и гаранция." },
        ],
        faq: [
          { q: "Toshiba или Daikin — какво да избера?", a: "И двете са японски марки с отлична надеждност. Daikin е по-скъп и има по-широка премиум гама; Toshiba Yukai и Shorai дават сходно качество на компресора на 15–25 % по-ниска цена. За спалня или хол в апартамент Toshiba е разумният избор." },
          { q: "Коя серия Toshiba е най-тиха?", a: "Daiseikai и Shorai Edge — около 20 dB на най-ниска степен. Yukai е малко по-шумна (около 22 dB), но напълно подходяща за спалня в нощен режим." },
          { q: "Колко струва Toshiba с монтаж във Варна?", a: "Цената на уреда плюс 190 € стандартен монтаж (до 14 000 BTU) или 230 € (до 24 000 BTU) с ДДС. Точните цени с монтаж са на страницата на всеки модел." },
        ],
      },
      en: {
        title: "Toshiba Air Conditioners Varna — Yukai, Shorai, Installed",
        description: "Toshiba in Varna: Shorai, Yukai, Essento, Haori, Daiseikai. Japanese twin-rotary compressor, down to -15 °C. Installed prices and stock.",
        h1: "Toshiba air conditioners in Varna",
        intro: "Toshiba launched the world's first inverter air conditioner in 1981. The brand is now part of the Carrier group, but the compressors remain Toshiba's own Japanese design — a twin-rotary layout with two rotors that runs smoother and quieter than single-rotor units. Toshiba is the choice for people who want Japanese reliability without the premium mark-up of Daikin or Mitsubishi Electric.",
        series: [
          "Yukai / Yukai+ — the most affordable Japanese series: A++, R32, compact indoor unit.",
          "Shorai Edge / New Shorai — mid range A+++ / A++ with Wi-Fi and heating down to -15 °C.",
          "Essento / Haori — refreshed series with improved SEER; Haori has a replaceable fabric panel.",
          "Super Daiseikai 10 — flagship with plasma filter and the quietest operation in the range (white or wood panel).",
        ],
        why: [
          { title: "Twin-rotary compressor", desc: "Two rotors instead of one: less vibration, quieter operation and longer life — Toshiba's own technology." },
          { title: "Inventor of the inverter", desc: "40+ years of inverter control — the most stable part-load operation." },
          { title: "Japanese class, no mark-up", desc: "Yukai and Shorai cost mid-range money but carry a Japanese compressor and warranty." },
        ],
        faq: [
          { q: "Toshiba or Daikin — which should I choose?", a: "Both are Japanese brands with excellent reliability. Daikin is pricier with a wider premium range; Toshiba Yukai and Shorai give similar compressor quality at 15–25 % less. For an apartment bedroom or living room Toshiba is the sensible pick." },
          { q: "Which Toshiba series is the quietest?", a: "Daiseikai and Shorai Edge — about 20 dB on the lowest setting. Yukai is slightly louder (about 22 dB) but perfectly fine for a bedroom in night mode." },
          { q: "How much is Toshiba installed in Varna?", a: "Unit price plus €190 standard installation (up to 14,000 BTU) or €230 (up to 24,000 BTU) incl. VAT. Exact installed prices are on each model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры Toshiba Варна — Yukai, Shorai, цены с монтажом",
        description: "Toshiba в Варне: Shorai, Yukai, Essento, Haori, Daiseikai. Японский twin-rotary компрессор, до -15 °C. Цены с монтажом и наличие.",
        h1: "Кондиционеры Toshiba в Варне",
        intro: "Toshiba в 1981 году выпустила первый в мире инверторный кондиционер. Сегодня бренд входит в группу Carrier, но компрессоры остаются собственной японской разработкой — twin-rotary с двумя роторами, который работает плавнее и тише одинарных. Toshiba — выбор тех, кто хочет японскую надёжность без премиум-наценки Daikin и Mitsubishi Electric.",
        series: [
          "Yukai / Yukai+ — самая доступная японская серия: A++, R32, компактный внутренний блок.",
          "Shorai Edge / New Shorai — средний класс A+++ / A++ с Wi-Fi и обогревом до -15 °C.",
          "Essento / Haori — обновлённые серии с улучшенным SEER; Haori — со сменной тканевой панелью.",
          "Super Daiseikai 10 — флагман с плазменным фильтром и самой тихой работой в линейке (белая или деревянная панель).",
        ],
        why: [
          { title: "Twin-rotary компрессор", desc: "Два ротора вместо одного: меньше вибраций, тише работа и дольше срок службы — фирменная технология Toshiba." },
          { title: "Изобретатель инвертора", desc: "40+ лет опыта инверторного управления — самая стабильная работа при частичной нагрузке." },
          { title: "Японский класс без наценки", desc: "Yukai и Shorai стоят как средний класс, но несут японский компрессор и гарантию." },
        ],
        faq: [
          { q: "Toshiba или Daikin — что выбрать?", a: "Оба — японские бренды с отличной надёжностью. Daikin дороже и с более широкой премиум-линейкой; Toshiba Yukai и Shorai дают сопоставимое качество компрессора на 15–25 % дешевле. Для спальни или гостиной в квартире Toshiba — разумный выбор." },
          { q: "Какая серия Toshiba самая тихая?", a: "Daiseikai и Shorai Edge — около 20 дБ на минимальной скорости. Yukai чуть громче (около 22 дБ), но полностью подходит для спальни в ночном режиме." },
          { q: "Сколько стоит Toshiba с монтажом в Варне?", a: "Цена аппарата плюс 190 € стандартный монтаж (до 14 000 BTU) или 230 € (до 24 000 BTU) с НДС. Точные цены с монтажом — на странице каждой модели." },
        ],
      },
      ua: {
        title: "Кондиціонери Toshiba Варна — Yukai, Shorai, ціни з монтажем",
        description: "Toshiba у Варні: Shorai, Yukai, Essento, Haori, Daiseikai. Японський twin-rotary компресор, до -15 °C. Ціни з монтажем і наявність.",
        h1: "Кондиціонери Toshiba у Варні",
        intro: "Toshiba у 1981 році випустила перший у світі інверторний кондиціонер. Сьогодні бренд входить до групи Carrier, але компресори залишаються власною японською розробкою — twin-rotary з двома роторами, що працює плавніше й тихіше за одинарні. Toshiba — вибір тих, хто хоче японську надійність без преміум-націнки Daikin і Mitsubishi Electric.",
        series: [
          "Yukai / Yukai+ — найдоступніша японська серія: A++, R32, компактний внутрішній блок.",
          "Shorai Edge / New Shorai — середній клас A+++ / A++ з Wi-Fi та обігрівом до -15 °C.",
          "Essento / Haori — оновлені серії з покращеним SEER; Haori — зі змінною тканинною панеллю.",
          "Super Daiseikai 10 — флагман із плазмовим фільтром і найтихішою роботою в лінійці (біла або дерев'яна панель).",
        ],
        why: [
          { title: "Twin-rotary компресор", desc: "Два ротори замість одного: менше вібрацій, тихіша робота й довший строк служби — фірмова технологія Toshiba." },
          { title: "Винахідник інвертора", desc: "40+ років досвіду інверторного керування — найстабільніша робота за часткового навантаження." },
          { title: "Японський клас без націнки", desc: "Yukai і Shorai коштують як середній клас, але мають японський компресор і гарантію." },
        ],
        faq: [
          { q: "Toshiba чи Daikin — що обрати?", a: "Обидва — японські бренди з відмінною надійністю. Daikin дорожчий і з ширшою преміум-лінійкою; Toshiba Yukai і Shorai дають співставну якість компресора на 15–25 % дешевше. Для спальні чи вітальні в квартирі Toshiba — розумний вибір." },
          { q: "Яка серія Toshiba найтихіша?", a: "Daiseikai і Shorai Edge — близько 20 дБ на мінімальній швидкості. Yukai трохи гучніша (близько 22 дБ), але повністю підходить для спальні в нічному режимі." },
          { q: "Скільки коштує Toshiba з монтажем у Варні?", a: "Ціна апарата плюс 190 € стандартний монтаж (до 14 000 BTU) або 230 € (до 24 000 BTU) з ПДВ. Точні ціни з монтажем — на сторінці кожної моделі." },
        ],
      },
    },
  },
  {
    slug: "aux",
    manufacturer: "AUX",
    name: "AUX",
    country: "Китай",
    copy: {
      bg: {
        title: "Климатици AUX Варна — Freedom, Neo, цени с монтаж 2026",
        description: "AUX във Варна: Freedom, Neo, C-Comfort, C-Pro, J-Smart — A++ с Wi-Fi от най-достъпните цени в каталога. Отопление до -15 °C. Цени с монтаж, наличности.",
        h1: "Климатици AUX във Варна",
        intro: "AUX е един от петте най-големи производители на климатици в света с над 30 години история и собствени заводи в Китай. В България марката е известна като най-достъпния вход в инверторния клас с Wi-Fi: A++ модели на цена, на която другите предлагат A+. Ако бюджетът е ограничен, а искате пълноценен инвертор с гаранция и сервиз, AUX е най-честата ни препоръка.",
        series: [
          "Freedom — обновената серия 2025–2026: A++, R32, Wi-Fi, отопление до -15 °C.",
          "Neo — компактно вътрешно тяло за малки стаи и офиси.",
          "C-Comfort / C-Pro — среден клас с по-висок SEER и по-тиха работа.",
          "J-Smart — базовата серия за най-нисък бюджет.",
        ],
        why: [
          { title: "Най-ниска цена за A++", desc: "Пълноценен инвертор с Wi-Fi от 300–400 € — най-достъпният начин да имате климатик с отопление." },
          { title: "Топ-5 производител", desc: "AUX прави и компоненти за други марки — това не е ноунейм, а фабрика с 30 години опит." },
          { title: "Сервиз в България", desc: "Официален вносител, резервни части на склад и гаранция при монтаж от оторизиран екип." },
        ],
        faq: [
          { q: "AUX добра марка ли е?", a: "За бюджетния клас — да. AUX е сред петте най-големи производители в света, уредите са с A++ клас, R32 и Wi-Fi. Компромисът спрямо Gree или японските марки е в шума на най-ниска степен (около 24–26 dB) и по-простия дизайн, не в надеждността." },
          { q: "Кой AUX е подходящ за спалня?", a: "Freedom или C-Comfort 9 000 BTU за стаи до 20 кв.м — и двете имат нощен режим. За по-тиха работа в спалня препоръчваме C-Pro." },
          { q: "Колко струва AUX с монтаж във Варна?", a: "Най-достъпните модели излизат около 500–600 € с ДДС заедно със стандартния монтаж от 190 €. Точната цена с монтаж е посочена на страницата на всеки модел." },
        ],
      },
      en: {
        title: "AUX Air Conditioners Varna — Freedom, Neo, Installed Prices",
        description: "AUX in Varna: Freedom, Neo, C-Comfort, C-Pro, J-Smart — A++ with Wi-Fi at the most affordable prices in the catalog. Heating to -15 °C. Installed prices, stock.",
        h1: "AUX air conditioners in Varna",
        intro: "AUX is one of the five largest AC manufacturers in the world with 30+ years of history and its own factories in China. In Bulgaria the brand is known as the most affordable entry into the inverter class with Wi-Fi: A++ models at prices where others offer A+. If the budget is tight but you want a proper inverter with warranty and service, AUX is our most frequent recommendation.",
        series: [
          "Freedom — the refreshed 2025–2026 series: A++, R32, Wi-Fi, heating to -15 °C.",
          "Neo — compact indoor unit for small rooms and offices.",
          "C-Comfort / C-Pro — mid range with higher SEER and quieter operation.",
          "J-Smart — the entry series for the lowest budget.",
        ],
        why: [
          { title: "Lowest price for A++", desc: "A full inverter with Wi-Fi from €300–400 — the most affordable way to get an AC that also heats." },
          { title: "Top-5 manufacturer", desc: "AUX also makes components for other brands — not a no-name, but a factory with 30 years of experience." },
          { title: "Service in Bulgaria", desc: "Official importer, spare parts in stock and warranty with installation by an authorised crew." },
        ],
        faq: [
          { q: "Is AUX a good brand?", a: "For the budget class — yes. AUX is among the five largest manufacturers in the world; the units are A++, R32 and Wi-Fi. The trade-off versus Gree or the Japanese brands is lowest-setting noise (about 24–26 dB) and simpler design, not reliability." },
          { q: "Which AUX suits a bedroom?", a: "Freedom or C-Comfort 9,000 BTU for rooms up to 20 m² — both have a night mode. For quieter bedroom operation we recommend C-Pro." },
          { q: "How much is AUX installed in Varna?", a: "The most affordable models come to about €500–600 incl. VAT together with the €190 standard installation. The exact installed price is on each model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры AUX Варна — Freedom, Neo, цены с монтажом",
        description: "AUX в Варне: Freedom, Neo, C-Comfort, C-Pro, J-Smart — A++ с Wi-Fi по самым доступным ценам каталога. Обогрев до -15 °C. Цены с монтажом, наличие.",
        h1: "Кондиционеры AUX в Варне",
        intro: "AUX — один из пяти крупнейших производителей кондиционеров в мире с 30-летней историей и собственными заводами в Китае. В Болгарии бренд известен как самый доступный вход в инверторный класс с Wi-Fi: модели A++ по цене, за которую другие предлагают A+. Если бюджет ограничен, а нужен полноценный инвертор с гарантией и сервисом, AUX — наша самая частая рекомендация.",
        series: [
          "Freedom — обновлённая серия 2025–2026: A++, R32, Wi-Fi, обогрев до -15 °C.",
          "Neo — компактный внутренний блок для небольших комнат и офисов.",
          "C-Comfort / C-Pro — средний класс с более высоким SEER и тише в работе.",
          "J-Smart — базовая серия для минимального бюджета.",
        ],
        why: [
          { title: "Самая низкая цена за A++", desc: "Полноценный инвертор с Wi-Fi от 300–400 € — самый доступный способ получить кондиционер с обогревом." },
          { title: "Топ-5 производитель", desc: "AUX делает и компоненты для других марок — это не ноунейм, а завод с 30-летним опытом." },
          { title: "Сервис в Болгарии", desc: "Официальный импортёр, запчасти на складе и гарантия при монтаже авторизованной бригадой." },
        ],
        faq: [
          { q: "AUX — хороший бренд?", a: "Для бюджетного класса — да. AUX входит в пятёрку крупнейших производителей мира; аппараты класса A++, R32, с Wi-Fi. Компромисс по сравнению с Gree или японскими брендами — шум на минимальной скорости (около 24–26 дБ) и проще дизайн, а не надёжность." },
          { q: "Какой AUX подходит для спальни?", a: "Freedom или C-Comfort 9 000 BTU для комнат до 20 м² — у обеих есть ночной режим. Для более тихой работы в спальне рекомендуем C-Pro." },
          { q: "Сколько стоит AUX с монтажом в Варне?", a: "Самые доступные модели выходят около 500–600 € с НДС вместе со стандартным монтажом 190 €. Точная цена с монтажом — на странице каждой модели." },
        ],
      },
      ua: {
        title: "Кондиціонери AUX Варна — Freedom, Neo, ціни з монтажем",
        description: "AUX у Варні: Freedom, Neo, C-Comfort, C-Pro, J-Smart — A++ з Wi-Fi за найдоступнішими цінами каталогу. Обігрів до -15 °C. Ціни з монтажем, наявність.",
        h1: "Кондиціонери AUX у Варні",
        intro: "AUX — один із п'яти найбільших виробників кондиціонерів у світі з 30-річною історією та власними заводами в Китаї. У Болгарії бренд відомий як найдоступніший вхід в інверторний клас із Wi-Fi: моделі A++ за ціною, за яку інші пропонують A+. Якщо бюджет обмежений, а потрібен повноцінний інвертор із гарантією та сервісом, AUX — наша найчастіша рекомендація.",
        series: [
          "Freedom — оновлена серія 2025–2026: A++, R32, Wi-Fi, обігрів до -15 °C.",
          "Neo — компактний внутрішній блок для невеликих кімнат і офісів.",
          "C-Comfort / C-Pro — середній клас із вищим SEER і тихішою роботою.",
          "J-Smart — базова серія для мінімального бюджету.",
        ],
        why: [
          { title: "Найнижча ціна за A++", desc: "Повноцінний інвертор із Wi-Fi від 300–400 € — найдоступніший спосіб отримати кондиціонер з обігрівом." },
          { title: "Топ-5 виробник", desc: "AUX робить і компоненти для інших марок — це не ноунейм, а завод із 30-річним досвідом." },
          { title: "Сервіс у Болгарії", desc: "Офіційний імпортер, запчастини на складі та гарантія за монтажу авторизованою бригадою." },
        ],
        faq: [
          { q: "AUX — хороший бренд?", a: "Для бюджетного класу — так. AUX входить до п'ятірки найбільших виробників світу; апарати класу A++, R32, з Wi-Fi. Компроміс порівняно з Gree чи японськими брендами — шум на мінімальній швидкості (близько 24–26 дБ) і простіший дизайн, а не надійність." },
          { q: "Який AUX підходить для спальні?", a: "Freedom або C-Comfort 9 000 BTU для кімнат до 20 м² — обидві мають нічний режим. Для тихішої роботи в спальні радимо C-Pro." },
          { q: "Скільки коштує AUX з монтажем у Варні?", a: "Найдоступніші моделі виходять близько 500–600 € з ПДВ разом зі стандартним монтажем 190 €. Точна ціна з монтажем — на сторінці кожної моделі." },
        ],
      },
    },
  },
  {
    slug: "nippon",
    manufacturer: "Nippon",
    name: "Nippon",
    country: "Китай",
    copy: {
      bg: {
        title: "Климатици Nippon Варна — цени с монтаж, KFR серия 2026",
        description: "Nippon във Варна: серия KFR — инверторни климатици A++ с Wi-Fi на бюджетна цена, широко разпространени в България. Цени с монтаж, наличности, гаранция.",
        h1: "Климатици Nippon във Варна",
        intro: "Nippon е бюджетна марка, произведена в Китай и разпространявана в България от години — ще я видите в много апартаменти и офиси във Варна. Серията KFR покрива стандартните мощности 9–24k BTU с A++ клас, R32 и Wi-Fi. Не е премиум продукт, но е честен инвертор с гаранция и сервиз, който върши работа в стая с нормално изложение на цена, близка до най-ниската в каталога ни.",
        series: [
          "KFR Glory Pro — обновената серия с Wi-Fi и подобрен SEER.",
          "KFR Silver Ion — с йонизиращ филтър за по-чист въздух.",
          "KFR Nordic — версията за студен климат с отопление под -15 °C.",
        ],
        why: [
          { title: "Цена", desc: "Сред най-достъпните инвертори в каталога — за втора стая, офис или вила." },
          { title: "Познат в България", desc: "Марката се продава и сервизира у нас от години; резервни части има на склад." },
          { title: "Пълна гаранция", desc: "Гаранция от вносителя при монтаж от оторизиран екип плюс 12 месеца на монтажа." },
        ],
        faq: [
          { q: "Nippon добра марка ли е?", a: "За бюджетния сегмент — да, при разумни очаквания. Уредите са A++ инвертори с R32 и Wi-Fi; компромисът е в шума на най-ниска степен и по-простия вътрешен дизайн. За основно отопление през зимата бихме препоръчали Gree или японска марка." },
          { q: "За какви помещения е подходящ Nippon?", a: "За стаи с нормално изложение: 9 000 BTU до 20 кв.м, 12 000 BTU до 25 кв.м, 18 000 BTU до 40 кв.м. При южни стаи или последен етаж вземете следващата мощност." },
          { q: "Колко струва Nippon с монтаж във Варна?", a: "Цената на уреда плюс 190 € стандартен монтаж с ДДС за модели до 14 000 BTU. Точната сума с монтаж е на страницата на всеки модел." },
        ],
      },
      en: {
        title: "Nippon Air Conditioners Varna — Installed Prices, KFR Series",
        description: "Nippon in Varna: KFR series — A++ inverter ACs with Wi-Fi at a budget price, widely sold in Bulgaria. Installed prices, stock, warranty.",
        h1: "Nippon air conditioners in Varna",
        intro: "Nippon is a budget brand made in China and distributed in Bulgaria for years — you will find it in many Varna apartments and offices. The KFR series covers the standard 9–24k BTU capacities with A++ class, R32 and Wi-Fi. Not a premium product, but an honest inverter with warranty and service that does the job in a room with normal exposure, at a price close to the lowest in our catalog.",
        series: [
          "KFR Glory Pro — the refreshed series with Wi-Fi and improved SEER.",
          "KFR Silver Ion — with an ionising filter for cleaner air.",
          "KFR Nordic — the cold-climate version with heating below -15 °C.",
        ],
        why: [
          { title: "Price", desc: "Among the most affordable inverters in the catalog — for a second room, office or holiday home." },
          { title: "Known in Bulgaria", desc: "Sold and serviced here for years; spare parts are in stock." },
          { title: "Full warranty", desc: "Importer warranty with installation by an authorised crew plus 12 months on the installation." },
        ],
        faq: [
          { q: "Is Nippon a good brand?", a: "For the budget segment — yes, with reasonable expectations. The units are A++ inverters with R32 and Wi-Fi; the trade-off is lowest-setting noise and a simpler indoor design. For primary winter heating we would recommend Gree or a Japanese brand." },
          { q: "What rooms is Nippon suitable for?", a: "Rooms with normal exposure: 9,000 BTU up to 20 m², 12,000 BTU up to 25 m², 18,000 BTU up to 40 m². For south-facing rooms or a top floor take the next capacity up." },
          { q: "How much is Nippon installed in Varna?", a: "Unit price plus €190 standard installation incl. VAT for models up to 14,000 BTU. The exact installed total is on each model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры Nippon Варна — цены с монтажом, серия KFR",
        description: "Nippon в Варне: серия KFR — инверторные кондиционеры A++ с Wi-Fi по бюджетной цене, широко распространены в Болгарии. Цены с монтажом, наличие, гарантия.",
        h1: "Кондиционеры Nippon в Варне",
        intro: "Nippon — бюджетный бренд, произведённый в Китае и годами продаваемый в Болгарии: вы встретите его во многих квартирах и офисах Варны. Серия KFR покрывает стандартные мощности 9–24k BTU с классом A++, R32 и Wi-Fi. Не премиум-продукт, но честный инвертор с гарантией и сервисом, который справляется в комнате с нормальной ориентацией по цене, близкой к самой низкой в нашем каталоге.",
        series: [
          "KFR Glory Pro — обновлённая серия с Wi-Fi и улучшенным SEER.",
          "KFR Silver Ion — с ионизирующим фильтром для более чистого воздуха.",
          "KFR Nordic — версия для холодного климата с обогревом ниже -15 °C.",
        ],
        why: [
          { title: "Цена", desc: "Среди самых доступных инверторов каталога — для второй комнаты, офиса или дачи." },
          { title: "Известен в Болгарии", desc: "Продаётся и обслуживается здесь годами; запчасти есть на складе." },
          { title: "Полная гарантия", desc: "Гарантия импортёра при монтаже авторизованной бригадой плюс 12 месяцев на монтаж." },
        ],
        faq: [
          { q: "Nippon — хороший бренд?", a: "Для бюджетного сегмента — да, при разумных ожиданиях. Аппараты — инверторы A++ с R32 и Wi-Fi; компромисс — шум на минимальной скорости и более простой дизайн внутреннего блока. Для основного зимнего отопления мы бы рекомендовали Gree или японский бренд." },
          { q: "Для каких помещений подходит Nippon?", a: "Для комнат с нормальной ориентацией: 9 000 BTU до 20 м², 12 000 BTU до 25 м², 18 000 BTU до 40 м². При южных комнатах или последнем этаже берите следующую мощность." },
          { q: "Сколько стоит Nippon с монтажом в Варне?", a: "Цена аппарата плюс 190 € стандартный монтаж с НДС для моделей до 14 000 BTU. Точная сумма с монтажом — на странице каждой модели." },
        ],
      },
      ua: {
        title: "Кондиціонери Nippon Варна — ціни з монтажем, серія KFR",
        description: "Nippon у Варні: серія KFR — інверторні кондиціонери A++ з Wi-Fi за бюджетною ціною, широко поширені в Болгарії. Ціни з монтажем, наявність, гарантія.",
        h1: "Кондиціонери Nippon у Варні",
        intro: "Nippon — бюджетний бренд, вироблений у Китаї та роками продаваний у Болгарії: ви зустрінете його в багатьох квартирах і офісах Варни. Серія KFR покриває стандартні потужності 9–24k BTU з класом A++, R32 і Wi-Fi. Не преміум-продукт, але чесний інвертор із гарантією та сервісом, що справляється в кімнаті з нормальною орієнтацією за ціною, близькою до найнижчої в нашому каталозі.",
        series: [
          "KFR Glory Pro — оновлена серія з Wi-Fi і покращеним SEER.",
          "KFR Silver Ion — з іонізуючим фільтром для чистішого повітря.",
          "KFR Nordic — версія для холодного клімату з обігрівом нижче -15 °C.",
        ],
        why: [
          { title: "Ціна", desc: "Серед найдоступніших інверторів каталогу — для другої кімнати, офісу чи дачі." },
          { title: "Відомий у Болгарії", desc: "Продається й обслуговується тут роками; запчастини є на складі." },
          { title: "Повна гарантія", desc: "Гарантія імпортера за монтажу авторизованою бригадою плюс 12 місяців на монтаж." },
        ],
        faq: [
          { q: "Nippon — хороший бренд?", a: "Для бюджетного сегмента — так, за розумних очікувань. Апарати — інвертори A++ з R32 і Wi-Fi; компроміс — шум на мінімальній швидкості та простіший дизайн внутрішнього блока. Для основного зимового опалення ми б радили Gree або японський бренд." },
          { q: "Для яких приміщень підходить Nippon?", a: "Для кімнат із нормальною орієнтацією: 9 000 BTU до 20 м², 12 000 BTU до 25 м², 18 000 BTU до 40 м². За південних кімнат або останнього поверху беріть наступну потужність." },
          { q: "Скільки коштує Nippon з монтажем у Варні?", a: "Ціна апарата плюс 190 € стандартний монтаж з ПДВ для моделей до 14 000 BTU. Точна сума з монтажем — на сторінці кожної моделі." },
        ],
      },
    },
  },
  {
    slug: "hitachi",
    manufacturer: "HITACHI",
    name: "Hitachi",
    country: "Япония",
    copy: {
      bg: {
        title: "Климатици Hitachi Варна — RAK-DJ, цени с монтаж 2026",
        description: "Hitachi във Варна: серия AirHome (RAK-DJ) — японски инвертор A++, FrostWash самопочистване, тиха работа. Цени с монтаж, наличности, гаранция. Собствен екип.",
        h1: "Климатици Hitachi във Варна",
        intro: "Hitachi е японска марка от групата Johnson Controls-Hitachi — компанията, която прави и индустриални VRF системи за офис сгради. Битовата серия RAK-DJ носи същия подход: инверторен компресор с плавно управление, FrostWash технология за самопочистване на топлообменника и работа на ниско ниво на шум. Изборът е за хора, които искат японска техника с малко по-различен дизайн от масовите Daikin и Mitsubishi.",
        series: [
          "AirHome 400 (RAK-DJ) — основната серия: A++, R32, FrostWash, Wi-Fi.",
          "AirHome 600 — по-висок клас с по-тиха работа и по-силно отопление.",
        ],
        why: [
          { title: "FrostWash", desc: "Топлообменникът замръзва и се размразява по команда, отмивайки прах и бактерии — по-малко ръчно почистване." },
          { title: "Японски инвертор", desc: "Плавно управление на компресора и стабилна температура без цикли включване/изключване." },
          { title: "Индустриален произход", desc: "Hitachi прави VRF системи за цели сгради — битовата гама наследява същите компоненти." },
        ],
        faq: [
          { q: "Hitachi или Mitsubishi — какво да избера?", a: "И двете са японски и надеждни. Hitachi RAK-DJ е сравним с Mitsubishi Heavy SRK ZS по клас и шум, а FrostWash е реално предимство при прашни помещения. Ако най-важен е шумът в спалня, Mitsubishi Heavy е с 1–2 dB по-тих." },
          { q: "Какво е FrostWash?", a: "Функция, при която вътрешният топлообменник се замразява, след което ледът се размразява и отмива натрупаните прах и микроорганизми. Не замества годишната профилактика, но я прави по-лека." },
          { q: "Колко струва Hitachi с монтаж във Варна?", a: "Цената на уреда плюс 190 € стандартен монтаж с ДДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точната сума е на страницата на модела." },
        ],
      },
      en: {
        title: "Hitachi Air Conditioners Varna — RAK-DJ, Installed Prices",
        description: "Hitachi in Varna: AirHome (RAK-DJ) series — Japanese inverter A++, FrostWash self-cleaning, quiet operation. Installed prices, stock, warranty. In-house crew.",
        h1: "Hitachi air conditioners in Varna",
        intro: "Hitachi is a Japanese brand of the Johnson Controls-Hitachi group — the company that also builds industrial VRF systems for office buildings. The residential RAK-DJ series carries the same approach: an inverter compressor with smooth control, FrostWash self-cleaning of the heat exchanger and low noise. It is the pick for people who want Japanese engineering with a slightly different design from the mainstream Daikin and Mitsubishi.",
        series: [
          "AirHome 400 (RAK-DJ) — the core series: A++, R32, FrostWash, Wi-Fi.",
          "AirHome 600 — higher class with quieter operation and stronger heating.",
        ],
        why: [
          { title: "FrostWash", desc: "The heat exchanger freezes and thaws on command, washing off dust and bacteria — less manual cleaning." },
          { title: "Japanese inverter", desc: "Smooth compressor control and stable temperature without on/off cycling." },
          { title: "Industrial pedigree", desc: "Hitachi builds VRF systems for whole buildings — the residential range inherits the same components." },
        ],
        faq: [
          { q: "Hitachi or Mitsubishi — which to choose?", a: "Both are Japanese and reliable. Hitachi RAK-DJ is comparable to Mitsubishi Heavy SRK ZS in class and noise, and FrostWash is a real advantage in dusty rooms. If bedroom noise matters most, Mitsubishi Heavy is 1–2 dB quieter." },
          { q: "What is FrostWash?", a: "A function where the indoor heat exchanger is frozen, then the ice thaws and washes away accumulated dust and microorganisms. It does not replace annual maintenance but makes it lighter." },
          { q: "How much is Hitachi installed in Varna?", a: "Unit price plus €190 standard installation incl. VAT (up to 14,000 BTU) or €230 (up to 24,000 BTU). The exact total is on the model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры Hitachi Варна — RAK-DJ, цены с монтажом",
        description: "Hitachi в Варне: серия AirHome (RAK-DJ) — японский инвертор A++, самоочистка FrostWash, тихая работа. Цены с монтажом, наличие, гарантия. Своя бригада.",
        h1: "Кондиционеры Hitachi в Варне",
        intro: "Hitachi — японский бренд группы Johnson Controls-Hitachi, которая делает и промышленные VRF-системы для офисных зданий. Бытовая серия RAK-DJ несёт тот же подход: инверторный компрессор с плавным управлением, технология самоочистки FrostWash и низкий уровень шума. Выбор для тех, кто хочет японскую технику с чуть иным дизайном, чем массовые Daikin и Mitsubishi.",
        series: [
          "AirHome 400 (RAK-DJ) — основная серия: A++, R32, FrostWash, Wi-Fi.",
          "AirHome 600 — класс выше, тише в работе и с более сильным обогревом.",
        ],
        why: [
          { title: "FrostWash", desc: "Теплообменник замораживается и оттаивает по команде, смывая пыль и бактерии — меньше ручной чистки." },
          { title: "Японский инвертор", desc: "Плавное управление компрессором и стабильная температура без циклов включения/выключения." },
          { title: "Промышленное происхождение", desc: "Hitachi делает VRF-системы для целых зданий — бытовая линейка наследует те же компоненты." },
        ],
        faq: [
          { q: "Hitachi или Mitsubishi — что выбрать?", a: "Оба японские и надёжные. Hitachi RAK-DJ сопоставим с Mitsubishi Heavy SRK ZS по классу и шуму, а FrostWash — реальное преимущество в пыльных помещениях. Если важнее всего тишина в спальне, Mitsubishi Heavy на 1–2 дБ тише." },
          { q: "Что такое FrostWash?", a: "Функция, при которой внутренний теплообменник замораживается, затем лёд оттаивает и смывает накопленную пыль и микроорганизмы. Не заменяет ежегодную профилактику, но облегчает её." },
          { q: "Сколько стоит Hitachi с монтажом в Варне?", a: "Цена аппарата плюс 190 € стандартный монтаж с НДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точная сумма — на странице модели." },
        ],
      },
      ua: {
        title: "Кондиціонери Hitachi Варна — RAK-DJ, ціни з монтажем",
        description: "Hitachi у Варні: серія AirHome (RAK-DJ) — японський інвертор A++, самоочищення FrostWash, тиха робота. Ціни з монтажем, наявність, гарантія. Власна бригада.",
        h1: "Кондиціонери Hitachi у Варні",
        intro: "Hitachi — японський бренд групи Johnson Controls-Hitachi, яка робить і промислові VRF-системи для офісних будівель. Побутова серія RAK-DJ несе той самий підхід: інверторний компресор із плавним керуванням, технологія самоочищення FrostWash і низький рівень шуму. Вибір для тих, хто хоче японську техніку з дещо іншим дизайном, ніж масові Daikin і Mitsubishi.",
        series: [
          "AirHome 400 (RAK-DJ) — основна серія: A++, R32, FrostWash, Wi-Fi.",
          "AirHome 600 — вищий клас, тихіша робота й сильніший обігрів.",
        ],
        why: [
          { title: "FrostWash", desc: "Теплообмінник заморожується й відтає за командою, змиваючи пил і бактерії — менше ручного чищення." },
          { title: "Японський інвертор", desc: "Плавне керування компресором і стабільна температура без циклів увімкнення/вимкнення." },
          { title: "Промислове походження", desc: "Hitachi робить VRF-системи для цілих будівель — побутова лінійка успадковує ті самі компоненти." },
        ],
        faq: [
          { q: "Hitachi чи Mitsubishi — що обрати?", a: "Обидва японські й надійні. Hitachi RAK-DJ співставний із Mitsubishi Heavy SRK ZS за класом і шумом, а FrostWash — реальна перевага в запилених приміщеннях. Якщо найважливіша тиша в спальні, Mitsubishi Heavy на 1–2 дБ тихіший." },
          { q: "Що таке FrostWash?", a: "Функція, за якої внутрішній теплообмінник заморожується, потім лід відтає й змиває накопичений пил і мікроорганізми. Не замінює щорічну профілактику, але полегшує її." },
          { q: "Скільки коштує Hitachi з монтажем у Варні?", a: "Ціна апарата плюс 190 € стандартний монтаж з ПДВ (до 14 000 BTU) або 230 € (до 24 000 BTU). Точна сума — на сторінці моделі." },
        ],
      },
    },
  },
  {
    slug: "lg",
    manufacturer: "LG",
    name: "LG",
    country: "Южна Корея",
    copy: {
      bg: {
        title: "Климатици LG Варна — Dual Inverter, ThinQ, цени с монтаж",
        description: "LG във Варна: Standard, Artcool Gallery, мултисплит — Dual Inverter компресор с 10 г. гаранция, ThinQ Wi-Fi. Цени с монтаж, наличности. Собствен екип.",
        h1: "Климатици LG във Варна",
        intro: "LG е корейският производител, който наложи Dual Inverter компресора — два ротора с 10-годишна гаранция на самия компресор. Битовата гама е фокусирана върху дизайн (Artcool Gallery с рамка за картина) и умни функции: ThinQ приложението управлява уреда отвсякъде, следи разхода и диагностицира грешки. Изборът е за хора, за които видът на вътрешното тяло в хола е толкова важен, колкото и работата му.",
        series: [
          "Standard (Win) — базовата серия: A++, Dual Inverter, ThinQ Wi-Fi.",
          "Artcool Gallery — дизайнерска серия с рамка за картина вместо стандартно тяло.",
          "MU2R / MU3R мултисплит външни тела — едно външно тяло за 2–3 стаи.",
        ],
        why: [
          { title: "10 г. гаранция на компресора", desc: "LG дава 10 години на Dual Inverter компресора — най-дългата гаранция на ключовия компонент в класа." },
          { title: "ThinQ", desc: "Управление, график и диагностика от телефона; интеграция с Google Home и Alexa." },
          { title: "Дизайн", desc: "Artcool Gallery е климатикът, който клиентите избират за хол с интериор — вместо да го крият." },
        ],
        faq: [
          { q: "LG добра марка за климатици ли е?", a: "Да — LG е сред най-големите производители на компресори в света, а Dual Inverter има 10-годишна гаранция. По надеждност е на нивото на японските марки; разликата е в дизайна и умните функции, където LG е по-напред." },
          { q: "Какво е Dual Inverter?", a: "Компресор с два ротора, които се въртят в противофаза — по-малко вибрации, по-тиха работа и по-бързо достигане на зададената температура. LG дава 10 години гаранция на самия компресор." },
          { q: "Колко струва LG с монтаж във Варна?", a: "Цената на уреда плюс 190 € стандартен монтаж с ДДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точната сума е на страницата на модела." },
        ],
      },
      en: {
        title: "LG Air Conditioners Varna — Dual Inverter, ThinQ, Installed",
        description: "LG in Varna: Standard, Artcool Gallery, мултисплит — Dual Inverter compressor with 10-year warranty, ThinQ Wi-Fi. Installed prices, stock. In-house crew.",
        h1: "LG air conditioners in Varna",
        intro: "LG is the Korean manufacturer that made the Dual Inverter compressor mainstream — two rotors with a 10-year warranty on the compressor itself. The residential range focuses on design (Artcool Gallery with a picture frame) and smart features: the ThinQ app controls the unit from anywhere, tracks consumption and diagnoses faults. It is the choice for people for whom how the indoor unit looks in the living room matters as much as how it works.",
        series: [
          "Standard (Win) — the core series: A++, Dual Inverter, ThinQ Wi-Fi.",
          "Artcool Gallery — design series with a picture frame instead of a standard unit.",
          "MU2R / MU3R multi-split outdoor units — one outdoor unit for 2–3 rooms.",
        ],
        why: [
          { title: "10-year compressor warranty", desc: "LG gives 10 years on the Dual Inverter compressor — the longest warranty on the key component in its class." },
          { title: "ThinQ", desc: "Control, scheduling and diagnostics from your phone; Google Home and Alexa integration." },
          { title: "Design", desc: "Artcool Gallery is the AC customers choose for a designed living room — instead of hiding it." },
        ],
        faq: [
          { q: "Is LG a good AC brand?", a: "Yes — LG is among the largest compressor manufacturers in the world and Dual Inverter carries a 10-year warranty. Reliability matches the Japanese brands; the difference is design and smart features, where LG is ahead." },
          { q: "What is Dual Inverter?", a: "A compressor with two rotors turning in counter-phase — less vibration, quieter operation and faster reach of the set temperature. LG gives 10 years on the compressor itself." },
          { q: "How much is LG installed in Varna?", a: "Unit price plus €190 standard installation incl. VAT (up to 14,000 BTU) or €230 (up to 24,000 BTU). The exact total is on the model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры LG Варна — Dual Inverter, ThinQ, цены с монтажом",
        description: "LG в Варне: Standard, Artcool Gallery, мултисплит — компрессор Dual Inverter с гарантией 10 лет, ThinQ Wi-Fi. Цены с монтажом, наличие. Своя бригада.",
        h1: "Кондиционеры LG в Варне",
        intro: "LG — корейский производитель, сделавший массовым компрессор Dual Inverter: два ротора и 10-летняя гарантия на сам компрессор. Бытовая линейка сфокусирована на дизайне (Artcool Gallery с рамой для картины) и умных функциях: приложение ThinQ управляет аппаратом откуда угодно, следит за расходом и диагностирует ошибки. Выбор для тех, кому вид внутреннего блока в гостиной так же важен, как и его работа.",
        series: [
          "Standard (Win) — базовая серия: A++, Dual Inverter, ThinQ Wi-Fi.",
          "Artcool Gallery — дизайнерская серия с рамой для картины вместо стандартного блока.",
          "MU2R / MU3R мультисплит — один наружный блок на 2–3 комнаты.",
        ],
        why: [
          { title: "10 лет гарантии на компрессор", desc: "LG даёт 10 лет на компрессор Dual Inverter — самая долгая гарантия на ключевой узел в классе." },
          { title: "ThinQ", desc: "Управление, расписание и диагностика с телефона; интеграция с Google Home и Alexa." },
          { title: "Дизайн", desc: "Artcool Gallery — кондиционер, который выбирают для гостиной с интерьером, а не прячут." },
        ],
        faq: [
          { q: "LG — хороший бренд кондиционеров?", a: "Да — LG среди крупнейших производителей компрессоров в мире, а на Dual Inverter даётся 10 лет гарантии. По надёжности на уровне японских брендов; разница в дизайне и умных функциях, где LG впереди." },
          { q: "Что такое Dual Inverter?", a: "Компрессор с двумя роторами, вращающимися в противофазе — меньше вибраций, тише работа и быстрее выход на заданную температуру. LG даёт 10 лет гарантии на сам компрессор." },
          { q: "Сколько стоит LG с монтажом в Варне?", a: "Цена аппарата плюс 190 € стандартный монтаж с НДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точная сумма — на странице модели." },
        ],
      },
      ua: {
        title: "Кондиціонери LG Варна — Dual Inverter, ThinQ, ціни з монтажем",
        description: "LG у Варні: Standard, Artcool Gallery, мултисплит — компресор Dual Inverter з гарантією 10 років, ThinQ Wi-Fi. Ціни з монтажем, наявність. Власна бригада.",
        h1: "Кондиціонери LG у Варні",
        intro: "LG — корейський виробник, який зробив масовим компресор Dual Inverter: два ротори та 10-річна гарантія на сам компресор. Побутова лінійка сфокусована на дизайні (Artcool Gallery з рамою для картини) і розумних функціях: застосунок ThinQ керує апаратом звідусіль, стежить за витратою й діагностує помилки. Вибір для тих, кому вигляд внутрішнього блока у вітальні так само важливий, як і його робота.",
        series: [
          "Standard (Win) — базова серія: A++, Dual Inverter, ThinQ Wi-Fi.",
          "Artcool Gallery — дизайнерська серія з рамою для картини замість стандартного блока.",
          "MU2R / MU3R мультиспліт — один зовнішній блок на 2–3 кімнати.",
        ],
        why: [
          { title: "10 років гарантії на компресор", desc: "LG дає 10 років на компресор Dual Inverter — найдовша гарантія на ключовий вузол у класі." },
          { title: "ThinQ", desc: "Керування, розклад і діагностика з телефона; інтеграція з Google Home і Alexa." },
          { title: "Дизайн", desc: "Artcool Gallery — кондиціонер, який обирають для вітальні з інтер'єром, а не ховають." },
        ],
        faq: [
          { q: "LG — хороший бренд кондиціонерів?", a: "Так — LG серед найбільших виробників компресорів у світі, а на Dual Inverter дається 10 років гарантії. За надійністю на рівні японських брендів; різниця в дизайні та розумних функціях, де LG попереду." },
          { q: "Що таке Dual Inverter?", a: "Компресор із двома роторами, що обертаються у протифазі — менше вібрацій, тихіша робота й швидший вихід на задану температуру. LG дає 10 років гарантії на сам компресор." },
          { q: "Скільки коштує LG з монтажем у Варні?", a: "Ціна апарата плюс 190 € стандартний монтаж з ПДВ (до 14 000 BTU) або 230 € (до 24 000 BTU). Точна сума — на сторінці моделі." },
        ],
      },
    },
  },
  {
    slug: "techpoint",
    manufacturer: "Techpoint",
    name: "Techpoint",
    country: "Китай",
    copy: {
      bg: {
        title: "Климатици Techpoint Варна — NPT X-PRO Nordic, цени с монтаж",
        description: "Techpoint във Варна: серия NPT X-PRO Nordic — инверторни климатици за студен климат с отопление под -20 °C на достъпна цена. Цени с монтаж, наличности, гаранция.",
        h1: "Климатици Techpoint във Варна",
        intro: "Techpoint е бюджетна марка, произведена в Китай и разпространявана в България, с една ясна специализация: серията NPT X-PRO Nordic е проектирана за студен климат и запазва отоплителната мощност при температури, при които базовите модели на други марки вече губят капацитет. Ако климатикът ще е основно отопление на къща или вила край Варна, а бюджетът не стига за Gree Amber или японска марка, Nordic серията е разумният компромис.",
        series: [
          "NPT X-PRO Nordic — версията за студен климат: A++, R32, Wi-Fi, отопление под -20 °C.",
          "TCP H — стандартната серия за апартамент на най-ниска цена.",
        ],
        why: [
          { title: "Отопление в студ", desc: "Nordic серията е специално за зимна работа — компресор и топлообменник, оразмерени за минусови температури." },
          { title: "Цена", desc: "Уред за студен климат на цената на стандартен инвертор от друга марка." },
          { title: "Гаранция и сервиз", desc: "Гаранция от вносителя при монтаж от оторизиран екип, резервни части в България." },
        ],
        faq: [
          { q: "Techpoint добра марка ли е?", a: "За бюджетния клас с акцент върху отоплението — да. Nordic серията реално работи при по-ниски температури от стандартните бюджетни модели. Компромисът е в шума и дизайна, не в надеждността на компресора." },
          { q: "Може ли Techpoint Nordic да отоплява къща през зимата?", a: "Да, това е предназначението на серията — работа под -20 °C със запазена мощност. За къща над 60 кв.м обикновено са нужни два уреда или един 24 000 BTU в основното помещение." },
          { q: "Колко струва Techpoint с монтаж във Варна?", a: "Цената на уреда плюс 190 € стандартен монтаж с ДДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точната сума е на страницата на модела." },
        ],
      },
      en: {
        title: "Techpoint Air Conditioners Varna — NPT X-PRO Nordic, Installed",
        description: "Techpoint in Varna: NPT X-PRO Nordic series — cold-climate inverter ACs with heating below -20 °C at an affordable price. Installed prices, stock, warranty.",
        h1: "Techpoint air conditioners in Varna",
        intro: "Techpoint is a budget brand made in China and distributed in Bulgaria with one clear specialisation: the NPT X-PRO Nordic series is designed for cold climates and keeps its heating output at temperatures where entry models of other brands already lose capacity. If the AC will be the main heating of a house or holiday home near Varna and the budget does not stretch to a Gree Amber or a Japanese brand, the Nordic series is the sensible compromise.",
        series: [
          "NPT X-PRO Nordic — the cold-climate version: A++, R32, Wi-Fi, heating below -20 °C.",
          "TCP H — the standard apartment series at the lowest price.",
        ],
        why: [
          { title: "Heating in the cold", desc: "The Nordic series is built for winter duty — compressor and heat exchanger sized for sub-zero temperatures." },
          { title: "Price", desc: "A cold-climate unit at the price of another brand's standard inverter." },
          { title: "Warranty and service", desc: "Importer warranty with installation by an authorised crew, spare parts in Bulgaria." },
        ],
        faq: [
          { q: "Is Techpoint a good brand?", a: "For the budget class with a focus on heating — yes. The Nordic series genuinely runs at lower temperatures than standard budget models. The trade-off is noise and design, not compressor reliability." },
          { q: "Can Techpoint Nordic heat a house in winter?", a: "Yes, that is what the series is for — operation below -20 °C with retained output. For a house over 60 m² you usually need two units or one 24,000 BTU in the main room." },
          { q: "How much is Techpoint installed in Varna?", a: "Unit price plus €190 standard installation incl. VAT (up to 14,000 BTU) or €230 (up to 24,000 BTU). The exact total is on the model's page." },
        ],
      },
      ru: {
        title: "Кондиционеры Techpoint Варна — NPT X-PRO Nordic, цены с монтажом",
        description: "Techpoint в Варне: серия NPT X-PRO Nordic — инверторные кондиционеры для холодного климата с обогревом ниже -20 °C по доступной цене. Цены с монтажом, наличие, гарантия.",
        h1: "Кондиционеры Techpoint в Варне",
        intro: "Techpoint — бюджетный бренд, произведённый в Китае и продаваемый в Болгарии, с одной чёткой специализацией: серия NPT X-PRO Nordic спроектирована для холодного климата и сохраняет мощность обогрева при температурах, где базовые модели других марок уже теряют производительность. Если кондиционер будет основным отоплением дома или дачи под Варной, а бюджета не хватает на Gree Amber или японский бренд, серия Nordic — разумный компромисс.",
        series: [
          "NPT X-PRO Nordic — версия для холодного климата: A++, R32, Wi-Fi, обогрев ниже -20 °C.",
          "TCP H — стандартная серия для квартиры по самой низкой цене.",
        ],
        why: [
          { title: "Обогрев в мороз", desc: "Серия Nordic создана для зимней работы — компрессор и теплообменник рассчитаны на минусовые температуры." },
          { title: "Цена", desc: "Аппарат для холодного климата по цене стандартного инвертора другой марки." },
          { title: "Гарантия и сервис", desc: "Гарантия импортёра при монтаже авторизованной бригадой, запчасти в Болгарии." },
        ],
        faq: [
          { q: "Techpoint — хороший бренд?", a: "Для бюджетного класса с акцентом на обогрев — да. Серия Nordic реально работает при более низких температурах, чем стандартные бюджетные модели. Компромисс — шум и дизайн, а не надёжность компрессора." },
          { q: "Может ли Techpoint Nordic отапливать дом зимой?", a: "Да, это назначение серии — работа ниже -20 °C с сохранением мощности. Для дома больше 60 м² обычно нужны два аппарата или один на 24 000 BTU в основном помещении." },
          { q: "Сколько стоит Techpoint с монтажом в Варне?", a: "Цена аппарата плюс 190 € стандартный монтаж с НДС (до 14 000 BTU) или 230 € (до 24 000 BTU). Точная сумма — на странице модели." },
        ],
      },
      ua: {
        title: "Кондиціонери Techpoint Варна — NPT X-PRO Nordic, ціни з монтажем",
        description: "Techpoint у Варні: серія NPT X-PRO Nordic — інверторні кондиціонери для холодного клімату з обігрівом нижче -20 °C за доступною ціною. Ціни з монтажем, наявність, гарантія.",
        h1: "Кондиціонери Techpoint у Варні",
        intro: "Techpoint — бюджетний бренд, вироблений у Китаї та продаваний у Болгарії, з однією чіткою спеціалізацією: серія NPT X-PRO Nordic спроєктована для холодного клімату й зберігає потужність обігріву за температур, де базові моделі інших марок уже втрачають продуктивність. Якщо кондиціонер буде основним опаленням будинку чи дачі під Варною, а бюджету не вистачає на Gree Amber або японський бренд, серія Nordic — розумний компроміс.",
        series: [
          "NPT X-PRO Nordic — версія для холодного клімату: A++, R32, Wi-Fi, обігрів нижче -20 °C.",
          "TCP H — стандартна серія для квартири за найнижчою ціною.",
        ],
        why: [
          { title: "Обігрів у мороз", desc: "Серія Nordic створена для зимової роботи — компресор і теплообмінник розраховані на мінусові температури." },
          { title: "Ціна", desc: "Апарат для холодного клімату за ціною стандартного інвертора іншої марки." },
          { title: "Гарантія і сервіс", desc: "Гарантія імпортера за монтажу авторизованою бригадою, запчастини в Болгарії." },
        ],
        faq: [
          { q: "Techpoint — хороший бренд?", a: "Для бюджетного класу з акцентом на обігрів — так. Серія Nordic реально працює за нижчих температур, ніж стандартні бюджетні моделі. Компроміс — шум і дизайн, а не надійність компресора." },
          { q: "Чи може Techpoint Nordic опалювати будинок узимку?", a: "Так, це призначення серії — робота нижче -20 °C зі збереженням потужності. Для будинку понад 60 м² зазвичай потрібні два апарати або один на 24 000 BTU в основному приміщенні." },
          { q: "Скільки коштує Techpoint з монтажем у Варні?", a: "Ціна апарата плюс 190 € стандартний монтаж з ПДВ (до 14 000 BTU) або 230 € (до 24 000 BTU). Точна сума — на сторінці моделі." },
        ],
      },
    },
  },
  {
    slug: "fujitsu-general",
    manufacturer: "General",
    name: "General",
    country: "Япония",
    copy: {
      bg: {
        title: "Климатици General (Fujitsu) Варна — цени с монтаж 2026",
        description: "Японски климатици General (бивш Fujitsu General) във Варна: стенни, касетъчни, канални, таванни и мулти сплит. Цени с монтаж и гаранция.",
        h1: "Климатици General (Fujitsu General) във Варна",
        intro: "General е японската марка, позната у нас като Fujitsu General: от 1 януари 2026 г. производителят работи под името GENERAL Inc. Компанията е основана през 1936 г., а името General използва от 1946 г. В каталога ни е цялата гама — стенни модели от 7 000 BTU за спалня, касетъчни, канални и таванни системи за офиси и заведения и мулти сплит с едно външно тяло за няколко стаи.",
        series: [
          "Стенни ASHH и ASHG — от 7 000 до 30 000 BTU, хладилен агент R32.",
          "Хиперинверторна серия KGTG — 19 dB на най-ниска степен, подходяща за спалня.",
          "Касетъчни AUXG и AUHG и таванни ABHG — за офиси, магазини и ресторанти.",
          "Канални ARXG и ARHG с висок напор — до 90 000 BTU за зали и цели етажи.",
          "Мулти сплит AOHG — едно външно тяло за 2 до 5 стаи, с вътрешни тела стенни, касетъчни, канални и подови.",
        ],
        why: [
          { title: "90 години японско производство", desc: "Компанията е основана през 1936 г. Смяната на името на GENERAL през 2026 г. не променя уредите — това са същите климатици с ново име на производителя." },
          { title: "Една марка за целия обект", desc: "От стенен климатик за спалня до канална система 90 000 BTU за зала — всички типове уреди от един производител, с Wi-Fi модули за управление от телефона." },
          { title: "Тихи стенни модели", desc: "Хиперинверторната серия KGTG е с 19 dB, а KMCG — с 20 dB на вътрешното тяло в най-тихия режим." },
        ],
        faq: [
          { q: "General и Fujitsu General една и съща марка ли са?", a: "Да. От 1 януари 2026 г. Fujitsu General работи под името GENERAL Inc. и продава климатиците си под марката GENERAL. Уредите и сериите остават същите." },
          { q: "Кой климатик General да избера за спалня?", a: "За стая до 20 кв.м е достатъчен стенен модел 9 000 BTU (или 7 000 за малка стая) — например хиперинверторната серия KGTG с 19 dB. За 20–28 кв.м — 12 000 BTU. Пишете ни площта и ще предложим конкретен модел." },
          { q: "Колко струва монтажът на климатик General във Варна?", a: "Стандартният монтаж на стенен климатик е 190 € с ДДС до 14 000 BTU и 230 € до 24 000 BTU — 3 м медна тръба, материали, вакуумиране и пуск. За касетъчни, канални и таванни системи правим безплатен оглед и оферта." },
        ],
      },
      en: {
        title: "General (Fujitsu) Air Conditioners Varna — Installed Prices",
        description: "Japanese General (formerly Fujitsu General) air conditioners in Varna: wall, cassette, ducted, ceiling and multi-split. Installed prices, warranty.",
        h1: "General (Fujitsu General) air conditioners in Varna",
        intro: "General is the Japanese brand known in Bulgaria as Fujitsu General: since 1 January 2026 the manufacturer trades as GENERAL Inc. The company was founded in 1936 and has used the General name since 1946. Our catalog carries the full range — wall units from 7,000 BTU for a bedroom, cassette, ducted and ceiling systems for offices and restaurants, and multi-split with one outdoor unit for several rooms.",
        series: [
          "ASHH and ASHG wall units — 7,000 to 30,000 BTU, R32 refrigerant.",
          "KGTG hyper-inverter series — 19 dB on the lowest setting, a good bedroom choice.",
          "AUXG and AUHG cassette and ABHG ceiling units — for offices, shops and restaurants.",
          "ARXG and high-static ARHG ducted units — up to 90,000 BTU for halls and whole floors.",
          "AOHG multi-split — one outdoor unit for 2 to 5 rooms, with wall, cassette, ducted and floor indoor units.",
        ],
        why: [
          { title: "90 years of Japanese manufacturing", desc: "The company was founded in 1936. The 2026 rename to GENERAL does not change the units — same air conditioners, new company name." },
          { title: "One brand for the whole building", desc: "From a bedroom wall unit to a 90,000 BTU ducted system for a hall — every type of unit from one manufacturer, with Wi-Fi modules for phone control." },
          { title: "Quiet wall units", desc: "The KGTG hyper-inverter series runs at 19 dB and KMCG at 20 dB indoors on the quietest setting." },
        ],
        faq: [
          { q: "Are General and Fujitsu General the same brand?", a: "Yes. Since 1 January 2026 Fujitsu General trades as GENERAL Inc. and sells its air conditioners under the GENERAL brand. The units and series stay the same." },
          { q: "Which General air conditioner suits a bedroom?", a: "For a room up to 20 m² a 9,000 BTU wall unit is enough (7,000 for a small room) — for example the KGTG hyper-inverter series at 19 dB. For 20–28 m², 12,000 BTU. Tell us the room size and we will suggest a specific model." },
          { q: "How much is General installation in Varna?", a: "Standard wall-unit installation is €190 incl. VAT up to 14,000 BTU and €230 up to 24,000 BTU — 3 m copper pipe, materials, vacuum and commissioning. For cassette, ducted and ceiling systems we do a free site visit and quote." },
        ],
      },
      ru: {
        title: "Кондиционеры General (Fujitsu) Варна — цены с монтажом",
        description: "Японские кондиционеры General (бывший Fujitsu General) в Варне: настенные, кассетные, канальные, потолочные и мульти-сплит. Цены с монтажом.",
        h1: "Кондиционеры General (Fujitsu General) в Варне",
        intro: "General — японская марка, известная у нас как Fujitsu General: с 1 января 2026 г. производитель работает под названием GENERAL Inc. Компания основана в 1936 г., имя General использует с 1946 г. В каталоге вся линейка — настенные модели от 7 000 BTU для спальни, кассетные, канальные и потолочные системы для офисов и заведений, мульти-сплит с одним наружным блоком на несколько комнат.",
        series: [
          "Настенные ASHH и ASHG — от 7 000 до 30 000 BTU, хладагент R32.",
          "Гиперинверторная серия KGTG — 19 дБ на минимальной скорости, подходит для спальни.",
          "Кассетные AUXG и AUHG и потолочные ABHG — для офисов, магазинов и ресторанов.",
          "Канальные ARXG и ARHG с высоким напором — до 90 000 BTU для залов и целых этажей.",
          "Мульти-сплит AOHG — один наружный блок на 2–5 комнат с настенными, кассетными, канальными и напольными внутренними блоками.",
        ],
        why: [
          { title: "90 лет японского производства", desc: "Компания основана в 1936 г. Смена названия на GENERAL в 2026 г. не меняет технику — это те же кондиционеры с новым именем производителя." },
          { title: "Одна марка на весь объект", desc: "От настенного кондиционера для спальни до канальной системы 90 000 BTU для зала — все типы техники одного производителя, с Wi-Fi модулями для управления с телефона." },
          { title: "Тихие настенные модели", desc: "Гиперинверторная серия KGTG — 19 дБ, KMCG — 20 дБ внутреннего блока в самом тихом режиме." },
        ],
        faq: [
          { q: "General и Fujitsu General — одна и та же марка?", a: "Да. С 1 января 2026 г. Fujitsu General работает под названием GENERAL Inc. и продаёт кондиционеры под маркой GENERAL. Техника и серии остаются прежними." },
          { q: "Какой кондиционер General выбрать для спальни?", a: "Для комнаты до 20 м² хватит настенной модели на 9 000 BTU (или 7 000 для маленькой комнаты) — например, гиперинверторной серии KGTG с 19 дБ. Для 20–28 м² — 12 000 BTU. Напишите площадь — предложим конкретную модель." },
          { q: "Сколько стоит монтаж кондиционера General в Варне?", a: "Стандартный монтаж настенного кондиционера — 190 € с НДС до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, материалы, вакуумирование и запуск. Для кассетных, канальных и потолочных систем — бесплатный выезд и смета." },
        ],
      },
      ua: {
        title: "Кондиціонери General (Fujitsu) Варна — ціни з монтажем",
        description: "Японські кондиціонери General (колишній Fujitsu General) у Варні: настінні, касетні, канальні, стельові та мульти-спліт. Ціни з монтажем.",
        h1: "Кондиціонери General (Fujitsu General) у Варні",
        intro: "General — японська марка, відома в нас як Fujitsu General: з 1 січня 2026 р. виробник працює під назвою GENERAL Inc. Компанію засновано 1936 р., ім'я General вона використовує з 1946 р. У каталозі вся лінійка — настінні моделі від 7 000 BTU для спальні, касетні, канальні та стельові системи для офісів і закладів, мульти-спліт з одним зовнішнім блоком на кілька кімнат.",
        series: [
          "Настінні ASHH і ASHG — від 7 000 до 30 000 BTU, холодоагент R32.",
          "Гіперінверторна серія KGTG — 19 дБ на мінімальній швидкості, підходить для спальні.",
          "Касетні AUXG і AUHG та стельові ABHG — для офісів, магазинів і ресторанів.",
          "Канальні ARXG і ARHG з високим напором — до 90 000 BTU для залів і цілих поверхів.",
          "Мульти-спліт AOHG — один зовнішній блок на 2–5 кімнат з настінними, касетними, канальними та підлоговими внутрішніми блоками.",
        ],
        why: [
          { title: "90 років японського виробництва", desc: "Компанію засновано 1936 р. Зміна назви на GENERAL у 2026 р. не змінює техніку — це ті самі кондиціонери з новим ім'ям виробника." },
          { title: "Одна марка на весь об'єкт", desc: "Від настінного кондиціонера для спальні до канальної системи 90 000 BTU для залу — усі типи техніки одного виробника, з Wi-Fi модулями для керування з телефона." },
          { title: "Тихі настінні моделі", desc: "Гіперінверторна серія KGTG — 19 дБ, KMCG — 20 дБ внутрішнього блока в найтихішому режимі." },
        ],
        faq: [
          { q: "General і Fujitsu General — одна й та сама марка?", a: "Так. З 1 січня 2026 р. Fujitsu General працює під назвою GENERAL Inc. і продає кондиціонери під маркою GENERAL. Техніка та серії залишаються тими самими." },
          { q: "Який кондиціонер General обрати для спальні?", a: "Для кімнати до 20 м² вистачить настінної моделі на 9 000 BTU (або 7 000 для маленької кімнати) — наприклад, гіперінверторної серії KGTG з 19 дБ. Для 20–28 м² — 12 000 BTU. Напишіть площу — запропонуємо конкретну модель." },
          { q: "Скільки коштує монтаж кондиціонера General у Варні?", a: "Стандартний монтаж настінного кондиціонера — 190 € з ПДВ до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, матеріали, вакуумування та запуск. Для касетних, канальних і стельових систем — безкоштовний виїзд і кошторис." },
        ],
      },
    },
  },
  {
    slug: "kaisai",
    manufacturer: "Kaisai",
    name: "Kaisai",
    country: "Полша",
    copy: {
      bg: {
        title: "Климатици Kaisai Варна — цени с монтаж 2026",
        description: "Kaisai във Варна: инверторни климатици с R32 и Wi-Fi, мулти сплит и термопомпи на полската група Klima-Therm. Цени с монтаж и гаранция.",
        h1: "Климатици Kaisai във Варна",
        intro: "Kaisai е собствена марка на полската група Klima-Therm, на пазара от 2011 г. Климатиците са инверторни, с хладилен агент R32, а при голяма част от моделите Wi-Fi управлението е в комплекта. В каталога ни са стенни, подово-таванни, касетъчни, канални и колонни климатици, мулти сплит системи за 2 до 5 стаи и термопомпи въздух-вода. Цената е под японските марки, а част от сериите имат 5 години гаранция.",
        series: [
          "Стенни FLY, GEO, ECO, EVO и ART — от 9 000 до 24 000 BTU.",
          "ICE и PRO HEAT+ — стенни модели с клас A+++ на охлаждане и 5 години гаранция.",
          "Nordic — отопление при външна температура под -35 °C.",
          "Подово-таванни KUE, касетъчни KCD и KCA4, канални KTI и колонни KFS — до 55 000 BTU.",
          "Мулти сплит за 2 до 5 стаи и термопомпи KHC (моноблок) и KHA (сплит) за отопление и топла вода.",
        ],
        why: [
          { title: "15 години на пазара", desc: "Kaisai е марка на полската група Klima-Therm от 2011 г. и се продава в Полша и в други европейски страни." },
          { title: "Wi-Fi и R32 на достъпна цена", desc: "Уредите са инверторни, с хладилен агент R32, а при много модели Wi-Fi управлението е в комплекта, без допълнителен модул." },
          { title: "Гаранция до 5 години", desc: "При сериите ICE, ART, Nordic и PRO HEAT+ гаранцията е 60 месеца. Срокът за всеки модел е на неговата страница." },
        ],
        faq: [
          { q: "Kaisai добра марка ли е?", a: "Kaisai е марка от средния ценови клас: инверторни уреди с R32 и Wi-Fi на по-ниска цена от японските марки. Сериите ICE и PRO HEAT+ са с клас A+++ на охлаждане, а част от моделите са с 5 години гаранция." },
          { q: "Kaisai и Auratsu свързани ли са?", a: "Да — и двете са собствени марки на полската група Klima-Therm. Kaisai е по-старата марка с по-широка гама, Auratsu е създадена през 2019 г." },
          { q: "Колко струва монтажът на климатик Kaisai във Варна?", a: "Стандартният монтаж на стенен климатик е 190 € с ДДС до 14 000 BTU и 230 € до 24 000 BTU — 3 м медна тръба, материали, вакуумиране и пуск. За касетъчни, канални и подово-таванни модели правим безплатен оглед и оферта." },
        ],
      },
      en: {
        title: "Kaisai Air Conditioners Varna — Installed Prices 2026",
        description: "Kaisai in Varna: inverter air conditioners with R32 and Wi-Fi, multi-split and heat pumps from the Polish Klima-Therm group. Installed prices, warranty.",
        h1: "Kaisai air conditioners in Varna",
        intro: "Kaisai is the own brand of the Polish Klima-Therm group, on the market since 2011. The air conditioners are inverter units with R32 refrigerant, and many models ship with Wi-Fi control included. Our catalog has wall, floor/ceiling, cassette, ducted and column units, multi-split systems for 2 to 5 rooms and air-to-water heat pumps. Prices sit below the Japanese brands, and several series carry a 5-year warranty.",
        series: [
          "FLY, GEO, ECO, EVO and ART wall units — 9,000 to 24,000 BTU.",
          "ICE and PRO HEAT+ — wall units rated A+++ for cooling, with a 5-year warranty.",
          "Nordic — heating at outdoor temperatures below -35 °C.",
          "KUE floor/ceiling, KCD and KCA4 cassette, KTI ducted and KFS column units — up to 55,000 BTU.",
          "Multi-split for 2 to 5 rooms and KHC (monoblock) and KHA (split) heat pumps for heating and hot water.",
        ],
        why: [
          { title: "15 years on the market", desc: "Kaisai has been a brand of the Polish Klima-Therm group since 2011 and sells in Poland and other European countries." },
          { title: "Wi-Fi and R32 at an accessible price", desc: "The units are inverters with R32 refrigerant, and on many models Wi-Fi control is included with no extra module." },
          { title: "Up to 5 years of warranty", desc: "The ICE, ART, Nordic and PRO HEAT+ series carry a 60-month warranty. Each model's term is on its page." },
        ],
        faq: [
          { q: "Is Kaisai a good brand?", a: "Kaisai is a mid-price brand: inverter units with R32 and Wi-Fi for less than the Japanese brands. The ICE and PRO HEAT+ series are rated A+++ for cooling, and some models carry a 5-year warranty." },
          { q: "Are Kaisai and Auratsu related?", a: "Yes — both are own brands of the Polish Klima-Therm group. Kaisai is the older brand with the wider range; Auratsu was launched in 2019." },
          { q: "How much is Kaisai installation in Varna?", a: "Standard wall-unit installation is €190 incl. VAT up to 14,000 BTU and €230 up to 24,000 BTU — 3 m copper pipe, materials, vacuum and commissioning. For cassette, ducted and floor/ceiling units we do a free site visit and quote." },
        ],
      },
      ru: {
        title: "Кондиционеры Kaisai Варна — цены с монтажом 2026",
        description: "Kaisai в Варне: инверторные кондиционеры с R32 и Wi-Fi, мульти-сплит и тепловые насосы польской группы Klima-Therm. Цены с монтажом, гарантия.",
        h1: "Кондиционеры Kaisai в Варне",
        intro: "Kaisai — собственная марка польской группы Klima-Therm, на рынке с 2011 г. Кондиционеры инверторные, на хладагенте R32, у многих моделей Wi-Fi управление уже в комплекте. В каталоге настенные, напольно-потолочные, кассетные, канальные и колонные кондиционеры, мульти-сплит на 2–5 комнат и тепловые насосы воздух-вода. Цена ниже японских марок, а у части серий гарантия 5 лет.",
        series: [
          "Настенные FLY, GEO, ECO, EVO и ART — от 9 000 до 24 000 BTU.",
          "ICE и PRO HEAT+ — настенные модели с классом A+++ на охлаждение и гарантией 5 лет.",
          "Nordic — обогрев при наружной температуре ниже -35 °C.",
          "Напольно-потолочные KUE, кассетные KCD и KCA4, канальные KTI и колонные KFS — до 55 000 BTU.",
          "Мульти-сплит на 2–5 комнат и тепловые насосы KHC (моноблок) и KHA (сплит) для отопления и горячей воды.",
        ],
        why: [
          { title: "15 лет на рынке", desc: "Kaisai — марка польской группы Klima-Therm с 2011 г., продаётся в Польше и других странах Европы." },
          { title: "Wi-Fi и R32 по доступной цене", desc: "Техника инверторная, на хладагенте R32, у многих моделей Wi-Fi управление в комплекте без дополнительного модуля." },
          { title: "Гарантия до 5 лет", desc: "У серий ICE, ART, Nordic и PRO HEAT+ гарантия 60 месяцев. Срок для каждой модели — на её странице." },
        ],
        faq: [
          { q: "Kaisai — хорошая марка?", a: "Kaisai — марка среднего ценового класса: инверторная техника с R32 и Wi-Fi дешевле японских марок. Серии ICE и PRO HEAT+ имеют класс A+++ на охлаждение, у части моделей гарантия 5 лет." },
          { q: "Kaisai и Auratsu связаны?", a: "Да — обе являются собственными марками польской группы Klima-Therm. Kaisai — более старая марка с широкой линейкой, Auratsu появилась в 2019 г." },
          { q: "Сколько стоит монтаж кондиционера Kaisai в Варне?", a: "Стандартный монтаж настенного кондиционера — 190 € с НДС до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, материалы, вакуумирование и запуск. Для кассетных, канальных и напольно-потолочных моделей — бесплатный выезд и смета." },
        ],
      },
      ua: {
        title: "Кондиціонери Kaisai Варна — ціни з монтажем 2026",
        description: "Kaisai у Варні: інверторні кондиціонери з R32 і Wi-Fi, мульти-спліт і теплові насоси польської групи Klima-Therm. Ціни з монтажем, гарантія.",
        h1: "Кондиціонери Kaisai у Варні",
        intro: "Kaisai — власна марка польської групи Klima-Therm, на ринку з 2011 р. Кондиціонери інверторні, на холодоагенті R32, у багатьох моделей Wi-Fi керування вже в комплекті. У каталозі настінні, підлогово-стельові, касетні, канальні та колонні кондиціонери, мульти-спліт на 2–5 кімнат і теплові насоси повітря-вода. Ціна нижча за японські марки, а в частини серій гарантія 5 років.",
        series: [
          "Настінні FLY, GEO, ECO, EVO і ART — від 9 000 до 24 000 BTU.",
          "ICE і PRO HEAT+ — настінні моделі з класом A+++ на охолодження та гарантією 5 років.",
          "Nordic — обігрів за зовнішньої температури нижче -35 °C.",
          "Підлогово-стельові KUE, касетні KCD і KCA4, канальні KTI та колонні KFS — до 55 000 BTU.",
          "Мульти-спліт на 2–5 кімнат і теплові насоси KHC (моноблок) та KHA (спліт) для опалення й гарячої води.",
        ],
        why: [
          { title: "15 років на ринку", desc: "Kaisai — марка польської групи Klima-Therm з 2011 р., продається в Польщі та інших країнах Європи." },
          { title: "Wi-Fi і R32 за доступною ціною", desc: "Техніка інверторна, на холодоагенті R32, у багатьох моделей Wi-Fi керування в комплекті без додаткового модуля." },
          { title: "Гарантія до 5 років", desc: "У серій ICE, ART, Nordic і PRO HEAT+ гарантія 60 місяців. Термін для кожної моделі — на її сторінці." },
        ],
        faq: [
          { q: "Kaisai — хороша марка?", a: "Kaisai — марка середнього цінового класу: інверторна техніка з R32 і Wi-Fi дешевша за японські марки. Серії ICE і PRO HEAT+ мають клас A+++ на охолодження, у частини моделей гарантія 5 років." },
          { q: "Kaisai і Auratsu пов'язані?", a: "Так — обидві є власними марками польської групи Klima-Therm. Kaisai — старша марка з ширшою лінійкою, Auratsu з'явилася 2019 р." },
          { q: "Скільки коштує монтаж кондиціонера Kaisai у Варні?", a: "Стандартний монтаж настінного кондиціонера — 190 € з ПДВ до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, матеріали, вакуумування та запуск. Для касетних, канальних і підлогово-стельових моделей — безкоштовний виїзд і кошторис." },
        ],
      },
    },
  },
  {
    slug: "williams",
    manufacturer: "Williams",
    name: "Williams",
    country: "Китай",
    copy: {
      bg: {
        title: "Климатици Williams Варна — цени с монтаж 2026",
        description: "Williams във Варна: бюджетни инверторни климатици — стенни Forest, Aurora, AE Pro, Sense и Glory, подови, касетъчни и колонни. Цени с монтаж.",
        h1: "Климатици Williams във Варна",
        intro: "Williams е бюджетна марка инверторни климатици с широка гама за дома и за търговски обекти. Стенните серии покриват 9 000 до 24 000 BTU, а за по-големи помещения има подов модел Console, касетъчни, канални и колонни климатици до 55 000 BTU. Подходящ избор, когато цената е водеща, а искате нов инверторен уред с гаранция.",
        series: [
          "Forest и Aurora — основните стенни серии, 9 000–24 000 BTU.",
          "AE Pro и Sense — по-ефективните стенни модели: SEER до 9,0 и SCOP до 5,1.",
          "Glory — най-достъпната стенна серия, 19–20 dB и работа до -20 °C.",
          "Console (подов), касетъчни WCD, канални WDA и колонни WSM — до 55 000 BTU.",
        ],
        why: [
          { title: "Цена под масовите марки", desc: "Стенните модели започват под цената на повечето познати марки — за втори климатик, жилище под наем или офис." },
          { title: "Висока ефективност в AE Pro и Sense", desc: "SEER до 9,0 и SCOP до 5,1 — високи стойности за бюджетния клас, които се усещат в сметката за ток." },
          { title: "Пълна линия до 55 000 BTU", desc: "Освен стенни има подов модел Console, касетъчни, канални и колонни климатици за магазини и заведения." },
        ],
        faq: [
          { q: "Williams добра марка ли е?", a: "Williams е бюджетна марка: основните функции на инверторен климатик на по-ниска цена. Сериите AE Pro и Sense са с висока ефективност; за много тиха спалня или основно отопление сравнете и с японските марки." },
          { q: "Каква е разликата между сериите Williams?", a: "Forest и Aurora са основните стенни серии, AE Pro и Sense са по-ефективните, а Glory е най-достъпната. Точните данни за клас, шум и мощност са на страницата на всеки модел." },
          { q: "Колко струва монтажът на климатик Williams във Варна?", a: "Стандартният монтаж на стенен климатик е 190 € с ДДС до 14 000 BTU и 230 € до 24 000 BTU — 3 м медна тръба, материали, вакуумиране и пуск. За касетъчни, канални и колонни модели правим безплатен оглед и оферта." },
        ],
      },
      en: {
        title: "Williams Air Conditioners Varna — Installed Prices 2026",
        description: "Williams in Varna: budget inverter air conditioners — Forest, Aurora, AE Pro, Sense and Glory wall units, floor, cassette and column. Installed prices.",
        h1: "Williams air conditioners in Varna",
        intro: "Williams is a budget brand of inverter air conditioners with a wide range for homes and commercial premises. The wall series cover 9,000 to 24,000 BTU, and for larger rooms there is the Console floor unit, cassette, ducted and column units up to 55,000 BTU. A sensible choice when price comes first but you want a new inverter unit with a warranty.",
        series: [
          "Forest and Aurora — the core wall series, 9,000–24,000 BTU.",
          "AE Pro and Sense — the more efficient wall units: SEER up to 9.0 and SCOP up to 5.1.",
          "Glory — the most affordable wall series, 19–20 dB, runs down to -20 °C.",
          "Console (floor), WCD cassette, WDA ducted and WSM column units — up to 55,000 BTU.",
        ],
        why: [
          { title: "Priced below the mainstream brands", desc: "Wall units start below most well-known brands — for a second AC, a rental flat or an office." },
          { title: "High efficiency in AE Pro and Sense", desc: "SEER up to 9.0 and SCOP up to 5.1 — high figures for the budget class that show on the electricity bill." },
          { title: "Full range up to 55,000 BTU", desc: "Besides wall units there is the Console floor unit plus cassette, ducted and column ACs for shops and restaurants." },
        ],
        faq: [
          { q: "Is Williams a good brand?", a: "Williams is a budget brand: the core functions of an inverter AC for less. The AE Pro and Sense series are highly efficient; for a very quiet bedroom or primary heating, compare with the Japanese brands too." },
          { q: "What is the difference between the Williams series?", a: "Forest and Aurora are the core wall series, AE Pro and Sense are the more efficient ones, and Glory is the most affordable. Exact class, noise and capacity data are on each model's page." },
          { q: "How much is Williams installation in Varna?", a: "Standard wall-unit installation is €190 incl. VAT up to 14,000 BTU and €230 up to 24,000 BTU — 3 m copper pipe, materials, vacuum and commissioning. For cassette, ducted and column units we do a free site visit and quote." },
        ],
      },
      ru: {
        title: "Кондиционеры Williams Варна — цены с монтажом 2026",
        description: "Williams в Варне: бюджетные инверторные кондиционеры — настенные Forest, Aurora, AE Pro, Sense и Glory, напольные, кассетные и колонные. Цены с монтажом.",
        h1: "Кондиционеры Williams в Варне",
        intro: "Williams — бюджетная марка инверторных кондиционеров с широкой линейкой для дома и коммерческих объектов. Настенные серии покрывают 9 000–24 000 BTU, а для больших помещений есть напольная модель Console, кассетные, канальные и колонные кондиционеры до 55 000 BTU. Разумный выбор, когда цена на первом месте, но нужен новый инвертор с гарантией.",
        series: [
          "Forest и Aurora — основные настенные серии, 9 000–24 000 BTU.",
          "AE Pro и Sense — более эффективные настенные модели: SEER до 9,0 и SCOP до 5,1.",
          "Glory — самая доступная настенная серия, 19–20 дБ и работа до -20 °C.",
          "Console (напольный), кассетные WCD, канальные WDA и колонные WSM — до 55 000 BTU.",
        ],
        why: [
          { title: "Цена ниже массовых марок", desc: "Настенные модели дешевле большинства известных марок — для второго кондиционера, квартиры под аренду или офиса." },
          { title: "Высокая эффективность у AE Pro и Sense", desc: "SEER до 9,0 и SCOP до 5,1 — высокие значения для бюджетного класса, заметные в счёте за электричество." },
          { title: "Полная линейка до 55 000 BTU", desc: "Кроме настенных есть напольная модель Console, кассетные, канальные и колонные кондиционеры для магазинов и заведений." },
        ],
        faq: [
          { q: "Williams — хорошая марка?", a: "Williams — бюджетная марка: основные функции инверторного кондиционера дешевле. Серии AE Pro и Sense высокоэффективны; для очень тихой спальни или основного отопления сравните и с японскими марками." },
          { q: "Чем отличаются серии Williams?", a: "Forest и Aurora — основные настенные серии, AE Pro и Sense — более эффективные, Glory — самая доступная. Точные данные о классе, шуме и мощности — на странице каждой модели." },
          { q: "Сколько стоит монтаж кондиционера Williams в Варне?", a: "Стандартный монтаж настенного кондиционера — 190 € с НДС до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, материалы, вакуумирование и запуск. Для кассетных, канальных и колонных моделей — бесплатный выезд и смета." },
        ],
      },
      ua: {
        title: "Кондиціонери Williams Варна — ціни з монтажем 2026",
        description: "Williams у Варні: бюджетні інверторні кондиціонери — настінні Forest, Aurora, AE Pro, Sense і Glory, підлогові, касетні та колонні. Ціни з монтажем.",
        h1: "Кондиціонери Williams у Варні",
        intro: "Williams — бюджетна марка інверторних кондиціонерів із широкою лінійкою для дому та комерційних об'єктів. Настінні серії покривають 9 000–24 000 BTU, а для великих приміщень є підлогова модель Console, касетні, канальні та колонні кондиціонери до 55 000 BTU. Розумний вибір, коли ціна на першому місці, але потрібен новий інвертор із гарантією.",
        series: [
          "Forest і Aurora — основні настінні серії, 9 000–24 000 BTU.",
          "AE Pro і Sense — ефективніші настінні моделі: SEER до 9,0 і SCOP до 5,1.",
          "Glory — найдоступніша настінна серія, 19–20 дБ і робота до -20 °C.",
          "Console (підлоговий), касетні WCD, канальні WDA та колонні WSM — до 55 000 BTU.",
        ],
        why: [
          { title: "Ціна нижча за масові марки", desc: "Настінні моделі дешевші за більшість відомих марок — для другого кондиціонера, квартири під оренду чи офісу." },
          { title: "Висока ефективність AE Pro і Sense", desc: "SEER до 9,0 і SCOP до 5,1 — високі значення для бюджетного класу, помітні в рахунку за електрику." },
          { title: "Повна лінійка до 55 000 BTU", desc: "Крім настінних є підлогова модель Console, касетні, канальні та колонні кондиціонери для магазинів і закладів." },
        ],
        faq: [
          { q: "Williams — хороша марка?", a: "Williams — бюджетна марка: основні функції інверторного кондиціонера дешевше. Серії AE Pro і Sense високоефективні; для дуже тихої спальні чи основного опалення порівняйте й з японськими марками." },
          { q: "Чим відрізняються серії Williams?", a: "Forest і Aurora — основні настінні серії, AE Pro і Sense — ефективніші, Glory — найдоступніша. Точні дані про клас, шум і потужність — на сторінці кожної моделі." },
          { q: "Скільки коштує монтаж кондиціонера Williams у Варні?", a: "Стандартний монтаж настінного кондиціонера — 190 € з ПДВ до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, матеріали, вакуумування та запуск. Для касетних, канальних і колонних моделей — безкоштовний виїзд і кошторис." },
        ],
      },
    },
  },
  {
    slug: "atlantic",
    manufacturer: "Atlantic",
    name: "Atlantic",
    country: "Франция",
    copy: {
      bg: {
        title: "Термопомпи Atlantic Варна — Loria и Alfea, цени 2026",
        description: "Термопомпи въздух-вода Atlantic във Варна: Loria, Alfea Excellia и Alfea Extensa с външни тела Fujitsu General. Отопление, охлаждане и топла вода.",
        h1: "Термопомпи Atlantic във Варна",
        intro: "Atlantic е френска група, специализирана в отоплението и топлата вода. Термопомпите въздух-вода, които предлагаме, работят с външни тела Fujitsu General и покриват отопление, охлаждане и битова гореща вода — от 3 kW за по-малко жилище до 16 kW за голяма къща. Сериите DUO са с вграден бойлер 190 литра.",
        series: [
          "Loria — сплит термопомпи от 3 до 10 kW; Loria DUO с вграден бойлер 190 л.",
          "Alfea Extensa A.I. R32 — от 5 до 10 kW, с вариант DUO с бойлер.",
          "Alfea Excellia A.I. — 11 kW и HP версии 15–16 kW, монофазни и трифазни (TRI), с вариант DUO.",
          "Аксесоари — комплект за два отоплителни кръга, комплект за охлаждане и стаен термостат Navilink.",
        ],
        why: [
          { title: "Специалист по отоплението", desc: "Atlantic прави бойлери, отоплителни уреди и термопомпи — отоплението е основният бизнес на групата." },
          { title: "Външни тела Fujitsu General", desc: "Хладилната част е от японския производител Fujitsu General, а хидромодулът и управлението — от Atlantic." },
          { title: "Отопление и топла вода с една инсталация", desc: "Моделите DUO имат вграден бойлер 190 литра, така че не е нужен отделен бойлер за битова гореща вода." },
        ],
        faq: [
          { q: "Каква мощност термопомпа ми трябва?", a: "Зависи от топлинните загуби на сградата, не само от квадратурата. Ориентир: Loria (3–10 kW) е за апартаменти и по-малки къщи, Alfea Excellia (11–16 kW) — за по-големи къщи. Точната мощност изчисляваме при оглед." },
          { q: "С какво се различават Loria и Alfea Excellia?", a: "Loria е по-компактната серия до 10 kW. Alfea Excellia е за по-голяма мощност — от 11 до 16 kW, включително трифазни модели (TRI). И двете имат вариант DUO с вграден бойлер 190 л." },
          { q: "Колко струва монтажът на термопомпа Atlantic?", a: "Монтажът на термопомпа се офертира след оглед — зависи от мощността, отоплителната инсталация и мястото на външното тяло. Цените в каталога са с ДДС, без монтаж." },
        ],
      },
      en: {
        title: "Atlantic Heat Pumps Varna — Loria and Alfea, Prices 2026",
        description: "Atlantic air-to-water heat pumps in Varna: Loria, Alfea Excellia and Alfea Extensa with Fujitsu General outdoor units. Heating, cooling and hot water.",
        h1: "Atlantic heat pumps in Varna",
        intro: "Atlantic is a French group that specialises in heating and hot water. The air-to-water heat pumps we offer run with Fujitsu General outdoor units and cover heating, cooling and domestic hot water — from 3 kW for a smaller home to 16 kW for a large house. The DUO versions have a built-in 190-litre tank.",
        series: [
          "Loria — split heat pumps from 3 to 10 kW; Loria DUO with a built-in 190 l tank.",
          "Alfea Extensa A.I. R32 — 5 to 10 kW, with a DUO version with a tank.",
          "Alfea Excellia A.I. — 11 kW and HP versions at 15–16 kW, single- and three-phase (TRI), with a DUO version.",
          "Accessories — two-heating-circuit kit, cooling kit and the Navilink room thermostat.",
        ],
        why: [
          { title: "A heating specialist", desc: "Atlantic makes water heaters, heating appliances and heat pumps — heating is the group's core business." },
          { title: "Fujitsu General outdoor units", desc: "The refrigerant side comes from the Japanese manufacturer Fujitsu General; the hydraulic module and controls come from Atlantic." },
          { title: "Heating and hot water from one system", desc: "DUO models have a built-in 190-litre tank, so no separate domestic hot water cylinder is needed." },
        ],
        faq: [
          { q: "What heat pump capacity do I need?", a: "It depends on the building's heat loss, not only its floor area. As a guide: Loria (3–10 kW) suits flats and smaller houses, Alfea Excellia (11–16 kW) larger houses. We calculate the exact capacity during a site visit." },
          { q: "How do Loria and Alfea Excellia differ?", a: "Loria is the more compact series up to 10 kW. Alfea Excellia covers higher capacities — 11 to 16 kW, including three-phase (TRI) models. Both come as a DUO version with a built-in 190 l tank." },
          { q: "How much is an Atlantic heat pump installation?", a: "Heat pump installation is quoted after a site visit — it depends on capacity, the heating system and where the outdoor unit goes. Catalog prices include VAT and exclude installation." },
        ],
      },
      ru: {
        title: "Тепловые насосы Atlantic Варна — Loria и Alfea, цены 2026",
        description: "Тепловые насосы воздух-вода Atlantic в Варне: Loria, Alfea Excellia и Alfea Extensa с наружными блоками Fujitsu General. Отопление, охлаждение, горячая вода.",
        h1: "Тепловые насосы Atlantic в Варне",
        intro: "Atlantic — французская группа, специализирующаяся на отоплении и горячей воде. Тепловые насосы воздух-вода, которые мы предлагаем, работают с наружными блоками Fujitsu General и дают отопление, охлаждение и горячую воду — от 3 кВт для небольшого жилья до 16 кВт для большого дома. Версии DUO — со встроенным бойлером на 190 литров.",
        series: [
          "Loria — сплит тепловые насосы от 3 до 10 кВт; Loria DUO со встроенным бойлером 190 л.",
          "Alfea Extensa A.I. R32 — от 5 до 10 кВт, есть версия DUO с бойлером.",
          "Alfea Excellia A.I. — 11 кВт и HP версии на 15–16 кВт, однофазные и трёхфазные (TRI), есть версия DUO.",
          "Аксессуары — комплект на два контура отопления, комплект для охлаждения и комнатный термостат Navilink.",
        ],
        why: [
          { title: "Специалист по отоплению", desc: "Atlantic делает бойлеры, отопительные приборы и тепловые насосы — отопление является основным бизнесом группы." },
          { title: "Наружные блоки Fujitsu General", desc: "Холодильная часть — от японского производителя Fujitsu General, гидромодуль и управление — от Atlantic." },
          { title: "Отопление и горячая вода одной системой", desc: "У моделей DUO встроенный бойлер на 190 литров, отдельный бойлер для горячей воды не нужен." },
        ],
        faq: [
          { q: "Какая мощность теплового насоса мне нужна?", a: "Зависит от теплопотерь здания, а не только от площади. Ориентир: Loria (3–10 кВт) — для квартир и небольших домов, Alfea Excellia (11–16 кВт) — для больших домов. Точную мощность считаем при выезде на объект." },
          { q: "Чем отличаются Loria и Alfea Excellia?", a: "Loria — более компактная серия до 10 кВт. Alfea Excellia — для большей мощности, от 11 до 16 кВт, включая трёхфазные модели (TRI). У обеих есть версия DUO со встроенным бойлером 190 л." },
          { q: "Сколько стоит монтаж теплового насоса Atlantic?", a: "Монтаж теплового насоса считаем после выезда на объект — он зависит от мощности, системы отопления и места наружного блока. Цены в каталоге с НДС, без монтажа." },
        ],
      },
      ua: {
        title: "Теплові насоси Atlantic Варна — Loria і Alfea, ціни 2026",
        description: "Теплові насоси повітря-вода Atlantic у Варні: Loria, Alfea Excellia і Alfea Extensa із зовнішніми блоками Fujitsu General. Опалення, охолодження, гаряча вода.",
        h1: "Теплові насоси Atlantic у Варні",
        intro: "Atlantic — французька група, що спеціалізується на опаленні та гарячій воді. Теплові насоси повітря-вода, які ми пропонуємо, працюють із зовнішніми блоками Fujitsu General і дають опалення, охолодження та гарячу воду — від 3 кВт для невеликого житла до 16 кВт для великого будинку. Версії DUO — з вбудованим бойлером на 190 літрів.",
        series: [
          "Loria — спліт теплові насоси від 3 до 10 кВт; Loria DUO з вбудованим бойлером 190 л.",
          "Alfea Extensa A.I. R32 — від 5 до 10 кВт, є версія DUO з бойлером.",
          "Alfea Excellia A.I. — 11 кВт і HP версії на 15–16 кВт, однофазні та трифазні (TRI), є версія DUO.",
          "Аксесуари — комплект на два контури опалення, комплект для охолодження та кімнатний термостат Navilink.",
        ],
        why: [
          { title: "Спеціаліст з опалення", desc: "Atlantic виробляє бойлери, опалювальні прилади та теплові насоси — опалення є основним бізнесом групи." },
          { title: "Зовнішні блоки Fujitsu General", desc: "Холодильна частина — від японського виробника Fujitsu General, гідромодуль і керування — від Atlantic." },
          { title: "Опалення й гаряча вода однією системою", desc: "Моделі DUO мають вбудований бойлер на 190 літрів, окремий бойлер для гарячої води не потрібен." },
        ],
        faq: [
          { q: "Яка потужність теплового насоса мені потрібна?", a: "Залежить від тепловтрат будівлі, а не лише від площі. Орієнтир: Loria (3–10 кВт) — для квартир і невеликих будинків, Alfea Excellia (11–16 кВт) — для великих будинків. Точну потужність рахуємо під час виїзду на об'єкт." },
          { q: "Чим відрізняються Loria і Alfea Excellia?", a: "Loria — компактніша серія до 10 кВт. Alfea Excellia — для більшої потужності, від 11 до 16 кВт, зокрема трифазні моделі (TRI). Обидві мають версію DUO з вбудованим бойлером 190 л." },
          { q: "Скільки коштує монтаж теплового насоса Atlantic?", a: "Монтаж теплового насоса рахуємо після виїзду на об'єкт — він залежить від потужності, системи опалення та місця зовнішнього блока. Ціни в каталозі з ПДВ, без монтажу." },
        ],
      },
    },
  },
  {
    slug: "samsung",
    manufacturer: "Samsung",
    name: "Samsung",
    country: "Южна Корея",
    copy: {
      bg: {
        title: "Термопомпи и климатици Samsung Варна — цени 2026",
        description: "Samsung във Варна: термопомпи EHS Mono и сплит с хидромодул, включително R290 и HT Quiet с вода до 70 °C, и канални климатици. Цени с ДДС.",
        h1: "Термопомпи и климатици Samsung във Варна",
        intro: "Samsung е южнокорейски производител с отделна линия за отопление — EHS. В каталога ни са термопомпи въздух-вода моноблок и сплит с хидромодул: моделите EHS Mono с хладилен агент R290 и високотемпературните HT Quiet с вода до 70 °C, които работят и с радиатори. За търговски обекти има мощни канални климатици.",
        series: [
          "EHS Mono R290 — моноблок 8, 12 и 16 kW с естествен хладилен агент R290.",
          "EHS Mono HT Quiet — високотемпературни моноблок 8–14 kW, вода до 70 °C.",
          "EHS сплит — външно тяло и хидромодул, от 8 до 16 kW.",
          "Канални климатици 14–25 kW за търговски обекти и Wi-Fi модул MIM-H04EN.",
        ],
        why: [
          { title: "Вода до 70 °C за радиатори", desc: "HT Quiet поддържа висока температура на водата, затова е подходяща и за къщи с радиатори, където нискотемпературна термопомпа не стига." },
          { title: "R290 — естествен хладилен агент", desc: "Новите EHS Mono работят с пропан R290, който има много нисък ефект върху климата." },
          { title: "Моноблок или сплит", desc: "Моноблокът е с цялата хладилна част навън и по-лесен монтаж; сплит системата е с хидромодул вътре в къщата." },
        ],
        faq: [
          { q: "Моноблок или сплит термопомпа Samsung да избера?", a: "Моноблокът EHS Mono е с цялата хладилна част навън — към къщата идват само тръби с вода и монтажът е по-прост. Сплит системата е с хидромодул вътре и е подходяща, когато външното тяло трябва да е по-малко или по-далеч от къщата." },
          { q: "Подходяща ли е термопомпа Samsung за къща с радиатори?", a: "Да — моделите HT Quiet подават вода до 70 °C и работят с радиатори. С подово отопление и по-ниска температура на водата ефективността е още по-висока." },
          { q: "Колко струва монтажът на термопомпа Samsung?", a: "Монтажът се офертира след оглед — зависи от мощността, отоплителната инсталация и мястото на външното тяло. Цените в каталога са с ДДС, без монтаж." },
        ],
      },
      en: {
        title: "Samsung Heat Pumps and Air Conditioners Varna — Prices",
        description: "Samsung in Varna: EHS Mono and split heat pumps with a hydro unit, including R290 and HT Quiet with water up to 70 °C, plus ducted ACs. Prices incl. VAT.",
        h1: "Samsung heat pumps and air conditioners in Varna",
        intro: "Samsung is a South Korean manufacturer with a dedicated heating line — EHS. Our catalog has air-to-water monoblock and split heat pumps with a hydro unit: EHS Mono models with R290 refrigerant and the high-temperature HT Quiet with water up to 70 °C, which also works with radiators. For commercial premises there are high-capacity ducted air conditioners.",
        series: [
          "EHS Mono R290 — 8, 12 and 16 kW monoblocks with natural R290 refrigerant.",
          "EHS Mono HT Quiet — high-temperature monoblocks at 8–14 kW, water up to 70 °C.",
          "EHS split — outdoor unit plus hydro unit, 8 to 16 kW.",
          "14–25 kW ducted air conditioners for commercial premises and the MIM-H04EN Wi-Fi module.",
        ],
        why: [
          { title: "Water up to 70 °C for radiators", desc: "HT Quiet keeps the water hot enough for houses with radiators, where a low-temperature heat pump falls short." },
          { title: "R290 — a natural refrigerant", desc: "The new EHS Mono units run on propane (R290), which has a very low climate impact." },
          { title: "Monoblock or split", desc: "The monoblock keeps the whole refrigerant circuit outside and is simpler to install; the split system has a hydro unit inside the house." },
        ],
        faq: [
          { q: "Should I choose a Samsung monoblock or split heat pump?", a: "The EHS Mono monoblock keeps the entire refrigerant circuit outside — only water pipes enter the house and installation is simpler. The split system has a hydro unit indoors and suits cases where the outdoor unit must be smaller or farther from the house." },
          { q: "Does a Samsung heat pump work with radiators?", a: "Yes — HT Quiet models supply water up to 70 °C and work with radiators. With underfloor heating and lower water temperatures, efficiency is even higher." },
          { q: "How much is a Samsung heat pump installation?", a: "Installation is quoted after a site visit — it depends on capacity, the heating system and where the outdoor unit goes. Catalog prices include VAT and exclude installation." },
        ],
      },
      ru: {
        title: "Тепловые насосы и кондиционеры Samsung Варна — цены",
        description: "Samsung в Варне: тепловые насосы EHS Mono и сплит с гидромодулем, включая R290 и HT Quiet с водой до 70 °C, и канальные кондиционеры. Цены с НДС.",
        h1: "Тепловые насосы и кондиционеры Samsung в Варне",
        intro: "Samsung — южнокорейский производитель с отдельной линейкой для отопления — EHS. В каталоге тепловые насосы воздух-вода моноблок и сплит с гидромодулем: модели EHS Mono на хладагенте R290 и высокотемпературные HT Quiet с водой до 70 °C, которые работают и с радиаторами. Для коммерческих объектов есть мощные канальные кондиционеры.",
        series: [
          "EHS Mono R290 — моноблоки на 8, 12 и 16 кВт с природным хладагентом R290.",
          "EHS Mono HT Quiet — высокотемпературные моноблоки 8–14 кВт, вода до 70 °C.",
          "EHS сплит — наружный блок и гидромодуль, от 8 до 16 кВт.",
          "Канальные кондиционеры 14–25 кВт для коммерческих объектов и Wi-Fi модуль MIM-H04EN.",
        ],
        why: [
          { title: "Вода до 70 °C для радиаторов", desc: "HT Quiet держит высокую температуру воды, поэтому подходит для домов с радиаторами, где низкотемпературного насоса не хватает." },
          { title: "R290 — природный хладагент", desc: "Новые EHS Mono работают на пропане R290 с очень низким влиянием на климат." },
          { title: "Моноблок или сплит", desc: "У моноблока вся холодильная часть снаружи и монтаж проще; у сплит-системы гидромодуль стоит внутри дома." },
        ],
        faq: [
          { q: "Моноблок или сплит тепловой насос Samsung выбрать?", a: "У моноблока EHS Mono вся холодильная часть снаружи — в дом заходят только трубы с водой, монтаж проще. Сплит-система с гидромодулем внутри подходит, когда наружный блок должен быть меньше или дальше от дома." },
          { q: "Подходит ли тепловой насос Samsung для дома с радиаторами?", a: "Да — модели HT Quiet подают воду до 70 °C и работают с радиаторами. С тёплым полом и более низкой температурой воды эффективность ещё выше." },
          { q: "Сколько стоит монтаж теплового насоса Samsung?", a: "Монтаж считаем после выезда на объект — он зависит от мощности, системы отопления и места наружного блока. Цены в каталоге с НДС, без монтажа." },
        ],
      },
      ua: {
        title: "Теплові насоси та кондиціонери Samsung Варна — ціни",
        description: "Samsung у Варні: теплові насоси EHS Mono і спліт з гідромодулем, зокрема R290 і HT Quiet з водою до 70 °C, та канальні кондиціонери. Ціни з ПДВ.",
        h1: "Теплові насоси та кондиціонери Samsung у Варні",
        intro: "Samsung — південнокорейський виробник з окремою лінійкою для опалення — EHS. У каталозі теплові насоси повітря-вода моноблок і спліт з гідромодулем: моделі EHS Mono на холодоагенті R290 і високотемпературні HT Quiet з водою до 70 °C, які працюють і з радіаторами. Для комерційних об'єктів є потужні канальні кондиціонери.",
        series: [
          "EHS Mono R290 — моноблоки на 8, 12 і 16 кВт з природним холодоагентом R290.",
          "EHS Mono HT Quiet — високотемпературні моноблоки 8–14 кВт, вода до 70 °C.",
          "EHS спліт — зовнішній блок і гідромодуль, від 8 до 16 кВт.",
          "Канальні кондиціонери 14–25 кВт для комерційних об'єктів і Wi-Fi модуль MIM-H04EN.",
        ],
        why: [
          { title: "Вода до 70 °C для радіаторів", desc: "HT Quiet тримає високу температуру води, тож підходить для будинків з радіаторами, де низькотемпературного насоса не вистачає." },
          { title: "R290 — природний холодоагент", desc: "Нові EHS Mono працюють на пропані R290 з дуже низьким впливом на клімат." },
          { title: "Моноблок чи спліт", desc: "У моноблока вся холодильна частина зовні й монтаж простіший; у спліт-системи гідромодуль стоїть усередині будинку." },
        ],
        faq: [
          { q: "Моноблок чи спліт тепловий насос Samsung обрати?", a: "У моноблока EHS Mono вся холодильна частина зовні — до будинку заходять лише труби з водою, монтаж простіший. Спліт-система з гідромодулем усередині підходить, коли зовнішній блок має бути меншим або далі від будинку." },
          { q: "Чи підходить тепловий насос Samsung для будинку з радіаторами?", a: "Так — моделі HT Quiet подають воду до 70 °C і працюють з радіаторами. З теплою підлогою й нижчою температурою води ефективність ще вища." },
          { q: "Скільки коштує монтаж теплового насоса Samsung?", a: "Монтаж рахуємо після виїзду на об'єкт — він залежить від потужності, системи опалення та місця зовнішнього блока. Ціни в каталозі з ПДВ, без монтажу." },
        ],
      },
    },
  },
  {
    slug: "auratsu",
    manufacturer: "Auratsu",
    name: "Auratsu",
    country: "Полша",
    copy: {
      bg: {
        title: "Климатици Auratsu Варна — Osaka и Tokyo, цени 2026",
        description: "Auratsu във Варна: инверторни климатици Osaka с вграден Wi-Fi и Tokyo, мулти сплит за 2–3 стаи и термопомпа 8 kW. Цени с монтаж и гаранция.",
        h1: "Климатици Auratsu във Варна",
        intro: "Auratsu е марка на полската група Klima-Therm, създадена през 2019 г. за европейския пазар. Гамата е кратка и достъпна: стенни климатици Osaka и Tokyo от 9 000 до 24 000 BTU, мулти сплит с едно външно тяло за две или три стаи и термопомпа въздух-вода 8 kW.",
        series: [
          "Osaka — серия от 2025 г. с вграден Wi-Fi модул, 9 000–24 000 BTU.",
          "Tokyo — стенни модели 9 000–24 000 BTU.",
          "Мулти сплит GKO2 — външно тяло за 2 или 3 стаи, с вътрешни тела Osaka.",
          "Термопомпа въздух-вода 8 kW — отопление, охлаждане и топла вода.",
        ],
        why: [
          { title: "Вграден Wi-Fi в Osaka", desc: "Серията Osaka се управлява от телефона без допълнителен модул." },
          { title: "Достъпна цена", desc: "Стенните модели са сред най-евтините инверторни климатици в каталога ни — за втори климатик или жилище под наем." },
          { title: "Мулти сплит от същата серия", desc: "Външното тяло GKO2 се комбинира с вътрешни тела Osaka — климатик в две или три стаи с едно тяло на фасадата." },
        ],
        faq: [
          { q: "Auratsu добра марка ли е?", a: "Auratsu е сравнително нова марка (2019 г.) на полската група Klima-Therm, която прави и Kaisai. Подходяща е, когато цената е водеща; за основно отопление или много тиха спалня сравнете и с японските марки." },
          { q: "Каква е разликата между Osaka и Tokyo?", a: "Osaka е по-новата серия (2025 г.) с вграден Wi-Fi. Tokyo е другата стенна серия в същия диапазон 9 000–24 000 BTU. Данните и цената на всеки модел са на неговата страница." },
          { q: "Колко струва монтажът на климатик Auratsu във Варна?", a: "Стандартният монтаж е 190 € с ДДС до 14 000 BTU и 230 € до 24 000 BTU — 3 м медна тръба, материали, вакуумиране и пуск. За мулти сплит в няколко стаи правим безплатен оглед и оферта." },
        ],
      },
      en: {
        title: "Auratsu Air Conditioners Varna — Osaka and Tokyo, Prices",
        description: "Auratsu in Varna: Osaka inverter air conditioners with built-in Wi-Fi and Tokyo, multi-split for 2–3 rooms and an 8 kW heat pump. Installed prices.",
        h1: "Auratsu air conditioners in Varna",
        intro: "Auratsu is a brand of the Polish Klima-Therm group, launched in 2019 for the European market. The range is short and affordable: Osaka and Tokyo wall units from 9,000 to 24,000 BTU, multi-split with one outdoor unit for two or three rooms, and an 8 kW air-to-water heat pump.",
        series: [
          "Osaka — the 2025 series with a built-in Wi-Fi module, 9,000–24,000 BTU.",
          "Tokyo — wall units at 9,000–24,000 BTU.",
          "GKO2 multi-split — an outdoor unit for 2 or 3 rooms, with Osaka indoor units.",
          "8 kW air-to-water heat pump — heating, cooling and hot water.",
        ],
        why: [
          { title: "Built-in Wi-Fi on Osaka", desc: "The Osaka series is controlled from your phone with no extra module." },
          { title: "Affordable price", desc: "The wall units are among the cheapest inverter ACs in our catalog — for a second AC or a rental flat." },
          { title: "Multi-split from the same series", desc: "The GKO2 outdoor unit pairs with Osaka indoor units — air conditioning in two or three rooms with a single unit on the façade." },
        ],
        faq: [
          { q: "Is Auratsu a good brand?", a: "Auratsu is a fairly new brand (2019) of the Polish Klima-Therm group, which also makes Kaisai. It suits cases where price comes first; for primary heating or a very quiet bedroom, compare with the Japanese brands too." },
          { q: "What is the difference between Osaka and Tokyo?", a: "Osaka is the newer series (2025) with built-in Wi-Fi. Tokyo is the other wall series in the same 9,000–24,000 BTU range. Each model's data and price are on its page." },
          { q: "How much is Auratsu installation in Varna?", a: "Standard installation is €190 incl. VAT up to 14,000 BTU and €230 up to 24,000 BTU — 3 m copper pipe, materials, vacuum and commissioning. For multi-split across several rooms we do a free site visit and quote." },
        ],
      },
      ru: {
        title: "Кондиционеры Auratsu Варна — Osaka и Tokyo, цены 2026",
        description: "Auratsu в Варне: инверторные кондиционеры Osaka со встроенным Wi-Fi и Tokyo, мульти-сплит на 2–3 комнаты и тепловой насос 8 кВт. Цены с монтажом.",
        h1: "Кондиционеры Auratsu в Варне",
        intro: "Auratsu — марка польской группы Klima-Therm, созданная в 2019 г. для европейского рынка. Линейка короткая и доступная: настенные кондиционеры Osaka и Tokyo от 9 000 до 24 000 BTU, мульти-сплит с одним наружным блоком на две или три комнаты и тепловой насос воздух-вода на 8 кВт.",
        series: [
          "Osaka — серия 2025 года со встроенным Wi-Fi модулем, 9 000–24 000 BTU.",
          "Tokyo — настенные модели 9 000–24 000 BTU.",
          "Мульти-сплит GKO2 — наружный блок на 2 или 3 комнаты с внутренними блоками Osaka.",
          "Тепловой насос воздух-вода 8 кВт — отопление, охлаждение и горячая вода.",
        ],
        why: [
          { title: "Встроенный Wi-Fi в Osaka", desc: "Серией Osaka можно управлять с телефона без дополнительного модуля." },
          { title: "Доступная цена", desc: "Настенные модели — среди самых недорогих инверторных кондиционеров в нашем каталоге: для второго кондиционера или квартиры под аренду." },
          { title: "Мульти-сплит из той же серии", desc: "Наружный блок GKO2 работает с внутренними блоками Osaka — кондиционер в двух или трёх комнатах с одним блоком на фасаде." },
        ],
        faq: [
          { q: "Auratsu — хорошая марка?", a: "Auratsu — относительно новая марка (2019 г.) польской группы Klima-Therm, которая делает и Kaisai. Подходит, когда цена на первом месте; для основного отопления или очень тихой спальни сравните и с японскими марками." },
          { q: "Чем отличаются Osaka и Tokyo?", a: "Osaka — более новая серия (2025 г.) со встроенным Wi-Fi. Tokyo — другая настенная серия в том же диапазоне 9 000–24 000 BTU. Данные и цена каждой модели — на её странице." },
          { q: "Сколько стоит монтаж кондиционера Auratsu в Варне?", a: "Стандартный монтаж — 190 € с НДС до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, материалы, вакуумирование и запуск. Для мульти-сплита на несколько комнат — бесплатный выезд и смета." },
        ],
      },
      ua: {
        title: "Кондиціонери Auratsu Варна — Osaka і Tokyo, ціни 2026",
        description: "Auratsu у Варні: інверторні кондиціонери Osaka з вбудованим Wi-Fi і Tokyo, мульти-спліт на 2–3 кімнати та тепловий насос 8 кВт. Ціни з монтажем.",
        h1: "Кондиціонери Auratsu у Варні",
        intro: "Auratsu — марка польської групи Klima-Therm, створена 2019 р. для європейського ринку. Лінійка коротка й доступна: настінні кондиціонери Osaka і Tokyo від 9 000 до 24 000 BTU, мульти-спліт з одним зовнішнім блоком на дві чи три кімнати та тепловий насос повітря-вода на 8 кВт.",
        series: [
          "Osaka — серія 2025 року з вбудованим Wi-Fi модулем, 9 000–24 000 BTU.",
          "Tokyo — настінні моделі 9 000–24 000 BTU.",
          "Мульти-спліт GKO2 — зовнішній блок на 2 або 3 кімнати з внутрішніми блоками Osaka.",
          "Тепловий насос повітря-вода 8 кВт — опалення, охолодження та гаряча вода.",
        ],
        why: [
          { title: "Вбудований Wi-Fi в Osaka", desc: "Серією Osaka можна керувати з телефона без додаткового модуля." },
          { title: "Доступна ціна", desc: "Настінні моделі — серед найдешевших інверторних кондиціонерів у нашому каталозі: для другого кондиціонера чи квартири під оренду." },
          { title: "Мульти-спліт із тієї ж серії", desc: "Зовнішній блок GKO2 працює з внутрішніми блоками Osaka — кондиціонер у двох чи трьох кімнатах з одним блоком на фасаді." },
        ],
        faq: [
          { q: "Auratsu — хороша марка?", a: "Auratsu — відносно нова марка (2019 р.) польської групи Klima-Therm, яка робить і Kaisai. Підходить, коли ціна на першому місці; для основного опалення чи дуже тихої спальні порівняйте й з японськими марками." },
          { q: "Чим відрізняються Osaka і Tokyo?", a: "Osaka — новіша серія (2025 р.) з вбудованим Wi-Fi. Tokyo — інша настінна серія в тому ж діапазоні 9 000–24 000 BTU. Дані й ціна кожної моделі — на її сторінці." },
          { q: "Скільки коштує монтаж кондиціонера Auratsu у Варні?", a: "Стандартний монтаж — 190 € з ПДВ до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, матеріали, вакуумування та запуск. Для мульти-спліта на кілька кімнат — безкоштовний виїзд і кошторис." },
        ],
      },
    },
  },
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

/** URL slug for a manufacturer without hand-written copy ("Olimpia Splendid" → "olimpia-splendid"). */
export function brandSlug(manufacturer: string): string {
  return manufacturer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** /marki/<slug> for any manufacturer: the hand-written brand's slug, else the generated page's. */
export function brandPagePath(manufacturer: string): string {
  const m = manufacturer.toLowerCase();
  const brand = BRANDS.find((b) => b.manufacturer.toLowerCase() === m);
  return `/marki/${brand ? brand.slug : brandSlug(manufacturer)}`;
}

// ---------------------------------------------------------------------------
// Generated copy — every manufacturer without a BRANDS entry gets a page built
// from its live catalog numbers, so a new supplier brand is never a dead end.
// ---------------------------------------------------------------------------

export type ProductKind = "ac" | "heatpump" | "accessory";

/** Category id (Bittel categories, shared by all suppliers) → kind of product. */
export function productKind(categoryId: number | null | undefined): ProductKind {
  if (categoryId === 11 || categoryId === 12) return "heatpump";
  if (categoryId === 8) return "accessory";
  return "ac";
}

export interface BrandStats {
  count: number;
  minPrice: number;
  maxPrice: number;
  kinds: Record<ProductKind, number>;
  /** Categories with their product count and lowest price, labels in the page locale. */
  categories: { name: string; count: number; minPrice: number }[];
}

/** Kinds that make up at least a fifth of the brand's products, AC first. */
function mainKinds(stats: BrandStats): ProductKind[] {
  const kinds = (["ac", "heatpump", "accessory"] as const).filter((k) => stats.kinds[k] >= stats.count * 0.2);
  return kinds.length ? kinds.slice(0, 2) : ["ac"];
}

/** Russian/Ukrainian plural: 1 модель, 3 модели, 5 моделей, 21 модель. */
export const slavicPlural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

const GENERATED: Record<
  BrandLocale,
  {
    kind: Record<ProductKind, string>;
    /** Heading form when the brand only has accessories. */
    accessoriesOnly: string;
    and: string;
    models: (n: number) => string;
    title: (noun: string, name: string, year: number) => string;
    h1: (noun: string, name: string) => string;
    description: (name: string, s: BrandStats, cats: string) => string;
    intro: (name: string, s: BrandStats, cats: string) => string;
    series: (c: BrandStats["categories"][number], models: string) => string;
    why: { title: string; desc: string }[];
    faqPrice: (noun: string, name: string, s: BrandStats, models: string) => { q: string; a: string };
    faqInstall: Record<ProductKind, (name: string) => { q: string; a: string }>;
    faqChoose: (name: string) => { q: string; a: string };
  }
> = {
  bg: {
    kind: { ac: "Климатици", heatpump: "Термопомпи", accessory: "Аксесоари" },
    accessoriesOnly: "Аксесоари за климатици",
    and: "и",
    models: (n) => (n === 1 ? "модел" : "модела"),
    title: (noun, name, year) => `${noun} ${name} Варна — цени ${year}`,
    h1: (noun, name) => `${noun} ${name} във Варна`,
    description: (name, s, cats) => `${name} във Варна: ${s.count} ${s.count === 1 ? "модел" : "модела"} от ${s.minPrice} € с ДДС — ${cats}. Доставка и монтаж от нашия екип.`,
    intro: (name, s, cats) => `В каталога ни има ${s.count} ${s.count === 1 ? "продукт" : "продукта"} ${name}: ${cats}. Цените са с ДДС и се обновяват автоматично по данни от вносителя, а характеристиките на всеки модел са на неговата страница.`,
    series: (c, models) => `${c.name} — ${c.count} ${models}, от ${c.minPrice} €.`,
    why: [
      { title: "Цени с ДДС", desc: "Цената на сайта е крайната цена на уреда с ДДС. Монтажът и доставката се уговарят предварително, без изненади на място." },
      { title: "Консултация преди покупка", desc: "Кажете ни помещението или обекта — ще предложим подходящ модел и точна обща цена." },
      { title: "Собствен монтажен екип", desc: "Монтира нашият екип във Варна и областта, не подизпълнители." },
    ],
    faqPrice: (noun, name, s, models) => ({
      q: `Колко струват ${noun.toLowerCase()} ${name}?`,
      a: `От ${s.minPrice} € до ${s.maxPrice} € с ДДС — ${s.count} ${models} в каталога. Точната цена и наличността са на страницата на всеки модел.`,
    }),
    faqInstall: {
      ac: (name) => ({ q: `Колко струва монтажът на климатик ${name}?`, a: "Стандартният монтаж на стенен климатик е 190 € с ДДС до 14 000 BTU и 230 € до 24 000 BTU — 3 м медна тръба, материали, вакуумиране и пуск. За касетъчни, канални и мулти сплит системи правим безплатен оглед и оферта." }),
      heatpump: (name) => ({ q: `Колко струва монтажът на термопомпа ${name}?`, a: "Монтажът на термопомпа се офертира след оглед — зависи от мощността, отоплителната инсталация и мястото на външното тяло. Цените в каталога са с ДДС, без монтаж." }),
      accessory: (name) => ({ q: `Монтирате ли аксесоарите ${name}?`, a: "Да — поставяме ги при монтаж или профилактика на климатика. Кажете ни модела на уреда и ще проверим съвместимостта." }),
    },
    faqChoose: (name) => ({ q: `Как да избера модел ${name}?`, a: "Кажете ни площта и предназначението на помещението или обекта — ще предложим 2–3 модела с точна цена с монтаж." }),
  },
  en: {
    kind: { ac: "Air conditioners", heatpump: "Heat pumps", accessory: "Accessories" },
    accessoriesOnly: "AC accessories",
    and: "and",
    models: (n) => (n === 1 ? "model" : "models"),
    title: (noun, name, year) => `${name} ${noun.toLowerCase()} Varna — prices ${year}`,
    h1: (noun, name) => `${name} ${noun.toLowerCase()} in Varna`,
    description: (name, s, cats) => `${name} in Varna: ${s.count} ${s.count === 1 ? "model" : "models"} from €${s.minPrice} incl. VAT — ${cats}. Delivery and installation by our own crew.`,
    intro: (name, s, cats) => `Our catalog has ${s.count} ${name} ${s.count === 1 ? "product" : "products"}: ${cats}. Prices include VAT and update automatically from the importer's data; each model's specs are on its page.`,
    series: (c, models) => `${c.name} — ${c.count} ${models}, from €${c.minPrice}.`,
    why: [
      { title: "Prices incl. VAT", desc: "The price on the site is the final unit price with VAT. Installation and delivery are agreed up front, with no surprises on site." },
      { title: "Advice before you buy", desc: "Tell us about the room or premises — we will suggest a suitable model and an exact total price." },
      { title: "Our own installation crew", desc: "Our crew installs across Varna and the region, not subcontractors." },
    ],
    faqPrice: (noun, name, s, models) => ({
      q: `How much do ${name} ${noun.toLowerCase()} cost?`,
      a: `From €${s.minPrice} to €${s.maxPrice} incl. VAT — ${s.count} ${models} in the catalog. The exact price and stock are on each model's page.`,
    }),
    faqInstall: {
      ac: (name) => ({ q: `How much is ${name} air conditioner installation?`, a: "Standard wall-unit installation is €190 incl. VAT up to 14,000 BTU and €230 up to 24,000 BTU — 3 m copper pipe, materials, vacuum and commissioning. For cassette, ducted and multi-split systems we do a free site visit and quote." }),
      heatpump: (name) => ({ q: `How much is ${name} heat pump installation?`, a: "Heat pump installation is quoted after a site visit — it depends on capacity, the heating system and where the outdoor unit goes. Catalog prices include VAT and exclude installation." }),
      accessory: (name) => ({ q: `Do you fit ${name} accessories?`, a: "Yes — we fit them during an AC installation or maintenance visit. Tell us your unit's model and we will check compatibility." }),
    },
    faqChoose: (name) => ({ q: `How do I choose a ${name} model?`, a: "Tell us the size and use of the room or premises — we will suggest 2–3 models with an exact installed price." }),
  },
  ru: {
    kind: { ac: "Кондиционеры", heatpump: "Тепловые насосы", accessory: "Аксессуары" },
    accessoriesOnly: "Аксессуары для кондиционеров",
    and: "и",
    models: (n) => slavicPlural(n, "модель", "модели", "моделей"),
    title: (noun, name, year) => `${noun} ${name} Варна — цены ${year}`,
    h1: (noun, name) => `${noun} ${name} в Варне`,
    description: (name, s, cats) => `${name} в Варне: ${s.count} ${slavicPlural(s.count, "модель", "модели", "моделей")} от ${s.minPrice} € с НДС — ${cats}. Доставка и монтаж нашей бригадой.`,
    intro: (name, s, cats) => `В каталоге ${s.count} ${slavicPlural(s.count, "товар", "товара", "товаров")} ${name}: ${cats}. Цены с НДС и обновляются автоматически по данным импортёра, характеристики каждой модели — на её странице.`,
    series: (c, models) => `${c.name} — ${c.count} ${models}, от ${c.minPrice} €.`,
    why: [
      { title: "Цены с НДС", desc: "Цена на сайте — окончательная цена техники с НДС. Монтаж и доставку согласуем заранее, без сюрпризов на месте." },
      { title: "Консультация до покупки", desc: "Опишите помещение или объект — предложим подходящую модель и точную итоговую цену." },
      { title: "Своя монтажная бригада", desc: "Монтирует наша бригада в Варне и области, а не субподрядчики." },
    ],
    faqPrice: (noun, name, s, models) => ({
      q: `Сколько стоят ${noun.toLowerCase()} ${name}?`,
      a: `От ${s.minPrice} € до ${s.maxPrice} € с НДС — ${s.count} ${models} в каталоге. Точная цена и наличие — на странице каждой модели.`,
    }),
    faqInstall: {
      ac: (name) => ({ q: `Сколько стоит монтаж кондиционера ${name}?`, a: "Стандартный монтаж настенного кондиционера — 190 € с НДС до 14 000 BTU и 230 € до 24 000 BTU: 3 м медной трубы, материалы, вакуумирование и запуск. Для кассетных, канальных и мульти-сплит систем — бесплатный выезд и смета." }),
      heatpump: (name) => ({ q: `Сколько стоит монтаж теплового насоса ${name}?`, a: "Монтаж теплового насоса считаем после выезда на объект — он зависит от мощности, системы отопления и места наружного блока. Цены в каталоге с НДС, без монтажа." }),
      accessory: (name) => ({ q: `Устанавливаете ли вы аксессуары ${name}?`, a: "Да — ставим их при монтаже или профилактике кондиционера. Назовите модель вашего аппарата — проверим совместимость." }),
    },
    faqChoose: (name) => ({ q: `Как выбрать модель ${name}?`, a: "Назовите площадь и назначение помещения или объекта — предложим 2–3 модели с точной ценой с монтажом." }),
  },
  ua: {
    kind: { ac: "Кондиціонери", heatpump: "Теплові насоси", accessory: "Аксесуари" },
    accessoriesOnly: "Аксесуари для кондиціонерів",
    and: "та",
    models: (n) => slavicPlural(n, "модель", "моделі", "моделей"),
    title: (noun, name, year) => `${noun} ${name} Варна — ціни ${year}`,
    h1: (noun, name) => `${noun} ${name} у Варні`,
    description: (name, s, cats) => `${name} у Варні: ${s.count} ${slavicPlural(s.count, "модель", "моделі", "моделей")} від ${s.minPrice} € з ПДВ — ${cats}. Доставка та монтаж нашою бригадою.`,
    intro: (name, s, cats) => `У каталозі ${s.count} ${slavicPlural(s.count, "товар", "товари", "товарів")} ${name}: ${cats}. Ціни з ПДВ і оновлюються автоматично за даними імпортера, характеристики кожної моделі — на її сторінці.`,
    series: (c, models) => `${c.name} — ${c.count} ${models}, від ${c.minPrice} €.`,
    why: [
      { title: "Ціни з ПДВ", desc: "Ціна на сайті — остаточна ціна техніки з ПДВ. Монтаж і доставку погоджуємо заздалегідь, без сюрпризів на місці." },
      { title: "Консультація до покупки", desc: "Опишіть приміщення чи об'єкт — запропонуємо відповідну модель і точну підсумкову ціну." },
      { title: "Власна монтажна бригада", desc: "Монтує наша бригада у Варні та області, а не субпідрядники." },
    ],
    faqPrice: (noun, name, s, models) => ({
      q: `Скільки коштують ${noun.toLowerCase()} ${name}?`,
      a: `Від ${s.minPrice} € до ${s.maxPrice} € з ПДВ — ${s.count} ${models} у каталозі. Точна ціна й наявність — на сторінці кожної моделі.`,
    }),
    faqInstall: {
      ac: (name) => ({ q: `Скільки коштує монтаж кондиціонера ${name}?`, a: "Стандартний монтаж настінного кондиціонера — 190 € з ПДВ до 14 000 BTU і 230 € до 24 000 BTU: 3 м мідної труби, матеріали, вакуумування та запуск. Для касетних, канальних і мульти-спліт систем — безкоштовний виїзд і кошторис." }),
      heatpump: (name) => ({ q: `Скільки коштує монтаж теплового насоса ${name}?`, a: "Монтаж теплового насоса рахуємо після виїзду на об'єкт — він залежить від потужності, системи опалення та місця зовнішнього блока. Ціни в каталозі з ПДВ, без монтажу." }),
      accessory: (name) => ({ q: `Чи встановлюєте ви аксесуари ${name}?`, a: "Так — ставимо їх під час монтажу або профілактики кондиціонера. Назвіть модель вашого апарата — перевіримо сумісність." }),
    },
    faqChoose: (name) => ({ q: `Як обрати модель ${name}?`, a: "Назвіть площу та призначення приміщення чи об'єкта — запропонуємо 2–3 моделі з точною ціною з монтажем." }),
  },
};

const clamp = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(" ", max - 1))}…`;

/** Copy for a manufacturer without a BRANDS entry, from its live catalog numbers. */
export function generatedBrandCopy(name: string, stats: BrandStats, locale: BrandLocale): BrandCopy {
  const g = GENERATED[locale];
  const kinds = mainKinds(stats);
  const noun =
    kinds.length === 1 && kinds[0] === "accessory"
      ? g.accessoriesOnly
      : kinds.map((k, i) => (i === 0 ? g.kind[k] : g.kind[k].toLowerCase())).join(` ${g.and} `);
  const cats = stats.categories.slice(0, 3).map((c) => c.name.toLowerCase()).join(", ");
  const models = g.models(stats.count);
  return {
    title: clamp(g.title(noun, name, new Date().getFullYear()), 60),
    description: clamp(g.description(name, stats, cats), 160),
    h1: g.h1(noun, name),
    intro: g.intro(name, stats, cats),
    series: stats.categories.map((c) => g.series(c, g.models(c.count))),
    why: g.why,
    faq: [g.faqPrice(noun, name, stats, models), g.faqInstall[kinds[0]](name), g.faqChoose(name)],
  };
}
