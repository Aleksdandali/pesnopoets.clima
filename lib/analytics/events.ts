// Single source of truth for analytics event names. Web, mini-app, mobile, and
// server-side emitters all import from here so typos and rogue events can't
// pollute the warehouse.

export const CLIENT_EVENTS = [
  // Page / screen
  "page_view",
  "screen_view",
  // Engagement
  "scroll_25",
  "scroll_75",
  "video_play",
  "search",
  // Contact intents (forwarded server-side too where possible)
  "phone_click",
  "whatsapp_click",
  "viber_click",
  "telegram_click",
  "instagram_click",
  // Funnel
  "inquiry_started",
  "cart_add",
  "cart_remove",
  // Mini-app
  "tg_open",
  "tg_consent_given",
  // Mobile
  "mobile_app_open",
  "mobile_login_success",
  "mobile_chat_opened",
  "mobile_photo_uploaded",
  "mobile_installation_created",
  "mobile_installation_confirmed",
  "mobile_job_completed",
  "mobile_push_received",
] as const;

export const SERVER_EVENTS = [
  "inquiry_submitted",
  "ai_consultant_message",
  "ai_insight_run",
  // revenue_recognized is emitted by DB trigger, not via API
] as const;

export const ALL_EVENTS = [...CLIENT_EVENTS, ...SERVER_EVENTS] as const;

export type ClientEventName = (typeof CLIENT_EVENTS)[number];
export type ServerEventName = (typeof SERVER_EVENTS)[number];
export type EventName = (typeof ALL_EVENTS)[number];

const CLIENT_EVENT_SET = new Set<string>(CLIENT_EVENTS);

export function isAllowedClientEvent(name: string): name is ClientEventName {
  return CLIENT_EVENT_SET.has(name);
}

export type EventSource = "web" | "tg" | "mobile" | "server" | "admin";

export const ALLOWED_SOURCES: ReadonlySet<EventSource> = new Set([
  "web",
  "tg",
  "mobile",
  "server",
  "admin",
]);

export const ALLOWED_LOCALES = ["bg", "en", "ru", "ua"] as const;
export type EventLocale = (typeof ALLOWED_LOCALES)[number];

// Hard caps to keep the warehouse cheap and predictable.
export const LIMITS = {
  /** Max stringified JSON length for the `properties` field, in bytes. */
  PROPERTIES_BYTES: 4096,
  /** Max length for `page` (URL path or screen name). */
  PAGE_CHARS: 500,
  /** Max length for `anon_id` / `session_id`. */
  ID_CHARS: 64,
  /** Max events per single batch POST. */
  BATCH_SIZE: 20,
} as const;
