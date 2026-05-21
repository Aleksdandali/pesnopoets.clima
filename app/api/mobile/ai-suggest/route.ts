/**
 * Mobile AI-suggest endpoint.
 *
 * Manager-side helper: given a conversation_id, return a single suggested
 * reply text the manager can edit and send. Not a streaming endpoint —
 * one short JSON response. The manager remains the author of every outgoing
 * message; the AI just drafts.
 *
 * POST /api/mobile/ai-suggest
 * Headers: Authorization: Bearer <supabase-jwt>
 * Body: { conversation_id: string }
 * Response: { text: string } | { error: string }
 */

import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 512;
const HISTORY_LIMIT = 30;

const SYSTEM_PROMPT = `Ти си помощник на оператор на сервиз за климатици в Песнопоец Клима (Варна, България). Твоята задача е да съчиниш ЕДИН кратък отговор на български към клиента, базиран на разговора. Правила:
- Отговаряй САМО с текста на отговора, без обяснения и без префикс "Отговор:".
- Дръж тона топъл, професионален, без емоджита.
- Ако клиентът пита за цена на профилактика — 60 EUR за един климатик, 50 EUR/бр. от два нагоре.
- Ако пита за монтаж — 250 EUR стандартен пакет, оглед безплатен.
- Ако не разполагаш с достатъчно информация — задай един уточняващ въпрос вместо да измисляш.
- Дължина: 1–3 изречения.`;

interface MessageRow {
  body: string;
  sender_user_id: string | null;
  is_ai: boolean;
  created_at: string;
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!jwt) {
    return Response.json({ error: "Missing token" }, { status: 401 });
  }

  let body: { conversation_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const conversationId = body.conversation_id;
  if (!conversationId || typeof conversationId !== "string") {
    return Response.json({ error: "conversation_id required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify JWT and resolve user
  const { data: userRes, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userRes.user) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
  const userId = userRes.user.id;

  // Staff-only
  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (profileErr || !profile) {
    return Response.json({ error: "Profile not found" }, { status: 403 });
  }
  if (!["manager", "admin", "installer"].includes(profile.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Load conversation (verify it exists) + client_user_id for bubble side
  const { data: convo, error: convoErr } = await admin
    .from("conversations")
    .select("id, client_user_id")
    .eq("id", conversationId)
    .single();
  if (convoErr || !convo) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { data: messages, error: msgErr } = await admin
    .from("messages")
    .select("body, sender_user_id, is_ai, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(HISTORY_LIMIT);
  if (msgErr) {
    return Response.json({ error: "Failed to load messages" }, { status: 500 });
  }

  if (!messages || messages.length === 0) {
    return Response.json({ text: "Здравейте! С какво мога да помогна?" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  // Map to Anthropic conversation: client messages → "user", staff/AI → "assistant"
  const anthropicMessages = (messages as MessageRow[]).map((m) => ({
    role:
      m.sender_user_id === convo.client_user_id
        ? ("user" as const)
        : ("assistant" as const),
    content: m.body,
  }));

  // Collapse consecutive same-role turns (Anthropic requires alternating roles)
  const collapsed: typeof anthropicMessages = [];
  for (const m of anthropicMessages) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.role === m.role) {
      last.content = `${last.content}\n\n${m.content}`;
    } else {
      collapsed.push({ ...m });
    }
  }

  // Anthropic requires the first message to be "user"; if conversation starts
  // with an assistant message, prepend a placeholder user turn.
  if (collapsed[0]?.role !== "user") {
    collapsed.unshift({ role: "user", content: "(клиентът още не е писал)" });
  }
  // And requires the last message to be "user" for the model to reply
  if (collapsed[collapsed.length - 1]?.role !== "user") {
    collapsed.push({ role: "user", content: "(съчини отговор/уточнение)" });
  }

  const client = new Anthropic({ apiKey });
  try {
    const completion = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: collapsed,
    });
    const text = completion.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return Response.json({ text: text || "Здравейте! С какво мога да помогна?" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI error";
    return Response.json({ error: message }, { status: 500 });
  }
}
