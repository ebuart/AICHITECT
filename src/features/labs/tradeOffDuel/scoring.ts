import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { DuelScenarioData } from './types'
import { todFeedback } from './feedbacks'

export interface TodScore extends StationScore {
  feedback: Feedback[]
}

export function selectTodFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('simplicity_fit')) feedback.push(todFeedback.simplicityMismatch)
  if (wrong.has('tradeoff_fit')) feedback.push(todFeedback.tradeoffMismatch)
  if (weakSignals.length === 0) feedback.push(todFeedback.clean)
  return feedback
}

export function scoreDuel(
  data: DuelScenarioData,
  config: StationConfig,
): TodScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectTodFeedback(score.weakSignals) }
}
