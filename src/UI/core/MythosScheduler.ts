import { AudioEngine } from './AudioEngine'
import type { MythosLevel } from '../types/audio.types'

const ECO_FADE_TIME = 75 // seconds for eco do Mito (level drop fade)
const VACUUM_RESIDUAL = 0.03 // near-silent hum level during drop-to-silence

/**
 * MythosScheduler — manages the 3-level Mythos Meter tension escalation.
 *
 * Level 1: Investigative ambient — normal playback
 * Level 2: + continuous low drone on sfxBus
 * Level 3: + oppressive heartbeat layer on sfxBus
 *
 * Drop-to-Silence (Vacuum): instant cut except for a near-inaudible hum.
 * Eco do Mito: when dropping levels, sfxBus fades very slowly (60-90s).
 */
class MythosSchedulerClass {
  private static instance: MythosSchedulerClass
  private droneSource: AudioBufferSourceNode | null = null
  private currentLevel: MythosLevel = 1
  private isVacuumActive = false

  private constructor() {}

  static getInstance(): MythosSchedulerClass {
    if (!MythosSchedulerClass.instance) {
      MythosSchedulerClass.instance = new MythosSchedulerClass()
    }
    return MythosSchedulerClass.instance
  }

  setLevel(level: MythosLevel): void {
    if (this.isVacuumActive && level < 3) this.releaseVacuum()

    const sfxBus = AudioEngine.bus.sfxBus
    const now = AudioEngine.ctx.currentTime

    if (level < this.currentLevel) {
      // Eco do Mito: slow fade when backing down
      sfxBus.gain.setTargetAtTime(level === 1 ? 0 : 0.6, now, ECO_FADE_TIME / 3)
    } else {
      sfxBus.gain.setTargetAtTime(1.0, now, 0.5)
    }

    this.currentLevel = level
  }

  triggerVacuum(): void {
    const sfxBus = AudioEngine.bus.sfxBus
    const ambientBus = AudioEngine.bus.ambientBus
    const now = AudioEngine.ctx.currentTime

    sfxBus.gain.cancelScheduledValues(now)
    sfxBus.gain.setValueAtTime(sfxBus.gain.value, now)
    sfxBus.gain.linearRampToValueAtTime(0, now + 0.05)

    ambientBus.gain.cancelScheduledValues(now)
    ambientBus.gain.setValueAtTime(ambientBus.gain.value, now)
    ambientBus.gain.linearRampToValueAtTime(VACUUM_RESIDUAL, now + 0.05)

    this.isVacuumActive = true
  }

  releaseVacuum(): void {
    const ambientBus = AudioEngine.bus.ambientBus
    const now = AudioEngine.ctx.currentTime
    ambientBus.gain.setTargetAtTime(1.0, now, 0.8)
    this.isVacuumActive = false
  }

  get level(): MythosLevel {
    return this.currentLevel
  }

  get vacuumActive(): boolean {
    return this.isVacuumActive
  }
}

export const MythosScheduler = MythosSchedulerClass.getInstance()
