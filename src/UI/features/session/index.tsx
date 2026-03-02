import { useSanityReactor } from '../../hooks/useSanityReactor'
import { useAudioStore } from '../../stores/audio.store'
import Playlists from './playlists'
import SanityPanel from './sanity'
import MythosMeter from './mythos-meter'
import VoicePanel from './voice'
import MadnessPanel from './madness'

/**
 * Session — Main in-session screen (Dentro da Investigação)
 *
 * Composes all real-time game tools. Layout switches between
 * Prep Mode (complex controls) and Live Mode (big trigger buttons only).
 */
export default function Session() {
  const sessionMode = useAudioStore((s) => s.sessionMode)
  const setSessionMode = useAudioStore((s) => s.setSessionMode)

  // Bridge sanity store ↔ audio engine
  useSanityReactor()

  return (
    <div className={`feature-session mode-${sessionMode}`}>
      <header className="session-header">
        <button onClick={() => setSessionMode(sessionMode === 'prep' ? 'live' : 'prep')}>
          {sessionMode === 'prep' ? 'Ir para Ao Vivo' : 'Modo Preparo'}
        </button>
      </header>

      <div className="session-grid">
        <Playlists />
        <MythosMeter />
        <SanityPanel />
        {sessionMode === 'prep' && <VoicePanel />}
        <MadnessPanel />
      </div>
    </div>
  )
}
