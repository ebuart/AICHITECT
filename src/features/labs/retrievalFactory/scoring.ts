import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { RetrievalScenarioData } from './types'
import { rfFeedback } from './feedbacks'

export interface RfScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak retrieval dimensions to consequence feedback (selected by the board
// and by scoreRetrieval). Direction-neutral: a station is wrong whether over- or
// under-built; the per-option rationale supplies the specifics.
export function selectRfFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('method_fit')) feedback.push(rfFeedback.methodMismatch)
  if (wrong.has('reranking_fit')) feedback.push(rfFeedback.rerankingMismatch)
  if (wrong.has('context_fit')) feedback.push(rfFeedback.contextMismatch)
  if (weakSignals.length === 0) feedback.push(rfFeedback.clean)
  return feedback
}

export function scoreRetrieval(
  data: RetrievalScenarioData,
  config: StationConfig,
): RfScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectRfFeedback(score.weakSignals) }
}
