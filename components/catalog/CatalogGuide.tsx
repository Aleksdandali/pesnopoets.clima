import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import { BRANDS } from "@/lib/brands";
import { brandLandingPath } from "@/lib/product/insights";
import { getInstallationEur } from "@/lib/pricing";

type L = "bg" | "en" | "ru" | "ua";

interface TierRow {
  btu: number;
  area: string;
  count: number;
  min: number;
  max: number;
  install: number;
}
interface BrandRow {
  name: string;
  href: string | null;
  count: number;
  min: number;
}

const TIERS: Array<{ btu: number; area: Record<L, string> }> = [
  { btu: 9000, area: { bg: "до 20 кв.м", en: "up to 20 m²", ru: "до 20 м²", ua: "до 20 м²" } },
  { btu: 12000, area: { bg: "20–28 кв.м", en: "20–28 m²", ru: "20–28 м²", ua: "20–28 м²" } },
  { btu: 18000, area: { bg: "28–45 кв.м", en: "28–45 m²", ru: "28–45 м²", ua: "28–45 м²" } },
  { btu: 24000, area: { bg: "45–60 кв.м", en: "45–60 m²", ru: "45–60 м²", ua: "45–60 м²" } },
];

async function getStats(): Promise<{ tiers: TierRow[]; brands: BrandRow[]; total: number }> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select("manufacturer, btu, price_client, price_override, category_id")
    .eq("is_active", true)
    .eq("is_hidden", false);
  const rows = (data ?? []).filter((p) => (p.price_override || p.price_client) > 0);
  const price = (p: { price_client: number; price_override: number | null }) => p.price_override || p.price_client;

  const tiers: TierRow[] = [];
  for (const t of TIERS) {
    const ps = rows.filter((p) => p.btu === t.btu && [1, 2, 14].includes(p.category_id));
    if (ps.length === 0) continue;
    const prices = ps.map(price);
    tiers.push({ btu: t.btu, area: "", count: ps.length, min: Math.round(Math.min(...prices)), max: Math.round(Math.max(...prices)), install: getInstallationEur(t.btu) });
  }
  const byBrand = new Map<string, number[]>();
  for (const p of rows) {
    if (!p.manufacturer) continue;
    byBrand.set(p.manufacturer, [...(byBrand.get(p.manufacturer) || []), price(p)]);
  }
  const brands: BrandRow[] = [...byBrand.entries()]
    .map(([name, prices]) => ({ name, href: brandLandingPath(name), count: prices.length, min: Math.round(Math.min(...prices)) }))
    .sort((a, b) => b.count - a.count);
  return { tiers, brands, total: rows.length };
}

const COPY: Record<
  L,
  {
    chooseTitle: string;
    chooseIntro: string;
    tierHead: [string, string, string, string, string];
    tierNote: string;
    brandsTitle: string;
    brandsIntro: string;
    brandHead: [string, string, string];
    brandsAll: string;
    varnaTitle: string;
    varna: { title: string; text: string }[];
    typesTitle: string;
    types: { href: string; title: string; text: string }[];
    servicesTitle: string;
    services: { href: string; title: string; text: string }[];
    readTitle: string;
    read: { href: string; title: string }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
  }
