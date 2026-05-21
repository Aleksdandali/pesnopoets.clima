-- Migration 021: Push notification log + service reminder view
--
-- Backs Sprint 5 of the mobile app.
--   notification_log         — dedup + audit trail for every push we send.
--   due_service_reminders    — pure-SQL view of clients to remind today
--                              (next_service_at in {14, 7, 0} days from now)
--                              that we haven't notified yet for that bucket.
--
-- The actual sending lives in Next.js on Vercel:
--   POST /api/mobile/notify-message   (called by client after sendMessage)
--   GET  /api/cron/service-reminders  (Vercel Cron @ 09:00 Europe/Sofia)

-- =====================
-- 1. notification_log
-- =====================

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('message', 'service_reminder')),
  ref_id TEXT NOT NULL,                       -- message.id or installation.id
  bucket TEXT,                                -- '14d' | '7d' | '0d' for reminders, NULL for messages
  expo_ticket_id TEXT,                        -- Expo Push receipt id (best-effort)
  status TEXT NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'failed', 'skipped')),
  error TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_log_recipient
  ON notification_log (recipient_user_id, sent_at DESC);

-- Dedup key for reminders: one push per (installation, bucket) ever.
-- Messages don't need dedup at the DB level — sender side controls that.
CREATE UNIQUE INDEX IF NOT EXISTS uq_notification_reminder_bucket
  ON notification_log (kind, ref_id, bucket)
  WHERE kind = 'service_reminder';

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Only service role writes/reads. No client/staff visibility — it's a backend log.
DROP POLICY IF EXISTS "service_all_notif_log" ON notification_log;
CREATE POLICY "service_all_notif_log" ON notification_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================
-- 2. due_service_reminders view
-- =====================
--
-- Installations whose next_service_at falls into one of the reminder buckets,
-- joined to the owning client's profile (push token + language) and excluding
-- combinations that have already been notified for that bucket.

CREATE OR REPLACE VIEW due_service_reminders AS
WITH buckets AS (
  SELECT bucket, days FROM (VALUES
    ('14d', 14),
    ('7d', 7),
    ('0d', 0)
  ) AS t(bucket, days)
),
candidates AS (
  SELECT
    i.id                AS installation_id,
    i.client_id,
    i.brand,
    i.model,
    i.next_service_at,
    b.bucket,
    b.days,
    p.id                AS recipient_user_id,
    p.expo_push_token,
    p.language
  FROM installations i
  CROSS JOIN buckets b
  JOIN profiles p ON p.client_id = i.client_id AND p.role = 'client'
  WHERE i.next_service_at = (CURRENT_DATE + (b.days || ' days')::interval)::date
    AND p.expo_push_token IS NOT NULL
    AND p.expo_push_token <> ''
)
SELECT c.*
FROM candidates c
WHERE NOT EXISTS (
  SELECT 1 FROM notification_log nl
  WHERE nl.kind = 'service_reminder'
    AND nl.ref_id = c.installation_id::text
    AND nl.bucket = c.bucket
    AND nl.status = 'sent'
);

-- The view is consumed only by the cron route running with service-role key.
-- No GRANT to authenticated.
