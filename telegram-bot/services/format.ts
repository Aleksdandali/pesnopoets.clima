import type { LeadWithProduct } from "./leads";

const SOURCE_LABEL: Record<string, string> = {
  "one-click": "Быстрый заказ",
  "one-click-card": "Быстрый заказ",
  checkout: "Корзина",
  "consultant-chat": "AI чат",
  "inquiry-page": "Форма запроса",
  "product-page": "Страница товара",
};

const STATUS_EMOJI: Record<string, string> = {
  new: "🆕",
  contacted: "📞",
  completed: "✅",
  cancelled: "❌",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Новая",
  contacted: "Связались",
  completed: "Выполнено",
  cancelled: "Отменено",
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function timeAgo(date: string): string {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}ч назад`;
  return `${Math.floor(hrs / 24)}д назад`;
}

export function formatNewLead(lead: LeadWithProduct): string {
  const product = lead.products;
  const source = SOURCE_LABEL[lead.source || ""] || lead.source || "—";

  let text = `🔔 <b>НОВАЯ ЗАЯВКА #${lead.id}</b>\n\n`;
  text += `👤 <b>${escapeHtml(lead.name)}</b>\n`;
  text += `📞 <code>${escapeHtml(lead.phone)}</code>\n`;
  if (lead.email) text += `📧 ${escapeHtml(lead.email)}\n`;
  text += `\n`;

  if (product) {
    text += `🏷 ${escapeHtml(product.title)}\n`;
    if (product.btu) text += `⚡ ${product.btu.toLocaleString()} BTU\n`;
    if (product.price_client) text += `💰 ${Number(product.price_client).toFixed(0)} EUR\n`;
    text += `\n`;
  }

  if (lead.message) {
    text += `💬 <i>${escapeHtml(lead.message.slice(0, 200))}</i>\n\n`;
  }

  text += `📍 ${source} · ${lead.locale.toUpperCase()}\n`;
  text += `🕐 ${timeAgo(lead.created_at)}`;

  return text;
}

export function formatLeadCard(lead: LeadWithProduct): string {
  const product = lead.products;
  const status = `${STATUS_EMOJI[lead.status] || ""} ${STATUS_LABEL[lead.status] || lead.status}`;

  let text = `<b>Заявка #${lead.id}</b> — ${status}\n\n`;
  text += `👤 ${escapeHtml(lead.name)}\n`;
  text += `📞 <code>${escapeHtml(lead.phone)}</code>\n`;

  if (product) {
    text += `🏷 ${escapeHtml(product.title)}`;
    if (product.price_client) text += ` · ${Number(product.price_client).toFixed(0)} EUR`;
    text += `\n`;
  }

  if (lead.message) {
    text += `\n💬 <i>${escapeHtml(lead.message.slice(0, 150))}</i>\n`;
  }

  if (lead.admin_notes) {
    text += `\n📝 ${escapeHtml(lead.admin_notes.slice(0, 150))}\n`;
  }

  text += `\n🕐 ${timeAgo(lead.created_at)}`;
  return text;
}

export function formatDashboard(kpi: {
  leadsToday: number; leadsWeek: number; leadsNew: number;
  leadsOverdue: number; conversionRate: number; chatWeek: number;
}): string {
  let text = `📊 <b>ПАНЕЛЬ УПРАВЛЕНИЯ</b>\n\n`;
  text += `📥 Заявок сегодня: <b>${kpi.leadsToday}</b>\n`;
  text += `📅 За неделю: <b>${kpi.leadsWeek}</b>\n`;
  text += `🆕 Необработанных: <b>${kpi.leadsNew}</b>\n`;

  if (kpi.leadsOverdue > 0) {
    text += `⚠️ <b>Ждут >1ч: ${kpi.leadsOverdue}</b>\n`;
  }

  text += `\n📈 Конверсия: <b>${kpi.conversionRate}%</b>\n`;
  text += `🤖 AI сессий за неделю: <b>${kpi.chatWeek}</b>`;

  return text;
}

export function formatLeadList(leads: LeadWithProduct[]): string {
  if (leads.length === 0) return "✅ Новых заявок нет. Все обработано!";

  let text = `📥 <b>НОВЫЕ ЗАЯВКИ (${leads.length})</b>\n\n`;

  for (const lead of leads) {
    const product = lead.products;
    text += `<b>#${lead.id}</b> · ${escapeHtml(lead.name)}\n`;
    text += `📞 <code>${escapeHtml(lead.phone)}</code>`;
    if (product) text += ` · ${escapeHtml(product.title.slice(0, 30))}`;
    text += `\n${timeAgo(lead.created_at)}\n\n`;
  }

  return text.trim();
}
