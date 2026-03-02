import { AudioEngine } from './AudioEngine'

const DUCK_LEVEL = 0.15
const DUCK_RAMP_TIME = 0.05 // seconds to duck down
const FADE_BACK_EXTRA = 0.8 // seconds added after effect ends to fade back

/**
 * DuckingController — cinematographic ducking for the ambientBus.
 *
 * When a one-shot SFX fires, the ambient bus volume ramps down to DUCK_LEVEL
 * and schedules a ramp back to 1.0 after the effect duration ends.
 */
class DuckingControllerClass {
  private static instance: DuckingControllerClass
  private masterGain: GainNode

  private constructor() {
    this.masterGain = AudioEngine.bus.ambientBus
  }

  static getInstance(): DuckingControllerClass {
    if (!DuckingControllerClass.instance) {
      DuckingControllerClass.instance = new DuckingControllerClass()
    }
    return DuckingControllerClass.instance
  }

  triggerDuck(effectBuffer: AudioBuffer): void {
    const ctx = AudioEngine.ctx
    const now = ctx.currentTime
    const duration = effectBuffer.duration

    // Cancel any scheduled ramps first
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)

    // Duck down
    this.masterGain.gain.linearRampToValueAtTime(DUCK_LEVEL, now + DUCK_RAMP_TIME)
    // Fade back after effect finishes
    this.masterGain.gain.linearRampToValueAtTime(1.0, now + duration + FADE_BACK_EXTRA)
  }

  setVolume(value: number): void {
    const now = AudioEngine.ctx.currentTime
    this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, value)), now, 0.1)
  }
}

export const DuckingController = DuckingControllerClass.getInstance()
