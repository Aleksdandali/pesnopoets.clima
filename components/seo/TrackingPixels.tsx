import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import TrackingPixelsClient from "./TrackingPixelsClient";

// Plain anon client — no cookies, no `next/headers` access. Reading
// cookies() here used to drag the entire route tree into Dynamic SSR
// (Vercel responded with `cache-control: no-store` on every page),
// because TrackingPixels lives in the root layout. Pixel IDs are public
// site settings, so the cookied SSR client gave us nothing useful.

interface PixelSettings {
  meta_pixel_id?: string;
  tiktok_pixel_id?: string;
  google_ads_id?: string;
  ga4_id?: string;
  clarity_id?: string;
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

/** Validate Clarity project ID — 8-12 lowercase alphanumeric chars. */
function sanitizeClarityId(id: string): string | null {
  const trimmed = id.trim().toLowerCase();
  return /^[a-z0-9]{8,12}$/.test(trimmed) ? trimmed : null;
}

// Cached for 1h with a tag so the admin panel can revalidate on save
// via `revalidateTag('pixel_settings')`. Falls back silently to {} so
// a Supabase outage never breaks rendering of the whole site.
const getPixelSettings = unstable_cache(
  async (): Promise<PixelSettings> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "meta_pixel_id",
          "tiktok_pixel_id",
          "google_ads_id",
          "ga4_id",
          "clarity_id",
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
  },
  ["pixel_settings"],
  { revalidate: 3600, tags: ["pixel_settings"] }
);

export default async function TrackingPixels() {
  const settings = await getPixelSettings();
  const metaId = settings.meta_pixel_id ? sanitizePixelId(settings.meta_pixel_id) : null;
  const tiktokId = settings.tiktok_pixel_id?.replace(/[^a-zA-Z0-9]/g, "") || null;
  const googleAdsId = settings.google_ads_id ? sanitizeGoogleAdsId(settings.google_ads_id) : null;
  const ga4Id = settings.ga4_id ? sanitizeGa4Id(settings.ga4_id) : null;
  const clarityId = settings.clarity_id ? sanitizeClarityId(settings.clarity_id) : null;
  const customHeadScripts = settings.custom_head_scripts || null;

  // Sanitized IDs cross the server/client boundary as plain props. The client
  // component decides which to actually inject based on consent state.
  return (
    <TrackingPixelsClient
      metaId={metaId}
      tiktokId={tiktokId}
      googleAdsId={googleAdsId}
      ga4Id={ga4Id}
      clarityId={clarityId}
      customHeadScripts={customHeadScripts}
    />
  );
}
