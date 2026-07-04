// Pipeline Builder mechanic (MECH-CONNECT, control/07). Assemble a working pipeline:
// pick the right stages from a palette and order them. Tap-to-add + up/down reorder
// (mobile-safe, LR-015). Graded on matching the ideal pipeline; forbidden stages are
// a hard violation.

export interface PipelineStage {
  id: string
  label: string
  note: string
}

export interface PipelineScenarioData {
  goal: string
  /** The palette of selectable stages (includes distractors / forbidden ones). */
  available: PipelineStage[]
  /** The ideal pipeline as an ordered list of stage ids. */
  requiredOrder: string[]
  /** Stages that must NOT be in the pipeline. */
  forbidden?: string[]
}

/** The learner's selected + ordered stage ids. */
export type PipelineBuild = string[]
