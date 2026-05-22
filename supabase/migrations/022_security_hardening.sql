-- Migration 022: Security hardening
--
-- Closes 2 P0 findings from senior consilium audit (2026-05-21):
--   S4 — expo_push_token leaks to installer role via is_staff() RLS
--   S7 — clients can tamper with their own messages (rewrite body, flip is_ai)
--
-- Approach:
--   S4: Strip column-level SELECT on expo_push_token from authenticated
--       users. Service role (Next.js cron + notify routes) keeps access via
--       bypass. Mobile clients can no longer read tokens directly; writing
--       their own token is exposed via the set_my_push_token() RPC.
--   S7: Add a BEFORE UPDATE trigger on messages that rejects any change to
--       sender_user_id, conversation_id, body, attachments, is_ai, or
--       created_at when the request comes from an authenticated user
--       (service_role bypasses).
--
-- Idempotent: safe to re-run.

-- =====================
-- S4. expo_push_token column-level lockdown
-- =====================

-- Drop the column-level read permission. authenticated users can no longer
-- SELECT this column. Existing RLS on profiles (self_select_profile,
-- staff_select_profiles) is unaffected for every OTHER column.
REVOKE SELECT (expo_push_token) ON public.profiles FROM authenticated;

-- Keep write access — the user still needs to upload their own token. The
-- self_update_profile RLS policy gates row visibility.
GRANT UPDATE (expo_push_token) ON public.profiles TO authenticated;

-- Convenience RPC so mobile can set its token without a SELECT-then-UPDATE.
-- SECURITY DEFINER so it can write even after we revoke SELECT later if we
-- choose to. Limited to the caller's own row.
CREATE OR REPLACE FUNCTION set_my_push_token(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  UPDATE profiles
     SET expo_push_token = p_token
   WHERE id = auth.uid()
     AND (expo_push_token IS DISTINCT FROM p_token);
END;
$$;

REVOKE ALL ON FUNCTION set_my_push_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION set_my_push_token(TEXT) TO authenticated;

-- =====================
-- S7. Messages tamper protection
-- =====================

-- Trigger that rejects any change to the immutable fields of a message
-- when the request is coming from an authenticated end-user. service_role
-- (used by backend notify routes) bypasses.
CREATE OR REPLACE FUNCTION prevent_message_tamper()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow backend (service role) to do anything.
  IF current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF auth.uid() IS NULL THEN
    -- Postgres-direct connections (psql / supabase studio with elevated key)
    -- are not end-users; let them through.
    RETURN NEW;
  END IF;
  IF NEW.sender_user_id IS DISTINCT FROM OLD.sender_user_id
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.body IS DISTINCT FROM OLD.body
     OR NEW.attachments IS DISTINCT FROM OLD.attachments
     OR NEW.is_ai IS DISTINCT FROM OLD.is_ai
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'cannot modify message content after insert';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_anti_tamper ON messages;
CREATE TRIGGER messages_anti_tamper
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION prevent_message_tamper();
