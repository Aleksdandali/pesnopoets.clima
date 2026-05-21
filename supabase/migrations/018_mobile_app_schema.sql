-- Migration 018: Mobile app schema
--
-- Adds tables powering the React Native client/installer/manager app:
--   profiles         — extends auth.users with role, phone, language, push token
--   installations    — installed AC units (created by installer on-site)
--   conversations    — 1 per client, chat thread with managers + AI fallback
--   messages         — chat messages
--   service_jobs     — maintenance (profilaktika) + repair work orders
--   storage bucket 'installations' — photos taken by installer
--
-- Existing `clients` table (migration 008) stays as the CRM contact key by phone.
-- profiles.client_id links the authenticated app user to their CRM record.

-- =====================
-- 1. PROFILES (extends auth.users)
-- =====================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'installer', 'manager', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'client',
  language TEXT NOT NULL DEFAULT 'bg' CHECK (language IN ('bg', 'en', 'ru', 'ua')),
  client_id INT REFERENCES clients(id) ON DELETE SET NULL,
  expo_push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone ON profiles (phone) WHERE phone <> '';
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_client ON profiles (client_id);

-- Auto-create profile when a new auth.users row is inserted (OTP login).
-- Also matches/creates a CRM clients row by phone and links via client_id.
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone TEXT := COALESCE(NEW.phone, '');
  v_client_id INT;
BEGIN
  IF v_phone <> '' THEN
    SELECT id INTO v_client_id FROM clients WHERE phone = v_phone LIMIT 1;

    IF v_client_id IS NULL THEN
      INSERT INTO clients (phone, name, locale)
      VALUES (v_phone, '', 'bg')
      RETURNING id INTO v_client_id;
    END IF;
  END IF;

  INSERT INTO profiles (id, phone, client_id)
  VALUES (NEW.id, v_phone, v_client_id)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- Prevent client from escalating their own role or relinking their client_id.
-- service_role and admin via dashboard bypass this (auth.uid() returns NULL there).
CREATE OR REPLACE FUNCTION prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() = NEW.id THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'cannot change own role';
    END IF;
    IF NEW.client_id IS DISTINCT FROM OLD.client_id THEN
      RAISE EXCEPTION 'cannot change own client link';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS no_self_escalation ON profiles;
CREATE TRIGGER no_self_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_role_self_escalation();

-- =====================
-- 2. RLS HELPERS
-- =====================

-- SECURITY DEFINER so they bypass RLS on profiles when called from policies,
-- avoiding recursion when other tables' policies need to look up role.
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_user_client_id()
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_user_role() IN ('installer', 'manager', 'admin');
$$;

-- =====================
-- 3. INSTALLATIONS
-- =====================

CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  installer_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  brand TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  serial TEXT,
  btu INT,
  -- Storage paths inside bucket 'installations'.
  -- Convention: {client_id}/{installation_id}/{kind}.jpg
  indoor_photo_path TEXT,
  outdoor_photo_path TEXT,
  label_photo_path TEXT,
  extra_photo_paths TEXT[] NOT NULL DEFAULT '{}',
  address TEXT,
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  install_date DATE NOT NULL DEFAULT CURRENT_DATE,
  warranty_months INT NOT NULL DEFAULT 36,
  next_service_at DATE GENERATED ALWAYS AS (install_date + INTERVAL '12 months') STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_installations_client ON installations (client_id);
CREATE INDEX IF NOT EXISTS idx_installations_installer ON installations (installer_user_id);
CREATE INDEX IF NOT EXISTS idx_installations_next_service ON installations (next_service_at);

