/**
 * Brand landing pages (/[locale]/marki/[brand]).
 *
 * Daikin and Mitsubishi Electric already have hand-written pages
 * (/daikin-varna, /mitsubishi-varna). The remaining eight manufacturers in
 * the catalog get a data-driven page each: copy from here, numbers (model
 * count, price range, BTU range, warranty) from Supabase at render time.
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
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
