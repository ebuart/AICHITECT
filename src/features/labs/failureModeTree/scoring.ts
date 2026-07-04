import type { Feedback } from '@/types'
import type {
  CauseClassification,
  FailureScenarioData,
} from './types'
import { fmtFeedback } from './feedbacks'

// Scoring dimensions (lab specs SCORING_DIMENSIONS, FMT). Pure + deterministic.
export const FMT_DIMENSIONS = [
  'root_cause_identification',
  'symptom_separation',
  'distractor_resistance',
  'repair_fit',
] as const
export type FmtDimension = (typeof FMT_DIMENSIONS)[number]

export interface FmtScore {
  score: number
  masterySignals: FmtDimension[]
  weakSignals: FmtDimension[]
  feedback: Feedback[]
}

export function scoreFailureMode(
  data: FailureScenarioData,
  classification: CauseClassification,
  chosenRepairId: string | null,
): FmtScore {
  const role = (id: string) => classification[id]
  const cards = data.causeCards

  const checks: Record<FmtDimension, boolean> = {
    root_cause_identification: cards
      .filter((c) => c.role === 'root_cause')
      .every((c) => role(c.id) === 'root_cause'),
    symptom_separation: cards
      .filter((c) => c.role === 'symptom')
      .every((c) => role(c.id) === 'symptom'),
    distractor_resistance: cards
      .filter((c) => c.role === 'distractor')
      .every((c) => role(c.id) === 'distractor'),
    repair_fit: data.repairRules.find((r) => r.id === chosenRepairId)?.correct === true,
  }

  const masterySignals = FMT_DIMENSIONS.filter((d) => checks[d])
  const weakSignals = FMT_DIMENSIONS.filter((d) => !checks[d])
  const score = masterySignals.length / FMT_DIMENSIONS.length

  const feedback: Feedback[] = []
  if (!checks.root_cause_identification || !checks.symptom_separation || !checks.distractor_resistance) {
    feedback.push(fmtFeedback.symptomMistaken)
  }
  if (!checks.repair_fit) feedback.push(fmtFeedback.wrongRepair)
  if (weakSignals.length === 0) feedback.push(fmtFeedback.clean)

  return { score, masterySignals, weakSignals, feedback }
}
