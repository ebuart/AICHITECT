import { describe, it, expect } from 'vitest'
import { ALL_ON, FLOW_TOGGLES, traceRequest } from '@/features/explorers/requestFlow/model'

const on = (...off: string[]) => {
  const s = new Set(ALL_ON)
  for (const id of off) s.delete(id)
  return s
}

// The failure mapping IS the lesson (control/10 IX-4): each missing layer must produce its
// characteristic, DIFFERENT incident. These assertions pin that pedagogy.
describe('RequestFlowExplorer trace model', () => {
  it('all layers on → grounded answer with source, no incident', () => {
    const t = traceRequest(on())
    expect(t.answer.verdict).toBe('good')
    expect(t.answer.text).toContain('8 %')
    expect(t.steps.every((s) => s.status === 'ok')).toBe(true)
  })

  it('no retrieval, check on → the check blocks the fabricated number (graceful degradation)', () => {
    const t = traceRequest(on('retrieval'))
    expect(t.answer.verdict).toBe('blocked')
    const check = t.steps.find((s) => s.station === 'check')!
    expect(check.status).toBe('fail')
  })

  it('no retrieval AND no check → the confident wrong answer reaches the user', () => {
    const t = traceRequest(on('retrieval', 'check'))
    expect(t.answer.verdict).toBe('bad')
    expect(t.answer.text).toContain('5 %')
  })

  it('no curation → wrong doc wins; the check passes it because grounded ≠ correct', () => {
    const t = traceRequest(on('curation'))
    expect(t.answer.verdict).toBe('bad')
    expect(t.answer.text).toContain('FAQ')
    const check = t.steps.find((s) => s.station === 'check')!
    expect(check.status).toBe('warn') // passed — that blind spot is the point
  })

  it('no tool gate → correct answer AND an incident (unasked CRM write)', () => {
    const t = traceRequest(on('toolgate'))
    expect(t.answer.verdict).toBe('bad')
    expect(t.answer.text).toContain('8 %')
    const gate = t.steps.find((s) => s.station === 'toolgate')!
    expect(gate.status).toBe('fail')
  })

  it('every toggle produces a distinct answer situation (no two failures look alike)', () => {
    const answers = FLOW_TOGGLES.map((tg) => traceRequest(on(tg.id)).answer)
    const keys = answers.map((a) => `${a.verdict}|${a.text}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
