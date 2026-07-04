import type { Feedback } from '@/types'
import type { BoundaryConfig, BoundaryScenarioData } from './types'
import { boundaryCleanFeedback, boundaryFeedback } from './feedbacks'

export interface BoundaryScore {
  score: number
  masterySignals: string[]
  weakSignals: string[]
  /** High-risk elements left in the wrong zone (exposed). */
  violations: string[]
  feedback: Feedback[]
}

// Placement scoring: share correctly contained, capped at 0.5 if any HIGH-risk element
// is mis-zoned (an exposed dangerous path). Pure + deterministic.
export function scoreBoundary(
  data: BoundaryScenarioData,
  config: BoundaryConfig,
): BoundaryScore {
  const correctEls = data.elements.filter((e) => config[e.id] === e.bestZone)
  const wrongEls = data.elements.filter((e) => config[e.id] !== e.bestZone)
  const violations = wrongEls.filter((e) => e.risk === 'high').map((e) => e.id)

  let score = data.elements.length ? correctEls.length / data.elements.length : 0
  if (violations.length > 0) score = Math.min(score, 0.5)

  const feedback: Feedback[] = (() => {
    if (violations.length > 0) {
      const el = data.elements.find((e) => e.id === violations[0])!
      return [boundaryFeedback(el, 'critical')]
    }
    if (wrongEls.length > 0) return [boundaryFeedback(wrongEls[0], 'risk')]
    return [boundaryCleanFeedback]
  })()

  return {
    score,
    masterySignals: correctEls.map((e) => e.id),
    weakSignals: wrongEls.map((e) => e.id),
    violations,
    feedback,
  }
}
