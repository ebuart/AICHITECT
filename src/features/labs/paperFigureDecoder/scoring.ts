import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { FigureScenarioData } from './types'
import { pfdFeedback } from './feedbacks'

export interface PfdScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak figure-decoding dimensions to consequence feedback.
export function selectPfdFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('figure_reading_fit')) feedback.push(pfdFeedback.figureReadingMismatch)
  if (wrong.has('decision_fit')) feedback.push(pfdFeedback.decisionMismatch)
  if (weakSignals.length === 0) feedback.push(pfdFeedback.clean)
  return feedback
}

export function scoreFigure(
  data: FigureScenarioData,
  config: StationConfig,
): PfdScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectPfdFeedback(score.weakSignals) }
}
