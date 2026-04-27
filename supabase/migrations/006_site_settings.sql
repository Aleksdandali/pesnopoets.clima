-- Site settings table for tracking pixels and other config
-- Managed via /admin panel

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default pixel keys
INSERT INTO site_settings (key, value) VALUES
  ('meta_pixel_id', ''),
  ('tiktok_pixel_id', ''),
  ('google_ads_id', 'AW-18063225430'),
  ('custom_head_scripts', '')
ON CONFLICT (key) DO NOTHING;

-- RLS: public can read (for layout injection), only service_role can write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only service_role can modify site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role');
