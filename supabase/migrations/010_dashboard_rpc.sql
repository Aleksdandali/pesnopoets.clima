-- Dashboard RPC functions for aggregated analytics

-- 1. Leads by day (line chart)
CREATE OR REPLACE FUNCTION leads_by_day(since TIMESTAMPTZ)
RETURNS TABLE(day DATE, total BIGINT, completed BIGINT) AS $$
  SELECT
    created_at::date AS day,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed
  FROM inquiries
  WHERE created_at >= since
  GROUP BY created_at::date
  ORDER BY day
$$ LANGUAGE sql STABLE;

-- 2. Leads by source (bar chart)
CREATE OR REPLACE FUNCTION leads_by_source()
RETURNS TABLE(source TEXT, count BIGINT) AS $$
  SELECT COALESCE(source, 'unknown') AS source, COUNT(*) AS count
  FROM inquiries
  GROUP BY 1
  ORDER BY count DESC
$$ LANGUAGE sql STABLE;

-- 3. Leads by status
CREATE OR REPLACE FUNCTION leads_by_status()
RETURNS TABLE(status TEXT, count BIGINT) AS $$
  SELECT status, COUNT(*) AS count
  FROM inquiries
  GROUP BY status
  ORDER BY count DESC
$$ LANGUAGE sql STABLE;

-- 4. Leads by locale
CREATE OR REPLACE FUNCTION leads_by_locale()
RETURNS TABLE(locale TEXT, count BIGINT) AS $$
  SELECT COALESCE(locale, 'bg') AS locale, COUNT(*) AS count
  FROM inquiries
  GROUP BY 1
  ORDER BY count DESC
$$ LANGUAGE sql STABLE;

-- 5. Top products by inquiry count
CREATE OR REPLACE FUNCTION top_products_by_inquiries(lim INT DEFAULT 5)
RETURNS TABLE(product_id INT, title TEXT, manufacturer TEXT, availability TEXT, inquiry_count BIGINT) AS $$
  SELECT
    p.id AS product_id,
    COALESCE(p.title_override, p.title) AS title,
    p.manufacturer,
    p.availability,
    COUNT(i.id) AS inquiry_count
  FROM inquiries i
  JOIN products p ON p.id = i.product_id
  WHERE i.product_id IS NOT NULL
  GROUP BY p.id, p.title, p.title_override, p.manufacturer, p.availability
  ORDER BY inquiry_count DESC
  LIMIT lim
$$ LANGUAGE sql STABLE;

-- 6. Chat stats by day
CREATE OR REPLACE FUNCTION chat_stats(since TIMESTAMPTZ)
RETURNS TABLE(day DATE, sessions BIGINT, leads_collected BIGINT, avg_messages NUMERIC(5,1)) AS $$
  SELECT
    created_at::date AS day,
    COUNT(*) AS sessions,
    COUNT(*) FILTER (WHERE lead_collected = true) AS leads_collected,
    ROUND(AVG(messages_count), 1) AS avg_messages
  FROM chat_sessions
  WHERE created_at >= since
  GROUP BY created_at::date
  ORDER BY day
$$ LANGUAGE sql STABLE;

-- Index for top_products join
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id) WHERE product_id IS NOT NULL;
