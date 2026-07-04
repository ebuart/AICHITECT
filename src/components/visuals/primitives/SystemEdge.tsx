import type { EdgeDirection, SystemEdgeKind, VisualState } from '@/types/visual'
import { edgeKindMeta } from '@/lib/visuals/visualMeta'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface SystemEdgeProps {
  id: string
  from: string
  to: string
  label?: string
  kind: SystemEdgeKind
  state?: VisualState
  direction?: EdgeDirection
}

const toneBorder: Record<string, string> = {
  neutral: 'border-deck-muted/50',
  current: 'border-deck-current/60',
  warning: 'border-deck-warning/70',
  danger: 'border-deck-danger/70',
}

// Connection between two system nodes (VIS-SystemEdge). Rendered as a labelled
// HTML connector — no auto-positioning — so it can also read as a connection
// list on mobile (VQA-SystemEdge). Risky edges carry an explicit access chip.
export function SystemEdge({
  from,
  to,
  label,
  kind,
  state = 'default',
  direction = 'one_way',
}: SystemEdgeProps) {
  const meta = edgeKindMeta[kind]
  const arrow = direction === 'two_way' ? '↔' : '→'
  const risky = kind === 'risk' || kind === 'approval'

  return (
    <div className="rounded-lg border border-deck-border bg-deck-surface p-2">
      <div className="flex items-center gap-2 text-xs text-white">
        <span className="shrink-0 font-medium">{from}</span>
        <span
          className={cn(
            'relative flex-1 border-t',
            meta.dashed && 'border-dashed',
            toneBorder[meta.tone],
          )}
        >
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-deck-muted"
          >
            {arrow}
          </span>
        </span>
        <span className="shrink-0 font-medium">{to}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="rounded bg-deck-surface-2 px-1 py-0.5 text-[10px] uppercase tracking-wider text-deck-muted">
          {meta.label}
        </span>
        {label && <span className="text-[11px] text-deck-muted">{label}</span>}
        <VisualStateChip state={state} />
        {risky && (
          <span className="rounded border border-deck-warning/40 px-1 py-0.5 text-[10px] text-deck-warning">
            ⓘ Details
          </span>
        )}
      </div>
    </div>
  )
}
