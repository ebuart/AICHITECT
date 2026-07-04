import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'
import { labById } from '@/content/labs/labs'
import { firstLessonForNode } from '@/content/lessons'
import { useProgress } from '@/features/progress/useProgress'
import { cn } from '@/lib/utils/cn'
import { UNLOCK_ALL } from '@/lib/devFlags'
import type { NodeStatus } from '@/types'
import type { RoadmapNodeView } from './useRoadmap'
import { nodeStatusDisplay } from './nodeStatusDisplay'

// Single roadmap node. Locked nodes show only a preview (title, purpose, missing
// prerequisites) and grant no content access (RD-201/RD-202) — except in dev, where
// UNLOCK_ALL keeps the node greyed but playable for testing.
export function RoadmapNodeCard({ view }: { view: RoadmapNodeView }) {
  const { node, status, missing } = view
  const { setNodeStatus, completeNode } = useProgress()
  const display = nodeStatusDisplay[status]
  const locked = status === 'locked'
  const lockedForAccess = locked && !UNLOCK_ALL
  const lesson = firstLessonForNode(node.id)

  return (
    <Card className={locked ? 'opacity-70' : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-deck-muted">
            #{node.order} · {node.title}
          </span>
          <p className="text-sm leading-snug text-white">{node.purpose}</p>
        </div>
        <Badge tone={display.tone} aria-label={`Status: ${display.label}`}>
          <span aria-hidden>{display.symbol}</span>
          {display.label}
        </Badge>
      </div>

      {lockedForAccess ? (
        <p className="mt-3 text-xs text-deck-muted">
          Voraussetzung: {missing.length ? missing.join(', ') : '—'}
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {node.labIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {node.labIds.map((labId) => (
                <Link
                  key={labId}
                  to={paths.lab(labId)}
                  className="rounded-full border border-deck-border px-2 py-0.5 text-[11px] text-deck-muted hover:text-white"
                >
                  Lab: {labById[labId]?.title ?? labId}
                </Link>
              ))}
            </div>
          )}
          {lesson ? (
            <LessonLink
              lessonId={lesson.id}
              status={status}
              onOpen={() => {
                if (status === 'available') setNodeStatus(node.id, 'in_progress')
              }}
            />
          ) : (
            <NodeActions
              status={status}
              onStart={() => setNodeStatus(node.id, 'in_progress')}
              onComplete={() => completeNode(node.id)}
            />
          )}
        </div>
      )}
    </Card>
  )
}

const lessonLinkLabel: Record<NodeStatus, string> = {
  locked: 'Gesperrt',
  available: 'Lektion starten',
  in_progress: 'Fortsetzen',
  completed: 'Wiederholen',
}

// Lesson-bearing nodes route into the lesson engine; completing the lesson
// completes the node (see LessonPage).
function LessonLink({
  lessonId,
  status,
  onOpen,
}: {
  lessonId: string
  status: NodeStatus
  onOpen: () => void
}) {
  const primary = status !== 'completed'
  return (
    <Link
      to={paths.lesson(lessonId)}
      onClick={onOpen}
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors',
        primary
          ? 'bg-deck-accent text-deck-bg active:opacity-80'
          : 'border border-deck-border text-deck-muted hover:text-white',
      )}
    >
      {lessonLinkLabel[status]}
    </Link>
  )
}

// Fallback manual progression for nodes without a lesson yet (content lands in
// later phases). Keeps the rest of the roadmap traversable for testing.
function NodeActions({
  status,
  onStart,
  onComplete,
}: {
  status: RoadmapNodeView['status']
  onStart: () => void
  onComplete: () => void
}) {
  if (status === 'available') {
    return (
      <Button variant="subtle" onClick={onStart}>
        Starten
      </Button>
    )
  }
  if (status === 'in_progress') {
    return (
      <Button variant="primary" onClick={onComplete}>
        Abschließen
      </Button>
    )
  }
  // completed
  return (
    <Button variant="ghost" onClick={onStart}>
      Erneut öffnen
    </Button>
  )
}
