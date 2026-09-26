import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// CATEGORY TRANSLATIONS
// ============================================================
const categoryTranslations: Record<string, { en: string; ru: string; ua: string }> = {
  // Group descriptions
  "ИНВЕРТОРНИ КЛИМАТИЦИ": { en: "Inverter Air Conditioners", ru: "Инверторные кондиционеры", ua: "Інверторні кондиціонери" },
  "ИНВ.МУЛТИСПЛИТ СИСТЕМИ": { en: "Inverter Multi-Split Systems", ru: "Инверторные мульти-сплит системы", ua: "Інверторні мульти-спліт системи" },
  "ТЕРМОПОМПИ": { en: "Heat Pumps", ru: "Тепловые насосы", ua: "Теплові насоси" },
  "БОЙЛЕРИ": { en: "Boilers", ru: "Бойлеры", ua: "Бойлери" },
  "ПРОФЕСИОНАЛНИ СИСТЕМИ": { en: "Professional Systems", ru: "Профессиональные системы", ua: "Професійні системи" },
  "VRV СИСТЕМИ": { en: "VRV Systems", ru: "VRV системы", ua: "VRV системи" },
  "ЧИЛЪРИ": { en: "Chillers", ru: "Чиллеры", ua: "Чилери" },
  "ВЕНТИЛАЦИЯ": { en: "Ventilation", ru: "Вентиляция", ua: "Вентиляція" },
  "ВЪЗДУХОПРЕЧИСТВАТЕЛИ": { en: "Air Purifiers", ru: "Очистители воздуха", ua: "Очищувачі повітря" },
  "АКСЕСОАРИ": { en: "Accessories", ru: "Аксессуары", ua: "Аксесуари" },
  "ДРУГИ": { en: "Other", ru: "Другое", ua: "Інше" },
  // Subgroup descriptions
  "СТЕННИ ВЪТРЕШНИ": { en: "Wall-Mounted Indoor", ru: "Настенные внутренние", ua: "Настінні внутрішні" },
  "ПОДОВИ ВЪТРЕШНИ": { en: "Floor-Standing Indoor", ru: "Напольные внутренние", ua: "Підлогові внутрішні" },
  "ВЪНШНИ": { en: "Outdoor Units", ru: "Наружные блоки", ua: "Зовнішні блоки" },
  "МОБИЛНИ": { en: "Mobile / Portable", ru: "Мобильные", ua: "Мобільні" },
  "ВЪТРЕШНИ ПРОМО": { en: "Indoor Units (Promo)", ru: "Внутренние блоки (Промо)", ua: "Внутрішні блоки (Промо)" },
  "ВЪНШНИ ПРОМО": { en: "Outdoor Units (Promo)", ru: "Наружные блоки (Промо)", ua: "Зовнішні блоки (Промо)" },
  "ВЪТРЕШНИ": { en: "Indoor Units", ru: "Внутренние блоки", ua: "Внутрішні блоки" },
  "МОНОБЛОК": { en: "Monoblock", ru: "Моноблок", ua: "Моноблок" },
  "СПЛИТ ВЪТРЕШНО": { en: "Split Indoor", ru: "Сплит внутренний", ua: "Спліт внутрішній" },
  "СПЛИТ ВЪНШНО": { en: "Split Outdoor", ru: "Сплит наружный", ua: "Спліт зовнішній" },
  "ФЕНКОЙЛИ/КОНВЕКТОРИ": { en: "Fan Coils / Convectors", ru: "Фанкойлы / Конвекторы", ua: "Фанкойли / Конвектори" },
  "АКСЕСОАРИ/ДРУГИ": { en: "Accessories / Other", ru: "Аксессуары / Другое", ua: "Аксесуари / Інше" },
  "БУФЕРИ": { en: "Buffers", ru: "Буферы", ua: "Буфери" },
  "СТЕНЕН ТИП": { en: "Wall Type", ru: "Настенный тип", ua: "Настінний тип" },
  "КАСЕТЪЧЕН ТИП": { en: "Cassette Type", ru: "Кассетный тип", ua: "Касетний тип" },
  "КАНАЛЕН ТИП": { en: "Ducted Type", ru: "Канальный тип", ua: "Канальний тип" },
  "ТАВАНЕН ТИП": { en: "Ceiling Type", ru: "Потолочный тип", ua: "Стельовий тип" },
  "КОЛОННИ КЛИМАТИЦИ": { en: "Column / Floor-Standing", ru: "Колонные кондиционеры", ua: "Колонні кондиціонери" },
  "ПОДОВ ТИП": { en: "Floor Type", ru: "Напольный тип", ua: "Підлоговий тип" },
  "РЕКУПЕРАТОРИ": { en: "Heat Recovery Units", ru: "Рекуператоры", ua: "Рекуператори" },
  "СТЕННИ": { en: "Wall-Mounted", ru: "Настенные", ua: "Настінні" },
  "ВЪЗДУШНИ ЗАВЕСИ": { en: "Air Curtains", ru: "Воздушные завесы", ua: "Повітряні завіси" },
  "ЖИЧНИ ДИСТАНЦИОННИ": { en: "Wired Remote Controls", ru: "Проводные пульты", ua: "Дротові пульти" },
  "БЕЗЖИЧНИ ДИСТАНЦИОННИ": { en: "Wireless Remote Controls", ru: "Беспроводные пульты", ua: "Бездротові пульти" },
  "Wi-Fi": { en: "Wi-Fi Modules", ru: "Wi-Fi модули", ua: "Wi-Fi модулі" },
  "РЕЗЕРВНИ ЧАСТИ": { en: "Spare Parts", ru: "Запасные части", ua: "Запасні частини" },
  "ВЪНШНИ ТЕЛА": { en: "Outdoor Units", ru: "Наружные блоки", ua: "Зовнішні блоки" },
};

