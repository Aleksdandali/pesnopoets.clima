/**
 * Mobile push trigger for a new chat message.
 *
 * Called by the mobile app immediately after a successful `sendMessage`.
 * We resolve the recipient (client → staff, or staff → client), look up their
 * Expo push token, send to Expo, and log the result. Fire-and-forget from the
 * mobile side — failures here never undo the message INSERT.
 *
 * POST /api/mobile/notify-message
 * Headers: Authorization: Bearer <supabase-jwt>
 * Body: { message_id: string }
 * Response: { ok: true, sent: number } | { error: string }
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { sendExpoPush, isValidExpoPushToken, type ExpoPushPayload } from "@/lib/push";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_BODY_PREVIEW = 100;

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!jwt) {
    return Response.json({ error: "Missing token" }, { status: 401 });
  }

  let body: { message_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const messageId = body.message_id;
  if (!messageId || typeof messageId !== "string") {
    return Response.json({ error: "message_id required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify the caller is authenticated (we don't need to act AS them — service role
  // does all the DB work — but we don't want unauthenticated callers spraying pushes).
  const { data: userRes, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userRes.user) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
  const senderUserId = userRes.user.id;

  // Load message + conversation
  const { data: msg, error: msgErr } = await admin
    .from("messages")
    .select("id, conversation_id, sender_user_id, body, created_at")
    .eq("id", messageId)
    .single();
  if (msgErr || !msg) {
    return Response.json({ error: "Message not found" }, { status: 404 });
  }
  if (msg.sender_user_id !== senderUserId) {
    // Only the author can trigger a notification for their own message.
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: convo, error: convoErr } = await admin
    .from("conversations")
    .select("id, client_user_id, assigned_to")
    .eq("id", msg.conversation_id)
    .single();
  if (convoErr || !convo) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const senderIsClient = senderUserId === convo.client_user_id;

  // Resolve recipients:
  //   client → staff side: notify assigned manager if set, else ALL managers.
  //   staff  → client: notify the conversation's client.
  let recipientIds: string[] = [];
  if (senderIsClient) {
    if (convo.assigned_to) {
      recipientIds = [convo.assigned_to];
    } else {
      const { data: managers } = await admin
        .from("profiles")
        .select("id")
        .in("role", ["manager", "admin"]);
      recipientIds = (managers ?? []).map((m) => m.id as string);
    }
  } else {
    recipientIds = [convo.client_user_id];
  }

  if (recipientIds.length === 0) {
    return Response.json({ ok: true, sent: 0 });
  }

  // Pull push tokens + sender name for the title
  const { data: recipients } = await admin
    .from("profiles")
    .select("id, expo_push_token, language")
    .in("id", recipientIds);

  const { data: senderProfile } = await admin
    .from("profiles")
    .select("full_name, phone")
    .eq("id", senderUserId)
    .single();

  const senderTitle = senderIsClient
    ? senderProfile?.full_name ||
      senderProfile?.phone ||
      "Нов клиент"
    : "Песнопоец Клима";

  const targets = (recipients ?? []).filter((r) =>
    isValidExpoPushToken(r.expo_push_token as string | null),
  );
  if (targets.length === 0) {
    return Response.json({ ok: true, sent: 0 });
  }

  const preview = msg.body.length > MAX_BODY_PREVIEW
    ? msg.body.slice(0, MAX_BODY_PREVIEW - 1) + "…"
    : msg.body;

  const payloads: ExpoPushPayload[] = targets.map((r) => ({
    to: r.expo_push_token as string,
    title: senderTitle,
    body: preview,
    sound: "default",
    data: {
      kind: "message",
      conversation_id: convo.id,
      message_id: msg.id,
    },
  }));

  let tickets: Awaited<ReturnType<typeof sendExpoPush>> = [];
  try {
    tickets = await sendExpoPush(payloads);
  } catch (err) {
    // Log all as failed and bail
    await admin.from("notification_log").insert(
      targets.map((r) => ({
        recipient_user_id: r.id as string,
        kind: "message",
        ref_id: msg.id,
        status: "failed",
        error: err instanceof Error ? err.message : "Push error",
      })),
    );
    return Response.json({ error: "Push send failed" }, { status: 502 });
  }

  // Log per-recipient outcome
  const logRows = targets.map((r, i) => {
    const ticket = tickets[i];
    return {
      recipient_user_id: r.id as string,
      kind: "message" as const,
      ref_id: msg.id,
      status: ticket?.status === "ok" ? ("sent" as const) : ("failed" as const),
      expo_ticket_id: ticket?.id ?? null,
      error: ticket?.status === "error"
        ? ticket?.message ?? ticket?.details?.error ?? null
        : null,
    };
  });
  await admin.from("notification_log").insert(logRows);

  const sent = logRows.filter((r) => r.status === "sent").length;
  return Response.json({ ok: true, sent });
}
