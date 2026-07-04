import { describe, it, expect } from 'vitest'
import { roadmapGraph } from '@/content/roadmap'
import { firstLessonForNode } from '@/content/lessons'
import { labById, labs } from '@/content/labs/labs'
import { allScenarios, interactionRegistry } from '@/features/labs/interactionRegistry'
import { EMPTY_PROGRESS_STATE } from '@/types'
import { withNodeStatus } from '@/features/progress/progressMutations'
import { findCurrentNode, isNodeCompleted } from '@/features/roadmap/roadmapStatus'

// PHASE_9 hardening (PH-1001): content-coverage + roadmap-completion QA. Locks in the
// finished V1 curriculum and catches any future gap or broken unlock edge.

// Node ids that a registered lab scenario completes (scenario.roadmapNodeId).
const nodesWithBoundScenario = new Set(allScenarios.map((s) => s.roadmapNodeId))

describe('curriculum coverage (PH-1001)', () => {
  it('every roadmap node is completable via a lesson or a bound lab scenario', () => {
    const uncovered = roadmapGraph.nodes.filter(
      (n) => !firstLessonForNode(n.id) && !nodesWithBoundScenario.has(n.id),
    )
    expect(uncovered.map((n) => n.id)).toEqual([])
  })

  it('every node lab binding references a real catalog lab', () => {
    for (const node of roadmapGraph.nodes) {
      for (const labId of node.labIds) {
        expect(labById[labId], `${node.id} -> ${labId}`).toBeDefined()
      }
    }
  })

  it('every catalog lab has a registered interaction engine (OQ-0009 resolved)', () => {
    const engineless = labs.filter((lab) => !interactionRegistry[lab.interactionType])
    expect(engineless.map((l) => l.id)).toEqual([])
  })
})

describe('roadmap completion QA (PH-1001)', () => {
  it('the full graph is traversable end-to-end (no unreachable node)', () => {
    let progress = EMPTY_PROGRESS_STATE
    let guard = 0
    // Repeatedly complete the first actionable node; a fully-connected unlock graph
    // drains every node. An orphan/broken prerequisite would stall the loop early.
    for (;;) {
      const node = findCurrentNode(roadmapGraph, progress)
      if (!node) break
      progress = withNodeStatus(progress, node.id, 'completed')
      if (++guard > roadmapGraph.nodes.length + 5) throw new Error('unlock loop did not terminate')
    }
    const completed = roadmapGraph.nodes.filter((n) => isNodeCompleted(n.id, progress))
    expect(completed).toHaveLength(roadmapGraph.nodes.length)
  })

  it('exactly one node is available on empty progress (a single entry point)', () => {
    const available = roadmapGraph.nodes.filter(
      (n) => n.prerequisites.length === 0,
    )
    expect(available).toHaveLength(1)
    expect(findCurrentNode(roadmapGraph, EMPTY_PROGRESS_STATE)?.id).toBe(available[0].id)
  })
})
