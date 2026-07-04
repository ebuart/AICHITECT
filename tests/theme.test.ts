import { describe, it, expect, beforeEach } from 'vitest'
import { applyTheme, readStoredTheme } from '@/lib/useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('theme-light')
})

describe('theme (dark ↔ light inverse)', () => {
  it('defaults to dark when nothing is stored', () => {
    expect(readStoredTheme()).toBe('dark')
  })

  it('reads a stored light preference', () => {
    localStorage.setItem('flightdeck.theme', 'light')
    expect(readStoredTheme()).toBe('light')
  })

  it('applyTheme toggles the html.theme-light class that drives the inverse palette', () => {
    applyTheme('light')
    expect(document.documentElement.classList.contains('theme-light')).toBe(true)
    applyTheme('dark')
    expect(document.documentElement.classList.contains('theme-light')).toBe(false)
  })
})
