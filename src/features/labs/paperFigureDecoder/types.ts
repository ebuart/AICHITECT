import type { ConfigStation, StationConfig } from '../stationConfig/types'

// Paper Figure Decoder scenario model (lab specs LAB-PAPER-FIGURE-DECODER). Built on
// the shared station-config shape (DEC-0010) with a figure slot. The figure is
// RECREATED from primitives (no copied paper images — PH-704); the learner reads
// what it actually shows and the architecture decision it supports (PH-705), not the term.

export const PFD_DIMENSIONS = ['figure_reading_fit', 'decision_fit'] as const
export type PfdDimension = (typeof PFD_DIMENSIONS)[number]

export interface FigureBar {
  id: string
  label: string
  value: number
  max: number
}

export interface FigureScenarioData {
  source: string
  caption: string
  /** Recreated benchmark bars, rendered as ScoreMeters. */
  bars: FigureBar[]
  stations: ConfigStation[]
}

export type FigureConfig = StationConfig
