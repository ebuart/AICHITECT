# /source_material/visuals/31_visual_component_contracts.md

STATUS: VISUAL_DOC  
LOAD_PRIORITY: WHEN_BUILDING_VISUAL_COMPONENTS  
PURPOSE: Define reusable visual component contracts and expected props.

## CONTRACT_RULES

[VCC-001] Components here are contracts, not final implementation details.
[VCC-002] Prefer typed props and deterministic rendering.
[VCC-003] Every component must support mobile.
[VCC-004] Every complex component must support compact mode.
[VCC-005] Every component with interaction must expose selected/disabled/warning states.
[VCC-006] Do not add new complex visual component without adding to VISUAL_QA_LOG.md.
[VCC-007] Keep rendering separate from scenario scoring logic.

## COMMON_TYPES

```ts
type VisualState =
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

type VisualDensity = 'compact' | 'normal' | 'dense'

type VisualSize = 'mobile' | 'tablet' | 'desktop'

type LayerId =
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
```

## COMPONENT_CONTRACTS

### VIS-SystemNode

PURPOSE:
- Render one system component in architecture diagrams.

USED_BY:
- Architecture Builder
- Augmented LLM Map
- Orchestrator-Worker
- Retrieval Pipeline

PROPS:
```ts
type SystemNodeProps = {
  id: string
  label: string
  kind: 'model' | 'agent' | 'subagent' | 'tool' | 'retrieval' | 'memory' | 'eval' | 'human' | 'guardrail' | 'repo' | 'workflow' | 'storage'
  state?: VisualState
  layer?: LayerId
  badges?: string[]
  description?: string
  compact?: boolean
  onSelect?: (id: string) => void
}
```

RULES:
- label truncates safely.
- details available via drawer/popover.
- state not color-only.
- must work in fixed slots.

### VIS-SystemEdge

PURPOSE:
- Render connection between system nodes.

PROPS:
```ts
type SystemEdgeProps = {
  id: string
  from: string
  to: string
  label?: string
  kind: 'data' | 'control' | 'tool_call' | 'retrieval' | 'memory_write' | 'eval_feedback' | 'approval' | 'risk'
  state?: VisualState
  direction?: 'one_way' | 'two_way'
}
```

RULES:
- complex diagrams may render edges as numbered connection list on mobile.
- risky edges must show explanation access.
- do not rely on arrow direction only if label is important.

### VIS-LayerStack

PURPOSE:
- Show system layers and map concepts/failures to layers.

PROPS:
```ts
type LayerStackProps = {
  layers: {
    id: LayerId
    label: string
    role: string
    state?: VisualState
    items?: string[]
  }[]
  highlightedLayerId?: LayerId
  compact?: boolean
}
```

RULES:
- max 8 visible layers before grouping.
- mobile = vertical cards.
- supports failure highlight.

### VIS-BoundaryBox

PURPOSE:
- Show trust, permission, or system boundary.

PROPS:
```ts
type BoundaryBoxProps = {
  id: string
  label: string
  kind: 'trust' | 'permission' | 'context' | 'sandbox' | 'approval' | 'repo' | 'system'
  state?: VisualState
  children?: React.ReactNode
  rules?: string[]
}
```

RULES:
- boundary label always visible.
- nested boundaries allowed only if still readable.
- use compact summary for mobile.

### VIS-TokenBudgetBar

PURPOSE:
- Show finite token/context budget and risk.

PROPS:
```ts
type TokenBudgetBarProps = {
  usedTokens: number
  maxTokens: number
  segments?: {
    id: string
    label: string
    tokens: number
    state?: VisualState
  }[]
  noiseRisk?: number
  missingContextRisk?: number
  compact?: boolean
}
```

RULES:
- show numbers and percentage.
- risk not color-only.
- overflow state explicit.

### VIS-TraceTimeline

PURPOSE:
- Show execution trace with events and failure markers.

PROPS:
```ts
type TraceTimelineProps = {
  events: {
    id: string
    step: number
    actor: string
    title: string
    detail?: string
    tags?: string[]
    state?: VisualState
  }[]
  selectedEventId?: string
  onSelect?: (id: string) => void
  compact?: boolean
}
```

RULES:
- mobile = one-column timeline.
- expanded event shows detail.
- failure_origin and symptom visually distinct.

### VIS-DecisionCard

PURPOSE:
- Show selectable architecture decision/action.

PROPS:
```ts
type DecisionCardProps = {
  id: string
  title: string
  description?: string
  tradeoffs?: string[]
  state?: VisualState
  disabledReason?: string
  onSelect?: (id: string) => void
}
```

