import { describe, it, expect } from 'vitest'
import { roadmapGraph } from '@/content/roadmap'
import {
  computeNodeStatus,
  computeNodeStatuses,
  findCurrentNode,
} from '@/features/roadmap/roadmapStatus'
import { withNodeStatus } from '@/features/progress/progressMutations'
import { EMPTY_PROGRESS_STATE } from '@/types'

const node = (id: string) => {
  const n = roadmapGraph.nodeById[id]
  if (!n) throw new Error(`missing test node ${id}`)
  return n
}

describe('roadmap unlock logic (RD-001)', () => {
  it('first node has no prerequisites and is available on empty progress', () => {
    expect(node('NODE-00-01').prerequisites).toHaveLength(0)
    expect(computeNodeStatus(node('NODE-00-01'), EMPTY_PROGRESS_STATE)).toBe(
      'available',
    )
  })

  it('a node with unmet prerequisites is locked', () => {
    expect(computeNodeStatus(node('NODE-00-02'), EMPTY_PROGRESS_STATE)).toBe(
      'locked',
    )
  })

  it('completing a prerequisite unlocks its dependent', () => {
    const progress = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    expect(computeNodeStatus(node('NODE-00-01'), progress)).toBe('completed')
    expect(computeNodeStatus(node('NODE-00-02'), progress)).toBe('available')
    // grandchild still locked
    expect(computeNodeStatus(node('NODE-01-01'), progress)).toBe('locked')
  })

  it('findCurrentNode returns the first actionable node', () => {
    expect(findCurrentNode(roadmapGraph, EMPTY_PROGRESS_STATE)?.id).toBe(
      'NODE-00-01',
    )
    const progress = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    expect(findCurrentNode(roadmapGraph, progress)?.id).toBe('NODE-00-02')
  })

  it('computes a status for every node in the graph', () => {
    const statuses = computeNodeStatuses(roadmapGraph, EMPTY_PROGRESS_STATE)
    expect(Object.keys(statuses)).toHaveLength(roadmapGraph.nodes.length)
    expect(roadmapGraph.nodes).toHaveLength(56) // 43 core + ARC-11 (4) + ARC-12 (3) + ARC-13 (4, incl. round-trip + Build Campaign)
  })
})

describe('roadmap graph integrity', () => {
  it('every prerequisite and unlock references a real node', () => {
    for (const n of roadmapGraph.nodes) {
      for (const p of n.prerequisites) {
        expect(roadmapGraph.nodeById[p], `${n.id} -> prereq ${p}`).toBeDefined()
      }
      for (const u of n.unlocks) {
        expect(roadmapGraph.nodeById[u], `${n.id} -> unlocks ${u}`).toBeDefined()
      }
    }
  })

  it('prerequisite and unlock edges are mutually consistent', () => {
    const prereqEdges = new Set<string>()
    const unlockEdges = new Set<string>()
    for (const n of roadmapGraph.nodes) {
      for (const p of n.prerequisites) prereqEdges.add(`${p}->${n.id}`)
      for (const u of n.unlocks) unlockEdges.add(`${n.id}->${u}`)
    }
    expect([...prereqEdges].sort()).toEqual([...unlockEdges].sort())
  })
})
