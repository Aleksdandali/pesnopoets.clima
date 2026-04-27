-- Telegram bot infrastructure

CREATE TABLE IF NOT EXISTS telegram_team_members (
  id SERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL UNIQUE,
  telegram_username TEXT,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'operator' CHECK (role IN ('owner', 'manager', 'operator')),
  is_active BOOLEAN DEFAULT TRUE,
  notify_new_leads BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tg_team_user_id ON telegram_team_members (telegram_user_id);

ALTER TABLE telegram_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_tg_team" ON telegram_team_members FOR ALL TO service_role USING (true);
