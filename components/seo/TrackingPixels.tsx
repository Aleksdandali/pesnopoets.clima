import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import MetaPixelPageView from "./MetaPixelPageView";

interface PixelSettings {
  meta_pixel_id?: string;
  tiktok_pixel_id?: string;
  google_ads_id?: string;
  ga4_id?: string;
  custom_head_scripts?: string;
}

/** Sanitize pixel ID — only digits allowed */
function sanitizePixelId(id: string): string | null {
  const clean = id.replace(/[^0-9]/g, "");
  return clean.length >= 10 && clean.length <= 20 ? clean : null;
}

/** Validate Google Ads ID — must match `AW-{10-11 digits}`. Returns canonical form or null. */
function sanitizeGoogleAdsId(id: string): string | null {
  const trimmed = id.trim();
  return /^AW-\d{9,12}$/.test(trimmed) ? trimmed : null;
}

/** Validate GA4 measurement ID — must match `G-{8-12 alphanumeric}`. */
function sanitizeGa4Id(id: string): string | null {
  const trimmed = id.trim();
  return /^G-[A-Z0-9]{8,12}$/.test(trimmed) ? trimmed : null;
}

async function getPixelSettings(): Promise<PixelSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [
        "meta_pixel_id",
        "tiktok_pixel_id",
        "google_ads_id",
        "ga4_id",
        "custom_head_scripts",
      ]);

    if (!data) return {};

    const settings: Record<string, string> = {};
    for (const row of data) {
      if (row.value) settings[row.key] = String(row.value);
    }
    return settings;
  } catch {
    return {};
  }
}

export default async function TrackingPixels() {
  const settings = await getPixelSettings();
  const metaId = settings.meta_pixel_id ? sanitizePixelId(settings.meta_pixel_id) : null;
  const tiktokId = settings.tiktok_pixel_id?.replace(/[^a-zA-Z0-9]/g, "") || null;
  const googleAdsId = settings.google_ads_id ? sanitizeGoogleAdsId(settings.google_ads_id) : null;
  const ga4Id = settings.ga4_id ? sanitizeGa4Id(settings.ga4_id) : null;
  // gtag.js loads once with a primary tag id; subsequent gtag('config', ...) calls
  // register additional tags on the same library instance.
  const gtagBootId = googleAdsId ?? ga4Id;

  return (
    <>
      {/* Google tag (gtag.js) — loaded only when at least one Google ID is configured */}
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
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
              ${ga4Id ? `gtag('config', '${ga4Id}');` : ""}
              window.__ANALYTICS = ${JSON.stringify({ googleAdsId, ga4Id })};
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {metaId && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaId}');
fbq('track','PageView');`,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
          <MetaPixelPageView />
        </>
      )}

      {/* TikTok Pixel */}
      {tiktokId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
ttq.load('${tiktokId}');ttq.page()}(window,document,'ttq');`,
          }}
        />
      )}

      {/* Custom head scripts */}
      {settings.custom_head_scripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.custom_head_scripts }} />
      )}
    </>
  );
}
