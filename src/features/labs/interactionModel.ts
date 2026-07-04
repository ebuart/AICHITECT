import type { ReactNode } from 'react'
import type {
  ConceptId,
  Feedback,
  InteractionType,
  LabId,
  RoadmapNodeId,
} from '@/types'

// Reusable interaction framework (PH-501). Every core interaction shares these
// contracts; engines differ only in scenarioData + scoring (IC-001, IC-007).

export type LabDifficulty = 'intro' | 'core' | 'advanced' | 'capstone'

// A config-driven scenario (LS COMMON_LAB_SCHEMA). `scenarioData` is engine-
// specific; the engine casts it at its boundary. Lab data is never hardcoded in
// the UI (LS-009).
export interface LabScenario<Data = unknown> {
  id: string
  interactionType: InteractionType
  labId: LabId
  roadmapNodeId: RoadmapNodeId
  title: string
  prompt: string
  concepts: ConceptId[]
  prerequisites: RoadmapNodeId[]
  difficulty: LabDifficulty
  estimatedMinutes: number
  /** A transfer variant applies the same concept in a changed scenario (MECH-TRANSFER). */
  isTransfer: boolean
  scenarioData: Data
  scoringProfileId: string
  feedbackProfileId: string
  reviewHooks: string[]
}

// Outcome of one attempt (LS COMMON_RESULT_SCHEMA). Score is normalized 0..1.
export interface LabResult {
  scenarioId: string
  completed: boolean
  score: number
  masterySignals: string[]
  weakSignals: string[]
  feedback: Feedback[]
  reviewHookIds: string[]
  completedAt: string
}

// One registered engine: its scenarios + a render function that binds a scenario
// to its component. Keeps the registry heterogeneous without leaking generics.
export interface LabEngineEntry {
  interactionType: InteractionType
  scenarios: LabScenario[]
  render: (scenario: LabScenario, onComplete: (result: LabResult) => void) => ReactNode
}

export interface InteractionEngineProps<Data> {
  scenario: LabScenario<Data>
  onComplete: (result: LabResult) => void
}

/** Pick the intro (non-transfer) scenario for a lab, else the first. */
export function introScenario(
  scenarios: LabScenario[],
  labId: LabId,
): LabScenario | undefined {
  const forLab = scenarios.filter((s) => s.labId === labId)
  return forLab.find((s) => !s.isTransfer) ?? forLab[0]
}

/** The transfer variant for a lab, if any. */
export function transferScenario(
  scenarios: LabScenario[],
  labId: LabId,
): LabScenario | undefined {
  return scenarios.find((s) => s.labId === labId && s.isTransfer)
}
