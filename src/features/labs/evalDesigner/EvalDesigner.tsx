import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { EvalScenarioData } from './types'
import { selectEdFeedback } from './scoring'

// Eval Designer engine (INT-EVAL-DESIGNER): a thin binding of the shared station-
// config board to the system-under-eval profile + eval-design feedback.
export function EvalDesigner({
  scenario,
  onComplete,
}: InteractionEngineProps<EvalScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'System', detail: data.system },
        { term: 'Ziel', detail: data.goal },
      ]}
      stations={data.stations}
      meterLabel="Eval-Fit"
      evaluateLabel="Eval auswerten"
      selectFeedback={selectEdFeedback}
      onComplete={onComplete}
    />
  )
}
