import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export type FlowStepStatus = 'done' | 'current' | 'todo'

export interface FlowStepProps {
  index: number
  label: string
  status?: FlowStepStatus
  description?: string
  /** Render a connector line below the step (false on the last step). */
  connector?: boolean
}

const statusMeta: Record<
  FlowStepStatus,
  { ring: string; dot: string; chip: 'completed' | 'selected' | 'default' }
> = {
  done: { ring: 'border-deck-success/50', dot: 'bg-deck-success text-deck-bg', chip: 'completed' },
  current: { ring: 'border-deck-current/60', dot: 'bg-deck-current text-deck-bg', chip: 'selected' },
  todo: { ring: 'border-deck-border', dot: 'bg-deck-surface-2 text-deck-muted', chip: 'default' },
}

// One step in a workflow/flow (VIS step card grammar VSS-041). Compose several
// vertically for a flow; deterministic, no emergent layout.
export function FlowStep({
  index,
  label,
  status = 'todo',
  description,
  connector = false,
}: FlowStepProps) {
  const meta = statusMeta[status]
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            meta.dot,
          )}
        >
          {index}
        </span>
        {connector && <span className="my-1 w-px flex-1 bg-deck-border" />}
      </div>
      <div
        className={cn(
          'mb-1 flex-1 rounded-lg border bg-deck-surface px-3 py-2',
          meta.ring,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          <VisualStateChip state={meta.chip} />
        </div>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-deck-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
