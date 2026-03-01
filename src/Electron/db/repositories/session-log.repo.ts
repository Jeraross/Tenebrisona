import { getDb } from '../connection.js'

export interface SessionLogRow {
  id: number
  investigation_id: number
  timestamp: string
  event_type: string
  payload_json: string | null
}

export const SessionLogRepo = {
  getByInvestigation(investigationId: number): SessionLogRow[] {
    return getDb()
      .prepare('SELECT * FROM session_logs WHERE investigation_id = ? ORDER BY timestamp ASC')
      .all(investigationId) as SessionLogRow[]
  },

  insertBatch(entries: Omit<SessionLogRow, 'id' | 'timestamp'>[]): void {
    const db = getDb()
    const insert = db.prepare(
      'INSERT INTO session_logs (investigation_id, event_type, payload_json) VALUES (?, ?, ?)'
    )
    const insertMany = db.transaction((rows: typeof entries) => {
      for (const row of rows) {
        insert.run(row.investigation_id, row.event_type, row.payload_json ?? null)
      }
    })
    insertMany(entries)
  },

  insert(data: Omit<SessionLogRow, 'id' | 'timestamp'>): void {
    getDb()
      .prepare('INSERT INTO session_logs (investigation_id, event_type, payload_json) VALUES (?, ?, ?)')
      .run(data.investigation_id, data.event_type, data.payload_json ?? null)
  }
}
