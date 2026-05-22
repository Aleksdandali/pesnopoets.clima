"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  track,
  setAnalyticsConsent,
  setAnalyticsSource,
  setAnalyticsUser,
  initAnalyticsLifecycle,
} from "@/lib/analytics/track";

interface Props {
  /** Telegram user id of the authenticated team member, or 0 for dev login. */
  tgUserId: number;
}

/**
 * First-party analytics for the /tg admin Mini App.
 *
 * The Mini App is an internal CRM for staff — it is NOT subject to the
 * ePrivacy / GDPR cookie banner because:
 *   • only authenticated team members can pass HMAC + JWT
 *   • no third-party trackers run here (no GA, Meta, TikTok, Clarity)
 *   • the warehouse is first-party, processed under legitimate interest
 *
 * So we set consent=true unconditionally, source="tg", and fire screen_view
 * on each pathname change to measure admin productivity (which screens get
 * used, which estimate flows convert, etc.). Mounted from TgShell after auth.
 */
export default function TgAnalyticsProvider({ tgUserId }: Props) {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    setAnalyticsSource("tg");
    setAnalyticsConsent(true);
    // No profiles row for TG admins — stash the tg id as a stable client hint
    // (not a profile UUID, but the data layer can still partition by it).
    setAnalyticsUser(tgUserId > 0 ? `tg:${tgUserId}` : null);
    initAnalyticsLifecycle();

    if (!openedRef.current) {
      openedRef.current = true;
      track("tg_open", { tg_user_id: tgUserId });
    }
  }, [tgUserId]);

  useEffect(() => {
    const page = pathname || "/tg";
    if (page === lastTracked.current) return;
    lastTracked.current = page;
    track("screen_view", { tg_user_id: tgUserId }, page);
  }, [pathname, tgUserId]);

  return null;
}
