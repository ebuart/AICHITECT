import type { VisualState } from '@/types/visual'
import { visualStateMeta } from '@/lib/visuals/visualState'
import { cn } from '@/lib/utils/cn'

export interface TokenBudgetSegment {
  id: string
  label: string
  tokens: number
  state?: VisualState
}

export interface TokenBudgetBarProps {
  usedTokens: number
  maxTokens: number
  segments?: TokenBudgetSegment[]
  noiseRisk?: number
  missingContextRisk?: number
  compact?: boolean
}

const segmentFill: Record<string, string> = {
  neutral: 'bg-deck-muted/60',
  current: 'bg-deck-current/70',
  success: 'bg-deck-success/70',
  warning: 'bg-deck-warning/70',
  danger: 'bg-deck-danger/70',
  locked: 'bg-deck-locked/70',
}

function pct(n: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.round((n / max) * 100))
}

// Finite context budget with overflow + risk (VIS-TokenBudgetBar). Numbers and
// percentage are always shown; overflow and risk are textual, not color-only
// (VQA-TokenBudgetBar).
export function TokenBudgetBar({
  usedTokens,
  maxTokens,
  segments = [],
  noiseRisk,
  missingContextRisk,
  compact = false,
}: TokenBudgetBarProps) {
  const over = usedTokens > maxTokens
  const usedPct = pct(usedTokens, maxTokens)

  return (
    <div className="rounded-xl border border-deck-border bg-deck-surface p-3">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-white">Context Budget</span>
        <span className={cn('tabular-nums', over ? 'text-deck-danger' : 'text-deck-muted')}>
          {usedTokens.toLocaleString('de-DE')} / {maxTokens.toLocaleString('de-DE')} ({usedPct}%)
          {over && ' · Überlauf'}
        </span>
      </div>

      <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-deck-bg">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={cn('h-full', segmentFill[visualStateMeta[seg.state ?? 'default'].tone])}
            style={{ width: `${pct(seg.tokens, maxTokens)}%` }}
            title={`${seg.label}: ${seg.tokens}`}
          />
        ))}
      </div>

      {!compact && segments.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {segments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-deck-muted">
                <span
                  aria-hidden
                  className={cn('h-2 w-2 rounded-full', segmentFill[visualStateMeta[seg.state ?? 'default'].tone])}
                />
                {seg.label}
              </span>
              <span className="tabular-nums text-deck-muted">
                {seg.tokens.toLocaleString('de-DE')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {(noiseRisk != null || missingContextRisk != null) && (
        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
          {noiseRisk != null && (
            <RiskTag label="Noise-Risk" value={noiseRisk} />
          )}
          {missingContextRisk != null && (
            <RiskTag label="Missing-Context-Risk" value={missingContextRisk} />
          )}
        </div>
      )}
    </div>
  )
}

function RiskTag({ label, value }: { label: string; value: number }) {
  const level = value >= 0.66 ? 'hoch' : value >= 0.33 ? 'mittel' : 'niedrig'
  const tone = value >= 0.66 ? 'text-deck-danger' : value >= 0.33 ? 'text-deck-warning' : 'text-deck-muted'
  return (
    <span className={cn('rounded border border-deck-border px-1.5 py-0.5', tone)}>
      {label}: {level} ({Math.round(value * 100)}%)
    </span>
  )
}
