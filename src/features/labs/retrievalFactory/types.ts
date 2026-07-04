import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Retrieval Factory scenario model (lab specs LAB-RETRIEVAL-FACTORY). Built on the
// shared station-config shape; the corpus/query profile makes a specific pipeline
// correct (PH-705: the simplest fitting pipeline can be right, not "always max").

export const RF_DIMENSIONS = ['method_fit', 'reranking_fit', 'context_fit'] as const
export type RfDimension = (typeof RF_DIMENSIONS)[number]

export interface RetrievalScenarioData {
  corpusProfile: string
  queryProfile: string
  stations: ConfigStation[]
}

export type RetrievalConfig = StationConfig
