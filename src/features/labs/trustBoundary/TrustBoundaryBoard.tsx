import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { ScoreMeter } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import { cn } from '@/lib/utils/cn'
import type { InteractionEngineProps, LabResult } from '@/features/labs/interactionModel'
import type { BoundaryConfig, BoundaryScenarioData, TrustZone } from './types'
import { scoreBoundary } from './scoring'

// Trust Boundary engine (MECH-BOUNDARY). Assign each element to a trust zone via tap
// (no drag, LR-015); reveal the correct containment only after evaluation.
export function TrustBoundaryBoard({
  scenario,
  onComplete,
}: InteractionEngineProps<BoundaryScenarioData>) {
  const data = scenario.scenarioData
  const [config, setConfig] = useState<BoundaryConfig>({})
  const [result, setResult] = useState<ReturnType<typeof scoreBoundary> | null>(null)

  const allPlaced = data.elements.every((e) => config[e.id])
  const assign = (elId: string, zoneId: string) =>
    !result && setConfig((p) => ({ ...p, [elId]: zoneId }))

  const finish = () => {
    const scored = result ?? scoreBoundary(data, config)
    const labResult: LabResult = {
      scenarioId: scenario.id,
      completed: true,
      score: scored.score,
      masterySignals: scored.masterySignals,
      weakSignals: scored.weakSignals,
      feedback: scored.feedback,
      reviewHookIds: scenario.reviewHooks,
      completedAt: new Date().toISOString(),
    }
    onComplete(labResult)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl border border-deck-border bg-deck-surface-2 p-3 text-xs text-white">
        {data.system}
      </p>

      <div className="flex flex-col gap-1">
        {data.zones.map((z) => (
          <p key={z.id} className="text-[11px] text-deck-muted">
            <span className="font-semibold text-white">{z.label}</span> — {z.hint}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {data.elements.map((el) => {
          const chosen = config[el.id]
          return (
            <div key={el.id} className="rounded-xl border border-deck-border bg-deck-surface p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-white">{el.label}</span>
                {/* The risk verdict is the answer — only reveal it after evaluation (LR-011b). */}
                {result && el.risk === 'high' && <span className="shrink-0 text-[10px] uppercase tracking-wider text-deck-warning">hoch-Risiko</span>}
              </div>
              <p className="mt-0.5 text-[11px] text-deck-muted">{el.note}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.zones.map((z) => (
                  <ZoneChip
                    key={z.id}
                    zone={z}
                    selected={chosen === z.id}
                    revealed={result != null}
                    isCorrect={z.id === el.bestZone}
                    onClick={() => assign(el.id, z.id)}
                  />
                ))}
              </div>
              {result && chosen !== el.bestZone && (
                <p className="mt-1.5 text-[11px] text-deck-warning">
                  Richtig: {data.zones.find((z) => z.id === el.bestZone)?.label}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!result ? (
        <Button onClick={() => setResult(scoreBoundary(data, config))} disabled={!allPlaced}>
          {allPlaced ? 'Grenzen auswerten' : 'Jedes Element einer Zone zuweisen'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter id="bnd-fit" label="Boundary-Fit" value={Math.round(result.score * 100)} max={100} interpretation="quality" />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => { setConfig({}); setResult(null) }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}

function ZoneChip({
  zone,
  selected,
  revealed,
  isCorrect,
  onClick,
}: {
  zone: TrustZone
  selected: boolean
  revealed: boolean
  isCorrect: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={revealed}
      onClick={onClick}
      className={cn(
        'min-h-9 rounded-lg border px-2 text-xs font-medium transition-colors disabled:opacity-80',
        revealed
          ? isCorrect
            ? 'border-deck-success/60 text-deck-success'
            : selected
              ? 'border-deck-danger/60 text-deck-danger'
              : 'border-deck-border text-deck-muted'
          : selected
            ? 'border-deck-accent text-deck-accent'
            : 'border-deck-border text-deck-muted',
      )}
    >
      {zone.label}
    </button>
  )
}
