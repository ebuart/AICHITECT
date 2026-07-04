import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { EvalScenarioData } from './types'
import { edFeedback } from './feedbacks'

export interface EdScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak eval-design dimensions to consequence feedback.
export function selectEdFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('success_metric_fit')) feedback.push(edFeedback.successMetricMismatch)
  if (wrong.has('regression_fit')) feedback.push(edFeedback.regressionMismatch)
  if (wrong.has('grounding_fit')) feedback.push(edFeedback.groundingMismatch)
  if (weakSignals.length === 0) feedback.push(edFeedback.clean)
  return feedback
}

export function scoreEval(
  data: EvalScenarioData,
  config: StationConfig,
): EdScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectEdFeedback(score.weakSignals) }
}
