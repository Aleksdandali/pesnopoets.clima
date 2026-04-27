/**
 * AI Consultant streaming endpoint.
 *
 * POST /api/consultant
 * Body: { locale: "bg"|"en"|"ru"|"ua", messages: Array<{role, content}> }
 * Response: SSE stream with JSON events:
 *   { type: "text_delta", text: "..." }
 *   { type: "tool_use", name: "search_products", input: {...} }
 *   { type: "tool_result", name: "...", output: {...} }
 *   { type: "done" }
 *   { type: "error", message: "..." }
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { buildSystemPrompt } from "@/lib/consultant/system-prompt";
import { TOOL_DEFINITIONS, executeTool, type ToolContext } from "@/lib/consultant/tools";
import { checkRateLimit } from "@/lib/security";

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const MAX_TOOL_TURNS = 6; // prevent runaway tool loops

type IncomingMessage = {
  role: "user" | "assistant";
  content: string | Anthropic.ContentBlockParam[];
};

export async function POST(req: Request) {
  // CSRF: reject requests from foreign origins
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://pesnopoets-clima.com",
    "https://www.pesnopoets-clima.com",
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean);
  if (origin && !allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const rateLimit = await checkRateLimit();
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { locale?: string; messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const locale = normalizeLocale(body.locale);
  const MAX_MSG_LENGTH = 2000;
  const messages = (Array.isArray(body.messages) ? body.messages : []).map((m) => ({
    ...m,
    content:
      typeof m.content === "string" ? m.content.slice(0, MAX_MSG_LENGTH) : m.content,
  }));
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
  }
  if (messages.length > 40) {
    return new Response(JSON.stringify({ error: "Conversation too long" }), { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  // Load owner's custom knowledge from DB (non-blocking fallback)
  let extraKnowledge = "";
  try {
    const db = createAnonClient();
    const { data } = await db
      .from("ai_knowledge")
      .select("title, content")
      .eq("is_active", true)
      .order("created_at");
    if (data && data.length > 0) {
      extraKnowledge = data.map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
    }
  } catch { /* silent — proceed without extra knowledge */ }

  const systemPrompt = buildSystemPrompt(locale, extraKnowledge || undefined);
  const ctx: ToolContext = { locale };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        // Convert incoming messages to Anthropic format
        const conversation: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : m.content,
        }));

        // Track tool usage for session logging
        const allToolNames = new Set<string>();

        // Agentic loop: model may emit tool_use → we execute → send tool_result → repeat
        for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
          const assistantBlocks: Anthropic.ContentBlock[] = [];
          let stopReason: string | null = null;

          const apiStream = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            tools: TOOL_DEFINITIONS,
            messages: conversation,
          });

          apiStream.on("text", (delta: string) => {
            send({ type: "text_delta", text: delta });
          });

          const final = await apiStream.finalMessage();
          stopReason = final.stop_reason;
          assistantBlocks.push(...final.content);

          // Append assistant turn to conversation
          conversation.push({ role: "assistant", content: assistantBlocks });

          // If model didn't request tools, we're done
          if (stopReason !== "tool_use") {
            break;
          }

          // Execute all tool_use blocks
          const toolUses = assistantBlocks.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
          );
          if (toolUses.length === 0) break;

          const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            allToolNames.add(tu.name);
            send({ type: "tool_use", name: tu.name, input: tu.input });
            let output: unknown;
            try {
              output = await executeTool(
                tu.name,
                tu.input as Record<string, unknown>,
                ctx
              );
            } catch (err) {
              output = { error: err instanceof Error ? err.message : "Tool error" };
            }
            send({ type: "tool_result", name: tu.name, output });
            toolResultBlocks.push({
              type: "tool_result",
              tool_use_id: tu.id,
              content: JSON.stringify(output),
            });
          }

          conversation.push({ role: "user", content: toolResultBlocks });
        }

        send({ type: "done" });

        // Log session + messages to Supabase (non-blocking)
        const userMessageCount = messages.filter((m) => m.role === "user").length;
        const toolsUsed = Array.from(allToolNames);
        const leadCollected = allToolNames.has("collect_lead");

        // Collect messages to save
        const chatMsgs: Array<{ role: string; content: string }> = [];
        for (const m of messages) {
          if (m.role === "user" && typeof m.content === "string") {
            chatMsgs.push({ role: "user", content: m.content.slice(0, 5000) });
          }
        }
        for (const turn of conversation) {
          if (turn.role === "assistant") {
            const blocks = Array.isArray(turn.content) ? turn.content : [];
            const text = blocks
              .filter((b: { type: string }) => b.type === "text")
              .map((b: { type: string; text?: string }) => b.text || "")
              .join("");
            if (text) chatMsgs.push({ role: "assistant", content: text.slice(0, 10000) });
          }
        }

        // Save to DB (fire-and-forget)
        const db = createAnonClient();
        Promise.resolve(
          db.from("chat_sessions")
            .insert({ locale, messages_count: userMessageCount, tools_used: toolsUsed, lead_collected: leadCollected })
            .select("id")
            .single()
        ).then(({ data: session, error: sessionErr }) => {
          if (sessionErr || !session?.id) {
            console.error("Chat session save error:", sessionErr);
            return;
          }
          if (chatMsgs.length > 0) {
            const rows = chatMsgs.map((m) => ({ session_id: session.id, role: m.role, content: m.content }));
            Promise.resolve(db.from("chat_messages").insert(rows)).then(({ error: msgErr }) => {
              if (msgErr) console.error("Chat messages save error:", msgErr);
            });
          }
        }).catch((err) => console.error("Chat save error:", err));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function normalizeLocale(l: string | undefined): "bg" | "en" | "ru" | "ua" {
  if (l === "en" || l === "ru" || l === "ua") return l;
  return "bg";
}
