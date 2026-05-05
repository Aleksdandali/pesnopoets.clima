import { Context } from "grammy";
import { transcribeAudio, downloadTelegramFile } from "../../lib/estimates/transcribe";
import { extractParams } from "../../lib/estimates/extract-params";
import { calculateEstimate } from "../../lib/estimates/calculate";
import { getSupabase } from "../services/supabase";

export async function handleEstimateCommand(ctx: Context) {
  await ctx.reply(
    "🎙 <b>Новый просчёт</b>\n\n" +
    "Отправьте голосовое сообщение с описанием объекта:\n\n" +
    "Пример: <i>«Квартира 45 квадратов, панелка, 5-й этаж последний, окна на юг, " +
    "большие окна, без утепления, трасса метров 5, наружный на балкон, " +
    "старый кондиционер демонтировать»</i>\n\n" +
    "Или нажмите кнопку ниже для просчёта в Mini App.",
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 Открыть Mini App", web_app: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/tg/estimates/new` } }],
        ],
      },
    }
  );
}

export async function handleVoiceMessage(ctx: Context) {
  const voice = ctx.message?.voice;
  if (!voice) return false;

  const processingMsg = await ctx.reply("⏳ Обрабатываю запись...");

  try {
    // 1. Download voice file from Telegram
    const audioBuffer = await downloadTelegramFile(voice.file_id);

    // 2. Transcribe via Groq (Whisper)
    await ctx.api.editMessageText(
      ctx.chat!.id,
      processingMsg.message_id,
      "🎙 Распознаю речь..."
    );
    const transcript = await transcribeAudio(audioBuffer, "voice.ogg", "ru");

    if (!transcript || transcript.length < 5) {
      await ctx.api.editMessageText(
        ctx.chat!.id,
        processingMsg.message_id,
        "❌ Не удалось распознать речь. Попробуйте ещё раз, говорите чётче."
      );
      return true;
    }

    // 3. Extract params via Claude
    await ctx.api.editMessageText(
      ctx.chat!.id,
      processingMsg.message_id,
      "🤖 Анализирую параметры..."
    );
    const params = await extractParams(transcript);

    // 4. Calculate
    const calc = calculateEstimate(params);

    // 5. Save to DB
    const { data: estimate } = await getSupabase()
      .from("estimates")
      .insert({
        created_by_tg_id: ctx.from!.id,
        transcript,
        params,
        area_m2: params.area_m2,
        recommended_btu: calc.recommended_btu,
        selected_btu: calc.recommended_btu,
        base_install_bgn: calc.base_install_bgn,
        extra_pipe_m: calc.extra_pipe_m,
        extra_pipe_bgn: calc.extra_pipe_bgn,
        extras: calc.extras,
        total_install_bgn: calc.total_install_bgn,
        client_name: params.client_name,
        client_phone: params.client_phone,
        client_address: params.client_address,
        status: "draft",
      })
      .select("id")
      .single();

    // 6. Format response
    let text = `✅ <b>ПРОСЧЁТ #${estimate?.id || "?"}</b>\n\n`;

    // Transcript
    text += `🎙 <i>${transcript.slice(0, 200)}${transcript.length > 200 ? "..." : ""}</i>\n\n`;

    // Room
    if (params.area_m2) {
      text += `📐 Площадь: <b>${params.area_m2} м²</b>\n`;
    }
    if (params.floor) {
      text += `🏢 Этаж: <b>${params.floor}${params.top_floor ? " (последний)" : ""}</b>\n`;
    }
    if (params.orientation !== "unknown") {
      const orientLabel: Record<string, string> = { north: "север", south: "юг", east: "восток", west: "запад" };
      text += `🧭 Окна: <b>${orientLabel[params.orientation]}</b>\n`;
    }
    if (params.insulation !== "average") {
      text += `🧱 Изоляция: <b>${params.insulation === "poor" ? "плохая" : "хорошая"}</b>\n`;
    }
    if (params.large_windows) text += `🪟 Большие окна\n`;

    text += `\n⚡ Рекомендация: <b>${calc.recommended_btu.toLocaleString()} BTU</b>\n`;
    calc.btu_notes.forEach((n) => { text += `  • ${n}\n`; });

    // Pricing
    text += `\n💰 <b>МОНТАЖ:</b>\n`;
    text += `  База (${calc.recommended_btu <= 14000 ? "≤14K" : "≤24K"} BTU): <b>${calc.base_install_bgn} лв</b>\n`;
    if (calc.extra_pipe_m > 0) {
      text += `  Доп. труба ${calc.extra_pipe_m}м: <b>${calc.extra_pipe_bgn} лв</b>\n`;
    }
    for (const extra of calc.extras) {
      text += `  ${extra.name}: <b>${extra.price_bgn} лв</b>\n`;
    }
    text += `\n  <b>ИТОГО: ${calc.total_install_bgn} лв (${calc.total_install_eur.toFixed(0)} €)</b>`;

    if (params.confidence !== "high") {
      text += `\n\n⚠️ Точность: ${params.confidence === "medium" ? "средняя" : "низкая"} — проверьте данные`;
    }

    // Delete processing message and send result
    await ctx.api.deleteMessage(ctx.chat!.id, processingMsg.message_id).catch(() => {});

    const buttons = [];
    if (estimate?.id) {
      buttons.push([
        { text: "📱 Открыть в Mini App", web_app: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/tg/estimates/${estimate.id}` } },
      ]);
    }
    buttons.push([
      { text: "🎙 Ещё один просчёт", callback_data: "cmd:estimate" },
    ]);

    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });

    return true;
  } catch (err) {
    console.error("Estimate voice error:", err);
    await ctx.api.editMessageText(
      ctx.chat!.id,
      processingMsg.message_id,
      "❌ Ошибка обработки. Попробуйте ещё раз."
    ).catch(() => {});
    return true;
  }
}