-- =====================
-- 4. CONVERSATIONS + MESSAGES
-- =====================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count_staff INT NOT NULL DEFAULT 0,
  unread_count_client INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_assigned ON conversations (assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON conversations (last_message_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL DEFAULT '',
  attachments JSONB NOT NULL DEFAULT '[]',
  is_ai BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (conversation_id) WHERE read_at IS NULL;

-- Bump conversations.last_message_at + unread counters on each new message.
CREATE OR REPLACE FUNCTION bump_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_sender_role user_role;
  v_client_user_id UUID;
BEGIN
  SELECT client_user_id INTO v_client_user_id
  FROM conversations WHERE id = NEW.conversation_id;

  SELECT role INTO v_sender_role FROM profiles WHERE id = NEW.sender_user_id;

  IF NEW.sender_user_id = v_client_user_id THEN
    -- client -> staff sees unread
    UPDATE conversations
       SET last_message_at = NEW.created_at,
           unread_count_staff = unread_count_staff + 1
     WHERE id = NEW.conversation_id;
  ELSE
    -- staff or AI -> client sees unread
    UPDATE conversations
       SET last_message_at = NEW.created_at,
           unread_count_client = unread_count_client + 1
     WHERE id = NEW.conversation_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_message_insert ON messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION bump_conversation_on_message();

-- =====================
-- 5. SERVICE JOBS
-- =====================

CREATE TABLE IF NOT EXISTS service_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('maintenance', 'repair')),
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'scheduled', 'in_progress', 'done', 'cancelled')),
  assignee_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  work_done TEXT,
  price_eur NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_installation ON service_jobs (installation_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assignee ON service_jobs (assignee_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled ON service_jobs (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON service_jobs (status);

-- After done, push next_service_at on the linked installation forward 12 months.
CREATE OR REPLACE FUNCTION advance_next_service_on_done()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.type = 'maintenance'
     AND NEW.status = 'done'
     AND (OLD.status IS DISTINCT FROM 'done')
     AND NEW.completed_at IS NOT NULL THEN
    UPDATE installations
       SET install_date = NEW.completed_at::date
     WHERE id = NEW.installation_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_service_job_done ON service_jobs;
CREATE TRIGGER on_service_job_done
  AFTER UPDATE OF status ON service_jobs
  FOR EACH ROW EXECUTE FUNCTION advance_next_service_on_done();

-- =====================
-- 6. ROW LEVEL SECURITY
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_jobs ENABLE ROW LEVEL SECURITY;

-- ----- profiles -----
DROP POLICY IF EXISTS "self_select_profile" ON profiles;
CREATE POLICY "self_select_profile" ON profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "staff_select_profiles" ON profiles;
CREATE POLICY "staff_select_profiles" ON profiles
  FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "self_update_profile" ON profiles;
CREATE POLICY "self_update_profile" ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "service_all_profiles" ON profiles;
CREATE POLICY "service_all_profiles" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ----- installations -----
DROP POLICY IF EXISTS "client_select_own_installations" ON installations;
CREATE POLICY "client_select_own_installations" ON installations
  FOR SELECT TO authenticated USING (client_id = current_user_client_id());

DROP POLICY IF EXISTS "staff_select_installations" ON installations;
CREATE POLICY "staff_select_installations" ON installations
  FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "installer_insert_installations" ON installations;
CREATE POLICY "installer_insert_installations" ON installations
  FOR INSERT TO authenticated WITH CHECK (
    is_staff() AND installer_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "staff_update_installations" ON installations;
CREATE POLICY "staff_update_installations" ON installations
  FOR UPDATE TO authenticated USING (is_staff()) WITH CHECK (is_staff());

DROP POLICY IF EXISTS "service_all_installations" ON installations;
CREATE POLICY "service_all_installations" ON installations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ----- conversations -----
DROP POLICY IF EXISTS "client_select_own_conversation" ON conversations;
CREATE POLICY "client_select_own_conversation" ON conversations
  FOR SELECT TO authenticated USING (client_user_id = auth.uid());

DROP POLICY IF EXISTS "staff_select_conversations" ON conversations;
CREATE POLICY "staff_select_conversations" ON conversations
  FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "client_insert_own_conversation" ON conversations;
CREATE POLICY "client_insert_own_conversation" ON conversations
  FOR INSERT TO authenticated WITH CHECK (client_user_id = auth.uid());

DROP POLICY IF EXISTS "participant_update_conversation" ON conversations;
CREATE POLICY "participant_update_conversation" ON conversations
  FOR UPDATE TO authenticated USING (client_user_id = auth.uid() OR is_staff());

DROP POLICY IF EXISTS "service_all_conversations" ON conversations;
CREATE POLICY "service_all_conversations" ON conversations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ----- messages -----
DROP POLICY IF EXISTS "participant_select_messages" ON messages;
CREATE POLICY "participant_select_messages" ON messages
  FOR SELECT TO authenticated USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE client_user_id = auth.uid()
    )
    OR is_staff()
  );

DROP POLICY IF EXISTS "participant_insert_messages" ON messages;
CREATE POLICY "participant_insert_messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_user_id = auth.uid() AND (
      conversation_id IN (
        SELECT id FROM conversations WHERE client_user_id = auth.uid()
      )
      OR is_staff()
    )
  );

