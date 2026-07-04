import type { Feedback } from '@/types'

// Feedback library for the Failure Mode Tree (analyzes the diagnosis, not the
// learner — FB-002). Selected by the scorer.
export const fmtFeedback = {
  symptomMistaken: {
    id: 'FB-FMT-SYMPTOM-AS-CAUSE',
    severity: 'critical',
    decision: 'Du hast ein Symptom (oder Distraktor) als Fehlerursache markiert.',
    consequence: 'Die Reparatur setzt am sichtbaren Effekt an, nicht an der Ursache.',
    realWorldContext: 'Der früheste auffällige Fehler ist selten die eigentliche Ursache.',
    failureMode: 'Der Fehler kehrt zurück, weil die Ursache unberührt bleibt.',
    architectureRule: 'Trenne Symptom (wo es auffällt) von Root Cause (wo es entsteht).',
    improvedSolution: 'Folge dem Trace zur frühesten ursächlichen Entscheidung und ordne sie ihrer Ebene zu.',
    reviewHook: 'failure_mode_transfer',
  },
  wrongRepair: {
    id: 'FB-FMT-GENERIC-REPAIR',
    severity: 'risk',
    decision: 'Die gewählte Reparatur passt nicht zur Ursache.',
    consequence: 'Generische Fixes (mehr Modell, mehr Prompt) erhöhen Komplexität ohne Wirkung.',
    realWorldContext: 'Viele Vorfälle werden mit dem falschen Hebel „repariert“.',
    failureMode: 'Kosten steigen, der Fehler bleibt oder verschiebt sich.',
    architectureRule: 'Wähle die Reparatur mit kausalem Bezug zur identifizierten Ursache.',
    improvedSolution: 'Setze die Reparatur auf der Ursachen-Ebene an (z. B. Tool-Contract statt Modellwechsel).',
    reviewHook: 'postmortem_transfer',
  },
  clean: {
    id: 'FB-FMT-CLEAN',
    severity: 'strong',
    decision: 'Du hast Ursache, Symptom und Distraktor sauber getrennt und passend repariert.',
    consequence: 'Die Reparatur trifft die Ebene, auf der der Fehler entsteht.',
    realWorldContext: 'So werden aus Vorfällen dauerhafte System-Verbesserungen statt Anekdoten.',
    failureMode: 'Vermieden: oberflächliche Fixes und wiederkehrende Incidents.',
    architectureRule: 'Diagnose vor Reparatur: Ursache, Ebene, kausal passende Regel.',
    improvedSolution: 'Als Nächstes die Regel als Postmortem-Eintrag festhalten.',
    reviewHook: 'postmortem_transfer',
  },
} satisfies Record<string, Feedback>