RULES:
- show disabled reason if disabled.
- support selected and weak/strong choice states.
- avoid long text; use detail expansion.

### VIS-FailureModeCard

PURPOSE:
- Show symptom, cause, failure mode, or repair rule.

PROPS:
```ts
type FailureModeCardProps = {
  id: string
  label: string
  kind: 'symptom' | 'root_cause' | 'distractor' | 'repair_rule' | 'risk'
  layer?: LayerId
  state?: VisualState
  explanation?: string
}
```

RULES:
- must show kind and layer.
- root cause vs symptom distinction must be clear.

### VIS-ScoreMeter

PURPOSE:
- Show score/mastery/risk dimension.

PROPS:
```ts
type ScoreMeterProps = {
  id: string
  label: string
  value: number
  max: number
  interpretation?: 'risk' | 'mastery' | 'coverage' | 'quality'
  compact?: boolean
}
```

RULES:
- show label and numeric/semantic interpretation.
- do not create dopamine-heavy XP feeling.

### VIS-CompactFallbackView

PURPOSE:
- Provide readable fallback when complex visual is too dense.

PROPS:
```ts
type CompactFallbackViewProps = {
  title: string
  summary: string
  items: {
    id: string
    label: string
    detail?: string
    state?: VisualState
  }[]
}
```

RULES:
- every complex diagram should be convertible into this or equivalent.
- fallback must preserve learning objective.

### VIS-PaperFigureRecreation

PURPOSE:
- Render simplified original educational diagram inspired by research/source visual.

PROPS:
```ts
type PaperFigureRecreationProps = {
  id: string
  conceptId: string
  sourceAnchor: string
  title: string
  components: {
    id: string
    label: string
    role: string
    state?: VisualState
  }[]
  flows?: {
    from: string
    to: string
    label?: string
  }[]
  appliesWhen: string[]
  doesNotApplyWhen: string[]
  compact?: boolean
}
```

RULES:
- must not copy original figure.
- must include practical applicability.
- must support full-screen/mobile detail mode.

## DIAGRAM_CONTAINER_CONTRACTS

### VIS-DiagramShell

PURPOSE:
- Standard container for all diagrams.

PROPS:
```ts
type DiagramShellProps = {
  title: string
  subtitle?: string
  legend?: string[]
  children: React.ReactNode
  compactFallback?: React.ReactNode
  qaId?: string
}
```

RULES:
- title always visible.
- legend optional but required for non-obvious states.
- compact fallback available for complex children.

### VIS-VisualLabCase

PURPOSE:
- Wrap visual QA examples.

PROPS:
```ts
type VisualLabCaseProps = {
  id: string
  componentName: string
  testState: 'short' | 'long_labels' | 'dense' | 'empty' | 'mobile' | 'desktop' | 'warning' | 'fallback'
  notes?: string
  children: React.ReactNode
}
```

RULES:
- internal route only.
- used to update VISUAL_QA_LOG.md.

## INTERACTION_BINDINGS

[VCC-100] Context Budget Board requires:
- VIS-TokenBudgetBar
- VIS-DecisionCard
- VIS-CompactFallbackView

[VCC-101] Agent Trace Debugger requires:
- VIS-TraceTimeline
- VIS-FailureModeCard
- VIS-BoundaryBox

[VCC-102] Architecture Builder requires:
- VIS-SystemNode
- VIS-SystemEdge
- VIS-BoundaryBox
- VIS-CompactFallbackView

[VCC-103] Tool Contract Forge requires:
- VIS-BoundaryBox
- VIS-DecisionCard
- VIS-ScoreMeter

[VCC-104] Retrieval Factory requires:
- VIS-SystemNode
- VIS-SystemEdge
- VIS-LayerStack
- VIS-ScoreMeter

[VCC-105] Eval Designer requires:
- VIS-ScoreMeter
- VIS-DecisionCard
- VIS-LayerStack

[VCC-106] Repo Refactor Lab requires:
- VIS-LayerStack
- VIS-DecisionCard
- VIS-FailureModeCard

[VCC-107] Security Incident Room requires:
- VIS-BoundaryBox
- VIS-TraceTimeline
- VIS-FailureModeCard

[VCC-108] Paper Figure Decoder requires:
- VIS-PaperFigureRecreation
- VIS-SystemNode
- VIS-SystemEdge

## IMPLEMENTATION_NOTES

[VCC-200] Build components in `/src/components/visuals`.
[VCC-201] Do not put scoring logic inside visual components.
[VCC-202] Visual components emit selection/action events only.
[VCC-203] Feature/lab logic interprets actions.
[VCC-204] Content config provides labels/data.
[VCC-205] Keep visual primitives framework-light and reusable.
