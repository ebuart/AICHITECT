import { constraintScenarios } from '@/content/labs/constraintScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { ConstraintPuzzle } from './ConstraintPuzzle'
import type { ConstraintScenarioData } from './types'

export const constraintEntry: LabEngineEntry = {
  interactionType: 'constraint-puzzle',
  scenarios: constraintScenarios,
  render: (scenario, onComplete) => (
    <ConstraintPuzzle
      scenario={scenario as LabScenario<ConstraintScenarioData>}
      onComplete={onComplete}
    />
  ),
}
