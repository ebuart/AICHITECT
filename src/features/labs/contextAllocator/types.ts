// Allocator mechanic (MECH-ALLOCATE, control/07 LR-002). Distribute a finite budget
// across categories under scarcity. There is no single right answer — the learner is
// graded on DIRECTION (proximity to a good region) plus hard constraints, and the
// feedback names the trade-off they made.

export interface AllocItem {
  id: string
  label: string
  note: string
  /** Consequence of giving this too MUCH of the budget. */
  overText: string
  /** Consequence of giving this too LITTLE. */
  underText: string
}

export interface AllocRubric {
  /** Target share (%) per item; should sum to ~100. */
  ideal: Record<string, number>
  /** Hard floor: this item must keep at least this share (%). */
  min?: Record<string, number>
  /** Hard ceiling: this item must not exceed this share (%). */
  max?: Record<string, number>
  /** Band (± %) around ideal that still counts as on-target. */
  tolerance?: number
}

export interface AllocScenarioData {
  situation: string
  /** Display label for the pool, e.g. "8.000 Tokens". */
  budget: string
  items: AllocItem[]
  rubric: AllocRubric
}

/** Raw weight per item (0..100); only the RELATIVE split is scored. */
export type Allocation = Record<string, number>

/** Normalized share (%) per item from raw weights. */
export function shares(items: AllocItem[], alloc: Allocation): Record<string, number> {
  const total = items.reduce((s, i) => s + Math.max(0, alloc[i.id] ?? 0), 0)
  if (total <= 0) return Object.fromEntries(items.map((i) => [i.id, 0]))
  return Object.fromEntries(
    items.map((i) => [i.id, (Math.max(0, alloc[i.id] ?? 0) / total) * 100]),
  )
}
