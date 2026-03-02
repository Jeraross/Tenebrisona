import { create } from 'zustand'
import type { SessionLog, SessionEventType } from '../types/investigation.types'

const BATCH_SIZE = 10

interface SessionLogState {
  entries: SessionLog[]
  pendingBatch: Omit<SessionLog, 'id' | 'timestamp'>[]

  addEntry: (investigationId: number, eventType: SessionEventType, payload?: object) => void
  setEntries: (entries: SessionLog[]) => void
  flushBatch: () => Omit<SessionLog, 'id' | 'timestamp'>[]
  clearPending: () => void
}

export const useSessionLogStore = create<SessionLogState>((set, get) => ({
  entries: [],
  pendingBatch: [],

  addEntry: (investigationId, eventType, payload) => {
    const entry: Omit<SessionLog, 'id' | 'timestamp'> = {
      investigation_id: investigationId,
      event_type: eventType,
      payload_json: payload ? JSON.stringify(payload) : null
    }

    set((state) => {
      const optimistic: SessionLog = {
        ...entry,
        id: Date.now(), // temporary client-side id
        timestamp: new Date().toISOString()
      }
      return {
        entries: [...state.entries, optimistic],
        pendingBatch: [...state.pendingBatch, entry]
      }
    })

    // Auto-flush when batch is full
    if (get().pendingBatch.length >= BATCH_SIZE) {
      const batch = get().flushBatch()
      window.api.logEvent(batch as unknown as object)
      get().clearPending()
    }
  },

  setEntries: (entries) => set({ entries }),

  flushBatch: () => get().pendingBatch,

  clearPending: () => set({ pendingBatch: [] })
}))
