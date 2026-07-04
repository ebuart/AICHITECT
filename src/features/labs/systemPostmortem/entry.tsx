import { systemPostmortemScenarios } from '@/content/labs/systemPostmortemScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { SystemPostmortem } from './SystemPostmortem'
import type { PostmortemScenarioData } from './types'

export const systemPostmortemEntry: LabEngineEntry = {
  interactionType: 'system-postmortem',
  scenarios: systemPostmortemScenarios,
  render: (scenario, onComplete) => (
    <SystemPostmortem
      scenario={scenario as LabScenario<PostmortemScenarioData>}
      onComplete={onComplete}
    />
  ),
}
