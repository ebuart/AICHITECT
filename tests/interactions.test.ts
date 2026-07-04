import { describe, it, expect } from 'vitest'
import {
  interactionRegistry,
  allScenarios,
} from '@/features/labs/interactionRegistry'
import { introScenario, transferScenario } from '@/features/labs/interactionModel'
import { labById } from '@/content/labs/labs'
import { contextBudgetScenarios } from '@/content/labs/contextBudgetScenarios'
import { scoreContextBudget } from '@/features/labs/contextBudgetBoard/scoring'
import type { Dispositions } from '@/features/labs/contextBudgetBoard/types'
import { failureModeScenarios } from '@/content/labs/failureModeScenarios'
import { scoreFailureMode } from '@/features/labs/failureModeTree/scoring'
import type { CauseClassification } from '@/features/labs/failureModeTree/types'
import { agentTraceScenarios } from '@/content/labs/agentTraceScenarios'
import { scoreTrace } from '@/features/labs/agentTraceDebugger/scoring'
import { toolContractScenarios } from '@/content/labs/toolContractScenarios'
import { scoreToolContract } from '@/features/labs/toolContractForge/scoring'
import { architectureScenarios } from '@/content/labs/architectureScenarios'
import { scoreArchitecture } from '@/features/labs/architectureBuilder/scoring'
import { retrievalFactoryScenarios } from '@/content/labs/retrievalFactoryScenarios'
import { scoreRetrieval } from '@/features/labs/retrievalFactory/scoring'
import type { RetrievalConfig } from '@/features/labs/retrievalFactory/types'
import { evalDesignerScenarios } from '@/content/labs/evalDesignerScenarios'
import { scoreEval } from '@/features/labs/evalDesigner/scoring'
import type { EvalConfig } from '@/features/labs/evalDesigner/types'
import { securityIncidentScenarios } from '@/content/labs/securityIncidentScenarios'
import { scoreIncident } from '@/features/labs/securityIncidentRoom/scoring'
import type { IncidentConfig } from '@/features/labs/securityIncidentRoom/types'
import { repoRefactorScenarios } from '@/content/labs/repoRefactorScenarios'
import { scoreRefactor } from '@/features/labs/repoRefactor/scoring'
import type { RefactorConfig } from '@/features/labs/repoRefactor/types'
import { paperFigureScenarios } from '@/content/labs/paperFigureScenarios'
import { scoreFigure } from '@/features/labs/paperFigureDecoder/scoring'
import type { FigureConfig } from '@/features/labs/paperFigureDecoder/types'
import { capstoneScenarios } from '@/content/labs/capstoneScenarios'
import { scoreCapstone } from '@/features/labs/capstoneSimulator/scoring'
import type { CapstoneConfig } from '@/features/labs/capstoneSimulator/types'
import { layerStackScenarios } from '@/content/labs/layerStackScenarios'
import { scoreLayers } from '@/features/labs/layerStackBuilder/scoring'
import { tradeOffScenarios } from '@/content/labs/tradeOffScenarios'
import { scoreDuel } from '@/features/labs/tradeOffDuel/scoring'
import { constraintScenarios } from '@/content/labs/constraintScenarios'
import { scoreConstraint } from '@/features/labs/constraintPuzzle/scoring'
import { systemPostmortemScenarios } from '@/content/labs/systemPostmortemScenarios'
import { scorePostmortem } from '@/features/labs/systemPostmortem/scoring'
import { contextAllocatorScenarios } from '@/content/labs/contextAllocatorScenarios'
import { scoreAllocation } from '@/features/labs/contextAllocator/scoring'
import type { Allocation } from '@/features/labs/contextAllocator/types'
import { trustBoundaryScenarios } from '@/content/labs/trustBoundaryScenarios'
import { scoreBoundary } from '@/features/labs/trustBoundary/scoring'
import type { BoundaryConfig } from '@/features/labs/trustBoundary/types'
import { incidentTriageScenarios } from '@/content/labs/incidentTriageScenarios'
import { scoreTriage } from '@/features/labs/incidentTriage/scoring'
import { pipelineScenarios } from '@/content/labs/pipelineScenarios'
import { scorePipeline } from '@/features/labs/pipelineBuilder/scoring'

