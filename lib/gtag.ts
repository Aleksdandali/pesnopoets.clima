/**
 * Google Ads + GA4 conversion tracking.
 *
 * Conversion actions (create these in Google Ads → Goals → Conversions):
 *   1. inquiry_submit  (Primary)  — form/one-click inquiry
 *   2. cart_submit      (Primary)  — cart checkout inquiry
 *   3. chat_lead        (Primary)  — AI consultant lead collection
 *   4. phone_click      (Secondary) — tel: link click
 *   5. messenger_click  (Secondary) — WhatsApp/Viber click
 *
 * Until you add Conversion Labels from Google Ads, events are sent
 * as custom events that GA4 can pick up and forward to Google Ads
 * via the GA4 ↔ Google Ads linking.
 */

export const GA_ID = "AW-18063225430";

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

function getGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag ?? null;
}

/** Push an event to dataLayer (works with both gtag.js and GTM). */
function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  const gtag = getGtag();
  if (gtag) {
    gtag("event", eventName, { send_to: GA_ID, ...params });
  }
}

// ---------------------------------------------------------------------------
// Primary conversions — these drive Smart Bidding
// ---------------------------------------------------------------------------

/** Form inquiry submitted (one-click, product page, inquiry page). */
export function trackInquirySubmit(source?: string) {
  pushEvent("conversion", {
    event_category: "lead",
    event_label: source ?? "inquiry",
    value: 25,
    currency: "EUR",
  });
  // Also fire a GA4-friendly event name
  pushEvent("generate_lead", {
    event_category: "lead",
    event_label: source ?? "inquiry",
    value: 25,
    currency: "EUR",
  });
}

/** Cart checkout inquiry submitted. */
export function trackCartSubmit(itemCount: number = 1) {
  pushEvent("conversion", {
    event_category: "lead",
    event_label: "cart",
    value: 50,
    currency: "EUR",
  });
  pushEvent("generate_lead", {
    event_category: "lead",
    event_label: "cart",
    value: 50,
    currency: "EUR",
    items_count: itemCount,
  });
}

/** AI consultant collected a lead (name + phone). */
export function trackChatLead() {
  pushEvent("conversion", {
    event_category: "lead",
    event_label: "consultant-chat",
    value: 25,
    currency: "EUR",
  });
  pushEvent("generate_lead", {
    event_category: "lead",
    event_label: "consultant-chat",
    value: 25,
    currency: "EUR",
  });
}

// ---------------------------------------------------------------------------
// Secondary conversions — for reporting only, not bidding
// ---------------------------------------------------------------------------

/** Click on tel: phone link. */
export function trackPhoneClick() {
  pushEvent("phone_click", {
    event_category: "contact",
    event_label: "phone",
    value: 5,
    currency: "EUR",
  });
}

/** Click on WhatsApp or Viber link. */
export function trackMessengerClick(messenger: "whatsapp" | "viber") {
  pushEvent("messenger_click", {
    event_category: "contact",
    event_label: messenger,
    value: 5,
    currency: "EUR",
  });
}

// ---------------------------------------------------------------------------
// Backward compatibility — old trackConversion() calls still work
// ---------------------------------------------------------------------------

/** @deprecated Use trackInquirySubmit, trackCartSubmit, or trackChatLead instead. */
export function trackConversion(eventName: string = "conversion") {
  pushEvent(eventName, {
    event_category: "lead",
    value: 25,
    currency: "EUR",
  });
}
