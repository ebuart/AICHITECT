import type { MeterInterpretation } from '@/types/visual'
import { cn } from '@/lib/utils/cn'

export interface ScoreMeterProps {
  id: string
  label: string
  value: number
  max: number
  interpretation?: MeterInterpretation
  compact?: boolean
}

const interpretationLabel: Record<MeterInterpretation, string> = {
  risk: 'Risk',
  mastery: 'Mastery',
  coverage: 'Coverage',
  quality: 'Quality',
}

// Returns a semantic word for the value band. For `risk`, high is bad; for the
// others, high is good — so the same fill reads correctly per interpretation.
function band(ratio: number, interpretation: MeterInterpretation): {
  word: string
  fill: string
} {
  const high = ratio >= 0.66
  const mid = ratio >= 0.33
  if (interpretation === 'risk') {
    if (high) return { word: 'hoch', fill: 'bg-deck-danger/70' }
    if (mid) return { word: 'mittel', fill: 'bg-deck-warning/70' }
    return { word: 'niedrig', fill: 'bg-deck-success/70' }
  }
  if (high) return { word: 'hoch', fill: 'bg-deck-success/70' }
  if (mid) return { word: 'mittel', fill: 'bg-deck-warning/70' }
  return { word: 'niedrig', fill: 'bg-deck-danger/60' }
}

// Calm linear meter (VIS-ScoreMeter). Numeric value + semantic word, no
// XP/dopamine styling (VQA-ScoreMeter, PC-061).
export function ScoreMeter({
  label,
  value,
  max,
  interpretation = 'quality',
  compact = false,
}: ScoreMeterProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const percent = Math.round(ratio * 100)
  const { word, fill } = band(ratio, interpretation)

  return (
    <div className="rounded-xl border border-deck-border bg-deck-surface p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-[11px] text-deck-muted">
          {interpretationLabel[interpretation]} · {word}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-deck-bg">
          <div className={cn('h-full rounded-full', fill)} style={{ width: `${percent}%` }} />
        </div>
        {!compact && (
          <span className="shrink-0 text-[11px] tabular-nums text-deck-muted">
            {value}/{max} ({percent}%)
          </span>
        )}
      </div>
    </div>
  )
}
