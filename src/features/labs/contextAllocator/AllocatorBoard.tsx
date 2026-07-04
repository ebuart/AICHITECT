import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { ScoreMeter } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type { InteractionEngineProps, LabResult } from '@/features/labs/interactionModel'
import type { AllocScenarioData, Allocation } from './types'
import { shares } from './types'
import { scoreAllocation } from './scoring'

const SEGMENT = ['bg-deck-accent', 'bg-cyan-400', 'bg-teal-400', 'bg-sky-500', 'bg-indigo-400', 'bg-emerald-400']

// Allocator engine (MECH-ALLOCATE). Distribute a finite budget across categories with
// sliders (mobile direct-manipulation, LR-015); graded on direction, not a single right
// answer. Reveals your-share vs target only after evaluation.
export function AllocatorBoard({
  scenario,
  onComplete,
}: InteractionEngineProps<AllocScenarioData>) {
  const data = scenario.scenarioData
  const [alloc, setAlloc] = useState<Allocation>(
    () => Object.fromEntries(data.items.map((i) => [i.id, 25])),
  )
  const [result, setResult] = useState<ReturnType<typeof scoreAllocation> | null>(null)

  const sh = result ? result.shares : shares(data.items, alloc)
  const set = (id: string, v: number) => !result && setAlloc((p) => ({ ...p, [id]: v }))

  const finish = () => {
    const scored = result ?? scoreAllocation(data, alloc)
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
      <div className="rounded-xl border border-deck-border bg-deck-surface-2 p-3">
        <p className="text-xs text-white">{data.situation}</p>
        <p className="mt-1 text-[11px] text-deck-muted">Budget: {data.budget} · verteile nach Priorität</p>
      </div>

      {/* Live split bar */}
      <div className="flex h-3 overflow-hidden rounded-full border border-deck-border bg-deck-surface">
        {data.items.map((item, idx) => (
          <div
            key={item.id}
            className={SEGMENT[idx % SEGMENT.length]}
            style={{ width: `${sh[item.id]}%` }}
            aria-hidden
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {data.items.map((item, idx) => {
          const target = data.rubric.ideal[item.id] ?? 0
          const mine = Math.round(sh[item.id])
          return (
            <div key={item.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-white">
                  <span className={`mr-1.5 inline-block h-2 w-2 rounded-full align-middle ${SEGMENT[idx % SEGMENT.length]}`} />
                  {item.label}
                </span>
                <span className="text-xs tabular-nums text-deck-muted">
                  {mine}%{result ? ` · Ziel ${Math.round(target)}%` : ''}
                </span>
              </div>
              <p className="text-[11px] text-deck-muted">{item.note}</p>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={alloc[item.id] ?? 0}
                disabled={result != null}
                onChange={(e) => set(item.id, Number(e.target.value))}
                className="w-full accent-deck-accent disabled:opacity-70"
                aria-label={`${item.label} Anteil`}
              />
            </div>
          )
        })}
      </div>

      {!result ? (
        <Button onClick={() => setResult(scoreAllocation(data, alloc))}>Allokation auswerten</Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="alloc-fit"
            label="Allokations-Fit"
            value={Math.round(result.score * 100)}
            max={100}
            interpretation="quality"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => setResult(null)}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}
