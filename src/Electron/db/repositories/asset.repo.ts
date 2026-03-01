import { getDb } from '../connection.js'

export interface AssetRow {
  id: number
  title: string
  file_path: string | null
  spotify_uri: string | null
  type: 'music' | 'ambience' | 'sfx' | 'voice'
  volume: number
  start_ms: number
  end_ms: number | null
  bpm: number | null
  key: string | null
}

export const AssetRepo = {
  getAll(): AssetRow[] {
    return getDb().prepare('SELECT * FROM assets ORDER BY title ASC').all() as AssetRow[]
  },

  getById(id: number): AssetRow | undefined {
    return getDb().prepare('SELECT * FROM assets WHERE id = ?').get(id) as AssetRow | undefined
  },

  create(data: Omit<AssetRow, 'id'>): AssetRow {
    const db = getDb()
    const result = db
      .prepare(
        'INSERT INTO assets (title, file_path, spotify_uri, type, volume, start_ms, end_ms, bpm, key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        data.title,
        data.file_path ?? null,
        data.spotify_uri ?? null,
        data.type,
        data.volume ?? 1.0,
        data.start_ms ?? 0,
        data.end_ms ?? null,
        data.bpm ?? null,
        data.key ?? null
      )
    return AssetRepo.getById(result.lastInsertRowid as number)!
  },

  update(id: number, data: Partial<Omit<AssetRow, 'id'>>): void {
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(', ')
    getDb()
      .prepare(`UPDATE assets SET ${fields} WHERE id = ?`)
      .run(...Object.values(data), id)
  },

  remove(id: number): void {
    getDb().prepare('DELETE FROM assets WHERE id = ?').run(id)
  }
}
