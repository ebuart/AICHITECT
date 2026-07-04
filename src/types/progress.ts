// Progress domain types. Persistence-agnostic — consumed via the storage adapter
// boundary (BP-005, QG-072). Kept minimal for PHASE_0; expanded in PHASE_1.

export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface RoadmapNodeProgress {
  nodeId: string
  status: NodeStatus
  completedAt?: string
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: string
}

export interface LabProgress {
  labId: string
  completed: boolean
  completedAt?: string
  /** Normalized 0..1 score of the best attempt (LS-007). */
  score?: number
  /** Scoring dimensions the learner handled weakly (resurfaced in review). */
  weakSignals?: string[]
}

/** Full persisted progress snapshot. Versioned for safe migration (QG-072). */
export interface ProgressState {
  version: number
  roadmap: Record<string, RoadmapNodeProgress>
  lessons: Record<string, LessonProgress>
  labs: Record<string, LabProgress>
  /** Last node the learner engaged with (resume hint). */
  currentNodeId?: string
  updatedAt: string
}

export const PROGRESS_SCHEMA_VERSION = 1

export const EMPTY_PROGRESS_STATE: ProgressState = {
  version: PROGRESS_SCHEMA_VERSION,
  roadmap: {},
  lessons: {},
  labs: {},
  updatedAt: new Date(0).toISOString(),
}
