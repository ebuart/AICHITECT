import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { PostmortemScenarioData } from './types'
import { selectSpmFeedback } from './scoring'

// System Postmortem engine (INT-SYSTEM-POSTMORTEM): trace → root cause → durable rule —
// a thin binding of the shared station-config board.
export function SystemPostmortem({
  scenario,
  onComplete,
}: InteractionEngineProps<PostmortemScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Incident', detail: data.incident },
        { term: 'Trace', detail: data.trace },
      ]}
      stations={data.stations}
      meterLabel="Postmortem-Fit"
      evaluateLabel="Postmortem auswerten"
      selectFeedback={selectSpmFeedback}
      onComplete={onComplete}
    />
  )
}
