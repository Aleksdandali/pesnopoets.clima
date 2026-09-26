import { generateProductSlug } from "@/lib/bittel/parser";
import type { BulclimaProduct } from "./types";

/** A site category, addressed by the Bittel codes the landing pages filter on. */
export interface CategoryCode {
  group_code: string;
  subgroup_code: string;
}

const WALL: CategoryCode = { group_code: "10_ ИНВЕРТОРНИ.КЛ", subgroup_code: "10_СТЕННИ.ВЪТРЕШНИ" };
const FLOOR: CategoryCode = { group_code: "10_ ИНВЕРТОРНИ.КЛ", subgroup_code: "20_ПОДОВИ.ВЪТРЕШНИ" };
const MULTI_OUTDOOR: CategoryCode = { group_code: "20_ИНВ.МУЛТИСПЛИ.СИС", subgroup_code: "10_ВЪНШНИ" };
const MULTI_INDOOR: CategoryCode = { group_code: "20_ИНВ.МУЛТИСПЛИ.СИС", subgroup_code: "20_ВЪТРЕШНИ" };
const HP_MONOBLOCK: CategoryCode = { group_code: "30_ТЕРМОПОМПИ", subgroup_code: "10_МОНОБЛОК" };
const HP_SPLIT: CategoryCode = { group_code: "30_ТЕРМОПОМПИ", subgroup_code: "20_СПЛИТ.ВЪТРЕШНО" };
const CASSETTE: CategoryCode = { group_code: "40_ПРОФЕСИОН.СИСТЕМИ", subgroup_code: "20_КАСЕТЪЧЕН.ТИП" };
const DUCT: CategoryCode = { group_code: "40_ПРОФЕСИОН.СИСТЕМИ", subgroup_code: "30_КАНАЛЕН.ТИП" };
const CEILING: CategoryCode = { group_code: "40_ПРОФЕСИОН.СИСТЕМИ", subgroup_code: "40_ТАВАНЕН.ТИП" };
const COLUMN: CategoryCode = { group_code: "40_ПРОФЕСИОН.СИСТЕМИ", subgroup_code: "50_КОЛОННИ.КЛ" };
const PRO_OUTDOOR: CategoryCode = { group_code: "40_ПРОФЕСИОН.СИСТЕМИ", subgroup_code: "60_ВЪНШНИ.ТЕЛА" };
const ACCESSORIES: CategoryCode = { group_code: "90_АКСЕСОАРИ", subgroup_code: "" };

/**
 * Bulclima "category|sub_category" → site category. Same scope as the Bittel
 * feed: air conditioners, multi-split units, heat pumps and their accessories.
 */
const CATEGORY_MAP: Record<string, CategoryCode | ((title: string) => CategoryCode)> = {
  "Климатици|Стенни климатици": WALL,
  "Климатици|Подови климатици": FLOOR,
  "Климатици|Касетъчни климатици": CASSETTE,
  "Климатици|Канални климатици": DUCT,
  "Климатици|Таванни климатици": CEILING,
  "Климатици|Колонни климатици": COLUMN,
  "Климатици|Wi-Fi и аксесоари за климатици": ACCESSORIES,
  // Mostly multi-split indoor units, plus General outdoor units for twin/triple systems.
  "Климатици|Мулти сплит системи": (title) =>
    /^агрегат/i.test(title) ? PRO_OUTDOOR : /^външно тяло/i.test(title) ? MULTI_OUTDOOR : MULTI_INDOOR,
  "Мулти сплит системи|Вътрешни тела за мултисплит системи": MULTI_INDOOR,
  "Мулти сплит системи|Външни тела за мултисплит системи": MULTI_OUTDOOR,
  // Heat pump sections also hold Atlantic kits and thermostats; every actual
  // heat pump title starts with "Термопомпа".
  "Термопомпи|Термопомпи сплит": (title) => (isHeatPump(title) ? HP_SPLIT : ACCESSORIES),
  "Термопомпи|Термопомпи моноблок": (title) => (isHeatPump(title) ? HP_MONOBLOCK : ACCESSORIES),
  "Термопомпи|Професионални термопомпи/ чилъри": (title) => (isHeatPump(title) ? HP_MONOBLOCK : ACCESSORIES),
};

function isHeatPump(title: string): boolean {
  return /^термопомпа/i.test(title);
}

/** Known Bulclima groups the catalog does not sell. Anything else unmapped is reported. */
const OUT_OF_SCOPE_GROUPS = new Set([
  "Вентилаторни конвектори",
  "Вентилация",
  "Въздушни завеси",
  "Грижа за въздуха",
  "Бойлери",
]);

