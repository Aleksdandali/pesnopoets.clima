/**
 * Tool layer for the AI Insights agent.
 *
 * Each tool wraps one SECURITY DEFINER RPC from migration 024. The agent
 * picks tools to answer questions like "how many leads last week from
 * Google Ads?" without ever touching analytics_events directly.
 *
 * Service-role client is required — all RPCs are revoked from anon/auth.
 */

import type Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ToolContext {
  /** Caller surface — used for log attribution only. */
  surface: "admin" | "tg";
  /** Free-form identifier of the operator (admin pw, tg user id). */
  operatorId: string | null;
}

// ---------------------------------------------------------------------------
// Tool definitions exposed to Claude
// ---------------------------------------------------------------------------

export const INSIGHT_TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "get_daily_kpi",
    description:
      "Daily KPI rollup per traffic source for the last N days (max 180). Returns page_views, visitors, inquiries, phone/whatsapp/viber clicks, wins (closed deals) and revenue in EUR cents.",
    input_schema: {
      type: "object",
      properties: {
        days_back: {
          type: "integer",
          minimum: 1,
          maximum: 180,
          description: "How many days back to include. Default 30.",
        },
      },
    },
  },
  {
    name: "get_funnel_inquiry_to_won",
    description:
      "Inquiry-to-won funnel grouped by acquisition bucket for the last 90 days. Returns inquiries, wins, revenue, and average cycle time in seconds.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_top_pages",
    description:
      "Top pages by visitor count for the last 30 days, with views/visitors/inquiries and conversion_rate (inquiries/visitors). Use this for content + SEO insight.",
    input_schema: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          description: "How many pages to return. Default 20.",
        },
      },
    },
  },
  {
    name: "get_mobile_funnel",
    description:
      "Weekly mobile-app funnel: app_opens, logins, installations_created, installations_confirmed, jobs_completed. Use when the question is about the installer/client mobile app.",
    input_schema: {
      type: "object",
      properties: {
        weeks_back: {
          type: "integer",
          minimum: 1,
          maximum: 26,
          description: "How many weeks back. Default 12.",
        },
      },
    },
  },
  {
    name: "get_revenue_by_source",
    description:
      "Revenue split by utm_source + utm_medium for the last 90 days. Use to compare ad channels (google/cpc vs fb/cpc vs direct).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_session_metrics",
    description:
      "Session-level aggregate per source (web/tg/mobile): session count, avg duration seconds, avg page views per session, inquiry_rate (share of sessions that submitted an inquiry).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_user_journey",
    description:
      "Aggregate journey for a single user_id (UUID from profiles): first_seen, last_seen, total event_count, inquiries, wins, revenue, and which sources they touched. Use only when you have an exact user_id.",
    input_schema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "profiles.id UUID" },
      },
      required: ["user_id"],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool executor
// ---------------------------------------------------------------------------

export interface ToolResult {
  ok: boolean;
  rows?: unknown[];
  error?: string;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asInt(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.floor(v);
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function asUuid(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return re.test(v) ? v : null;
}

export async function executeInsightTool(
  name: string,
  input: unknown,
  _ctx: ToolContext,
): Promise<ToolResult> {
  const args = isObject(input) ? input : {};
  const db = createAdminClient();

  try {
    switch (name) {
      case "get_daily_kpi": {
        const days = asInt(args.days_back, 30);
        const { data, error } = await db.rpc("get_daily_kpi", { p_days_back: days });
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_funnel_inquiry_to_won": {
        const { data, error } = await db.rpc("get_funnel_inquiry_to_won");
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_top_pages": {
        const limit = asInt(args.limit, 20);
        const { data, error } = await db.rpc("get_top_pages", { p_limit: limit });
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_mobile_funnel": {
        const weeks = asInt(args.weeks_back, 12);
        const { data, error } = await db.rpc("get_mobile_funnel", { p_weeks_back: weeks });
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_revenue_by_source": {
        const { data, error } = await db.rpc("get_revenue_by_source");
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_session_metrics": {
        const { data, error } = await db.rpc("get_session_metrics");
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      case "get_user_journey": {
        const uid = asUuid(args.user_id);
        if (!uid) return { ok: false, error: "user_id must be a valid UUID" };
        const { data, error } = await db.rpc("get_user_journey", { p_user_id: uid });
        if (error) return { ok: false, error: error.message };
        return { ok: true, rows: data ?? [] };
      }
      default:
        return { ok: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Tool execution failed" };
  }
}