// ============================================================
// TITLE PREFIX TRANSLATIONS
// ============================================================
const titlePrefixes: Array<{ bg: string; en: string; ru: string; ua: string }> = [
  { bg: "Инверторен климатик", en: "Inverter air conditioner", ru: "Инверторный кондиционер", ua: "Інверторний кондиціонер" },
  { bg: "Инверторна мултисплит система", en: "Inverter multi-split system", ru: "Инверторная мульти-сплит система", ua: "Інверторна мульти-спліт система" },
  { bg: "Външно тяло на мултисплит система", en: "Multi-split system outdoor unit", ru: "Наружный блок мульти-сплит системы", ua: "Зовнішній блок мульти-спліт системи" },
  { bg: "Външно тяло", en: "Outdoor unit", ru: "Наружный блок", ua: "Зовнішній блок" },
  { bg: "Вътрешно тяло", en: "Indoor unit", ru: "Внутренний блок", ua: "Внутрішній блок" },
  { bg: "Подов климатик", en: "Floor-standing air conditioner", ru: "Напольный кондиционер", ua: "Підлоговий кондиціонер" },
  { bg: "Мобилен климатик", en: "Portable air conditioner", ru: "Мобильный кондиционер", ua: "Мобільний кондиціонер" },
  { bg: "Колонен климатик", en: "Column air conditioner", ru: "Колонный кондиционер", ua: "Колонний кондиціонер" },
  { bg: "Канален климатик", en: "Ducted air conditioner", ru: "Канальный кондиционер", ua: "Канальний кондиціонер" },
  { bg: "Касетъчен климатик", en: "Cassette air conditioner", ru: "Кассетный кондиционер", ua: "Касетний кондиціонер" },
  { bg: "Таванен климатик", en: "Ceiling air conditioner", ru: "Потолочный кондиционер", ua: "Стельовий кондиціонер" },
  { bg: "Климатик", en: "Air conditioner", ru: "Кондиционер", ua: "Кондиціонер" },
  { bg: "Термопомпа", en: "Heat pump", ru: "Тепловой насос", ua: "Тепловий насос" },
  { bg: "Рекуператор", en: "Heat recovery unit", ru: "Рекуператор", ua: "Рекуператор" },
  { bg: "Въздухопречиствател", en: "Air purifier", ru: "Очиститель воздуха", ua: "Очищувач повітря" },
  { bg: "Въздушна завеса", en: "Air curtain", ru: "Воздушная завеса", ua: "Повітряна завіса" },
  { bg: "Бойлер", en: "Boiler", ru: "Бойлер", ua: "Бойлер" },
  { bg: "Буфер", en: "Buffer tank", ru: "Буферный бак", ua: "Буферний бак" },
  { bg: "Конвектор", en: "Convector", ru: "Конвектор", ua: "Конвектор" },
  { bg: "Фенкойл", en: "Fan coil unit", ru: "Фанкойл", ua: "Фанкойл" },
  { bg: "Стенно тяло", en: "Wall unit", ru: "Настенный блок", ua: "Настінний блок" },
  { bg: "Подово тяло", en: "Floor unit", ru: "Напольный блок", ua: "Підлоговий блок" },
  { bg: "СТЕННО", en: "Wall unit", ru: "Настенный блок", ua: "Настінний блок" },
  // Bulclima title patterns
  { bg: "Инверторен стенен климатик", en: "Inverter wall-mounted air conditioner", ru: "Инверторный настенный кондиционер", ua: "Інверторний настінний кондиціонер" },
  { bg: "Инверторен климатик стенен", en: "Inverter wall-mounted air conditioner", ru: "Инверторный настенный кондиционер", ua: "Інверторний настінний кондиціонер" },
  { bg: "Хиперинверторен климатик стенен", en: "Hyper-inverter wall-mounted air conditioner", ru: "Гиперинверторный настенный кондиционер", ua: "Гіперінверторний настінний кондиціонер" },
  { bg: "Инверторен климатик касетъчен", en: "Inverter cassette air conditioner", ru: "Инверторный кассетный кондиционер", ua: "Інверторний касетний кондиціонер" },
  { bg: "Инверторен климатик канален", en: "Inverter ducted air conditioner", ru: "Инверторный канальный кондиционер", ua: "Інверторний канальний кондиціонер" },
  { bg: "Инверторен климатик таванен", en: "Inverter ceiling air conditioner", ru: "Инверторный потолочный кондиционер", ua: "Інверторний стельовий кондиціонер" },
  { bg: "Инверторен климатик подово- таванен", en: "Inverter floor/ceiling air conditioner", ru: "Инверторный напольно-потолочный кондиционер", ua: "Інверторний підлогово-стельовий кондиціонер" },
  { bg: "Инверторен климатик подов", en: "Inverter floor-standing air conditioner", ru: "Инверторный напольный кондиционер", ua: "Інверторний підлоговий кондиціонер" },
  { bg: "Инверторен подов климатик", en: "Inverter floor-standing air conditioner", ru: "Инверторный напольный кондиционер", ua: "Інверторний підлоговий кондиціонер" },
  { bg: "Инверторен климатик мултисплит", en: "Inverter multi-split air conditioner", ru: "Инверторный мульти-сплит кондиционер", ua: "Інверторний мульти-спліт кондиціонер" },
  { bg: "Инверторен колонен климатик", en: "Inverter column air conditioner", ru: "Инверторный колонный кондиционер", ua: "Інверторний колонний кондиціонер" },
  { bg: "Инверторен трифазен колонен климатик", en: "Inverter three-phase column air conditioner", ru: "Инверторный трёхфазный колонный кондиционер", ua: "Інверторний трифазний колонний кондиціонер" },
  { bg: "Трифазен инверторен колонен климатик", en: "Inverter three-phase column air conditioner", ru: "Инверторный трёхфазный колонный кондиционер", ua: "Інверторний трифазний колонний кондиціонер" },
  { bg: "Инверторен монофазен колонен климатик", en: "Inverter single-phase column air conditioner", ru: "Инверторный однофазный колонный кондиционер", ua: "Інверторний однофазний колонний кондиціонер" },
  { bg: "Вътрешно тяло стенен тип инвертор", en: "Inverter wall-mounted indoor unit", ru: "Инверторный внутренний блок настенного типа", ua: "Інверторний внутрішній блок настінного типу" },
  { bg: "Вътрешно тяло стенен тип", en: "Wall-mounted indoor unit", ru: "Внутренний блок настенного типа", ua: "Внутрішній блок настінного типу" },
  { bg: "Вътрешно тяло канален тип инвертор", en: "Inverter ducted indoor unit", ru: "Инверторный внутренний блок канального типа", ua: "Інверторний внутрішній блок канального типу" },
  { bg: "Вътрешно тяло касетъчен тип инвертор", en: "Inverter cassette indoor unit", ru: "Инверторный внутренний блок кассетного типа", ua: "Інверторний внутрішній блок касетного типу" },
  { bg: "Вътрешно тяло подов тип инвертор", en: "Inverter floor-standing indoor unit", ru: "Инверторный внутренний блок напольного типа", ua: "Інверторний внутрішній блок підлогового типу" },
  { bg: "Външно тяло мулти сплит система", en: "Multi-split system outdoor unit", ru: "Наружный блок мульти-сплит системы", ua: "Зовнішній блок мульти-спліт системи" },
  { bg: "Агрегат за централна вентилация", en: "Central ventilation unit", ru: "Агрегат для центральной вентиляции", ua: "Агрегат для центральної вентиляції" },
  { bg: "Бойлер за мулти сплит система с БГВ", en: "DHW boiler for multi-split system", ru: "Бойлер ГВС для мульти-сплит системы", ua: "Бойлер ГВП для мульти-спліт системи" },
  { bg: "Термопомпа моноблок", en: "Monoblock heat pump", ru: "Тепловой насос моноблок", ua: "Тепловий насос моноблок" },
  { bg: "Кондензна помпа", en: "Condensate pump", ru: "Дренажный насос", ua: "Дренажний насос" },
  { bg: "Кондезна помпа", en: "Condensate pump", ru: "Дренажный насос", ua: "Дренажний насос" },
  { bg: "Винилов маркуч кондезна помпа", en: "Vinyl hose for condensate pump", ru: "Виниловый шланг для дренажного насоса", ua: "Вініловий шланг для дренажного насоса" },
  { bg: "Ароматно желе", en: "Aroma gel", ru: "Ароматический гель", ua: "Ароматичний гель" },
  { bg: "Wi-Fi управление за климатик през интернет", en: "Wi-Fi control for air conditioner via the internet", ru: "Wi-Fi управление кондиционером через интернет", ua: "Wi-Fi керування кондиціонером через інтернет" },
  { bg: "Wi-Fi управление", en: "Wi-Fi control", ru: "Wi-Fi управление", ua: "Wi-Fi керування" },
  { bg: "Комплект за два отоплителни кръга", en: "Kit for two heating circuits", ru: "Комплект для двух контуров отопления", ua: "Комплект для двох контурів опалення" },
  { bg: "Комплект за охлаждане", en: "Cooling kit", ru: "Комплект для охлаждения", ua: "Комплект для охолодження" },
  { bg: "Стаен термостат", en: "Room thermostat", ru: "Комнатный термостат", ua: "Кімнатний термостат" },
];

