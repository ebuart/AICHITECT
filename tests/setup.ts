import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom's localStorage is unavailable on an opaque origin in this setup, so we
// install a deterministic in-memory Web Storage polyfill. Keeps storage tests
// reliable regardless of environment quirks.
function createMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, String(value))
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    key: (index: number) => Array.from(map.keys())[index] ?? null,
  } as Storage
}

Object.defineProperty(globalThis, 'localStorage', {
  value: createMemoryStorage(),
  configurable: true,
  writable: true,
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
