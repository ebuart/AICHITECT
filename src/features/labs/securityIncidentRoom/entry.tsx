import { securityIncidentScenarios } from '@/content/labs/securityIncidentScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { SecurityIncidentRoom } from './SecurityIncidentRoom'
import type { IncidentScenarioData } from './types'

export const securityIncidentEntry: LabEngineEntry = {
  interactionType: 'security-incident-room',
  scenarios: securityIncidentScenarios,
  render: (scenario, onComplete) => (
    <SecurityIncidentRoom
      scenario={scenario as LabScenario<IncidentScenarioData>}
      onComplete={onComplete}
    />
  ),
}
