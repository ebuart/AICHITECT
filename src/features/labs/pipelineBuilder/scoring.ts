import type { Feedback } from '@/types'
import type { PipelineBuild, PipelineScenarioData } from './types'
import {
  forbiddenFeedback,
  missingFeedback,
  pipelineCleanFeedback,
  pipelineOrderFeedback,
} from './feedbacks'

export interface PipelineScore {
  score: number
  masterySignals: string[]
  weakSignals: string[]
  /** Forbidden stages included (hard violation). */
  violations: string[]
  feedback: Feedback[]
}

// Pipeline scoring (LR-013/LR-030): position-match share against the ideal pipeline,
// minus a small penalty for redundant stages, capped at 0.5 if a forbidden stage is in.
export function scorePipeline(
  data: PipelineScenarioData,
  build: PipelineBuild,
): PipelineScore {
  const req = data.requiredOrder
  const forbidden = data.forbidden ?? []
  const stage = (id: string) => data.available.find((s) => s.id === id)!

  const violations = build.filter((id) => forbidden.includes(id))
  const matches = req.filter((id, i) => build[i] === id)
  const extra = build.filter((id) => !req.includes(id) && !forbidden.includes(id))
  const missing = req.filter((id) => !build.includes(id))

  let score = req.length ? matches.length / req.length : 0
  score = Math.max(0, score - 0.1 * extra.length)
  if (violations.length > 0) score = Math.min(score, 0.5)
  score = Math.max(0, Math.min(1, score))

  const feedback: Feedback[] = (() => {
    if (violations.length > 0) return [forbiddenFeedback(stage(violations[0]))]
    if (missing.length > 0) return [missingFeedback(stage(missing[0]))]
    if (matches.length < req.length) return [pipelineOrderFeedback]
    return [pipelineCleanFeedback]
  })()

  return {
    score,
    masterySignals: matches,
    weakSignals: req.filter((id, i) => build[i] !== id),
    violations,
    feedback,
  }
}
