import { describe, it, expect } from 'vitest'
import { NODE_INFO, ZONE_INFO } from '@/features/buildgame/nodeInfo'
import { SKILL_QUEST } from '@/content/werft/questMap'
import {
  BUILDINGS,
  CHARTER,
  CHARTER_ID,
  PLACE_BONUS,
  ZONES,
  architectureScore,
  buildingById,
  buildingCost,
  buy,
  canBuy,
  canonicalZone,
  deriveResists,
  deriveStats,
  RELEASE_EVERY,
  initialGame,
  isCorrectlyPlaced,
  isPlaced,
  ownedUnplaced,
  placeNode,
  placementBonus,
  shipRelease,
  tick,
  tierOf,
  unplaceNode,
  type GameState,
} from '@/features/buildgame/gameModel'

const find = (id: string) => buildingById(id)!
const withBudget = (s: GameState, budget: number): GameState => ({ ...s, budget })
// These engine tests predate the quest gate; unlock everything so they exercise economy/placement
// (quest gating itself is covered in werftQuests.test.ts).
const learnAll = (s: GameState): GameState => ({ ...s, learned: Object.keys(SKILL_QUEST) })
const ids = new Set([CHARTER_ID, ...BUILDINGS.map((b) => b.id)])

describe('build-sim engine (pure logic)', () => {
  it('starts at tier 1 with the world variables seeded', () => {
    const s = initialGame()
    expect(tierOf(s)).toBe(1)
    expect(s.levels.soloDev).toBe(1)
    expect(s.scale).toBe(0)
    expect(s.drift).toBeGreaterThan(0)
    expect(s.budget).toBeGreaterThan(0)
  })

  it('buying a skill spends budget and raises a stat', () => {
    const s = withBudget(learnAll(initialGame()), 200)
    const before = deriveStats(s).quality
    const next = buy(s, 'keywordSearch')
    expect(next.levels.keywordSearch).toBe(1)
    expect(next.budget).toBe(200 - buildingCost(find('keywordSearch'), 0))
    expect(deriveStats(next).quality).toBeGreaterThan(before)
  })

  it('gates on tier AND prerequisites (evalHarness needs tier 2 + smokeTests)', () => {
    const s = withBudget(learnAll(initialGame()), 1000)
    expect(canBuy(s, find('evalHarness')).ok).toBe(false) // tier 2 not reached
    let t = buy(s, CHARTER_ID) // → tier 2
    expect(tierOf(t)).toBe(2)
    expect(canBuy(t, find('evalHarness')).reason).toMatch(/braucht/) // prereq smokeTests missing
    t = buy(t, 'smokeTests')
    expect(canBuy(t, find('evalHarness')).ok).toBe(true)
  })

  it('the clock advances time and accrues income passively (no manual sprint to spam)', () => {
    let s = initialGame()
    const start = s.budget
    const r = tick(s)
    expect(r.state.day).toBe(1)
    expect(r.state.budget).toBeGreaterThan(start)
  })

  it('the system auto-releases on its cadence as time runs', () => {
    let s = initialGame()
    let autoReleased = false
    for (let i = 0; i < RELEASE_EVERY; i++) {
      const r = tick(s)
      s = r.state
      if (r.outcome) autoReleased = true
    }
    expect(s.day).toBe(RELEASE_EVERY)
    expect(autoReleased).toBe(true)
  })

  it('a FAILED release does not harden the world (no spiral): scale/drift/debt stay put', () => {
    const before = initialGame()
    const { state, outcome } = shipRelease(before)
    expect(outcome.result).toBe('incident')
    expect(state.scale).toBe(0) // only a successful ship grows scale
    expect(state.drift).toBe(before.drift)
    expect(state.debt).toBe(before.debt)
  })

  it('a successful (clean) release DOES advance the world (scale grows)', () => {
    const strong: GameState = {
      ...initialGame(),
      drift: 0,
      debt: 0,
      levels: { charter: 5, keywordSearch: 2, embeddings: 2, vectorStore: 2, rag: 2, inputValidation: 2, leastPrivilege: 2, approvalGate: 2, smokeTests: 2, evalHarness: 2, decisionLog: 2 },
    }
    const { state, outcome } = shipRelease(strong)
    expect(outcome.result).toBe('clean')
    expect(state.scale).toBe(8)
  })

  it('a strong, low-drift system ships clean', () => {
    const strong: GameState = {
      ...initialGame(),
      drift: 0,
      debt: 0,
      levels: {
        charter: 5,
        keywordSearch: 2, embeddings: 2, vectorStore: 2, rag: 2,
        inputValidation: 2, leastPrivilege: 2, approvalGate: 2,
        smokeTests: 2, evalHarness: 2, decisionLog: 2,
      },
    }
    expect(shipRelease(strong).outcome.result).toBe('clean')
  })

  it('docs hold drift down: building them adds drift resistance', () => {
    const base = deriveResists(initialGame()).drift // charter contributes a little
    let s = withBudget(initialGame(), 500)
    s = buy(s, 'scratchNotes')
    s = buy(s, 'instructionsMd')
    expect(deriveResists(s).drift).toBeGreaterThan(base)
  })

  it('catalog integrity: positive costs, non-empty effects, real prerequisites', () => {
    for (const b of BUILDINGS) {
      expect(b.maxLevel).toBeGreaterThan(0)
      expect(b.baseCost).toBeGreaterThan(0)
      expect(Object.keys(b.effect).length).toBeGreaterThan(0)
      for (const r of b.requires ?? []) expect(ids.has(r), `${b.id} requires unknown ${r}`).toBe(true)
    }
  })

  it('every node + phase has a real, non-trivial info text (no missing/hero stubs)', () => {
    for (const b of [CHARTER, ...BUILDINGS]) {
      const info = NODE_INFO[b.id]
      expect(info, `missing NODE_INFO for ${b.id}`).toBeTruthy()
      expect(info.length, `NODE_INFO for ${b.id} too short`).toBeGreaterThan(60)
    }
    for (const z of ZONES) {
      expect(ZONE_INFO[z], `missing ZONE_INFO for ${z}`).toBeTruthy()
      expect(ZONE_INFO[z].length).toBeGreaterThan(80)
    }
  })
})

