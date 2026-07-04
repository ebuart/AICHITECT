import type { Feedback } from '@/types'
import { usedTokens, type ContextBudgetData, type Dispositions } from './types'
import { cbbFeedback } from './feedbacks'

// Scoring dimensions (lab specs SCORING_DIMENSIONS). Each is a pass/fail signal;
// the normalized score is the share passed. Pure + deterministic (testable).
export const CBB_DIMENSIONS = [
  'critical_context_kept',
  'noise_reduced',
  'budget_respected',
  'stale_context_detected',
  'rationale_preserved',
] as const
export type CbbDimension = (typeof CBB_DIMENSIONS)[number]

export interface CbbScore {
  score: number
  usedTokens: number
  masterySignals: CbbDimension[]
  weakSignals: CbbDimension[]
  feedback: Feedback[]
}

export function scoreContextBudget(
  data: ContextBudgetData,
  dispositions: Dispositions,
): CbbScore {
  const disp = (id: string) => dispositions[id] ?? 'exclude'
  const used = usedTokens(data, dispositions)

  const checks: Record<CbbDimension, boolean> = {
    critical_context_kept: data.items.every(
      (i) => !i.required || disp(i.id) !== 'exclude',
    ),
    noise_reduced: data.items.every((i) => i.noiseRisk < 2 || disp(i.id) === 'exclude'),
    budget_respected: used <= data.maxTokens,
    stale_context_detected: data.items.every(
      (i) => i.staleRisk < 2 || disp(i.id) === 'exclude',
    ),
    rationale_preserved: data.items.every(
      (i) => i.relevance < 3 || disp(i.id) !== 'exclude',
    ),
  }

  const masterySignals = CBB_DIMENSIONS.filter((d) => checks[d])
  const weakSignals = CBB_DIMENSIONS.filter((d) => !checks[d])
  const score = masterySignals.length / CBB_DIMENSIONS.length

  const feedback: Feedback[] = []
  if (!checks.critical_context_kept) feedback.push(cbbFeedback.missingCritical)
  if (!checks.budget_respected || !checks.noise_reduced) {
    feedback.push(cbbFeedback.contextNoise)
  }
  if (weakSignals.length === 0) feedback.push(cbbFeedback.discipline)
  else if (feedback.length === 0) feedback.push(cbbFeedback.partial)

  return { score, usedTokens: used, masterySignals, weakSignals, feedback }
}
