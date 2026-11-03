export const DATABASE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    consent_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    situation TEXT NOT NULL,
    initial_intensity INTEGER NOT NULL,
    final_intensity INTEGER NOT NULL,
    feedback TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS sessions_user_id_idx
    ON sessions(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS exposure_steps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    expected_anxiety INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS exposure_steps_user_id_idx
    ON exposure_steps(user_id, expected_anxiety);

  CREATE TABLE IF NOT EXISTS exposure_attempts (
    id TEXT PRIMARY KEY,
    step_id TEXT NOT NULL REFERENCES exposure_steps(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    anxiety_before INTEGER NOT NULL,
    anxiety_after INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS exposure_attempts_user_id_idx
    ON exposure_attempts(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS diary_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    thought TEXT NOT NULL,
    emotion TEXT NOT NULL,
    intensity_before INTEGER NOT NULL,
    alternative_thought TEXT NOT NULL,
    intensity_after INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS diary_entries_user_id_idx
    ON diary_entries(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL
  );
`;