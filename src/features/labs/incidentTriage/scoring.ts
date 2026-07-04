import type { Feedback } from '@/types'
import type { TriageOrder, TriageScenarioData } from './types'
import { firstWrongFeedback, orderFeedback, triageCleanFeedback } from './feedbacks'

export interface TriageScore {
  score: number
  masterySignals: string[]
  weakSignals: string[]
  violations: string[]
  feedback: Feedback[]
}

// Order proximity (LR-013/LR-030): score = 1 − total positional displacement / max
// displacement, capped at 0.5 if the containment action is not first. Pure + deterministic.
export function scoreTriage(
  data: TriageScenarioData,
  order: TriageOrder,
): TriageScore {
  const idealPos = new Map(data.correctOrder.map((id, i) => [id, i]))
  const n = data.correctOrder.length

  const displacement = order.reduce(
    (s, id, i) => s + Math.abs(i - (idealPos.get(id) ?? i)),
    0,
  )
  const maxDisplacement = Math.floor((n * n) / 2) || 1
  let score = Math.max(0, 1 - displacement / maxDisplacement)

  const firstWrong = order[0] !== data.firstMustBe
  const violations = firstWrong ? [data.firstMustBe] : []
  if (firstWrong) score = Math.min(score, 0.5)

  const masterySignals = order.filter((id, i) => idealPos.get(id) === i)
  const weakSignals = order.filter((id, i) => idealPos.get(id) !== i)

  const feedback: Feedback[] = (() => {
    const byId = (id: string) => data.actions.find((a) => a.id === id)!
    if (firstWrong) return [firstWrongFeedback(byId(data.firstMustBe))]
    if (weakSignals.length > 0) {
      // The most-displaced action drives the note.
      const id = [...weakSignals].sort(
        (a, b) =>
          Math.abs(order.indexOf(b) - (idealPos.get(b) ?? 0)) -
          Math.abs(order.indexOf(a) - (idealPos.get(a) ?? 0)),
      )[0]
      return [orderFeedback(byId(id))]
    }
    return [triageCleanFeedback]
  })()

  return { score, masterySignals, weakSignals, violations, feedback }
}
