import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { RetrievalScenarioData } from './types'
import { selectRfFeedback } from './scoring'

// Retrieval Factory engine (INT-RETRIEVAL-FACTORY): a thin binding of the shared
// station-config board to the retrieval corpus/query profile + feedback.
export function RetrievalFactory({
  scenario,
  onComplete,
}: InteractionEngineProps<RetrievalScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Korpus', detail: data.corpusProfile },
        { term: 'Queries', detail: data.queryProfile },
      ]}
      stations={data.stations}
      meterLabel="Pipeline-Fit"
      evaluateLabel="Pipeline auswerten"
      selectFeedback={selectRfFeedback}
      onComplete={onComplete}
    />
  )
}
