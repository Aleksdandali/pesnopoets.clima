/**
 * Daily analytics cron.
 *
 * Runs at 04:30 UTC (07:30 EEST summer / 06:30 EET winter) every day. Does
 * three deterministic warehouse chores and one creative AI step:
 *
 *   1. ensure_analytics_partitions(6)    — keep 6 months of forward partitions
 *   2. refresh_analytics_views()         — refresh the 7 mat-views
 *   3. purge_ai_insight_history()        — drop rows past delete_after (90d)
 *   4. Generate the daily digest:        — Sonnet 4.6 + insight tools,
 *                                          summarising yesterday vs prior 7d.
 *                                          Result is stored in ai_insight_runs
 *                                          (trigger='cron-daily') and posted
 *                                          to the owner via Telegram.
 *
 * Authenticated via CRON_SECRET Bearer header (Vercel Cron sets this).
 */

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCronSecret } from "@/lib/security";
import { buildInsightsSystemPrompt } from "@/lib/insights/system-prompt";
import {
  INSIGHT_TOOL_DEFINITIONS,
  executeInsightTool,
  type ToolContext,
} from "@/lib/insights/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1500;
const MAX_TOOL_TURNS = 4;
const TELEGRAM_API = "https://api.telegram.org/bot";

const DIGEST_PROMPT_RU = `Сделай короткий ежедневный отчёт для владельца Песнопоец Клима. \
Используй инструменты, чтобы взять KPI за последние 7 дней и сравнить вчера с предыдущей неделей. \
Структура (Markdown, без заголовков H1/H2):
1. Одна строка-итог: что произошло за вчера.
2. 3-5 буллетов с конкретными цифрами (visitors, inquiries, phone/whatsapp, выручка).
3. 1-2 предложения "что важно сделать сегодня" (по данным).

Будь предельно кратким — это утреннее уведомление в Telegram. Не больше 12 строк.`;

export async function GET(req: Request) {
  if (!(await verifyCronSecret(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const startedAt = Date.now();
  const results: Record<string, unknown> = {};

  // ---- 1. partitions
  try {
    const { error } = await db.rpc("ensure_analytics_partitions", { months_ahead: 6 });
    results.partitions = error ? { error: error.message } : { ok: true };
  } catch (err) {
    results.partitions = { error: err instanceof Error ? err.message : "Failed" };
  }

  // ---- 2. refresh mat-views
  try {
    const { error } = await db.rpc("refresh_analytics_views");
    results.refresh = error ? { error: error.message } : { ok: true };
  } catch (err) {
    results.refresh = { error: err instanceof Error ? err.message : "Failed" };
  }

  // ---- 3. purge AI history past retention
  try {
    const { data, error } = await db.rpc("purge_ai_insight_history");
    results.purge = error ? { error: error.message } : { ok: true, deleted: data };
  } catch (err) {
    results.purge = { error: err instanceof Error ? err.message : "Failed" };
  }

  // ---- 4. daily digest (Sonnet 4.6)
  const digest = await generateDailyDigest();
  results.digest = digest.ok
    ? { ok: true, run_id: digest.runId, length: digest.text.length, posted: digest.posted }
    : { error: digest.error };

  return NextResponse.json({
    ok: true,
    elapsed_ms: Date.now() - startedAt,
    ...results,
  });
}

interface DigestSuccess {
  ok: true;
  runId: string | null;
  text: string;
  posted: boolean;
}
interface DigestFailure {
  ok: false;
  error: string;
}

async function generateDailyDigest(): Promise<DigestSuccess | DigestFailure> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, error: "ANTHROPIC_API_KEY not set" };

  const db = createAdminClient();
  const ctx: ToolContext = { surface: "admin", operatorId: "cron-daily" };

  // Create run row up front so logs can reference it
  const { data: runRow } = await db
    .from("ai_insight_runs")
    .insert({
      trigger: "cron-daily",
      prompt: DIGEST_PROMPT_RU.slice(0, 4000),
      surface: "admin",
      operator_id: "cron-daily",
      locale: "ru",
      tools_used: [],
    })
    .select("id")
    .single();
  const runId = runRow?.id ?? null;

  const client = new Anthropic({ apiKey });
  const conversation: Anthropic.MessageParam[] = [
    { role: "user", content: DIGEST_PROMPT_RU },
  ];

  const toolNames = new Set<string>();
  let answer = "";
  let stepCounter = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
      const final = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildInsightsSystemPrompt("ru"),
        tools: INSIGHT_TOOL_DEFINITIONS,
        messages: conversation,
      });

      inputTokens += final.usage?.input_tokens ?? 0;
      outputTokens += final.usage?.output_tokens ?? 0;

      const turnText = final.content
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
      answer = turnText || answer;

      conversation.push({ role: "assistant", content: final.content });

      if (final.stop_reason !== "tool_use") break;

      const toolUses = final.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
      );
      if (toolUses.length === 0) break;

      const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];
      for (const tu of toolUses) {
        toolNames.add(tu.name);
        if (runId) {
          void db.from("ai_insight_logs").insert({
            run_id: runId,
            step: stepCounter++,
            kind: "tool_call",
            tool_name: tu.name,
            payload: { input: tu.input },
          });
        }
        const result = await executeInsightTool(tu.name, tu.input, ctx);
        if (runId) {
          void db.from("ai_insight_logs").insert({
            run_id: runId,
            step: stepCounter++,
            kind: "tool_result",
            tool_name: tu.name,
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

    // Finalise run row
    if (runId) {
      await db
        .from("ai_insight_runs")
        .update({
          tools_used: Array.from(toolNames),
          answer: answer.slice(0, 4000),
          input_tokens: inputTokens,
          output_tokens: outputTokens,
        })
        .eq("id", runId);
    }

    const posted = await postToTelegram(answer);
    return { ok: true, runId, text: answer, posted };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Digest failed";
    if (runId) {
      await db
        .from("ai_insight_runs")
        .update({ answer: `[error] ${message}` })
        .eq("id", runId);
    }
    return { ok: false, error: message };
  }
}

async function postToTelegram(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const ownerId = (process.env.TELEGRAM_OWNER_ID || "").trim();
  if (!token || !ownerId) return false;

  const message = `📊 <b>Утренний отчёт</b>\n\n${escapeHtml(text)}`;
  try {
    const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ownerId,
        text: message.slice(0, 4000),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("[cron/analytics-daily] Telegram error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[cron/analytics-daily] Telegram fetch failed:", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (ch) => (ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : "&gt;"));
}

function capPayload(result: unknown): Record<string, unknown> {
  const json = JSON.stringify(result);
  if (json.length <= 8_000) {
    return result && typeof result === "object" ? (result as Record<string, unknown>) : { value: result };
  }
  if (result && typeof result === "object" && "rows" in (result as Record<string, unknown>)) {
    const r = result as { ok?: boolean; rows?: unknown[] };
    return {
      ok: r.ok,
      truncated: true,
      sample_rows: (r.rows ?? []).slice(0, 5),
      total_rows: (r.rows ?? []).length,
    };
  }
  return { truncated: true, bytes: json.length };
}
