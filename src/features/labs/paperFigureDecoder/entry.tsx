import { paperFigureScenarios } from '@/content/labs/paperFigureScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { PaperFigureDecoder } from './PaperFigureDecoder'
import type { FigureScenarioData } from './types'

export const paperFigureEntry: LabEngineEntry = {
  interactionType: 'paper-figure-decoder',
  scenarios: paperFigureScenarios,
  render: (scenario, onComplete) => (
    <PaperFigureDecoder
      scenario={scenario as LabScenario<FigureScenarioData>}
      onComplete={onComplete}
    />
  ),
}
