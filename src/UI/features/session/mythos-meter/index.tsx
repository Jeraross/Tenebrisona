import { useMythosStore } from '../../../stores/mythos.store'
import { MythosScheduler } from '../../../core/MythosScheduler'
import { useSessionLog } from '../../../hooks/useSessionLog'
import type { MythosLevel } from '../../../types/audio.types'

/**
 * MythosMeter — O Medidor de Tensão do Mito (Dentro da Investigação)
 *
 * 3-stage tension controller. Level changes trigger organic audio transitions
 * via MythosScheduler. Drop-to-silence (Vacuum) and Eco do Mito are handled here.
 */
export default function MythosMeter() {
  const level = useMythosStore((s) => s.level)
  const isVacuumActive = useMythosStore((s) => s.isVacuumActive)
  const { setLevel, activateVacuum, deactivateVacuum } = useMythosStore()
  const { log } = useSessionLog()

  const handleLevelChange = (newLevel: MythosLevel) => {
    setLevel(newLevel)
    MythosScheduler.setLevel(newLevel)
    log('mythos_level_change', { from: level, to: newLevel })
  }

  const handleVacuum = () => {
    if (isVacuumActive) {
      deactivateVacuum()
      MythosScheduler.releaseVacuum()
    } else {
      activateVacuum()
      MythosScheduler.triggerVacuum()
      log('mythos_level_change', { event: 'vacuum' })
    }
  }

  const LEVELS: MythosLevel[] = [1, 2, 3]

  return (
    <div className="feature-mythos-meter">
      <h3>Mythos Meter</h3>
      <div className="mythos-levels">
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`mythos-btn level-${l} ${level === l ? 'active' : ''}`}
            onClick={() => handleLevelChange(l)}
          >
            Nível {l}
          </button>
        ))}
      </div>
      <button
        className={`vacuum-btn ${isVacuumActive ? 'vacuum-btn--active' : ''}`}
        onClick={handleVacuum}
      >
        {isVacuumActive ? 'Liberar Vácuo' : 'Drop to Silence'}
      </button>
      {/* TODO: Push the Roll hold-button */}
    </div>
  )
}
