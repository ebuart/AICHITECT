import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Eval Designer scenario model (lab specs LAB-EVAL-DESIGNER). Built on the shared
// station-config shape. The learner designs an eval harness for a given system:
// measure real task success, guard regressions, and apply grounding only when the
// system makes source-based claims (PH-705: fit the measurement to the failure).

export const ED_DIMENSIONS = ['success_metric_fit', 'regression_fit', 'grounding_fit'] as const
export type EvalDimension = (typeof ED_DIMENSIONS)[number]

export interface EvalScenarioData {
  system: string
  goal: string
  stations: ConfigStation[]
}

export type EvalConfig = StationConfig
