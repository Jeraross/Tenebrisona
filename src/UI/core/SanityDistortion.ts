import { AudioEngine } from './AudioEngine'
import type { SanityThreshold } from '../types/audio.types'

const TIME_CONSTANT = 0.5 // setTargetAtTime smoothing (avoids zipper noise)

/**
 * SanityDistortion — modulates audio parameters based on the sanity threshold.
 *
 * Signal chain inserted on the ambientBus output:
 *   ambientBus → lowpassFilter → detuneSource → whisperGain → madnessBus
 *
 * Thresholds (mapped from sanity.store):
 *   normal   (>50%) — clean audio, filter wide open
 *   stressed (>20%) — pitch drift + lowpass rolloff (~4kHz)
 *   broken   (>10%) — heavy lowpass (~800Hz) + oscillating gain (glitch)
 *   abyss    (≤10%) — extreme lowpass (~200Hz) + whisper layer at full
 */
class SanityDistortionClass {
  private static instance: SanityDistortionClass
  private filter: BiquadFilterNode
  private whisperGain: GainNode
  private glitchInterval: ReturnType<typeof setInterval> | null = null

  private constructor() {
    const ctx = AudioEngine.ctx

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 20000
    this.filter.Q.value = 1

    this.whisperGain = ctx.createGain()
    this.whisperGain.gain.value = 0

    // Re-route ambientBus through filter → madnessBus
    AudioEngine.bus.ambientBus.connect(this.filter)
    this.filter.connect(AudioEngine.bus.madnessBus)
    this.whisperGain.connect(AudioEngine.bus.madnessBus)
  }

  static getInstance(): SanityDistortionClass {
    if (!SanityDistortionClass.instance) {
      SanityDistortionClass.instance = new SanityDistortionClass()
    }
    return SanityDistortionClass.instance
  }

  applyThreshold(threshold: SanityThreshold): void {
    const now = AudioEngine.ctx.currentTime
    this.stopGlitch()

    switch (threshold) {
      case 'normal':
        this.filter.frequency.setTargetAtTime(20000, now, TIME_CONSTANT)
        this.filter.detune.setTargetAtTime(0, now, TIME_CONSTANT)
        this.whisperGain.gain.setTargetAtTime(0, now, TIME_CONSTANT)
        break

      case 'stressed':
        this.filter.frequency.setTargetAtTime(4000, now, TIME_CONSTANT)
        this.filter.detune.setTargetAtTime(15, now, TIME_CONSTANT)
        this.whisperGain.gain.setTargetAtTime(0, now, TIME_CONSTANT)
        break

      case 'broken':
        this.filter.frequency.setTargetAtTime(800, now, TIME_CONSTANT)
        this.filter.detune.setTargetAtTime(0, now, TIME_CONSTANT)
        this.whisperGain.gain.setTargetAtTime(0.2, now, TIME_CONSTANT)
        this.startGlitch()
        break

      case 'abyss':
        this.filter.frequency.setTargetAtTime(200, now, TIME_CONSTANT)
        this.filter.detune.setTargetAtTime(0, now, TIME_CONSTANT)
        this.whisperGain.gain.setTargetAtTime(1.0, now, TIME_CONSTANT)
        break
    }
  }

  private startGlitch(): void {
    this.glitchInterval = setInterval(() => {
      const now = AudioEngine.ctx.currentTime
      const randomGain = 0.5 + Math.random() * 0.5
      AudioEngine.bus.ambientBus.gain.setTargetAtTime(randomGain, now, 0.05)
    }, 300 + Math.random() * 400)
  }

  private stopGlitch(): void {
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval)
      this.glitchInterval = null
      const now = AudioEngine.ctx.currentTime
      AudioEngine.bus.ambientBus.gain.setTargetAtTime(1.0, now, 0.1)
    }
  }
}

export const SanityDistortion = SanityDistortionClass.getInstance()
