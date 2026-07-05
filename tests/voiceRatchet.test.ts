import { describe, it, expect } from 'vitest'
import { globSync, readFileSync } from 'node:fs'

// Voice ratchet (control/10 VX-E1). These are measurable machine-tells in learner-facing
// content. The ceilings are the CURRENT counts: new content cannot raise them, and every
// arc rewrite lowers them. Numbers only ever go down — update the ceiling when you rewrite.
//
// Baseline 2026-07-05 (after the ARC-00/01 voice pass):
//   em-dash " — "            729
//   "Genau …" why-openers     16
//   maxim-shaped takeaways    67

const CEILINGS = {
  emDash: 729,
  genauOpeners: 16,
  maximTakeaways: 67,
}

function contentBody(): string {
  const files = [
    ...globSync('src/content/lessons/*.ts'),
    ...globSync('src/content/lessons/en/*.ts'),
    ...globSync('src/content/labs/*.ts'),
  ]
  return files
    .map((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .filter((l) => !l.trim().startsWith('//'))
        .join('\n'),
    )
    .join('\n')
}

describe('voice ratchet — machine-tell counts may only go down (VX-E1)', () => {
  const body = contentBody()

  it(`em-dash cadence stays at or below ${CEILINGS.emDash}`, () => {
    const count = (body.match(/ — /g) ?? []).length
    expect(count).toBeLessThanOrEqual(CEILINGS.emDash)
  })

  it(`"Genau …" affirmation openers stay at or below ${CEILINGS.genauOpeners}`, () => {
    const count = (body.match(/why: '(?:„|")?Genau (das|dann|hier|die|der|damit|dieser)/g) ?? []).length
    expect(count).toBeLessThanOrEqual(CEILINGS.genauOpeners)
  })

  it(`maxim-shaped takeaways (aphorism with em-dash) stay at or below ${CEILINGS.maximTakeaways}`, () => {
    const count = (body.match(/takeaway: '[^']* — [^']*'/g) ?? []).length
    expect(count).toBeLessThanOrEqual(CEILINGS.maximTakeaways)
  })
})
