/**
 * B2B annual maintenance contract pricing for Varna, Bulgaria.
 *
 * Hybrid model: base price per indoor unit per year × 3 tiers
 * (Basic / Standard / Pro).
 *
 * EUR is the source of truth here because anchor prices were chosen on
 * round EUR values (149/259/379 etc.) for B2B psychological anchoring.
 * BGN is derived via the fixed peg in `pricing.ts`.
 */

import { EUR_TO_BGN } from "./pricing";

export type B2BTier = "basic" | "standard" | "pro";

export type B2BUnitCategory =
  | "wall_small" //  7–14k BTU (split до 14k)
  | "wall_mid" //   16–22k BTU
  | "wall_large" // 24k+ BTU
  | "cassette" //   касетъчен / канален / колонен
  | "semi_industrial"; // 48–60k BTU / VRF indoor / полупром

export interface B2BTierMatrix {
  tier: B2BTier;
  prices: Record<B2BUnitCategory, number>; // EUR / indoor unit / year, VAT incl.
}

export const B2B_PRICING_EUR: B2BTierMatrix[] = [
  {
    tier: "basic",
    prices: {
      wall_small: 149,
      wall_mid: 169,
      wall_large: 189,
      cassette: 219,
      semi_industrial: 249,
    },
  },
  {
    tier: "standard",
    prices: {
      wall_small: 259,
      wall_mid: 289,
      wall_large: 319,
      cassette: 359,
      semi_industrial: 419,
    },
  },
  {
    tier: "pro",
    prices: {
      wall_small: 379,
      wall_mid: 439,
      wall_large: 479,
      cassette: 539,
      semi_industrial: 619,
    },
  },
];

export function getB2BPriceEur(
  tier: B2BTier,
  category: B2BUnitCategory
): number {
  const t = B2B_PRICING_EUR.find((x) => x.tier === tier);
  return t ? t.prices[category] : 0;
}

export function getB2BPriceBgn(
  tier: B2BTier,
  category: B2BUnitCategory
): number {
  return getB2BPriceEur(tier, category) * EUR_TO_BGN;
}

/**
 * Volume discount applied on annual contract value.
 * 5+ indoor units = 5%, 10+ = 10%, 20+ = quoted individually (return 0 → handled in UI).
 */
export function getVolumeDiscount(units: number): number {
  if (units >= 20) return 0; // bespoke quote
  if (units >= 10) return 0.10;
  if (units >= 5) return 0.05;
  return 0;
}

/** Annual prepay discount (one-time, applied on total). */
export const ANNUAL_PREPAY_DISCOUNT = 0.05;

/** Minimum number of indoor units to qualify for a B2B contract. */
export const B2B_MIN_UNITS = 3;

/** Paid on-site survey fee, refundable on signed contract within 14 days. */
export const B2B_SURVEY_FEE_EUR = 30;
