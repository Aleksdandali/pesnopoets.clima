import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../lib/supabase/admin";
import { calculateEstimate } from "../../../../../lib/estimates/calculate";
import type { EstimateParams } from "../../../../../lib/estimates/extract-params";

/** GET /api/tg/estimates/[id] — single estimate */
export const GET = withTgAuth(async (req) => {
  const id = req.url.split("/estimates/")[1]?.split("/")[0]?.split("?")[0];
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ estimate: data });
});

interface EquipmentLineInput {
  product_id?: number | null;
  manufacturer?: string;
  title?: string;
  btu?: number | null;
  qty?: number;
  unit_price_eur?: number;
}

interface LaborLineInput {
  preset_key?: string | null;
  title?: string;
  unit?: string;
  qty?: number;
  unit_price_eur?: number;
}

function normalizeEquipment(lines: unknown): Array<Required<Omit<EquipmentLineInput, "product_id" | "btu">> & { product_id: number | null; btu: number | null; total_eur: number }> {
  if (!Array.isArray(lines)) return [];
  return lines.map((raw) => {
    const l = raw as EquipmentLineInput;
    const qty = Math.max(1, Number(l.qty) || 1);
    const unit_price_eur = Math.max(0, Number(l.unit_price_eur) || 0);
    return {
      product_id: l.product_id ?? null,
      manufacturer: String(l.manufacturer ?? ""),
      title: String(l.title ?? ""),
      btu: l.btu == null ? null : Number(l.btu) || null,
      qty,
      unit_price_eur,
      total_eur: Math.round(qty * unit_price_eur * 100) / 100,
    };
  }).filter((l) => l.title.length > 0);
}

function normalizeLabor(lines: unknown): Array<Required<Omit<LaborLineInput, "preset_key">> & { preset_key: string | null; total_eur: number }> {
  if (!Array.isArray(lines)) return [];
  return lines.map((raw) => {
    const l = raw as LaborLineInput;
    const qty = Math.max(0, Number(l.qty) || 0);
    const unit_price_eur = Math.max(0, Number(l.unit_price_eur) || 0);
    return {
      preset_key: l.preset_key ?? null,
      title: String(l.title ?? ""),
      unit: String(l.unit ?? "бр."),
      qty,
      unit_price_eur,
      total_eur: Math.round(qty * unit_price_eur * 100) / 100,
    };
  }).filter((l) => l.title.length > 0 && l.qty > 0);
}

/** PATCH /api/tg/estimates/[id] — update estimate */
export const PATCH = withTgAuth(async (req) => {
  const id = req.url.split("/estimates/")[1]?.split("/")[0]?.split("?")[0];
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const supabase = createAdminClient();

  // If params changed, recalculate (legacy single-product flow)
  if (body.params) {
    const params = body.params as EstimateParams;
    const calc = calculateEstimate(params, body.selected_btu);

    const updateRow: Record<string, unknown> = {
      params,
      area_m2: params.area_m2,
      recommended_btu: calc.recommended_btu,
      selected_btu: body.selected_btu || calc.recommended_btu,
      base_install_bgn: calc.base_install_bgn,
      extra_pipe_m: calc.extra_pipe_m,
      extra_pipe_bgn: calc.extra_pipe_bgn,
      extras: calc.extras,
      total_install_bgn: calc.total_install_bgn,
      client_name: params.client_name,
      client_phone: params.client_phone,
      client_address: params.client_address,
      product_id: body.product_id ?? null,
      product_title: body.product_title ?? null,
      product_price_eur: body.product_price_eur ?? null,
      updated_at: new Date().toISOString(),
    };

    if (body.equipment_lines !== undefined) updateRow.equipment_lines = normalizeEquipment(body.equipment_lines);
    if (body.labor_lines !== undefined) updateRow.labor_lines = normalizeLabor(body.labor_lines);
    if (body.kp_number !== undefined) updateRow.kp_number = body.kp_number;
    if (body.valid_until !== undefined) updateRow.valid_until = body.valid_until;

    const { error } = await supabase
      .from("estimates")
      .update(updateRow)
      .eq("id", parseInt(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: updated } = await supabase
      .from("estimates")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    return NextResponse.json({ estimate: updated });
  }

  // Simple field update (status, client info, product, multi-line)
  const allowed = [
    "status", "client_name", "client_phone", "client_address",
    "product_id", "product_title", "product_price_eur", "selected_btu",
    "kp_number", "valid_until",
  ];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.equipment_lines !== undefined) updates.equipment_lines = normalizeEquipment(body.equipment_lines);
  if (body.labor_lines !== undefined) updates.labor_lines = normalizeLabor(body.labor_lines);

  const { error } = await supabase
    .from("estimates")
    .update(updates)
    .eq("id", parseInt(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: updated } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  return NextResponse.json({ estimate: updated });
});
