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
import { buildSystemPrompt } from "@/lib/consultant/system-prompt";
import { TOOL_DEFINITIONS, executeTool, type ToolContext } from "@/lib/consultant/tools";
import { checkRateLimit } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1024;
const MAX_TOOL_TURNS = 6; // prevent runaway tool loops

type IncomingMessage = {
  role: "user" | "assistant";
  content: string | Anthropic.ContentBlockParam[];
};

export async function POST(req: Request) {
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
  const messages = Array.isArray(body.messages) ? body.messages : [];
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
  const systemPrompt = buildSystemPrompt(locale);
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
