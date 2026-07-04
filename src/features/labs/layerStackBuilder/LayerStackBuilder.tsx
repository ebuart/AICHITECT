import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { LayerScenarioData } from './types'
import { selectLsbFeedback } from './scoring'

// Layer Stack Builder engine (INT-LAYER-STACK-BUILDER): classify each failure to its
// origin layer — a thin binding of the shared station-config board.
export function LayerStackBuilder({
  scenario,
  onComplete,
}: InteractionEngineProps<LayerScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Feature', detail: data.feature },
        { term: 'Aufgabe', detail: data.task },
      ]}
      stations={data.stations}
      meterLabel="Layer-Treffer"
      evaluateLabel="Zuordnung auswerten"
      selectFeedback={selectLsbFeedback}
      onComplete={onComplete}
    />
  )
}
