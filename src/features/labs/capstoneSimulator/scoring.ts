import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { CapstoneScenarioData } from './types'
import { capFeedback } from './feedbacks'

export interface CapScore extends StationScore {
  feedback: Feedback[]
}

// Maps weak system-layer dimensions to consequence feedback.
export function selectCapFeedback(weakSignals: string[]): Feedback[] {
  const wrong = new Set(weakSignals)
  const feedback: Feedback[] = []
  if (wrong.has('context_fit')) feedback.push(capFeedback.contextMismatch)
  if (wrong.has('tools_fit')) feedback.push(capFeedback.toolsMismatch)
  if (wrong.has('retrieval_fit')) feedback.push(capFeedback.retrievalMismatch)
  if (wrong.has('eval_fit')) feedback.push(capFeedback.evalMismatch)
  if (wrong.has('security_fit')) feedback.push(capFeedback.securityMismatch)
  if (wrong.has('repo_fit')) feedback.push(capFeedback.repoMismatch)
  if (weakSignals.length === 0) feedback.push(capFeedback.clean)
  return feedback
}

export function scoreCapstone(
  data: CapstoneScenarioData,
  config: StationConfig,
): CapScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectCapFeedback(score.weakSignals) }
}
