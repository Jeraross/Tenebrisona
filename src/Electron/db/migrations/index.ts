import Database from 'better-sqlite3'

const MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS investigations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('oneshot', 'campaign')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    archived INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS investigators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investigation_id INTEGER NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    character_name TEXT NOT NULL,
    sanity INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'alive' CHECK(status IN ('alive', 'dead', 'insane'))
  )`,

  `CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_path TEXT,
    spotify_uri TEXT,
    type TEXT NOT NULL CHECK(type IN ('music', 'ambience', 'sfx', 'voice')),
    volume REAL NOT NULL DEFAULT 1.0,
    start_ms INTEGER NOT NULL DEFAULT 0,
    end_ms INTEGER,
    bpm REAL,
    key TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investigation_id INTEGER NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'loop' CHECK(mode IN ('loop', 'oneshot'))
  )`,

  `CREATE TABLE IF NOT EXISTS playlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS session_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investigation_id INTEGER NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    event_type TEXT NOT NULL,
    payload_json TEXT
  )`
]

export function runMigrations(db: Database.Database): void {
  db.exec(`CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version INTEGER NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`)

  const appliedRow = db.prepare('SELECT MAX(version) as v FROM _migrations').get() as {
    v: number | null
  }
  const applied = appliedRow.v ?? -1

  for (let i = applied + 1; i < MIGRATIONS.length; i++) {
    db.exec(MIGRATIONS[i])
    db.prepare('INSERT INTO _migrations (version) VALUES (?)').run(i)
  }
}
