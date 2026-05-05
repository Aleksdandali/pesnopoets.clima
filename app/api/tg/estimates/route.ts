import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../lib/supabase/admin";

/** GET /api/tg/estimates — list estimates */
export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const status = url.searchParams.get("status") || "all";
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("estimates")
    .select("id, client_name, client_phone, area_m2, recommended_btu, selected_btu, total_install_bgn, product_title, product_price_eur, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ estimates: data ?? [], total: count ?? 0 });
});

/** POST /api/tg/estimates — create estimate from transcript */
export const POST = withTgAuth(async (req, session) => {
  const body = await req.json();
  const { transcript, params, calculation } = body;

  if (transcript === undefined || transcript === null || !params || !calculation) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Mint KP number via RPC. Falls back to null if the function is missing on older DB.
  let kpNumber: string | null = null;
  try {
    const { data: nextNum } = await supabase.rpc("next_kp_number");
    if (typeof nextNum === "string") kpNumber = nextNum;
  } catch { /* leave null on older DB */ }

  const validUntil = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("estimates")
    .insert({
      created_by_tg_id: session.tgId,
      transcript,
      params,
      area_m2: params.area_m2,
      recommended_btu: calculation.recommended_btu,
      selected_btu: calculation.recommended_btu,
      base_install_bgn: calculation.base_install_bgn,
      extra_pipe_m: calculation.extra_pipe_m,
      extra_pipe_bgn: calculation.extra_pipe_bgn,
      extras: calculation.extras,
      total_install_bgn: calculation.total_install_bgn,
      client_name: params.client_name,
      client_phone: params.client_phone,
      client_address: params.client_address,
      kp_number: kpNumber,
      valid_until: validUntil,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
});
