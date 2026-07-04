import { retrievalFactoryScenarios } from '@/content/labs/retrievalFactoryScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { RetrievalFactory } from './RetrievalFactory'
import type { RetrievalScenarioData } from './types'

export const retrievalFactoryEntry: LabEngineEntry = {
  interactionType: 'retrieval-factory',
  scenarios: retrievalFactoryScenarios,
  render: (scenario, onComplete) => (
    <RetrievalFactory
      scenario={scenario as LabScenario<RetrievalScenarioData>}
      onComplete={onComplete}
    />
  ),
}
