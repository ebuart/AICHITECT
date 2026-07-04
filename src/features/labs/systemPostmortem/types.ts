import type { ConfigStation, StationConfig } from '../stationConfig/types'

// System Postmortem scenario model (LAB-SYSTEM-POSTMORTEM). Built on the shared station-
// config shape (DEC-0010): read the trace to the root cause, then turn the incident into a
// DURABLE system change (rule/eval/guard) rather than a one-off patch (OBS-002, NODE-07-04).

export const SPM_DIMENSIONS = ['root_cause_fit', 'durable_rule_fit'] as const
export type SpmDimension = (typeof SPM_DIMENSIONS)[number]

export interface PostmortemScenarioData {
  incident: string
  trace: string
  stations: ConfigStation[]
}

export type PostmortemConfig = StationConfig
