import { create } from 'zustand'
import type { Investigation } from '../types/investigation.types'

interface InvestigationState {
  investigations: Investigation[]
  activeInvestigation: Investigation | null

  setInvestigations: (list: Investigation[]) => void
  setActive: (investigation: Investigation | null) => void
  addInvestigation: (investigation: Investigation) => void
  updateInvestigation: (id: number, data: Partial<Investigation>) => void
  removeInvestigation: (id: number) => void
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  investigations: [],
  activeInvestigation: null,

  setInvestigations: (list) => set({ investigations: list }),

  setActive: (investigation) => set({ activeInvestigation: investigation }),

  addInvestigation: (investigation) =>
    set((state) => ({ investigations: [investigation, ...state.investigations] })),

  updateInvestigation: (id, data) =>
    set((state) => ({
      investigations: state.investigations.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv
      ),
      activeInvestigation:
        state.activeInvestigation?.id === id
          ? { ...state.activeInvestigation, ...data }
          : state.activeInvestigation
    })),

  removeInvestigation: (id) =>
    set((state) => ({
      investigations: state.investigations.filter((inv) => inv.id !== id),
      activeInvestigation: state.activeInvestigation?.id === id ? null : state.activeInvestigation
    }))
}))
