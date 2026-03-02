import { useEffect } from 'react'
import { useInvestigationStore } from '../../stores/investigation.store'
import { useInvestigatorsStore } from '../../stores/investigators.store'

/**
 * Investigations — Gerenciador de Investigações (Tela de Início)
 *
 * Entry point for the Keeper. Manages campaigns, sessions, investigators
 * and the session Timeline (auto-log).
 */
export default function Investigations() {
  const { investigations, setInvestigations, setActive } = useInvestigationStore()
  const { setInvestigators } = useInvestigatorsStore()

  useEffect(() => {
    window.api.getInvestigations().then(setInvestigations)
  }, [setInvestigations])

  const handleCreate = async (title: string, type: 'oneshot' | 'campaign') => {
    const created = await window.api.createInvestigation({ title, type })
    useInvestigationStore.getState().addInvestigation(created)
  }

  const handleSelect = async (id: number) => {
    const inv = investigations.find((i) => i.id === id)
    if (!inv) return
    setActive(inv)
    const investigators = await window.api.getInvestigators(id)
    setInvestigators(investigators)
  }

  return (
    <div className="feature-investigations">
      <h2>Investigações</h2>
      {/* TODO: InvestigationList, InvestigationCard, NewInvestigationForm, InvestigatorPanel, SessionTimeline */}
      <pre style={{ fontSize: 12, opacity: 0.5 }}>
        {JSON.stringify(investigations, null, 2)}
      </pre>
      <button onClick={() => handleCreate('Nova Campanha', 'campaign')}>+ Campanha</button>
      <button onClick={() => handleCreate('One-shot', 'oneshot')}>+ One-shot</button>
    </div>
  )
}
