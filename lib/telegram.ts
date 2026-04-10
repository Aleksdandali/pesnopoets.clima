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

async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

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
      console.error("Telegram API error:", res.status, body);
    }
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
  }
}

const EUR_TO_BGN = 1.95583;

export async function sendInquiryNotification(
  inquiry: InquiryData
): Promise<void> {
  const priceLine =
    inquiry.productPrice != null
      ? `\n💰 Цена: ${(inquiry.productPrice * EUR_TO_BGN).toFixed(0)} лв.`
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

  await sendTelegramMessage(text);
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
