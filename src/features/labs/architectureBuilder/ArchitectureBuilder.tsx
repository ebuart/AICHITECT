import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { CompactFallbackView, ScoreMeter, SystemNode } from '@/components/visuals'
import { cn } from '@/lib/utils/cn'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type {
  InteractionEngineProps,
  LabResult,
} from '@/features/labs/interactionModel'
import type { ArchScenarioData, ArchSelection } from './types'
import { ARCH_DIMENSIONS, scoreArchitecture } from './scoring'

// Architecture Builder engine (INT-ARCHITECTURE-BUILDER). Staged selection
// (choose components to cover required capabilities), no free-form canvas
// (mobile rule). Simplest sufficient structure wins.
export function ArchitectureBuilder({
  scenario,
  onComplete,
}: InteractionEngineProps<ArchScenarioData>) {
  const data = scenario.scenarioData
  const [selection, setSelection] = useState<ArchSelection>([])
  const [result, setResult] = useState<ReturnType<typeof scoreArchitecture> | null>(null)
  const locked = result != null

  const covered = new Set(
    data.components.filter((c) => selection.includes(c.id)).flatMap((c) => c.capabilities),
  )

  const toggle = (id: string) =>
    !locked &&
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  const evaluate = () => setResult(scoreArchitecture(data, selection))

  const finish = () => {
    const scored = result ?? scoreArchitecture(data, selection)
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
      <p className="rounded-xl border border-deck-current/30 bg-deck-current/10 p-3 text-sm text-white">
        {data.task}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {data.requiredCapabilities.map((cap) => {
          const ok = covered.has(cap)
          return (
            <span
              key={cap}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px]',
                ok
                  ? 'border-deck-success/40 text-deck-success'
                  : 'border-deck-border text-deck-muted',
              )}
            >
              {ok ? '✓' : '○'} {cap}
            </span>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {data.components.map((c) => {
          const on = selection.includes(c.id)
          const forbidden = result != null && on && data.forbiddenTypes.includes(c.type)
          return (
            <SystemNode
              key={c.id}
              id={c.id}
              kind={c.type}
              label={c.label}
              badges={c.capabilities}
              description={c.risk}
              state={forbidden ? 'warning' : on ? 'selected' : 'default'}
              onSelect={() => toggle(c.id)}
            />
          )
        })}
      </div>

      {!result ? (
        <Button onClick={evaluate} disabled={selection.length === 0}>
          {selection.length === 0 ? 'Komponenten wählen' : 'Architektur auswerten'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="arch-score"
            label="Architektur-Qualität"
            value={result.masterySignals.length}
            max={ARCH_DIMENSIONS.length}
            interpretation="quality"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <CompactFallbackView
            title="Dein System"
            summary={`${selection.length} Komponente(n)`}
            items={data.components
              .filter((c) => selection.includes(c.id))
              .map((c) => ({ id: c.id, label: c.label, detail: c.capabilities.join(', ') }))}
          />
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => {
              setSelection([])
              setResult(null)
            }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}
