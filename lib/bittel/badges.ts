/**
 * Product badge generator.
 * Computes an array of Badge objects from product data at render time.
 * No database migration needed — purely computed from existing fields.
 */

export type BadgeType =
  | "energy"
  | "silent"
  | "wifi"
  | "inverter"
  | "eco"
  | "area"
  | "btu"
  | "promo"
  | "low_stock";

export interface Badge {
  type: BadgeType;
  label: string;
  /** Tailwind class string for the pill */
  color: string;
  /** Priority — lower number = more important (shown first) */
  priority: number;
}

/**
 * Minimal product shape required for badge generation.
 * Works with both the catalog card product and the full detail page product.
 */
export interface BadgeableProduct {
  title: string;
  is_promo: boolean;
  energy_class?: string | null;
  noise_db_indoor?: number | null;
  refrigerant?: string | null;
  area_m2?: number | null;
  btu?: number | null;
  stock_size?: number | null;
  availability?: string;
  features?: Record<string, { name: string; items: { name: string; value: string }[] }>;
}

// ---------------------------------------------------------------------------
// Localized badge labels
// ---------------------------------------------------------------------------

type Locale = "bg" | "en" | "ru" | "ua";

const badgeLabels: Record<string, Record<Locale, string>> = {
  silent: { bg: "Безшумен", en: "Silent", ru: "Бесшумный", ua: "Безшумний" },
  wifi: { bg: "WiFi", en: "WiFi", ru: "WiFi", ua: "WiFi" },
  inverter: { bg: "Инвертор", en: "Inverter", ru: "Инвертор", ua: "Інвертор" },
  eco: { bg: "R-32", en: "R-32", ru: "R-32", ua: "R-32" },
  promo: { bg: "Промо", en: "Promo", ru: "Акция", ua: "Акція" },
  lastItems: { bg: "Последни", en: "Last", ru: "Последние", ua: "Останні" },
  upTo: { bg: "до", en: "up to", ru: "до", ua: "до" },
  sqm: { bg: "кв.м", en: "sq.m", ru: "кв.м", ua: "кв.м" },
  pcs: { bg: "бр.", en: "pcs", ru: "шт.", ua: "шт." },
};

function t(key: string, locale: Locale): string {
  return badgeLabels[key]?.[locale] ?? badgeLabels[key]?.bg ?? key;
}

// ---------------------------------------------------------------------------
// Badge color map (light-theme friendly pill styles)
// ---------------------------------------------------------------------------

const badgeColors: Record<BadgeType, string> = {
  energy: "bg-emerald-50 text-emerald-600",
  silent: "bg-slate-100 text-slate-500",
  wifi: "bg-blue-50 text-blue-500",
  inverter: "bg-cyan-50 text-cyan-600",
  eco: "bg-green-50 text-green-500",
  area: "bg-slate-50 text-slate-500",
  btu: "bg-slate-50 text-slate-500",
  promo: "bg-red-500 text-white",
  low_stock: "bg-amber-50 text-amber-600",
};

// ---------------------------------------------------------------------------
// Feature scanning helpers
// ---------------------------------------------------------------------------

function hasWiFiFeature(product: BadgeableProduct): boolean {
  // Check title
  const titleLower = product.title.toLowerCase();
  if (titleLower.includes("wi-fi") || titleLower.includes("wifi")) return true;

  // Check features map
  if (product.features) {
    for (const group of Object.values(product.features)) {
      for (const item of group.items) {
        const val = `${item.name} ${item.value}`.toLowerCase();
        if (val.includes("wi-fi") || val.includes("wifi")) return true;
      }
    }
  }

  return false;
}

function isInverter(product: BadgeableProduct): boolean {
  const titleLower = product.title.toLowerCase();
  return titleLower.includes("инверторен") || titleLower.includes("inverter");
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate product badges.
 * @param product  The product data (from DB or API).
 * @param locale   Current locale (bg/en/ru/ua). Defaults to "bg".
 * @param maxBadges Maximum badges to return. Defaults to 4.
 * @returns Array of Badge objects, sorted by priority, capped at maxBadges.
 */
export function generateBadges(
  product: BadgeableProduct,
  locale: string = "bg",
  maxBadges: number = 4
): Badge[] {
  const loc = (["bg", "en", "ru", "ua"].includes(locale) ? locale : "bg") as Locale;
  const badges: Badge[] = [];

  // --- Dynamic / status badges (highest priority) ---

  // Promo
  if (product.is_promo) {
    badges.push({
      type: "promo",
      label: t("promo", loc),
      color: badgeColors.promo,
      priority: 1,
    });
  }

  // Low stock
  if (
    product.stock_size !== null &&
    product.stock_size !== undefined &&
    product.stock_size > 0 &&
    product.stock_size <= 5
  ) {
    badges.push({
      type: "low_stock",
      label: `${t("lastItems", loc)} ${product.stock_size} ${t("pcs", loc)}`,
      color: badgeColors.low_stock,
      priority: 2,
    });
  }

  // --- Automatic badges (from product features/specs) ---

  // Energy class
  if (product.energy_class) {
    const raw = product.energy_class.split("/")[0]?.trim().toUpperCase().replace(/\s/g, "") || "";
    if (raw.includes("A+++")) {
      badges.push({
        type: "energy",
        label: "A+++",
        color: "bg-emerald-50 text-emerald-700",
        priority: 3,
      });
    } else if (raw.includes("A++")) {
      badges.push({
        type: "energy",
        label: "A++",
        color: "bg-emerald-50 text-emerald-600",
        priority: 4,
      });
    }
  }

  // Inverter
  if (isInverter(product)) {
    badges.push({
      type: "inverter",
      label: t("inverter", loc),
      color: badgeColors.inverter,
      priority: 5,
    });
  }

  // WiFi
  if (hasWiFiFeature(product)) {
    badges.push({
      type: "wifi",
      label: t("wifi", loc),
      color: badgeColors.wifi,
      priority: 6,
    });
  }

  // Eco refrigerant R-32
  if (product.refrigerant?.trim() === "R-32") {
    badges.push({
      type: "eco",
      label: t("eco", loc),
      color: badgeColors.eco,
      priority: 7,
    });
  }

  // Silent (noise <= 22 dB)
  if (product.noise_db_indoor !== null && product.noise_db_indoor !== undefined && product.noise_db_indoor <= 22) {
    badges.push({
      type: "silent",
      label: t("silent", loc),
      color: badgeColors.silent,
      priority: 8,
    });
  }

  // Large area (>= 40 sq.m)
  if (product.area_m2 !== null && product.area_m2 !== undefined && product.area_m2 >= 40) {
    badges.push({
      type: "area",
      label: `${t("upTo", loc)} ${product.area_m2} ${t("sqm", loc)}`,
      color: badgeColors.area,
      priority: 9,
    });
  }

  // High BTU (>= 24000)
  if (product.btu !== null && product.btu !== undefined && product.btu >= 24000) {
    badges.push({
      type: "btu",
      label: `${(product.btu / 1000).toFixed(0)}K BTU`,
      color: badgeColors.btu,
      priority: 10,
    });
  }

  // Sort by priority and cap at maxBadges
  badges.sort((a, b) => a.priority - b.priority);
  return badges.slice(0, maxBadges);
}
