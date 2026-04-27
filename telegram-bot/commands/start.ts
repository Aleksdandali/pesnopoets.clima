import { Context } from "grammy";
import { isTeamMember } from "../services/auth";

export async function handleStart(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId || !(await isTeamMember(userId))) {
    await ctx.reply("⛔ Этот бот доступен только для команды Pesnopoets Clima.");
    return;
  }

  await ctx.reply(
    "👋 <b>Добро пожаловать в DANGROW Clima Bot!</b>\n\n" +
    "Команды:\n" +
    "/dashboard — Сводка\n" +
    "/leads — Новые заявки\n" +
    "/next — Следующий клиент\n" +
    "/help — Справка",
    { parse_mode: "HTML" }
  );
}
