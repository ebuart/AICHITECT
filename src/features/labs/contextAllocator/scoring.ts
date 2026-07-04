import type { Feedback } from '@/types'
import { shares, type Allocation, type AllocScenarioData } from './types'
import { allocCleanFeedback, allocEmptyFeedback, itemFeedback } from './feedbacks'

const DEFAULT_TOLERANCE = 8

export interface AllocScore {
  /** 0..1 — proximity to the good region, capped by hard-constraint violations. */
  score: number
  shares: Record<string, number>
  /** Item ids within tolerance of their ideal share. */
  masterySignals: string[]
  /** Item ids off-target. */
  weakSignals: string[]
  /** Item ids breaking a min/max hard constraint. */
  violations: string[]
  feedback: Feedback[]
}

// Graded proximity scoring (LR-013/LR-030). Pure + deterministic. Score = 1 − total-
// variation-distance to the ideal split, capped at 0.5 if a hard constraint is broken.
export function scoreAllocation(
  data: AllocScenarioData,
  alloc: Allocation,
): AllocScore {
  const items = data.items
  const sh = shares(items, alloc)
  const { ideal, min = {}, max = {}, tolerance = DEFAULT_TOLERANCE } = data.rubric
  const total = items.reduce((s, i) => s + Math.max(0, alloc[i.id] ?? 0), 0)

  const violations = items
    .filter(
      (i) =>
        (min[i.id] !== undefined && sh[i.id] < min[i.id] - 1e-9) ||
        (max[i.id] !== undefined && sh[i.id] > max[i.id] + 1e-9),
    )
    .map((i) => i.id)

  const tvd =
    0.5 * items.reduce((s, i) => s + Math.abs(sh[i.id] - (ideal[i.id] ?? 0)), 0) / 100
  let score = total <= 0 ? 0 : Math.max(0, Math.min(1, 1 - tvd))
  if (violations.length > 0) score = Math.min(score, 0.5)

  const deviation = (id: string) => sh[id] - (ideal[id] ?? 0)
  const masterySignals = items.filter((i) => Math.abs(deviation(i.id)) <= tolerance).map((i) => i.id)
  const weakSignals = items.filter((i) => Math.abs(deviation(i.id)) > tolerance).map((i) => i.id)

  return { score, shares: sh, masterySignals, weakSignals, violations, feedback: pickFeedback() }

  function pickFeedback(): Feedback[] {
    if (total <= 0) return [allocEmptyFeedback]
    const byId = (id: string) => items.find((i) => i.id === id)!
    if (violations.length > 0) {
      // Worst violation = largest signed deviation from ideal.
      const id = [...violations].sort((a, b) => Math.abs(deviation(b)) - Math.abs(deviation(a)))[0]
      return [itemFeedback(byId(id), deviation(id) > 0 ? 'over' : 'under', 'critical')]
    }
    if (weakSignals.length > 0) {
      const id = [...weakSignals].sort((a, b) => Math.abs(deviation(b)) - Math.abs(deviation(a)))[0]
      return [itemFeedback(byId(id), deviation(id) > 0 ? 'over' : 'under', 'risk')]
    }
    return [allocCleanFeedback]
  }
}
