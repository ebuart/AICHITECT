import type { ProgressState } from '@/types'
import type { Lesson } from './lessonModel'

// Minimal review-hook model (PH-401 / PH-403 "simple review hooks"). A lesson
// declares reviewHooks (concept/node IDs) that resurface its core idea later.
// Scheduling/spaced-repetition UI is PHASE_7 — this just exposes the model.
export interface ReviewHookEntry {
  lessonId: string
  nodeId: string
  reviewHooks: string[]
}

/** Review hooks contributed by lessons the learner has completed. */
export function collectCompletedReviewHooks(
  lessons: Lesson[],
  progress: ProgressState,
): ReviewHookEntry[] {
  return lessons
    .filter((l) => progress.lessons[l.id]?.completed && l.reviewHooks.length > 0)
    .map((l) => ({
      lessonId: l.id,
      nodeId: l.roadmapNodeId,
      reviewHooks: l.reviewHooks,
    }))
}
