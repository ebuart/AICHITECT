import { architectureScenarios } from '@/content/labs/architectureScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { ArchitectureBuilder } from './ArchitectureBuilder'
import type { ArchScenarioData } from './types'

export const architectureEntry: LabEngineEntry = {
  interactionType: 'architecture-builder',
  scenarios: architectureScenarios,
  render: (scenario, onComplete) => (
    <ArchitectureBuilder
      scenario={scenario as LabScenario<ArchScenarioData>}
      onComplete={onComplete}
    />
  ),
}
