/**
 * Onboarding handlers:
 *  - handleOnboardingText: captures Фамилия / Имя / Должность answers from
 *    text messages. Returns true if the message was consumed.
 *  - handleTeamApprovalCallback: routes "team:ok:<id>" / "team:no:<id>" from
 *    the owner card to approve/reject the candidate.
 */

import { Context } from "grammy";
import { getSupabase } from "../services/supabase";
import {
  advanceOnboarding,
  getOnboardingState,
  promptForStep,
  sanitizeAnswer,
} from "../services/onboarding";

const TELEGRAM_API = "https://api.telegram.org/bot";

export async function handleOnboardingText(ctx: Context): Promise<boolean> {
  const userId = ctx.from?.id;
  const text = ctx.message?.text;
  if (!userId || !text) return false;
  if (text.startsWith("/")) return false; // commands handled elsewhere

  const state = await getOnboardingState(userId);
  if (!state) return false;

  const answer = sanitizeAnswer(text);
  if (!answer) {
    await ctx.reply("Пустой ответ — введите, пожалуйста, текст.");
    return true;
  }
  if (answer.length < 2) {
    await ctx.reply("Слишком короткий ответ. Введите минимум 2 символа.");
    return true;
  }

  const result = await advanceOnboarding(state, answer);

  if (result === "done") {
    await ctx.reply(
      "✅ Анкета отправлена владельцу на подтверждение.\n\n" +
        "Ожидайте — как только заявку одобрят, вы получите уведомление.",
    );
    await notifyOwner(userId, ctx.from?.username ?? null);
    return true;
  }

  await ctx.reply(promptForStep(result.step), { parse_mode: "HTML" });
  return true;
}

async function notifyOwner(applicantId: number, applicantUsername: string | null): Promise<void> {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const ownerIdStr = process.env.TELEGRAM_OWNER_ID?.trim();
  if (!token || !ownerIdStr) return;

  // Fetch the freshly-inserted candidate so the card shows real names.
  const { data: row } = await getSupabase()
    .from("telegram_team_members")
    .select("first_name, last_name, position, telegram_username")
    .eq("telegram_user_id", applicantId)
    .maybeSingle<{
      first_name: string | null;
      last_name: string | null;
      position: string | null;
      telegram_username: string | null;
    }>();

  const fullName =
    [row?.first_name, row?.last_name].filter(Boolean).join(" ") || "—";
  const handle = row?.telegram_username || applicantUsername;
  const text =
    "👤 <b>Новая заявка на доступ</b>\n\n" +
    `<b>ФИО:</b> ${escapeHtml(fullName)}\n` +
    `<b>Должность:</b> ${escapeHtml(row?.position || "—")}\n` +
    `<b>Telegram:</b> ${handle ? "@" + escapeHtml(handle) : `id ${applicantId}`}\n` +
    `<b>ID:</b> <code>${applicantId}</code>`;

  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: ownerIdStr,
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Принять", callback_data: `team:ok:${applicantId}` },
            { text: "❌ Отклонить", callback_data: `team:no:${applicantId}` },
          ],
        ],
      },
    }),
  }).catch((err) => console.error("[onboarding] notifyOwner fetch failed", err));
}

export async function handleTeamApprovalCallback(ctx: Context): Promise<void> {
  const data = ctx.callbackQuery?.data;
  if (!data?.startsWith("team:")) return;

  const parts = data.split(":");
  const action = parts[1];
  const applicantId = parseInt(parts[2]);
  if ((action !== "ok" && action !== "no") || !Number.isFinite(applicantId)) {
    await ctx.answerCallbackQuery("Ошибка").catch(() => {});
    return;
  }

  // Only owner may act.
  const ownerId = process.env.TELEGRAM_OWNER_ID
    ? parseInt(process.env.TELEGRAM_OWNER_ID.trim())
    : 0;
  if (!ownerId || ctx.from?.id !== ownerId) {
    await ctx.answerCallbackQuery("Только владелец может принимать сотрудников").catch(() => {});
    return;
  }

  const db = getSupabase();
  const { data: row } = await db
    .from("telegram_team_members")
    .select("status, first_name, last_name")
    .eq("telegram_user_id", applicantId)
    .maybeSingle<{ status: string; first_name: string | null; last_name: string | null }>();

  if (!row) {
    await ctx.answerCallbackQuery("Заявка не найдена").catch(() => {});
    return;
  }
  if (row.status !== "pending") {
    await ctx.answerCallbackQuery("Заявка уже обработана").catch(() => {});
    return;
  }

  const approve = action === "ok";
  await db
    .from("telegram_team_members")
    .update({
      status: approve ? "approved" : "rejected",
      is_active: approve,
      decided_at: new Date().toISOString(),
      decided_by: ownerId,
      updated_at: new Date().toISOString(),
    })
    .eq("telegram_user_id", applicantId)
    .eq("status", "pending");

  const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || "сотрудник";
  await ctx.answerCallbackQuery(approve ? "Принято" : "Отклонено").catch(() => {});

  // Update the owner card to reflect the decision.
  try {
    await ctx.editMessageText(
      (ctx.callbackQuery?.message && "text" in ctx.callbackQuery.message
        ? ctx.callbackQuery.message.text
        : "") +
        `\n\n${approve ? "✅" : "❌"} <b>${approve ? "Принято" : "Отклонено"}</b>`,
      { parse_mode: "HTML", reply_markup: { inline_keyboard: [] } },
    );
  } catch {
    // ignore — message may be too old to edit
  }

  // Notify the applicant.
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (token) {
    const text = approve
      ? `✅ <b>${escapeHtml(fullName)}</b>, ваша заявка одобрена!\n\nТеперь вы можете пользоваться ботом. Отправьте /help, чтобы увидеть команды.`
      : "❌ К сожалению, ваша заявка была отклонена. Свяжитесь с владельцем, если это ошибка.";
    await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: applicantId, text, parse_mode: "HTML" }),
    }).catch((err) => console.error("[onboarding] notify applicant failed", err));
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (ch) => (ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : "&gt;"));
}
