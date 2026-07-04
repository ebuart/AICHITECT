import { describe, it, expect } from 'vitest'
import { findMission, hasMission } from '@/features/review/reviewMission'

describe('findMission (PHASE_7 transfer resurfacing)', () => {
  it('resolves the transfer scenario for a node with a registered engine', () => {
    const m = findMission('NODE-00-01') // Failure Mode Tree
    expect(m?.labId).toBe('LAB-FAILURE-MODE-TREE')
    expect(m?.isTransfer).toBe(true)
    expect(m?.scenario.id).toBe('FMT-TRANSFER')
  })

  it('resolves the first bound lab with an engine (Pipeline Builder at NODE-05-01)', () => {
    const m = findMission('NODE-05-01') // labIds: [pipelineBuilder, retrievalFactory]
    expect(m?.labId).toBe('LAB-PIPELINE-BUILDER')
    expect(m?.scenario.id).toBe('PIPE-TRANSFER')
  })

  it('resolves a mission for a node whose lab engine now exists (OQ-0009)', () => {
    // NODE-00-02 binds layer-stack-builder, which now has an engine + scenario.
    expect(hasMission('NODE-00-02')).toBe(true)
  })

  it('returns undefined for an unknown node', () => {
    expect(findMission('NODE-NOPE')).toBeUndefined()
  })
})
