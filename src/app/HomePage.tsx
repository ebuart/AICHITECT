import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'
import { useRoadmap } from '@/features/roadmap/useRoadmap'
import { useStrings } from '@/lib/i18n'

// Entry surface. Roadmap-first: the primary call to action leads into the
// guided roadmap, not a topic library (PC-002). Chrome strings come from the
// locale dictionary; in EN a German-first content notice is shown (DEC-0015).
export function HomePage() {
  const { ready, currentNode, completedCount, total } = useRoadmap()
  const t = useStrings()

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="w-fit rounded-full border border-deck-border bg-deck-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-deck-muted">
          AI Engineering Flight Deck
        </span>
        <h1 className="text-2xl font-semibold text-white">{t.homeWelcome}</h1>
        <p className="text-sm leading-relaxed text-deck-muted">{t.homeTagline}</p>
        {t.contentNotice && (
          <p className="text-xs leading-relaxed text-deck-muted">{t.contentNotice}</p>
        )}
      </div>

      {ready && (
        <Card className="flex flex-col gap-3">
          <span className="text-xs text-deck-muted">
            {t.homeProgress(completedCount, total)}
          </span>
          <span className="text-sm font-medium text-white">
            {currentNode ? t.homeNext(currentNode.title) : t.homeAllDone}
          </span>
          <Link
            to={paths.roadmap}
            className="flex min-h-12 items-center justify-center rounded-xl bg-deck-accent px-4 font-semibold text-deck-bg transition-opacity active:opacity-80"
          >
            {completedCount > 0 ? t.homeContinue : t.homeStart}
          </Link>
        </Card>
      )}
    </section>
  )
}
