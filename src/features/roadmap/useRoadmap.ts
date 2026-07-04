import { useMemo } from 'react'
import type { NodeStatus, RoadmapArc, RoadmapNode, RoadmapNodeId } from '@/types'
import { roadmapGraph } from '@/content/roadmap'
import { useProgress } from '@/features/progress/useProgress'
import {
  computeNodeStatuses,
  findCurrentNode,
  missingPrerequisites,
} from './roadmapStatus'

export interface RoadmapNodeView {
  node: RoadmapNode
  status: NodeStatus
  missing: string[]
}

export interface RoadmapArcView {
  arc: RoadmapArc
  nodes: RoadmapNodeView[]
  completed: number
}

export interface RoadmapView {
  ready: boolean
  arcs: RoadmapArcView[]
  statuses: Record<RoadmapNodeId, NodeStatus>
  currentNode: RoadmapNode | null
  completedCount: number
  total: number
}

// Derives the full roadmap view-model from graph data + persisted progress.
// Memoized on progress so cards don't recompute needlessly.
export function useRoadmap(): RoadmapView {
  const { state, ready } = useProgress()

  return useMemo(() => {
    const statuses = computeNodeStatuses(roadmapGraph, state)

    const arcs: RoadmapArcView[] = roadmapGraph.arcs.map((arc) => {
      const nodes = roadmapGraph.nodes
        .filter((node) => node.arcId === arc.id)
        .sort((a, b) => a.order - b.order)
        .map<RoadmapNodeView>((node) => ({
          node,
          status: statuses[node.id] ?? 'locked',
          missing: missingPrerequisites(node, roadmapGraph, state),
        }))
      const completed = nodes.filter((n) => n.status === 'completed').length
      return { arc, nodes, completed }
    })

    const completedCount = Object.values(statuses).filter(
      (s) => s === 'completed',
    ).length

    return {
      ready,
      arcs,
      statuses,
      currentNode: findCurrentNode(roadmapGraph, state),
      completedCount,
      total: roadmapGraph.nodes.length,
    }
  }, [state, ready])
}
