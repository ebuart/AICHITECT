import type { ReactNode } from 'react'
import type { BoundaryKind, VisualState } from '@/types/visual'
import { boundaryKindMeta } from '@/lib/visuals/visualMeta'
import { stateRingClass } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface BoundaryBoxProps {
  id: string
  label: string
  kind: BoundaryKind
  state?: VisualState
  children?: ReactNode
  rules?: string[]
}

// Trust / permission / sandbox boundary (VIS-BoundaryBox). Dashed container with
// an always-visible label; rules surface the permission meaning (VQA-BoundaryBox).
export function BoundaryBox({
  label,
  kind,
  state = 'default',
  children,
  rules = [],
}: BoundaryBoxProps) {
  const meta = boundaryKindMeta[kind]
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed bg-deck-bg/40 p-3',
        stateRingClass(state),
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <span aria-hidden>{meta.symbol}</span>
          {label}
        </span>
        <VisualStateChip state={state} />
      </div>
      {rules.length > 0 && (
        <ul className="mt-1.5 flex flex-col gap-0.5">
          {rules.map((rule) => (
            <li key={rule} className="text-[11px] text-deck-muted">
              • {rule}
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  )
}