DROP POLICY IF EXISTS "participant_update_messages" ON messages;
CREATE POLICY "participant_update_messages" ON messages
  FOR UPDATE TO authenticated USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE client_user_id = auth.uid()
    )
    OR is_staff()
  );

DROP POLICY IF EXISTS "service_all_messages" ON messages;
CREATE POLICY "service_all_messages" ON messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ----- service_jobs -----
DROP POLICY IF EXISTS "client_select_own_jobs" ON service_jobs;
CREATE POLICY "client_select_own_jobs" ON service_jobs
  FOR SELECT TO authenticated USING (
    installation_id IN (
      SELECT id FROM installations WHERE client_id = current_user_client_id()
    )
  );

DROP POLICY IF EXISTS "client_insert_own_jobs" ON service_jobs;
CREATE POLICY "client_insert_own_jobs" ON service_jobs
  FOR INSERT TO authenticated WITH CHECK (
    status = 'requested'
    AND installation_id IN (
      SELECT id FROM installations WHERE client_id = current_user_client_id()
    )
  );

DROP POLICY IF EXISTS "staff_select_jobs" ON service_jobs;
CREATE POLICY "staff_select_jobs" ON service_jobs
  FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "staff_modify_jobs" ON service_jobs;
CREATE POLICY "staff_modify_jobs" ON service_jobs
  FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());

DROP POLICY IF EXISTS "service_all_jobs" ON service_jobs;
CREATE POLICY "service_all_jobs" ON service_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================
-- 7. STORAGE BUCKET — installation photos
-- =====================

INSERT INTO storage.buckets (id, name, public)
VALUES ('installations', 'installations', false)
ON CONFLICT (id) DO NOTHING;

-- Path convention: {client_id}/{installation_id}/{kind}.jpg
-- Staff can upload/update/delete; client can read only photos under their client_id folder.

DROP POLICY IF EXISTS "staff_write_installation_photos" ON storage.objects;
CREATE POLICY "staff_write_installation_photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'installations' AND is_staff()
  );

DROP POLICY IF EXISTS "staff_update_installation_photos" ON storage.objects;
CREATE POLICY "staff_update_installation_photos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'installations' AND is_staff()
  );

DROP POLICY IF EXISTS "staff_delete_installation_photos" ON storage.objects;
CREATE POLICY "staff_delete_installation_photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'installations' AND is_staff()
  );

DROP POLICY IF EXISTS "read_installation_photos" ON storage.objects;
CREATE POLICY "read_installation_photos" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'installations' AND (
      is_staff()
      OR (storage.foldername(name))[1] = current_user_client_id()::text
    )
  );

-- =====================
-- 8. updated_at triggers
-- =====================

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_profiles ON profiles;
CREATE TRIGGER touch_profiles BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS touch_installations ON installations;
CREATE TRIGGER touch_installations BEFORE UPDATE ON installations
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS touch_service_jobs ON service_jobs;
CREATE TRIGGER touch_service_jobs BEFORE UPDATE ON service_jobs
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
