-- Voice-based installation estimates

CREATE TABLE IF NOT EXISTS estimates (
  id SERIAL PRIMARY KEY,

  -- Who created it
  created_by_tg_id BIGINT NOT NULL,

  -- Link to client (optional)
  client_id INT REFERENCES clients(id) ON DELETE SET NULL,

  -- Voice data
  transcript TEXT,

  -- Extracted parameters
  params JSONB NOT NULL DEFAULT '{}',

  -- Room / BTU
  area_m2 NUMERIC(6,1),
  recommended_btu INT,
  selected_btu INT,

  -- Installation pricing (BGN)
  base_install_bgn NUMERIC(10,2),
  extra_pipe_m INT DEFAULT 0,
  extra_pipe_bgn NUMERIC(10,2) DEFAULT 0,
  extras JSONB DEFAULT '[]',        -- [{name, price_bgn}]
  total_install_bgn NUMERIC(10,2),

  -- Product (optional — recommended AC)
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT,
  product_price_eur NUMERIC(10,2),

  -- Client info
  client_name TEXT,
  client_phone TEXT,
  client_address TEXT,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),

  -- PDF
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created ON estimates(created_at DESC);
CREATE INDEX idx_estimates_tg_id ON estimates(created_by_tg_id);

ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_estimates" ON estimates FOR ALL TO service_role USING (true);
