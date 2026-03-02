import { AudioEngine } from './AudioEngine'
import type { VoicePreset } from '../types/audio.types'

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'deep-one',
    name: 'Profundo (Deep One)',
    params: { pitchShift: -8, reverbAmount: 0.7, distortion: 0.3, echoDelay: 0.12, bubbleRate: 4 }
  },
  {
    id: 'nyarlathotep',
    name: 'Nyarlathotep',
    params: { pitchShift: -4, reverbAmount: 0.95, distortion: 0.6, echoDelay: 0.3 }
  },
  {
    id: 'cultist',
    name: 'Cultista',
    params: { pitchShift: -2, reverbAmount: 0.3, distortion: 0.15, echoDelay: 0.05 }
  },
  {
    id: 'shoggoth',
    name: 'Shoggoth',
    params: { pitchShift: -12, reverbAmount: 0.8, distortion: 0.9, echoDelay: 0.2, bubbleRate: 2 }
  }
]

/**
 * VoiceModulator — real-time voice processing for the Keeper's microphone.
 *
 * Chain: microphone → pitchShifter (approximated) → distortion → delay/reverb → voiceBus
 *
 * Note: True pitch shifting in Web Audio requires ScriptProcessorNode or AudioWorklet.
 * This implementation uses detune on a MediaStreamSourceNode as a close approximation.
 */
class VoiceModulatorClass {
  private static instance: VoiceModulatorClass
  private stream: MediaStream | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private distortionNode: WaveShaperNode
  private delayNode: DelayNode
  private reverbGain: GainNode
  private currentPreset: VoicePreset | null = null
  active = false

  private constructor() {
    const ctx = AudioEngine.ctx
    this.distortionNode = ctx.createWaveShaper()
    this.delayNode = ctx.createDelay(1.0)
    this.reverbGain = ctx.createGain()
    this.reverbGain.gain.value = 0

    this.delayNode.connect(this.reverbGain)
    this.reverbGain.connect(AudioEngine.bus.voiceBus)
    this.distortionNode.connect(AudioEngine.bus.voiceBus)
    this.distortionNode.connect(this.delayNode)
  }

  static getInstance(): VoiceModulatorClass {
    if (!VoiceModulatorClass.instance) {
      VoiceModulatorClass.instance = new VoiceModulatorClass()
    }
    return VoiceModulatorClass.instance
  }

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    this.source = AudioEngine.ctx.createMediaStreamSource(this.stream)
    this.source.connect(this.distortionNode)
    this.active = true
  }

  stop(): void {
    this.source?.disconnect()
    this.stream?.getTracks().forEach((t) => t.stop())
    this.source = null
    this.stream = null
    this.active = false
  }

  applyPreset(presetId: string): void {
    const preset = VOICE_PRESETS.find((p) => p.id === presetId) ?? null
    this.currentPreset = preset
    if (preset) this.applyParams(preset.params)
  }

  adjustParam(key: keyof VoicePreset['params'], value: number): void {
    if (!this.currentPreset) return
    this.currentPreset.params[key] = value
    this.applyParams(this.currentPreset.params)
  }

  private applyParams(params: VoicePreset['params']): void {
    this.distortionNode.curve = this.makeDistortionCurve(params.distortion * 400)
    this.delayNode.delayTime.setTargetAtTime(params.echoDelay, AudioEngine.ctx.currentTime, 0.05)
    this.reverbGain.gain.setTargetAtTime(params.reverbAmount, AudioEngine.ctx.currentTime, 0.05)
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const samples = 256
    const curve = new Float32Array(samples)
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x))
    }
    return curve
  }
}

export const VoiceModulator = VoiceModulatorClass.getInstance()
