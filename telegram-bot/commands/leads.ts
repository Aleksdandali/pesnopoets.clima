import { Context } from "grammy";
import { getNewLeads, getLeadById, getNextLead } from "../services/leads";
import { formatLeadList, formatLeadCard } from "../services/format";
import { leadActionKeyboard } from "../callbacks/lead-actions";

export async function handleLeads(ctx: Context) {
  const leads = await getNewLeads(5);
  const text = formatLeadList(leads);

  const buttons = leads.map((l) => ([
    { text: `#${l.id} ${l.name.slice(0, 20)}`, callback_data: `lead:detail:${l.id}` },
  ]));

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
  });
}

export async function handleNext(ctx: Context) {
  const lead = await getNextLead();

  if (!lead) {
    await ctx.reply("✅ Все заявки обработаны! Нет ожидающих.");
    return;
  }

  await ctx.reply(formatLeadCard(lead), {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: leadActionKeyboard(lead.id, lead.phone) },
  });
}

export async function showLeadDetail(ctx: Context, leadId: number) {
  const lead = await getLeadById(leadId);
  if (!lead) {
    await ctx.answerCallbackQuery("Заявка не найдена");
    return;
  }

  await ctx.editMessageText(formatLeadCard(lead), {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: leadActionKeyboard(lead.id, lead.phone) },
  });
  await ctx.answerCallbackQuery();
}
