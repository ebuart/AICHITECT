import type { LayerId, VisualState } from '@/types/visual'
import { stateRingClass } from '@/lib/visuals/visualState'
import { VisualStateChip } from '../VisualStateChip'
import { cn } from '@/lib/utils/cn'

export interface LayerStackLayer {
  id: LayerId
  label: string
  role: string
  state?: VisualState
  items?: string[]
}

export interface LayerStackProps {
  layers: LayerStackLayer[]
  highlightedLayerId?: LayerId
  compact?: boolean
}

const MAX_LAYERS = 8

// Vertical system-layer stack (VIS-LayerStack). Always a vertical card list on
// mobile; supports a highlighted failure layer; groups beyond 8 layers (VSS-060).
export function LayerStack({
  layers,
  highlightedLayerId,
  compact = false,
}: LayerStackProps) {
  const visible = layers.slice(0, MAX_LAYERS)
  const hidden = layers.length - visible.length

  if (layers.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-deck-border p-3 text-xs text-deck-muted">
        Keine Layers.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {visible.map((layer) => {
        const highlighted = layer.id === highlightedLayerId
        const state: VisualState = layer.state ?? 'default'
        return (
          <div
            key={layer.id}
            className={cn(
              'rounded-lg border bg-deck-surface px-3 py-2',
              stateRingClass(highlighted ? 'failure_origin' : state),
              highlighted && 'ring-1 ring-deck-danger/40',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-white">
                {layer.label}
              </span>
              {highlighted ? (
                <VisualStateChip state="failure_origin" />
              ) : (
                <VisualStateChip state={state} />
              )}
            </div>
            {!compact && (
              <p className="mt-0.5 line-clamp-2 text-xs text-deck-muted">
                {layer.role}
              </p>
            )}
            {!compact && layer.items && layer.items.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-deck-surface-2 px-1 py-0.5 text-[10px] text-deck-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
      {hidden > 0 && (
        <p className="text-[11px] text-deck-muted">+{hidden} weitere Layers</p>
      )}
    </div>
  )
}
