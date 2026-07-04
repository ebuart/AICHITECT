import type { Feedback } from '@/types'
import type { PipelineStage } from './types'

const RULE = 'Eine Pipeline ist so gut wie ihre richtige Reihenfolge und ihre fehlenden/falschen Stufen.'

export function forbiddenFeedback(stage: PipelineStage): Feedback {
  return {
    id: `FB-PIPE-FORBIDDEN-${stage.id}`,
    severity: 'critical',
    summary: `„${stage.label}“ gehört nicht in diese Pipeline.`,
    architectureRule: RULE,
    reviewHook: 'pipeline_transfer',
  }
}

export function missingFeedback(stage: PipelineStage): Feedback {
  return {
    id: `FB-PIPE-MISSING-${stage.id}`,
    severity: 'risk',
    summary: `Es fehlt eine Stufe: „${stage.label}“.`,
    architectureRule: RULE,
    reviewHook: 'pipeline_transfer',
  }
}

export const pipelineOrderFeedback: Feedback = {
  id: 'FB-PIPE-ORDER',
  severity: 'risk',
  summary: 'Die richtigen Stufen, aber die Reihenfolge stimmt nicht.',
  architectureRule: RULE,
  reviewHook: 'pipeline_transfer',
}

export const pipelineCleanFeedback: Feedback = {
  id: 'FB-PIPE-CLEAN',
  severity: 'strong',
  summary: 'Funktionierende Pipeline: richtige Stufen, richtige Reihenfolge.',
  architectureRule: RULE,
  reviewHook: 'pipeline_transfer',
}
