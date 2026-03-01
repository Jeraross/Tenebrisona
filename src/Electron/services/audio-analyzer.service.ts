import { spawn } from 'child_process'
import { join } from 'path'

export interface AudioAnalysis {
  bpm: number | null
  key: string | null
  duration_ms: number | null
}

export const AudioAnalyzerService = {
  async analyze(filePath: string): Promise<AudioAnalysis> {
    // Uses meyda or a Node-compatible BPM analyzer spawned as a child process.
    // In production, replace with actual BPM detection library (e.g. bpm-detective, music-tempo).
    return new Promise((resolve, reject) => {
      const analyzerScript = join(__dirname, '../../scripts/analyze-audio.js')
      const child = spawn(process.execPath, [analyzerScript, filePath], { stdio: ['pipe', 'pipe', 'pipe'] })

      let output = ''
      child.stdout.on('data', (data: Buffer) => { output += data.toString() })
      child.on('close', (code) => {
        if (code !== 0) {
          resolve({ bpm: null, key: null, duration_ms: null })
          return
        }
        try {
          resolve(JSON.parse(output) as AudioAnalysis)
        } catch {
          resolve({ bpm: null, key: null, duration_ms: null })
        }
      })
      child.on('error', (err) => reject(err))
    })
  }
}
