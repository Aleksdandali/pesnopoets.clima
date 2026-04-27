-- Store chat messages for admin review
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anon can insert (consultant API writes messages)
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT TO anon WITH CHECK (true);
-- Only service role can read (admin API)
CREATE POLICY "service_read_chat_messages" ON chat_messages FOR SELECT TO service_role USING (true);

CREATE INDEX idx_chat_messages_session ON chat_messages (session_id, created_at);
