import { capstoneScenarios } from '@/content/labs/capstoneScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { CapstoneSimulator } from './CapstoneSimulator'
import type { CapstoneScenarioData } from './types'

export const capstoneEntry: LabEngineEntry = {
  interactionType: 'capstone-simulator',
  scenarios: capstoneScenarios,
  render: (scenario, onComplete) => (
    <CapstoneSimulator
      scenario={scenario as LabScenario<CapstoneScenarioData>}
      onComplete={onComplete}
    />
  ),
}
