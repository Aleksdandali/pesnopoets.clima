CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL DEFAULT 'bg',
  messages_count INT NOT NULL DEFAULT 0,
  tools_used TEXT[] DEFAULT '{}',
  lead_collected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Allow anon insert (same pattern as inquiries)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_chat_sessions" ON chat_sessions FOR INSERT TO anon WITH CHECK (true);
-- Only service role can read
CREATE POLICY "service_read_chat_sessions" ON chat_sessions FOR SELECT TO service_role USING (true);

CREATE INDEX idx_chat_sessions_created ON chat_sessions (created_at DESC);
