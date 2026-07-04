import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { ScoreMeter } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type { InteractionEngineProps, LabResult } from '@/features/labs/interactionModel'
import type { PipelineScenarioData } from './types'
import { scorePipeline } from './scoring'

// Pipeline Builder engine (MECH-CONNECT). Tap palette stages to add, reorder with
// up/down, remove with ✕ (no drag, LR-015). Graded against the ideal pipeline.
export function PipelineBuilderBoard({
  scenario,
  onComplete,
}: InteractionEngineProps<PipelineScenarioData>) {
  const data = scenario.scenarioData
  const [build, setBuild] = useState<string[]>([])
  const [result, setResult] = useState<ReturnType<typeof scorePipeline> | null>(null)

  const stage = (id: string) => data.available.find((s) => s.id === id)!
  const palette = data.available.filter((s) => !build.includes(s.id))

  const add = (id: string) => !result && setBuild((b) => [...b, id])
  const remove = (id: string) => !result && setBuild((b) => b.filter((x) => x !== id))
  const move = (i: number, dir: -1 | 1) => {
    if (result) return
    const j = i + dir
    if (j < 0 || j >= build.length) return
    setBuild((b) => {
      const next = [...b]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  const finish = () => {
    const scored = result ?? scorePipeline(data, build)
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
        {data.goal}
      </p>

      {!result && (
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">Verfügbare Stufen</h3>
          <div className="flex flex-wrap gap-1.5">
            {palette.length === 0 ? (
              <span className="text-[11px] text-deck-muted">Alle Stufen platziert.</span>
            ) : (
              palette.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => add(s.id)}
                  className="min-h-9 rounded-lg border border-deck-border px-2 text-xs text-deck-muted hover:text-white"
                >
                  + {s.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">Deine Pipeline</h3>
        {build.length === 0 ? (
          <p className="text-[11px] text-deck-muted">Tippe Stufen an, um die Pipeline zu bauen.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {build.map((id, i) => {
              const s = stage(id)
              const correct = result && data.requiredOrder[i] === id
              const wrong = result && !correct
              return (
                <li
                  key={id}
                  className={`flex items-start gap-2 rounded-xl border bg-deck-surface p-3 ${
                    result ? (correct ? 'border-deck-success/50' : 'border-deck-danger/50') : 'border-deck-border'
                  }`}
                >
                  <span className="mt-0.5 text-xs font-semibold tabular-nums text-deck-muted">{i + 1}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-white">{s.label}</span>
                    <p className="text-[11px] text-deck-muted">{s.note}</p>
                    {wrong && (
                      <p className="mt-1 text-[11px] text-deck-warning">
                        Soll hier: {data.requiredOrder[i] ? stage(data.requiredOrder[i]).label : '—'}
                      </p>
                    )}
                  </div>
                  {!result && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" aria-label="hoch" disabled={i === 0} onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-deck-border text-deck-muted disabled:opacity-30">▲</button>
                      <button type="button" aria-label="runter" disabled={i === build.length - 1} onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-deck-border text-deck-muted disabled:opacity-30">▼</button>
                      <button type="button" aria-label="entfernen" onClick={() => remove(id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-deck-border text-deck-muted">✕</button>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {!result ? (
        <Button onClick={() => setResult(scorePipeline(data, build))} disabled={build.length === 0}>
          {build.length === 0 ? 'Baue die Pipeline' : 'Pipeline auswerten'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter id="pipe-fit" label="Pipeline-Fit" value={Math.round(result.score * 100)} max={100} interpretation="quality" />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => { setBuild([]); setResult(null) }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}
