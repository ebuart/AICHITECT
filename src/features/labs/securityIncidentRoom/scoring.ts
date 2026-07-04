import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { IncidentScenarioData } from './types'
import { sirFeedback } from './feedbacks'

export interface SirScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak incident-response dimensions to consequence feedback.
export function selectSirFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('vector_id')) feedback.push(sirFeedback.vectorMismatch)
  if (wrong.has('containment_fit')) feedback.push(sirFeedback.containmentMismatch)
  if (wrong.has('control_fit')) feedback.push(sirFeedback.controlMismatch)
  if (weakSignals.length === 0) feedback.push(sirFeedback.clean)
  return feedback
}

export function scoreIncident(
  data: IncidentScenarioData,
  config: StationConfig,
): SirScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectSirFeedback(score.weakSignals) }
}
