import type { ProgressState } from '@/types/progress'

// Persistence boundary (BP-005, QG-070..QG-074).
// UI and feature logic MUST go through this interface — never touch
// LocalStorage / IndexedDB / Supabase directly. This lets us swap the
// backend (LocalStorage -> IndexedDB -> Supabase) without rewriting app logic.
//
// PHASE_0: interface + a thin LocalStorage placeholder only.
// Supabase is deferred until the local adapter is stable (PC-053, NG-064).
export interface StorageAdapter {
  /** Stable identifier for diagnostics / migration. */
  readonly name: string

  /** Load progress. Must fail safe to a valid empty state (QG-073). */
  loadProgress(): Promise<ProgressState>

  /** Persist the full progress snapshot. */
  saveProgress(state: ProgressState): Promise<void>

  /** Remove all persisted progress (e.g. reset flow). */
  clearProgress(): Promise<void>
}
