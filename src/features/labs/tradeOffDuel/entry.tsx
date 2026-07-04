import { tradeOffScenarios } from '@/content/labs/tradeOffScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { TradeOffDuel } from './TradeOffDuel'
import type { DuelScenarioData } from './types'

export const tradeOffEntry: LabEngineEntry = {
  interactionType: 'trade-off-duel',
  scenarios: tradeOffScenarios,
  render: (scenario, onComplete) => (
    <TradeOffDuel
      scenario={scenario as LabScenario<DuelScenarioData>}
      onComplete={onComplete}
    />
  ),
}
