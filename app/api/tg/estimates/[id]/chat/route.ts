import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../../lib/supabase/admin";
import { chatWithAssistant, type ChatMessage } from "../../../../../../lib/estimates/assistant";
import { calculateEstimate } from "../../../../../../lib/estimates/calculate";
import type { EstimateParams } from "../../../../../../lib/estimates/extract-params";
import { transcribeAudio } from "../../../../../../lib/estimates/transcribe";

export const maxDuration = 60;

/** POST /api/tg/estimates/[id]/chat — send message to assistant */
export const POST = withTgAuth(async (req) => {
  const id = req.url.split("/estimates/")[1]?.split("/")[0];
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();

  // Get current estimate
  const { data: est, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !est) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Handle multipart (voice) or JSON (text)
  let userMessage: string;
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const textMsg = formData.get("text") as string | null;

    if (audioFile && audioFile.size > 100) {
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      userMessage = await transcribeAudio(buffer, audioFile.name || "voice.webm", "ru");
    } else if (textMsg) {
      userMessage = textMsg;
    } else {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }
  } else {
    const body = await req.json();
    userMessage = body.message;
    if (!userMessage) {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }
  }

  // Build message history
  let history: ChatMessage[] = (est.params as { chat_history?: ChatMessage[] })?.chat_history || [];

  // If empty history, prepend the greeting so Claude has context
  if (history.length === 0) {
    history = [{
      role: "assistant",
      content: "Опишите объект: площадь, этаж, тип здания, окна, куда наружный блок, длина трассы.",
      timestamp: new Date().toISOString(),
    }];
  }

  // Add user message
  history.push({
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  });

  // Chat with Claude
  const currentParams = (est.params as { extracted?: EstimateParams })?.extracted || null;
  const { reply, params } = await chatWithAssistant(history, currentParams);

  // Add assistant reply
  history.push({
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  });

  // Calculate if we have enough data
  let calculation = null;
  if (params?.area_m2 && params.area_m2 > 0) {
    calculation = calculateEstimate(params);
  }

  // Update estimate
  const updates: Record<string, unknown> = {
    params: { chat_history: history, extracted: params },
    transcript: history
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n---\n"),
    updated_at: new Date().toISOString(),
  };

  if (params) {
    updates.area_m2 = params.area_m2;
    updates.client_name = params.client_name;
    updates.client_phone = params.client_phone;
    updates.client_address = params.client_address;
  }

  if (calculation) {
    updates.recommended_btu = calculation.recommended_btu;
    updates.selected_btu = calculation.recommended_btu;
    updates.base_install_bgn = calculation.base_install_bgn;
    updates.extra_pipe_m = calculation.extra_pipe_m;
    updates.extra_pipe_bgn = calculation.extra_pipe_bgn;
    updates.extras = calculation.extras;
    updates.total_install_bgn = calculation.total_install_bgn;
  }

  // Search for matching products from catalog
  let matchedProducts: Array<{
    id: number;
    title: string;
    manufacturer: string;
    price: number;
    btu: number;
    gallery: string[] | null;
  }> = [];

  if (calculation && calculation.recommended_btu > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, title, manufacturer, price_client, price_override, price_promo, is_promo, btu, availability, gallery")
      .eq("is_active", true)
      .eq("is_hidden", false)
      .gte("btu", calculation.btu_min)
      .lte("btu", calculation.btu_max)
      .gt("stock_size", 0)
      .order("price_client", { ascending: true })
      .limit(3);

    if (products && products.length > 0) {
      const best = products[0];
      const effectivePrice = best.price_override ?? (best.is_promo && best.price_promo ? best.price_promo : best.price_client);
      updates.product_id = best.id;
      updates.product_title = best.title;
      updates.product_price_eur = Number(effectivePrice);

      matchedProducts = products.map((p) => {
        const price = p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client);
        return {
          id: p.id,
          title: p.title,
          manufacturer: p.manufacturer,
          price: Number(price),
          btu: p.btu,
          gallery: p.gallery,
        };
      });
    }
  }

  await supabase.from("estimates").update(updates).eq("id", parseInt(id));

  return NextResponse.json({
    reply,
    userMessage,
    params,
    calculation,
    matchedProducts,
    messageCount: history.length,
  });
});
