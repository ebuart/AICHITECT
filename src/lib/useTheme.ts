import { useEffect, useState } from 'react'

// Brutalist theme switch: dark (default, white-on-black) ↔ light (inverse, black-on-white).
// Light mode is driven entirely by `html.theme-light` in index.css (it re-points the white/black +
// deck-* CSS variables), so all we do here is toggle that class and persist the choice.
export type Theme = 'dark' | 'light'
const KEY = 'flightdeck.theme'

export function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(t: Theme): void {
  document.documentElement.classList.toggle('theme-light', t === 'light')
}

/** Apply the persisted theme before React renders, so there's no dark-mode flash on a light-mode load. */
export function initTheme(): void {
  applyTheme(readStoredTheme())
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}
