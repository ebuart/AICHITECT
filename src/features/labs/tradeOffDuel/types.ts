import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Trade-off Duel scenario model (INT-TRADE-OFF-DUEL). Built on the shared station-config
// shape (DEC-0010): pick the architecture that fits the scenario's constraint — simplest
// that is measurable (AIE-004), and the right cost/latency/quality call (PROD-002, CF-001).

export const TOD_DIMENSIONS = ['simplicity_fit', 'tradeoff_fit'] as const
export type TodDimension = (typeof TOD_DIMENSIONS)[number]

export interface DuelScenarioData {
  scenario: string
  constraint: string
  stations: ConfigStation[]
}

export type DuelConfig = StationConfig