describe('placement = architecture (correct request PHASE matters)', () => {
  it('owned-but-unplaced sit in the Lager; placing into a phase records the phase', () => {
    const s = initialGame() // soloDev owned at start, not yet placed
    expect(ownedUnplaced(s).some((b) => b.id === 'soloDev')).toBe(true)
    expect(isPlaced(s, 'soloDev')).toBe(false)
    const placed = placeNode(s, 'soloDev', 'ops') // team → ops (correct)
    expect(isPlaced(placed, 'soloDev')).toBe(true)
    expect(placed.placed.soloDev).toBe('ops')
    expect(ownedUnplaced(placed).some((b) => b.id === 'soloDev')).toBe(false)
  })

  it('CORRECT phase grants +PLACE_BONUS on the primary stat; WRONG phase grants nothing', () => {
    const bought = buy(withBudget(learnAll(initialGame()), 200), 'keywordSearch') // retrieval → knowledge, quality
    const before = deriveStats(bought).quality

    const right = placeNode(bought, 'keywordSearch', 'knowledge')
    expect(isCorrectlyPlaced(right, 'keywordSearch')).toBe(true)
    expect(placementBonus(right).quality).toBe(PLACE_BONUS)
    expect(deriveStats(right).quality).toBe(before + PLACE_BONUS)

    const wrong = placeNode(bought, 'keywordSearch', 'tools') // wrong phase
    expect(isCorrectlyPlaced(wrong, 'keywordSearch')).toBe(false)
    expect(placementBonus(wrong).quality).toBe(0)
    expect(deriveStats(wrong).quality).toBe(before)
  })

  it('architectureScore counts correct vs placed; unplacing drops the bonus', () => {
    let s = buy(withBudget(learnAll(initialGame()), 300), 'keywordSearch')
    s = buy(s, 'inputValidation') // security → boundary
    s = placeNode(s, 'keywordSearch', 'knowledge') // correct
    s = placeNode(s, 'inputValidation', 'model') // wrong (belongs at the boundary)
    expect(architectureScore(s)).toEqual({ correct: 1, placed: 2 })
    s = unplaceNode(s, 'keywordSearch')
    expect(isPlaced(s, 'keywordSearch')).toBe(false)
    expect(placementBonus(s).quality).toBe(0)
  })

  it('canonical phase encodes the real lesson (boundary / knowledge / tools / check)', () => {
    expect(canonicalZone('injectionDefense')).toBe('boundary')
    expect(canonicalZone('rag')).toBe('knowledge')
    expect(canonicalZone('approvalGate')).toBe('tools')
    expect(canonicalZone('regressionGate')).toBe('check')
  })

  it('cannot place the Charter or an un-owned skill', () => {
    const s = initialGame()
    expect(placeNode(s, CHARTER_ID, 'ops')).toBe(s) // charter is the control-plane anchor
    expect(placeNode(s, 'rag', 'knowledge')).toBe(s) // not bought → nothing to place
  })
})
