import { getDb } from '../connection.js'

export interface PlaylistRow {
  id: number
  investigation_id: number
  name: string
  mode: 'loop' | 'oneshot'
}

export interface PlaylistItemRow {
  id: number
  playlist_id: number
  asset_id: number
  position: number
}

export const PlaylistRepo = {
  getByInvestigation(investigationId: number): PlaylistRow[] {
    return getDb()
      .prepare('SELECT * FROM playlists WHERE investigation_id = ? ORDER BY name ASC')
      .all(investigationId) as PlaylistRow[]
  },

  getItems(playlistId: number): PlaylistItemRow[] {
    return getDb()
      .prepare('SELECT * FROM playlist_items WHERE playlist_id = ? ORDER BY position ASC')
      .all(playlistId) as PlaylistItemRow[]
  },

  create(data: Omit<PlaylistRow, 'id'>): PlaylistRow {
    const db = getDb()
    const result = db
      .prepare('INSERT INTO playlists (investigation_id, name, mode) VALUES (?, ?, ?)')
      .run(data.investigation_id, data.name, data.mode)
    return db.prepare('SELECT * FROM playlists WHERE id = ?').get(result.lastInsertRowid) as PlaylistRow
  },

  addItem(data: Omit<PlaylistItemRow, 'id'>): PlaylistItemRow {
    const db = getDb()
    const result = db
      .prepare('INSERT INTO playlist_items (playlist_id, asset_id, position) VALUES (?, ?, ?)')
      .run(data.playlist_id, data.asset_id, data.position)
    return db.prepare('SELECT * FROM playlist_items WHERE id = ?').get(result.lastInsertRowid) as PlaylistItemRow
  },

  removeItem(itemId: number): void {
    getDb().prepare('DELETE FROM playlist_items WHERE id = ?').run(itemId)
  },

  remove(id: number): void {
    getDb().prepare('DELETE FROM playlists WHERE id = ?').run(id)
  }
}
