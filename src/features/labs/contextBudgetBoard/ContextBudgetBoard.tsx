import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import {
  CompactFallbackView,
  ScoreMeter,
  TokenBudgetBar,
} from '@/components/visuals'
import type { TokenBudgetSegment } from '@/components/visuals'
import { cn } from '@/lib/utils/cn'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type {
  InteractionEngineProps,
  LabResult,
} from '@/features/labs/interactionModel'
import {
  effectiveTokens,
  usedTokens,
  type ContextBudgetData,
  type ContextDisposition,
  type ContextItem,
  type Dispositions,
} from './types'
import { CBB_DIMENSIONS, scoreContextBudget, type CbbDimension } from './scoring'

const dimLabel: Record<CbbDimension, string> = {
  critical_context_kept: 'Kritischer Context behalten',
  noise_reduced: 'Noise reduziert',
  budget_respected: 'Budget eingehalten',
  stale_context_detected: 'Stale erkannt',
  rationale_preserved: 'Rationale bewahrt',
}

const dispoLabel: Record<ContextDisposition, string> = {
  exclude: 'Aus',
  compress: 'Komprimieren',
  include: 'Ein',
}

// Context Budget Board engine (INT-CONTEXT-BUDGET-BOARD). Tap-to-set disposition,
// no drag (mobile rule). Live meters before evaluation; structured feedback after.
export function ContextBudgetBoard({
  scenario,
  onComplete,
}: InteractionEngineProps<ContextBudgetData>) {
  const data = scenario.scenarioData
  const [dispositions, setDispositions] = useState<Dispositions>({})
  const [result, setResult] = useState<ReturnType<typeof scoreContextBudget> | null>(null)

  const disp = (id: string): ContextDisposition => dispositions[id] ?? 'exclude'
  const used = usedTokens(data, dispositions)

  const { segments, noiseRisk, missingRisk } = useMemo(() => {
    const included = data.items.filter((i) => disp(i.id) !== 'exclude')
    const segs: TokenBudgetSegment[] = included.map((i) => ({
      id: i.id,
      label: i.label,
      tokens: effectiveTokens(i, disp(i.id)),
      state: i.noiseRisk >= 2 ? 'warning' : 'default',
    }))
    const requiredTotal = data.items.filter((i) => i.required).length
    const requiredExcluded = data.items.filter((i) => i.required && disp(i.id) === 'exclude').length
    return {
      segments: segs,
      noiseRisk: included.length ? included.filter((i) => i.noiseRisk >= 2).length / included.length : 0,
      missingRisk: requiredTotal ? requiredExcluded / requiredTotal : 0,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispositions, data])

  const setDispo = (id: string, value: ContextDisposition) =>
    setDispositions((prev) => ({ ...prev, [id]: value }))

  const evaluate = () => setResult(scoreContextBudget(data, dispositions))

  const finish = () => {
    const scored = result ?? scoreContextBudget(data, dispositions)
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

      <TokenBudgetBar
        usedTokens={used}
        maxTokens={data.maxTokens}
        segments={segments}
        // Noise / missing-context gauges are the SCORING dimensions — a live readout would
        // tell the learner "you're at 67% noise" and hint the answer (LR-011b). Reveal them
        // only after evaluation; pre-answer the learner judges from the items + budget bar.
        noiseRisk={result ? noiseRisk : undefined}
        missingContextRisk={result ? missingRisk : undefined}
      />

      <div className="flex flex-col gap-2">
        {data.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            disposition={disp(item.id)}
            onSet={(v) => setDispo(item.id, v)}
            revealed={!!result}
          />
        ))}
      </div>

      {!result ? (
        <Button onClick={evaluate}>Context auswerten</Button>
      ) : (
        <ResultPanel
          score={result}
          included={data.items.filter((i) => disp(i.id) !== 'exclude')}
          onRetry={() => {
            setDispositions({})
            setResult(null)
          }}
          onFinish={finish}
        />
      )}
    </div>
  )
}

function ItemRow({
  item,
  disposition,
  onSet,
  revealed,
}: {
  item: ContextItem
  disposition: ContextDisposition
  onSet: (v: ContextDisposition) => void
  revealed: boolean
}) {
  const options: ContextDisposition[] = item.compressible
    ? ['exclude', 'compress', 'include']
    : ['exclude', 'include']
  return (
    <div className="rounded-xl border border-deck-border bg-deck-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-white">{item.label}</span>
          <span className="text-[10px] uppercase tracking-wider text-deck-muted">
            {item.sourceType} · {item.tokens} tok
            {revealed && item.required ? ' · required' : ''}
          </span>
        </div>
        {/* Verdict badges (NOISE/STALE/KEY) are the answer — only reveal them AFTER
            evaluation (LR-011). Before that, the learner judges from label + source + cost. */}
        {revealed && <Signals item={item} />}
      </div>
      <div className="mt-2 flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSet(opt)}
            className={cn(
              'min-h-9 flex-1 rounded-lg border px-2 text-xs font-medium transition-colors',
              disposition === opt
                ? 'border-deck-accent text-deck-accent'
                : 'border-deck-border text-deck-muted',
            )}
          >
            {dispoLabel[opt]}
          </button>
        ))}
      </div>
    </div>
  )
}

function Signals({ item }: { item: ContextItem }) {
  const tag = (label: string, value: number, tone: string) =>
    value >= 2 ? (
      <span className={cn('rounded px-1 py-0.5 text-[9px]', tone)}>{label}</span>
    ) : null
  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      {tag('NOISE', item.noiseRisk, 'bg-deck-danger/15 text-deck-danger')}
      {tag('STALE', item.staleRisk, 'bg-deck-warning/15 text-deck-warning')}
      {item.relevance >= 3 && (
        <span className="rounded bg-deck-success/15 px-1 py-0.5 text-[9px] text-deck-success">
          KEY
        </span>
      )}
    </div>
  )
}

function ResultPanel({
  score,
  included,
  onRetry,
  onFinish,
}: {
  score: ReturnType<typeof scoreContextBudget>
  included: ContextItem[]
  onRetry: () => void
  onFinish: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <ScoreMeter
        id="cbb-score"
        label="Context-Pack Qualität"
        value={score.masterySignals.length}
        max={CBB_DIMENSIONS.length}
        interpretation="quality"
      />
      {score.weakSignals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {score.weakSignals.map((d) => (
            <span
              key={d}
              className="rounded-full border border-deck-warning/40 px-2 py-0.5 text-[10px] text-deck-warning"
            >
              ⚠ {dimLabel[d]}
            </span>
          ))}
        </div>
      )}
      {score.feedback.map((fb) => (
        <FeedbackCard key={fb.id} feedback={fb} />
      ))}
      <CompactFallbackView
        title="Dein Context-Pack"
        summary={`${included.length} Items · ${score.usedTokens} Token genutzt`}
        items={included.map((i) => ({ id: i.id, label: i.label }))}
      />
      <ResultActions
        strong={score.weakSignals.length === 0}
        onRetry={onRetry}
        onFinish={onFinish}
      />
    </div>
  )
}
