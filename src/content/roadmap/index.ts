import type { RoadmapGraph, RoadmapNode, RoadmapNodeId } from '@/types'
import { arcs } from './arcs'
import { nodes } from './nodes'

function buildNodeById(list: RoadmapNode[]): Record<RoadmapNodeId, RoadmapNode> {
  return Object.fromEntries(list.map((node) => [node.id, node]))
}

const nodeById = buildNodeById(nodes)

// Dev-only integrity checks: catch broken prerequisite references early rather
// than rendering a silently incoherent roadmap (QG-073 fail-safe philosophy).
if (import.meta.env.DEV) {
  for (const node of nodes) {
    for (const prereq of node.prerequisites) {
      if (!nodeById[prereq]) {
        console.error(
          `[roadmap] ${node.id} lists unknown prerequisite "${prereq}"`,
        )
      }
    }
  }
}

const sequence = [...nodes]
  .sort((a, b) => a.order - b.order)
  .map((node) => node.id)

export const roadmapGraph: RoadmapGraph = {
  arcs: [...arcs].sort((a, b) => a.order - b.order),
  nodes,
  nodeById,
  sequence,
}

export { arcs } from './arcs'
export { nodes } from './nodes'
