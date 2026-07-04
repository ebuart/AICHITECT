import type { Feedback } from '@/types'
import type { StationConfig, StationScore } from '../stationConfig/types'
import { scoreStations } from '../stationConfig/scoreStations'
import type { LayerScenarioData } from './types'
import { lsbFeedback } from './feedbacks'

export interface LsbScore extends StationScore {
  feedback: Feedback[]
}

// Any misclassified layer yields the single "wrong layer" lesson; a clean sheet is mastery.
export function selectLsbFeedback(weakSignals: string[]): Feedback[] {
  return weakSignals.length > 0 ? [lsbFeedback.layerMismatch] : [lsbFeedback.clean]
}

export function scoreLayers(
  data: LayerScenarioData,
  config: StationConfig,
): LsbScore {
  const score = scoreStations(data.stations, config)
  return { ...score, feedback: selectLsbFeedback(score.weakSignals) }
}
