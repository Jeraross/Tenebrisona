import { create } from 'zustand'
import type { MythosLevel } from '../types/audio.types'

interface MythosState {
  level: MythosLevel
  isVacuumActive: boolean
  isPushRollActive: boolean

  setLevel: (level: MythosLevel) => void
  activateVacuum: () => void
  deactivateVacuum: () => void
  startPushRoll: () => void
  resolvePushRoll: (result: 'success' | 'fail') => void
}

export const useMythosStore = create<MythosState>((set) => ({
  level: 1,
  isVacuumActive: false,
  isPushRollActive: false,

  setLevel: (level) => set({ level, isVacuumActive: false }),

  activateVacuum: () => set({ isVacuumActive: true }),

  deactivateVacuum: () => set({ isVacuumActive: false }),

  startPushRoll: () => set({ isPushRollActive: true }),

  resolvePushRoll: (_result) => set({ isPushRollActive: false })
}))
