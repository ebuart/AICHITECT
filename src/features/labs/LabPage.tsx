import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { labById } from '@/content/labs/labs'
import { roadmapGraph } from '@/content/roadmap'
import { useProgress } from '@/features/progress/useProgress'
import { isNodeCompleted } from '@/features/roadmap/roadmapStatus'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import { UNLOCK_ALL } from '@/lib/devFlags'
import { paths } from '@/routes/paths'
import {
  interactionRegistry,
} from './interactionRegistry'
import {
  introScenario,
  transferScenario,
  type LabResult,
} from './interactionModel'

const backLink = (
  <Link to={paths.roadmap} className="text-sm font-medium text-deck-accent">
    Zur Roadmap
  </Link>
)

// Roadmap-bound lab host (PC-003, LS-001). Resolves the engine by interaction
// type, enforces prerequisites (QG-047), persists the result (LS-006/007).
export function LabPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, ready, completeLab } = useProgress()
  const [variant, setVariant] = useState<'base' | 'transfer'>('base')

  const lab = id ? labById[id] : undefined
  const entry = lab ? interactionRegistry[lab.interactionType] : undefined

  if (!lab || !entry) {
    return (
      <PagePlaceholder
        phase="PHASE_4"
        title={lab ? 'Lab folgt' : 'Lab nicht gefunden'}
        description={
          lab
            ? 'Diese Interaction-Engine ist noch nicht implementiert.'
            : 'Dieses Lab existiert nicht.'
        }
      >
        {backLink}
      </PagePlaceholder>
    )
  }

  if (!ready) return <p className="text-sm text-deck-muted">Lade…</p>

  const base = introScenario(entry.scenarios, lab.id)
  const transfer = transferScenario(entry.scenarios, lab.id)
  const scenario = variant === 'transfer' && transfer ? transfer : base

  if (!scenario) {
    return (
      <PagePlaceholder phase="PHASE_4" title="Kein Szenario" description="Für dieses Lab fehlt ein Szenario.">
        {backLink}
      </PagePlaceholder>
    )
  }

  const missing = scenario.prerequisites.filter((p) => !isNodeCompleted(p, state))
  if (missing.length > 0 && !UNLOCK_ALL) {
    const titles = missing.map((p) => roadmapGraph.nodeById[p]?.title ?? p)
    return (
      <PagePlaceholder
        phase="PHASE_4"
        title="Noch gesperrt"
        description={`Schließe zuerst ab: ${titles.join(', ')}`}
      >
        {backLink}
      </PagePlaceholder>
    )
  }

  const onComplete = (result: LabResult) => {
    completeLab(lab.id, scenario.roadmapNodeId, result.score, result.weakSignals)
    navigate(paths.roadmap)
  }

  return (
    <div className="flex flex-col gap-3">
      <Link to={paths.roadmap} className="w-fit text-xs text-deck-muted hover:text-white">
        ← Roadmap
      </Link>
      <header className="flex flex-col gap-1.5">
        <Badge tone="current">Lab · {scenario.difficulty}</Badge>
        <h1 className="text-xl font-semibold text-white">{scenario.title}</h1>
        <p className="text-sm text-deck-muted">{scenario.prompt}</p>
      </header>

      {transfer && (
        <div className="flex gap-1.5">
          {(['base', 'transfer'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={cn(
                'rounded-full border px-3 py-1 text-[11px]',
                variant === v
                  ? 'border-deck-accent text-deck-accent'
                  : 'border-deck-border text-deck-muted',
              )}
            >
              {v === 'base' ? 'Basis' : 'Transfer'}
            </button>
          ))}
        </div>
      )}

      <div key={scenario.id}>{entry.render(scenario, onComplete)}</div>
    </div>
  )
}
