import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Constraint Puzzle scenario model (INT-CONSTRAINT-PUZZLE). Built on the shared station-
// config shape (DEC-0010): make the model's output reliably parseable (structured outputs,
// TOOL-003) and decide how strict the constraints should be (constrained decoding, TOOL-004).

export const CP_DIMENSIONS = ['structured_output_fit', 'constraint_strictness_fit'] as const
export type CpDimension = (typeof CP_DIMENSIONS)[number]

export interface ConstraintScenarioData {
  requirement: string
  schema: string
  stations: ConfigStation[]
}

export type ConstraintConfig = StationConfig
