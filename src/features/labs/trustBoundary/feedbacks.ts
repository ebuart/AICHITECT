import type { Feedback, FeedbackSeverity } from '@/types'
import type { BoundaryElement } from './types'

// Boundary feedback names the worst misplacement (LR-031): a high-risk element left
// exposed is critical; an over-restricted harmless one is a softer note.
const RULE = 'Enthalte die riskanten Pfade (Approval/Sandbox/Isolation), ohne harmlose zu blockieren.'

export function boundaryFeedback(el: BoundaryElement, severity: FeedbackSeverity): Feedback {
  return {
    id: `FB-BND-${el.id}`,
    severity,
    summary: `${el.label}: ${el.wrongText}`,
    architectureRule: RULE,
    reviewHook: 'trust_boundary_transfer',
  }
}

export const boundaryCleanFeedback: Feedback = {
  id: 'FB-BND-CLEAN',
  severity: 'strong',
  summary: 'Saubere Grenzen: jede riskante Wirkung ist enthalten, harmlose Pfade bleiben frei.',
  architectureRule: RULE,
  reviewHook: 'trust_boundary_transfer',
}
