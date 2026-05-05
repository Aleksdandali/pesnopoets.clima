/**
 * Calculate BTU recommendation + installation price from extracted params.
 * Reuses existing pricing.ts and knowledge.ts logic.
 */
import { recommendBTU } from "../consultant/knowledge";
import {
  getInstallationTier,
  EXTRA_SERVICES_BGN,
  EUR_TO_BGN,
  type InstallationTier,
} from "../pricing";
import type { EstimateParams } from "./extract-params";

export interface ExtraItem {
  name: string;
  price_bgn: number;
}

export interface EstimateCalculation {
  // BTU
  recommended_btu: number;
  btu_min: number;
  btu_max: number;
  btu_notes: string[];

  // Installation pricing
  tier: InstallationTier;
  base_install_bgn: number;
  extra_pipe_m: number;
  extra_pipe_bgn: number;
  extras: ExtraItem[];
  total_install_bgn: number;
  total_install_eur: number;
}

/** Additional service prices not in pricing.ts */
const EXTRA_PRICES: Record<string, number> = {
  climber: 200,           // Алпинист — средняя цена
  concrete_drilling: 50,  // Пробивка бетон
  drain_pump: 120,        // Помпа за кондензат
  channel_per_m: 12,      // Декоративен канал на метър
  electrical_line: 120,   // Нова ел. линия
};

export function calculateEstimate(params: EstimateParams, overrideBtu?: number): EstimateCalculation {
  // 1. BTU recommendation
  const btuResult = params.area_m2
    ? recommendBTU({
        area_m2: params.area_m2,
        orientation: params.orientation !== "unknown" ? params.orientation : undefined,
        top_floor: params.top_floor,
        insulation: params.insulation,
        occupants: params.occupants ?? undefined,
        heat_sources: params.heat_sources,
        ceiling_height_m: params.ceiling_height_m ?? undefined,
      })
    : { min: 12000, recommended: 12000, max: 18000, notes: ["Площадь не указана — используется 12K BTU по умолчанию"] };

  const selectedBtu = overrideBtu || btuResult.recommended;

  // 2. Installation tier
  const tier = getInstallationTier(selectedBtu);
  const baseInstall = tier.price;

  // 3. Extra pipe
  const pipeLength = params.pipe_length_m || 3;
  const extraPipeM = Math.max(0, pipeLength - 3);
  const extraPipeBgn = extraPipeM * tier.extraPipePerM;

  // 4. Extras
  const extras: ExtraItem[] = [];

  if (params.dismantle_old) {
    const oldBtu = params.old_unit_btu || selectedBtu;
    const dismantlePrice = oldBtu <= 14000
      ? EXTRA_SERVICES_BGN.dismantleSmall
      : EXTRA_SERVICES_BGN.dismantleLarge;
    extras.push({ name: "Демонтаж старого", price_bgn: dismantlePrice });
  }

  if (params.needs_climber) {
    extras.push({ name: "Алпинист", price_bgn: EXTRA_PRICES.climber });
  }

  if (params.concrete_drilling) {
    extras.push({ name: "Пробивка бетон", price_bgn: EXTRA_PRICES.concrete_drilling });
  }

  if (params.needs_drain_pump) {
    extras.push({ name: "Помпа за кондензат", price_bgn: EXTRA_PRICES.drain_pump });
  }

  if (params.decorative_channel) {
    const channelM = params.channel_length_m || pipeLength;
    extras.push({ name: `Декоративен канал (${channelM}м)`, price_bgn: channelM * EXTRA_PRICES.channel_per_m });
  }

  if (params.electrical_ready === false) {
    extras.push({ name: "Нова ел. линия", price_bgn: EXTRA_PRICES.electrical_line });
  }

  // 5. Total
  const extrasTotal = extras.reduce((sum, e) => sum + e.price_bgn, 0);
  const totalBgn = baseInstall + extraPipeBgn + extrasTotal;

  return {
    recommended_btu: btuResult.recommended,
    btu_min: btuResult.min,
    btu_max: btuResult.max,
    btu_notes: btuResult.notes,
    tier,
    base_install_bgn: baseInstall,
    extra_pipe_m: extraPipeM,
    extra_pipe_bgn: extraPipeBgn,
    extras,
    total_install_bgn: totalBgn,
    total_install_eur: Math.round((totalBgn / EUR_TO_BGN) * 100) / 100,
  };
}
