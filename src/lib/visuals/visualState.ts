import type { VisualState } from '@/types/visual'

// Maps visual state -> label + symbol + tone. State is always conveyed by an
// explicit chip (label + symbol), never color alone (VSS-101/102, VQA-031).

export type StateTone =
  | 'neutral'
  | 'current'
  | 'success'
  | 'warning'
  | 'danger'
  | 'locked'

export interface StateMeta {
  label: string
  symbol: string
  tone: StateTone
}

export const visualStateMeta: Record<VisualState, StateMeta> = {
  default: { label: 'Standard', symbol: '·', tone: 'neutral' },
  selected: { label: 'Ausgewählt', symbol: '◉', tone: 'current' },
  excluded: { label: 'Ausgeschlossen', symbol: '⊘', tone: 'neutral' },
  compressed: { label: 'Komprimiert', symbol: '≡', tone: 'neutral' },
  locked: { label: 'Gesperrt', symbol: '🔒', tone: 'locked' },
  unlocked: { label: 'Frei', symbol: '→', tone: 'current' },
  completed: { label: 'Fertig', symbol: '✓', tone: 'success' },
  warning: { label: 'Warnung', symbol: '!', tone: 'warning' },
  failure_origin: { label: 'Fehlerursache', symbol: '✖', tone: 'danger' },
  symptom: { label: 'Symptom', symbol: '∿', tone: 'warning' },
  strong_choice: { label: 'Stark', symbol: '★', tone: 'success' },
  weak_choice: { label: 'Schwach', symbol: '▽', tone: 'warning' },
  disabled: { label: 'Inaktiv', symbol: '∅', tone: 'neutral' },
}

// Tone -> Tailwind classes. `chip` for the state badge, `ring` for the host
// container border emphasis.
export const stateToneClasses: Record<
  StateTone,
  { chip: string; ring: string }
> = {
  neutral: {
    chip: 'border-deck-border bg-deck-surface-2 text-deck-muted',
    ring: 'border-deck-border',
  },
  current: {
    chip: 'border-deck-current/40 bg-deck-current/10 text-deck-current',
    ring: 'border-deck-current/60',
  },
  success: {
    chip: 'border-deck-success/40 bg-deck-success/10 text-deck-success',
    ring: 'border-deck-success/60',
  },
  warning: {
    chip: 'border-deck-warning/40 bg-deck-warning/10 text-deck-warning',
    ring: 'border-deck-warning/60',
  },
  danger: {
    chip: 'border-deck-danger/40 bg-deck-danger/10 text-deck-danger',
    ring: 'border-deck-danger/70',
  },
  locked: {
    chip: 'border-deck-locked/40 bg-deck-locked/10 text-deck-locked',
    ring: 'border-deck-locked/50',
  },
}

/** Container border class for a given state (default => no emphasis). */
export function stateRingClass(state: VisualState = 'default'): string {
  if (state === 'default') return 'border-deck-border'
  return stateToneClasses[visualStateMeta[state].tone].ring
}
