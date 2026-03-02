import type { AudioBus } from '../types/audio.types'

/**
 * AudioEngine — singleton that owns the single Web Audio API AudioContext
 * and the master bus hierarchy. All other core modules connect to this bus.
 *
 * Signal graph:
 *   sources → GainNode (track) → ambientBus / sfxBus / voiceBus / madnessBus
 *                                        ↓
 *                                   masterOutput → destination
 */
class AudioEngineClass {
  private static instance: AudioEngineClass
  ctx: AudioContext
  bus: AudioBus

  private constructor() {
    this.ctx = new AudioContext()

    const make = () => this.ctx.createGain()

    const ambientBus = make()
    const sfxBus = make()
    const voiceBus = make()
    const madnessBus = make()
    const masterOutput = make()

    ambientBus.connect(masterOutput)
    sfxBus.connect(masterOutput)
    voiceBus.connect(masterOutput)
    madnessBus.connect(masterOutput)
    masterOutput.connect(this.ctx.destination)

    this.bus = { ambientBus, sfxBus, voiceBus, madnessBus, masterOutput }
  }

  static getInstance(): AudioEngineClass {
    if (!AudioEngineClass.instance) {
      AudioEngineClass.instance = new AudioEngineClass()
    }
    return AudioEngineClass.instance
  }

  async resume(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
  }

  async decodeFile(filePath: string): Promise<AudioBuffer> {
    const response = await fetch(`local-file://${filePath}`)
    const arrayBuffer = await response.arrayBuffer()
    return this.ctx.decodeAudioData(arrayBuffer)
  }

  createBufferSource(buffer: AudioBuffer): AudioBufferSourceNode {
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    return source
  }

  get currentTime(): number {
    return this.ctx.currentTime
  }
}

export const AudioEngine = AudioEngineClass.getInstance()
