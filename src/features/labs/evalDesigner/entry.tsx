import { evalDesignerScenarios } from '@/content/labs/evalDesignerScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { EvalDesigner } from './EvalDesigner'
import type { EvalScenarioData } from './types'

export const evalDesignerEntry: LabEngineEntry = {
  interactionType: 'eval-designer',
  scenarios: evalDesignerScenarios,
  render: (scenario, onComplete) => (
    <EvalDesigner
      scenario={scenario as LabScenario<EvalScenarioData>}
      onComplete={onComplete}
    />
  ),
}
