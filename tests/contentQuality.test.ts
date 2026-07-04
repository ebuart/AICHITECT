import { describe, it, expect } from 'vitest'
import { allScenarios } from '@/features/labs/interactionRegistry'

// Executable guardrail for the challenge-quality rules (control/07 LR-011a + LR-011b,
// AGENT_LEARNING_LOG ALL-0002/0003). The user's repeated feedback: challenges must feel
// like TryHackMe, not a quiz — so a wrong option may never give itself away. These tests
// turn that from a documented intention into a CI failure, so a future scenario can't
// quietly reintroduce a lazy distractor or a verdict-announcing label.

/** Collect every string leaf in a scenario's data (labels, notes, rationales, …). */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out))
  else if (value && typeof value === 'object')
    Object.values(value).forEach((v) => strings(v, out))
  return out
}

// LR-011a: model-size / prompt-length are almost never the real cause — banned as filler
// distractors. The trade-off duel is the ONE legitimate place model size is the lesson.
const LAZY_FILLER =
  /modell zu (klein|gross|groß)|gr(ö|oe)(ss|ß)eres modell|kleineres modell|prompt zu (kurz|lang)/i
const TRADE_OFF_LAB = 'LAB-TRADE-OFF-DUEL'

// LR-011b: hedge words that announce "this option is the weak one" by form, letting the
// learner pass by pattern-matching instead of reasoning.
const HEDGE_GIVEAWAY = /irgendwie|auf gut Glück|sicherheitshalber/i

// LR-011c: casual-strawman / AI-slop tells. A distractor phrased like this is a caricature
// nobody picks — a free win, not a challenge. Catches the crude cases mechanically; the
// subtler "too obvious" judgment stays a human/playtest gate (OQ-0012).
const SLOP_PHRASE = /du weißt schon|siehst es,? wenn du es siehst|keine Ahnung|einfach mal machen|wird schon (gut|klappen|passen|gehen|reichen)/i

describe('challenge content quality (LR-011a/LR-011b)', () => {
  it('no scenario uses a lazy model-size / prompt-length filler distractor (LR-011a)', () => {
    const offenders: string[] = []
    for (const s of allScenarios) {
      if (s.labId === TRADE_OFF_LAB) continue
      for (const text of strings(s.scenarioData)) {
        if (LAZY_FILLER.test(text)) offenders.push(`${s.id}: "${text}"`)
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('no option label announces its own verdict by hedge wording (LR-011b)', () => {
    const offenders: string[] = []
    for (const s of allScenarios) {
      for (const text of strings(s.scenarioData)) {
        if (HEDGE_GIVEAWAY.test(text)) offenders.push(`${s.id}: "${text}"`)
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('no scenario uses casual-strawman / AI-slop phrasing (LR-011c)', () => {
    const offenders: string[] = []
    for (const s of allScenarios) {
      for (const text of strings(s.scenarioData)) {
        if (SLOP_PHRASE.test(text)) offenders.push(`${s.id}: "${text}"`)
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('every scenario carries real content (id + prompt + non-empty data)', () => {
    for (const s of allScenarios) {
      expect(s.id, 'scenario id').toBeTruthy()
      expect(s.prompt.length, `${s.id} prompt`).toBeGreaterThan(0)
      expect(strings(s.scenarioData).length, `${s.id} data`).toBeGreaterThan(0)
    }
  })
})

// The same guardrails for LESSON exercises (the bespoke-exercise redesign moved most
// challenge content out of lab scenarios into lesson blocks — the guard must follow it).
// Scanned surfaces are the CHOICE texts a learner reads before answering (option/item/
// line/step/pair texts and labels) — NOT `why`/`takeaway`/notes, which legitimately name
// the banned patterns while teaching ("the fix is not a bigger model").
import { lessons } from '@/content/lessons'
import { lessonExercises } from '@/features/lessons/lessonModel'

/** Collect learner-facing choice surfaces from an exercise (keys: text/left/right/label). */
function choiceSurfaces(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => choiceSurfaces(v, out))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' && (k === 'text' || k === 'left' || k === 'right' || k === 'label'))
        out.push(v)
      else choiceSurfaces(v, out)
    }
  }
  return out
}

describe('lesson exercise quality (LR-011a/b/c over lesson blocks)', () => {
  // Formats where lines ARE the material to critique (find the vague/injected/bad one):
  // a hedgy or sloppy line there is the intended target, not a giveaway answer option.
  const MATERIAL_FORMATS = new Set(['spot', 'multispot', 'annotate', 'diff'])
  const surfaces = lessons.flatMap((l) =>
    lessonExercises(l)
      .filter((e) => !MATERIAL_FORMATS.has(e.format))
      .flatMap((e) => choiceSurfaces(e).map((text) => ({ lesson: l.id, text }))),
  )

  it('covers a substantial exercise corpus (sanity: the collector actually finds content)', () => {
    expect(surfaces.length).toBeGreaterThan(300)
  })

  it('no lesson choice uses a lazy model-size / prompt-length filler distractor (LR-011a)', () => {
    const offenders = surfaces.filter((s) => LAZY_FILLER.test(s.text))
    expect(offenders.map((o) => `${o.lesson}: "${o.text}"`), offenders.map((o) => o.text).join('\n')).toEqual([])
  })

  it('no lesson choice announces its own verdict by hedge wording (LR-011b)', () => {
    const offenders = surfaces.filter((s) => HEDGE_GIVEAWAY.test(s.text))
    expect(offenders.map((o) => `${o.lesson}: "${o.text}"`), offenders.map((o) => o.text).join('\n')).toEqual([])
  })

  it('no lesson choice uses casual-strawman / AI-slop phrasing (LR-011c)', () => {
    const offenders = surfaces.filter((s) => SLOP_PHRASE.test(s.text))
    expect(offenders.map((o) => `${o.lesson}: "${o.text}"`), offenders.map((o) => o.text).join('\n')).toEqual([])
  })
})
