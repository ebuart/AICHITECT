import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { DuelScenarioData } from './types'
import { selectTodFeedback } from './scoring'

// Trade-off Duel engine (INT-TRADE-OFF-DUEL): pick the fitting architecture per
// constraint — a thin binding of the shared station-config board.
export function TradeOffDuel({
  scenario,
  onComplete,
}: InteractionEngineProps<DuelScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Szenario', detail: data.scenario },
        { term: 'Constraint', detail: data.constraint },
      ]}
      stations={data.stations}
      meterLabel="Trade-off-Fit"
      evaluateLabel="Entscheidung auswerten"
      selectFeedback={selectTodFeedback}
      onComplete={onComplete}
    />
  )
}