const CORE_ENGINES = [
  'context-budget-board',
  'failure-mode-tree',
  'agent-trace-debugger',
  'tool-contract-forge',
  'architecture-builder',
] as const

const CORE_LABS = [
  'LAB-CONTEXT-BUDGET-BOARD',
  'LAB-FAILURE-MODE-TREE',
  'LAB-AGENT-TRACE-DEBUGGER',
  'LAB-TOOL-CONTRACT-FORGE',
  'LAB-ARCHITECTURE-BUILDER',
]

describe('interaction registry + lab binding (LS-009)', () => {
  it('registers all five core engines (PH-502)', () => {
    for (const t of CORE_ENGINES) expect(interactionRegistry[t], t).toBeDefined()
  })

  it('every scenario binds to a real lab with a matching interaction type', () => {
    for (const s of allScenarios) {
      const lab = labById[s.labId]
      expect(lab, s.id).toBeDefined()
      expect(lab.interactionType).toBe(s.interactionType)
    }
  })

  it('each core lab has a base and a transfer scenario (LS-005, PH-505)', () => {
    for (const labId of CORE_LABS) {
      expect(introScenario(allScenarios, labId), labId).toBeDefined()
      expect(transferScenario(allScenarios, labId), labId).toBeDefined()
    }
  })
})

