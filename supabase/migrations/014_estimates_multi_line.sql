-- Multi-line estimates: Daikin-style with multiple equipment + multiple labor lines.
-- Backwards compatible: old fields (product_id, base_install_bgn, extras, ...) are kept
-- and used as a fallback when equipment_lines / labor_lines are empty.

ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS equipment_lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS labor_lines     jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS kp_number       text,
  ADD COLUMN IF NOT EXISTS valid_until     date;

-- Sequence used to mint kp_number on POST (`КП-YYYY-NNNN`).
CREATE SEQUENCE IF NOT EXISTS estimates_kp_seq START 1;

CREATE INDEX IF NOT EXISTS idx_estimates_kp_number ON estimates(kp_number);

-- RPC for the API: return the next formatted KP number.
CREATE OR REPLACE FUNCTION next_kp_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n bigint;
BEGIN
  n := nextval('estimates_kp_seq');
  RETURN 'КП-' || extract(year FROM now())::text || '-' || lpad(n::text, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION next_kp_number() TO service_role;
