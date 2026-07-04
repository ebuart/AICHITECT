import { describe, it, expect } from 'vitest'
import {
  applyOption,
  canAfford,
  nextStageIndex,
  scorecard,
  type CampaignDef,
  type CampaignState,
} from '@/features/campaign/campaignModel'
import { shipKlauspilot } from '@/content/campaigns/shipKlauspilot'

// Walk the campaign with a fixed choice map, respecting branching (`when`). Returns the final
// state — the same path the BuildCampaign engine takes.
function play(def: CampaignDef, choices: Record<string, string>): CampaignState {
  let state = def.initial
  let idx = nextStageIndex(def, 0, state.flags)
  let guard = 0
  while (idx >= 0 && guard++ < 50) {
    const stage = def.stages[idx]
    const opt = stage.options.find((o) => o.id === choices[stage.id]) ?? stage.options[0]
    state = applyOption(state, opt)
    idx = nextStageIndex(def, idx + 1, state.flags)
  }
  return state
}

describe('campaign engine (pure logic)', () => {
  it('applyOption clamps meters, spends oversight, accumulates flags', () => {
    const s: CampaignState = { quality: 95, security: 10, scope: 0, oversight: 20, flags: ['x'] }
    const next = applyOption(s, {
      id: 'o',
      label: 'l',
      cost: 30,
      effect: { quality: 20, security: -20 },
      addFlags: ['y', 'x'],
      feedback: 'f',
    })
    expect(next.quality).toBe(100) // clamped at 100
    expect(next.security).toBe(0) // clamped at 0
    expect(next.oversight).toBe(0) // 20 - 30 clamped at 0
    expect(next.flags).toEqual(['x', 'y']) // dedup
    expect(s.quality).toBe(95) // original untouched (pure)
  })

  it('canAfford gates options on remaining oversight', () => {
    const s: CampaignState = { quality: 0, security: 0, scope: 0, oversight: 10, flags: [] }
    expect(canAfford(s, { id: 'a', label: '', cost: 10, feedback: '' })).toBe(true)
    expect(canAfford(s, { id: 'b', label: '', cost: 11, feedback: '' })).toBe(false)
    expect(canAfford(s, { id: 'c', label: '', feedback: '' })).toBe(true) // no cost
  })

  it('nextStageIndex skips stages whose `when` is false (branching)', () => {
    const withRefund = nextStageIndex(shipKlauspilot, 0, ['ungated-refund'])
    const noRefund = nextStageIndex(shipKlauspilot, 0, [])
    // both resolve to the first stage (brief, no `when`)
    expect(shipKlauspilot.stages[withRefund].id).toBe('brief')
    expect(shipKlauspilot.stages[noRefund].id).toBe('brief')

    // at the incident position, the branch flips on the flag
    const injectIdx = shipKlauspilot.stages.findIndex((s) => s.id === 'incident-inject')
    const groundIdx = shipKlauspilot.stages.findIndex((s) => s.id === 'incident-ground')
    expect(nextStageIndex(shipKlauspilot, injectIdx, ['ungated-refund'])).toBe(injectIdx)
    expect(nextStageIndex(shipKlauspilot, injectIdx, [])).toBe(groundIdx)
  })

  it('a disciplined playthrough ships with a strong grade and no catastrophe', () => {
    const state = play(shipKlauspilot, {
      brief: 'tight',
      arch: 'rag',
      bound: 'gate',
      oversight: 'focus',
      triage: 'stop',
      eval: 'full',
      'incident-ground': 'ground',
      accept: 'sendback',
    })
    const card = scorecard(shipKlauspilot, state)
    expect(card.shipped).toBe(true)
    expect(['A', 'B', 'C']).toContain(card.letter)
    expect(state.security).toBeGreaterThanOrEqual(70)
    expect(card.lines.some((l) => l.text.includes('KATASTROPHE'))).toBe(false)
  })

  it('an early ungated-refund shortcut surfaces as a catastrophe and blocks the launch', () => {
    const state = play(shipKlauspilot, {
      brief: 'loose',
      arch: 'autonomous',
      bound: 'direct', // sets ungated-refund
      oversight: 'trust',
      triage: 'run',
      eval: 'none', // sets no-eval
      'incident-inject': 'ignore', // sets unfixed
      accept: 'accept',
    })
    const card = scorecard(shipKlauspilot, state)
    expect(card.shipped).toBe(false)
    expect(state.security).toBeLessThan(45)
    expect(card.lines.some((l) => l.text.includes('KATASTROPHE'))).toBe(true)
    expect(card.letter).toBe('F')
  })

  it('scoring is weakest-link: high quality cannot mask a security hole', () => {
    const lopsided: CampaignState = { quality: 100, security: 20, scope: 100, oversight: 0, flags: [] }
    const card = scorecard(shipKlauspilot, lopsided)
    // floor (min of quality/security) caps the grade near security, not the average
    expect(card.shipped).toBe(false)
    expect(['D', 'F']).toContain(card.letter)
  })
})