/** Bittel leaves BTU empty on multi-split indoor units, heat pumps and accessories — same here. */
const CATEGORIES_WITH_BTU = new Set<CategoryCode>([
  WALL, FLOOR, CASSETTE, DUCT, CEILING, COLUMN, MULTI_OUTDOOR, PRO_OUTDOOR,
]);

// Bulclima spellings → the name shown on the site. "General" is how the
// product titles name the brand; both Atlantic feeds are one brand.
const MANUFACTURER_NAMES: Record<string, string> = {
  GENERAL: "General",
  "Atlantic (by Fujitsu General)": "Atlantic",
  ASPEN: "Aspen",
};

export function normalizeManufacturer(raw: string): string {
  const name = raw.trim();
  return MANUFACTURER_NAMES[name] ?? name;
}

export function toSupplierId(bulclimaId: string): string {
  return `BC-${bulclimaId}`;
}

// ---------------------------------------------------------------------------
// Text cleanup
// ---------------------------------------------------------------------------

const LATIN_TO_CYRILLIC: Record<string, string> = {
  a: "а", c: "с", e: "е", o: "о", p: "р", x: "х", y: "у", k: "к", "ĸ": "к",
  A: "А", B: "В", C: "С", E: "Е", H: "Н", K: "К", M: "М", O: "О", P: "Р", T: "Т", X: "Х", Y: "У",
};
const CYRILLIC_TO_LATIN: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(LATIN_TO_CYRILLIC)
      .filter(([latin]) => latin !== "ĸ")
      .map(([latin, cyrillic]) => [cyrillic, latin])
  ),
  Ѕ: "S", ѕ: "s", І: "I", і: "i", Ј: "J", ј: "j",
};
const CYRILLIC_ONLY = /[бвгджзийлмнптфцчшщъьюяБГДЖЗИЙЛПФЦЧШЩЪЬЮЯ]/;
const LATIN_ONLY = /[bdfghijlmnqrstuvwzDFGIJLNQRSUVWZ0-9]/;
// Not Bulgarian letters: a word containing one is Latin in disguise ("ЅЕЕR", "ЅСОР").
const NON_BULGARIAN = /[ЅѕІіЈј]/;

const toLatin = (word: string) => [...word].map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch).join("");
const toCyrillic = (word: string) => [...word].map((ch) => LATIN_TO_CYRILLIC[ch] ?? ch).join("");

/**
 * Bulclima text mixes scripts inside words ("Инверторeн" with a Latin "e",
 * "K2ОE-18…" with a Cyrillic "О", "ЅЕЕR"). Each word is pulled toward the
 * script it clearly belongs to, so search, slugs and badge checks see clean text.
 */
export function normalizeScripts(text: string): string {
  return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
    if (NON_BULGARIAN.test(word)) return toLatin(word);
    if (!/[Ѐ-ӿ]/.test(word) || !/[A-Za-zĸ]/.test(word)) return word;
    const cyrillic = CYRILLIC_ONLY.test(word);
    const latin = LATIN_ONLY.test(word);
    if (cyrillic && !latin) return toCyrillic(word);
    if (latin && !cyrillic) return toLatin(word);
    return word;
  });
}

const ENTITIES: Record<string, string> = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "–", mdash: "—",
  deg: "°", laquo: "«", raquo: "»", bdquo: "„", ldquo: "“", rdquo: "”", hellip: "…",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/** Description HTML → plain bullet lines. */
