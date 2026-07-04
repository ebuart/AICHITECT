import { toolContractScenarios } from '@/content/labs/toolContractScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { ToolContractForge } from './ToolContractForge'
import type { ToolScenarioData } from './types'

export const toolContractEntry: LabEngineEntry = {
  interactionType: 'tool-contract-forge',
  scenarios: toolContractScenarios,
  render: (scenario, onComplete) => (
    <ToolContractForge
      scenario={scenario as LabScenario<ToolScenarioData>}
      onComplete={onComplete}
    />
  ),
}
