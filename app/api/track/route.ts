import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isAllowedClientEvent,
  ALLOWED_SOURCES,
  ALLOWED_LOCALES,
  LIMITS,
  type ClientEventName,
  type EventSource,
  type EventLocale,
} from "@/lib/analytics/events";
import { hashIp } from "@/lib/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSRF / origin allowlist. Mirrors /api/inquiry.
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // same-origin fetch or server-rendered call
  const allowed = [
    "https://pesnopoets-clima.com",
    "https://www.pesnopoets-clima.com",
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean) as string[];
  return allowed.includes(origin);
}

// Per-anon_id token bucket. Resets on cold start; in-memory is fine because
// the worst case is a bot saturates a single warm instance, not the warehouse.
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10_000;
const MAX_EVENTS_PER_WINDOW = 60; // 6/sec sustained — plenty for page_view bursts

function rateLimit(anonId: string, count: number): boolean {
  const now = Date.now();
  const entry = buckets.get(anonId);
  if (!entry || entry.resetAt < now) {
    buckets.set(anonId, { count, resetAt: now + WINDOW_MS });
    return count <= MAX_EVENTS_PER_WINDOW;
  }
  entry.count += count;
  if (buckets.size > 5000) {
    // Lazy eviction so the map doesn't grow without bound.
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }
  return entry.count <= MAX_EVENTS_PER_WINDOW;
}

type IncomingEvent = {
  name?: unknown;
  ts?: unknown;
  page?: unknown;
  properties?: unknown;
};

type Validated = {
  ts: string;
  event_name: ClientEventName;
  source: EventSource;
  user_id: string | null;
  anon_id: string;
  session_id: string | null;
  locale: EventLocale | null;
  page: string | null;
  properties: Record<string, unknown>;
  revenue_eur_cents: null;
  ip_hash: string | null;
  user_agent: string | null;
};

function pickLocale(v: unknown): EventLocale | null {
  if (typeof v !== "string") return null;
  return (ALLOWED_LOCALES as readonly string[]).includes(v)
    ? (v as EventLocale)
    : null;
}

function clampString(v: unknown, max: number): string | null {
  if (typeof v !== "string" || v.length === 0) return null;
  return v.slice(0, max);
}

function parseTs(v: unknown): string {
  if (typeof v === "string") {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) {
      // Reject obviously bogus future timestamps but allow up to 60s skew.
      const now = Date.now();
      const ts = d.getTime();
      if (ts <= now + 60_000 && ts >= now - 24 * 3600_000) {
        return d.toISOString();
      }
    }
  }
  return new Date().toISOString();
}

function clampProperties(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const obj = v as Record<string, unknown>;
  const json = JSON.stringify(obj);
  if (json.length <= LIMITS.PROPERTIES_BYTES) return obj;
  return { _truncated: true, _bytes: json.length };
}

export async function POST(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const payload = body as {
    anon_id?: unknown;
    user_id?: unknown;
    session_id?: unknown;
    source?: unknown;
    locale?: unknown;
    events?: unknown;
  };

  const anonId = clampString(payload.anon_id, LIMITS.ID_CHARS);
  if (!anonId) {
    return NextResponse.json({ error: "anon_id required" }, { status: 400 });
  }

  const sourceRaw = typeof payload.source === "string" ? payload.source : "";
  const source: EventSource = ALLOWED_SOURCES.has(sourceRaw as EventSource)
    ? (sourceRaw as EventSource)
    : "web";

  // Mobile + admin sources must come server-to-server, never from a browser
  // fetch — reject to keep the channel honest.
  if (source === "mobile" || source === "server" || source === "admin") {
    return NextResponse.json({ error: "Source not allowed from web" }, { status: 403 });
  }

  const events = Array.isArray(payload.events) ? payload.events : [];
  if (events.length === 0) {
    return new Response(null, { status: 204 });
  }
  if (events.length > LIMITS.BATCH_SIZE) {
    return NextResponse.json({ error: "Batch too large" }, { status: 413 });
  }

  if (!rateLimit(anonId, events.length)) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  // We accept user_id from the client but only use it as a hint; the
  // identity_map is the source of truth for joins. For now, write what
  // the client claims and let the data layer reconcile.
  const userId = clampString(payload.user_id, 64);
  const sessionId = clampString(payload.session_id, LIMITS.ID_CHARS);
  const locale = pickLocale(payload.locale);

  // Hash IP server-side; we never store raw IP.
  const ipRaw =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const ipHash = hashIp(ipRaw);
  const ua = clampString(request.headers.get("user-agent"), 500);

  const rows: Validated[] = [];
  for (const raw of events as IncomingEvent[]) {
    if (!raw || typeof raw !== "object") continue;
    if (typeof raw.name !== "string") continue;
    if (!isAllowedClientEvent(raw.name)) continue;
    rows.push({
      ts: parseTs(raw.ts),
      event_name: raw.name,
      source,
      user_id: userId,
      anon_id: anonId,
      session_id: sessionId,
      locale,
      page: clampString(raw.page, LIMITS.PAGE_CHARS),
      properties: clampProperties(raw.properties),
      revenue_eur_cents: null,
      ip_hash: ipHash,
      user_agent: ua,
    });
  }

  if (rows.length === 0) {
    return new Response(null, { status: 204 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("analytics_events").insert(rows);
  if (error) {
    console.error("[analytics] /api/track insert failed:", error.message);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
