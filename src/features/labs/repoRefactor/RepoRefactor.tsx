import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { RefactorScenarioData } from './types'
import { selectRrFeedback } from './scoring'

// Repo Refactor engine (INT-REPO-REFACTOR-LAB): a thin binding of the shared
// station-config board to the repo profile + refactor feedback.
export function RepoRefactor({
  scenario,
  onComplete,
}: InteractionEngineProps<RefactorScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'Repo', detail: data.repo },
        { term: 'Ziel', detail: data.goal },
      ]}
      stations={data.stations}
      meterLabel="Refactor-Fit"
      evaluateLabel="Refactor auswerten"
      selectFeedback={selectRrFeedback}
      onComplete={onComplete}
    />
  )
}
