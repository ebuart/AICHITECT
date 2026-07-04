import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { IncidentScenarioData } from './types'
import { selectSirFeedback } from './scoring'

// Security Incident Room engine (INT-SECURITY-INCIDENT-ROOM): a thin binding of the
// shared station-config board to the incident profile + incident-response feedback.
export function SecurityIncidentRoom({
  scenario,
  onComplete,
}: InteractionEngineProps<IncidentScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Incident', detail: data.incident },
        { term: 'Trace', detail: data.trace },
      ]}
      stations={data.stations}
      meterLabel="Response-Fit"
      evaluateLabel="Response auswerten"
      selectFeedback={selectSirFeedback}
      onComplete={onComplete}
    />
  )
}
