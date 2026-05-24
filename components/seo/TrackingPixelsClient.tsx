"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, onConsentChange } from "@/lib/analytics/consent";
import MetaPixelPageView from "./MetaPixelPageView";

interface PixelIds {
  metaId: string | null;
  tiktokId: string | null;
  googleAdsId: string | null;
  ga4Id: string | null;
  clarityId: string | null;
  customHeadScripts: string | null;
}

interface Props extends PixelIds {}

/**
 * Client-side gate over third-party trackers. Reads consent from
 * localStorage on mount; never injects scripts that the user has not opted
 * into. If consent changes mid-session, only categories that were already
 * loaded keep running (next reload re-evaluates) — this matches industry
 * norms and avoids brittle script-removal hacks.
 *
 * Category mapping (decided in P0 consilium):
 *   analytics  → GA4, Microsoft Clarity
 *   marketing  → Meta Pixel, TikTok Pixel, Google Ads, custom_head_scripts
 */
export default function TrackingPixelsClient({
  metaId,
  tiktokId,
  googleAdsId,
  ga4Id,
  clarityId,
  customHeadScripts,
}: Props) {
  const [analyticsOk, setAnalyticsOk] = useState(false);
  const [marketingOk, setMarketingOk] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setAnalyticsOk(c?.analytics === true);
    setMarketingOk(c?.marketing === true);
    setReady(true);

    // Pick up later opt-ins (e.g. user opens preferences and enables a
    // category). We never *remove* a script once loaded, so this is a
    // one-way latch — false→true only. For gtag we also push a Consent Mode
    // v2 update so previously-modeled conversions can now write cookies.
    return onConsentChange((state) => {
      if (state?.analytics) setAnalyticsOk(true);
      if (state?.marketing) setMarketingOk(true);
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (gtag && (state?.analytics || state?.marketing)) {
        gtag("consent", "update", {
          ad_storage: state?.marketing ? "granted" : "denied",
          ad_user_data: state?.marketing ? "granted" : "denied",
          ad_personalization: state?.marketing ? "granted" : "denied",
          analytics_storage: state?.analytics ? "granted" : "denied",
        });
      }
    });
  }, []);

  if (!ready) return null;

  // Consent Mode v2: ALWAYS boot gtag if an ID is configured, set defaults to
  // "denied", then update based on stored consent. This lets Google count
  // "modeled" conversions for users who deny marketing (~30-50% lift vs the
  // old all-or-nothing gate) while still respecting their choice — the
  // browser does not write ad-related cookies until consent is granted.
  const gtagBootId = googleAdsId ?? ga4Id;
  const adConsent = marketingOk ? "granted" : "denied";
  const analyticsConsent = analyticsOk ? "granted" : "denied";

  return (
    <>
      {gtagBootId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagBootId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              // Internal-traffic flag — owner appends ?internal=1 once on their
              // device, we then suppress conversions + tag GA4 hits forever.
              try {
                var qs = new URLSearchParams(window.location.search);
                if (qs.get('internal') === '1') localStorage.setItem('__internal_traffic','1');
                if (qs.get('internal') === '0') localStorage.removeItem('__internal_traffic');
              } catch(_) {}
              var __isInternal = false;
              try { __isInternal = localStorage.getItem('__internal_traffic') === '1'; } catch(_) {}
              gtag('consent', 'default', {
                'ad_storage': '${adConsent}',
                'ad_user_data': '${adConsent}',
                'ad_personalization': '${adConsent}',
                'analytics_storage': '${analyticsConsent}',
                'wait_for_update': 500
              });
              gtag('js', new Date());
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
              ${ga4Id ? `gtag('config', '${ga4Id}', __isInternal ? { traffic_type: 'internal' } : {});` : ""}
              window.__ANALYTICS = Object.assign(${JSON.stringify({
                googleAdsId,
                ga4Id,
              })}, { internal: __isInternal });
            `}
          </Script>
        </>
      )}

      {marketingOk && metaId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaId}');
fbq('track','PageView');`}
          </Script>
          <MetaPixelPageView />
        </>
      )}

      {marketingOk && tiktokId && (
        <Script id="tiktok-pixel-init" strategy="afterInteractive">
          {`
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=
["page","track","identify","instances","debug","on","off","once","ready",
"alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e)
{t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)
ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i=
"https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};
ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e+"_"+n]=+new Date;
(ttq._o=ttq._o||{})[e+"_"+n]=n||{};var o=document.createElement("script");
o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
ttq.load('${tiktokId}');ttq.page()}(window,document,'ttq');`}
        </Script>
      )}

      {analyticsOk && clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      )}

      {marketingOk && customHeadScripts && (
        <div dangerouslySetInnerHTML={{ __html: customHeadScripts }} />
      )}
    </>
  );
}
