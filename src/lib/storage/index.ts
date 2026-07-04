import type { StorageAdapter } from './StorageAdapter'
import { createLocalStorageAdapter } from './localStorageAdapter'

export type { StorageAdapter } from './StorageAdapter'

let adapter: StorageAdapter | null = null

/**
 * Single access point for persistence. Swap the factory here when moving to
 * IndexedDB or a Supabase-backed adapter — call sites stay unchanged (PC-052).
 */
export function getStorageAdapter(): StorageAdapter {
  if (!adapter) adapter = createLocalStorageAdapter()
  return adapter
}
