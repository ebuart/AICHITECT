import type { LayerId, SystemNodeKind, VisualState } from '@/types/visual'
import { nodeKindMeta, layerMeta } from '@/lib/visuals/visualMeta'
import { stateRingClass } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface SystemNodeProps {
  id: string
  label: string
  kind: SystemNodeKind
  state?: VisualState
  layer?: LayerId
  badges?: string[]
  description?: string
  compact?: boolean
  onSelect?: (id: string) => void
}

const MAX_BADGES = 3

// One system component in an architecture diagram (VIS-SystemNode). Kind shown
// by glyph + label; label truncates safely; works in fixed slots (no layout
// dependency on siblings, VSS-140).
export function SystemNode({
  id,
  label,
  kind,
  state = 'default',
  layer,
  badges = [],
  description,
  compact = false,
  onSelect,
}: SystemNodeProps) {
  const kindMeta = nodeKindMeta[kind]
  const shownBadges = badges.slice(0, MAX_BADGES)
  const overflow = badges.length - shownBadges.length

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className="text-base leading-none">
            {kindMeta.symbol}
          </span>
          <span className="truncate text-[10px] uppercase tracking-wider text-deck-muted">
            {kindMeta.label}
          </span>
        </span>
        <VisualStateChip state={state} />
      </div>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-white">
        {label}
      </p>
      {!compact && description && (
        <p className="mt-1 line-clamp-2 text-xs text-deck-muted">{description}</p>
      )}
      {!compact && (shownBadges.length > 0 || layer) && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {layer && (
            <span className="rounded border border-deck-border px-1 py-0.5 text-[10px] text-deck-muted">
              {layerMeta[layer].short}
            </span>
          )}
          {shownBadges.map((b) => (
            <span
              key={b}
              className="rounded bg-deck-surface-2 px-1 py-0.5 text-[10px] text-deck-muted"
            >
              {b}
            </span>
          ))}
          {overflow > 0 && (
            <span className="text-[10px] text-deck-muted">+{overflow}</span>
          )}
        </div>
      )}
    </>
  )

  const className = cn(
    'w-full rounded-xl border bg-deck-surface p-3 text-left',
    stateRingClass(state),
    state === 'disabled' && 'opacity-50',
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        disabled={state === 'disabled'}
        className={cn(className, 'min-h-12 transition-colors hover:border-white')}
      >
        {body}
      </button>
    )
  }
  return <div className={className}>{body}</div>
}
