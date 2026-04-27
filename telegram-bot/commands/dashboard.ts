import { Context } from "grammy";
import { getDashboardKPIs } from "../services/leads";
import { formatDashboard } from "../services/format";

export async function handleDashboard(ctx: Context) {
  const kpi = await getDashboardKPIs();

  const buttons = [];
  if (kpi.leadsNew > 0) {
    buttons.push([{ text: `🆕 Новые (${kpi.leadsNew})`, callback_data: "cmd:leads" }]);
  }
  if (kpi.leadsOverdue > 0) {
    buttons.push([{ text: `⚠️ Ждут >1ч (${kpi.leadsOverdue})`, callback_data: "cmd:next" }]);
  }

  await ctx.reply(formatDashboard(kpi), {
    parse_mode: "HTML",
    reply_markup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
  });
}
