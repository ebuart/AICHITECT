import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  EMPTY_PROGRESS_STATE,
  type LessonId,
  type NodeStatus,
  type ProgressState,
  type RoadmapNodeId,
} from '@/types'
import { getStorageAdapter } from '@/lib/storage'
import {
  resetProgress,
  withLabCompleted,
  withLessonCompleted,
  withNodeStatus,
} from './progressMutations'

export interface ProgressContextValue {
  state: ProgressState
  /** False until the first async load from storage resolves. */
  ready: boolean
  setNodeStatus: (nodeId: RoadmapNodeId, status: NodeStatus) => void
  completeNode: (nodeId: RoadmapNodeId) => void
  completeLesson: (lessonId: LessonId, nodeId: RoadmapNodeId) => void
  completeLab: (
    labId: string,
    nodeId: RoadmapNodeId,
    score: number,
    weakSignals: string[],
  ) => void
  resetAll: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

const adapter = getStorageAdapter()

// Single source of truth for persisted progress. UI mutates via the exposed
// actions; persistence happens through the storage adapter only (QG-071).
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS_STATE)
  const [ready, setReady] = useState(false)

  // Load once on mount; fail-safe handled inside the adapter (QG-073).
  useEffect(() => {
    let active = true
    void adapter.loadProgress().then((loaded) => {
      if (!active) return
      setState(loaded)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  // Persist on every change after the initial load.
  useEffect(() => {
    if (ready) void adapter.saveProgress(state)
  }, [state, ready])

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      setNodeStatus: (nodeId, status) =>
        setState((prev) => withNodeStatus(prev, nodeId, status)),
      completeNode: (nodeId) =>
        setState((prev) => withNodeStatus(prev, nodeId, 'completed')),
      completeLesson: (lessonId, nodeId) =>
        setState((prev) => withLessonCompleted(prev, lessonId, nodeId)),
      completeLab: (labId, nodeId, score, weakSignals) =>
        setState((prev) => withLabCompleted(prev, labId, nodeId, score, weakSignals)),
      resetAll: () => setState(resetProgress()),
    }),
    [state, ready],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}
