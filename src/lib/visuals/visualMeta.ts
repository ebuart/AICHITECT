import type {
  BoundaryKind,
  FailureKind,
  LayerId,
  SystemEdgeKind,
  SystemNodeKind,
} from '@/types/visual'

// Shape/label grammar (visuals/30_visual_system_spec.md SHAPE_MEANING). Kinds
// are distinguished by glyph + label, not color alone (VQA-SystemNode fail-if).

export const layerMeta: Record<LayerId, { label: string; short: string }> = {
  product: { label: 'User / Product Goal', short: 'Product' },
  app_logic: { label: 'Application Logic', short: 'App' },
  model_control: { label: 'Model / Agent Control', short: 'Model' },
  context: { label: 'Context', short: 'Context' },
  retrieval: { label: 'Retrieval', short: 'Retrieval' },
  memory: { label: 'Memory', short: 'Memory' },
  tools: { label: 'Tools / External Systems', short: 'Tools' },
  evals: { label: 'Evals', short: 'Evals' },
  observability: { label: 'Observability', short: 'Observe' },
  security: { label: 'Security / Governance', short: 'Security' },
  repo: { label: 'Repo / Team Process', short: 'Repo' },
  governance: { label: 'Governance', short: 'Govern' },
}

export const nodeKindMeta: Record<
  SystemNodeKind,
  { label: string; symbol: string }
> = {
  model: { label: 'Model', symbol: '◍' },
  agent: { label: 'Agent', symbol: '◎' },
  subagent: { label: 'Subagent', symbol: '◌' },
  tool: { label: 'Tool', symbol: '▣' },
  retrieval: { label: 'Retrieval', symbol: '⌕' },
  memory: { label: 'Memory', symbol: '▤' },
  eval: { label: 'Eval', symbol: '◴' },
  human: { label: 'Human', symbol: '☺' },
  guardrail: { label: 'Guardrail', symbol: '⛨' },
  repo: { label: 'Repo', symbol: '🗎' },
  workflow: { label: 'Workflow', symbol: '▤▸' },
  storage: { label: 'Storage', symbol: '⛁' },
}

export const edgeKindMeta: Record<
  SystemEdgeKind,
  { label: string; tone: 'neutral' | 'current' | 'warning' | 'danger'; dashed: boolean }
> = {
  data: { label: 'data', tone: 'neutral', dashed: false },
  control: { label: 'control', tone: 'current', dashed: false },
  tool_call: { label: 'tool call', tone: 'current', dashed: false },
  retrieval: { label: 'retrieval', tone: 'neutral', dashed: true },
  memory_write: { label: 'memory write', tone: 'neutral', dashed: true },
  eval_feedback: { label: 'eval feedback', tone: 'current', dashed: true },
  approval: { label: 'approval', tone: 'warning', dashed: false },
  risk: { label: 'risk', tone: 'danger', dashed: false },
}

export const boundaryKindMeta: Record<
  BoundaryKind,
  { label: string; symbol: string }
> = {
  trust: { label: 'Trust Boundary', symbol: '⛨' },
  permission: { label: 'Permission Boundary', symbol: '🔑' },
  context: { label: 'Context Boundary', symbol: '▭' },
  sandbox: { label: 'Sandbox', symbol: '⛶' },
  approval: { label: 'Approval Boundary', symbol: '✋' },
  repo: { label: 'Repo Boundary', symbol: '🗁' },
  system: { label: 'System Boundary', symbol: '▢' },
}

export const failureKindMeta: Record<
  FailureKind,
  { label: string; symbol: string; tone: 'danger' | 'warning' | 'neutral' | 'success' }
> = {
  symptom: { label: 'Symptom', symbol: '∿', tone: 'warning' },
  root_cause: { label: 'Fehlerursache', symbol: '✖', tone: 'danger' },
  distractor: { label: 'Ablenkung', symbol: '?', tone: 'neutral' },
  repair_rule: { label: 'Repair-Rule', symbol: '✓', tone: 'success' },
  risk: { label: 'Risiko', symbol: '!', tone: 'warning' },
}
