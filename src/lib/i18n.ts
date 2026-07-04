import { useSyncExternalStore } from 'react'

// App-chrome locale (DE default ↔ EN). Mirrors the useTheme pattern: persisted in
// localStorage, applied to <html lang> before first paint, no provider needed — a tiny
// external store keeps every subscribed component in sync.
//
// SCOPE (DEC-0015): this translates the app CHROME (nav, header, home, common controls).
// Lesson/lab CONTENT stays German-first; an English content pass rolls out arc by arc on
// top of this mechanism. When locale is 'en', content surfaces show a German-first notice.
export type Locale = 'de' | 'en'
const KEY = 'flightdeck.locale'

export function readStoredLocale(): Locale {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'de'
  } catch {
    return 'de'
  }
}

export function applyLocale(l: Locale): void {
  document.documentElement.lang = l
}

/** Apply the persisted locale before React renders (correct <html lang> from first paint). */
export function initLocale(): void {
  applyLocale(readStoredLocale())
}

let current: Locale = 'de'
let initialized = false
const listeners = new Set<() => void>()

function snapshot(): Locale {
  if (!initialized) {
    current = readStoredLocale()
    initialized = true
  }
  return current
}

export function setLocale(l: Locale): void {
  current = l
  initialized = true
  applyLocale(l)
  try {
    localStorage.setItem(KEY, l)
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void; toggle: () => void } {
  const locale = useSyncExternalStore(subscribe, snapshot, () => 'de' as Locale)
  return { locale, setLocale, toggle: () => setLocale(locale === 'de' ? 'en' : 'de') }
}

// ---------------------------------------------------------------------------
// Chrome strings. `en` is typed against `de`, so a missing translation is a
// compile error — the dictionaries cannot drift apart silently.
const de = {
  navBuild: 'Werft',
  navRoadmap: 'Roadmap',
  navReview: 'Review',
  navVisualLab: 'Visual Lab',
  navAria: 'Hauptnavigation',
  themeToLight: 'Zu Hellmodus wechseln',
  themeToDark: 'Zu Dunkelmodus wechseln',
  themeLight: 'Hell',
  themeDark: 'Dunkel',
  localeAria: 'Switch app language to English',
  homeWelcome: 'Willkommen',
  homeTagline:
    'Dein geführter Weg zu AI Engineering und AI-native System Architecture. Folge der Roadmap Schritt für Schritt — jede Node baut auf der vorherigen auf.',
  homeProgress: (done: number, total: number) => `${done} von ${total} Nodes abgeschlossen`,
  homeNext: (title: string) => `Als Nächstes: ${title}`,
  homeAllDone: 'Alle Nodes abgeschlossen 🎉',
  homeContinue: 'Weiterlernen',
  homeStart: 'Roadmap starten',
  contentNotice: '',
  exCheck: 'Prüfen',
  exCorrect: 'Richtig. ',
  exWrong: 'Daneben. ',
  exWrongPick: 'Falsch gewählt. ',
  exMissed: 'Verpasst. ',
  lessonComplete: 'Lektion abschließen',
  lessonAnswerAll: 'Beantworte alle Übungen, um abzuschließen',
  lessonDecideAll: 'Triff jede Entscheidung, um abzuschließen',
}

const en: typeof de = {
  navBuild: 'Shipyard',
  navRoadmap: 'Roadmap',
  navReview: 'Review',
  navVisualLab: 'Visual Lab',
  navAria: 'Main navigation',
  themeToLight: 'Switch to light mode',
  themeToDark: 'Switch to dark mode',
  themeLight: 'Light',
  themeDark: 'Dark',
  localeAria: 'App-Sprache auf Deutsch umstellen',
  homeWelcome: 'Welcome',
  homeTagline:
    'Your guided path to AI engineering and AI-native system architecture. Follow the roadmap step by step — every node builds on the previous one.',
  homeProgress: (done: number, total: number) => `${done} of ${total} nodes completed`,
  homeNext: (title: string) => `Up next: ${title}`,
  homeAllDone: 'All nodes completed 🎉',
  homeContinue: 'Continue learning',
  homeStart: 'Start the roadmap',
  contentNotice:
    'Lessons and labs are currently German-first — an English translation is rolling out arc by arc.',
  exCheck: 'Check',
  exCorrect: 'Correct. ',
  exWrong: 'Not quite. ',
  exWrongPick: 'Wrong pick. ',
  exMissed: 'Missed. ',
  lessonComplete: 'Complete lesson',
  lessonAnswerAll: 'Answer every exercise to complete',
  lessonDecideAll: 'Make every decision to complete',
}

const STRINGS: Record<Locale, typeof de> = { de, en }

/** Current locale's chrome strings, reactive. Usage: `const t = useStrings(); t.homeWelcome`. */
export function useStrings(): typeof de {
  return STRINGS[useLocale().locale]
}

/** Non-reactive access (for code outside React). */
export function strings(locale: Locale): typeof de {
  return STRINGS[locale]
}
