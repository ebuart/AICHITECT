import type { Feedback } from '@/types'
import type { ArchScenarioData, ArchSelection } from './types'
import { archFeedback } from './feedbacks'

// Scoring dimensions (lab specs SCORING_DIMENSIONS, architecture builder). Pure.
export const ARCH_DIMENSIONS = [
  'capability_coverage',
  'avoids_forbidden',
  'simplicity',
  'no_redundancy',
] as const
export type ArchDimension = (typeof ARCH_DIMENSIONS)[number]

export interface ArchScore {
  score: number
  masterySignals: ArchDimension[]
  weakSignals: ArchDimension[]
  feedback: Feedback[]
}

export function scoreArchitecture(
  data: ArchScenarioData,
  selection: ArchSelection,
): ArchScore {
  const included = data.components.filter((c) => selection.includes(c.id))
  const covered = new Set(included.flatMap((c) => c.capabilities))

  const checks: Record<ArchDimension, boolean> = {
    capability_coverage: data.requiredCapabilities.every((rc) => covered.has(rc)),
    avoids_forbidden: included.every((c) => !data.forbiddenTypes.includes(c.type)),
    simplicity: included.length > 0 && included.length <= data.maxRecommended,
    // Each included component must uniquely provide at least one required capability.
    no_redundancy: included.every((c) => {
      const others = included.filter((o) => o.id !== c.id)
      const required = c.capabilities.filter((cap) => data.requiredCapabilities.includes(cap))
      return required.some((cap) => !others.some((o) => o.capabilities.includes(cap)))
    }),
  }

  const masterySignals = ARCH_DIMENSIONS.filter((d) => checks[d])
  const weakSignals = ARCH_DIMENSIONS.filter((d) => !checks[d])
  const score = masterySignals.length / ARCH_DIMENSIONS.length

  const feedback: Feedback[] = []
  if (!checks.capability_coverage) feedback.push(archFeedback.incomplete)
  if (!checks.avoids_forbidden || !checks.simplicity || !checks.no_redundancy) {
    feedback.push(archFeedback.overengineered)
  }
  if (weakSignals.length === 0) feedback.push(archFeedback.clean)

  return { score, masterySignals, weakSignals, feedback }
}
