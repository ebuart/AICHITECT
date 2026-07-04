import { useState, type ReactNode } from 'react'
import type { Feedback } from '@/types'
import { Button } from '@/components/ui/Button'
import { DecisionCard, ScoreMeter } from '@/components/visuals'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import { ResultActions } from '@/features/labs/ResultActions'
import { shuffle } from '@/lib/utils/shuffle'
import type { LabResult, LabScenario } from '@/features/labs/interactionModel'
import type { ConfigStation, ProfileRow, StationConfig } from './types'
import { scoreStations } from './scoreStations'

interface StationConfigBoardProps {
  scenario: LabScenario
  /** Optional visual rendered above the profile (e.g. a recreated paper figure). */
  intro?: ReactNode
  profile: ProfileRow[]
  stations: ConfigStation[]
  meterLabel: string
  /** Label for the evaluate action (engine-specific wording). */
  evaluateLabel?: string
  /** Engine-specific: maps weak dimensions to consequence feedback. */
  selectFeedback: (weakSignals: string[]) => Feedback[]
  onComplete: (result: LabResult) => void
}

// Shared station-configuration engine UI (reused by Retrieval Factory + Eval
// Designer). Single-select per station (no drag — mobile rule); reveals fit only
// after evaluation; calm ScoreMeter + consequence feedback (FB-002).
export function StationConfigBoard({
  scenario,
  intro,
  profile,
  stations,
  meterLabel,
  evaluateLabel = 'Auswerten',
  selectFeedback,
  onComplete,
}: StationConfigBoardProps) {
  const [config, setConfig] = useState<StationConfig>({})
  const [result, setResult] = useState<{
    score: ReturnType<typeof scoreStations>
    feedback: Feedback[]
  } | null>(null)
  // Randomize option order once per mount so the correct answer is never in a fixed
  // position (no "first is always right" tell). Scoring keys off option ids, not order.
  const [shownStations] = useState(() =>
    stations.map((s) => ({ ...s, options: shuffle(s.options) })),
  )

  const allChosen = stations.every((s) => config[s.id])

  const evaluate = () => {
    const score = scoreStations(stations, config)
    setResult({ score, feedback: selectFeedback(score.weakSignals) })
  }

  const finish = () => {
    const score = result?.score ?? scoreStations(stations, config)
    const feedback = result?.feedback ?? selectFeedback(score.weakSignals)
    const labResult: LabResult = {
      scenarioId: scenario.id,
      completed: true,
      score: score.score,
      masterySignals: score.masterySignals,
      weakSignals: score.weakSignals,
      feedback,
      reviewHookIds: scenario.reviewHooks,
      completedAt: new Date().toISOString(),
    }
    onComplete(labResult)
  }

  return (
    <div className="flex flex-col gap-3">
      {intro}
      <dl className="grid grid-cols-1 gap-2">
        {profile.map((row) => (
          <div key={row.term} className="rounded-xl border border-deck-border bg-deck-surface-2 p-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-deck-muted">
              {row.term}
            </dt>
            <dd className="mt-0.5 text-xs text-white">{row.detail}</dd>
          </div>
        ))}
      </dl>

      {shownStations.map((station) => (
        <section key={station.id} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
            {station.label}
          </h3>
          <p className="text-sm text-white">{station.question}</p>
          <div className="flex flex-col gap-2">
            {station.options.map((opt) => (
              <DecisionCard
                key={opt.id}
                id={opt.id}
                title={opt.label}
                description={result ? opt.rationale : undefined}
                state={
                  result
                    ? opt.id === station.bestOptionId
                      ? 'strong_choice'
                      : config[station.id] === opt.id
                        ? 'weak_choice'
                        : 'default'
                    : config[station.id] === opt.id
                      ? 'selected'
                      : 'default'
                }
                onSelect={() =>
                  !result && setConfig((prev) => ({ ...prev, [station.id]: opt.id }))
                }
              />
            ))}
          </div>
        </section>
      ))}

      {!result ? (
        <Button onClick={evaluate} disabled={!allChosen}>
          {allChosen ? evaluateLabel : 'Für jede Station eine Option wählen'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="station-score"
            label={meterLabel}
            value={result.score.masterySignals.length}
            max={stations.length}
            interpretation="coverage"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.score.weakSignals.length === 0}
            onRetry={() => {
              setConfig({})
              setResult(null)
            }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}
