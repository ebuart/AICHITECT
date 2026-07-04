import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Repo Refactor scenario model (lab specs LAB-REPO-REFACTOR). Built on the shared
// station-config shape (DEC-0010): for each repo/maintainability problem, choose
// the refactor that fixes the root cause — not a symptom patch or over-engineering.

export const RR_DIMENSIONS = ['durable_state_fit', 'small_components_fit', 'legibility_fit'] as const
export type RrDimension = (typeof RR_DIMENSIONS)[number]

export interface RefactorScenarioData {
  repo: string
  goal: string
  stations: ConfigStation[]
}

export type RefactorConfig = StationConfig
