-- AI enrichment fields for the consultant.
-- Purpose: give the AI consultant richer semantic hints per product so it can
-- argue the recommendation like an expert, instead of just listing raw specs.
-- All three columns are nullable — products without tags still work unchanged
-- (the AI falls back to generating arguments from BTU/noise/price as before).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS selling_points jsonb,
  ADD COLUMN IF NOT EXISTS best_for       jsonb,
  ADD COLUMN IF NOT EXISTS warnings       jsonb;

-- Example shape (per row, any subset; any locale — the AI speaks all four):
-- selling_points: ["тихий 18 дБ", "премиум инвертор", "Wi-Fi Daikin Onecta"]
-- best_for:       ["спальня", "детская", "для аллергиков"]
-- warnings:       ["не тянет большую гостиную летом на юге"]

COMMENT ON COLUMN products.selling_points IS 'Array of short positive hooks the AI can use in product recommendations. Optional. Any language the site supports.';
COMMENT ON COLUMN products.best_for       IS 'Array of scenarios where this product is a great fit (e.g. "спальня", "детская"). Optional.';
COMMENT ON COLUMN products.warnings       IS 'Array of honest limitations (e.g. "не для большой гостиной"). AI will mention these when relevant. Optional.';
