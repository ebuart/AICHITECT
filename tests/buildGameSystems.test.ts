import { describe, it, expect } from 'vitest'
import {
  EVENTS,
  MISSIONS,
  activeSynergies,
  applyMissions,
  builtCount,
  canPrestige,
  deriveStats,
  doPrestige,
  handleEvent,
  initialGame,
  tick,
  triggeredEvent,
  type GameState,
} from '@/features/buildgame/gameModel'

describe('build-sim systems: synergies / missions / events', () => {
  it('a synergy grants a bonus beyond the individual skill effects', () => {
    const base = initialGame()
    const onlyRag: GameState = { ...base, levels: { ...base.levels, rag: 1 } }
    const ragGround: GameState = { ...base, levels: { ...base.levels, rag: 1, groundingEval: 1 } }
    expect(activeSynergies(ragGround).some((s) => s.label === 'Grounded RAG')).toBe(true)
    // groundingEval gives +4 quality; the synergy adds another +4 → diff ≥ 8
    const diff = deriveStats(ragGround).quality - deriveStats(onlyRag).quality
    expect(diff).toBeGreaterThanOrEqual(8)
  })

  it('missions auto-grant their reward once the goal is met', () => {
    const s: GameState = { ...initialGame(), budget: 0, levels: { charter: 1, soloDev: 1, keywordSearch: 1, embeddings: 1 } }
    expect(builtCount(s)).toBeGreaterThanOrEqual(3)
    const after = applyMissions(s)
    expect(after.missionsDone).toContain('m-build3')
    expect(after.budget).toBe(25) // m-build3 reward
    // idempotent: re-applying doesn't grant it twice
    expect(applyMissions(after).budget).toBe(25)
  })

  it('every mission predicate is callable and the catalog is non-trivial', () => {
    expect(MISSIONS.length).toBeGreaterThanOrEqual(8)
    for (const m of MISSIONS) expect(typeof m.done(initialGame())).toBe('boolean')
  })

  it('a neglected branch surfaces an event bubble during play; handling it avoids the penalty', () => {
    const weak: GameState = { ...initialGame(), day: 6 } // base security < 28, no injectionDefense
    expect(triggeredEvent(weak)?.id).toBe('injection')
    // running the clock spawns the bubble (day % EVENT_CHECK === 0 at day 8), then handling clears it free
    let s = weak
    for (let i = 0; i < 4 && s.events.length === 0; i++) s = tick(s).state
    expect(s.events.some((e) => e.id === 'injection')).toBe(true)
    const budgetBefore = s.budget
    s = handleEvent(s, 'injection')
    expect(s.events.length).toBe(0)
    expect(s.budget).toBe(budgetBefore) // mitigated → no money lost
  })

  it('prestige unlocks at 5 clean releases and grants a permanent legacy bonus', () => {
    const fresh = initialGame()
    expect(canPrestige(fresh)).toBe(false)
    const ready: GameState = { ...fresh, cleanReleases: 5 }
    expect(canPrestige(ready)).toBe(true)
    const baseQuality = deriveStats(fresh).quality
    const after = doPrestige(ready)
    expect(after.prestige).toBe(1)
    expect(after.cleanReleases).toBe(0) // reset
    expect(deriveStats(after).quality).toBe(baseQuality + 3) // +3 legacy per prestige
  })

  it('events do not fire for a healthy system', () => {
    const healthy: GameState = {
      ...initialGame(),
      releases: 0,
      drift: 5,
      debt: 5,
      scale: 0,
      trust: 50,
      levels: { charter: 3, soloDev: 1, inputValidation: 2, leastPrivilege: 2, injectionDefense: 1 },
    }
    expect(triggeredEvent(healthy)).toBeNull()
    expect(EVENTS.length).toBeGreaterThan(0)
  })
})
