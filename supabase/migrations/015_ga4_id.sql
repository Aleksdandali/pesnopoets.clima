-- Add GA4 measurement ID + ensure Google Ads ID seed in site_settings.
-- Managed via /admin → Tracking pixels.
-- The `value` column is JSONB (per migration 001), so plain strings must
-- be wrapped as JSON string literals (with double quotes) and cast to JSONB.

INSERT INTO site_settings (key, value) VALUES
  ('ga4_id', '"G-0QPS7F89RF"'::jsonb),
  ('google_ads_id', '"AW-18063225430"'::jsonb),
  ('meta_pixel_id', '""'::jsonb),
  ('tiktok_pixel_id', '""'::jsonb),
  ('custom_head_scripts', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;
