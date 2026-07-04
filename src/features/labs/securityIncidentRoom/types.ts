import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Security Incident Room scenario model (lab specs LAB-SECURITY-INCIDENT-ROOM).
// Built on the shared station-config shape (DEC-0010): triage one incident across
// three coupled decisions — identify the breach vector, contain it now, and choose
// the durable control that prevents recurrence (incident → system change, not anecdote).

export const SIR_DIMENSIONS = ['vector_id', 'containment_fit', 'control_fit'] as const
export type SirDimension = (typeof SIR_DIMENSIONS)[number]

export interface IncidentScenarioData {
  incident: string
  trace: string
  stations: ConfigStation[]
}

export type IncidentConfig = StationConfig