> = {
  bg: {
    chooseTitle: "Как да изберете климатик за Варна — по квадратура и цена",
    chooseIntro:
      "Правилната мощност се определя от площта на стаята, изложението и етажа. За стая с нормално изложение важи ориентирът по-долу; при южни прозорци, голямо остъкляване или последен етаж без изолация вземете следващата мощност. Цените са за уреда с ДДС, актуални към днешна дата от каталога ни; монтажът е фиксиран по мощност и не зависи от марката.",
    tierHead: ["Мощност", "За стая", "Модели на склад", "Цена на уреда", "Стандартен монтаж"],
    tierNote: "Общата цена с монтаж е посочена на страницата на всеки модел. Стандартният монтаж включва 3 м медна тръба, всички материали, вакуумиране и пуск в експлоатация.",
    brandsTitle: "Цени на климатици във Варна по марки (2026)",
    brandsIntro:
      "Работим с 10 марки в три ценови класа: японски премиум (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Toshiba, Hitachi), среден клас с най-добро съотношение цена–характеристики (Gree, LG) и бюджетни инвертори с пълна гаранция (AUX, Nippon, Techpoint). Всички са A++ или по-високи, с хладилен агент R32.",
    brandHead: ["Марка", "Модели", "Цена от"],
    brandsAll: "Всички марки",
    varnaTitle: "Какво е различното при климатик във Варна",
    varna: [
      { title: "Солен въздух и корозия", text: "На 1–2 км от морето външното тяло живее в солена мъгла. Търсете топлообменник с антикорозионно покритие (Blue Fin, Gold Fin) — Daikin, Mitsubishi Heavy и Gree Amber го имат стандартно. Годишното измиване на външното тяло удължава живота му с години." },
      { title: "Влажност", text: "Летата във Варна са влажни, не само горещи. Режимът Dry (изсушаване) при 26 °C често дава повече комфорт от Cool при 22 °C и харчи два пъти по-малко ток. Инверторните модели с плавна регулация държат влажността стабилно." },
      { title: "Зимата е основно отопление", text: "При средни януарски температури около 2 °C климатик с SCOP над 4 отоплява апартамент 2–3 пъти по-евтино от електрически конвектори. Изберете модел с работа до -15 °C и мощност на отопление поне 3,5 kW за хол." },
      { title: "Панелни блокове и шум", text: "В Младост, Владиславово и Възраждане стените са тънки. Вътрешно тяло под 21 dB (Mitsubishi Heavy SRK, Gree Soyal, Toshiba Daiseikai) е разликата между спокоен сън и оплакване от съседите." },
    ],
    typesTitle: "Типове климатици в каталога",
    types: [
      { href: "/klimatici/inverter", title: "Стенни инверторни климатици", text: "90 % от продажбите ни: едно вътрешно и едно външно тяло за една стая. 9–24k BTU, A++ до A+++." },
      { href: "/klimatici/multisplit", title: "Мултисплит системи", text: "Едно външно тяло за 2–5 стаи — когато фасадата не позволява няколко външни тела или искате един монтаж за целия апартамент." },
      { href: "/klimatici/termopompa", title: "Термопомпи въздух-вода", text: "За къщи с подово отопление или радиатори: заменят газов или пелетен котел с 3–4 пъти по-нисък разход." },
      { href: "/klimatici/kanalen", title: "Канални климатици", text: "Скрити в окачен таван, въздухът се подава през решетки — за офиси, магазини и апартаменти с висок таван." },
      { href: "/klimatici/kasetachen", title: "Касетъчни климатици", text: "Четиристранно подаване от тавана — за търговски и офис помещения от 40 до 120 кв.м." },
      { href: "/klimatici/kolonen", title: "Колонни климатици", text: "Свободностоящи 36–60k BTU за зали, ресторанти и складове без възможност за таванен монтаж." },
    ],
    servicesTitle: "Монтаж и профилактика във Варна",
    services: [
      { href: "/montazh", title: "Монтаж от 190 € с ДДС", text: "Собствен екип, не подизпълнители. 3 м трасе, вакуумиране, пуск и 12 месеца гаранция на монтажа. Обикновено до 3 дни след заявка." },
      { href: "/profilaktika", title: "Профилактика от 42 €", text: "Химическо почистване на топлообменника и турбината, дренаж, проверка на налягането. Запазва гаранцията и до 30 % от разхода на ток." },
    ],
    readTitle: "Полезно преди покупка",
    read: [
      { href: "/blog/how-to-choose-ac", title: "Как да изберем климатик — пълен наръчник за Варна" },
      { href: "/blog/electricity-cost-ac-varna", title: "Колко ток харчи климатик във Варна — реални сметки" },
      { href: "/blog/heating-with-ac", title: "Отопление с климатик през зимата — работи ли във Варна" },
      { href: "/blog/installation-costs-varna", title: "Монтаж на климатик — цени и какво включва" },
      { href: "/kalkulator-btu", title: "Калкулатор BTU — колко мощност за вашата стая" },
    ],
    faqTitle: "Често задавани въпроси за климатици във Варна",
    faq: [
      { q: "Колко струва климатик с монтаж във Варна през 2026 г.?", a: "Най-достъпният инверторен климатик 9 000 BTU с монтаж излиза около 500–600 € с ДДС; среден клас 12 000 BTU (Gree, LG) — 750–1000 €; японски модел (Daikin, Mitsubishi, Toshiba) — 1100–1500 €. Монтажът е 190 € за уреди до 14 000 BTU и 230 € за до 24 000 BTU." },
      { q: "Коя марка климатик е най-добра за Варна?", a: "За основно отопление и близост до морето — Mitsubishi Heavy, Daikin или Gree Amber/Soyal (антикорозионно покритие, работа до -15/-20 °C). За най-добро съотношение цена–клас — Gree Airy или LG. За ограничен бюджет — AUX Freedom или Nippon с пълна гаранция." },
      { q: "Колко BTU са нужни за стая от 20 кв.м?", a: "9 000 BTU при нормално изложение и стандартен таван. При южно изложение, голямо остъкляване или последен етаж — 12 000 BTU. За точна сметка ползвайте калкулатора BTU или се обадете за безплатен оглед." },
      { q: "Може ли климатикът да е единственото отопление в апартамент във Варна?", a: "Да, при зимите във Варна (средно 2–4 °C през януари) инверторен климатик с SCOP над 4 и работа до -15 °C е основно отопление за стаята, в която е монтиран. За целия апартамент са нужни 2–3 уреда или мултисплит система." },
      { q: "Колко време отнема доставката и монтажът?", a: "Наличните модели монтираме обикновено до 3 дни след заявка — в същия ден при спешност. Монтажът на един уред отнема 2–4 часа. Доставката във Варна и областта е безплатна при покупка с монтаж." },
      { q: "Каква гаранция получавам?", a: "Гаранция от производителя — 2 до 5 години според марката (Toshiba и LG дават 5) при монтаж от оторизиран екип, плюс 12 месеца гаранция на самия монтаж от нас. Годишната профилактика запазва гаранцията." },
    ],
  },
  en: {
    chooseTitle: "How to choose an air conditioner for Varna — by room size and price",
    chooseIntro:
      "The right capacity depends on room area, exposure and floor. The guide below applies to a room with normal exposure; for south-facing windows, large glazing or an uninsulated top floor take the next capacity up. Prices are for the unit incl. VAT, live from our catalog; installation is fixed per capacity and does not depend on the brand.",
    tierHead: ["Capacity", "Room", "Models in stock", "Unit price", "Standard installation"],
    tierNote: "The total installed price is shown on each model's page. Standard installation includes 3 m of copper pipe, all materials, vacuum and commissioning.",
    brandsTitle: "Air conditioner prices in Varna by brand (2026)",
    brandsIntro:
      "We carry 10 brands in three price classes: Japanese premium (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Toshiba, Hitachi), mid range with the best price-to-spec ratio (Gree, LG) and budget inverters with full warranty (AUX, Nippon, Techpoint). All are A++ or better, R32 refrigerant.",
    brandHead: ["Brand", "Models", "From"],
    brandsAll: "All brands",
    varnaTitle: "What is different about an AC in Varna",
    varna: [
      { title: "Salt air and corrosion", text: "Within 1–2 km of the sea the outdoor unit lives in salt mist. Look for a heat exchanger with anti-corrosion coating (Blue Fin, Gold Fin) — Daikin, Mitsubishi Heavy and Gree Amber have it as standard. Rinsing the outdoor unit once a year adds years to its life." },
      { title: "Humidity", text: "Varna summers are humid, not just hot. Dry mode at 26 °C often gives more comfort than Cool at 22 °C and uses half the electricity. Inverter models with smooth modulation keep humidity stable." },
      { title: "Winter means primary heating", text: "With average January temperatures around 2 °C, an AC with SCOP above 4 heats an apartment 2–3 times cheaper than electric convectors. Pick a model rated to -15 °C with at least 3.5 kW heating output for a living room." },
      { title: "Panel buildings and noise", text: "In Mladost, Vladislavovo and Vazrazhdane the walls are thin. An indoor unit under 21 dB (Mitsubishi Heavy SRK, Gree Soyal, Toshiba Daiseikai) is the difference between quiet sleep and a complaint from the neighbours." },
    ],
    typesTitle: "Types of air conditioners in the catalog",
    types: [
      { href: "/klimatici/inverter", title: "Wall-mounted inverter ACs", text: "90 % of our sales: one indoor and one outdoor unit per room. 9–24k BTU, A++ to A+++." },
      { href: "/klimatici/multisplit", title: "Multi-split systems", text: "One outdoor unit for 2–5 rooms — when the façade does not allow several outdoor units or you want one installation for the whole apartment." },
      { href: "/klimatici/termopompa", title: "Air-to-water heat pumps", text: "For houses with underfloor heating or radiators: replaces a gas or pellet boiler at 3–4 times lower running cost." },
      { href: "/klimatici/kanalen", title: "Ducted ACs", text: "Hidden in a suspended ceiling, air delivered through grilles — for offices, shops and high-ceiling apartments." },
      { href: "/klimatici/kasetachen", title: "Cassette ACs", text: "Four-way ceiling delivery — for commercial and office spaces from 40 to 120 m²." },
      { href: "/klimatici/kolonen", title: "Column ACs", text: "Free-standing 36–60k BTU for halls, restaurants and warehouses without ceiling mounting options." },
    ],
    servicesTitle: "Installation and maintenance in Varna",
    services: [
      { href: "/montazh", title: "Installation from €190 incl. VAT", text: "Own crew, no subcontractors. 3 m pipe run, vacuum, commissioning and 12 months warranty on the installation. Usually within 3 days of the order." },
      { href: "/profilaktika", title: "Maintenance from €42", text: "Chemical cleaning of the heat exchanger and fan, drainage, pressure check. Keeps the warranty and up to 30 % of the electricity bill." },
    ],
    readTitle: "Useful before you buy",
    read: [
      { href: "/blog/how-to-choose-ac", title: "How to choose an AC — the full Varna guide" },
      { href: "/blog/electricity-cost-ac-varna", title: "How much electricity an AC uses in Varna — real numbers" },
      { href: "/blog/heating-with-ac", title: "Heating with an AC in winter — does it work in Varna" },
      { href: "/blog/installation-costs-varna", title: "AC installation — prices and what is included" },
      { href: "/kalkulator-btu", title: "BTU calculator — how much capacity for your room" },
    ],
    faqTitle: "Frequently asked questions about ACs in Varna",
    faq: [
      { q: "How much does an AC cost installed in Varna in 2026?", a: "The most affordable 9,000 BTU inverter installed comes to about €500–600 incl. VAT; a mid-range 12,000 BTU (Gree, LG) — €750–1,000; a Japanese model (Daikin, Mitsubishi, Toshiba) — €1,100–1,500. Installation is €190 for units up to 14,000 BTU and €230 for up to 24,000 BTU." },
      { q: "Which AC brand is best for Varna?", a: "For primary heating and proximity to the sea — Mitsubishi Heavy, Daikin or Gree Amber/Soyal (anti-corrosion coating, operation to -15/-20 °C). Best price-to-class — Gree Airy or LG. On a tight budget — AUX Freedom or Nippon with full warranty." },
      { q: "How many BTU for a 20 m² room?", a: "9,000 BTU with normal exposure and a standard ceiling. South-facing, large glazing or top floor — 12,000 BTU. For an exact figure use the BTU calculator or call for a free site visit." },
      { q: "Can an AC be the only heating in a Varna apartment?", a: "Yes — with Varna winters (2–4 °C average in January) an inverter AC with SCOP above 4 rated to -15 °C is primary heating for the room it is in. For the whole apartment you need 2–3 units or a multi-split system." },
      { q: "How long do delivery and installation take?", a: "In-stock models are usually installed within 3 days of the order — same day when urgent. Installing one unit takes 2–4 hours. Delivery in Varna and the region is free with installation." },
      { q: "What warranty do I get?", a: "Manufacturer warranty — 2 to 5 years depending on the brand (Toshiba and LG give 5) with installation by an authorised crew, plus 12 months on the installation itself from us. Annual maintenance keeps the warranty valid." },
    ],
  },
  ru: {
    chooseTitle: "Как выбрать кондиционер для Варны — по площади и цене",
    chooseIntro:
      "Правильная мощность зависит от площади комнаты, ориентации и этажа. Ориентир ниже — для комнаты с нормальной ориентацией; при южных окнах, большом остеклении или последнем этаже без утепления берите следующую мощность. Цены — за аппарат с НДС, актуальные из нашего каталога; монтаж фиксирован по мощности и не зависит от марки.",
    tierHead: ["Мощность", "Для комнаты", "Моделей на складе", "Цена аппарата", "Стандартный монтаж"],
    tierNote: "Общая цена с монтажом указана на странице каждой модели. Стандартный монтаж включает 3 м медной трубы, все материалы, вакуумирование и пусконаладку.",
    brandsTitle: "Цены на кондиционеры в Варне по маркам (2026)",
    brandsIntro:
      "Работаем с 10 марками в трёх ценовых классах: японский премиум (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Toshiba, Hitachi), средний класс с лучшим соотношением цены и характеристик (Gree, LG) и бюджетные инверторы с полной гарантией (AUX, Nippon, Techpoint). Все — A++ и выше, хладагент R32.",
    brandHead: ["Марка", "Моделей", "Цена от"],
    brandsAll: "Все марки",
    varnaTitle: "В чём особенность кондиционера в Варне",
    varna: [
      { title: "Солёный воздух и коррозия", text: "В 1–2 км от моря наружный блок живёт в солёном тумане. Ищите теплообменник с антикоррозийным покрытием (Blue Fin, Gold Fin) — у Daikin, Mitsubishi Heavy и Gree Amber оно стандартно. Ежегодная мойка наружного блока продлевает его жизнь на годы." },
      { title: "Влажность", text: "Лето в Варне влажное, а не только жаркое. Режим Dry (осушение) при 26 °C часто даёт больше комфорта, чем Cool при 22 °C, и тратит вдвое меньше электричества. Инверторы с плавной регулировкой держат влажность стабильно." },
      { title: "Зима — основное отопление", text: "При средних январских температурах около 2 °C кондиционер с SCOP выше 4 отапливает квартиру в 2–3 раза дешевле электроконвекторов. Выбирайте модель с работой до -15 °C и мощностью обогрева не менее 3,5 кВт для гостиной." },
      { title: "Панельные дома и шум", text: "В Младост, Владиславово и Възраждане стены тонкие. Внутренний блок тише 21 дБ (Mitsubishi Heavy SRK, Gree Soyal, Toshiba Daiseikai) — разница между спокойным сном и жалобой соседей." },
    ],
    typesTitle: "Типы кондиционеров в каталоге",
    types: [
      { href: "/klimatici/inverter", title: "Настенные инверторные кондиционеры", text: "90 % наших продаж: один внутренний и один наружный блок на комнату. 9–24k BTU, A++ до A+++." },
      { href: "/klimatici/multisplit", title: "Мультисплит-системы", text: "Один наружный блок на 2–5 комнат — когда фасад не позволяет несколько блоков или нужен один монтаж на всю квартиру." },
      { href: "/klimatici/termopompa", title: "Тепловые насосы воздух-вода", text: "Для домов с тёплым полом или радиаторами: заменяют газовый или пеллетный котёл с расходом в 3–4 раза ниже." },
      { href: "/klimatici/kanalen", title: "Канальные кондиционеры", text: "Скрыты в подвесном потолке, воздух подаётся через решётки — для офисов, магазинов и квартир с высокими потолками." },
      { href: "/klimatici/kasetachen", title: "Кассетные кондиционеры", text: "Четырёхсторонняя подача с потолка — для торговых и офисных помещений от 40 до 120 м²." },
      { href: "/klimatici/kolonen", title: "Колонные кондиционеры", text: "Напольные 36–60k BTU для залов, ресторанов и складов без возможности потолочного монтажа." },
    ],
    servicesTitle: "Монтаж и профилактика в Варне",
    services: [
      { href: "/montazh", title: "Монтаж от 190 € с НДС", text: "Своя бригада, без субподрядчиков. 3 м трассы, вакуумирование, запуск и 12 месяцев гарантии на монтаж. Обычно в течение 3 дней после заявки." },
      { href: "/profilaktika", title: "Профилактика от 42 €", text: "Химическая чистка теплообменника и турбины, дренаж, проверка давления. Сохраняет гарантию и до 30 % расхода электричества." },
    ],
    readTitle: "Полезно перед покупкой",
    read: [
      { href: "/blog/how-to-choose-ac", title: "Как выбрать кондиционер — полное руководство для Варны" },
      { href: "/blog/electricity-cost-ac-varna", title: "Сколько электричества тратит кондиционер в Варне — реальные цифры" },
      { href: "/blog/heating-with-ac", title: "Отопление кондиционером зимой — работает ли в Варне" },
      { href: "/blog/installation-costs-varna", title: "Монтаж кондиционера — цены и что входит" },
      { href: "/kalkulator-btu", title: "Калькулятор BTU — сколько мощности для вашей комнаты" },
    ],
    faqTitle: "Частые вопросы о кондиционерах в Варне",
    faq: [
      { q: "Сколько стоит кондиционер с монтажом в Варне в 2026 году?", a: "Самый доступный инверторный кондиционер 9 000 BTU с монтажом — около 500–600 € с НДС; средний класс 12 000 BTU (Gree, LG) — 750–1000 €; японская модель (Daikin, Mitsubishi, Toshiba) — 1100–1500 €. Монтаж — 190 € для аппаратов до 14 000 BTU и 230 € до 24 000 BTU." },
      { q: "Какая марка кондиционера лучшая для Варны?", a: "Для основного отопления и близости к морю — Mitsubishi Heavy, Daikin или Gree Amber/Soyal (антикоррозийное покрытие, работа до -15/-20 °C). Лучшее соотношение цены и класса — Gree Airy или LG. При ограниченном бюджете — AUX Freedom или Nippon с полной гарантией." },
      { q: "Сколько BTU нужно для комнаты 20 м²?", a: "9 000 BTU при нормальной ориентации и стандартном потолке. Южная сторона, большое остекление или последний этаж — 12 000 BTU. Для точного расчёта используйте калькулятор BTU или позвоните для бесплатного осмотра." },
      { q: "Может ли кондиционер быть единственным отоплением в квартире в Варне?", a: "Да — при варненских зимах (в среднем 2–4 °C в январе) инверторный кондиционер с SCOP выше 4 и работой до -15 °C — основное отопление для комнаты, где он установлен. На всю квартиру нужны 2–3 аппарата или мультисплит-система." },
      { q: "Сколько занимают доставка и монтаж?", a: "Модели в наличии обычно монтируем в течение 3 дней после заявки — в тот же день при срочности. Монтаж одного аппарата занимает 2–4 часа. Доставка по Варне и области бесплатна при покупке с монтажом." },
      { q: "Какую гарантию я получаю?", a: "Гарантия производителя — от 2 до 5 лет в зависимости от марки (Toshiba и LG дают 5) при монтаже авторизованной бригадой, плюс 12 месяцев гарантии на сам монтаж от нас. Ежегодная профилактика сохраняет гарантию." },
    ],
  },
  ua: {
    chooseTitle: "Як обрати кондиціонер для Варни — за площею та ціною",
    chooseIntro:
      "Правильна потужність залежить від площі кімнати, орієнтації та поверху. Орієнтир нижче — для кімнати з нормальною орієнтацією; за південних вікон, великого скління або останнього поверху без утеплення беріть наступну потужність. Ціни — за апарат з ПДВ, актуальні з нашого каталогу; монтаж фіксований за потужністю й не залежить від марки.",
    tierHead: ["Потужність", "Для кімнати", "Моделей на складі", "Ціна апарата", "Стандартний монтаж"],
    tierNote: "Загальна ціна з монтажем вказана на сторінці кожної моделі. Стандартний монтаж включає 3 м мідної труби, всі матеріали, вакуумування та пусконалагодження.",
    brandsTitle: "Ціни на кондиціонери у Варні за марками (2026)",
    brandsIntro:
      "Працюємо з 10 марками у трьох цінових класах: японський преміум (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Toshiba, Hitachi), середній клас із найкращим співвідношенням ціни й характеристик (Gree, LG) і бюджетні інвертори з повною гарантією (AUX, Nippon, Techpoint). Усі — A++ і вище, холодоагент R32.",
    brandHead: ["Марка", "Моделей", "Ціна від"],
    brandsAll: "Усі марки",
    varnaTitle: "У чому особливість кондиціонера у Варні",
    varna: [
      { title: "Солоне повітря та корозія", text: "За 1–2 км від моря зовнішній блок живе в солоному тумані. Шукайте теплообмінник з антикорозійним покриттям (Blue Fin, Gold Fin) — у Daikin, Mitsubishi Heavy і Gree Amber воно стандартне. Щорічне миття зовнішнього блока подовжує його життя на роки." },
      { title: "Вологість", text: "Літо у Варні вологе, а не лише спекотне. Режим Dry (осушення) при 26 °C часто дає більше комфорту, ніж Cool при 22 °C, і витрачає вдвічі менше електрики. Інвертори з плавним регулюванням тримають вологість стабільно." },
      { title: "Зима — основне опалення", text: "За середніх січневих температур близько 2 °C кондиціонер зі SCOP вище 4 опалює квартиру у 2–3 рази дешевше за електроконвектори. Обирайте модель із роботою до -15 °C і потужністю обігріву не менше 3,5 кВт для вітальні." },
      { title: "Панельні будинки та шум", text: "У Младост, Владиславово та Възраждане стіни тонкі. Внутрішній блок тихіший за 21 дБ (Mitsubishi Heavy SRK, Gree Soyal, Toshiba Daiseikai) — різниця між спокійним сном і скаргою сусідів." },
    ],
    typesTitle: "Типи кондиціонерів у каталозі",
    types: [
      { href: "/klimatici/inverter", title: "Настінні інверторні кондиціонери", text: "90 % наших продажів: один внутрішній і один зовнішній блок на кімнату. 9–24k BTU, A++ до A+++." },
      { href: "/klimatici/multisplit", title: "Мультиспліт-системи", text: "Один зовнішній блок на 2–5 кімнат — коли фасад не дозволяє кілька блоків або потрібен один монтаж на всю квартиру." },
      { href: "/klimatici/termopompa", title: "Теплові насоси повітря-вода", text: "Для будинків із теплою підлогою або радіаторами: замінюють газовий чи пелетний котел із витратою у 3–4 рази нижчою." },
      { href: "/klimatici/kanalen", title: "Канальні кондиціонери", text: "Сховані в підвісній стелі, повітря подається через решітки — для офісів, магазинів і квартир із високими стелями." },
      { href: "/klimatici/kasetachen", title: "Касетні кондиціонери", text: "Чотиристороння подача зі стелі — для торгових і офісних приміщень від 40 до 120 м²." },
      { href: "/klimatici/kolonen", title: "Колонні кондиціонери", text: "Підлогові 36–60k BTU для залів, ресторанів і складів без можливості стельового монтажу." },
    ],
    servicesTitle: "Монтаж і профілактика у Варні",
    services: [
      { href: "/montazh", title: "Монтаж від 190 € з ПДВ", text: "Власна бригада, без субпідрядників. 3 м траси, вакуумування, запуск і 12 місяців гарантії на монтаж. Зазвичай протягом 3 днів після заявки." },
      { href: "/profilaktika", title: "Профілактика від 42 €", text: "Хімічне чищення теплообмінника й турбіни, дренаж, перевірка тиску. Зберігає гарантію та до 30 % витрати електрики." },
    ],
    readTitle: "Корисно перед покупкою",
    read: [
      { href: "/blog/how-to-choose-ac", title: "Як обрати кондиціонер — повний посібник для Варни" },
      { href: "/blog/electricity-cost-ac-varna", title: "Скільки електрики витрачає кондиціонер у Варні — реальні цифри" },
      { href: "/blog/heating-with-ac", title: "Опалення кондиціонером узимку — чи працює у Варні" },
      { href: "/blog/installation-costs-varna", title: "Монтаж кондиціонера — ціни та що входить" },
      { href: "/kalkulator-btu", title: "Калькулятор BTU — скільки потужності для вашої кімнати" },
    ],
    faqTitle: "Часті запитання про кондиціонери у Варні",
    faq: [
      { q: "Скільки коштує кондиціонер з монтажем у Варні у 2026 році?", a: "Найдоступніший інверторний кондиціонер 9 000 BTU з монтажем — близько 500–600 € з ПДВ; середній клас 12 000 BTU (Gree, LG) — 750–1000 €; японська модель (Daikin, Mitsubishi, Toshiba) — 1100–1500 €. Монтаж — 190 € для апаратів до 14 000 BTU і 230 € до 24 000 BTU." },
      { q: "Яка марка кондиціонера найкраща для Варни?", a: "Для основного опалення та близькості до моря — Mitsubishi Heavy, Daikin або Gree Amber/Soyal (антикорозійне покриття, робота до -15/-20 °C). Найкраще співвідношення ціни й класу — Gree Airy або LG. За обмеженого бюджету — AUX Freedom або Nippon з повною гарантією." },
      { q: "Скільки BTU потрібно для кімнати 20 м²?", a: "9 000 BTU за нормальної орієнтації та стандартної стелі. Південна сторона, велике скління або останній поверх — 12 000 BTU. Для точного розрахунку скористайтеся калькулятором BTU або зателефонуйте для безкоштовного огляду." },
      { q: "Чи може кондиціонер бути єдиним опаленням у квартирі у Варні?", a: "Так — за варненських зим (у середньому 2–4 °C у січні) інверторний кондиціонер зі SCOP вище 4 і роботою до -15 °C — основне опалення для кімнати, де він встановлений. На всю квартиру потрібні 2–3 апарати або мультиспліт-система." },
      { q: "Скільки займають доставка та монтаж?", a: "Моделі в наявності зазвичай монтуємо протягом 3 днів після заявки — того ж дня за терміновості. Монтаж одного апарата займає 2–4 години. Доставка по Варні та області безкоштовна за покупки з монтажем." },
      { q: "Яку гарантію я отримую?", a: "Гарантія виробника — від 2 до 5 років залежно від марки (Toshiba і LG дають 5) за монтажу авторизованою бригадою, плюс 12 місяців гарантії на сам монтаж від нас. Щорічна профілактика зберігає гарантію." },
    ],
  },
};

