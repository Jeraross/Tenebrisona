import { useState } from 'react'
import { VoiceModulator, VOICE_PRESETS } from '../../../core/VoiceModulator'

/**
 * VoicePanel — Modulador de Voz do Guardião (Dentro da Investigação)
 *
 * Real-time voice processing. Capture mic → apply entity preset → output.
 * Knobs allow per-session parameter tweaks without leaving the preset.
 * Only shown in Prep mode (unmounted in Live mode per architecture guideline).
 */
export default function VoicePanel() {
  const [active, setActive] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const handleToggle = async () => {
    if (active) {
      VoiceModulator.stop()
      setActive(false)
    } else {
      await VoiceModulator.start()
      setActive(true)
    }
  }

  const handlePreset = (presetId: string) => {
    setSelectedPreset(presetId)
    VoiceModulator.applyPreset(presetId)
  }

  return (
    <div className="feature-voice">
      <h3>Modulador de Voz</h3>
      <button onClick={handleToggle}>{active ? 'Desativar Microfone' : 'Ativar Microfone'}</button>

      <div className="voice-presets">
        {VOICE_PRESETS.map((p) => (
          <button
            key={p.id}
            className={`preset-btn ${selectedPreset === p.id ? 'active' : ''}`}
            onClick={() => handlePreset(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* TODO: Knob components for real-time param adjustment */}
    </div>
  )
}
