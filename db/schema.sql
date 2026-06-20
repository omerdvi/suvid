-- SuVid D1 schema (serverless SQLite on Cloudflare).
CREATE TABLE IF NOT EXISTS ratings (
  id TEXT PRIMARY KEY,
  target_id TEXT NOT NULL,
  stars INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  texture_feedback TEXT NOT NULL DEFAULT '',
  next_time TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ratings_target ON ratings (target_id);

CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  ingredient_name TEXT NOT NULL,
  temperature_c REAL,
  time_hours REAL,
  prep TEXT NOT NULL,
  finish TEXT NOT NULL,
  notes TEXT NOT NULL,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions (status);
