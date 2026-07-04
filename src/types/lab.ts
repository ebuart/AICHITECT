import type { ConceptId, LabId, RoadmapNodeId } from './ids'
import type { InteractionType } from './lesson'

// Lab catalog entry. Labs are config-driven (BP-031) and bound to roadmap nodes
// (PC-003). The interaction *engine* is implemented in PHASE_4.
export interface Lab {
  id: LabId
  title: string // English technical title
  introNodeId: RoadmapNodeId
  interactionType: InteractionType
  requiredConcepts: ConceptId[]
}

// Interaction contract (BP-034). Defined now as the durable shape; concrete
// scenarios + scoring engines are built in PHASE_4 (PH-500). Not yet instantiated.
export interface InteractionContract {
  id: string
  type: InteractionType
  requiredConcepts: ConceptId[]
  prompt: string
  validActions: string[]
  scoringLogicId: string
  feedbackRuleIds: string[]
  failureModeIds: string[]
  transferTargetId: string | null
}
