import { NextRequest, NextResponse } from "next/server";

let handleUpdate: ((req: NextRequest) => Promise<Response>) | null = null;

async function getHandler() {
  if (!handleUpdate) {
    const { webhookCallback } = await import("grammy/web");
    const { createBot } = await import("../../../../telegram-bot");
    const bot = createBot();
    handleUpdate = webhookCallback(bot, "std/http") as unknown as (req: NextRequest) => Promise<Response>;
  }
  return handleUpdate;
}

export async function POST(req: NextRequest) {
  // Verify webhook secret (mandatory)
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const token = req.headers.get("x-telegram-bot-api-secret-token");
  if (token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const handler = await getHandler();
    return await handler(req);
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
