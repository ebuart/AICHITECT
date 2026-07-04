import type {
  NodeStatus,
  ProgressState,
  RoadmapGraph,
  RoadmapNode,
  RoadmapNodeId,
} from '@/types'

// Pure unlock logic (RD-001): a node is available only when every prerequisite
// is completed. Kept free of React/storage so it is trivially testable and
// reusable (BP-004, BP-009). Separated from rendering (QG-021).

export function isNodeCompleted(
  nodeId: RoadmapNodeId,
  progress: ProgressState,
): boolean {
  return progress.roadmap[nodeId]?.status === 'completed'
}

export function arePrerequisitesMet(
  node: RoadmapNode,
  progress: ProgressState,
): boolean {
  return node.prerequisites.every((id) => isNodeCompleted(id, progress))
}

/** Derive the display status for a single node from persisted progress. */
export function computeNodeStatus(
  node: RoadmapNode,
  progress: ProgressState,
): NodeStatus {
  const stored = progress.roadmap[node.id]?.status
  if (stored === 'completed') return 'completed'
  if (!arePrerequisitesMet(node, progress)) return 'locked'
  if (stored === 'in_progress') return 'in_progress'
  return 'available'
}

/** Derive statuses for every node in the graph. */
export function computeNodeStatuses(
  graph: RoadmapGraph,
  progress: ProgressState,
): Record<RoadmapNodeId, NodeStatus> {
  return Object.fromEntries(
    graph.nodes.map((node) => [node.id, computeNodeStatus(node, progress)]),
  )
}

/** First not-yet-completed node in sequence whose prerequisites are met. */
export function findCurrentNode(
  graph: RoadmapGraph,
  progress: ProgressState,
): RoadmapNode | null {
  for (const id of graph.sequence) {
    const node = graph.nodeById[id]
    if (!node) continue
    const status = computeNodeStatus(node, progress)
    if (status === 'available' || status === 'in_progress') return node
  }
  return null
}

/** Names of prerequisite nodes that are still incomplete (for locked previews). */
export function missingPrerequisites(
  node: RoadmapNode,
  graph: RoadmapGraph,
  progress: ProgressState,
): string[] {
  return node.prerequisites
    .filter((id) => !isNodeCompleted(id, progress))
    .map((id) => graph.nodeById[id]?.title ?? id)
}
