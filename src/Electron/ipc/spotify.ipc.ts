import { ipcMain, BrowserWindow } from 'electron'
import { SpotifyAuthService } from '../services/spotify-auth.service.js'

export function registerSpotifyHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle('spotify:login', async () => {
    return SpotifyAuthService.startOAuth(mainWindow)
  })

  ipcMain.handle('spotify:search', async (_event, query: string) => {
    return SpotifyAuthService.search(query)
  })

  SpotifyAuthService.onTokenRefresh((token) => {
    mainWindow.webContents.send('spotify:token', token)
  })
}
