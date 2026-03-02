export interface AudioAnalysis {
  bpm: number | null
  key: string | null
  duration_ms: number | null
}

export type MythosLevel = 1 | 2 | 3

export type SanityThreshold = 'normal' | 'stressed' | 'broken' | 'abyss'

export type MadnessType =
  | 'paranoia'
  | 'blindness'
  | 'deafness'
  | 'violence'
  | 'flight'
  | 'catatonia'
  | 'hallucination'
  | 'amnesia'
  | 'phobia'
  | 'hysteria'

export interface AudioBus {
  ambientBus: GainNode
  sfxBus: GainNode
  voiceBus: GainNode
  madnessBus: GainNode
  masterOutput: GainNode
}

export interface VoicePreset {
  id: string
  name: string
  params: {
    pitchShift: number
    reverbAmount: number
    distortion: number
    echoDelay: number
    bubbleRate?: number
  }
}
