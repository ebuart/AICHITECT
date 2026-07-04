import { trustBoundaryScenarios } from '@/content/labs/trustBoundaryScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { TrustBoundaryBoard } from './TrustBoundaryBoard'
import type { BoundaryScenarioData } from './types'

export const trustBoundaryEntry: LabEngineEntry = {
  interactionType: 'trust-boundary',
  scenarios: trustBoundaryScenarios,
  render: (scenario, onComplete) => (
    <TrustBoundaryBoard
      scenario={scenario as LabScenario<BoundaryScenarioData>}
      onComplete={onComplete}
    />
  ),
}
