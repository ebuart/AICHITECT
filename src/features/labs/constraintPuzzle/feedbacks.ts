import type { Feedback } from '@/types'

// Feedback for the Constraint Puzzle (analyzes the format decision, not the learner).
export const cpFeedback = {
  formatDrift: {
    id: 'FB-CP-FORMAT-DRIFT',
    severity: 'risk',
    decision: 'Der Output wird nicht durch ein Schema erzwungen.',
    consequence: 'Downstream-Parsing bricht, sobald das Modell das Format leicht variiert.',
    realWorldContext: 'Freitext zu parsen ist fragil; ein erzwungenes Schema macht den Output maschinenlesbar.',
    failureMode: 'Format-Drift: gelegentlich ungültige Struktur, die die Pipeline kippt.',
    architectureRule: 'Erzwinge das Output-Format per Schema/Structured Output statt es zu erhoffen.',
    improvedSolution: 'Schema definieren, Validierung + Re-Prompt/Constrain bei Verstoß.',
    reviewHook: 'constraint_transfer',
  },
  strictnessMismatch: {
    id: 'FB-CP-STRICTNESS',
    severity: 'risk',
    decision: 'Die Strenge der Constraints passt nicht zur Aufgabe.',
    consequence: 'Zu locker → ungültige Outputs bestehen; zu streng → gültige Antworten werden blockiert.',
    realWorldContext: 'Constraints sollen die STRUKTUR sichern, nicht die Semantik abwürgen.',
    failureMode: 'Entweder Format-Drift trotz „Validierung“ oder eine Grammatik, die korrekte Antworten verbietet.',
    architectureRule: 'Constrain das Format und validiere; lass innerhalb des Schemas semantische Freiheit.',
    improvedSolution: 'Schema auf die nötige Struktur begrenzen; bei Verstoß re-prompten statt alles zu erzwingen.',
    reviewHook: 'constraint_transfer',
  },
  clean: {
    id: 'FB-CP-CLEAN',
    severity: 'strong',
    decision: 'Der Output ist erzwungen parseable und die Constraints sind passend streng.',
    consequence: 'Die Pipeline bekommt verlässlich gültige Struktur, ohne gültige Antworten zu blockieren.',
    realWorldContext: 'Gute Constraints sichern Parsebarkeit, ohne die Lösungsmenge unnötig zu verkleinern.',
    failureMode: 'Vermieden: Format-Drift ebenso wie über-strenge Grammatik.',
    architectureRule: 'Struktur erzwingen, Semantik frei lassen; validieren statt hoffen.',
    improvedSolution: 'Schema + Validierung als Standard; Strenge an die Aufgabe koppeln.',
    reviewHook: 'constraint_transfer',
  },
} satisfies Record<string, Feedback>
