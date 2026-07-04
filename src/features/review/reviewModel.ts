import type { ProgressState, RoadmapNode, RoadmapNodeId } from '@/types'

// Review & mastery model (PHASE_7, PH-800/PH-801). A PURE projection of persisted
// progress — no new storage (QG-070), no XP/streaks (PH-803). Mastery reflects
// demonstrated work: a node is `introduced` once its lesson is done, `practiced`
// once a bound lab is cleared cleanly, and `needs_repair` when a lab recorded weak
// signals or a low score. Spacing resurfaces older completions; repairs come first.

export type MasteryLevel = 'introduced' | 'practiced' | 'needs_repair'

const REPAIR_SCORE = 0.6
const REPAIR_DUE_BONUS_DAYS = 7
const DAY_MS = 86_400_000

export interface ReviewItem {
  nodeId: RoadmapNodeId
  title: string
  conceptIds: string[]
  reviewHooks: string[]
  completedAt: string
  weakSignals: string[]
  mastery: MasteryLevel
  /** Higher = more due. Age in days + a bonus for repairs. */
  dueScore: number
}

export interface MasterySummary {
  total: number
  practiced: number
  introduced: number
  needsRepair: number
}

export interface RecurringTheme {
  hook: string
  nodeIds: RoadmapNodeId[]
}

export interface ReviewState {
  items: ReviewItem[]
  /** Top due items to revisit next (spaced queue). */
  queue: ReviewItem[]
  /** Weak-area "repair missions" (PH-802). */
  repairs: ReviewItem[]
  /** reviewHooks shared by 2+ completed nodes — concepts reappearing in new contexts (PH-804). */
  themes: RecurringTheme[]
  summary: MasterySummary
}

export interface ReviewDeps {
  nodeById: Record<RoadmapNodeId, RoadmapNode>
  /** reviewHooks declared by the lesson(s) bound to a node. */
  reviewHooksForNode: (nodeId: RoadmapNodeId) => string[]
}

/** Completed labs bound to a node (via node.labIds), with their persisted signals. */
function nodeLabSignals(
  node: RoadmapNode,
  progress: ProgressState,
): { weakSignals: string[]; scores: number[] } {
  const weakSignals: string[] = []
  const scores: number[] = []
  for (const labId of node.labIds) {
    const lab = progress.labs[labId]
    if (!lab?.completed) continue
    if (lab.weakSignals) weakSignals.push(...lab.weakSignals)
    if (typeof lab.score === 'number') scores.push(lab.score)
  }
  return { weakSignals, scores }
}

function masteryOf(
  scores: number[],
  weakSignals: string[],
): MasteryLevel {
  const practicedClean = scores.length > 0 && scores.every((s) => s >= REPAIR_SCORE)
  if (weakSignals.length > 0 || scores.some((s) => s < REPAIR_SCORE)) return 'needs_repair'
  if (practicedClean) return 'practiced'
  return 'introduced'
}

export function buildReviewState(
  progress: ProgressState,
  deps: ReviewDeps,
  now: number = Date.now(),
): ReviewState {
  const items: ReviewItem[] = []
  for (const [nodeId, node] of Object.entries(deps.nodeById)) {
    if (progress.roadmap[nodeId]?.status !== 'completed') continue
    const completedAt = progress.roadmap[nodeId]?.completedAt ?? new Date(0).toISOString()
    const { weakSignals, scores } = nodeLabSignals(node, progress)
    const mastery = masteryOf(scores, weakSignals)
    const ageDays = Math.max(0, (now - Date.parse(completedAt)) / DAY_MS)
    const dueScore = ageDays + (mastery === 'needs_repair' ? REPAIR_DUE_BONUS_DAYS : 0)
    items.push({
      nodeId,
      title: node.title,
      conceptIds: node.conceptIds,
      reviewHooks: deps.reviewHooksForNode(nodeId),
      completedAt,
      weakSignals: [...new Set(weakSignals)],
      mastery,
      dueScore,
    })
  }

  items.sort((a, b) => b.dueScore - a.dueScore)

  const repairs = items.filter((i) => i.mastery === 'needs_repair')
  const queue = items.slice(0, 5)

  const summary: MasterySummary = {
    total: items.length,
    practiced: items.filter((i) => i.mastery === 'practiced').length,
    introduced: items.filter((i) => i.mastery === 'introduced').length,
    needsRepair: repairs.length,
  }

  return { items, queue, repairs, themes: collectThemes(items), summary }
}

/** reviewHooks that appear in 2+ completed nodes (the spiral/transfer thread). */
function collectThemes(items: ReviewItem[]): RecurringTheme[] {
  const byHook = new Map<string, RoadmapNodeId[]>()
  for (const item of items) {
    for (const hook of item.reviewHooks) {
      ;(byHook.get(hook) ?? byHook.set(hook, []).get(hook)!).push(item.nodeId)
    }
  }
  return [...byHook.entries()]
    .filter(([, nodeIds]) => nodeIds.length >= 2)
    .map(([hook, nodeIds]) => ({ hook, nodeIds }))
    .sort((a, b) => b.nodeIds.length - a.nodeIds.length)
}
