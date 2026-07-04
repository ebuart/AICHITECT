import { useState } from 'react'
import { shuffle } from '@/lib/utils/shuffle'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { DecisionCard, ScoreMeter, TraceTimeline } from '@/components/visuals'
import type { TraceEvent } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type {
  InteractionEngineProps,
  LabResult,
} from '@/features/labs/interactionModel'
import type { TraceScenarioData } from './types'
import { TRACE_DIMENSIONS, scoreTrace } from './scoring'

// Agent Trace Debugger engine (INT-AGENT-TRACE-DEBUGGER). Tap to mark the
// failure origin (one event expanded at a time on mobile), then choose a repair.
// Correctness is revealed only after evaluation.
export function AgentTraceDebugger({
  scenario,
  onComplete,
}: InteractionEngineProps<TraceScenarioData>) {
  const data = scenario.scenarioData
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [repairId, setRepairId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof scoreTrace> | null>(null)
  // Randomize repair-option order so the correct fix isn't always first (no position tell).
  const [repairs] = useState(() => shuffle(data.repairRules))

  const evaluate = () => setResult(scoreTrace(data, selectedEventId, repairId))

  const finish = () => {
    const scored = result ?? scoreTrace(data, selectedEventId, repairId)
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

  const events: TraceEvent[] = data.events.map((e) => ({
    id: e.id,
    step: e.step,
    actor: e.actor,
    title: e.action,
    detail: e.observation,
    tags: e.riskTags,
    state: result
      ? e.isFailureOrigin
        ? 'failure_origin'
        : e.isSymptom
          ? 'symptom'
          : 'default'
      : e.id === selectedEventId
        ? 'selected'
        : 'default',
  }))

  const canEvaluate = selectedEventId != null && repairId != null

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl border border-deck-current/30 bg-deck-current/10 p-3 text-sm text-white">
        {data.task}
      </p>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
        Trace — markiere die Fehlerursache
      </h3>
      <TraceTimeline
        events={events}
        selectedEventId={selectedEventId ?? undefined}
        onSelect={result ? undefined : setSelectedEventId}
      />

      <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
        Reparatur wählen
      </h3>
      <div className="flex flex-col gap-2">
        {repairs.map((rule) => (
          <DecisionCard
            key={rule.id}
            id={rule.id}
            title={rule.label}
            description={result ? rule.rationale : undefined}
            state={
              result
                ? rule.correct
                  ? 'strong_choice'
                  : repairId === rule.id
                    ? 'weak_choice'
                    : 'default'
                : repairId === rule.id
                  ? 'selected'
                  : 'default'
            }
            onSelect={() => !result && setRepairId(rule.id)}
          />
        ))}
      </div>

      {!result ? (
        <Button onClick={evaluate} disabled={!canEvaluate}>
          {canEvaluate ? 'Diagnose auswerten' : 'Ereignis + Reparatur wählen'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="trace-score"
            label="Trace-Diagnose"
            value={result.masterySignals.length}
            max={TRACE_DIMENSIONS.length}
            interpretation="quality"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => {
              setSelectedEventId(null)
              setRepairId(null)
              setResult(null)
            }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}