describe('Context Budget Board scoring', () => {
  const base = contextBudgetScenarios[0].scenarioData
  const optimal: Dispositions = {
    sys: 'include', task: 'include', constraints: 'include', srcfile: 'include',
    history: 'exclude', todos: 'exclude', marketing: 'exclude',
  }

  it('a disciplined pack scores full marks with strong feedback', () => {
    const r = scoreContextBudget(base, optimal)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('dropping a required item fails critical_context_kept', () => {
    const r = scoreContextBudget(base, { ...optimal, constraints: 'exclude' })
    expect(r.masterySignals).not.toContain('critical_context_kept')
    expect(r.feedback.some((f) => f.severity === 'critical')).toBe(true)
  })

  it('including everything blows the budget and keeps noise', () => {
    const all: Dispositions = Object.fromEntries(base.items.map((i) => [i.id, 'include']))
    const r = scoreContextBudget(base, all)
    expect(r.weakSignals).toContain('budget_respected')
    expect(r.weakSignals).toContain('noise_reduced')
    expect(r.feedback.some((f) => f.id === 'FB-PATTERN-CONTEXT-NOISE')).toBe(true)
  })
})

describe('Failure Mode Tree scoring', () => {
  const base = failureModeScenarios[0].scenarioData
  const correct: CauseClassification = {
    c1: 'root_cause', c2: 'symptom', c3: 'symptom', c4: 'distractor', c5: 'distractor',
  }

  it('correct diagnosis + matching repair scores full marks', () => {
    const r = scoreFailureMode(base, correct, 'r1')
    expect(r.score).toBe(1)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('marking the root cause as a symptom is caught', () => {
    const r = scoreFailureMode(base, { ...correct, c1: 'symptom' }, 'r1')
    expect(r.masterySignals).not.toContain('root_cause_identification')
    expect(r.feedback.some((f) => f.severity === 'critical')).toBe(true)
  })

  it('a generic repair fails repair_fit', () => {
    const r = scoreFailureMode(base, correct, 'r2')
    expect(r.weakSignals).toContain('repair_fit')
    expect(r.feedback.some((f) => f.id === 'FB-FMT-GENERIC-REPAIR')).toBe(true)
  })
})

describe('Agent Trace Debugger scoring', () => {
  const base = agentTraceScenarios[0].scenarioData

  it('marking the origin event + matching repair scores full marks', () => {
    const r = scoreTrace(base, 'e2', 'r1')
    expect(r.score).toBe(1)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('marking a symptom instead of the origin is caught', () => {
    const r = scoreTrace(base, 'e4', 'r1')
    expect(r.masterySignals).not.toContain('earliest_failure_found')
    expect(r.feedback.some((f) => f.severity === 'critical')).toBe(true)
  })

  it('a non-causal repair fails repair_fit', () => {
    const r = scoreTrace(base, 'e2', 'r2')
    expect(r.weakSignals).toContain('repair_fit')
  })
})

describe('Tool Contract Forge scoring', () => {
  const base = toolContractScenarios[0].scenarioData

  it('least-privilege contract scores full marks', () => {
    const r = scoreToolContract(base, {
      allowedActionIds: ['read', 'list'],
      permissionId: 'p-read',
      requireApproval: false,
      structuredOutput: true,
    })
    expect(r.score).toBe(1)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('broad permission triggers the broad-permission pattern', () => {
    const r = scoreToolContract(base, {
      allowedActionIds: ['read', 'list', 'delete'],
      permissionId: 'p-full',
      requireApproval: false,
      structuredOutput: true,
    })
    expect(r.weakSignals).toContain('permission_minimization')
    expect(r.feedback.some((f) => f.id === 'FB-PATTERN-BROAD-TOOL-PERMISSION')).toBe(true)
  })

  it('free-text output triggers the ambiguous-contract pattern', () => {
    const r = scoreToolContract(base, {
      allowedActionIds: ['read', 'list'],
      permissionId: 'p-read',
      requireApproval: false,
      structuredOutput: false,
    })
    expect(r.weakSignals).toContain('output_contract')
    expect(r.feedback.some((f) => f.id === 'FB-PATTERN-AMBIGUOUS-TOOL-CONTRACT')).toBe(true)
  })
})

describe('Architecture Builder scoring', () => {
  const base = architectureScenarios[0].scenarioData

  it('the simplest sufficient system scores full marks', () => {
    const r = scoreArchitecture(base, ['model', 'retriever', 'eval'])
    expect(r.score).toBe(1)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('adding a forbidden agent triggers overengineering', () => {
    const r = scoreArchitecture(base, ['model', 'retriever', 'eval', 'agent'])
    expect(r.masterySignals).not.toContain('avoids_forbidden')
    expect(r.feedback.some((f) => f.id === 'FB-PATTERN-OVERENGINEERED-AGENTS')).toBe(true)
  })

  it('omitting a required capability is incomplete', () => {
    const r = scoreArchitecture(base, ['model', 'retriever'])
    expect(r.weakSignals).toContain('capability_coverage')
    expect(r.feedback.some((f) => f.id === 'FB-ARCH-INCOMPLETE')).toBe(true)
  })
})

describe('Retrieval Factory scoring', () => {
  const base = retrievalFactoryScenarios[0].scenarioData
  // Base profile: the SIMPLE pipeline is correct.
  const simplest: RetrievalConfig = { method: 'semantic', reranking: 'rerank-off', context: 'ctx-off' }

  it('the simplest fitting pipeline scores full marks with strong feedback', () => {
    const r = scoreRetrieval(base, simplest)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('the wrong retrieval method fails method_fit (critical)', () => {
    const r = scoreRetrieval(base, { ...simplest, method: 'lexical' })
    expect(r.masterySignals).not.toContain('method_fit')
    expect(r.weakSignals).toContain('method_fit')
    expect(r.feedback.some((f) => f.id === 'FB-RF-METHOD-MISMATCH')).toBe(true)
  })

  it('reflexively over-building (reranking when not needed) fails reranking_fit', () => {
    const r = scoreRetrieval(base, { ...simplest, reranking: 'rerank-on' })
    expect(r.weakSignals).toContain('reranking_fit')
    expect(r.feedback.some((f) => f.id === 'FB-RF-RERANK-MISMATCH')).toBe(true)
  })

  it('the transfer profile rewards the full pipeline, not the simple one', () => {
    const transfer = retrievalFactoryScenarios[1].scenarioData
    const full: RetrievalConfig = { method: 'hybrid', reranking: 'rerank-on', context: 'ctx-on' }
    expect(scoreRetrieval(transfer, full).score).toBe(1)
    expect(scoreRetrieval(transfer, simplest).score).toBeLessThan(1)
  })
})

describe('Eval Designer scoring', () => {
  const base = evalDesignerScenarios[0].scenarioData
  // Base system (a classifier, no sources): grounding is correctly skipped.
  const fit: EvalConfig = { success: 'task-success', regression: 'regression-set', grounding: 'ground-skip' }

  it('a fitting eval design scores full marks with strong feedback', () => {
    const r = scoreEval(base, fit)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('measuring format instead of task success is caught (critical)', () => {
    const r = scoreEval(base, { ...fit, success: 'format-only' })
    expect(r.masterySignals).not.toContain('success_metric_fit')
    expect(r.feedback.some((f) => f.id === 'FB-ED-SUCCESS-METRIC')).toBe(true)
  })

  it('adding a grounding check where there are no sources fails grounding_fit', () => {
    const r = scoreEval(base, { ...fit, grounding: 'ground-check' })
    expect(r.weakSignals).toContain('grounding_fit')
    expect(r.feedback.some((f) => f.id === 'FB-ED-GROUNDING')).toBe(true)
  })

  it('the RAG transfer requires grounding the base correctly skipped', () => {
    const transfer = evalDesignerScenarios[1].scenarioData
    const grounded: EvalConfig = { success: 'task-success', regression: 'regression-set', grounding: 'ground-check' }
    expect(scoreEval(transfer, grounded).score).toBe(1)
    expect(scoreEval(transfer, fit).score).toBeLessThan(1) // skipping grounding now fails
  })
})

describe('Security Incident Room scoring', () => {
  const base = securityIncidentScenarios[0].scenarioData
  const triage: IncidentConfig = {
    vector: 'broad-permission', containment: 'revoke-restore', control: 'least-priv-approval',
  }

  it('a correct triage triple scores full marks with strong feedback', () => {
    const r = scoreIncident(base, triage)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('misidentifying the vector is caught (critical)', () => {
    const r = scoreIncident(base, { ...triage, vector: 'small-model' })
    expect(r.masterySignals).not.toContain('vector_id')
    expect(r.feedback.some((f) => f.id === 'FB-SIR-WRONG-VECTOR')).toBe(true)
  })

  it('a containment that does not stop the bleeding fails containment_fit', () => {
    const r = scoreIncident(base, { ...triage, containment: 'retry-task' })
    expect(r.weakSignals).toContain('containment_fit')
    expect(r.feedback.some((f) => f.id === 'FB-SIR-WEAK-CONTAINMENT')).toBe(true)
  })

  it('the injection transfer needs a different response than the permission incident', () => {
    const transfer = securityIncidentScenarios[1].scenarioData
    const injectionResponse: IncidentConfig = {
      vector: 'injection', containment: 'cut-egress', control: 'isolate-input',
    }
    expect(scoreIncident(transfer, injectionResponse).score).toBe(1)
    expect(scoreIncident(transfer, triage).score).toBeLessThan(1)
  })
})

describe('Repo Refactor scoring', () => {
  const base = repoRefactorScenarios[0].scenarioData
  const fix: RefactorConfig = { durable: 'decision-log', components: 'split', legibility: 'feature-folders' }

  it('root-cause fixes on every station score full marks with strong feedback', () => {
    const r = scoreRefactor(base, fix)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('relying on chat memory instead of a durable log fails durable_state_fit', () => {
    const r = scoreRefactor(base, { ...fix, durable: 'rely-chat' })
    expect(r.weakSignals).toContain('durable_state_fit')
    expect(r.feedback.some((f) => f.id === 'FB-RR-DURABLE-STATE')).toBe(true)
  })

  it('patching a monster file with comments fails small_components_fit', () => {
    const r = scoreRefactor(base, { ...fix, components: 'add-comments' })
    expect(r.weakSignals).toContain('small_components_fit')
    expect(r.feedback.some((f) => f.id === 'FB-RR-MONSTER-FILE')).toBe(true)
  })

  it('the legible-repo transfer needs owner-doc consolidation, not a decision log', () => {
    const transfer = repoRefactorScenarios[1].scenarioData
    const consolidated: RefactorConfig = { durable: 'owner-doc', components: 'split', legibility: 'feature-folders' }
    expect(scoreRefactor(transfer, consolidated).score).toBe(1)
    expect(scoreRefactor(transfer, fix).score).toBeLessThan(1) // 'decision-log' is not the fit here
  })
})

describe('Paper Figure Decoder scoring', () => {
  const base = paperFigureScenarios[0].scenarioData
  // Visual-rich figure: page-image wins → use it there.
  const decode: FigureConfig = { reading: 'visual-wins', decision: 'visual-for-visual' }

  it('reading the figure and deriving the conditional decision scores full marks', () => {
    const r = scoreFigure(base, decode)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('over-generalizing the figure is caught (critical)', () => {
    const r = scoreFigure(base, { ...decode, reading: 'always-visual' })
    expect(r.weakSignals).toContain('figure_reading_fit')
    expect(r.feedback.some((f) => f.id === 'FB-PFD-MISREAD-FIGURE')).toBe(true)
  })

  it('a decision the figure does not support fails decision_fit', () => {
    const r = scoreFigure(base, { ...decode, decision: 'replace-all' })
    expect(r.weakSignals).toContain('decision_fit')
    expect(r.feedback.some((f) => f.id === 'FB-PFD-WRONG-DECISION')).toBe(true)
  })

  it('the plain-text transfer rewards keeping text retrieval, not the base reading', () => {
    const transfer = paperFigureScenarios[1].scenarioData
    const plainText: FigureConfig = { reading: 'text-equal-cheaper', decision: 'keep-text' }
    expect(scoreFigure(transfer, plainText).score).toBe(1)
    expect(scoreFigure(transfer, decode).score).toBeLessThan(1)
  })
})

describe('Capstone Simulator scoring', () => {
  const base = capstoneScenarios[0].scenarioData
  const integrated: CapstoneConfig = {
    context: 'control-plane', tools: 'least-priv', retrieval: 'hybrid-rerank',
    eval: 'task-regression', security: 'priv-approval-sandbox', repo: 'legible-control-plane',
  }

  it('an integrated architecture scores full marks across all 6 layers', () => {
    const r = scoreCapstone(base, integrated)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
  })

  it('skipping evals is a critical gap (PH-903)', () => {
    const r = scoreCapstone(base, { ...integrated, eval: 'none' })
    expect(r.weakSignals).toContain('eval_fit')
    expect(r.feedback.some((f) => f.id === 'FB-CAP-EVAL' && f.severity === 'critical')).toBe(true)
  })

  it('weak security boundaries are a critical gap', () => {
    const r = scoreCapstone(base, { ...integrated, security: 'trust' })
    expect(r.weakSignals).toContain('security_fit')
    expect(r.feedback.some((f) => f.id === 'FB-CAP-SECURITY')).toBe(true)
  })

  it('the early-prototype transfer drops retrieval but keeps eval/security rigorous', () => {
    const transfer = capstoneScenarios[1].scenarioData
    const staged: CapstoneConfig = { ...integrated, retrieval: 'none' }
    expect(scoreCapstone(transfer, staged).score).toBe(1)
    // the base architecture (full retrieval) no longer fits the prototype
    expect(scoreCapstone(transfer, integrated).score).toBeLessThan(1)
  })
})

describe('secondary lab scoring (OQ-0009 labs)', () => {
  it('Layer Stack Builder: correct origin layers vs a misclassification', () => {
    const base = layerStackScenarios[0].scenarioData
    const correct = { s1: 'retrieval', s2: 'tools', s3: 'context' }
    const r = scoreLayers(base, correct)
    expect(r.score).toBe(1)
    expect(r.feedback.map((f) => f.severity)).toContain('strong')
    const wrong = scoreLayers(base, { ...correct, s1: 'product' })
    expect(wrong.feedback.some((f) => f.id === 'FB-LSB-WRONG-LAYER')).toBe(true)
  })

  it('Trade-off Duel: base rewards the simple choice, transfer the agent/bigger model', () => {
    const base = tradeOffScenarios[0].scenarioData
    expect(scoreDuel(base, { arch: 'workflow', model: 'small-eval' }).score).toBe(1)
    const over = scoreDuel(base, { arch: 'agent', model: 'small-eval' })
    expect(over.weakSignals).toContain('simplicity_fit')
    expect(over.feedback.some((f) => f.id === 'FB-TOD-COMPLEXITY')).toBe(true)
    const transfer = tradeOffScenarios[1].scenarioData
    expect(scoreDuel(transfer, { arch: 'agent', model: 'bigger-accurate' }).score).toBe(1)
    expect(scoreDuel(transfer, { arch: 'workflow', model: 'small-eval' }).score).toBeLessThan(1)
  })

  it('Constraint Puzzle: schema-enforced output vs format drift', () => {
    const base = constraintScenarios[0].scenarioData
    expect(scoreConstraint(base, { format: 'schema', invalid: 'validate-reprompt' }).score).toBe(1)
    const drift = scoreConstraint(base, { format: 'freeform', invalid: 'validate-reprompt' })
    expect(drift.weakSignals).toContain('structured_output_fit')
    expect(drift.feedback.some((f) => f.id === 'FB-CP-FORMAT-DRIFT')).toBe(true)
  })

  it('System Postmortem: root cause + durable rule vs a one-off patch', () => {
    const base = systemPostmortemScenarios[0].scenarioData
    expect(scorePostmortem(base, { cause: 'stale-doc', rule: 'pin-regression' }).score).toBe(1)
    const patch = scorePostmortem(base, { cause: 'stale-doc', rule: 'fix-one' })
    expect(patch.weakSignals).toContain('durable_rule_fit')
    expect(patch.feedback.some((f) => f.id === 'FB-SPM-NO-DURABLE-RULE')).toBe(true)
  })
})

describe('Allocator scoring (MECH-ALLOCATE, graded/direction)', () => {
  const base = contextAllocatorScenarios[0].scenarioData
  // Weights that sum to 100 = exact target shares.
  const ideal: Allocation = { sys: 12, task: 22, constraints: 26, evidence: 28, history: 7, noise: 5 }

  it('the ideal split scores 1.0 with strong feedback and no weak signals', () => {
    const r = scoreAllocation(base, ideal)
    expect(r.score).toBe(1)
    expect(r.weakSignals).toHaveLength(0)
    expect(r.feedback[0].severity).toBe('strong')
  })

  it('rewards direction: a near-ideal split (within tolerance) still scores high and clean', () => {
    const near: Allocation = { sys: 14, task: 20, constraints: 30, evidence: 24, history: 7, noise: 5 }
    const r = scoreAllocation(base, near)
    expect(r.score).toBeGreaterThan(0.9)
    expect(r.weakSignals).toHaveLength(0) // every item within ±tolerance of its target
  })

  it('drowning the signal with old history is a critical, capped failure', () => {
    const drown: Allocation = { sys: 5, task: 10, constraints: 10, evidence: 10, history: 60, noise: 5 }
    const r = scoreAllocation(base, drown)
    expect(r.violations).toContain('history')
    expect(r.score).toBeLessThanOrEqual(0.5)
    expect(r.feedback[0].id).toBe('FB-ALLOC-history-over')
    expect(r.feedback[0].severity).toBe('critical')
  })

  it('starving a must-keep item (constraints) is caught as a hard violation', () => {
    const starve: Allocation = { sys: 20, task: 30, constraints: 5, evidence: 30, history: 10, noise: 5 }
    const r = scoreAllocation(base, starve)
    expect(r.violations).toContain('constraints')
    expect(r.feedback[0].id).toBe('FB-ALLOC-constraints-under')
  })

  it('an empty allocation prompts the learner rather than scoring', () => {
    const r = scoreAllocation(base, {})
    expect(r.score).toBe(0)
    expect(r.feedback[0].id).toBe('FB-ALLOC-EMPTY')
  })
})

describe('Trust Boundary scoring (MECH-BOUNDARY, placement + risk)', () => {
  const base = trustBoundaryScenarios[0].scenarioData
  const correct: BoundaryConfig = {
    read: 'trusted', list: 'trusted', delete: 'approval', deploy: 'approval', shell: 'sandbox', webdoc: 'isolate',
  }

  it('contained boundaries score 1.0 with strong feedback', () => {
    const r = scoreBoundary(base, correct)
    expect(r.score).toBe(1)
    expect(r.violations).toHaveLength(0)
    expect(r.feedback[0].severity).toBe('strong')
  })

  it('exposing a high-risk tool (delete in Trusted) is a critical, capped failure', () => {
    const r = scoreBoundary(base, { ...correct, delete: 'trusted' })
    expect(r.violations).toContain('delete')
    expect(r.score).toBeLessThanOrEqual(0.5)
    expect(r.feedback[0].id).toBe('FB-BND-delete')
    expect(r.feedback[0].severity).toBe('critical')
  })

  it('over-restricting a harmless tool is wrong but not a critical exposure', () => {
    const r = scoreBoundary(base, { ...correct, read: 'sandbox' })
    expect(r.weakSignals).toContain('read')
    expect(r.violations).toHaveLength(0)
    expect(r.score).toBeLessThan(1)
    expect(r.feedback[0].severity).toBe('risk')
  })
})

describe('Incident Triage scoring (MECH-TRIAGE, order proximity)', () => {
  const base = incidentTriageScenarios[0].scenarioData

  it('the correct response order scores 1.0 with strong feedback', () => {
    const r = scoreTriage(base, ['cut', 'rootcause', 'control', 'eval', 'postmortem'])
    expect(r.score).toBe(1)
    expect(r.violations).toHaveLength(0)
    expect(r.feedback[0].severity).toBe('strong')
  })

  it('not containing first is a critical, capped failure', () => {
    const r = scoreTriage(base, ['rootcause', 'cut', 'control', 'eval', 'postmortem'])
    expect(r.violations).toContain('cut')
    expect(r.score).toBeLessThanOrEqual(0.5)
    expect(r.feedback[0].id).toBe('FB-TRI-FIRST')
  })

  it('rewards direction: a near-correct order (contained first) scores high, not critical', () => {
    const r = scoreTriage(base, ['cut', 'rootcause', 'eval', 'control', 'postmortem'])
    expect(r.violations).toHaveLength(0)
    expect(r.score).toBeGreaterThan(0.5)
    expect(r.score).toBeLessThan(1)
    expect(r.feedback[0].severity).toBe('risk')
  })
})

describe('Pipeline Builder scoring (MECH-CONNECT, build + order)', () => {
  const base = pipelineScenarios[0].scenarioData

  it('the correct pipeline scores 1.0 with strong feedback', () => {
    const r = scorePipeline(base, ['ingest', 'chunk', 'embed', 'retrieve', 'generate'])
    expect(r.score).toBe(1)
    expect(r.violations).toHaveLength(0)
    expect(r.feedback[0].severity).toBe('strong')
  })

  it('including a forbidden stage (fine-tuning) is a critical, capped failure', () => {
    const r = scorePipeline(base, ['ingest', 'chunk', 'embed', 'retrieve', 'generate', 'finetune'])
    expect(r.violations).toContain('finetune')
    expect(r.score).toBeLessThanOrEqual(0.5)
    expect(r.feedback[0].id).toBe('FB-PIPE-FORBIDDEN-finetune')
  })

  it('a missing stage is flagged', () => {
    const r = scorePipeline(base, ['ingest', 'chunk', 'embed', 'retrieve'])
    expect(r.feedback[0].id).toBe('FB-PIPE-MISSING-generate')
    expect(r.score).toBeLessThan(1)
  })

  it('right stages, wrong order is an order miss (not critical)', () => {
    const r = scorePipeline(base, ['chunk', 'ingest', 'embed', 'retrieve', 'generate'])
    expect(r.violations).toHaveLength(0)
    expect(r.feedback[0].id).toBe('FB-PIPE-ORDER')
  })
})
