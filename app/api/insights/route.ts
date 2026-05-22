/**
 * AI Insights — streaming chat endpoint for the admin panel and TG manager.
 *
 * POST /api/insights
 * Auth (one of):
 *   - admin pw via ?pw=... or Bearer header (admin panel)
 *   - Bearer <JWT> from /api/tg/auth (TG admin Mini App)
 *
 * Body: { locale?: "bg"|"en"|"ru"|"ua", messages: [{role, content}], surface?: "admin"|"tg" }
 * Response: SSE stream with event types: text_delta, tool_use, tool_result, done, error
 *
 * Logs each run to ai_insight_runs + per-step events to ai_insight_logs
 * (90-day retention via migration 023).
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { verifyToken, JwtError } from "@/lib/tg-miniapp/jwt";
import { buildInsightsSystemPrompt, type InsightsLocale } from "@/lib/insights/system-prompt";
import {
  INSIGHT_TOOL_DEFINITIONS,
  executeInsightTool,
  type ToolContext,
} from "@/lib/insights/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const MAX_TOOL_TURNS = 5;
const MAX_INPUT_MESSAGES = 30;
const MAX_MSG_CHARS = 4000;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

interface AuthOk {
  ok: true;
  surface: "admin" | "tg";
  operatorId: string | null;
}
interface AuthFail {
  ok: false;
  response: Response;
}

function authenticate(req: NextRequest): AuthOk | AuthFail {
  // Try admin pw (header or ?pw=) first
  const adm = verifyAdmin(req);
  if (adm.ok) {
    return { ok: true, surface: "admin", operatorId: "admin" };
  }

  // Try TG JWT
  const auth = req.headers.get("authorization");
  const bearer = auth?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (bearer) {
    try {
      const payload = verifyToken(bearer);
      return { ok: true, surface: "tg", operatorId: `tg:${payload.tgId}` };
    } catch (err) {
      if (err instanceof JwtError) {
        // fall through — only fail at end
      }
    }
  }

  return {
    ok: false,
    response: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }),
  };
}

function normalizeLocale(v: unknown): InsightsLocale {
  if (v === "bg" || v === "en" || v === "ua") return v;
  return "ru";
}

export async function POST(req: NextRequest): Promise<Response> {
  const auth = authenticate(req);
  if (!auth.ok) return auth.response;

  let body: { locale?: string; messages?: IncomingMessage[]; surface?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const locale = normalizeLocale(body.locale);
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  if (rawMessages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
  }
  if (rawMessages.length > MAX_INPUT_MESSAGES) {
    return new Response(JSON.stringify({ error: "Conversation too long" }), { status: 400 });
  }

  const messages: IncomingMessage[] = rawMessages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_CHARS) }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildInsightsSystemPrompt(locale);
  const ctx: ToolContext = { surface: auth.surface, operatorId: auth.operatorId };

  // Create run row up front so per-step logs can reference it
  const db = createAdminClient();
  const lastUserQuestion = [...messages].reverse().find((m) => m.role === "user")?.content ?? "(empty)";
  const { data: runRow, error: runErr } = await db
    .from("ai_insight_runs")
    .insert({
      trigger: auth.surface === "tg" ? "tg-chat" : "admin-chat",
      prompt: lastUserQuestion.slice(0, 4000),
      surface: auth.surface,
      operator_id: auth.operatorId,
      locale,
      tools_used: [],
    })
    .select("id")
    .single();
  if (runErr) {
    console.error("[insights] failed to create run row:", runErr.message);
  }
  const runId: string | null = runRow?.id ?? null;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const t0 = Date.now();
      let stepCounter = 0;
      const toolNames = new Set<string>();
      let answerText = "";
      let inputTokens = 0;
      let outputTokens = 0;

      try {
        const conversation: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
          const assistantBlocks: Anthropic.ContentBlock[] = [];

          const apiStream = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            tools: INSIGHT_TOOL_DEFINITIONS,
            messages: conversation,
          });

          apiStream.on("text", (delta: string) => {
            send({ type: "text_delta", text: delta });
          });

          const final = await apiStream.finalMessage();
          assistantBlocks.push(...final.content);
          if (final.usage) {
            inputTokens += final.usage.input_tokens ?? 0;
            outputTokens += final.usage.output_tokens ?? 0;
          }

          // Log assistant text
          const turnText = assistantBlocks
            .filter((b): b is Anthropic.TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("");
          if (turnText && runId) {
            void db.from("ai_insight_logs").insert({
              run_id: runId,
              step: stepCounter++,
              kind: "message",
              payload: { text: turnText.slice(0, 4000) },
            });
          }
          answerText = turnText;

          conversation.push({ role: "assistant", content: assistantBlocks });

          if (final.stop_reason !== "tool_use") break;

          const toolUses = assistantBlocks.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
          );
          if (toolUses.length === 0) break;

          const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            toolNames.add(tu.name);
            send({ type: "tool_use", name: tu.name, input: tu.input });
            if (runId) {
              void db.from("ai_insight_logs").insert({
                run_id: runId,
                step: stepCounter++,
                kind: "tool_call",
                tool_name: tu.name,
                payload: { input: tu.input },
              });
            }

            const result = await executeInsightTool(
              tu.name,
              tu.input,
              ctx,
            );
            send({ type: "tool_result", name: tu.name, output: result });
            if (runId) {
              void db.from("ai_insight_logs").insert({
                run_id: runId,
                step: stepCounter++,
                kind: "tool_result",
                tool_name: tu.name,
                // Cap payload size — mat-view rows can be wide
                payload: capPayload(result),
              });
            }
            toolResultBlocks.push({
              type: "tool_result",
              tool_use_id: tu.id,
              content: JSON.stringify(result).slice(0, 60_000),
            });
          }

          conversation.push({ role: "user", content: toolResultBlocks });
        }

        send({ type: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[insights] stream error:", message);
        send({ type: "error", message });
      } finally {
        // Finalise run row
        if (runId) {
          const elapsed = Date.now() - t0;
          await db
            .from("ai_insight_runs")
            .update({
              tools_used: Array.from(toolNames),
              answer: answerText.slice(0, 4000),
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              elapsed_ms: elapsed,
            })
            .eq("id", runId);
        }
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

function capPayload(result: unknown): Record<string, unknown> {
  const json = JSON.stringify(result);
  if (json.length <= 8_000) {
    return result && typeof result === "object" ? (result as Record<string, unknown>) : { value: result };
  }
  // Keep the shape but truncate row list
  if (result && typeof result === "object" && "rows" in (result as Record<string, unknown>)) {
    const r = result as { ok?: boolean; rows?: unknown[]; error?: string };
    return {
      ok: r.ok,
      truncated: true,
      sample_rows: (r.rows ?? []).slice(0, 5),
      total_rows: (r.rows ?? []).length,
    };
  }
  return { truncated: true, bytes: json.length };
}
