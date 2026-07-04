import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Capstone Simulator scenario model (lab specs INT-CAPSTONE-SIMULATOR). Built on the
// shared station-config shape (DEC-0010): the integrated architecture draft for an
// AI-native software-team system — one decision per system layer, all at once
// (PC-040/041, PH-901/902). Failure-injection + final defence are later ARC-10 nodes.

export const CAP_DIMENSIONS = [
  'context_fit',
  'tools_fit',
  'retrieval_fit',
  'eval_fit',
  'security_fit',
  'repo_fit',
] as const
export type CapDimension = (typeof CAP_DIMENSIONS)[number]

export interface CapstoneScenarioData {
  system: string
  goal: string
  stations: ConfigStation[]
}

export type CapstoneConfig = StationConfig
