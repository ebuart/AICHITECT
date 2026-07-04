import { describe, it, expect } from 'vitest'
import type { ProgressState, RoadmapNode } from '@/types'
import { buildReviewState, type ReviewDeps } from '@/features/review/reviewModel'

const DAY = 86_400_000
const NOW = Date.parse('2026-06-14T00:00:00.000Z')

function node(id: string, labIds: string[], conceptIds: string[]): RoadmapNode {
  return {
    id, arcId: 'ARC-X', order: 1, title: `Node ${id}`,
    purpose: '', outcome: '', conceptIds, prerequisites: [], unlocks: [],
    labIds: labIds as RoadmapNode['labIds'], lessonModes: ['task-first'],
  }
}

const nodeById: Record<string, RoadmapNode> = {
  A: node('A', ['LAB-A'], ['C-A']),
  B: node('B', ['LAB-B'], ['C-B']),
  C: node('C', [], ['C-C']),
  D: node('D', ['LAB-D'], ['C-D']),
}

const deps: ReviewDeps = {
  nodeById,
  reviewHooksForNode: (id) =>
    ({ A: ['theme_x', 'a_only'], B: ['b_only'], C: ['theme_x'], D: ['d_only'] })[id] ?? [],
}

function completedAt(daysAgo: number): string {
  return new Date(NOW - daysAgo * DAY).toISOString()
}

const progress: ProgressState = {
  version: 1,
  updatedAt: completedAt(0),
  roadmap: {
    A: { nodeId: 'A', status: 'completed', completedAt: completedAt(10) },
    B: { nodeId: 'B', status: 'completed', completedAt: completedAt(1) },
    C: { nodeId: 'C', status: 'completed', completedAt: completedAt(5) },
    D: { nodeId: 'D', status: 'available' }, // not completed → excluded
  },
  lessons: {},
  labs: {
    'LAB-A': { labId: 'LAB-A', completed: true, score: 1, weakSignals: [] },
    'LAB-B': { labId: 'LAB-B', completed: true, score: 0.5, weakSignals: ['vector_id'] },
  },
}

describe('buildReviewState (PHASE_7 review/mastery model)', () => {
  const review = buildReviewState(progress, deps, NOW)

  it('only includes completed nodes', () => {
    expect(review.items.map((i) => i.nodeId).sort()).toEqual(['A', 'B', 'C'])
  })

  it('classifies mastery from lab signals', () => {
    const byId = Object.fromEntries(review.items.map((i) => [i.nodeId, i.mastery]))
    expect(byId.A).toBe('practiced') // clean lab
    expect(byId.B).toBe('needs_repair') // weak signals + low score
    expect(byId.C).toBe('introduced') // lesson only, no lab
  })

  it('orders the queue by due-ness (age + repair bonus)', () => {
    // A: 10d, B: 1d + 7 repair = 8, C: 5d → A, B, C
    expect(review.queue.map((i) => i.nodeId)).toEqual(['A', 'B', 'C'])
  })

  it('surfaces weak areas as repair missions', () => {
    expect(review.repairs.map((i) => i.nodeId)).toEqual(['B'])
    expect(review.repairs[0].weakSignals).toContain('vector_id')
  })

  it('detects recurring themes across 2+ completed nodes', () => {
    const themeX = review.themes.find((t) => t.hook === 'theme_x')
    expect(themeX?.nodeIds.sort()).toEqual(['A', 'C'])
    expect(review.themes.some((t) => t.hook === 'a_only')).toBe(false) // single node
  })

  it('summarizes mastery counts', () => {
    expect(review.summary).toEqual({ total: 3, practiced: 1, introduced: 1, needsRepair: 1 })
  })

  it('is empty for fresh progress', () => {
    const empty = buildReviewState(
      { version: 1, updatedAt: '', roadmap: {}, lessons: {}, labs: {} },
      deps,
      NOW,
    )
    expect(empty.summary.total).toBe(0)
    expect(empty.queue).toHaveLength(0)
  })
})
