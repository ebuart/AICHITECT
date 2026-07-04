import type { Feedback } from '@/types'
import type { ToolContractChoice, ToolScenarioData } from './types'
import { toolFeedback } from './feedbacks'

// Scoring dimensions (lab specs SCORING_DIMENSIONS, tool contract). Pure.
export const TCF_DIMENSIONS = [
  'narrow_scope',
  'permission_minimization',
  'approval_fit',
  'output_contract',
] as const
export type TcfDimension = (typeof TCF_DIMENSIONS)[number]

export interface TcfScore {
  score: number
  masterySignals: TcfDimension[]
  weakSignals: TcfDimension[]
  feedback: Feedback[]
}

export function scoreToolContract(
  data: ToolScenarioData,
  choice: ToolContractChoice,
): TcfScore {
  const allowed = new Set(choice.allowedActionIds)
  const neededIds = data.actions.filter((a) => a.needed).map((a) => a.id)
  const narrowScope =
    neededIds.every((id) => allowed.has(id)) && allowed.size === neededIds.length

  const checks: Record<TcfDimension, boolean> = {
    narrow_scope: narrowScope,
    permission_minimization: choice.permissionId === data.correctPermissionId,
    approval_fit: choice.requireApproval === data.requiresApproval,
    output_contract: choice.structuredOutput === true,
  }

  const masterySignals = TCF_DIMENSIONS.filter((d) => checks[d])
  const weakSignals = TCF_DIMENSIONS.filter((d) => !checks[d])
  const score = masterySignals.length / TCF_DIMENSIONS.length

  const feedback: Feedback[] = []
  if (!checks.narrow_scope || !checks.permission_minimization) feedback.push(toolFeedback.broad)
  if (!checks.output_contract) feedback.push(toolFeedback.ambiguous)
  if (!checks.approval_fit) feedback.push(toolFeedback.approval)
  if (weakSignals.length === 0) feedback.push(toolFeedback.clear)

  return { score, masterySignals, weakSignals, feedback }
}
