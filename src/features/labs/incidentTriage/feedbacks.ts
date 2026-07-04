import type { Feedback } from '@/types'
import type { TriageAction } from './types'

const RULE = 'Erst den Schaden stoppen, dann Ursache, dann durable Fix — Reihenfolge ist Risiko-Management.'

export function firstWrongFeedback(first: TriageAction): Feedback {
  return {
    id: 'FB-TRI-FIRST',
    severity: 'critical',
    summary: `Zuerst eindämmen: „${first.label}“ gehört an Position 1.`,
    architectureRule: RULE,
    reviewHook: 'incident_triage_transfer',
  }
}

export function orderFeedback(action: TriageAction): Feedback {
  return {
    id: `FB-TRI-${action.id}`,
    severity: 'risk',
    summary: `Reihenfolge unstimmig: „${action.label}“ steht an der falschen Stelle.`,
    architectureRule: RULE,
    reviewHook: 'incident_triage_transfer',
  }
}

export const triageCleanFeedback: Feedback = {
  id: 'FB-TRI-CLEAN',
  severity: 'strong',
  summary: 'Saubere Triage: erst gestoppt, dann Ursache, dann durable Kontrolle.',
  architectureRule: RULE,
  reviewHook: 'incident_triage_transfer',
}
