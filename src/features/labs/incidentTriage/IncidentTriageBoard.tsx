import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { ScoreMeter } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import { cn } from '@/lib/utils/cn'
import type { InteractionEngineProps, LabResult } from '@/features/labs/interactionModel'
import type { TriageScenarioData } from './types'
import { scoreTriage } from './scoring'

// Incident Triage engine (MECH-TRIAGE). Reorder the response with up/down (no drag,
// LR-015); graded on order proximity. Reveals the ideal position only after evaluation.
export function IncidentTriageBoard({
  scenario,
  onComplete,
}: InteractionEngineProps<TriageScenarioData>) {
  const data = scenario.scenarioData
  const [order, setOrder] = useState<string[]>(() => data.actions.map((a) => a.id))
  const [result, setResult] = useState<ReturnType<typeof scoreTriage> | null>(null)

  const idealPos = new Map(data.correctOrder.map((id, i) => [id, i]))
  const byId = (id: string) => data.actions.find((a) => a.id === id)!

  const move = (i: number, dir: -1 | 1) => {
    if (result) return
    const j = i + dir
    if (j < 0 || j >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  const finish = () => {
    const scored = result ?? scoreTriage(data, order)
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
      <p className="rounded-xl border border-deck-warning/40 bg-deck-surface-2 p-3 text-xs text-white">
        {data.incident}
      </p>
      <p className="text-[11px] text-deck-muted">Bring die Reaktion in die richtige Reihenfolge.</p>

      <ol className="flex flex-col gap-2">
        {order.map((id, i) => {
          const action = byId(id)
          const correct = result && idealPos.get(id) === i
          return (
            <li
              key={id}
              className={cn(
                'flex items-start gap-2 rounded-xl border bg-deck-surface p-3',
                result ? (correct ? 'border-deck-success/50' : 'border-deck-danger/50') : 'border-deck-border',
              )}
            >
              <span className="mt-0.5 text-xs font-semibold tabular-nums text-deck-muted">{i + 1}</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-white">{action.label}</span>
                <p className="text-[11px] text-deck-muted">{action.note}</p>
                {result && !correct && (
                  <p className="mt-1 text-[11px] text-deck-warning">Ziel-Position: {(idealPos.get(id) ?? 0) + 1}</p>
                )}
              </div>
              {!result && (
                <div className="flex shrink-0 flex-col gap-1">
                  <MoveBtn dir="up" disabled={i === 0} onClick={() => move(i, -1)} />
                  <MoveBtn dir="down" disabled={i === order.length - 1} onClick={() => move(i, 1)} />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!result ? (
        <Button onClick={() => setResult(scoreTriage(data, order))}>Reihenfolge auswerten</Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter id="tri-fit" label="Triage-Fit" value={Math.round(result.score * 100)} max={100} interpretation="quality" />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => { setOrder(data.actions.map((a) => a.id)); setResult(null) }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}

function MoveBtn({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === 'up' ? 'nach oben' : 'nach unten'}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-deck-border text-deck-muted disabled:opacity-30"
    >
      {dir === 'up' ? '▲' : '▼'}
    </button>
  )
}
