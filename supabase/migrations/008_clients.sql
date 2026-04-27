-- Clients table — unique customers by phone
-- Auto-populated from inquiries, managed in admin

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  locale TEXT DEFAULT 'bg',
  telegram_id TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  total_inquiries INT DEFAULT 0,
  last_inquiry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link inquiries to clients
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS client_id INT REFERENCES clients(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_clients" ON clients FOR ALL TO service_role USING (true);
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_clients" ON clients FOR SELECT TO anon USING (true);

CREATE INDEX idx_clients_phone ON clients (phone);
CREATE INDEX idx_clients_created ON clients (created_at DESC);
CREATE INDEX idx_inquiries_client ON inquiries (client_id);

-- Backfill: create clients from existing inquiries
INSERT INTO clients (phone, name, email, locale, total_inquiries, last_inquiry_at, created_at)
SELECT
  phone,
  MAX(name),
  MAX(email),
  MAX(locale),
  COUNT(*)::int,
  MAX(created_at),
  MIN(created_at)
FROM inquiries
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
ON CONFLICT (phone) DO NOTHING;

-- Link existing inquiries to clients
UPDATE inquiries i
SET client_id = c.id
FROM clients c
WHERE i.phone = c.phone AND i.client_id IS NULL;
