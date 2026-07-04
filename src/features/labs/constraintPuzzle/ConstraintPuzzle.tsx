import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { ConstraintScenarioData } from './types'
import { selectCpFeedback } from './scoring'

// Constraint Puzzle engine (INT-CONSTRAINT-PUZZLE): make the output reliably parseable
// and choose the right strictness — a thin binding of the shared station-config board.
export function ConstraintPuzzle({
  scenario,
  onComplete,
}: InteractionEngineProps<ConstraintScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Anforderung', detail: data.requirement },
        { term: 'Schema', detail: data.schema },
      ]}
      stations={data.stations}
      meterLabel="Constraint-Fit"
      evaluateLabel="Lösung auswerten"
      selectFeedback={selectCpFeedback}
      onComplete={onComplete}
    />
  )
}
