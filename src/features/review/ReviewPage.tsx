import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ScoreMeter } from '@/components/visuals'
import { roadmapGraph } from '@/content/roadmap'
import { firstLessonForNode } from '@/content/lessons'
import { useProgress } from '@/features/progress/useProgress'
import { paths } from '@/routes/paths'
import { buildReviewState, type ReviewItem } from './reviewModel'
import { findMission } from './reviewMission'

// Review surface (PHASE_7, PH-801/PH-802). Mastery recap + repair missions + a
// spaced queue, all derived from persisted progress (no XP/streaks, PH-803).
export function ReviewPage() {
  const { state, ready } = useProgress()
  if (!ready) return <p className="text-sm text-deck-muted">Lade Fortschritt…</p>

  const review = buildReviewState(state, {
    nodeById: roadmapGraph.nodeById,
    reviewHooksForNode: (id) => firstLessonForNode(id)?.reviewHooks ?? [],
  })

  if (review.summary.total === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-white">Review</h1>
        <Card>
          <p className="text-sm text-deck-muted">
            Noch nichts abgeschlossen. Starte in der Roadmap — abgeschlossene Nodes erscheinen hier zur
            Wiederholung.
          </p>
          <Link to={paths.roadmap} className="mt-3 inline-block text-sm font-medium text-deck-accent">
            Zur Roadmap
          </Link>
        </Card>
      </div>
    )
  }

  const { summary, repairs, queue, themes } = review

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold text-white">Review</h1>
        <ScoreMeter
          id="review-mastery"
          label="Gemeisterte Nodes"
          value={summary.practiced}
          max={summary.total}
          interpretation="mastery"
        />
        <p className="text-xs text-deck-muted">
          {summary.practiced} gemeistert · {summary.introduced} eingeführt · {summary.needsRepair} zu reparieren
        </p>
      </header>

      {repairs.length > 0 && (
        <Section title="Repair Missions" hint="Schwachstellen aus deinen Labs zuerst.">
          {repairs.map((item) => (
            <RepairCard key={item.nodeId} item={item} />
          ))}
        </Section>
      )}

      <Section title="Zur Wiederholung fällig" hint="Ältere Abschlüsse zuerst — Wissen frisch halten.">
        {queue.map((item) => (
          <ReviewCard key={item.nodeId} item={item} />
        ))}
      </Section>

      {themes.length > 0 && (
        <Section title="Wiederkehrende Themen" hint="Diese Ideen tauchen über mehrere Nodes auf.">
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Badge key={theme.hook} tone="current">
                {theme.hook} · {theme.nodeIds.length}
              </Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
        <p className="text-xs text-deck-muted">{hint}</p>
      </div>
      {children}
    </section>
  )
}

/** Lab id of a node whose result drove the weak signals (for a "repeat" link). */
function nodeLabId(item: ReviewItem): string | undefined {
  return roadmapGraph.nodeById[item.nodeId]?.labIds[0]
}

// Prefers a re-runnable Review-Mission (transfer task) over a plain link (PH-804).
function MissionLink({
  nodeId,
  fallback,
}: {
  nodeId: string
  fallback?: { to: string; label: string }
}) {
  const mission = findMission(nodeId)
  if (mission) {
    return (
      <Link to={paths.reviewRun(nodeId)} className="text-sm font-medium text-deck-accent">
        {mission.isTransfer ? 'Review-Mission (Transfer) starten →' : 'Review-Mission starten →'}
      </Link>
    )
  }
  if (fallback) {
    return (
      <Link to={fallback.to} className="text-sm font-medium text-deck-accent">
        {fallback.label}
      </Link>
    )
  }
  return null
}

function RepairCard({ item }: { item: ReviewItem }) {
  const labId = nodeLabId(item)
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-white">{item.title}</span>
        <Badge tone="warning">Reparieren</Badge>
      </div>
      {item.weakSignals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.weakSignals.map((w) => (
            <Badge key={w} tone="danger">
              {w}
            </Badge>
          ))}
        </div>
      )}
      <MissionLink
        nodeId={item.nodeId}
        fallback={labId ? { to: paths.lab(labId), label: 'Lab wiederholen →' } : undefined}
      />
    </Card>
  )
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const lesson = firstLessonForNode(item.nodeId)
  const masteryTone = item.mastery === 'practiced' ? 'success' : 'neutral'
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-white">{item.title}</span>
        <Badge tone={masteryTone}>{item.mastery === 'practiced' ? 'gemeistert' : 'eingeführt'}</Badge>
      </div>
      {item.conceptIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.conceptIds.slice(0, 3).map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
      )}
      <MissionLink
        nodeId={item.nodeId}
        fallback={lesson ? { to: paths.lesson(lesson.id), label: 'Lektion wiederholen →' } : undefined}
      />
    </Card>
  )
}
