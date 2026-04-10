import type { BittelProduct, BittelFeatureGroup } from "./types";

// Cyrillic → Latin transliteration map
const translitMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sht", ъ: "a", ь: "", ю: "yu", я: "ya",
  // Bulgarian specific
  є: "ye", і: "i", ї: "yi", ґ: "g",
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("");
}

function toSlug(text: string): string {
  return transliterate(text)
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, "") // trim hyphens
    .slice(0, 200);
}

// Generic prefixes to strip from product titles for cleaner slugs
const genericPrefixes = [
  "инверторен климатик",
  "климатик",
  "инверторна мултисплит система",
  "мултисплит система",
  "подов климатик",
  "мобилен климатик",
  "касетъчен климатик",
  "канален климатик",
  "таванен климатик",
  "колонен климатик",
  "рекуператор",
  "въздухопречиствател",
  "бойлер",
  "буфер",
  "вентилатор",
];

export function generateProductSlug(title: string): string {
  let cleaned = title.toLowerCase().trim();

  // Remove generic prefixes
  for (const prefix of genericPrefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
      break;
    }
  }

  // Remove "+" between model numbers, replace with "-"
  cleaned = cleaned.replace(/\s*\+\s*/g, "-");

  return toSlug(cleaned) || toSlug(title);
}

export function generateCategorySlug(
  groupDescription: string,
  subgroupDescription: string
): string {
  const group = toSlug(groupDescription);
  const subgroup = toSlug(subgroupDescription);
  return `${group}/${subgroup}`;
}

/**
 * Find a feature value by name across all feature groups
 */
function findFeatureValue(
  features: Record<string, BittelFeatureGroup>,
  featureName: string
): string | null {
  for (const group of Object.values(features)) {
    for (const item of group.items) {
      if (item.name.toLowerCase().includes(featureName.toLowerCase())) {
        return item.value.trim();
      }
    }
  }
  return null;
}

/**
 * Parse a number from a string like " 9 000" → 9000 or "19 кв. м" → 19
 */
function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Parse the lowest noise level from a string like "43 / 37 / 30 / 21 dB (A)"
 */
function parseMinNoise(value: string | null): number | null {
  if (!value) return null;
  const numbers = value.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  const nums = numbers.map(Number).filter((n) => n > 0 && n < 100);
  return nums.length > 0 ? Math.min(...nums) : null;
}

export interface ParsedSpecs {
  btu: number | null;
  energy_class: string | null;
  area_m2: number | null;
  noise_db_indoor: number | null;
  refrigerant: string | null;
  warranty_months: number | null;
  seer: number | null;
  scop: number | null;
}

export function parseFeatures(
  features: Record<string, BittelFeatureGroup>
): ParsedSpecs {
  const btuRaw = findFeatureValue(features, "Мощност (BTU)");
  const energyRaw = findFeatureValue(features, "Енергиен клас");
  const areaRaw = findFeatureValue(features, "Подходящ за помещения до");
  const refrigerantRaw = findFeatureValue(features, "Хладилен агент");
  const warrantyRaw = findFeatureValue(features, "Гаранция");
  const seerRaw = findFeatureValue(features, "SEER");
  const scopRaw = findFeatureValue(features, "SCOP");

  // Find indoor noise — look in "Вътрешно тяло" group
  let noiseRaw: string | null = null;
  for (const group of Object.values(features)) {
    if (group.name.includes("Вътрешно")) {
      for (const item of group.items) {
        if (item.name.includes("Ниво на шум") && item.name.includes("охлаждане")) {
          noiseRaw = item.value;
          break;
        }
      }
    }
  }

  return {
    btu: btuRaw ? parseNumber(btuRaw.replace(/\s/g, "")) : null,
    energy_class: energyRaw || null,
    area_m2: areaRaw ? parseNumber(areaRaw) : null,
    noise_db_indoor: parseMinNoise(noiseRaw),
    refrigerant: refrigerantRaw || null,
    warranty_months: warrantyRaw ? parseNumber(warrantyRaw) : null,
    seer: seerRaw ? parseNumber(seerRaw) : null,
    scop: scopRaw ? parseNumber(scopRaw) : null,
  };
}

export function mapAvailability(raw: string): string {
  const map: Record<string, string> = {
    Наличен: "Наличен",
    "Ограничена наличност": "Ограничена наличност",
    Неналичен: "Неналичен",
  };
  return map[raw] || "Неналичен";
}
