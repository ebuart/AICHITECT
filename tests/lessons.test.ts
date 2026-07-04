import { describe, it, expect } from 'vitest'
import { lessons, firstLessonForNode } from '@/content/lessons'
import { roadmapGraph } from '@/content/roadmap'
import { lessonDecisions, lessonExercises } from '@/features/lessons/lessonModel'
import { withLessonCompleted } from '@/features/progress/progressMutations'
import { computeNodeStatus } from '@/features/roadmap/roadmapStatus'
import { EMPTY_PROGRESS_STATE } from '@/types'


describe('lesson content integrity (LG-300)', () => {
  it('every lesson binds to a real node with real prerequisites', () => {
    for (const l of lessons) {
      expect(roadmapGraph.nodeById[l.roadmapNodeId], l.id).toBeDefined()
      for (const p of l.prerequisites) {
        expect(roadmapGraph.nodeById[p], `${l.id} -> ${p}`).toBeDefined()
      }
    }
  })

  it('lesson prerequisites match their node prerequisites', () => {
    for (const l of lessons) {
      const node = roadmapGraph.nodeById[l.roadmapNodeId]
      expect([...l.prerequisites].sort()).toEqual([...node.prerequisites].sort())
    }
  })

  it('each decision (where present) has a best option, an alternative, and a takeaway (QG-045/046)', () => {
    // Lessons increasingly delegate the challenge to a bound mechanic lab (LR-051), so a
    // lesson need not contain a decision — the rollout's terminal state is zero classic
    // decisions. No count floor: we only validate that any decision still present is
    // well-formed and carries a concise takeaway (summary or consequence, LR-040).
    for (const l of lessons) {
      for (const d of lessonDecisions(l)) {
        const ids = d.options.map((o) => o.id)
        expect(ids, `${l.id}:${d.id}`).toContain(d.bestOptionId)
        expect(d.options.length).toBeGreaterThanOrEqual(2)
        for (const o of d.options) {
          const takeaway = o.feedback.summary ?? o.feedback.consequence
          expect(takeaway?.length ?? 0, `${l.id}:${o.id} takeaway`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('every bespoke exercise is well-formed across all mechanics (LR-011d)', () => {
    const ok = (s: string | undefined) => (s?.length ?? 0) > 0
    for (const l of lessons) {
      for (const ex of lessonExercises(l)) {
        const tag = `${l.id}:${ex.id}`
        expect(ex.stem.length, `${tag} stem`).toBeGreaterThan(0)
        switch (ex.format) {
          case 'pick':
          case 'multi': {
            const correct = ex.options.filter((o) => o.correct).length
            if (ex.format === 'pick') expect(correct, `${tag} one correct`).toBe(1)
            else {
              expect(correct, `${tag} >=1 correct`).toBeGreaterThanOrEqual(1)
              expect(correct, `${tag} not all correct`).toBeLessThan(ex.options.length)
            }
            for (const o of ex.options)
              expect(ok(o.text) && ok(o.why), `${tag}:${o.id} text+why`).toBe(true)
            break
          }
          case 'spot':
            expect(ex.lines.filter((x) => x.isAttack).length, `${tag} exactly one attack`).toBe(1)
            break
          case 'multispot':
            expect(ex.lines.filter((x) => x.isAttack).length, `${tag} >=1 attack`).toBeGreaterThanOrEqual(1)
            break
          case 'order':
            expect(ex.items.length, `${tag} >=2 items`).toBeGreaterThanOrEqual(2)
            for (const it of ex.items) expect(ok(it.text), `${tag}:${it.id} text`).toBe(true)
            break
          case 'categorize': {
            expect(ex.buckets.length, `${tag} >=2 buckets`).toBeGreaterThanOrEqual(2)
            expect(ex.items.length, `${tag} >=2 items`).toBeGreaterThanOrEqual(2)
            const ids = new Set(ex.buckets.map((b) => b.id))
            for (const it of ex.items)
              expect(ids.has(it.bucketId), `${tag}:${it.id} bucket exists`).toBe(true)
            break
          }
          case 'match':
            expect(ex.pairs.length, `${tag} >=2 pairs`).toBeGreaterThanOrEqual(2)
            for (const p of ex.pairs)
              expect(ok(p.left) && ok(p.right), `${tag}:${p.id} left+right`).toBe(true)
            break
          case 'cloze':
            expect(ex.blanks.length, `${tag} >=1 blank`).toBeGreaterThanOrEqual(1)
            for (const b of ex.blanks) {
              expect(b.options.filter((o) => o.correct).length, `${tag}:${b.id} one correct`).toBe(1)
              for (const o of b.options)
                expect(ok(o.text) && ok(o.why), `${tag}:${b.id}:${o.id} text+why`).toBe(true)
            }
            break
          case 'stepwise': {
            expect(ex.verdicts.length, `${tag} >=2 verdicts`).toBeGreaterThanOrEqual(2)
            expect(ex.steps.length, `${tag} >=2 steps`).toBeGreaterThanOrEqual(2)
            const vids = new Set(ex.verdicts.map((v) => v.id))
            for (const s of ex.steps)
              expect(vids.has(s.verdictId), `${tag}:${s.id} verdict exists`).toBe(true)
            break
          }
          case 'budget': {
            expect(ex.items.length, `${tag} >=2 items`).toBeGreaterThanOrEqual(2)
            let lo = 0
            let hi = 0
            for (const it of ex.items) {
              expect(it.min, `${tag}:${it.id} min<=max`).toBeLessThanOrEqual(it.max)
              lo += it.min
              hi += it.max
            }
            // a feasible allocation must exist within the cap
            expect(lo, `${tag} sum(min)<=total`).toBeLessThanOrEqual(ex.total)
            expect(hi, `${tag} total<=sum(max)`).toBeGreaterThanOrEqual(ex.total)
            break
          }
          case 'threshold': {
            expect(ex.min, `${tag} min<max`).toBeLessThan(ex.max)
            const keep = ex.samples.filter((s) => s.keep).map((s) => s.value)
            const drop = ex.samples.filter((s) => !s.keep).map((s) => s.value)
            expect(keep.length > 0 && drop.length > 0, `${tag} both classes`).toBe(true)
            // separable: a cutoff exists that admits all keeps and rejects all drops
            expect(Math.max(...drop), `${tag} separable`).toBeLessThan(Math.min(...keep))
            break
          }
          case 'contradiction':
            expect(ex.sourceA.length, `${tag} A>=2`).toBeGreaterThanOrEqual(2)
            expect(ex.sourceB.length, `${tag} B>=2`).toBeGreaterThanOrEqual(2)
            expect(ex.sourceA.some((x) => x.id === ex.conflict.a), `${tag} conflict.a in A`).toBe(true)
            expect(ex.sourceB.some((x) => x.id === ex.conflict.b), `${tag} conflict.b in B`).toBe(true)
            break
          case 'diff':
            expect(ex.lines.filter((x) => x.bad).length, `${tag} exactly one bad`).toBe(1)
            break
          case 'compose': {
            expect(ex.orderedCorrect.length, `${tag} >=2 ordered`).toBeGreaterThanOrEqual(2)
            const poolIds = new Set(ex.pool.map((b) => b.id))
            for (const id of ex.orderedCorrect) {
              expect(poolIds.has(id), `${tag} ${id} in pool`).toBe(true)
              expect(ex.pool.find((b) => b.id === id)!.correct, `${tag} ${id} is correct`).toBe(true)
            }
            // must contain at least one distractor that belongs to no slot
            expect(ex.pool.length, `${tag} has distractors`).toBeGreaterThan(ex.orderedCorrect.length)
            break
          }
          case 'annotate': {
            expect(ex.segments.length, `${tag} >=2 segments`).toBeGreaterThanOrEqual(2)
            expect(ex.segments.filter((s) => s.flag).length, `${tag} >=1 flag`).toBeGreaterThanOrEqual(1)
            for (const s of ex.segments) expect(ok(s.text), `${tag}:${s.id} text`).toBe(true)
            break
          }
        }
      }
    }
  })

  it('covers the four required lesson modes (PH-402)', () => {
    const modes = new Set(lessons.map((l) => l.lessonMode))
    expect(modes.has('term-first')).toBe(true)
    expect(modes.has('task-first')).toBe(true)
    expect(modes.has('worked-trace-first')).toBe(true)
    expect(modes.has('multiple-viewpoints')).toBe(true)
  })

  it('firstLessonForNode resolves slice nodes only', () => {
    expect(firstLessonForNode('NODE-00-01')?.id).toBe('LESSON-00-01')
    expect(firstLessonForNode('NODE-99-99')).toBeUndefined()
  })
})

describe('lesson completion wiring', () => {
  it('completing a lesson completes its node and unlocks the dependent', () => {
    const next = withLessonCompleted(EMPTY_PROGRESS_STATE, 'LESSON-00-01', 'NODE-00-01')
    expect(next.lessons['LESSON-00-01'].completed).toBe(true)
    expect(computeNodeStatus(roadmapGraph.nodeById['NODE-00-01'], next)).toBe('completed')
    expect(computeNodeStatus(roadmapGraph.nodeById['NODE-00-02'], next)).toBe('available')
  })
})
