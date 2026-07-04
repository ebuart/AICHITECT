import type { VisualState } from '@/types/visual'
import { stateRingClass } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface DecisionCardProps {
  id: string
  title: string
  description?: string
  tradeoffs?: string[]
  state?: VisualState
  disabledReason?: string
  onSelect?: (id: string) => void
}

// Selectable architecture decision (VIS-DecisionCard). Shows disabled reason,
// supports selected + strong/weak choice states (not color-only, VQA-DecisionCard).
export function DecisionCard({
  id,
  title,
  description,
  tradeoffs = [],
  state = 'default',
  disabledReason,
  onSelect,
}: DecisionCardProps) {
  const disabled = state === 'disabled' || disabledReason != null
  const interactive = onSelect && !disabled

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-white">{title}</span>
        <VisualStateChip state={state} />
      </div>
      {description && (
        <p className="mt-1 line-clamp-3 text-xs text-deck-muted">{description}</p>
      )}
      {tradeoffs.length > 0 && (
        <ul className="mt-2 flex flex-col gap-0.5">
          {tradeoffs.map((t) => (
            <li key={t} className="text-[11px] text-deck-muted">
              ⇄ {t}
            </li>
          ))}
        </ul>
      )}
      {disabled && disabledReason && (
        <p className="mt-2 text-[11px] text-deck-warning">⊘ {disabledReason}</p>
      )}
    </>
  )

  const className = cn(
    'w-full rounded-xl border bg-deck-surface p-3 text-left',
    stateRingClass(state),
    disabled && 'opacity-60',
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        className={cn(className, 'min-h-12 transition-colors hover:border-white')}
      >
        {body}
      </button>
    )
  }
  return <div className={className}>{body}</div>
}
