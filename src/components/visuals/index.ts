// Barrel for the visual system. Import primitives from here.
export { SystemNode } from './primitives/SystemNode'
export { SystemEdge } from './primitives/SystemEdge'
export { LayerStack } from './primitives/LayerStack'
export { FlowStep } from './primitives/FlowStep'
export { BoundaryBox } from './primitives/BoundaryBox'
export { TokenBudgetBar } from './primitives/TokenBudgetBar'
export { TraceTimeline } from './primitives/TraceTimeline'
export { DecisionCard } from './primitives/DecisionCard'
export { FailureModeCard } from './primitives/FailureModeCard'
export { ScoreMeter } from './primitives/ScoreMeter'
export { CompactFallbackView } from './primitives/CompactFallbackView'
export { DiagramShell } from './DiagramShell'
export { VisualStateChip } from './VisualStateChip'

export type { SystemNodeProps } from './primitives/SystemNode'
export type { SystemEdgeProps } from './primitives/SystemEdge'
export type { LayerStackProps, LayerStackLayer } from './primitives/LayerStack'
export type { FlowStepProps } from './primitives/FlowStep'
export type { BoundaryBoxProps } from './primitives/BoundaryBox'
export type {
  TokenBudgetBarProps,
  TokenBudgetSegment,
} from './primitives/TokenBudgetBar'
export type { TraceTimelineProps, TraceEvent } from './primitives/TraceTimeline'
export type { DecisionCardProps } from './primitives/DecisionCard'
export type { FailureModeCardProps } from './primitives/FailureModeCard'
export type { ScoreMeterProps } from './primitives/ScoreMeter'
export type {
  CompactFallbackViewProps,
  CompactFallbackItem,
} from './primitives/CompactFallbackView'
export type { DiagramShellProps } from './DiagramShell'
