import type { Lesson } from '@/features/lessons/lessonModel'
import type { LessonId, RoadmapNodeId } from '@/types'
import { roadmapGraph } from '@/content/roadmap'
import { whatAiEngineeringBuilds } from './whatAiEngineeringBuilds'
import { icebergModel } from './icebergModel'
import { augmentedLlm } from './augmentedLlm'
import { simplicityBeforeAgency } from './simplicityBeforeAgency'
import { systemLayersMap } from './systemLayersMap'
import { contextWindowBudget } from './contextWindowBudget'
import { contextNoise } from './contextNoise'
import { contextCompression } from './contextCompression'
import { contextIsolation } from './contextIsolation'
import { toolsAreInterfaces } from './toolsAreInterfaces'
import { structuredOutputs } from './structuredOutputs'
import { constrainedDecoding } from './constrainedDecoding'
import { mcpToolEcosystems } from './mcpToolEcosystems'
import { workflowVsAgent } from './workflowVsAgent'
import { workflowPatterns } from './workflowPatterns'
import { orchestratorWorker } from './orchestratorWorker'
import { evaluatorOptimizer } from './evaluatorOptimizer'
import { autonomousAgentLoop } from './autonomousAgentLoop'
import { ragBasics } from './ragBasics'
import { lexicalVsSemanticRetrieval } from './lexicalVsSemanticRetrieval'
import { hybridSearchReranking } from './hybridSearchReranking'
import { contextualRetrieval } from './contextualRetrieval'
import { paperVisualRetrieval } from './paperVisualRetrieval'
import { evalHarness } from './evalHarness'
import { taskSuccessRegression } from './taskSuccessRegression'
import { groundingEvaluation } from './groundingEvaluation'
import { tracesPostmortems } from './tracesPostmortems'
import { sessionVsProjectMemory } from './sessionVsProjectMemory'
import { decisionLogsLedgers } from './decisionLogsLedgers'
import { agentLearningLoops } from './agentLearningLoops'
import { longRunningProjects } from './longRunningProjects'
import { leastPrivilege } from './leastPrivilege'
import { humanApprovalGates } from './humanApprovalGates'
import { promptInjection } from './promptInjection'
import { sandboxingGovernance } from './sandboxingGovernance'
import { capstoneBriefing } from './capstoneBriefing'
import { capstoneFailureInjection } from './capstoneFailureInjection'
import { capstoneEvalGovernance } from './capstoneEvalGovernance'
import { capstoneFinalReview } from './capstoneFinalReview'
import { repoLegibility } from './repoLegibility'
import { conventionsSmallComponents } from './conventionsSmallComponents'
import { sourceMaterialOs } from './sourceMaterialOs'
import { teamScale } from './teamScale'
import { dirFromBuilderToDirector } from './dirFromBuilderToDirector'
import { dirOneBeeOrMany } from './dirOneBeeOrMany'
import { dirAllocateOversight } from './dirAllocateOversight'
import { dirSetBoundaries } from './dirSetBoundaries'
import { dirBriefBottleneck } from './dirBriefBottleneck'
import { dirSequenceDependencies } from './dirSequenceDependencies'
import { dirTriageSwarm } from './dirTriageSwarm'
import { dirPrioritizeAndCut } from './dirPrioritizeAndCut'
import { dirAcceptOrSendBack } from './dirAcceptOrSendBack'
import { dirDirectTheBuild } from './dirDirectTheBuild'
import { buildCampaign } from './buildCampaign'

