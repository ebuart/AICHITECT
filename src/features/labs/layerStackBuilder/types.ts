import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Layer Stack Builder scenario model (LAB-LAYER-STACK-BUILDER). Built on the shared
// station-config shape (DEC-0010): classify each failure to the system layer where it
// originates — the skill behind the Iceberg Model (00-02) and System Layers Map (01-03).

export const LSB_DIMENSIONS = ['layer_a_fit', 'layer_b_fit', 'layer_c_fit'] as const
export type LsbDimension = (typeof LSB_DIMENSIONS)[number]

export interface LayerScenarioData {
  feature: string
  task: string
  stations: ConfigStation[]
}

export type LayerConfig = StationConfig
