import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { CapstoneScenarioData } from './types'
import { selectCapFeedback } from './scoring'

// Capstone Simulator engine (INT-CAPSTONE-SIMULATOR): the integrated architecture
// draft — a thin binding of the shared station-config board to the system profile +
// per-layer feedback. Each station is one system layer; the learner designs them
// together (PC-040/041). Failure injection + defence are later ARC-10 nodes.
export function CapstoneSimulator({
  scenario,
  onComplete,
}: InteractionEngineProps<CapstoneScenarioData>) {
  const data = scenario.scenarioData
  return (
    <StationConfigBoard
      scenario={scenario}
      profile={[
        { term: 'System', detail: data.system },
        { term: 'Ziel', detail: data.goal },
      ]}
      stations={data.stations}
      meterLabel="System-Fit"
      evaluateLabel="Architektur auswerten"
      selectFeedback={selectCapFeedback}
      onComplete={onComplete}
    />
  )
}
