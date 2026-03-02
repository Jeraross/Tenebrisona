import { useCallback, useEffect } from 'react'
import { useSessionLogStore } from '../stores/session-log.store'
import { useInvestigationStore } from '../stores/investigation.store'
import type { SessionEventType } from '../types/investigation.types'

/**
 * useSessionLog — provides log(eventType, payload?) helper for any feature.
 *
 * Adds events to the in-memory store and auto-flushes to SQLite in batches of 10.
 * On unmount (session end), flushes any remaining pending events.
 */
export function useSessionLog() {
  const activeInvestigation = useInvestigationStore((s) => s.activeInvestigation)
  const addEntry = useSessionLogStore((s) => s.addEntry)
  const flushBatch = useSessionLogStore((s) => s.flushBatch)
  const clearPending = useSessionLogStore((s) => s.clearPending)

  const log = useCallback(
    (eventType: SessionEventType, payload?: object) => {
      if (!activeInvestigation) return
      addEntry(activeInvestigation.id, eventType, payload)
    },
    [activeInvestigation, addEntry]
  )

  // Flush remaining events when session ends / component unmounts
  useEffect(() => {
    return () => {
      const batch = flushBatch()
      if (batch.length > 0) {
        window.api.logEvent(batch as unknown as object)
        clearPending()
      }
    }
  }, [flushBatch, clearPending])

  return { log }
}
