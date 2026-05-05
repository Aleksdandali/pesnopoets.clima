/**
 * Labor presets — single source of truth for the chip UI and the assistant prompt.
 * Defaults are taken from the owner's reference Daikin КП.
 */

export interface LaborPreset {
  key: string;
  title: string;       // shown to client in PDF / chip label
  unit: string;        // "бр." | "м" | "комплект"
  qty: number;         // sensible default
  unit_price_eur: number;
}

export const LABOR_PRESETS: LaborPreset[] = [
  { key: "channel",           title: "Шлиц до 4м",            unit: "м",        qty: 1, unit_price_eur: 12 },
  { key: "pipe_38_14",        title: "Тръбен път 3/8-1/4",    unit: "комплект", qty: 1, unit_price_eur: 60 },
  { key: "drilling",          title: "Пробиване отвор",       unit: "бр.",      qty: 1, unit_price_eur: 50 },
  { key: "construction",      title: "Конструкция",           unit: "бр.",      qty: 1, unit_price_eur: 30 },
  { key: "drainage",          title: "Отводняване",           unit: "м",        qty: 1, unit_price_eur: 5  },
  { key: "install",           title: "Монтаж",                unit: "бр.",      qty: 1, unit_price_eur: 190 },
  { key: "climber",           title: "Алпинист",              unit: "бр.",      qty: 1, unit_price_eur: 200 },
  { key: "drain_pump",        title: "Дренажна помпа",        unit: "бр.",      qty: 1, unit_price_eur: 120 },
  { key: "freon_charge",      title: "Зареждане с фрион",     unit: "бр.",      qty: 1, unit_price_eur: 30 },
];

export function findLaborPreset(key: string): LaborPreset | undefined {
  return LABOR_PRESETS.find((p) => p.key === key);
}
