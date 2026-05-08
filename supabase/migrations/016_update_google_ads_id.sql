-- Update Google Ads conversion tag id to match the GA4-linked Ads account.
-- GA4 property p536753129 is now linked to Google Ads account 312-034-9748,
-- so conversion events must route there (was previously the legacy AW-18063225430).
-- The `value` column is JSONB (per migration 001), so the string is wrapped
-- as a JSON string literal and cast to JSONB.

UPDATE site_settings
SET value = '"AW-3120349748"'::jsonb
WHERE key = 'google_ads_id';
