import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../../lib/supabase/admin";
import { renderToBuffer } from "@react-pdf/renderer";
import { EstimatePDF, type EquipmentLine, type LaborLine } from "../../../../../../lib/estimates/pdf-template";
import { calculateEstimate } from "../../../../../../lib/estimates/calculate";
import type { EstimateParams } from "../../../../../../lib/estimates/extract-params";

export const maxDuration = 30;

/** GET /api/tg/estimates/[id]/pdf — generate and return PDF */
export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const id = req.url.split("/estimates/")[1]?.split("/")[0];
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const language = (url.searchParams.get("lang") || "bg") as "bg" | "en" | "ru" | "ua";

  const supabase = createAdminClient();
  const { data: est, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !est) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Recalculate to get btu_notes
  const rawParams = est.params as { extracted?: EstimateParams } | EstimateParams;
  const params = ("extracted" in rawParams && rawParams.extracted) ? rawParams.extracted : rawParams as EstimateParams;
  const calc = calculateEstimate(params, est.selected_btu);

  const element = EstimatePDF({
    id: est.id,
    date: est.created_at,
    clientName: est.client_name,
    clientPhone: est.client_phone,
    clientAddress: est.client_address,
    area_m2: est.area_m2,
    recommendedBtu: est.selected_btu || est.recommended_btu || calc.recommended_btu,
    btuNotes: calc.btu_notes,
    baseInstallBgn: est.base_install_bgn,
    extraPipeM: est.extra_pipe_m || 0,
    extraPipeBgn: est.extra_pipe_bgn || 0,
    extras: (est.extras as Array<{ name: string; price_bgn: number }>) || [],
    totalInstallBgn: est.total_install_bgn,
    productTitle: est.product_title,
    productPriceEur: est.product_price_eur,
    equipmentLines: (est.equipment_lines as EquipmentLine[] | null) ?? [],
    laborLines: (est.labor_lines as LaborLine[] | null) ?? [],
    kpNumber: est.kp_number ?? null,
    validUntil: est.valid_until ?? null,
    language,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(element as any);
  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="KP-${est.id}.pdf"`,
    },
  });
});
