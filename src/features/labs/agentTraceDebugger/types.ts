// Agent Trace Debugger scenario model (lab specs LAB-AGENT-TRACE-DEBUGGER).

export type TraceActor =
  | 'user'
  | 'main_agent'
  | 'subagent'
  | 'tool'
  | 'retriever'
  | 'evaluator'
  | 'system'

export interface TraceLabEvent {
  id: string
  step: number
  actor: TraceActor
  action: string
  observation?: string
  riskTags: string[]
  isFailureOrigin?: boolean
  isSymptom?: boolean
}

export interface TraceRepair {
  id: string
  label: string
  correct: boolean
  rationale: string
}

export interface TraceScenarioData {
  task: string
  events: TraceLabEvent[]
  repairRules: TraceRepair[]
}
