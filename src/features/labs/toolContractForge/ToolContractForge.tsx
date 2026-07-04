import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ResultActions } from '@/features/labs/ResultActions'
import { BoundaryBox, DecisionCard, ScoreMeter } from '@/components/visuals'
import { cn } from '@/lib/utils/cn'
import { FeedbackCard } from '@/features/lessons/FeedbackCard'
import type {
  InteractionEngineProps,
  LabResult,
} from '@/features/labs/interactionModel'
import type { ToolContractChoice, ToolScenarioData } from './types'
import { TCF_DIMENSIONS, scoreToolContract } from './scoring'

const empty: ToolContractChoice = {
  allowedActionIds: [],
  permissionId: null,
  requireApproval: false,
  structuredOutput: false,
}

// Tool Contract Forge engine (INT-TOOL-CONTRACT-FORGE). Wizard-style choices,
// not a giant form (mobile rule): allow only needed actions, pick least-privilege
// permission, gate destructive actions, enforce a typed output.
export function ToolContractForge({
  scenario,
  onComplete,
}: InteractionEngineProps<ToolScenarioData>) {
  const data = scenario.scenarioData
  const [choice, setChoice] = useState<ToolContractChoice>(empty)
  const [result, setResult] = useState<ReturnType<typeof scoreToolContract> | null>(null)
  const locked = result != null

  const set = (patch: Partial<ToolContractChoice>) =>
    !locked && setChoice((prev) => ({ ...prev, ...patch }))

  const toggleAction = (id: string) =>
    set({
      allowedActionIds: choice.allowedActionIds.includes(id)
        ? choice.allowedActionIds.filter((a) => a !== id)
        : [...choice.allowedActionIds, id],
    })

  const evaluate = () => setResult(scoreToolContract(data, choice))

  const finish = () => {
    const scored = result ?? scoreToolContract(data, choice)
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

  const permLabel =
    data.permissionOptions.find((p) => p.id === choice.permissionId)?.label ?? '—'

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl border border-deck-current/30 bg-deck-current/10 p-3 text-sm text-white">
        {data.task}
        <span className="mt-1 block text-[11px] text-deck-muted">
          Sensitivität: {data.dataSensitivity} · Side-Effect-Risk: {data.sideEffectRisk}
        </span>
      </p>

      <BoundaryBox
        id="tool"
        kind="permission"
        label="Tool-Contract"
        rules={[
          `Permission: ${permLabel}`,
          `Erlaubte Aktionen: ${choice.allowedActionIds.length}`,
          choice.requireApproval ? 'Approval für riskante Aktionen: an' : 'Approval: aus',
          choice.structuredOutput ? 'Output: typed/structured' : 'Output: Freitext',
        ]}
      />

      <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
        Erlaubte Aktionen
      </h3>
      <div className="flex flex-col gap-1.5">
        {data.actions.map((a) => {
          const on = choice.allowedActionIds.includes(a.id)
          return (
            <button
              key={a.id}
              type="button"
              disabled={locked}
              onClick={() => toggleAction(a.id)}
              className={cn(
                'flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm transition-colors disabled:opacity-60',
                on ? 'border-deck-accent text-white' : 'border-deck-border text-deck-muted',
              )}
            >
              <span>
                {a.label}
                {a.destructive && (
                  <span className="ml-1 text-[10px] text-deck-danger">destruktiv</span>
                )}
              </span>
              <span className="text-[11px]">{on ? 'erlaubt' : 'gesperrt'}</span>
            </button>
          )
        })}
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-deck-muted">
        Permission-Scope
      </h3>
      <div className="flex flex-col gap-2">
        {data.permissionOptions.map((p) => (
          <DecisionCard
            key={p.id}
            id={p.id}
            title={p.label}
            state={
              result
                ? p.id === data.correctPermissionId
                  ? 'strong_choice'
                  : choice.permissionId === p.id
                    ? 'weak_choice'
                    : 'default'
                : choice.permissionId === p.id
                  ? 'selected'
                  : 'default'
            }
            onSelect={() => set({ permissionId: p.id })}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <ToggleChip
          label="Approval für riskante Aktionen"
          on={choice.requireApproval}
          disabled={locked}
          onClick={() => set({ requireApproval: !choice.requireApproval })}
        />
        <ToggleChip
          label="Typed Output"
          on={choice.structuredOutput}
          disabled={locked}
          onClick={() => set({ structuredOutput: !choice.structuredOutput })}
        />
      </div>

      {!result ? (
        <Button onClick={evaluate} disabled={choice.permissionId == null}>
          {choice.permissionId == null ? 'Permission wählen' : 'Contract auswerten'}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <ScoreMeter
            id="tcf-score"
            label="Contract-Qualität"
            value={result.masterySignals.length}
            max={TCF_DIMENSIONS.length}
            interpretation="quality"
          />
          {result.feedback.map((fb) => (
            <FeedbackCard key={fb.id} feedback={fb} />
          ))}
          <ResultActions
            strong={result.weakSignals.length === 0}
            onRetry={() => {
              setChoice(empty)
              setResult(null)
            }}
            onFinish={finish}
          />
        </div>
      )}
    </div>
  )
}

function ToggleChip({
  label,
  on,
  disabled,
  onClick,
}: {
  label: string
  on: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-h-11 flex-1 rounded-xl border px-2 text-xs font-medium transition-colors disabled:opacity-60',
        on ? 'border-deck-accent text-deck-accent' : 'border-deck-border text-deck-muted',
      )}
    >
      {on ? '✓ ' : ''}
      {label}
    </button>
  )
}
