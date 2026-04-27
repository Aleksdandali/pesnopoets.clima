import { Bot } from "grammy";
import { isTeamMember } from "./services/auth";
import { handleStart } from "./commands/start";
import { handleDashboard } from "./commands/dashboard";
import { handleLeads, handleNext } from "./commands/leads";
import { handleLeadCallback, handleNoteText, handleNoteCancel } from "./callbacks/lead-actions";

let botInstance: Bot | null = null;

export function createBot(): Bot {
  if (botInstance) return botInstance;

  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set — bot disabled");
    const dummy = new Bot("placeholder:token");
    botInstance = dummy;
    return dummy;
  }

  const bot = new Bot(token);

  // Auth middleware — reject non-team members
  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    if (!(await isTeamMember(userId))) {
      if (ctx.message) {
        await ctx.reply("⛔ Этот бот доступен только для команды.");
      }
      return;
    }
    await next();
  });

  // Commands
  bot.command("start", handleStart);
  bot.command("dashboard", handleDashboard);
  bot.command("d", handleDashboard);
  bot.command("leads", handleLeads);
  bot.command("next", handleNext);
  bot.command("n", handleNext);
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "📋 <b>Команды:</b>\n\n" +
      "/dashboard (или /d) — Сводка KPI\n" +
      "/leads — Список новых заявок\n" +
      "/next (или /n) — Следующий клиент\n" +
      "/help — Эта справка",
      { parse_mode: "HTML" }
    );
  });

  // Callback queries (inline buttons)
  bot.callbackQuery(/^lead:/, handleLeadCallback);
  bot.callbackQuery("note:cancel", handleNoteCancel);
  bot.callbackQuery(/^cmd:leads$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleLeads(ctx);
  });
  bot.callbackQuery(/^cmd:next$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleNext(ctx);
  });

  // Text messages — check if user is adding a note
  bot.on("message:text", async (ctx, next) => {
    const handled = await handleNoteText(ctx);
    if (!handled) await next();
  });

  // Error handler
  bot.catch((err) => {
    console.error("Bot error:", err);
  });

  botInstance = bot;
  return bot;
}
