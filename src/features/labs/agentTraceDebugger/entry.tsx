import { agentTraceScenarios } from '@/content/labs/agentTraceScenarios'
import type { LabEngineEntry, LabScenario } from '../interactionModel'
import { AgentTraceDebugger } from './AgentTraceDebugger'
import type { TraceScenarioData } from './types'

export const agentTraceEntry: LabEngineEntry = {
  interactionType: 'agent-trace-debugger',
  scenarios: agentTraceScenarios,
  render: (scenario, onComplete) => (
    <AgentTraceDebugger
      scenario={scenario as LabScenario<TraceScenarioData>}
      onComplete={onComplete}
    />
  ),
}
