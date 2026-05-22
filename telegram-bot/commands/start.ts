import { Context } from "grammy";
import { isTeamMember } from "../services/auth";
import {
  getMember,
  getOnboardingState,
  startOnboarding,
  promptForStep,
} from "../services/onboarding";

export async function handleStart(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Already a fully-approved team member → normal welcome.
  if (await isTeamMember(userId)) {
    await ctx.reply(
      "👋 <b>Добро пожаловать в DANGROW Clima Bot!</b>\n\n" +
        "Команды:\n" +
        "/dashboard — Сводка\n" +
        "/leads — Новые заявки\n" +
        "/next — Следующий клиент\n" +
        "/help — Справка",
      { parse_mode: "HTML" },
    );
    return;
  }

  // Look up any prior application
  const member = await getMember(userId);
  if (member?.status === "pending") {
    await ctx.reply(
      "⏳ Ваша заявка отправлена владельцу и ожидает подтверждения.\n\n" +
        "Как только её одобрят, вы получите уведомление и сможете пользоваться ботом.",
    );
    return;
  }
  if (member?.status === "rejected") {
    await ctx.reply(
      "❌ К сожалению, ваша заявка была отклонена.\n\n" +
        "Если это ошибка — свяжитесь с владельцем компании напрямую.",
    );
    return;
  }

  // If an onboarding chat is already in flight, resume from current step.
  const state = await getOnboardingState(userId);
  if (state) {
    await ctx.reply(promptForStep(state.step), { parse_mode: "HTML" });
    return;
  }

  // Brand new user → kick off onboarding.
  await startOnboarding(userId, ctx.from?.username ?? null);
  await ctx.reply(
    "👋 <b>Здравствуйте!</b>\n\n" +
      "Это внутренний бот компании Pesnopoets Clima. " +
      "Для регистрации заполните короткую анкету — она уйдёт на подтверждение владельцу.\n\n" +
      promptForStep("last_name"),
    { parse_mode: "HTML" },
  );
}
