-- Clima — Initial Database Schema
-- Air conditioner catalog for Bulgarian market

-- ==============================================
-- TRIGGER FUNCTION: auto-update updated_at
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- TABLE: categories
-- ==============================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  group_code TEXT NOT NULL,
  group_name TEXT NOT NULL,
  subgroup_code TEXT NOT NULL,
  subgroup_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT,
  name_ru TEXT,
  name_ua TEXT,
  meta_title TEXT,
  meta_description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_code, subgroup_code)
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- TABLE: products
-- ==============================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  bittel_id TEXT NOT NULL UNIQUE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  title_override TEXT,
  slug TEXT NOT NULL UNIQUE,
  manufacturer TEXT,
  description TEXT,
  description_override TEXT,
  color TEXT,
  barcode TEXT,
  link_bittel TEXT,

  -- Pricing (EUR incl. VAT)
  price_client NUMERIC(10,2) DEFAULT 0,
  price_override NUMERIC(10,2),
  price_promo NUMERIC(10,2) DEFAULT 0,
  is_promo BOOLEAN DEFAULT FALSE,

  -- Availability
  availability TEXT DEFAULT 'Неналичен'
    CHECK (availability IN ('Наличен', 'Ограничена наличност', 'Неналичен')),
  stock_size INT,
  is_ask BOOLEAN DEFAULT FALSE,

  -- Media
  gallery JSONB DEFAULT '[]'::jsonb,

  -- Specs (full JSON from API)
  features JSONB DEFAULT '{}'::jsonb,

  -- Extracted key specs for filtering
  btu INT,
  energy_class TEXT,
  area_m2 INT,
  noise_db_indoor INT,
  refrigerant TEXT,
  warranty_months INT,
  seer NUMERIC(5,2),
  scop NUMERIC(5,2),

  -- Transport
  transport_packages JSONB DEFAULT '[]'::jsonb,

  -- SEO overrides
  meta_title TEXT,
  meta_description TEXT,

  -- Admin controls
  is_hidden BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_bittel_id ON products(bittel_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);
CREATE INDEX idx_products_btu ON products(btu);
CREATE INDEX idx_products_price ON products(price_client);
CREATE INDEX idx_products_availability ON products(availability);
CREATE INDEX idx_products_active_visible ON products(is_active, is_hidden)
  WHERE is_active = TRUE AND is_hidden = FALSE;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- TABLE: price_history
-- ==============================================
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  price_client NUMERIC(10,2),
  price_promo NUMERIC(10,2),
  availability TEXT,
  stock_size INT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id, recorded_at DESC);

-- ==============================================
-- TABLE: inquiries
-- ==============================================
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  locale TEXT DEFAULT 'bg',
  source TEXT,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- TABLE: site_settings
-- ==============================================
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('contact', '{"phone": "+359 XX XXX XXXX", "email": "info@clima.bg", "address": "България"}'::jsonb),
  ('currency', '{"default": "BGN", "eur_to_bgn": 1.95583}'::jsonb);

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read active products"
  ON products FOR SELECT TO anon
  USING (is_active = TRUE AND is_hidden = FALSE);

-- Authenticated full access (admin)
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access products"
  ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access price_history"
  ON price_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access inquiries"
  ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inquiries: anon can insert (form submissions)
CREATE POLICY "Anon can submit inquiries"
  ON inquiries FOR INSERT TO anon WITH CHECK (true);

-- Site settings: public read
CREATE POLICY "Public can read settings"
  ON site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Admin full access settings"
  ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Price history: only authenticated can read
CREATE POLICY "Only admin can read price history"
  ON price_history FOR SELECT TO authenticated USING (true);
