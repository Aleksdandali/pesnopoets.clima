// Consent state for GDPR / ePrivacy compliance.
//
// Three categories: `necessary` is always on, `analytics` covers our own
// /api/track + PostHog + Clarity, `marketing` covers Meta Pixel + TikTok +
// Google Ads. Categories are stored in localStorage as JSON; the absence of a
// stored decision means the user has not yet chosen — banner must be shown.

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true; // type-level invariant: always granted
  analytics: boolean;
  marketing: boolean;
  /** ISO-8601 timestamp of when this decision was recorded. */
  decidedAt: string;
  /** Schema version — bump when categories change to force re-prompt. */
  v: 1;
};

const STORAGE_KEY = "pc_consent_v1";
const SCHEMA_VERSION = 1;

const listeners = new Set<(state: ConsentState | null) => void>();

export function readConsent(): ConsentState | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.v !== SCHEMA_VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
      v: SCHEMA_VERSION,
    };
  } catch {
    return null;
  }
}

export function writeConsent(decision: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: decision.analytics,
    marketing: decision.marketing,
    decidedAt: new Date().toISOString(),
    v: SCHEMA_VERSION,
  };
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  for (const cb of listeners) cb(state);
  return state;
}

export function clearConsent(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  for (const cb of listeners) cb(null);
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(cb: (state: ConsentState | null) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Convenience helpers for callers that only care about a single category. */
export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return readConsent()?.marketing === true;
}
