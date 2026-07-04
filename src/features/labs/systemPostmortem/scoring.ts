import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { PostmortemScenarioData } from './types'
import { spmFeedback } from './feedbacks'

export interface SpmScore extends StationScore {
  feedback: Feedback[]
}

export function selectSpmFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('root_cause_fit')) feedback.push(spmFeedback.wrongRootCause)
  if (wrong.has('durable_rule_fit')) feedback.push(spmFeedback.noDurableRule)
  if (weakSignals.length === 0) feedback.push(spmFeedback.clean)
  return feedback
}

export function scorePostmortem(
  data: PostmortemScenarioData,
  config: StationConfig,
): SpmScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectSpmFeedback(score.weakSignals) }
}
