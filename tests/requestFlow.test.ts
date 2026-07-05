import { describe, it, expect } from 'vitest'
import { ALL_ON, EXPERIMENTS, FLOW_TOGGLES, traceRequest } from '@/features/explorers/requestFlow/model'

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

// Payloads are RAW traces (user 2026-07-05): facts, values, statuses — never the
// interpretation. Whether a value is outdated is answerable only via the dossier files;
// editorializing words in a payload would chew the diagnosis for the learner.
describe('payloads stay raw', () => {
  const EDITORIALIZING = /\balt\b|alte[rn]? wert|veraltet|klingt|falsch|richtig|rauschen|ging unter|trainingsstand/i
  it('no payload line interprets itself, in any toggle combination', () => {
    const combos: string[][] = []
    const ids = FLOW_TOGGLES.map((t) => t.id)
    for (let mask = 0; mask < 1 << ids.length; mask++)
      combos.push(ids.filter((_, i) => mask & (1 << i)))
    const offenders: string[] = []
    for (const combo of combos) {
      for (const s of traceRequest(new Set(combo)).steps) {
        for (const line of s.payload) {
          if (EDITORIALIZING.test(line)) offenders.push(`[${combo.join(',') || 'none'}] ${s.station}: "${line}"`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })
})

// The guided protocol must be internally consistent: each run's diagnostic target exists in
// its trace, and the trace's outcome matches the finding the board will show.
describe('guided experiment protocol', () => {
  it('has five runs, starting with the full-system baseline', () => {
    expect(EXPERIMENTS).toHaveLength(5)
    expect(new Set(EXPERIMENTS[0].active)).toEqual(new Set(ALL_ON))
  })

  it('every run primes attention (watch) and never spells out the target station in it', () => {
    for (const e of EXPERIMENTS) {
      expect(e.watch.length, `${e.id} watch`).toBeGreaterThan(20)
      const targetTitle = traceRequest(new Set(e.active)).steps.find((s) => s.station === e.target)!.title
      expect(e.watch.toLowerCase()).not.toContain(targetTitle.toLowerCase())
    }
  })

  it('every experiment target station exists and its verdict matches the trace', () => {
    for (const e of EXPERIMENTS) {
      const t = traceRequest(new Set(e.active))
      expect(t.steps.some((s) => s.station === e.target), `${e.id} target`).toBe(true)
      expect(t.answer.verdict, `${e.id} verdict`).toBe(e.verdict)
    }
  })

  it('diagnostic targets are live stations — except no-net, where the absence IS the answer', () => {
    for (const e of EXPERIMENTS) {
      const t = traceRequest(new Set(e.active))
      const target = t.steps.find((s) => s.station === e.target)!
      if (e.id === 'no-net') {
        // Run 5 asks which station could have stopped the fabricated number LAST — the
        // learner must tap the switched-off check. Two off stations exist in that run, so
        // it is not a giveaway.
        expect(target.status).toBe('off')
        expect(t.steps.filter((s) => s.status === 'off').length).toBeGreaterThan(1)
      } else {
        expect(target.status, `${e.id} target status`).not.toBe('off')
      }
    }
  })
})
