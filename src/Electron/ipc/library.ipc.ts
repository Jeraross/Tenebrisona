import { ipcMain } from 'electron'
import { AssetRepo } from '../db/repositories/asset.repo.js'
import { PlaylistRepo } from '../db/repositories/playlist.repo.js'

export function registerLibraryHandlers(): void {
  ipcMain.handle('asset:import', (_event, data) => {
    return AssetRepo.create(data)
  })

  ipcMain.handle('asset:getAll', () => {
    return AssetRepo.getAll()
  })

  ipcMain.handle('asset:update', (_event, id: number, data) => {
    return AssetRepo.update(id, data)
  })

  ipcMain.handle('asset:delete', (_event, id: number) => {
    return AssetRepo.remove(id)
  })

  ipcMain.handle('playlist:create', (_event, data) => {
    return PlaylistRepo.create(data)
  })

  ipcMain.handle('playlist:getByInvestigation', (_event, investigationId: number) => {
    return PlaylistRepo.getByInvestigation(investigationId)
  })

  ipcMain.handle('playlist:addItem', (_event, data) => {
    return PlaylistRepo.addItem(data)
  })

  ipcMain.handle('playlist:removeItem', (_event, itemId: number) => {
    return PlaylistRepo.removeItem(itemId)
  })
}