// Curriculum lessons (PHASE_5). Contiguous unlockable chain ARC-00..ARC-09 (38 nodes),
// wired to the 5 core labs: Foundations (00-01..01-03) + Context (02-*) + Tool Boundaries
// (03-*) + Control Flow & Agents (04-*) + Retrieval (05-01..05-04) + Memory (06-*) +
// Evals & Observability (07-*) + Security & Governance (08-*) + Repo & Conventions (09-*).
// ARC-05 complete incl. NODE-05-05 (PHASE_6). ARC-10 capstone (NODE-10-01..05, PHASE_8) lessoned: briefing →
// architecture draft → failure injection → eval & governance → final review. Full graph NODE-00-01..10-05 lessoned.
export const lessons: Lesson[] = [
  whatAiEngineeringBuilds,
  icebergModel,
  augmentedLlm,
  simplicityBeforeAgency,
  systemLayersMap,
  contextWindowBudget,
  contextNoise,
  contextCompression,
  contextIsolation,
  toolsAreInterfaces,
  structuredOutputs,
  constrainedDecoding,
  mcpToolEcosystems,
  workflowVsAgent,
  workflowPatterns,
  orchestratorWorker,
  evaluatorOptimizer,
  autonomousAgentLoop,
  ragBasics,
  lexicalVsSemanticRetrieval,
  hybridSearchReranking,
  contextualRetrieval,
  paperVisualRetrieval,
  evalHarness,
  taskSuccessRegression,
  groundingEvaluation,
  tracesPostmortems,
  sessionVsProjectMemory,
  decisionLogsLedgers,
  agentLearningLoops,
  longRunningProjects,
  leastPrivilege,
  humanApprovalGates,
  promptInjection,
  sandboxingGovernance,
  repoLegibility,
  conventionsSmallComponents,
  sourceMaterialOs,
  teamScale,
  capstoneBriefing,
  capstoneFailureInjection,
  capstoneEvalGovernance,
  capstoneFinalReview,
  // ARC-11 — The Director's Seat (DIRECTION track, control/09). Additive, gated behind the capstone.
  dirFromBuilderToDirector,
  dirOneBeeOrMany,
  dirAllocateOversight,
  dirSetBoundaries,
  // ARC-12 — Targeting the Swarm (research-backed: spec quality / dependencies / drift triage).
  dirBriefBottleneck,
  dirSequenceDependencies,
  dirTriageSwarm,
  // ARC-13 — Delivery & Acceptance (the PM half: prioritize/scope + accept against the brief).
  dirPrioritizeAndCut,
  dirAcceptOrSendBack,
  // The direct-a-build ROUND-TRIP — the Open-Claw exit proof (PC-043), 4 phases, one lesson.
  dirDirectTheBuild,
  // The PRODUCTION CAPSTONE — the Build Campaign strategy game (NODE-13-04). Direct a whole
  // product end-to-end; decisions carry state to a launch scorecard.
  buildCampaign,
]

export const lessonById: Record<LessonId, Lesson> = Object.fromEntries(
  lessons.map((l) => [l.id, l]),
)

// English lesson variants (DEC-0015/0016): full parallel Lesson objects, rolled out arc by
// arc AFTER a lesson passes the content-polish bar. Untranslated lessons fall back to German.
import { whatAiEngineeringBuildsEn } from './en/whatAiEngineeringBuilds.en'
import { icebergModelEn } from './en/icebergModel.en'

const lessonsEn: Lesson[] = [whatAiEngineeringBuildsEn, icebergModelEn]
export const lessonEnById: Partial<Record<LessonId, Lesson>> = Object.fromEntries(
  lessonsEn.map((l) => [l.id, l]),
)

/** Locale-aware lesson lookup: EN where a translation exists, German otherwise. */
export function getLesson(id: LessonId, locale: 'de' | 'en'): Lesson | undefined {
  if (locale === 'en') return lessonEnById[id] ?? lessonById[id]
  return lessonById[id]
}

const byNode: Record<RoadmapNodeId, Lesson[]> = {}
for (const lesson of lessons) {
  ;(byNode[lesson.roadmapNodeId] ??= []).push(lesson)
}
export const lessonsByNodeId = byNode

/** First lesson bound to a roadmap node, if any. */
export function firstLessonForNode(nodeId: RoadmapNodeId): Lesson | undefined {
  return byNode[nodeId]?.[0]
}

// Dev-only content integrity (LG-300 acceptance check, partial).
if (import.meta.env.DEV) {
  for (const lesson of lessons) {
    if (!roadmapGraph.nodeById[lesson.roadmapNodeId]) {
      console.error(`[lessons] ${lesson.id} -> unknown node ${lesson.roadmapNodeId}`)
    }
    for (const p of lesson.prerequisites) {
      if (!roadmapGraph.nodeById[p]) {
        console.error(`[lessons] ${lesson.id} -> unknown prerequisite ${p}`)
      }
    }
    for (const block of lesson.blocks) {
      if (block.kind !== 'decision') continue
      const ids = block.decision.options.map((o) => o.id)
      if (!ids.includes(block.decision.bestOptionId)) {
        console.error(
          `[lessons] ${lesson.id} decision ${block.decision.id}: bestOptionId not in options`,
        )
      }
    }
  }
}
