import { useState } from 'react'
import { shuffle } from '@/lib/utils/shuffle'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { DecisionCard, FailureModeCard, ScoreMeter } from '@/components/visuals'
import { layerMeta } from '@/lib/visuals/visualMeta'
import { cn } from '@/lib/utils/cn'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type {
  InteractionEngineProps,
  LabResult,
} from '@/features/labs/interactionModel'
import type {
  CauseCard,
  CauseClassification,
  CauseRole,
  FailureScenarioData,
} from './types'
import { FMT_DIMENSIONS, scoreFailureMode } from './scoring'

const roleButtons: { role: CauseRole; label: string }[] = [
  { role: 'root_cause', label: 'Ursache' },
  { role: 'symptom', label: 'Symptom' },
  { role: 'distractor', label: 'Ablenkung' },
]

// Failure Mode Tree engine (INT-FAILURE-MODE-TREE). Card sorting via buttons,
// not drag (mobile rule). Reveals correctness only after evaluation.
export function FailureModeTree({
  scenario,
  onComplete,
}: InteractionEngineProps<FailureScenarioData>) {
  const data = scenario.scenarioData
  const [classification, setClassification] = useState<CauseClassification>({})
  const [repairId, setRepairId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof scoreFailureMode> | null>(null)
  // Randomize cause-card and repair order so neither the root cause nor the correct fix
  // sits in a fixed position (no "first is always right" tell). Scoring keys off ids.
  const [cards] = useState(() => shuffle(data.causeCards))
  const [repairs] = useState(() => shuffle(data.repairRules))

  const allClassified = data.causeCards.every((c) => classification[c.id])
  const canEvaluate = allClassified && repairId != null

  const evaluate = () => setResult(scoreFailureMode(data, classification, repairId))

  const finish = () => {
    const scored = result ?? scoreFailureMode(data, classification, repairId)
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
      <FailureModeCard id="symptom" kind="symptom" label={data.symptom} />
      <p className="rounded-xl border border-deck-border bg-deck-surface-2 p-3 text-xs text-deck-muted">
        {data.context}
      </p>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
        Ursachen einordnen
      </h3>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <CauseRow
            key={card.id}
            card={card}
            chosen={classification[card.id]}
            revealed={result != null}
            onClassify={(role) =>
              setClassification((prev) => ({ ...prev, [card.id]: role }))
            }
          />
        ))}
      </div>

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
          {canEvaluate ? 'Diagnose auswerten' : 'Alle Karten + Reparatur wählen'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="fmt-score"
            label="Diagnose-Qualität"
            value={result.masterySignals.length}
            max={FMT_DIMENSIONS.length}
            interpretation="quality"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => {
              setClassification({})
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

function CauseRow({
  card,
  chosen,
  revealed,
  onClassify,
}: {
  card: CauseCard
  chosen?: CauseRole
  revealed: boolean
  onClassify: (role: CauseRole) => void
}) {
  const correct = revealed && chosen === card.role
  return (
    <div
      className={cn(
        'rounded-xl border bg-deck-surface p-3',
        revealed
          ? correct
            ? 'border-deck-success/50'
            : 'border-deck-danger/50'
          : 'border-deck-border',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-white">{card.label}</span>
        <span className="shrink-0 rounded border border-deck-border px-1 py-0.5 text-[10px] text-deck-muted">
          {layerMeta[card.layer].short}
        </span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {roleButtons.map((rb) => (
          <button
            key={rb.role}
            type="button"
            disabled={revealed}
            onClick={() => onClassify(rb.role)}
            className={cn(
              'min-h-9 flex-1 rounded-lg border px-1 text-xs font-medium transition-colors disabled:opacity-60',
              chosen === rb.role
                ? 'border-deck-accent text-deck-accent'
                : 'border-deck-border text-deck-muted',
            )}
          >
            {rb.label}
          </button>
        ))}
      </div>
      {revealed && !correct && (
        <p className="mt-1.5 text-[11px] text-deck-warning">
          Korrekt: {roleButtons.find((r) => r.role === card.role)?.label}
        </p>
      )}
    </div>
  )
}
