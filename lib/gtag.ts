/**
 * Google Ads conversion tracking helper.
 * Fires a gtag conversion event. Safe to call server-side (no-ops silently).
 */

export const GA_ID = "AW-18063225430";

export function trackConversion(eventName: string = "conversion") {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  gtag("event", eventName, {
    send_to: GA_ID,
  });
}
