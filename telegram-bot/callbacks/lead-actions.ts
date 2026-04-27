import { Context } from "grammy";
import { updateLeadStatus, addLeadNote, getLeadById } from "../services/leads";
import { formatLeadCard } from "../services/format";
import type { InlineKeyboardButton } from "grammy/types";

/** Build action keyboard for a lead */
export function leadActionKeyboard(leadId: number, phone: string): InlineKeyboardButton[][] {
  return [
    [
      { text: "✅ Взял в работу", callback_data: `lead:status:${leadId}:contacted` },
      { text: "❌ Не актуально", callback_data: `lead:status:${leadId}:cancelled` },
    ],
    [
      { text: "📝 Заметка", callback_data: `lead:note:${leadId}` },
      { text: "✔️ Выполнено", callback_data: `lead:status:${leadId}:completed` },
    ],
  ];
}

// Pending notes stored in Supabase to survive serverless cold starts
import { getSupabase } from "../services/supabase";

async function setPendingNote(userId: number, leadId: number) {
  await getSupabase().from("telegram_bot_log").insert({
    telegram_user_id: userId,
    action: "pending_note",
    payload: { lead_id: leadId },
  });
}

async function getPendingNote(userId: number): Promise<number | null> {
  const { data } = await getSupabase()
    .from("telegram_bot_log")
    .select("payload")
    .eq("telegram_user_id", userId)
    .eq("action", "pending_note")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.payload as { lead_id?: number })?.lead_id ?? null;
}

async function clearPendingNote(userId: number) {
  await getSupabase()
    .from("telegram_bot_log")
    .delete()
    .eq("telegram_user_id", userId)
    .eq("action", "pending_note");
}

export async function handleLeadCallback(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  if (!data?.startsWith("lead:")) return;

  const parts = data.split(":");
  const action = parts[1]; // status, note, detail
  const leadId = parseInt(parts[2]);

  if (isNaN(leadId)) {
    await ctx.answerCallbackQuery("Ошибка");
    return;
  }

  if (action === "status") {
    const newStatus = parts[3];
    const ok = await updateLeadStatus(leadId, newStatus);

    if (ok) {
      const lead = await getLeadById(leadId);
      if (lead) {
        await ctx.editMessageText(formatLeadCard(lead), {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: leadActionKeyboard(lead.id, lead.phone) },
        });
      }
      const labels: Record<string, string> = {
        contacted: "📞 Взяли в работу",
        completed: "✅ Выполнено",
        cancelled: "❌ Отменено",
        new: "🆕 Возвращено в новые",
      };
      await ctx.answerCallbackQuery(labels[newStatus] || "Обновлено");
    } else {
      await ctx.answerCallbackQuery("Ошибка обновления");
    }
    return;
  }

  if (action === "note") {
    const userId = ctx.from?.id;
    if (userId) {
      await setPendingNote(userId, leadId);
      await ctx.answerCallbackQuery();
      await ctx.reply(`📝 Напишите заметку для заявки #${leadId}:`, {
        reply_markup: {
          inline_keyboard: [[{ text: "Отмена", callback_data: "note:cancel" }]],
        },
      });
    }
    return;
  }

  if (action === "detail") {
    const { showLeadDetail } = await import("../commands/leads");
    await showLeadDetail(ctx, leadId);
    return;
  }
}

export async function handleNoteText(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return false;

  const leadId = await getPendingNote(userId);
  if (!leadId) return false;

  const text = ctx.message?.text;
  if (!text) return false;

  await clearPendingNote(userId);
  const ok = await addLeadNote(leadId, text.slice(0, 500));

  if (ok) {
    await ctx.reply(`✅ Заметка сохранена для заявки #${leadId}`);
  } else {
    await ctx.reply("❌ Ошибка сохранения заметки");
  }

  return true;
}

export async function handleNoteCancel(ctx: Context) {
  const userId = ctx.from?.id;
  if (userId) await clearPendingNote(userId);
  await ctx.answerCallbackQuery("Отменено");
  await ctx.deleteMessage().catch(() => {});
}
