import { failureModeScenarios } from '@/content/labs/failureModeScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { FailureModeTree } from './FailureModeTree'
import type { FailureScenarioData } from './types'

export const failureModeEntry: LabEngineEntry = {
  interactionType: 'failure-mode-tree',
  scenarios: failureModeScenarios,
  render: (scenario, onComplete) => (
    <FailureModeTree
      scenario={scenario as LabScenario<FailureScenarioData>}
      onComplete={onComplete}
    />
  ),
}
