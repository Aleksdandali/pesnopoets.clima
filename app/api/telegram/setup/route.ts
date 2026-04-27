import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Admin auth
  const pw = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/api/telegram/webhook`;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  // Register webhook with Telegram
  const params: Record<string, string> = {
    url: webhookUrl,
    allowed_updates: JSON.stringify(["message", "callback_query"]),
  };
  if (secret) params.secret_token = secret;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  // Set bot commands
  await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "dashboard", description: "📊 Сводка KPI" },
        { command: "leads", description: "📥 Новые заявки" },
        { command: "next", description: "👤 Следующий клиент" },
        { command: "help", description: "📋 Справка" },
      ],
    }),
  });

  return NextResponse.json({ ok: data.ok, result: data.result, webhookUrl });
}
