import { useInvestigatorsStore } from '../../../stores/investigators.store'
import { useSessionLog } from '../../../hooks/useSessionLog'

/**
 * SanityPanel — Controle de Sanidade (Dentro da Investigação)
 *
 * Displays each investigator's current sanity. Keeper adjusts values here.
 * Changes propagate to investigators.store → sanity.store → SanityDistortion.
 * The audio reacts automatically via useSanityReactor in the Session parent.
 */
export default function SanityPanel() {
  const investigators = useInvestigatorsStore((s) => s.investigators)
  const { updateSanity } = useInvestigatorsStore()
  const { log } = useSessionLog()
  const groupSanity = useInvestigatorsStore((s) => s.groupSanity)
  const groupThreshold = useInvestigatorsStore((s) => s.groupThreshold)

  const handleSanityChange = (id: number, value: number) => {
    const clamped = Math.max(0, Math.min(100, value))
    updateSanity(id, clamped)
    log('sanity_change', { investigatorId: id, newSanity: clamped, groupSanity })
  }

  return (
    <div className="feature-sanity">
      <h3>Sanidade — Grupo: {groupSanity}% [{groupThreshold}]</h3>
      {/* TODO: SanityBar component, InvestigatorSanityRow, MadnessTriggerButton */}
      {investigators.map((inv) => (
        <div key={inv.id} className="sanity-row">
          <span>{inv.character_name}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={inv.sanity}
            onChange={(e) => handleSanityChange(inv.id, Number(e.target.value))}
          />
          <span>{inv.sanity}%</span>
        </div>
      ))}
    </div>
  )
}
