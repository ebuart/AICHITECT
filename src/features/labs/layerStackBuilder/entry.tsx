import { layerStackScenarios } from '@/content/labs/layerStackScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { LayerStackBuilder } from './LayerStackBuilder'
import type { LayerScenarioData } from './types'

export const layerStackEntry: LabEngineEntry = {
  interactionType: 'layer-stack-builder',
  scenarios: layerStackScenarios,
  render: (scenario, onComplete) => (
    <LayerStackBuilder
      scenario={scenario as LabScenario<LayerScenarioData>}
      onComplete={onComplete}
    />
  ),
}
