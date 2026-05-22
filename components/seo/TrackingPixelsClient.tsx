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
    // one-way latch — false→true only.
    return onConsentChange((state) => {
      if (state?.analytics) setAnalyticsOk(true);
      if (state?.marketing) setMarketingOk(true);
    });
  }, []);

  if (!ready) return null;

  // gtag.js: load once with a primary tag id; subsequent gtag('config', ...)
  // calls register additional tags on the same library instance. Choose the
  // boot id based on which categories are allowed.
  const gtagAdsId = marketingOk ? googleAdsId : null;
  const gtagGa4Id = analyticsOk ? ga4Id : null;
  const gtagBootId = gtagAdsId ?? gtagGa4Id;

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
              gtag('js', new Date());
              ${gtagAdsId ? `gtag('config', '${gtagAdsId}');` : ""}
              ${gtagGa4Id ? `gtag('config', '${gtagGa4Id}');` : ""}
              window.__ANALYTICS = ${JSON.stringify({
                googleAdsId: gtagAdsId,
                ga4Id: gtagGa4Id,
              })};
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
