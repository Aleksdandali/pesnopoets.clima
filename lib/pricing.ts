/**
 * Installation pricing for Varna, Bulgaria.
 *
 * Source: vimax.bg (2025/2026) — standard install includes
 * 3 m copper pipe, materials, commissioning — no chasing/hidden work.
 *
 * All amounts are in BGN.
 */

export interface InstallationTier {
  /** Inclusive upper bound of BTU range. */
  maxBtu: number;
  /** Base price for standard install (3 m pipe) in BGN. */
  price: number;
  /** Extra pipe price per metre over 3 m, in BGN. */
  extraPipePerM: number;
}

/**
 * BTU-tiered base installation prices for Varna.
 * Tiers are checked in order; first whose `maxBtu` >= product BTU wins.
 */
export const INSTALLATION_TIERS: InstallationTier[] = [
  { maxBtu: 14_000, price: 372, extraPipePerM: 59 },
  { maxBtu: 24_000, price: 450, extraPipePerM: 69 },
];

/** Fallback when BTU is missing or out of range. */
export const INSTALLATION_FALLBACK: InstallationTier = {
  maxBtu: Infinity,
  price: 450,
  extraPipePerM: 69,
};

/** Extra services (BGN) — vimax.bg rates, 2025/2026. */
export const EXTRA_SERVICES_BGN = {
  /** Dismantle/reinstall up to 14K BTU. */
  dismantleSmall: 63,
  /** Dismantle/reinstall 15–24K BTU. */
  dismantleLarge: 117,
  /** Diagnostic fee. */
  diagnostic: 40,
  /** On-site inspection (приспада се от поръчката). */
  inspection: 49,
  /** Service call-out without valid reason. */
  calloutFee: 49,
  /** Vacuum cleaning / vacuum pump for clean install. */
  vacuumService: 0, // included in base
} as const;

/** Preventive maintenance prices (BGN) — vimax.bg rates, 2025/2026. */
export const PROFILAKTIKA_BGN = {
  /** One-time maintenance. */
  single: 82,
  /** Full annual service at service center. */
  fullService: 160,
  /** 3-year subscription 7–14K BTU. */
  subscription3y_small: 223,
  /** 3-year subscription 15–24K BTU. */
  subscription3y_large: 239,
  /** Turbine cleaning (from–to). */
  turbineCleanMin: 49,
  turbineCleanMax: 117,
  /** Outdoor unit cleaning. */
  outdoorUnitClean: 59,
} as const;

export function getInstallationTier(btu: number | null | undefined): InstallationTier {
  if (!btu || btu <= 0) return INSTALLATION_FALLBACK;
  for (const tier of INSTALLATION_TIERS) {
    if (btu <= tier.maxBtu) return tier;
  }
  return INSTALLATION_FALLBACK;
}

/** Base installation price in BGN for the given BTU. */
export function getBaseInstallationBgn(btu: number | null | undefined): number {
  return getInstallationTier(btu).price;
}

/** Approx EUR → BGN rate (fixed peg). Mirrors ProductCard constant. */
export const EUR_TO_BGN = 1.95583;

/** Convert BGN → EUR using the fixed peg. */
export function bgnToEur(bgn: number): number {
  return bgn / EUR_TO_BGN;
}
