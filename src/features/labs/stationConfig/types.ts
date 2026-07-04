// Shared "station configuration" interaction shape (BP-009, CTX-066). A learner
// makes one single-select decision per station; each scenario declares the
// fitting option, and scoring is best-fit per station. Reused by Retrieval
// Factory + Eval Designer (and any future config-style lab). Dimensions are
// engine-specific strings; the shared core stays dimension-agnostic.

export interface ConfigOption {
  id: string
  label: string
  /** Shown only after evaluation. */
  rationale: string
}

export interface ConfigStation {
  id: string
  /** Engine-specific scoring dimension this station maps to. */
  dimension: string
  label: string
  question: string
  options: ConfigOption[]
  /** The fitting choice for THIS scenario's profile. */
  bestOptionId: string
}

/** stationId -> chosen optionId. */
export type StationConfig = Record<string, string>

export interface StationScore {
  score: number
  masterySignals: string[]
  weakSignals: string[]
}

/** One labelled intro row describing the scenario (e.g. corpus / system). */
export interface ProfileRow {
  term: string
  detail: string
}