function toBullets(html: string): string[] {
  return html
    .split(/<\/?(?:li|p|br|div|ul|ol)[^>]*>/i)
    .map((s) => decodeEntities(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Drop wrapper attributes and empty paragraphs; the product page sanitizes the rest on render. */
function cleanHtml(html: string): string {
  return html
    .replace(/\s(?:class|itemprop|style|id)="[^"]*"/gi, "")
    .replace(/(?:&nbsp;| )+/g, " ")
    .replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Specs
// ---------------------------------------------------------------------------

// Capacity digits inside model codes, per brand (09 → 9 000 BTU).
const BTU_CODE_PATTERNS: Record<string, RegExp> = {
  General: /\bA[A-Z]{3}(\d{2})[A-Z]/, // ASHH12KMCG, AUHG18LVLB, AOHG36KBTB
  Kaisai: /\bK[A-Z0-9]{1,4}\s?-\s?(\d{2})[A-Z]/, // KWX-09KRHI, KCA4U- 12HRG32X, K5OE-42HFN32H
  Williams: /\bW[A-Z]{2,3}-(\d{2})[A-Z]/, // WSAB-09HRDN8, WCD-18HRFNX
  Auratsu: /\b(?:ATC|G[A-Z0-9]{3})-(\d{2})[A-Z]/, // ATC-12CLHI, GKWT-09RAA1, GKO2-18RTA1
  "Olimpia Splendid": /\bOS-[A-Z]{4,6}(\d{2})[A-Z]/, // OS-CEMAH27EI
};
// Samsung commercial codes carry kW × 10: AC140RNMDKG = 14.0 kW.
const SAMSUNG_KW_CODE = /\bAC(\d{3})[A-Z]/;
const EXPLICIT_BTU = /(\d{1,2})[\s.,]?000\s*BTU/i;
const KW_TO_BTU = 3412;

function plausibleBtu(btu: number): number | null {
  return btu >= 5000 && btu <= 100000 ? btu : null;
}

export function parseBtu(manufacturer: string, title: string, sku: string): number | null {
  const haystack = `${title} ${sku}`.toUpperCase();
  const explicit = haystack.match(EXPLICIT_BTU);
  if (explicit) return plausibleBtu(parseInt(explicit[1], 10) * 1000);
  if (manufacturer === "Samsung") {
    const kw = haystack.match(SAMSUNG_KW_CODE);
    return kw ? plausibleBtu(Math.round((parseInt(kw[1], 10) / 10) * KW_TO_BTU / 1000) * 1000) : null;
  }
  const pattern = BTU_CODE_PATTERNS[manufacturer];
  const code = pattern ? haystack.match(pattern) : null;
  return code ? plausibleBtu(parseInt(code[1], 10) * 1000) : null;
}

function number(raw: string, min: number, max: number): number | null {
  const n = parseFloat(raw.replace(",", "."));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

const CLASS = "(A\\s?\\+{1,3}|A)(?![A-Za-z0-9])";
const EXPLICIT_CLASS = new RegExp(`клас\\s*[:\\-–]?\\s*${CLASS}(?:\\s*(?:\\/|и)\\s*${CLASS})?`, "i");
const SEER = new RegExp(`SEER\\s*[:\\-–]?\\s*(\\d{1,2}(?:[.,]\\d{1,2})?)\\s*(?:W\\/W\\s*)?(?:[-–]\\s*)?(?:${CLASS})?`, "i");
const SCOP = new RegExp(`SCOP\\s*[:\\-–]?\\s*(\\d(?:[.,]\\d{1,2})?)\\s*(?:W\\/W\\s*)?(?:[-–]\\s*)?(?:${CLASS})?`, "i");

const energyClass = (raw: string | undefined) => (raw ? raw.replace(/\s/g, "") : undefined);

interface DescriptionSpecs {
  energy_class: string | null;
  seer: number | null;
  scop: number | null;
  noise_db_indoor: number | null;
  refrigerant: string | null;
  warranty_months: number | null;
  /** Lowest outdoor temperature the unit is rated to work at, e.g. -25. */
  min_outdoor_temp: number | null;
  wifi_included: boolean;
}

export function parseDescriptionSpecs(bullets: string[]): DescriptionSpecs {
  // Cyrillic "А" is used for energy classes ("А++"), normalize it for matching only.
  const text = bullets.join(" | ").replace(/А/g, "A");
  // Latin tokens (SEER, SCOP, dB, R32, °C) are often typed with Cyrillic
  // look-alikes ("ЅЕЕR", "Вtu"); match those on an all-Latin copy.
  const latin = toLatin(text);

  const seer = latin.match(SEER);
  const scop = latin.match(SCOP);
  const explicit = text.match(EXPLICIT_CLASS);
  let energy: string | null = null;
  if (explicit) {
    energy = [energyClass(explicit[1]), energyClass(explicit[2])].filter(Boolean).join(" / ");
  } else if (seer?.[2] || scop?.[2]) {
    energy = `${energyClass(seer?.[2]) ?? "-"} / ${energyClass(scop?.[2]) ?? "-"}`;
  }

  const noises = [...latin.matchAll(/(\d{2})\s*(?:d\s?B|дБ)/gi)]
    .map((m) => parseInt(m[1], 10))
    .filter((n) => n >= 10 && n <= 70);

  const refrigerant = latin.match(/\bR\s?-?\s?(32|290|410\s?A?)(?!\d)/i);
  const warranty = text.match(/гаранция\s*[:\-–]?\s*(\d{2,3})\s*месец/i);
  const temps = [...latin.matchAll(/-\s?(\d{2})\s*[°⁰º]?\s*C\b/gi)].map((m) => -parseInt(m[1], 10));

  return {
    energy_class: energy,
    seer: seer ? number(seer[1], 2, 15) : null,
    scop: scop ? number(scop[1], 2, 7) : null,
    noise_db_indoor: noises.length ? Math.min(...noises) : null,
    refrigerant: refrigerant ? `R-${refrigerant[1].replace(/\s/g, "").toUpperCase()}` : null,
    warranty_months: warranty ? parseInt(warranty[1], 10) : null,
    min_outdoor_temp: temps.length ? Math.min(...temps) : null,
    // "Wi-Fi модул (опция)" or "чрез WiFi адаптер" is not an included module.
    wifi_included: bullets.some(
      (b) => /wi\s*-?\s*fi/i.test(toLatin(b)) && !/опци/i.test(b) && (!/адапт/i.test(b) || /вграден/i.test(b))
    ),
  };
}

type FeatureGroups = Record<string, { name: string; items: { name: string; value: string }[] }>;

/** Specs in the Bittel feature shape, so SpecsTable, badges and translations work unchanged. */
function toFeatures(btu: number | null, specs: DescriptionSpecs): FeatureGroups {
  const items: { name: string; value: string }[] = [];
  if (btu) items.push({ name: "Мощност (BTU)", value: String(btu).replace(/\B(?=(\d{3})+(?!\d))/g, " ") });
  if (specs.energy_class) {
    items.push({ name: "Енергиен клас на охлаждане / отопление (умерена зона)", value: specs.energy_class });
  }
  if (specs.seer) items.push({ name: "SEER (сезонен коефициент на охлаждане)", value: String(specs.seer) });
  if (specs.scop) items.push({ name: "SCOP (сезонен коефициент на трансф. отопление)", value: String(specs.scop) });
  if (specs.refrigerant) items.push({ name: "Хладилен агент", value: specs.refrigerant });
  // The "cold climate" badge reads this row and always says -25 °C, so only
  // emit it when that claim holds.
  if (specs.min_outdoor_temp !== null && specs.min_outdoor_temp <= -25) {
    items.push({ name: "Работна температура на отопление", value: `до ${specs.min_outdoor_temp} °C` });
  }
  if (specs.wifi_included) items.push({ name: "Wi-Fi модул в комплекта", value: "да" });
  if (specs.warranty_months) items.push({ name: "Гаранция", value: `${specs.warranty_months} месеца` });
  return items.length ? { "1": { name: "Основни характеристики", items } } : {};
}

// ---------------------------------------------------------------------------
// Product mapping
// ---------------------------------------------------------------------------

export interface MappedProduct {
  bittel_id: string;
  category: CategoryCode;
  title: string;
  slug: string;
  manufacturer: string;
  description: string | null;
  price_client: number;
  gallery: string[];
  features: FeatureGroups;
  btu: number | null;
  energy_class: string | null;
  seer: number | null;
  scop: number | null;
  noise_db_indoor: number | null;
  refrigerant: string | null;
  warranty_months: number | null;
}

export type SkipReason = "out_of_scope" | "unmapped_category" | "no_price";

export type MapResult =
  | { ok: true; product: MappedProduct }
  | { ok: false; reason: SkipReason; categoryKey: string };

export function mapProduct(p: BulclimaProduct): MapResult {
  const title = normalizeScripts(p.title).replace(/\s+/g, " ").trim();
  const categoryKey = `${p.category}|${p.sub_category}`;
  const target = CATEGORY_MAP[categoryKey];
  if (!target) {
    return { ok: false, reason: OUT_OF_SCOPE_GROUPS.has(p.category) ? "out_of_scope" : "unmapped_category", categoryKey };
  }
  const category = typeof target === "function" ? target(title) : target;

  const price = parseFloat(p.price);
  if (!Number.isFinite(price) || price <= 0) return { ok: false, reason: "no_price", categoryKey };

  const manufacturer = normalizeManufacturer(p.manufacturer);
  const html = normalizeScripts(p.description || p.short_description);
  const bullets = toBullets(html);
  const specs = parseDescriptionSpecs(bullets);
  const btu = CATEGORIES_WITH_BTU.has(category)
    ? parseBtu(manufacturer, title, normalizeScripts(p.sku))
    : null;
  const description = bullets.join(" ").length >= 10 ? cleanHtml(html) : null;

  return {
    ok: true,
    product: {
      bittel_id: toSupplierId(p.id),
      category,
      title,
      slug: generateProductSlug(title.replace(/[/,]+/g, " ")),
      manufacturer,
      description,
      price_client: Math.round(price * 100) / 100,
      gallery: [...new Set(p.images)],
      features: toFeatures(btu, specs),
      btu,
      energy_class: specs.energy_class,
      seer: specs.seer,
      scop: specs.scop,
      noise_db_indoor: specs.noise_db_indoor,
      refrigerant: specs.refrigerant,
      warranty_months: specs.warranty_months,
    },
  };
}

/** Model codes in a title ("FTXJ42AS", "RXJ42A"), for cross-supplier duplicate checks. */
export function modelCodes(title: string): string[] {
  return (title.toUpperCase().match(/[A-Z0-9][A-Z0-9-]{4,}[A-Z0-9]/g) ?? [])
    .map((code) => code.replace(/-/g, ""))
    .filter((code) => code.length >= 6 && /\d/.test(code) && /[A-Z].*[A-Z]/.test(code));
}