// Additional words commonly found in titles (checked in order — longer phrases first)
const titleWords: Record<string, { en: string; ru: string; ua: string }> = {
  "подов тип": { en: "floor type", ru: "напольный тип", ua: "підлоговий тип" },
  "стенен тип": { en: "wall type", ru: "настенный тип", ua: "настінний тип" },
  "ТЯЛО": { en: "unit", ru: "блок", ua: "блок" },
  "ВЪТРЕШНО": { en: "indoor", ru: "внутренний", ua: "внутрішній" },
  "ВЪНШНО": { en: "outdoor", ru: "наружный", ua: "зовнішній" },
  // Bulclima: "2 - стайна мулти сплит система KAISAI …", "… - отопление, охлаждане и БГВ"
  " - стайна инверторна мулти сплит система": { en: "-room inverter multi-split system", ru: "-комнатная инверторная мульти-сплит система", ua: "-кімнатна інверторна мульти-спліт система" },
  " - стайна инверторна мултисплит система": { en: "-room inverter multi-split system", ru: "-комнатная инверторная мульти-сплит система", ua: "-кімнатна інверторна мульти-спліт система" },
  " - стайна мулти сплит система": { en: "-room multi-split system", ru: "-комнатная мульти-сплит система", ua: "-кімнатна мульти-спліт система" },
  "- стайна мулти сплит система": { en: "-room multi-split system", ru: "-комнатная мульти-сплит система", ua: "-кімнатна мульти-спліт система" },
  "- отопление, охлаждане и БГВ": { en: "- heating, cooling and DHW", ru: "- отопление, охлаждение и ГВС", ua: "- опалення, охолодження та ГВП" },
  "отопление, охлаждане и БГВ": { en: "heating, cooling and DHW", ru: "отопление, охлаждение и ГВС", ua: "опалення, охолодження та ГВП" },
  "отопление, охлаждане": { en: "heating, cooling", ru: "отопление, охлаждение", ua: "опалення, охолодження" },
  "с вграден бойлер": { en: "with built-in boiler", ru: "со встроенным бойлером", ua: "з вбудованим бойлером" },
  "литра": { en: "liters", ru: "литров", ua: "літрів" },
  " л ": { en: " L ", ru: " л ", ua: " л " },
  "трифазен с черен панел": { en: "three-phase, black panel", ru: "трёхфазный, с чёрной панелью", ua: "трифазний, з чорною панеллю" },
  "с черен панел": { en: "with black panel", ru: "с чёрной панелью", ua: "з чорною панеллю" },
  "трифазен": { en: "three-phase", ru: "трёхфазный", ua: "трифазний" },
  "трифазна": { en: "three-phase", ru: "трёхфазный", ua: "трифазний" },
  "висок напор": { en: "high static pressure", ru: "высокий напор", ua: "високий напір" },
  "с хидромодул": { en: "with hydro module", ru: "с гидромодулем", ua: "з гідромодулем" },
  "с опция": { en: "with optional", ru: "с опцией", ua: "з опцією" },
  " и ": { en: " and ", ru: " и ", ua: " та " },
};

