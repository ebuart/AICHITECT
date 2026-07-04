import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { RefactorScenarioData } from './types'
import { rrFeedback } from './feedbacks'

export interface RrScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak refactor dimensions to consequence feedback.
export function selectRrFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('durable_state_fit')) feedback.push(rrFeedback.durableStateMismatch)
  if (wrong.has('small_components_fit')) feedback.push(rrFeedback.smallComponentsMismatch)
  if (wrong.has('legibility_fit')) feedback.push(rrFeedback.legibilityMismatch)
  if (weakSignals.length === 0) feedback.push(rrFeedback.clean)
  return feedback
}

export function scoreRefactor(
  data: RefactorScenarioData,
  config: StationConfig,
): RrScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectRrFeedback(score.weakSignals) }
}