/**
 * Editorial block under the catalog grid — rendered only on the unfiltered
 * catalog URL so the indexable page carries real content (the grid alone
 * was 617 words vs 1 900–2 500 for the pages ranking top-3 on
 * "климатици варна"). Tables are computed from the live catalog.
 */
export default async function CatalogGuide({ locale }: { locale: string }) {
  const l: L = (["bg", "en", "ru", "ua"] as const).includes(locale as L) ? (locale as L) : "bg";
  const t = COPY[l];
  const { tiers, brands } = await getStats();
  const tierRows = tiers.map((row) => ({ ...row, area: TIERS.find((x) => x.btu === row.btu)?.area[l] ?? "" }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const brandName = (name: string) => BRANDS.find((b) => b.manufacturer === name)?.name ?? name;

  return (
    <div className="mt-14 sm:mt-20 space-y-14 sm:space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* By capacity */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.chooseTitle}</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">{t.chooseIntro}</p>
        {tierRows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  {t.tierHead.map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tierRows.map((r) => (
                  <tr key={r.btu} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      <Link href={`/${locale}/klimatici?btu=${r.btu}-${r.btu}`} className="hover:text-primary">{r.btu.toLocaleString("en-US")} BTU</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.area}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.count}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{r.min} – {r.max} €</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{r.install} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs sm:text-sm text-muted-foreground mt-3">{t.tierNote}</p>
      </section>

      {/* By brand */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t.brandsTitle}</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">{t.brandsIntro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {[brands.slice(0, Math.ceil(brands.length / 2)), brands.slice(Math.ceil(brands.length / 2))].map((half, i) => (
            <table key={i} className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-border">
                  {t.brandHead.map((h) => (
                    <th key={h} className="py-2 pr-4 font-semibold text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {half.map((b) => (
                  <tr key={b.name} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-medium text-foreground">
                      {b.href ? (
                        <Link href={`/${locale}${b.href}`} className="inline-flex items-center gap-1 hover:text-primary">
                          {brandName(b.name)}
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                        </Link>
                      ) : (
                        brandName(b.name)
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{b.count}</td>
                    <td className="py-2.5 text-foreground whitespace-nowrap">{b.min} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        <Link href={`/${locale}/brands`} className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:underline">
          {t.brandsAll}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Varna specifics */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t.varnaTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.varna.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-semibold text-foreground mb-1.5">{v.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Types */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t.typesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.types.map((x) => (
            <Link key={x.href} href={`/${locale}${x.href}`} className="group rounded-xl border border-border bg-white p-5 hover:border-primary/40 transition-colors">
              <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary">{x.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{x.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t.servicesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.services.map((x) => (
            <div key={x.href} className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-foreground mb-1.5">{x.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">{x.text}</p>
              <Link href={`/${locale}${x.href}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                {x.title.split(" ")[0]}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Reading */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t.readTitle}</h2>
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {t.read.map((r) => (
            <li key={r.href}>
              <Link href={`/${locale}${r.href}`} className="inline-flex items-start gap-2 text-sm sm:text-base text-foreground hover:text-primary">
                <ChevronRight className="w-4 h-4 mt-1 text-muted-foreground shrink-0" aria-hidden="true" />
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t.faqTitle}</h2>
        <div className="space-y-3 max-w-3xl">
          {t.faq.map((f) => (
            <details key={f.q} className="group bg-white rounded-xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-start justify-between gap-4 cursor-pointer">
                <h3 className="font-semibold text-foreground pr-2">{f.q}</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
