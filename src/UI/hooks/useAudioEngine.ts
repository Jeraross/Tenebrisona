import { useEffect } from 'react'
import { AudioEngine } from '../core/AudioEngine'
import { DuckingController } from '../core/DuckingController'
import { MythosScheduler } from '../core/MythosScheduler'
import { SanityDistortion } from '../core/SanityDistortion'
import type { Asset } from '../types/investigation.types'

/**
 * useAudioEngine — initializes and provides access to the AudioEngine singleton.
 *
 * Call once at the App root level. All feature components use the singleton
 * directly or via more specific hooks (useDucking, useSanityReactor, etc.).
 */
export function useAudioEngine() {
  useEffect(() => {
    // Resume AudioContext on first user interaction (browser policy)
    const handleInteraction = () => {
      AudioEngine.resume()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  const playOneShot = async (asset: Asset): Promise<void> => {
    if (!asset.file_path) return
    const buffer = await AudioEngine.decodeFile(asset.file_path)
    const source = AudioEngine.createBufferSource(buffer)
    source.connect(AudioEngine.bus.sfxBus)
    source.start(AudioEngine.currentTime)
    DuckingController.triggerDuck(buffer)
  }

  return { AudioEngine, DuckingController, MythosScheduler, SanityDistortion, playOneShot }
}
