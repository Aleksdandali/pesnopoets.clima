/**
 * Telegram callback handler for /admin passwordless login.
 *
 * Callback payloads:
 *   adm:ok:<code>   — owner approves (status='approved')
 *   adm:no:<code>   — owner denies  (status='denied')
 *
 * The web browser is polling /api/admin/login/poll?code=<code> and will pick
 * up the new status and (on approve) get a session cookie back.
 *
 * Only TELEGRAM_OWNER_ID is allowed to act on these callbacks — even though
 * the global middleware already restricts the bot to team members.
 */

import { Context } from "grammy";
import { getSupabase } from "../services/supabase";

export async function handleAdminLoginCallback(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  if (!data?.startsWith("adm:")) return;

  const parts = data.split(":");
  const action = parts[1]; // ok | no
  const code = parts[2];

  if ((action !== "ok" && action !== "no") || !code || !/^[a-f0-9]{8}$/.test(code)) {
    await ctx.answerCallbackQuery("Ошибка").catch(() => {});
    return;
  }

  // Restrict to owner only — the only person who should approve admin logins.
  const ownerIdStr = process.env.TELEGRAM_OWNER_ID?.trim();
  const ownerId = ownerIdStr ? parseInt(ownerIdStr) : 0;
  const fromId = ctx.from?.id;
  if (!ownerId || fromId !== ownerId) {
    await ctx.answerCallbackQuery("Только владелец может подтверждать вход.").catch(() => {});
    return;
  }

  const db = getSupabase();

  // Read attempt — must be pending and not expired.
  const { data: row } = await db
    .from("admin_login_attempts")
    .select("status, expires_at, message_id")
    .eq("code", code)
    .maybeSingle<{ status: string; expires_at: string; message_id: number | null }>();

  if (!row) {
    await ctx.answerCallbackQuery("Запрос не найден.").catch(() => {});
    return;
  }
  if (row.status !== "pending") {
    await ctx.answerCallbackQuery(`Уже ${humanStatus(row.status)}.`).catch(() => {});
    return;
  }
  if (Date.parse(row.expires_at) < Date.now()) {
    await db.from("admin_login_attempts").update({ status: "expired" }).eq("code", code);
    await ctx.answerCallbackQuery("Запрос истёк.").catch(() => {});
    await safeEdit(ctx, "⏱ Запрос входа истёк (5 минут).");
    return;
  }

  const newStatus = action === "ok" ? "approved" : "denied";
  const { error } = await db
    .from("admin_login_attempts")
    .update({
      status: newStatus,
      approved_at: new Date().toISOString(),
      approved_by: fromId,
    })
    .eq("code", code)
    .eq("status", "pending"); // race-safe

  if (error) {
    console.error("[admin-login callback] update failed", error);
    await ctx.answerCallbackQuery("Ошибка").catch(() => {});
    return;
  }

  await ctx.answerCallbackQuery(action === "ok" ? "Доступ открыт" : "Отклонено").catch(() => {});

  const note =
    action === "ok"
      ? "✅ <b>Вход в админ-панель разрешён.</b>\n\nБраузер автоматически войдёт через несколько секунд."
      : "❌ <b>Запрос на вход отклонён.</b>";
  await safeEdit(ctx, note);
}

function humanStatus(s: string): string {
  switch (s) {
    case "approved":
      return "разрешено";
    case "denied":
      return "отклонено";
    case "expired":
      return "истёк срок";
    case "consumed":
      return "сессия выдана";
    default:
      return s;
  }
}

async function safeEdit(ctx: Context, html: string): Promise<void> {
  try {
    await ctx.editMessageText(html, { parse_mode: "HTML", reply_markup: { inline_keyboard: [] } });
  } catch {
    // ignore — message may be gone, not a critical failure
  }
}
