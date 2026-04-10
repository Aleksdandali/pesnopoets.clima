-- Add translation columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS title_ru TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS title_ua TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ua TEXT;
