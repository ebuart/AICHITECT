// Shared visual-system types (visuals/31_visual_component_contracts.md COMMON_TYPES).
// Visual components are pure presentation — they never own scoring (VCC-201).

export type VisualState =
  | 'default'
  | 'selected'
  | 'excluded'
  | 'compressed'
  | 'locked'
  | 'unlocked'
  | 'completed'
  | 'warning'
  | 'failure_origin'
  | 'symptom'
  | 'strong_choice'
  | 'weak_choice'
  | 'disabled'

export type VisualDensity = 'compact' | 'normal' | 'dense'

export type VisualSize = 'mobile' | 'tablet' | 'desktop'

export type LayerId =
  | 'product'
  | 'app_logic'
  | 'model_control'
  | 'context'
  | 'retrieval'
  | 'memory'
  | 'tools'
  | 'evals'
  | 'observability'
  | 'security'
  | 'repo'
  | 'governance'

export type SystemNodeKind =
  | 'model'
  | 'agent'
  | 'subagent'
  | 'tool'
  | 'retrieval'
  | 'memory'
  | 'eval'
  | 'human'
  | 'guardrail'
  | 'repo'
  | 'workflow'
  | 'storage'

export type SystemEdgeKind =
  | 'data'
  | 'control'
  | 'tool_call'
  | 'retrieval'
  | 'memory_write'
  | 'eval_feedback'
  | 'approval'
  | 'risk'

export type EdgeDirection = 'one_way' | 'two_way'

export type BoundaryKind =
  | 'trust'
  | 'permission'
  | 'context'
  | 'sandbox'
  | 'approval'
  | 'repo'
  | 'system'

export type FailureKind =
  | 'symptom'
  | 'root_cause'
  | 'distractor'
  | 'repair_rule'
  | 'risk'

export type MeterInterpretation = 'risk' | 'mastery' | 'coverage' | 'quality'
