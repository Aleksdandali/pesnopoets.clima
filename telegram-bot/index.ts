import { Bot } from "grammy";
import { isTeamMember } from "./services/auth";
import { handleStart } from "./commands/start";
import { handleDashboard } from "./commands/dashboard";
import { handleLeads, handleNext } from "./commands/leads";
import { handleEstimateCommand, handleVoiceMessage } from "./commands/estimate";
import { handleLeadCallback, handleNoteText, handleNoteCancel } from "./callbacks/lead-actions";
import { handleAdminLoginCallback } from "./callbacks/admin-login";
import {
  handleOnboardingText,
  handleTeamApprovalCallback,
} from "./callbacks/onboarding";
import { hasOnboardingState } from "./services/onboarding";

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

  // Auth middleware — allow team members, plus /start and onboarding traffic.
  // Anything else from a non-member gets a polite refusal.
  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (await isTeamMember(userId)) {
      return next();
    }

    // Allow /start (manages onboarding) for everyone.
    const text = ctx.message?.text;
    if (text === "/start" || text?.startsWith("/start ")) {
      return next();
    }

    // If onboarding is in flight for this user, let text answers through.
    if (ctx.message && (await hasOnboardingState(userId))) {
      return next();
    }

    if (ctx.message) {
      await ctx.reply(
        "⛔ Этот бот доступен только для сотрудников Pesnopoets Clima.\n\n" +
          "Если вы новый сотрудник — отправьте /start, чтобы подать заявку.",
      );
    }
  });

  // Commands
  bot.command("start", handleStart);
  bot.command("dashboard", handleDashboard);
  bot.command("d", handleDashboard);
  bot.command("leads", handleLeads);
  bot.command("next", handleNext);
  bot.command("n", handleNext);
  bot.command("estimate", handleEstimateCommand);
  bot.command("e", handleEstimateCommand);
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "📋 <b>Команды:</b>\n\n" +
      "/dashboard (или /d) — Сводка KPI\n" +
      "/leads — Список новых заявок\n" +
      "/next (или /n) — Следующий клиент\n" +
      "/estimate (или /e) — Новый просчёт\n" +
      "/help — Эта справка",
      { parse_mode: "HTML" }
    );
  });

  // Callback queries (inline buttons)
  bot.callbackQuery(/^adm:/, handleAdminLoginCallback);
  bot.callbackQuery(/^team:/, handleTeamApprovalCallback);
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
  bot.callbackQuery(/^cmd:estimate$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleEstimateCommand(ctx);
  });

  // Voice messages — estimate from voice
  bot.on("message:voice", async (ctx, next) => {
    const handled = await handleVoiceMessage(ctx);
    if (!handled) await next();
  });

  // Text messages — try onboarding capture first, then lead notes.
  bot.on("message:text", async (ctx, next) => {
    if (await handleOnboardingText(ctx)) return;
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
