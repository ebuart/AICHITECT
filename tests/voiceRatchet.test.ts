import { describe, it, expect } from 'vitest'
import { globSync, readFileSync } from 'node:fs'

// Voice ratchet (control/10 VX-E1). These are measurable machine-tells in learner-facing
// content. The ceilings are the CURRENT counts: new content cannot raise them, and every
// arc rewrite lowers them. Numbers only ever go down — update the ceiling when you rewrite.
//
// Baseline 2026-07-05 (after the ARC-00/01 voice pass + impersonal-register sweep):
//   em-dash " — "                          711
//   "Genau …" why-openers                   16
//   maxim-shaped takeaways                  66
//   conversational du-forms (VX-B1)        109

const CEILINGS = {
  emDash: 711,
  genauOpeners: 16,
  maximTakeaways: 66,
  duForms: 109,
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

  it(`conversational du-forms in learner strings stay at or below ${CEILINGS.duForms} (VX-B1)`, () => {
    const strings = body.match(/(?:stem|takeaway|why|text|title|intro|note):\s*'(?:[^'\\]|\\.)*'/g) ?? []
    const du = /\b(du|dir|dich|dein|deine|deinem|deinen|deiner|deins)\b/gi
    const count = strings.reduce((n, s) => n + (s.match(du)?.length ?? 0), 0)
    expect(count).toBeLessThanOrEqual(CEILINGS.duForms)
  })
})
