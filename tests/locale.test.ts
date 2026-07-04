import { describe, it, expect, beforeEach } from 'vitest'
import { applyLocale, readStoredLocale, setLocale, strings } from '@/lib/i18n'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.lang = ''
})

describe('locale (DE default ↔ EN chrome)', () => {
  it('defaults to German when nothing is stored', () => {
    expect(readStoredLocale()).toBe('de')
  })

  it('reads a stored English preference', () => {
    localStorage.setItem('flightdeck.locale', 'en')
    expect(readStoredLocale()).toBe('en')
  })

  it('applyLocale drives the html lang attribute (a11y + translation hints)', () => {
    applyLocale('en')
    expect(document.documentElement.lang).toBe('en')
    applyLocale('de')
    expect(document.documentElement.lang).toBe('de')
  })

  it('setLocale persists and applies in one step', () => {
    setLocale('en')
    expect(localStorage.getItem('flightdeck.locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    setLocale('de')
  })

  it('every chrome string exists in both languages and differs where a translation is expected', () => {
    const de = strings('de')
    const en = strings('en')
    // Same keys by construction (typed) — spot-check the translation actually happened.
    expect(en.homeWelcome).not.toBe(de.homeWelcome)
    expect(en.navAria).not.toBe(de.navAria)
    expect(en.homeProgress(3, 54)).toContain('of')
    expect(de.homeProgress(3, 54)).toContain('von')
    // EN carries the German-first content notice; DE needs none.
    expect(en.contentNotice.length).toBeGreaterThan(0)
    expect(de.contentNotice).toBe('')
  })
})
