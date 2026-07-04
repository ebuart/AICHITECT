import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { lessonById } from '@/content/lessons'
import { roadmapGraph } from '@/content/roadmap'
import { useProgress } from '@/features/progress/useProgress'
import { isNodeCompleted } from '@/features/roadmap/roadmapStatus'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { UNLOCK_ALL } from '@/lib/devFlags'
import { paths } from '@/routes/paths'
import { LessonView } from './LessonView'

// Lesson engine entry. Enforces roadmap prerequisites (QG-047, PH-404) before
// rendering, and completes the bound node when the lesson is finished. If the lesson was opened
// FROM the Werft (`?return=werft`), finishing returns there (where the reward + unlock land) instead
// of the roadmap — opening a quest and being dumped on the roadmap was confusing.
export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, ready, completeLesson } = useProgress()
  const lesson = id ? lessonById[id] : undefined

  const fromWerft = params.get('return') === 'werft'
  const returnTo = fromWerft ? paths.build : paths.roadmap
  const returnLabel = fromWerft ? 'Werft' : 'Roadmap'
  const backLink = (
    <Link to={returnTo} className="text-sm font-medium text-deck-accent">
      Zur {returnLabel}
    </Link>
  )

  if (!lesson) {
    return (
      <PagePlaceholder phase="PHASE_3" title="Lektion nicht gefunden" description="Diese Lektion existiert nicht.">
        {backLink}
      </PagePlaceholder>
    )
  }

  if (!ready) {
    return <p className="text-sm text-deck-muted">Lade…</p>
  }

  const missing = lesson.prerequisites.filter((p) => !isNodeCompleted(p, state))
  if (missing.length > 0 && !UNLOCK_ALL) {
    const titles = missing.map((p) => roadmapGraph.nodeById[p]?.title ?? p)
    return (
      <PagePlaceholder phase="PHASE_3" title="Noch gesperrt" description={`Schließe zuerst ab: ${titles.join(', ')}`}>
        {backLink}
      </PagePlaceholder>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Link to={returnTo} className="w-fit text-xs text-deck-muted hover:text-white">
        ← {returnLabel}
      </Link>
      <LessonView
        lesson={lesson}
        onComplete={() => {
          completeLesson(lesson.id, lesson.roadmapNodeId)
          navigate(returnTo)
        }}
      />
    </div>
  )
}
