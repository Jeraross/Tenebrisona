import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'
import { runMigrations } from './migrations/index.js'

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = join(app.getPath('userData'), 'tenebrisona.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    runMigrations(db)
  }
  return db
}
