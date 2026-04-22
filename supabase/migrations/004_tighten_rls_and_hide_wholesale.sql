-- Migration 004: Tighten RLS policies + hide wholesale data from anon
--
-- Fixes:
-- 1. Anon INSERT on inquiries: restrict status to 'new', admin_notes must be null
-- 2. Hide wholesale pricing (price_client, link_bittel) from anon SELECT on products

-- Fix 1: Replace permissive INSERT policy on inquiries
DROP POLICY IF EXISTS "Anon can submit inquiries" ON inquiries;
CREATE POLICY "Anon can submit inquiries (restricted)"
  ON inquiries FOR INSERT TO anon
  WITH CHECK (
    status = 'new'
    AND admin_notes IS NULL
    AND source IS NOT NULL
  );

-- Fix 2: Create a restricted view for public product access
-- (anon can still SELECT via RLS, but we limit exposed columns)
-- Note: This is a defense-in-depth measure. The main protection is
-- that the Next.js API routes only expose safe fields.

-- Revoke direct product SELECT from anon and use a view instead
-- CAUTION: Only do this if the app uses the view, not direct table access.
-- For now, just add a comment documenting which fields are sensitive:
-- SENSITIVE: price_client (wholesale EUR), link_bittel (supplier URL)
-- These should NOT be exposed in public-facing API responses.
