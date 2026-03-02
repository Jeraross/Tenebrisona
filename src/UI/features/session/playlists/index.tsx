import { useDucking } from '../../../hooks/useDucking'
import { useAudioStore } from '../../../stores/audio.store'
import { useSessionLog } from '../../../hooks/useSessionLog'

/**
 * Playlists — Soundboard Imersivo com Ducking (Dentro da Investigação)
 *
 * Left side: continuous loop players (music + ambience).
 * Right side: tactical one-shot grid categorized by tags.
 * Ducking fires automatically on each one-shot trigger.
 */
export default function Playlists() {
  const { fireEffect } = useDucking()
  const { log } = useSessionLog()
  const assets = useAudioStore((s) => s.assets)
  const sessionMode = useAudioStore((s) => s.sessionMode)

  const sfxAssets = assets.filter((a) => a.type === 'sfx')

  const handleFireSfx = async (assetId: number) => {
    const asset = sfxAssets.find((a) => a.id === assetId)
    if (!asset) return
    await fireEffect(asset)
    log('sfx_fired', { assetId, title: asset.title })
  }

  return (
    <div className="feature-playlists">
      <h3>Playlists &amp; Soundboard</h3>
      {/* TODO: LoopPlayer (ambient + music), SoundboardGrid, SceneSequencer */}
      <div className={`sfx-grid ${sessionMode === 'live' ? 'sfx-grid--live' : ''}`}>
        {sfxAssets.map((asset) => (
          <button
            key={asset.id}
            className="sfx-button"
            onClick={() => handleFireSfx(asset.id)}
          >
            {asset.title}
          </button>
        ))}
      </div>
    </div>
  )
}
