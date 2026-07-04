import { incidentTriageScenarios } from '@/content/labs/incidentTriageScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { IncidentTriageBoard } from './IncidentTriageBoard'
import type { TriageScenarioData } from './types'

export const incidentTriageEntry: LabEngineEntry = {
  interactionType: 'incident-triage',
  scenarios: incidentTriageScenarios,
  render: (scenario, onComplete) => (
    <IncidentTriageBoard
      scenario={scenario as LabScenario<TriageScenarioData>}
      onComplete={onComplete}
    />
  ),
}
