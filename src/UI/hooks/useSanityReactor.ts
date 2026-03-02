import { useEffect, useRef } from 'react'
import { useSanityStore } from '../stores/sanity.store'
import { useInvestigatorsStore } from '../stores/investigators.store'
import { SanityDistortion } from '../core/SanityDistortion'
import type { SanityThreshold } from '../types/audio.types'

/**
 * useSanityReactor — bridges the sanity store to the SanityDistortion audio engine.
 *
 * Observes groupThreshold from investigators.store. When the threshold changes,
 * it commands SanityDistortion to apply the corresponding audio parameters.
 *
 * React stays as the notifier; SanityDistortion is the executor.
 * No direct coupling between stores and audio engine classes.
 */
export function useSanityReactor() {
  const groupThreshold = useInvestigatorsStore((s) => s.groupThreshold)
  const groupSanity = useInvestigatorsStore((s) => s.groupSanity)
  const setGroupSanity = useSanityStore((s) => s.setGroupSanity)
  const prevThreshold = useRef<SanityThreshold | null>(null)

  // Sync investigators groupSanity → sanity store
  useEffect(() => {
    setGroupSanity(groupSanity)
  }, [groupSanity, setGroupSanity])

  // React to threshold changes → command audio engine
  useEffect(() => {
    if (prevThreshold.current === groupThreshold) return
    prevThreshold.current = groupThreshold
    SanityDistortion.applyThreshold(groupThreshold)
  }, [groupThreshold])

  return { groupThreshold, groupSanity }
}
