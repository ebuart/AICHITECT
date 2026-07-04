import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExerciseView } from '@/features/lessons/ExerciseView'
import type { Exercise } from '@/features/lessons/lessonModel'

// Drives EACH bespoke mechanic from a minimal fixture through its canonical interaction to
// the point it reports completion (onAnswered). The lesson smoke test only renders; this
// exercises the answer/reveal logic of all 11 puzzle mechanics so a runtime bug in any one
// is caught. Completion wiring (onAnswered fires exactly once with the exercise id) is the
// contract LessonView depends on to gate the "finish" CTA.
function mount(ex: Exercise) {
  const onAnswered = vi.fn()
  render(<ExerciseView exercise={ex} onAnswered={onAnswered} />)
  return onAnswered
}

describe('bespoke exercise mechanics — interaction → completion', () => {
  it('pick: choosing an option answers + reveals', () => {
    const a = mount({
      id: 'p',
      format: 'pick',
      stem: 'S',
      options: [
        { id: 'a', text: 'OPT-A', correct: true, why: 'because A' },
        { id: 'b', text: 'OPT-B', correct: false, why: 'because B' },
      ],
    })
    fireEvent.click(screen.getByText('OPT-A'))
    expect(a).toHaveBeenCalledWith('p')
    expect(screen.getByText(/because A/)).toBeTruthy()
  })

  it('multi: select + Prüfen answers', () => {
    const a = mount({
      id: 'm',
      format: 'multi',
      stem: 'S',
      options: [
        { id: 'a', text: 'OPT-A', correct: true, why: 'w' },
        { id: 'b', text: 'OPT-B', correct: false, why: 'w' },
      ],
    })
    fireEvent.click(screen.getByText('OPT-A'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('m')
  })

  it('spot: tapping the attack line answers', () => {
    const a = mount({
      id: 's',
      format: 'spot',
      stem: 'S',
      lines: [
        { id: 'l1', text: 'CLEAN', note: 'n' },
        { id: 'l2', text: 'ATTACK', isAttack: true, note: 'n' },
      ],
    })
    fireEvent.click(screen.getByText('ATTACK'))
    expect(a).toHaveBeenCalledWith('s')
  })

  it('order: Prüfen answers', () => {
    const a = mount({
      id: 'o',
      format: 'order',
      stem: 'S',
      items: [
        { id: 'i1', text: 'one' },
        { id: 'i2', text: 'two' },
        { id: 'i3', text: 'three' },
      ],
    })
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('o')
  })

  it('categorize: assign all then Prüfen answers', () => {
    const a = mount({
      id: 'c',
      format: 'categorize',
      stem: 'S',
      buckets: [
        { id: 'a', label: 'BUCKET-A' },
        { id: 'b', label: 'BUCKET-B' },
      ],
      items: [
        { id: 'i1', text: 'item-one', bucketId: 'a', why: 'w' },
        { id: 'i2', text: 'item-two', bucketId: 'a', why: 'w' },
      ],
    })
    // each item renders a BUCKET-A button; assign both
    screen.getAllByText('BUCKET-A').forEach((b) => fireEvent.click(b))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('c')
  })

  it('match: link every left then Prüfen answers', () => {
    const a = mount({
      id: 'mt',
      format: 'match',
      stem: 'S',
      pairs: [
        { id: 'p1', left: 'LEFT-1', right: 'RIGHT-1', why: 'w' },
        { id: 'p2', left: 'LEFT-2', right: 'RIGHT-2', why: 'w' },
      ],
    })
    fireEvent.click(screen.getByText('LEFT-1'))
    fireEvent.click(screen.getByText('RIGHT-1')) // unique right chip before linking
    fireEvent.click(screen.getByText('LEFT-2'))
    fireEvent.click(screen.getByText('RIGHT-2'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('mt')
  })

  it('cloze: fill every blank then Prüfen answers', () => {
    const a = mount({
      id: 'cl',
      format: 'cloze',
      stem: 'S',
      blanks: [
        {
          id: 'b1',
          label: 'slot',
          options: [
            { id: 'o1', text: 'FILL-OK', correct: true, why: 'w' },
            { id: 'o2', text: 'FILL-NO', correct: false, why: 'w' },
          ],
        },
      ],
    })
    fireEvent.click(screen.getByText('FILL-OK'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('cl')
  })

  it('stepwise: verdict each step then Prüfen answers', () => {
    const a = mount({
      id: 'sw',
      format: 'stepwise',
      stem: 'S',
      verdicts: [
        { id: 'ok', label: 'VERD-OK' },
        { id: 'no', label: 'VERD-NO' },
      ],
      steps: [
        { id: 's1', text: 'step one', verdictId: 'ok', why: 'w' },
        { id: 's2', text: 'step two', verdictId: 'ok', why: 'w' },
      ],
    })
    screen.getAllByText('VERD-OK').forEach((b) => fireEvent.click(b))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('sw')
  })

  it('multispot: select + Prüfen answers', () => {
    const a = mount({
      id: 'ms',
      format: 'multispot',
      stem: 'S',
      lines: [
        { id: 'l1', text: 'CLEAN', note: 'n' },
        { id: 'l2', text: 'BAD-1', isAttack: true, note: 'n' },
        { id: 'l3', text: 'BAD-2', isAttack: true, note: 'n' },
      ],
    })
    fireEvent.click(screen.getByText('BAD-1'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('ms')
  })

  it('budget: feasible default + Prüfen answers', () => {
    const a = mount({
      id: 'bg',
      format: 'budget',
      stem: 'S',
      total: 10,
      step: 1,
      items: [
        { id: 'i1', label: 'item-1', min: 0, max: 10 },
        { id: 'i2', label: 'item-2', min: 0, max: 10 },
      ],
    })
    // starts at min (0,0) → not over the cap → Prüfen enabled
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('bg')
  })

  it('threshold: Prüfen answers', () => {
    const a = mount({
      id: 'th',
      format: 'threshold',
      stem: 'S',
      min: 0,
      max: 100,
      step: 5,
      samples: [
        { id: 's1', label: 'low', value: 10, keep: false },
        { id: 's2', label: 'high', value: 90, keep: true },
      ],
    })
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('th')
  })

  it('contradiction: pick a line in A and B then Prüfen answers', () => {
    const a = mount({
      id: 'ct',
      format: 'contradiction',
      stem: 'S',
      sourceA: [
        { id: 'a1', text: 'A-ONE' },
        { id: 'a2', text: 'A-TWO' },
      ],
      sourceB: [
        { id: 'b1', text: 'B-ONE' },
        { id: 'b2', text: 'B-TWO' },
      ],
      conflict: { a: 'a1', b: 'b1' },
      why: 'w',
    })
    fireEvent.click(screen.getByText('A-ONE'))
    fireEvent.click(screen.getByText('B-ONE'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('ct')
  })

  it('diff: tapping the bad changed line answers', () => {
    const a = mount({
      id: 'df',
      format: 'diff',
      stem: 'S',
      lines: [
        { id: 'd1', text: 'context', sign: ' ' },
        { id: 'd2', text: 'BAD-CHANGE', sign: '+', bad: true, note: 'n' },
        { id: 'd3', text: 'ok-change', sign: '+', note: 'n' },
      ],
    })
    fireEvent.click(screen.getByText('BAD-CHANGE'))
    expect(a).toHaveBeenCalledWith('df')
  })

  it('compose: add a block then Prüfen answers', () => {
    const a = mount({
      id: 'cp',
      format: 'compose',
      stem: 'S',
      pool: [
        { id: 'c1', text: 'BLOCK-1', correct: true },
        { id: 'c2', text: 'BLOCK-2', correct: true },
        { id: 'c3', text: 'DISTRACT', correct: false },
      ],
      orderedCorrect: ['c1', 'c2'],
    })
    fireEvent.click(screen.getByText('BLOCK-1')) // pool chip → adds to build
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('cp')
  })

  it('annotate: tap a flagged segment + Prüfen answers + reveals category', () => {
    const a = mount({
      id: 'an',
      format: 'annotate',
      stem: 'S',
      legend: [{ label: 'Erfundene Präzision', hint: 'zu exakte Zahlen ohne Quelle' }],
      segments: [
        { id: 'g1', text: 'Der Bericht sieht solide aus.' },
        {
          id: 'g2',
          text: 'Die Conversion stieg um exakt 47,3 %.',
          flag: { category: 'Erfundene Präzision', why: 'Keine Quelle für die Nachkommastelle.', fix: 'Spanne + Quelle angeben.' },
        },
        { id: 'g3', text: 'Wir sollten den Test wiederholen.' },
      ],
    })
    fireEvent.click(screen.getByText('Die Conversion stieg um exakt 47,3 %.'))
    fireEvent.click(screen.getByText('Prüfen'))
    expect(a).toHaveBeenCalledWith('an')
    expect(screen.getAllByText(/Erfundene Präzision/).length).toBeGreaterThan(0)
  })
})
