import type {
  ConceptId,
  LabId,
  RoadmapArcId,
  RoadmapNodeId,
} from './ids'
import type { LessonMode } from './lesson'

// Roadmap arc = a themed sequence of nodes (domain/11_curriculum_graph.md).
export interface RoadmapArc {
  id: RoadmapArcId
  order: number
  title: string // English technical title
  goal: string // German one-line goal
}

// A single roadmap node. Prerequisites drive unlock logic (RD-001); `unlocks`
// is kept for locked-node previews (RD-201) and is derivable from prerequisites.
export interface RoadmapNode {
  id: RoadmapNodeId
  arcId: RoadmapArcId
  order: number
  title: string // English technical title
  purpose: string // German one-line purpose (shown on locked/available cards)
  outcome: string // short learning outcome
  conceptIds: ConceptId[]
  prerequisites: RoadmapNodeId[]
  unlocks: RoadmapNodeId[]
  labIds: LabId[]
  lessonModes: LessonMode[]
}

// Assembled, validated graph consumed by the roadmap feature.
export interface RoadmapGraph {
  arcs: RoadmapArc[]
  nodes: RoadmapNode[]
  nodeById: Record<RoadmapNodeId, RoadmapNode>
  /** Stable linear order (domain/12_roadmap_dependencies.md ROADMAP_SEQUENCE). */
  sequence: RoadmapNodeId[]
}
