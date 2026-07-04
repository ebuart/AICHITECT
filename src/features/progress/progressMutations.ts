import {
  EMPTY_PROGRESS_STATE,
  type LessonId,
  type NodeStatus,
  type ProgressState,
  type RoadmapNodeId,
} from '@/types'

// Pure state transitions, separated from React/storage so they are testable
// and never mix UI concerns with persistence (BP-004, QG-021).

export function withNodeStatus(
  prev: ProgressState,
  nodeId: RoadmapNodeId,
  status: NodeStatus,
): ProgressState {
  const completedAt =
    status === 'completed'
      ? new Date().toISOString()
      : prev.roadmap[nodeId]?.completedAt
  return {
    ...prev,
    currentNodeId: nodeId,
    roadmap: {
      ...prev.roadmap,
      [nodeId]: { nodeId, status, completedAt },
    },
  }
}

// Completing a lesson marks the lesson done AND completes its roadmap node,
// which unlocks dependents on the next render (RD-001).
export function withLessonCompleted(
  prev: ProgressState,
  lessonId: LessonId,
  nodeId: RoadmapNodeId,
): ProgressState {
  const next = withNodeStatus(prev, nodeId, 'completed')
  return {
    ...next,
    lessons: {
      ...next.lessons,
      [lessonId]: {
        lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
      },
    },
  }
}

// Recording a lab result persists the lab (score + weak signals, LS-007) and
// completes its roadmap node — the tactical lab is the node's task.
export function withLabCompleted(
  prev: ProgressState,
  labId: string,
  nodeId: RoadmapNodeId,
  score: number,
  weakSignals: string[],
): ProgressState {
  const next = withNodeStatus(prev, nodeId, 'completed')
  const previousScore = prev.labs[labId]?.score ?? -1
  const best = Math.max(previousScore, score)
  return {
    ...next,
    labs: {
      ...next.labs,
      [labId]: {
        labId,
        completed: true,
        completedAt: new Date().toISOString(),
        score: best,
        weakSignals,
      },
    },
  }
}

export function resetProgress(): ProgressState {
  return { ...EMPTY_PROGRESS_STATE, updatedAt: new Date().toISOString() }
}
