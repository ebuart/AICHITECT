import type { ConfigStation, StationConfig, StationScore } from './types'

// Best-fit station scoring (pure + deterministic). A station is correct when the
// chosen option matches the scenario's fitting choice; score is normalized 0..1.
// Engines wrap this and add their own dimension→feedback selection.
export function scoreStations(
  stations: ConfigStation[],
  config: StationConfig,
): StationScore {
  const masterySignals: string[] = []
  const weakSignals: string[] = []
  for (const station of stations) {
    const correct = config[station.id] === station.bestOptionId
    ;(correct ? masterySignals : weakSignals).push(station.dimension)
  }
  const score = stations.length ? masterySignals.length / stations.length : 0
  return { score, masterySignals, weakSignals }
}
