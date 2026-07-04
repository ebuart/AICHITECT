import { contextBudgetScenarios } from '@/content/labs/contextBudgetScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { ContextBudgetBoard } from './ContextBudgetBoard'
import type { ContextBudgetData } from './types'

export const contextBudgetEntry: LabEngineEntry = {
  interactionType: 'context-budget-board',
  scenarios: contextBudgetScenarios,
  render: (scenario, onComplete) => (
    <ContextBudgetBoard
      scenario={scenario as LabScenario<ContextBudgetData>}
      onComplete={onComplete}
    />
  ),
}
