import type { Feedback } from '@/types'
import type { TraceScenarioData } from './types'
import { traceFeedback } from './feedbacks'

// Scoring dimensions (lab specs SCORING_DIMENSIONS, trace debugger). Pure.
export const TRACE_DIMENSIONS = [
  'earliest_failure_found',
  'symptom_vs_cause_separation',
  'repair_fit',
] as const
export type TraceDimension = (typeof TRACE_DIMENSIONS)[number]

export interface TraceScore {
  score: number
  masterySignals: TraceDimension[]
  weakSignals: TraceDimension[]
  feedback: Feedback[]
}

export function scoreTrace(
  data: TraceScenarioData,
  selectedEventId: string | null,
  repairId: string | null,
): TraceScore {
  const origin = data.events.find((e) => e.isFailureOrigin)
  const selected = data.events.find((e) => e.id === selectedEventId)

  const checks: Record<TraceDimension, boolean> = {
    earliest_failure_found: selectedEventId != null && selectedEventId === origin?.id,
    symptom_vs_cause_separation: selected != null && !selected.isSymptom,
    repair_fit: data.repairRules.find((r) => r.id === repairId)?.correct === true,
  }

  const masterySignals = TRACE_DIMENSIONS.filter((d) => checks[d])
  const weakSignals = TRACE_DIMENSIONS.filter((d) => !checks[d])
  const score = masterySignals.length / TRACE_DIMENSIONS.length

  const feedback: Feedback[] = []
  if (!checks.earliest_failure_found || !checks.symptom_vs_cause_separation) {
    feedback.push(traceFeedback.wrongOrigin)
  }
  if (!checks.repair_fit) feedback.push(traceFeedback.wrongRepair)
  if (weakSignals.length === 0) feedback.push(traceFeedback.clean)

  return { score, masterySignals, weakSignals, feedback }
}
