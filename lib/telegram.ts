import { createAdminClient } from "@/lib/supabase/admin";

const TELEGRAM_API = "https://api.telegram.org/bot";

interface InquiryData {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  productTitle?: string | null;
  productPrice?: number | null;
  locale: string;
}

interface SyncReport {
  total: number;
  created: number;
  updated: number;
  deactivated: number;
  errors: number;
  duration: number;
}

async function sendToChat(token: string, chatId: string | number, text: string): Promise<void> {
  try {
    const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Telegram API error (chat ${chatId}):`, res.status, body);
    }
  } catch (err) {
    console.error(`Failed to send Telegram message (chat ${chatId}):`, err);
  }
}

/**
 * Default recipient = legacy TELEGRAM_CHAT_ID. Used for non-inquiry messages
 * (e.g. sync reports) that don't need fan-out to the whole team.
 */
async function sendTelegramMessage(text: string): Promise<void> {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  await sendToChat(token, chatId, text);
}

/**
 * Collect every recipient who should see a new inquiry:
 *   - TELEGRAM_OWNER_ID (always, if set)
 *   - All telegram_team_members with is_active = true AND notify_new_leads = true
 *   - TELEGRAM_CHAT_ID (legacy fallback, only if no DB recipients found)
 *
 * Returns a de-duplicated list of chat ids as strings.
 */
async function resolveInquiryRecipients(): Promise<string[]> {
  const recipients = new Set<string>();

  const ownerId = (process.env.TELEGRAM_OWNER_ID || "").trim();
  if (ownerId) recipients.add(ownerId);

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("telegram_team_members")
      .select("telegram_user_id")
      .eq("is_active", true)
      .eq("notify_new_leads", true);

    if (error) {
      console.error("Failed to load telegram_team_members:", error);
    } else if (data) {
      for (const row of data) {
        if (row.telegram_user_id != null) {
          recipients.add(String(row.telegram_user_id));
        }
      }
    }
  } catch (err) {
    console.error("telegram_team_members lookup failed:", err);
  }

  // Legacy fallback — keep CHAT_ID only when nothing else resolved, so a stale
  // value doesn't keep spamming a dead chat once the team table is populated.
  if (recipients.size === 0) {
    const legacyChatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
    if (legacyChatId) recipients.add(legacyChatId);
  }

  return Array.from(recipients);
}

export async function sendInquiryNotification(
  inquiry: InquiryData
): Promise<void> {
  const priceLine =
    inquiry.productPrice != null
      ? `\n💰 Цена: ${inquiry.productPrice.toFixed(0)} €`
      : "";

  const text = [
    `🔔 <b>Нова заявка!</b>`,
    ``,
    `👤 Име: ${escapeHtml(inquiry.name)}`,
    `📞 Телефон: ${escapeHtml(inquiry.phone)}`,
    inquiry.email ? `📧 Email: ${escapeHtml(inquiry.email)}` : null,
    inquiry.productTitle
      ? `\n🏷 Продукт: ${escapeHtml(inquiry.productTitle)}`
      : null,
    priceLine || null,
    inquiry.message
      ? `\n💬 Съобщение:\n${escapeHtml(inquiry.message)}`
      : null,
    ``,
    `🌐 Език: ${inquiry.locale.toUpperCase()}`,
    `📅 ${new Date().toLocaleString("bg-BG", { timeZone: "Europe/Sofia" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping inquiry notification");
    return;
  }

  const recipients = await resolveInquiryRecipients();
  if (recipients.length === 0) {
    console.warn("No Telegram recipients configured for inquiry notification");
    return;
  }

  await Promise.all(recipients.map((chatId) => sendToChat(token, chatId, text)));
}

export async function sendSyncReport(report: SyncReport): Promise<void> {
  const text = [
    `📊 <b>Синхронизация завърши</b>`,
    ``,
    `📦 Общо продукти: ${report.total}`,
    `✅ Нови: ${report.created}`,
    `🔄 Обновени: ${report.updated}`,
    `❌ Деактивирани: ${report.deactivated}`,
    report.errors > 0 ? `⚠️ Грешки: ${report.errors}` : null,
    `⏱ Време: ${(report.duration / 1000).toFixed(1)}s`,
    ``,
    `📅 ${new Date().toLocaleString("bg-BG", { timeZone: "Europe/Sofia" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendTelegramMessage(text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
