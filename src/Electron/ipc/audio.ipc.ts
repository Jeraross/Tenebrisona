import { ipcMain } from 'electron'
import { AudioAnalyzerService } from '../services/audio-analyzer.service.js'
import { DownloaderService } from '../services/downloader.service.js'

export function registerAudioHandlers(): void {
  ipcMain.handle('audio:analyze', async (_event, filePath: string) => {
    return AudioAnalyzerService.analyze(filePath)
  })

  ipcMain.handle('audio:download', async (_event, uri: string) => {
    return DownloaderService.download(uri)
  })
}
