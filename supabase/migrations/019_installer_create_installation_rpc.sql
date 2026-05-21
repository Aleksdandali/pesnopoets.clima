-- Migration 019: RPC for installer-side atomic installation creation
--
-- Why an RPC instead of two client INSERTs:
--   1. Atomic — either both `clients` and `installations` succeed or neither.
--   2. Avoids race condition where two installers create the same client by phone.
--   3. SECURITY DEFINER lets us bypass `clients` RLS for the lookup/insert
--      while still enforcing `is_staff()` on the caller.
--
-- Caller (mobile installer app):
--   - generates a UUID client-side (so it can use it as the photo storage path
--     BEFORE the row exists)
--   - uploads the 3 required photos to storage
--   - calls this RPC with the same UUID
--
-- On conflict (UUID collision is astronomically unlikely; still guarded by PK).

CREATE OR REPLACE FUNCTION installer_create_installation(
  p_installation_id UUID,
  p_phone TEXT,
  p_client_name TEXT,
  p_brand TEXT,
  p_model TEXT,
  p_serial TEXT,
  p_btu INT,
  p_address TEXT,
  p_lat NUMERIC,
  p_lng NUMERIC,
  p_install_date DATE,
  p_warranty_months INT,
  p_notes TEXT,
  p_indoor_photo_path TEXT,
  p_outdoor_photo_path TEXT,
  p_label_photo_path TEXT,
  p_extra_photo_paths TEXT[]
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_id INT;
  v_installer UUID := auth.uid();
BEGIN
  IF NOT is_staff() THEN
    RAISE EXCEPTION 'forbidden: staff role required';
  END IF;

  IF p_phone IS NULL OR p_phone = '' THEN
    RAISE EXCEPTION 'phone required';
  END IF;

  -- Find or create CRM client row
  SELECT id INTO v_client_id FROM clients WHERE phone = p_phone LIMIT 1;

  IF v_client_id IS NULL THEN
    INSERT INTO clients (phone, name, locale)
    VALUES (p_phone, COALESCE(NULLIF(p_client_name, ''), ''), 'bg')
    RETURNING id INTO v_client_id;
  ELSIF p_client_name IS NOT NULL AND p_client_name <> '' THEN
    UPDATE clients
       SET name = p_client_name
     WHERE id = v_client_id AND (name IS NULL OR name = '');
  END IF;

  INSERT INTO installations (
    id, client_id, installer_user_id,
    brand, model, serial, btu,
    address, lat, lng,
    install_date, warranty_months, notes,
    indoor_photo_path, outdoor_photo_path, label_photo_path, extra_photo_paths
  ) VALUES (
    p_installation_id, v_client_id, v_installer,
    COALESCE(p_brand, ''), COALESCE(p_model, ''), p_serial, p_btu,
    p_address, p_lat, p_lng,
    COALESCE(p_install_date, CURRENT_DATE), COALESCE(p_warranty_months, 36), p_notes,
    p_indoor_photo_path, p_outdoor_photo_path, p_label_photo_path,
    COALESCE(p_extra_photo_paths, '{}')
  );

  RETURN p_installation_id;
END;
$$;

GRANT EXECUTE ON FUNCTION installer_create_installation TO authenticated;

-- Convenience view: client-facing summary of an installation (joins brand+model+next service).
-- Useful in Sprint 2 (client home) but defined here so it's tied to the same domain.
CREATE OR REPLACE VIEW client_installation_summary AS
SELECT
  i.id,
  i.client_id,
  i.brand,
  i.model,
  i.serial,
  i.btu,
  i.install_date,
  i.warranty_months,
  (i.install_date + (i.warranty_months || ' months')::interval)::date AS warranty_until,
  i.next_service_at,
  i.indoor_photo_path,
  i.outdoor_photo_path,
  i.label_photo_path,
  i.address
FROM installations i;

GRANT SELECT ON client_installation_summary TO authenticated;

-- =====================
-- Storage policy fix
-- =====================
--
-- In migration 018 the read policy assumed the path layout
-- `{client_id}/{installation_id}/...`. Reality: installer uploads photos BEFORE
-- the installation row exists (and therefore before client_id is known) so the
-- actual layout is `{installation_id}/{kind}.jpg`. Replace the SELECT policy
-- with one that joins through the installations table.

DROP POLICY IF EXISTS "read_installation_photos" ON storage.objects;
CREATE POLICY "read_installation_photos" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'installations' AND (
      is_staff()
      OR EXISTS (
        SELECT 1 FROM installations i
         WHERE i.id::text = (storage.foldername(name))[1]
           AND i.client_id = current_user_client_id()
      )
    )
  );

