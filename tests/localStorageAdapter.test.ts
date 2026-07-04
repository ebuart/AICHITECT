import { describe, it, expect, beforeEach } from 'vitest'
import {
  createLocalStorageAdapter,
  PROGRESS_STORAGE_KEY,
} from '@/lib/storage/localStorageAdapter'
import { withNodeStatus } from '@/features/progress/progressMutations'
import { EMPTY_PROGRESS_STATE } from '@/types'

describe('localStorage adapter (QG-073 fail-safe)', () => {
  beforeEach(() => localStorage.clear())

  it('returns empty state when nothing is stored', async () => {
    const adapter = createLocalStorageAdapter()
    const loaded = await adapter.loadProgress()
    expect(loaded.roadmap).toEqual({})
    expect(loaded.version).toBe(EMPTY_PROGRESS_STATE.version)
  })

  it('round-trips a saved snapshot', async () => {
    const adapter = createLocalStorageAdapter()
    const state = withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed')
    await adapter.saveProgress(state)
    const loaded = await adapter.loadProgress()
    expect(loaded.roadmap['NODE-00-01'].status).toBe('completed')
  })

  it('fails safe to empty state on corrupt JSON', async () => {
    const adapter = createLocalStorageAdapter()
    await adapter.saveProgress(EMPTY_PROGRESS_STATE)
    localStorage.setItem(PROGRESS_STORAGE_KEY, '{ not valid json')
    const loaded = await adapter.loadProgress()
    expect(loaded.roadmap).toEqual({})
  })

  it('clearProgress removes persisted state', async () => {
    const adapter = createLocalStorageAdapter()
    await adapter.saveProgress(
      withNodeStatus(EMPTY_PROGRESS_STATE, 'NODE-00-01', 'completed'),
    )
    await adapter.clearProgress()
    const loaded = await adapter.loadProgress()
    expect(loaded.roadmap).toEqual({})
  })
})
