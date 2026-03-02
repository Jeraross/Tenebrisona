import { create } from 'zustand'
import type { SanityThreshold, MadnessType } from '../types/audio.types'

interface SanityState {
  groupSanity: number
  threshold: SanityThreshold
  isDistortionActive: boolean
  activeMadness: MadnessType | null
  indefiniteMadnessIds: number[] // investigator IDs with Indefinite Madness (sonic scar)

  setGroupSanity: (sanity: number) => void
  setThreshold: (threshold: SanityThreshold) => void
  triggerMadness: (type: MadnessType) => void
  clearMadness: () => void
  addIndefiniteMadness: (investigatorId: number) => void
}

function thresholdFromSanity(sanity: number): SanityThreshold {
  if (sanity > 50) return 'normal'
  if (sanity > 20) return 'stressed'
  if (sanity > 10) return 'broken'
  return 'abyss'
}

export const useSanityStore = create<SanityState>((set) => ({
  groupSanity: 100,
  threshold: 'normal',
  isDistortionActive: false,
  activeMadness: null,
  indefiniteMadnessIds: [],

  setGroupSanity: (sanity) =>
    set({
      groupSanity: sanity,
      threshold: thresholdFromSanity(sanity),
      isDistortionActive: sanity <= 50
    }),

  setThreshold: (threshold) => set({ threshold }),

  triggerMadness: (type) => set({ activeMadness: type }),

  clearMadness: () => set({ activeMadness: null }),

  addIndefiniteMadness: (investigatorId) =>
    set((state) => ({
      indefiniteMadnessIds: state.indefiniteMadnessIds.includes(investigatorId)
        ? state.indefiniteMadnessIds
        : [...state.indefiniteMadnessIds, investigatorId]
    }))
}))
