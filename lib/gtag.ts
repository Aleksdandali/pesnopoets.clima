/**
 * Google Ads + GA4 + Meta Pixel conversion tracking.
 *
 * All conversion points fire to BOTH Google Ads/GA4 AND Meta Pixel.
 *
 * Conversion actions:
 *   1. inquiry_submit  (Primary)  — form/one-click inquiry     → Meta: Lead
 *   2. cart_submit      (Primary)  — cart checkout inquiry      → Meta: Lead
 *   3. chat_lead        (Primary)  — AI consultant lead         → Meta: Lead
 *   4. phone_click      (Secondary) — tel: link click           → Meta: Contact
 *   5. messenger_click  (Secondary) — WhatsApp/Viber click      → Meta: Contact
 */

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

function getGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag ?? null;
}

function getFbq(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq ?? null;
}

/**
 * Resolve the configured Google Ads tag id from the runtime config injected
 * by `<TrackingPixels />`. Returns null if not configured (e.g. site_settings
 * row is empty), in which case "conversion" events are dropped to avoid
 * polluting GA4 with mis-routed events.
 */
function getGoogleAdsId(): string | null {
  if (typeof window === "undefined") return null;
  const cfg = (window as unknown as { __ANALYTICS?: { googleAdsId?: string | null } }).__ANALYTICS;
  return cfg?.googleAdsId ?? null;
}

/**
 * Conversion action labels — tied to Google Ads account AW-18063225430.
 * Created 2026-05-15. If admin switches `google_ads_id` in site_settings to
 * a different AW account, these labels stop matching and must be regenerated.
 */
const CONVERSION_LABELS = {
  inquiry: "srr_CL3MtK0cENbkm6VD", // "Заявка с сайта" — forms, cart, chat lead
  phone: "mwOlCMDMtK0cENbkm6VD", // "Клик по телефону"
  whatsapp: "cGmyCMPMtK0cENbkm6VD", // "Клик WhatsApp"
  viber: "AJojCKrwzq0cENbkm6VD", // "Клик Viber"
} as const;

type ConversionKey = keyof typeof CONVERSION_LABELS;

/**
 * Fire a Google Ads conversion with the specific action label.
 * Dropped if Google Ads ID is not configured.
 */
function pushConversion(key: ConversionKey, params: Record<string, unknown> = {}) {
  const gtag = getGtag();
  if (!gtag) return;
  const adsId = getGoogleAdsId();
  if (!adsId) return;
  gtag("event", "conversion", {
    send_to: `${adsId}/${CONVERSION_LABELS[key]}`,
    ...params,
  });
}

/**
 * Push a non-conversion event to gtag (goes to GA4 + Ads remarketing audiences).
 */
function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", eventName, params);
}

/** Fire a Meta Pixel event. */
function pushFbq(eventName: string, params?: Record<string, unknown>) {
  const fbq = getFbq();
  if (fbq) {
    if (params) {
      fbq("track", eventName, params);
    } else {
      fbq("track", eventName);
    }
  }
}

/** Fire a custom Meta Pixel event. */
function pushFbqCustom(eventName: string, params?: Record<string, unknown>) {
  const fbq = getFbq();
  if (fbq) {
    if (params) {
      fbq("trackCustom", eventName, params);
    } else {
      fbq("trackCustom", eventName);
    }
  }
}

// ---------------------------------------------------------------------------
// Primary conversions — drive Smart Bidding (Google) + Optimization (Meta)
// ---------------------------------------------------------------------------

/** Form inquiry submitted (one-click, product page, inquiry page). */
export function trackInquirySubmit(source?: string) {
  pushConversion("inquiry", {
    event_label: source ?? "inquiry",
    value: 25,
    currency: "EUR",
  });
  pushEvent("generate_lead", {
    event_category: "lead",
    event_label: source ?? "inquiry",
    value: 25,
    currency: "EUR",
  });
  // Meta Pixel: Lead
  pushFbq("Lead", { value: 25, currency: "EUR", content_name: source ?? "inquiry" });
}

/** Cart checkout inquiry submitted. */
export function trackCartSubmit(itemCount: number = 1) {
  pushConversion("inquiry", {
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
  // Meta Pixel: Lead (cart checkout = higher value lead)
  pushFbq("Lead", { value: 50, currency: "EUR", content_name: "cart", num_items: itemCount });
}

/** AI consultant collected a lead (name + phone). */
export function trackChatLead() {
  pushConversion("inquiry", {
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
  // Meta Pixel: Lead
  pushFbq("Lead", { value: 25, currency: "EUR", content_name: "consultant-chat" });
}

// ---------------------------------------------------------------------------
// Secondary conversions — reporting (Google) + audience building (Meta)
// ---------------------------------------------------------------------------

/** Click on tel: phone link. */
export function trackPhoneClick() {
  pushConversion("phone", {
    event_label: "phone",
    value: 5,
    currency: "EUR",
  });
  pushEvent("phone_click", {
    event_category: "contact",
    event_label: "phone",
    value: 5,
    currency: "EUR",
  });
  // Meta Pixel: Contact
  pushFbq("Contact", { value: 5, currency: "EUR", content_name: "phone" });
}

/** Click on WhatsApp or Viber link. */
export function trackMessengerClick(messenger: "whatsapp" | "viber") {
  pushConversion(messenger, {
    event_label: messenger,
    value: 5,
    currency: "EUR",
  });
  pushEvent("messenger_click", {
    event_category: "contact",
    event_label: messenger,
    value: 5,
    currency: "EUR",
  });
  // Meta Pixel: Contact
  pushFbq("Contact", { value: 5, currency: "EUR", content_name: messenger });
}

// ---------------------------------------------------------------------------
// Additional Meta Pixel events for retargeting
// ---------------------------------------------------------------------------

/** Product page viewed — for Meta dynamic retargeting. */
export function trackProductView(productId: string | number, title: string, priceEur: number) {
  // Meta: ViewContent
  pushFbq("ViewContent", {
    content_ids: [String(productId)],
    content_name: title,
    content_type: "product",
    value: priceEur,
    currency: "EUR",
  });
}

/** Product added to cart — for Meta dynamic retargeting. */
export function trackAddToCart(productId: string | number, title: string, priceEur: number) {
  // Meta: AddToCart
  pushFbq("AddToCart", {
    content_ids: [String(productId)],
    content_name: title,
    content_type: "product",
    value: priceEur,
    currency: "EUR",
  });
}

/** Catalog page viewed — for Meta audience building. */
export function trackCatalogView() {
  pushFbqCustom("ViewCatalog");
}

