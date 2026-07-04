import type { VisualState } from '@/types/visual'
import { VisualStateChip } from '../VisualStateChip'

export interface CompactFallbackItem {
  id: string
  label: string
  detail?: string
  state?: VisualState
}

export interface CompactFallbackViewProps {
  title: string
  summary: string
  items: CompactFallbackItem[]
}

// Canonical readable fallback for any dense visual (VIS-CompactFallbackView,
// BP-046). Must preserve the learning objective when a diagram is too complex.
export function CompactFallbackView({
  title,
  summary,
  items,
}: CompactFallbackViewProps) {
  return (
    <div className="rounded-xl border border-deck-border bg-deck-surface p-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-0.5 text-xs text-deck-muted">{summary}</p>
      <ol className="mt-2 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2">
            <span className="shrink-0 text-[11px] tabular-nums text-deck-muted">
              {i + 1}.
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white">{item.label}</span>
                {item.state && <VisualStateChip state={item.state} />}
              </div>
              {item.detail && (
                <p className="text-xs text-deck-muted">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
