import type { Feedback, FeedbackSeverity } from '@/types'
import type { AllocItem } from './types'

// Allocation feedback is DERIVED from the trade-off the learner made (LR-031): the
// scorer picks the most important deviation and turns the item's over/under text into a
// concise takeaway. One mechanic narrates thousands of situations.
const RULE = 'Allokation folgt dem Wert für DIESE Situation — nicht „mehr ist besser“.'

export function itemFeedback(
  item: AllocItem,
  kind: 'over' | 'under',
  severity: FeedbackSeverity,
): Feedback {
  return {
    id: `FB-ALLOC-${item.id}-${kind}`,
    severity,
    summary: `${item.label}: ${kind === 'over' ? item.overText : item.underText}`,
    architectureRule: RULE,
    reviewHook: 'allocation_transfer',
  }
}

export const allocCleanFeedback: Feedback = {
  id: 'FB-ALLOC-CLEAN',
  severity: 'strong',
  summary: 'Stimmige Allokation: das Wichtige hat Platz, Noise bleibt klein.',
  architectureRule: RULE,
  reviewHook: 'allocation_transfer',
}

export const allocEmptyFeedback: Feedback = {
  id: 'FB-ALLOC-EMPTY',
  severity: 'info',
  summary: 'Verteile das Budget, dann werte aus.',
}
