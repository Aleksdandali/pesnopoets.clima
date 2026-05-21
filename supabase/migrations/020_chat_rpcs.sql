-- Migration 020: Chat helpers for the mobile app
--
-- Adds atomic RPCs + a manager inbox view to power the chat UI built in
-- mobile/app/chat/[id].tsx and mobile/app/(manager)/index.tsx.
--
-- Depends on migration 018 (conversations, messages, profiles, clients).

-- =====================
-- 1. get_or_create_my_conversation
-- =====================
--
-- Client opens the Chat tab → we need a conversation row to attach messages to.
-- RLS already permits INSERT with client_user_id = auth.uid(), but we want a
-- single round-trip + race-safe find-or-create.

CREATE OR REPLACE FUNCTION get_or_create_my_conversation()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT id INTO v_id FROM conversations WHERE client_user_id = v_uid;
  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  INSERT INTO conversations (client_user_id)
  VALUES (v_uid)
  ON CONFLICT (client_user_id) DO UPDATE SET client_user_id = EXCLUDED.client_user_id
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_or_create_my_conversation() TO authenticated;

-- =====================
-- 2. mark_conversation_read
-- =====================
--
-- Resets the appropriate unread counter and stamps read_at on unread messages
-- the caller did NOT send. p_as_staff=TRUE → manager side, FALSE → client side.

CREATE OR REPLACE FUNCTION mark_conversation_read(p_conversation_id UUID, p_as_staff BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_client_uid UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT client_user_id INTO v_client_uid
  FROM conversations WHERE id = p_conversation_id;
  IF v_client_uid IS NULL THEN
    RAISE EXCEPTION 'conversation not found';
  END IF;

  -- Authorization: staff can mark any conversation; client only their own.
  IF p_as_staff THEN
    IF NOT is_staff() THEN
      RAISE EXCEPTION 'not staff';
    END IF;
    UPDATE conversations SET unread_count_staff = 0 WHERE id = p_conversation_id;
    UPDATE messages
       SET read_at = NOW()
     WHERE conversation_id = p_conversation_id
       AND read_at IS NULL
       AND sender_user_id = v_client_uid;
  ELSE
    IF v_client_uid <> v_uid THEN
      RAISE EXCEPTION 'not the client of this conversation';
    END IF;
    UPDATE conversations SET unread_count_client = 0 WHERE id = p_conversation_id;
    UPDATE messages
       SET read_at = NOW()
     WHERE conversation_id = p_conversation_id
       AND read_at IS NULL
       AND (sender_user_id IS DISTINCT FROM v_uid);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION mark_conversation_read(UUID, BOOLEAN) TO authenticated;

-- =====================
-- 3. conversation_inbox view (manager-only via RLS)
-- =====================
--
-- One row per conversation enriched with client name/phone + last message snippet.
-- Underlying RLS on conversations already restricts SELECT to staff for non-own
-- conversations; the view inherits that.

CREATE OR REPLACE VIEW conversation_inbox AS
SELECT
  c.id,
  c.client_user_id,
  c.assigned_to,
  c.status,
  c.last_message_at,
  c.unread_count_staff,
  c.created_at,
  COALESCE(NULLIF(p.full_name, ''), cl.name, p.phone, 'Клиент') AS client_name,
  p.phone AS client_phone,
  cl.id   AS crm_client_id,
  (
    SELECT body FROM messages m
     WHERE m.conversation_id = c.id
     ORDER BY m.created_at DESC
     LIMIT 1
  ) AS last_message_body,
  (
    SELECT sender_user_id FROM messages m
     WHERE m.conversation_id = c.id
     ORDER BY m.created_at DESC
     LIMIT 1
  ) AS last_message_sender
FROM conversations c
LEFT JOIN profiles p ON p.id = c.client_user_id
LEFT JOIN clients  cl ON cl.id = p.client_id;

GRANT SELECT ON conversation_inbox TO authenticated;

-- =====================
-- 4. Realtime publication
-- =====================
--
-- The mobile app subscribes to messages + conversations via Supabase Realtime.
-- Ensure both tables are in the publication (idempotent).

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
