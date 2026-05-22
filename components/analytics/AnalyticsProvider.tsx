"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, setAnalyticsLocale } from "@/lib/analytics/track";

type Locale = "bg" | "en" | "ru" | "ua";

interface Props {
  locale: Locale;
}

/**
 * Fires page_view on every route change (initial mount + SPA navigation).
 * Consent gating happens inside lib/analytics/track — calls are no-ops until
 * the user accepts the analytics category. The locale is forwarded once so
 * every event in the warehouse can be split by audience.
 *
 * Mounted from [locale]/layout.tsx alongside the ConsentManager.
 */
export default function AnalyticsProvider({ locale }: Props) {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    setAnalyticsLocale(locale);
  }, [locale]);

  useEffect(() => {
    // Build the URL the way we want it stored: pathname only, with no PII.
    // We do NOT include query strings to avoid recording tokens / form data
    // that some forms put in the URL on submit.
    const page = pathname || "/";
    if (page === lastTracked.current) return;
    lastTracked.current = page;

    // utm_* attribution lives in properties so the funnel mat-views can
    // group by source without us indexing the full querystring.
    const utm = {
      utm_source: search?.get("utm_source") ?? undefined,
      utm_medium: search?.get("utm_medium") ?? undefined,
      utm_campaign: search?.get("utm_campaign") ?? undefined,
      utm_content: search?.get("utm_content") ?? undefined,
      utm_term: search?.get("utm_term") ?? undefined,
    };
    const cleanUtm = Object.fromEntries(
      Object.entries(utm).filter(([, v]) => Boolean(v)),
    );

    trackPageView(page, {
      ...(Object.keys(cleanUtm).length > 0 ? cleanUtm : {}),
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  }, [pathname, search]);

  return null;
}
