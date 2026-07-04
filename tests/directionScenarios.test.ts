import { describe, it, expect } from 'vitest'
import { contextBudgetScenarios } from '@/content/labs/contextBudgetScenarios'
import { scoreContextBudget } from '@/features/labs/contextBudgetBoard/scoring'
import type { Dispositions } from '@/features/labs/contextBudgetBoard/types'
import { architectureScenarios } from '@/content/labs/architectureScenarios'
import { scoreArchitecture } from '@/features/labs/architectureBuilder/scoring'
import { contextAllocatorScenarios } from '@/content/labs/contextAllocatorScenarios'
import { scoreAllocation } from '@/features/labs/contextAllocator/scoring'
import { trustBoundaryScenarios } from '@/content/labs/trustBoundaryScenarios'
import { scoreBoundary } from '@/features/labs/trustBoundary/scoring'
import { tradeOffScenarios } from '@/content/labs/tradeOffScenarios'
import { scoreDuel } from '@/features/labs/tradeOffDuel/scoring'
import { pipelineScenarios } from '@/content/labs/pipelineScenarios'
import { scorePipeline } from '@/features/labs/pipelineBuilder/scoring'
import { incidentTriageScenarios } from '@/content/labs/incidentTriageScenarios'
import { scoreTriage } from '@/features/labs/incidentTriage/scoring'
import { failureModeScenarios } from '@/content/labs/failureModeScenarios'
import { scoreFailureMode } from '@/features/labs/failureModeTree/scoring'

// Pedagogy check for ARC-11 (DIRECTION track, FL-0043). Render-green proves a node
// LOADS; this proves it TEACHES — the intended director move scores well and the
// rookie move scores worse. Locks the new content's scoring, not just its existence.
const data = <T,>(arr: { id: string; scenarioData: T }[], id: string): T =>
  arr.find((s) => s.id === id)!.scenarioData

describe('ARC-11 director scenarios score the intended move highest', () => {
  it('11-01 Context-ROI: feed signal, cut the dump — beats feeding everything', () => {
    const d = data(contextBudgetScenarios, 'DIR-FEED-BASE')
    const directed: Dispositions = {
      sys: 'include', ticket: 'include', spec: 'include', code: 'include',
      slack: 'exclude', olddesign: 'exclude', dump: 'exclude',
    }
    const feedAll: Dispositions = Object.fromEntries(d.items.map((i) => [i.id, 'include']))
    const r = scoreContextBudget(d, directed)
    expect(r.score).toBeGreaterThanOrEqual(0.75)
    expect(r.score).toBeGreaterThan(scoreContextBudget(d, feedAll).score)
  })

  it('11-02 One Bee or Many: one executor + eval is full marks; adding a worker over-swarms', () => {
    const d = data(architectureScenarios, 'DIR-SWARM-BASE')
    expect(scoreArchitecture(d, ['executor', 'eval']).score).toBe(1)
    const overSwarm = scoreArchitecture(d, ['executor', 'eval', 'worker'])
    expect(overSwarm.masterySignals).not.toContain('avoids_forbidden')
    expect(overSwarm.score).toBeLessThan(1)
  })

  it('11-03 Allocate Oversight: risk-weighted beats an even split', () => {
    const d = data(contextAllocatorScenarios, 'DIR-OVERSIGHT-BASE')
    const riskWeighted = scoreAllocation(d, { migration: 36, payments: 34, copy: 8, tests: 22 })
    const evenSplit = scoreAllocation(d, { migration: 25, payments: 25, copy: 25, tests: 25 })
    expect(riskWeighted.score).toBeGreaterThan(evenSplit.score)
  })

  it('11-04 Boundaries: each action in its right zone is full marks; trust-all is unsafe', () => {
    const d = data(trustBoundaryScenarios, 'DIR-BOUND-BASE')
    const correct = Object.fromEntries(d.elements.map((e) => [e.id, e.bestZone]))
    expect(scoreBoundary(d, correct).score).toBe(1)
    const trustAll = Object.fromEntries(d.elements.map((e) => [e.id, 'trusted']))
    expect(scoreBoundary(d, trustAll).score).toBeLessThan(1)
  })
})

describe('ARC-12 director scenarios score the intended move highest', () => {
  it('12-01 The Brief: make it measurable + testable = full marks; the realistic traps score worse', () => {
    const d = data(tradeOffScenarios, 'DIR-BRIEF-BASE')
    expect(scoreDuel(d, { spec: 'measurable', done: 'testable' }).score).toBe(1)
    // the "feels clear" trap (qualitative goal left as-is) and over-prescription both fail spec
    expect(scoreDuel(d, { spec: 'feels-clear', done: 'testable' }).score).toBeLessThan(1)
    expect(scoreDuel(d, { spec: 'prescribe', done: 'testable' }).score).toBeLessThan(1)
    // the responsible-feeling "a senior reviews it" trap fails the DoD station
    expect(scoreDuel(d, { spec: 'measurable', done: 'review' }).score).toBeLessThan(1)
  })

  it('12-02 Dependencies: the dependency order is full marks; pulling in scope-creep is a violation', () => {
    const d = data(pipelineScenarios, 'DIR-DEPS-BASE')
    const r = scorePipeline(d, ['schema', 'api', 'ui', 'tests'])
    expect(r.score).toBe(1)
    expect(r.violations).toHaveLength(0)
    expect(scorePipeline(d, ['schema', 'api', 'ui', 'tests', 'refactor']).violations).toContain('refactor')
  })

  it('12-03 Triage: stop the drift first; reviewing the fine bee first is a capped failure', () => {
    const d = data(incidentTriageScenarios, 'DIR-SWARM-TRIAGE')
    expect(scoreTriage(d, ['redirect', 'unblock', 'review_ok', 'integrate']).score).toBe(1)
    const wrongFirst = scoreTriage(d, ['review_ok', 'redirect', 'unblock', 'integrate'])
    expect(wrongFirst.violations).toContain('redirect')
    expect(wrongFirst.score).toBeLessThan(1)
  })
})

