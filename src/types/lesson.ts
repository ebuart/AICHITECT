// Lesson presentation modes. Superset of PH-402's required four, extended with
// the mode names used by the curriculum graph (domain/11_curriculum_graph.md).
export type LessonMode =
  | 'term-first'
  | 'task-first'
  | 'worked-trace-first'
  | 'multiple-viewpoints'
  | 'trade-off-first'
  | 'architecture-builder'
  | 'constraint-puzzle'
  | 'trace-first'
  | 'incident-first'
  | 'scenario-first'
  | 'eval-first'
  | 'postmortem'
  | 'worked-example'
  | 'refactor-first'
  | 'paper-figure-decoder'

// Interaction engine identifiers (engines themselves arrive in PHASE_4).
export type InteractionType =
  | 'none'
  | 'context-budget-board'
  | 'agent-trace-debugger'
  | 'architecture-builder'
  | 'failure-mode-tree'
  | 'tool-contract-forge'
  | 'trade-off-duel'
  | 'layer-stack-builder'
  | 'constraint-puzzle'
  | 'retrieval-factory'
  | 'eval-designer'
  | 'repo-refactor-lab'
  | 'security-incident-room'
  | 'paper-figure-decoder'
  | 'system-postmortem'
  | 'capstone-simulator'
  | 'context-allocator'
  | 'trust-boundary'
  | 'incident-triage'
  | 'pipeline-builder'

// NOTE: the full data-driven Lesson contract (metadata per BP-033 + content
// blocks per lesson grammar) lives in `@/features/lessons/lessonModel`, since it
// references visual-component prop types. This module stays a leaf (modes only).
