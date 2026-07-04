import { contextAllocatorScenarios } from '@/content/labs/contextAllocatorScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { AllocatorBoard } from './AllocatorBoard'
import type { AllocScenarioData } from './types'

export const contextAllocatorEntry: LabEngineEntry = {
  interactionType: 'context-allocator',
  scenarios: contextAllocatorScenarios,
  render: (scenario, onComplete) => (
    <AllocatorBoard
      scenario={scenario as LabScenario<AllocScenarioData>}
      onComplete={onComplete}
    />
  ),
}
