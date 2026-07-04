import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { ConstraintScenarioData } from './types'
import { cpFeedback } from './feedbacks'

export interface CpScore extends StationScore {
  feedback: Feedback[]
}

export function selectCpFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('structured_output_fit')) feedback.push(cpFeedback.formatDrift)
  if (wrong.has('constraint_strictness_fit')) feedback.push(cpFeedback.strictnessMismatch)
  if (weakSignals.length === 0) feedback.push(cpFeedback.clean)
  return feedback
}

export function scoreConstraint(
  data: ConstraintScenarioData,
  config: StationConfig,
): CpScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectCpFeedback(score.weakSignals) }
}
