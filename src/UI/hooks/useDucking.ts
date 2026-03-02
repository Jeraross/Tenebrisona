import { DuckingController } from '../core/DuckingController'
import { AudioEngine } from '../core/AudioEngine'
import { useAudioStore } from '../stores/audio.store'
import type { Asset } from '../types/investigation.types'

/**
 * useDucking — hook for triggering one-shot SFX with automatic ducking.
 *
 * Flow:
 *   1. Keeper clicks SFX button (UI)
 *   2. fireEffect() fetches the audio buffer
 *   3. DuckingController ducks the ambient bus
 *   4. Buffer plays on sfxBus
 *   5. DuckingController schedules fade-back
 */
export function useDucking() {
  const setCurrentTrack = useAudioStore((s) => s.setCurrentTrack)

  const fireEffect = async (asset: Asset): Promise<void> => {
    if (!asset.file_path) {
      console.warn('[useDucking] Asset has no file_path:', asset.title)
      return
    }

    await AudioEngine.resume()

    const buffer = await AudioEngine.decodeFile(asset.file_path)
    const source = AudioEngine.createBufferSource(buffer)
    source.connect(AudioEngine.bus.sfxBus)

    DuckingController.triggerDuck(buffer)
    source.start(AudioEngine.currentTime)

    setCurrentTrack(asset)
    source.onended = () => setCurrentTrack(null)
  }

  const setAmbientVolume = (value: number) => {
    DuckingController.setVolume(value)
  }

  return { fireEffect, setAmbientVolume }
}
