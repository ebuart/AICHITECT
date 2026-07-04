import { roadmapGraph } from '@/content/roadmap'
import { labById } from '@/content/labs/labs'
import { interactionRegistry } from '@/features/labs/interactionRegistry'
import {
  introScenario,
  transferScenario,
  type LabEngineEntry,
  type LabScenario,
} from '@/features/labs/interactionModel'
import type { RoadmapNodeId } from '@/types'

// Bridge from a completed node to a re-runnable tactical task (PHASE_7 deepening,
// PH-801/PH-804). Lives in the feature layer (touches the lab registry) so the
// pure reviewModel stays content/registry-free. Prefers the TRANSFER scenario —
// the changed-context variant — so review resurfaces the idea in a new context.
export interface ReviewMission {
  nodeId: RoadmapNodeId
  labId: string
  scenario: LabScenario
  isTransfer: boolean
  entry: LabEngineEntry
}

export function findMission(nodeId: RoadmapNodeId): ReviewMission | undefined {
  const node = roadmapGraph.nodeById[nodeId]
  if (!node) return undefined
  for (const labId of node.labIds) {
    const lab = labById[labId]
    const entry = lab ? interactionRegistry[lab.interactionType] : undefined
    if (!entry) continue
    const transfer = transferScenario(entry.scenarios, labId)
    const scenario = transfer ?? introScenario(entry.scenarios, labId)
    if (scenario) {
      return { nodeId, labId, scenario, isTransfer: scenario === transfer, entry }
    }
  }
  return undefined
}

/** True when a node has a registered lab engine with a runnable scenario. */
export function hasMission(nodeId: RoadmapNodeId): boolean {
  return findMission(nodeId) !== undefined
}