function translateTitle(bgTitle: string, lang: "en" | "ru" | "ua"): string {
  let result = bgTitle;

  // Sort prefixes by length (longest first) to avoid partial matches
  const sorted = [...titlePrefixes].sort((a, b) => b.bg.length - a.bg.length);

  for (const prefix of sorted) {
    if (result.toLowerCase().startsWith(prefix.bg.toLowerCase())) {
      const rest = result.slice(prefix.bg.length).trim();
      result = `${prefix[lang]} ${rest}`.trim();
      break;
    }
  }

  // Replace remaining Bulgarian words
  for (const [bg, translations] of Object.entries(titleWords)) {
    if (result.includes(bg)) {
      result = result.replace(new RegExp(bg, "gi"), translations[lang]);
    }
  }

  return result;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log("=== Translation Script ===\n");

  // 1. Translate categories
  console.log("1. Translating categories...");
  const { data: categories } = await supabase
    .from("categories")
    .select("id, group_name, subgroup_name, name_en, name_ru, name_ua");

  let catUpdated = 0;
  for (const cat of categories || []) {
    const groupTr = categoryTranslations[cat.group_name];
    const subTr = categoryTranslations[cat.subgroup_name];

    const updates: Record<string, string> = {};
    if (subTr) {
      if (!cat.name_en) updates.name_en = subTr.en;
      if (!cat.name_ru) updates.name_ru = subTr.ru;
      if (!cat.name_ua) updates.name_ua = subTr.ua;
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("categories").update(updates).eq("id", cat.id);
      catUpdated++;
    }
  }
  console.log(`   Updated ${catUpdated} categories\n`);

  // 2. Translate product titles
  console.log("2. Translating product titles...");
  const { data: products } = await supabase
    .from("products")
    .select("id, title, title_en, title_ru, title_ua")
    .eq("is_active", true);

  let prodUpdated = 0;
  for (const prod of products || []) {
    const updates: Record<string, string> = {};

    if (!prod.title_en) {
      updates.title_en = translateTitle(prod.title, "en");
    }
    if (!prod.title_ru) {
      updates.title_ru = translateTitle(prod.title, "ru");
    }
    if (!prod.title_ua) {
      updates.title_ua = translateTitle(prod.title, "ua");
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("products").update(updates).eq("id", prod.id);
      prodUpdated++;
    }
  }
  console.log(`   Updated ${prodUpdated} products\n`);

  // 3. Show some examples
  console.log("3. Translation examples:");
  const { data: examples } = await supabase
    .from("products")
    .select("title, title_en, title_ru, title_ua")
    .eq("is_active", true)
    .limit(5);

  for (const ex of examples || []) {
    console.log(`   BG: ${ex.title}`);
    console.log(`   EN: ${ex.title_en}`);
    console.log(`   RU: ${ex.title_ru}`);
    console.log(`   UA: ${ex.title_ua}`);
    console.log("");
  }

  console.log("=== Done! ===");
}

main().catch(console.error);
