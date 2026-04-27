-- AI Knowledge table (already created via CLI, this documents the schema)
CREATE TABLE IF NOT EXISTS ai_knowledge (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_knowledge ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_all_ai_knowledge" ON ai_knowledge FOR ALL TO service_role USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "anon_read_ai_knowledge" ON ai_knowledge FOR SELECT TO anon USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
