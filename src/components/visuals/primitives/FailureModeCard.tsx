import type { FailureKind, LayerId, VisualState } from '@/types/visual'
import { failureKindMeta, layerMeta } from '@/lib/visuals/visualMeta'
import { stateRingClass } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface FailureModeCardProps {
  id: string
  label: string
  kind: FailureKind
  layer?: LayerId
  state?: VisualState
  explanation?: string
}

const kindTone: Record<string, string> = {
  danger: 'border-deck-danger/40 bg-deck-danger/10 text-deck-danger',
  warning: 'border-deck-warning/40 bg-deck-warning/10 text-deck-warning',
  neutral: 'border-deck-border bg-deck-surface-2 text-deck-muted',
  success: 'border-deck-success/40 bg-deck-success/10 text-deck-success',
}

// Symptom / root cause / repair rule card (VIS-FailureModeCard). Kind + layer
// always shown so root cause vs symptom is unambiguous (VQA-FailureModeCard).
export function FailureModeCard({
  label,
  kind,
  layer,
  state = 'default',
  explanation,
}: FailureModeCardProps) {
  const meta = failureKindMeta[kind]
  return (
    <div
      className={cn(
        'rounded-xl border bg-deck-surface p-3',
        stateRingClass(state),
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
            kindTone[meta.tone],
          )}
        >
          <span aria-hidden>{meta.symbol}</span>
          {meta.label}
        </span>
        {layer && (
          <span className="rounded border border-deck-border px-1 py-0.5 text-[10px] text-deck-muted">
            {layerMeta[layer].short}
          </span>
        )}
        <VisualStateChip state={state} />
      </div>
      <p className="mt-1.5 text-sm font-medium text-white">{label}</p>
      {explanation && (
        <p className="mt-1 text-xs text-deck-muted">{explanation}</p>
      )}
    </div>
  )
}
