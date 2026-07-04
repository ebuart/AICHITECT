import { describe, it, expect } from 'vitest'
import { lessonById, lessonEnById, getLesson } from '@/content/lessons'
import { lessonExercises } from '@/features/lessons/lessonModel'

// EN lessons are parallel Lesson objects (DEC-0015/0016). This asserts a translation can
// only differ in TEXT — structure, exercise ids, option ids and correct-flags must mirror
// the German source, so the pedagogy (and the scoring) cannot drift silently.
describe('lesson translations mirror the German source', () => {
  const pairs = Object.entries(lessonEnById).map(([id, en]) => ({ id, en: en!, de: lessonById[id] }))

  it('at least the pilot arc is translated', () => {
    expect(pairs.length).toBeGreaterThanOrEqual(2)
  })

  it('every EN lesson points at an existing German lesson with identical wiring', () => {
    for (const { id, en, de } of pairs) {
      expect(de, `${id} has no German source`).toBeTruthy()
      expect(en.roadmapNodeId).toBe(de.roadmapNodeId)
      expect(en.prerequisites).toEqual(de.prerequisites)
      expect(en.blocks.length).toBe(de.blocks.length)
    }
  })

  it('exercise ids, option ids and correct-flags are identical across languages', () => {
    for (const { id, en, de } of pairs) {
      const enEx = lessonExercises(en)
      const deEx = lessonExercises(de)
      expect(enEx.map((e) => `${e.id}:${e.format}`), id).toEqual(deEx.map((e) => `${e.id}:${e.format}`))
      for (let i = 0; i < enEx.length; i++) {
        const a = enEx[i] as unknown as Record<string, unknown>
        const b = deEx[i] as unknown as Record<string, unknown>
        for (const key of ['options', 'items'] as const) {
          const av = a[key] as { id: string; correct?: boolean; bucketId?: string }[] | undefined
          const bv = b[key] as { id: string; correct?: boolean; bucketId?: string }[] | undefined
          if (!av || !bv) continue
          expect(av.map((o) => `${o.id}|${o.correct ?? ''}|${o.bucketId ?? ''}`), `${id} ${enEx[i].id} ${key}`).toEqual(
            bv.map((o) => `${o.id}|${o.correct ?? ''}|${o.bucketId ?? ''}`),
          )
        }
      }
    }
  })

  it('getLesson falls back to German for untranslated lessons and serves EN where present', () => {
    expect(getLesson('LESSON-00-01', 'en')).toBe(lessonEnById['LESSON-00-01'])
    expect(getLesson('LESSON-00-01', 'de')).toBe(lessonById['LESSON-00-01'])
    expect(getLesson('LESSON-13-03', 'en')).toBe(lessonById['LESSON-13-03'])
  })
})
