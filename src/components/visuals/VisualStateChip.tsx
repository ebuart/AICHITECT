import type { VisualState } from '@/types/visual'
import { stateToneClasses, visualStateMeta } from '@/lib/visuals/visualState'
import { cn } from '@/lib/utils/cn'

// Tiny labelled state chip reused by every stateful primitive so visual state
// is never color-only (VSS-101/102). Renders nothing for the 'default' state.
export function VisualStateChip({ state }: { state: VisualState }) {
  if (state === 'default') return null
  const meta = visualStateMeta[state]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
        stateToneClasses[meta.tone].chip,
      )}
    >
      <span aria-hidden>{meta.symbol}</span>
      {meta.label}
    </span>
  )
}
