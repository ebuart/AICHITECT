import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { roadmapGraph } from '@/content/roadmap'
import { useProgress } from '@/features/progress/useProgress'
import type { LabResult } from '@/features/labs/interactionModel'
import { paths } from '@/routes/paths'
import { findMission } from './reviewMission'

// Review-mission host (PHASE_7 deepening, PH-804). Re-runs a completed node's lab —
// the transfer (changed-context) variant when available — and persists the result
// via completeLab (updates best score + weakSignals → mastery refreshes). The idea
// reappears in a new context instead of just being linked.
export function ReviewRunPage() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()
  const { ready, completeLab } = useProgress()

  const mission = nodeId ? findMission(nodeId) : undefined
  const node = nodeId ? roadmapGraph.nodeById[nodeId] : undefined

  if (!ready) return <p className="text-sm text-deck-muted">Lade…</p>

  if (!mission || !node) {
    return (
      <PagePlaceholder
        phase="PHASE_7"
        title="Keine Review-Mission"
        description="Für diesen Node gibt es keine wiederholbare taktische Aufgabe."
      >
        <Link to={paths.review} className="text-sm font-medium text-deck-accent">
          Zurück zum Review
        </Link>
      </PagePlaceholder>
    )
  }

  const onComplete = (result: LabResult) => {
    completeLab(mission.labId, mission.scenario.roadmapNodeId, result.score, result.weakSignals)
    navigate(paths.review)
  }

  return (
    <div className="flex flex-col gap-3">
      <Link to={paths.review} className="w-fit text-xs text-deck-muted hover:text-white">
        ← Review
      </Link>
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Badge tone="current">Review-Mission</Badge>
          {mission.isTransfer && <Badge tone="neutral">Transfer · neuer Kontext</Badge>}
        </div>
        <h1 className="text-xl font-semibold text-white">{node.title}</h1>
        <p className="text-sm text-deck-muted">{mission.scenario.prompt}</p>
      </header>

      <div key={mission.scenario.id}>{mission.entry.render(mission.scenario, onComplete)}</div>
    </div>
  )
}
