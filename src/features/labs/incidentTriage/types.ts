// Incident Triage mechanic (MECH-TRIAGE, control/07). Order the response to a live
// incident under pressure: stop the bleeding first, then find the cause, then the
// durable fix. Reorder via up/down (mobile-safe, LR-015); graded on ORDER proximity.

export interface TriageAction {
  id: string
  label: string
  note: string
}

export interface TriageScenarioData {
  incident: string
  /** Actions in a plausible STARTING order (deliberately not ideal). */
  actions: TriageAction[]
  /** The ideal sequence (action ids). */
  correctOrder: string[]
  /** The containment action that MUST come first (hard constraint). */
  firstMustBe: string
}

/** The learner's ordering of action ids. */
export type TriageOrder = string[]
