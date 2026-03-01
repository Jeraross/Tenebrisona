import { ipcMain } from 'electron'
import { InvestigationRepo } from '../db/repositories/investigation.repo.js'
import { InvestigatorRepo } from '../db/repositories/investigator.repo.js'

export function registerInvestigationHandlers(): void {
  ipcMain.handle('investigation:getAll', () => {
    return InvestigationRepo.getAll()
  })

  ipcMain.handle('investigation:create', (_event, data) => {
    return InvestigationRepo.create(data)
  })

  ipcMain.handle('investigation:update', (_event, id: number, data) => {
    return InvestigationRepo.update(id, data)
  })

  ipcMain.handle('investigation:archive', (_event, id: number) => {
    return InvestigationRepo.archive(id)
  })

  ipcMain.handle('investigator:upsert', (_event, data) => {
    return InvestigatorRepo.upsert(data)
  })

  ipcMain.handle('investigator:getByInvestigation', (_event, investigationId: number) => {
    return InvestigatorRepo.getByInvestigation(investigationId)
  })
}
