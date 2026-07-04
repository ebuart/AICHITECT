import type { VisualState } from '@/types/visual'
import { stateToneClasses, visualStateMeta } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface TraceEvent {
  id: string
  step: number
  actor: string
  title: string
  detail?: string
  tags?: string[]
  state?: VisualState
}

export interface TraceTimelineProps {
  events: TraceEvent[]
  selectedEventId?: string
  onSelect?: (id: string) => void
  compact?: boolean
}

const dotTone: Record<string, string> = {
  neutral: 'bg-deck-muted',
  current: 'bg-deck-current',
  success: 'bg-deck-success',
  warning: 'bg-deck-warning',
  danger: 'bg-deck-danger',
  locked: 'bg-deck-locked',
}

// Execution trace (VIS-TraceTimeline). Single column on mobile; failure_origin
// and symptom are visually distinct via state chip + dot + ring (VQA-TraceTimeline).
export function TraceTimeline({
  events,
  selectedEventId,
  onSelect,
  compact = false,
}: TraceTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-deck-border p-3 text-xs text-deck-muted">
        Keine Events.
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {events.map((event, i) => {
        const state = event.state ?? 'default'
        const tone = visualStateMeta[state].tone
        const selected = event.id === selectedEventId
        const showDetail = event.detail && (selected || (!onSelect && !compact))

        const inner = (
          <div
            className={cn(
              'flex-1 rounded-lg border bg-deck-surface px-3 py-2 text-left',
              selected ? stateToneClasses[tone].ring : 'border-deck-border',
              state === 'failure_origin' && 'ring-1 ring-deck-danger/40',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="rounded bg-deck-surface-2 px-1 py-0.5 text-[10px] uppercase tracking-wider text-deck-muted">
                  {event.actor}
                </span>
                <span className="truncate text-sm font-medium text-white">
                  {event.title}
                </span>
              </span>
              <VisualStateChip state={state} />
            </div>
            {showDetail && (
              <p className="mt-1 text-xs text-deck-muted">{event.detail}</p>
            )}
            {!compact && event.tags && event.tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-deck-surface-2 px-1 py-0.5 text-[10px] text-deck-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )

        return (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center pt-2">
              <span className={cn('h-3 w-3 shrink-0 rounded-full', dotTone[tone])}>
                <span className="sr-only">Schritt {event.step}</span>
              </span>
              {i < events.length - 1 && (
                <span className="my-0.5 w-px flex-1 bg-deck-border" />
              )}
            </div>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(event.id)}
                className="flex min-h-12 flex-1 transition-colors"
              >
                {inner}
              </button>
            ) : (
              inner
            )}
          </li>
        )
      })}
    </ol>
  )
}
