import { Button } from '@/components/ui/Button'
import { useProgress } from '@/features/progress/useProgress'
import { RoadmapArcSection } from './RoadmapArcSection'
import { useRoadmap } from './useRoadmap'

// Primary navigation surface (PC-002): the guided roadmap rendered from data
// (PH-204). Locked/available/in_progress/completed states come from persisted
// progress; completing a node unlocks its dependents on the next render.
export function RoadmapPage() {
  const { ready, arcs, completedCount, total, currentNode } = useRoadmap()
  const { resetAll } = useProgress()

  if (!ready) {
    return <p className="text-sm text-deck-muted">Lade Fortschritt…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-white">Roadmap</h1>
          <Button variant="ghost" className="min-h-0 px-2 py-1" onClick={resetAll}>
            Zurücksetzen
          </Button>
        </div>
        <p className="text-sm text-deck-muted">
          {completedCount} von {total} Nodes abgeschlossen
          {currentNode ? ` · Als Nächstes: ${currentNode.title}` : ''}
        </p>
      </header>

      {arcs.map((arcView) => (
        <RoadmapArcSection key={arcView.arc.id} view={arcView} />
      ))}
    </div>
  )
}
