-- Migration 029: second supplier feed (Bulclima) alongside Bittel.
--
-- Every existing row came from Bittel, so the default backfills them. Each
-- sync deactivates only its own supplier's products.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier TEXT NOT NULL DEFAULT 'bittel'
    CHECK (supplier IN ('bittel', 'bulclima'));

CREATE INDEX IF NOT EXISTS idx_products_supplier_active ON products(supplier, is_active);

COMMENT ON COLUMN products.supplier IS 'Feed the product is synced from: bittel | bulclima.';
COMMENT ON COLUMN products.bittel_id IS
  'Supplier product id, unique across suppliers: the Bittel id as-is, Bulclima as "BC-<id>".';

-- The accessories category had an empty subgroup name, which rendered as a
-- blank row in the catalog sidebar. Bulclima adds Wi-Fi modules, controllers
-- and condensate pumps here.
UPDATE categories
SET subgroup_name = 'АКСЕСОАРИ И УПРАВЛЕНИЕ',
    name_en = 'Accessories & Controls',
    name_ru = 'Аксессуары и управление',
    name_ua = 'Аксесуари та керування'
WHERE group_code = '90_АКСЕСОАРИ' AND subgroup_code = '' AND subgroup_name = '';
