import type { StorageAdapter } from './StorageAdapter'
import { EMPTY_PROGRESS_STATE, type ProgressState } from '@/types/progress'

export const PROGRESS_STORAGE_KEY = 'flightdeck.progress.v1'

// Local-first placeholder implementation (PHASE_0).
// Intentionally thin: real read/modify/write progress flows arrive in PHASE_1.
// Fails safe to EMPTY_PROGRESS_STATE on missing/corrupt data (QG-073).
export function createLocalStorageAdapter(): StorageAdapter {
  return {
    name: 'local-storage',

    async loadProgress(): Promise<ProgressState> {
      try {
        const raw = localStorage.getItem(PROGRESS_STORAGE_KEY)
        if (!raw) return EMPTY_PROGRESS_STATE
        const parsed = JSON.parse(raw) as ProgressState
        if (parsed?.version !== EMPTY_PROGRESS_STATE.version) {
          // Unknown/old schema — fail safe rather than crash.
          return EMPTY_PROGRESS_STATE
        }
        return parsed
      } catch {
        return EMPTY_PROGRESS_STATE
      }
    },

    async saveProgress(state: ProgressState): Promise<void> {
      const next: ProgressState = { ...state, updatedAt: new Date().toISOString() }
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next))
    },

    async clearProgress(): Promise<void> {
      localStorage.removeItem(PROGRESS_STORAGE_KEY)
    },
  }
}
