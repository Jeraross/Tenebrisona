import { getDb } from '../connection.js'

export interface InvestigationRow {
  id: number
  title: string
  type: 'oneshot' | 'campaign'
  created_at: string
  archived: 0 | 1
}

export const InvestigationRepo = {
  getAll(): InvestigationRow[] {
    return getDb().prepare('SELECT * FROM investigations WHERE archived = 0 ORDER BY created_at DESC').all() as InvestigationRow[]
  },

  getById(id: number): InvestigationRow | undefined {
    return getDb().prepare('SELECT * FROM investigations WHERE id = ?').get(id) as InvestigationRow | undefined
  },

  create(data: { title: string; type: 'oneshot' | 'campaign' }): InvestigationRow {
    const db = getDb()
    const result = db.prepare('INSERT INTO investigations (title, type) VALUES (?, ?)').run(data.title, data.type)
    return InvestigationRepo.getById(result.lastInsertRowid as number)!
  },

  update(id: number, data: Partial<{ title: string; type: 'oneshot' | 'campaign' }>): void {
    const fields = Object.keys(data).map((k) => `${k} = ?`).join(', ')
    getDb().prepare(`UPDATE investigations SET ${fields} WHERE id = ?`).run(...Object.values(data), id)
  },

  archive(id: number): void {
    getDb().prepare('UPDATE investigations SET archived = 1 WHERE id = ?').run(id)
  }
}
