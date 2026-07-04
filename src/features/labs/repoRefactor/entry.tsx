import { repoRefactorScenarios } from '@/content/labs/repoRefactorScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { RepoRefactor } from './RepoRefactor'
import type { RefactorScenarioData } from './types'

export const repoRefactorEntry: LabEngineEntry = {
  interactionType: 'repo-refactor-lab',
  scenarios: repoRefactorScenarios,
  render: (scenario, onComplete) => (
    <RepoRefactor
      scenario={scenario as LabScenario<RefactorScenarioData>}
      onComplete={onComplete}
    />
  ),
}
