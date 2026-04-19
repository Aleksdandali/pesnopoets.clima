/**
 * Installation pricing for Varna, Bulgaria.
 *
 * Source: average rates from splitservice.eu (2025), standard install includes
 * 3 m copper pipe, materials, commissioning — no chasing/hidden work.
 *
 * All amounts are in BGN. Owner will tune these later.
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
  { maxBtu: 14_000, price: 300, extraPipePerM: 60 },
  { maxBtu: 24_000, price: 370, extraPipePerM: 70 },
  { maxBtu: 33_000, price: 440, extraPipePerM: 80 },
];

/** Fallback when BTU is missing or out of range. */
export const INSTALLATION_FALLBACK: InstallationTier = {
  maxBtu: Infinity,
  price: 440,
  extraPipePerM: 80,
};

/** Extra services (BGN) — average Varna rates, 2025. */
export const EXTRA_SERVICES_BGN = {
  /** Chasing per metre (штробене / штробление). */
  chasingPerM: 15,
  /** Drill-through one wall (дупка в стена). */
  wallDrill: 40,
  /** Dismantle old unit. */
  dismantle: 80,
  /** Vacuum cleaning / vacuum pump for clean install. */
  vacuumService: 0, // included in base
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
