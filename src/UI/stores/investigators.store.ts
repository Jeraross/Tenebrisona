import { create } from 'zustand'
import type { Investigator } from '../types/investigation.types'
import type { SanityThreshold } from '../types/audio.types'

function computeThreshold(sanity: number): SanityThreshold {
  if (sanity > 50) return 'normal'
  if (sanity > 20) return 'stressed'
  if (sanity > 10) return 'broken'
  return 'abyss'
}

interface InvestigatorsState {
  investigators: Investigator[]
  groupSanity: number
  groupThreshold: SanityThreshold

  setInvestigators: (list: Investigator[]) => void
  upsertInvestigator: (investigator: Investigator) => void
  updateSanity: (id: number, sanity: number) => void
  removeInvestigator: (id: number) => void
}

function recalcGroup(investigators: Investigator[]): { groupSanity: number; groupThreshold: SanityThreshold } {
  if (investigators.length === 0) return { groupSanity: 100, groupThreshold: 'normal' }
  const avg = investigators.reduce((sum, inv) => sum + inv.sanity, 0) / investigators.length
  return { groupSanity: Math.round(avg), groupThreshold: computeThreshold(avg) }
}

export const useInvestigatorsStore = create<InvestigatorsState>((set) => ({
  investigators: [],
  groupSanity: 100,
  groupThreshold: 'normal',

  setInvestigators: (list) =>
    set({ investigators: list, ...recalcGroup(list) }),

  upsertInvestigator: (investigator) =>
    set((state) => {
      const exists = state.investigators.find((i) => i.id === investigator.id)
      const next = exists
        ? state.investigators.map((i) => (i.id === investigator.id ? investigator : i))
        : [...state.investigators, investigator]
      return { investigators: next, ...recalcGroup(next) }
    }),

  updateSanity: (id, sanity) =>
    set((state) => {
      const next = state.investigators.map((i) => (i.id === id ? { ...i, sanity } : i))
      return { investigators: next, ...recalcGroup(next) }
    }),

  removeInvestigator: (id) =>
    set((state) => {
      const next = state.investigators.filter((i) => i.id !== id)
      return { investigators: next, ...recalcGroup(next) }
    })
}))
