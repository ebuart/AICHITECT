import { pipelineScenarios } from '@/content/labs/pipelineScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { PipelineBuilderBoard } from './PipelineBuilderBoard'
import type { PipelineScenarioData } from './types'

export const pipelineBuilderEntry: LabEngineEntry = {
  interactionType: 'pipeline-builder',
  scenarios: pipelineScenarios,
  render: (scenario, onComplete) => (
    <PipelineBuilderBoard
      scenario={scenario as LabScenario<PipelineScenarioData>}
      onComplete={onComplete}
    />
  ),
}
