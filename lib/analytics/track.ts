// Client-side analytics SDK. Batches events in memory, flushes every 5s or
// when the queue hits 10 events, and uses sendBeacon on pagehide so we don't
// lose the last burst before navigation. No-op until consent is granted.
//
// IMPORTANT: do not import server-only modules here. This runs in the browser.

import {
  isAllowedClientEvent,
  LIMITS,
  type ClientEventName,
  type EventSource,
  type EventLocale,
} from "./events";

const STORAGE_KEY = "pc_anon_id";
const SESSION_KEY = "pc_session_id";
const SESSION_TTL_MS = 30 * 60_000; // 30 min idle → new session
const FLUSH_INTERVAL_MS = 5_000;
const FLUSH_THRESHOLD = 10;
const ENDPOINT = "/api/track";

type QueuedEvent = {
  name: ClientEventName;
  ts: string;
  page: string | null;
  properties: Record<string, unknown>;
};

type SessionInfo = { id: string; lastActivity: number };

let _consent = false;
let _userId: string | null = null;
let _locale: EventLocale | null = null;
let _source: Extract<EventSource, "web" | "tg"> = "web";
let _queue: QueuedEvent[] = [];
let _flushTimer: ReturnType<typeof setTimeout> | null = null;

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback — only used in very old browsers we don't really target.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAnonId(): string {
  if (typeof localStorage === "undefined") return "ssr";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function getSessionId(): string {
  if (typeof sessionStorage === "undefined") return "ssr";
  const now = Date.now();
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const s = JSON.parse(raw) as SessionInfo;
      if (s.lastActivity && now - s.lastActivity < SESSION_TTL_MS) {
        s.lastActivity = now;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
        return s.id;
      }
    } catch {
      // ignore corrupted entry
    }
  }
  const fresh: SessionInfo = { id: uuid(), lastActivity: now };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
  return fresh.id;
}

function scheduleFlush() {
  if (_flushTimer) return;
  _flushTimer = setTimeout(() => {
    _flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

function buildPayload(events: QueuedEvent[]): string {
  return JSON.stringify({
    anon_id: getAnonId(),
    session_id: getSessionId(),
    user_id: _userId,
    source: _source,
    locale: _locale,
    events,
  });
}

async function flush(): Promise<void> {
  if (_queue.length === 0) return;
  const batch = _queue.splice(0, LIMITS.BATCH_SIZE);
  const payload = buildPayload(batch);
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    // Drop on error — analytics must never block UX.
  }
}

function flushSync(): void {
  if (_queue.length === 0) return;
  const batch = _queue.splice(0, LIMITS.BATCH_SIZE);
  const payload = buildPayload(batch);
  // sendBeacon is the only reliable way to deliver during unload.
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(ENDPOINT, blob);
    return;
  }
  // Fallback (mostly Safari < 11.1 — we don't care, queue is lost).
  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

/**
 * Mark the user as having granted analytics consent. Until this is called the
 * tracker is a no-op. Wire this from the CMP (Klaro) consent callback.
 */
export function setAnalyticsConsent(granted: boolean): void {
  _consent = granted;
  if (!granted) {
    _queue = [];
    if (_flushTimer) {
      clearTimeout(_flushTimer);
      _flushTimer = null;
    }
  }
}

export function setAnalyticsLocale(locale: EventLocale | null): void {
  _locale = locale;
}

export function setAnalyticsUser(userId: string | null): void {
  _userId = userId;
}

export function setAnalyticsSource(source: "web" | "tg"): void {
  _source = source;
}

/**
 * Enqueue a client event. Drops silently if consent isn't granted or the
 * name isn't on the allowlist — caller never has to handle errors.
 */
export function track(
  name: string,
  properties: Record<string, unknown> = {},
  page?: string,
): void {
  if (!_consent) return;
  if (!isAllowedClientEvent(name)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[analytics] ignored unknown event "${name}"`);
    }
    return;
  }
  _queue.push({
    name,
    ts: new Date().toISOString(),
    page: page ?? (typeof location !== "undefined" ? location.pathname : null),
    properties,
  });
  if (_queue.length >= FLUSH_THRESHOLD) {
    void flush();
  } else {
    scheduleFlush();
  }
}

/** Convenience for the most common event — call on every route change. */
export function trackPageView(page?: string, extra: Record<string, unknown> = {}): void {
  track("page_view", extra, page);
}

let _listenersAttached = false;

/**
 * Install pagehide / visibilitychange listeners so the queue is drained on
 * navigation. Idempotent — safe to call from a top-level effect.
 */
export function initAnalyticsLifecycle(): void {
  if (_listenersAttached || typeof window === "undefined") return;
  _listenersAttached = true;
  const onHide = () => flushSync();
  window.addEventListener("pagehide", onHide);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSync();
  });
}
