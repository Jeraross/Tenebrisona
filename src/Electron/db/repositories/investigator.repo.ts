import { getDb } from '../connection.js'

export interface InvestigatorRow {
  id: number
  investigation_id: number
  player_name: string
  character_name: string
  sanity: number
  status: 'alive' | 'dead' | 'insane'
}

export const InvestigatorRepo = {
  getByInvestigation(investigationId: number): InvestigatorRow[] {
    return getDb()
      .prepare('SELECT * FROM investigators WHERE investigation_id = ?')
      .all(investigationId) as InvestigatorRow[]
  },

  getById(id: number): InvestigatorRow | undefined {
    return getDb().prepare('SELECT * FROM investigators WHERE id = ?').get(id) as InvestigatorRow | undefined
  },

  upsert(data: {
    id?: number
    investigation_id: number
    player_name: string
    character_name: string
    sanity: number
    status?: 'alive' | 'dead' | 'insane'
  }): InvestigatorRow {
    const db = getDb()
    if (data.id) {
      db.prepare(
        'UPDATE investigators SET player_name = ?, character_name = ?, sanity = ?, status = ? WHERE id = ?'
      ).run(data.player_name, data.character_name, data.sanity, data.status ?? 'alive', data.id)
      return InvestigatorRepo.getById(data.id)!
    } else {
      const result = db
        .prepare(
          'INSERT INTO investigators (investigation_id, player_name, character_name, sanity, status) VALUES (?, ?, ?, ?, ?)'
        )
        .run(data.investigation_id, data.player_name, data.character_name, data.sanity, data.status ?? 'alive')
      return InvestigatorRepo.getById(result.lastInsertRowid as number)!
    }
  },

  remove(id: number): void {
    getDb().prepare('DELETE FROM investigators WHERE id = ?').run(id)
  }
}
