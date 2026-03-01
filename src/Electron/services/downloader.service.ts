import { spawn } from 'child_process'
import { join } from 'path'
import { app } from 'electron'

export interface DownloadResult {
  filePath: string
  title: string
}

export const DownloaderService = {
  async download(uri: string): Promise<DownloadResult> {
    // Downloads audio via yt-dlp spawned as a child process.
    // yt-dlp binary must be bundled in resources/ or available in PATH.
    return new Promise((resolve, reject) => {
      const outputDir = join(app.getPath('userData'), 'downloads')
      const ytDlp = 'yt-dlp' // assumes yt-dlp is in PATH or bundled

      const args = [
        uri,
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--output', join(outputDir, '%(title)s.%(ext)s'),
        '--print', 'after_move:filepath'
      ]

      const child = spawn(ytDlp, args, { stdio: ['pipe', 'pipe', 'pipe'] })
      let filePath = ''
      child.stdout.on('data', (data: Buffer) => { filePath += data.toString().trim() })
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`yt-dlp exited with code ${code}`))
          return
        }
        resolve({ filePath, title: filePath.split(/[/\\]/).pop() ?? uri })
      })
      child.on('error', (err) => reject(err))
    })
  }
}