describe('Tier-2 second viewpoints (OQ-0011) score the intended move highest', () => {
  it('11-02 angle 2 (cost): small pod + parallel-only-when-independent beats max-bees', () => {
    const d = data(tradeOffScenarios, 'DIR-SWARM-COST')
    expect(scoreDuel(d, { size: 'small', when: 'independent' }).score).toBe(1)
    expect(scoreDuel(d, { size: 'max', when: 'independent' }).score).toBeLessThan(1)
    expect(scoreDuel(d, { size: 'small', when: 'always' }).score).toBeLessThan(1)
  })

  it('12-03 angle 2 (intervene): re-brief + early checkpoints beats sunk-cost and micromanaging', () => {
    const d = data(tradeOffScenarios, 'DIR-INTERVENE')
    expect(scoreDuel(d, { action: 'rebrief', prevent: 'checkpoints' }).score).toBe(1)
    expect(scoreDuel(d, { action: 'letfinish', prevent: 'checkpoints' }).score).toBeLessThan(1)
    expect(scoreDuel(d, { action: 'rebrief', prevent: 'micromanage' }).score).toBeLessThan(1)
  })
})

describe('ARC-13 delivery & acceptance (PM edge) score the intended move highest', () => {
  it('13-01 Prioritize: fund core + de-risk, cut the nice-to-have — beats an even spread', () => {
    const d = data(contextAllocatorScenarios, 'DIR-SCOPE-BASE')
    const prioritised = scoreAllocation(d, { core: 48, risky: 30, nice: 6, polish: 16 })
    const evenSpread = scoreAllocation(d, { core: 25, risky: 25, nice: 25, polish: 25 })
    expect(prioritised.score).toBeGreaterThan(evenSpread.score)
  })

  it('13-02 Accept: send back the unmet criterion with a specific reason; rubber-stamp/nitpick score worse', () => {
    const d = data(tradeOffScenarios, 'DIR-ACCEPT-BASE')
    expect(scoreDuel(d, { verdict: 'sendback-gap', feedback: 'specific' }).score).toBe(1)
    expect(scoreDuel(d, { verdict: 'accept-looks', feedback: 'specific' }).score).toBeLessThan(1)
    expect(scoreDuel(d, { verdict: 'sendback-style', feedback: 'specific' }).score).toBeLessThan(1)
    expect(scoreDuel(d, { verdict: 'sendback-gap', feedback: 'vague' }).score).toBeLessThan(1)
  })
})

describe('13-03 Direct-the-Build round-trip (PC-043 Open-Claw proof) — every phase scores the intended move', () => {
  it('Phase 1 brief: measurable security + risk-based UX = full marks; the realistic traps score worse', () => {
    const d = data(tradeOffScenarios, 'RT-BRIEF')
    expect(scoreDuel(d, { secure: 'standard', ux: 'risk-based' }).score).toBe(1)
    expect(scoreDuel(d, { secure: 'bestpractice', ux: 'risk-based' }).score).toBeLessThan(1) // "best practices" feels clear, isn't
    expect(scoreDuel(d, { secure: 'standard', ux: 'always' }).score).toBeLessThan(1) // more friction ≠ better
  })

  it('Phase 2 decompose: dependency order = full marks; rewriting auth is scope-creep', () => {
    const d = data(pipelineScenarios, 'RT-DECOMPOSE')
    expect(scorePipeline(d, ['secret', 'enroll', 'verify', 'recovery']).score).toBe(1)
    expect(scorePipeline(d, ['secret', 'enroll', 'verify', 'recovery', 'rewrite']).violations).toContain('rewrite')
  })

  it('Phase 3 diagnose: missing recovery flow is the root cause; TOTP-window is the distractor', () => {
    const d = data(failureModeScenarios, 'RT-DIAGNOSE')
    const correct = scoreFailureMode(d, { c1: 'root_cause', c2: 'symptom', c3: 'distractor' }, 'r1')
    expect(correct.score).toBe(1)
    // treating the distractor (TOTP window) as the cause + its repair is wrong
    expect(scoreFailureMode(d, { c1: 'root_cause', c2: 'symptom', c3: 'distractor' }, 'r2').score).toBeLessThan(1)
  })

  it('Phase 4 accept: send back the missing recovery criterion + add a regression test', () => {
    const d = data(tradeOffScenarios, 'RT-ACCEPT')
    expect(scoreDuel(d, { verdict: 'sendback', closeout: 'regression' }).score).toBe(1)
    expect(scoreDuel(d, { verdict: 'accept', closeout: 'regression' }).score).toBeLessThan(1) // green tests ≠ meets brief
    expect(scoreDuel(d, { verdict: 'merge-fix', closeout: 'regression' }).score).toBeLessThan(1) // "ship now, fix later" on a security criterion
  })
})
