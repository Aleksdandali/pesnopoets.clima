import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type ServerEventName,
  type EventSource,
  type EventLocale,
  ALLOWED_LOCALES,
  LIMITS,
} from "./events";

type InsertRow = {
  ts: string;
  event_name: ServerEventName;
  source: EventSource;
  user_id: string | null;
  anon_id: string | null;
  session_id: string | null;
  locale: EventLocale | null;
  page: string | null;
  properties: Record<string, unknown>;
  revenue_eur_cents: number | null;
  ip_hash: string | null;
  user_agent: string | null;
};

export type ServerEventInput = {
  name: ServerEventName;
  source?: EventSource;
  userId?: string | null;
  anonId?: string | null;
  sessionId?: string | null;
  locale?: string | null;
  page?: string | null;
  properties?: Record<string, unknown>;
  revenueEurCents?: number | null;
  ipHash?: string | null;
  userAgent?: string | null;
};

const IP_HASH_SALT = process.env.IP_HASH_SALT || "";

/** SHA-256(ip + salt) → first 16 hex chars. Returns null for empty input. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip || !IP_HASH_SALT) return null;
  return crypto
    .createHash("sha256")
    .update(`${ip}:${IP_HASH_SALT}`)
    .digest("hex")
    .slice(0, 16);
}

function pickLocale(input: string | null | undefined): EventLocale | null {
  if (!input) return null;
  return (ALLOWED_LOCALES as readonly string[]).includes(input)
    ? (input as EventLocale)
    : null;
}

function clampString(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  return value.slice(0, max);
}

function clampProperties(props: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!props) return {};
  // Drop anything that would push us over the cap; cheaper to truncate the
  // payload than to refuse insertion.
  const json = JSON.stringify(props);
  if (json.length <= LIMITS.PROPERTIES_BYTES) return props;
  return { _truncated: true, _bytes: json.length };
}

/**
 * Fire-and-forget server-side event. Errors are logged but never thrown —
 * analytics must never break business flow (inquiry submission etc.).
 */
export async function trackServerEvent(input: ServerEventInput): Promise<void> {
  try {
    const supabase = createAdminClient();
    const row: InsertRow = {
      ts: new Date().toISOString(),
      event_name: input.name,
      source: input.source ?? "server",
      user_id: input.userId ?? null,
      anon_id: clampString(input.anonId, LIMITS.ID_CHARS),
      session_id: clampString(input.sessionId, LIMITS.ID_CHARS),
      locale: pickLocale(input.locale),
      page: clampString(input.page, LIMITS.PAGE_CHARS),
      properties: clampProperties(input.properties),
      revenue_eur_cents: input.revenueEurCents ?? null,
      ip_hash: input.ipHash ?? null,
      user_agent: clampString(input.userAgent, 500),
    };
    const { error } = await supabase.from("analytics_events").insert(row);
    if (error) {
      console.error("[analytics] server insert failed:", error.message, {
        event: input.name,
      });
    }
  } catch (err) {
    console.error("[analytics] server emit error:", err);
  }
}
