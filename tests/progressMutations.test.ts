import { describe, it, expect } from 'vitest'
import {
  resetProgress,
  withNodeStatus,
} from '@/features/progress/progressMutations'
import { EMPTY_PROGRESS_STATE } from '@/types'

describe('progress mutations', () => {
  it('withNodeStatus records status and sets currentNodeId', () => {
    const next = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'in_progress')
    expect(next.roadmap['NODE-00-01'].status).toBe('in_progress')
    expect(next.currentNodeId).toBe('NODE-00-01')
    expect(next.roadmap['NODE-00-01'].completedAt).toBeUndefined()
  })

  it('completing stamps completedAt', () => {
    const next = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    expect(next.roadmap['NODE-00-01'].status).toBe('completed')
    expect(next.roadmap['NODE-00-01'].completedAt).toBeTypeOf('string')
  })

  it('does not mutate the previous state', () => {
    const next = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    expect(EMPTY_PROGRESS_STATE.roadmap['NODE-00-01']).toBeUndefined()
    expect(next).not.toBe(EMPTY_PROGRESS_STATE)
  })

  it('resetProgress clears roadmap entries', () => {
    const filled = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    const reset = resetProgress()
    expect(Object.keys(filled.roadmap)).toHaveLength(1)
    expect(Object.keys(reset.roadmap)).toHaveLength(0)
    expect(reset.version).toBe(EMPTY_PROGRESS_STATE.version)
  })
})
