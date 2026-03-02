import { useSanityStore } from '../../../stores/sanity.store'
import { useSessionLog } from '../../../hooks/useSessionLog'
import type { MadnessType } from '../../../types/audio.types'

const MADNESS_TYPES: { type: MadnessType; label: string }[] = [
  { type: 'paranoia', label: 'Paranoia' },
  { type: 'blindness', label: 'Cegueira' },
  { type: 'deafness', label: 'Surdez' },
  { type: 'violence', label: 'Violência' },
  { type: 'flight', label: 'Fuga' },
  { type: 'catatonia', label: 'Catatonia' },
  { type: 'hallucination', label: 'Alucinação' },
  { type: 'amnesia', label: 'Amnésia' },
  { type: 'phobia', label: 'Fobia' },
  { type: 'hysteria', label: 'Histeria' }
]

/**
 * MadnessPanel — Gatilhos de "Surtos de Loucura" (Dentro do Controle de Sanidade)
 *
 * Triggers specific madness sonoscapes mapped to CoC 7e sanity rules.
 * Auto-Surto rolls from the 1d10 table; each result has its own audio signature.
 * Differentiates Temporary vs. Indefinite Madness (Sonic Scar).
 */
export default function MadnessPanel() {
  const { triggerMadness, clearMadness, activeMadness } = useSanityStore()
  const { log } = useSessionLog()

  const handleAutoSurto = () => {
    const roll = Math.floor(Math.random() * 10)
    const madness = MADNESS_TYPES[roll]
    triggerMadness(madness.type)
    log('madness_triggered', { type: madness.type, mode: 'auto' })
    // TODO: fire corresponding audio macro via AudioEngine
  }

  const handleSpecific = (type: MadnessType) => {
    triggerMadness(type)
    log('madness_triggered', { type, mode: 'manual' })
    // TODO: fire corresponding audio macro
  }

  return (
    <div className="feature-madness">
      <h3>Surtos de Loucura</h3>
      {activeMadness && (
        <div className="active-madness">
          Ativo: <strong>{activeMadness}</strong>
          <button onClick={clearMadness}>Encerrar</button>
        </div>
      )}

      <button className="auto-surto-btn" onClick={handleAutoSurto}>
        Acesso de Loucura (1d10 Auto)
      </button>

      <div className="madness-grid">
        {MADNESS_TYPES.map(({ type, label }) => (
          <button
            key={type}
            className={`madness-btn ${activeMadness === type ? 'active' : ''}`}
            onClick={() => handleSpecific(type)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* TODO: Indefinite Madness / Sonic Scar panel, Focused Hallucination (headphones mode) */}
    </div>
  )
}
