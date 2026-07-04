// Build Campaign — a stateful "direct the whole build" strategy sim (the production capstone).
// Unlike the recognition exercises, the campaign carries STATE across stages: your decisions
// move meters (quality/security/scope), spend a finite oversight resource, and set flags that
// determine which later incident fires and the final scorecard. Early mistakes surface as late
// failures — the consequence loop is the point. All logic here is pure + unit-tested.

export type Meter = 'quality' | 'security' | 'scope'

export interface CampaignState {
  quality: number // 0–100 — reliability/correctness of the system
  security: number // 0–100 — containment/safety
  scope: number // 0–100 — how much of the product actually got delivered
  oversight: number // 0–100 — your finite attention, spent on thorough choices
  flags: string[] // accumulated conditions that branch later stages + the scorecard
}

export interface StageOption {
  id: string
  label: string
  detail?: string
  /** Oversight spent. If you can't afford it, the option is locked. */
  cost?: number
  effect?: Partial<Record<Meter, number>>
  addFlags?: string[]
  /** Consequence shown after choosing — the teaching lives here. */
  feedback: string
  /** The strong director move (drives the per-stage "well played" mark, not the gate). */
  ideal?: boolean
}

export interface Stage {
  id: string
  phase: string
  title: string
  brief: string
  options: StageOption[]
  /** Branching: the stage is only shown if this predicate over the current flags holds. */
  when?: (flags: readonly string[]) => boolean
}

export interface ScoreLine {
  tone: 'good' | 'bad'
  text: string
  /** Show this postmortem line only when the predicate holds for the final state. */
  when: (s: CampaignState) => boolean
}

export interface CampaignDef {
  id: string
  title: string
  product: string
  intro: string
  initial: CampaignState
  stages: Stage[]
  outcomes: ScoreLine[]
}

const clamp = (n: number) => Math.max(0, Math.min(100, n))

/** Apply a chosen option to the state (pure). Clamps meters, spends oversight, adds flags. */
export function applyOption(state: CampaignState, opt: StageOption): CampaignState {
  const next: CampaignState = { ...state, flags: [...state.flags] }
  if (opt.cost) next.oversight = clamp(next.oversight - opt.cost)
  for (const [k, v] of Object.entries(opt.effect ?? {})) {
    next[k as Meter] = clamp(next[k as Meter] + (v as number))
  }
  for (const f of opt.addFlags ?? []) if (!next.flags.includes(f)) next.flags.push(f)
  return next
}

export function canAfford(state: CampaignState, opt: StageOption): boolean {
  return (opt.cost ?? 0) <= state.oversight
}

const shown = (stage: Stage, flags: readonly string[]) => (stage.when ? stage.when(flags) : true)

/** Index of the next stage visible under the current flags, or -1 when the campaign is over. */
export function nextStageIndex(def: CampaignDef, fromIdx: number, flags: readonly string[]): number {
  for (let i = fromIdx; i < def.stages.length; i++) {
    if (shown(def.stages[i], flags)) return i
  }
  return -1
}

export interface Scorecard {
  letter: string
  verdict: string
  shipped: boolean
  lines: ScoreLine[]
}

/** Weakest-link scoring: a system is as good as its worst critical dimension. */
export function scorecard(def: CampaignDef, state: CampaignState): Scorecard {
  const composite = Math.round(0.4 * state.security + 0.4 * state.quality + 0.2 * state.scope)
  // A weak critical dimension caps the grade — you can't average your way past a security hole.
  const floor = Math.min(state.security, state.quality)
  const score = Math.min(composite, floor + 15)
  const lines = def.outcomes.filter((o) => o.when(state))

  let letter = 'F'
  if (score >= 85) letter = 'A'
  else if (score >= 72) letter = 'B'
  else if (score >= 58) letter = 'C'
  else if (score >= 45) letter = 'D'

  const shipped = score >= 58 && state.security >= 45
  const verdict = shipped
    ? 'Ausgeliefert — das System ist verlässlich und eingedämmt genug für Produktion.'
    : 'Nicht ausgeliefert — eine kritische Schwäche hätte in Produktion Schaden angerichtet.'
  return { letter, verdict, shipped, lines }
}
