import type { Feedback } from '@/types'

// Feedback for the System Postmortem (analyzes the postmortem, not the learner).
export const spmFeedback = {
  wrongRootCause: {
    id: 'FB-SPM-ROOT-CAUSE',
    severity: 'risk',
    decision: 'Die identifizierte Ursache passt nicht zum Trace.',
    consequence: 'Die Maßnahme zielt am eigentlichen Problem vorbei; der Fehler kehrt zurück.',
    realWorldContext: 'Der Trace zeigt die früheste ursächliche Entscheidung — nicht das spätere Symptom.',
    failureMode: 'Reparatur am Symptom; die Ursache bleibt aktiv.',
    architectureRule: 'Folge dem Trace zur frühesten ursächlichen Entscheidung, bevor du handelst.',
    improvedSolution: 'Erst die Ursache im Trace festnageln, dann die durable Maßnahme wählen.',
    reviewHook: 'postmortem_transfer',
  },
  noDurableRule: {
    id: 'FB-SPM-NO-DURABLE-RULE',
    severity: 'risk',
    decision: 'Die Maßnahme verhindert die Wiederkehr nicht dauerhaft.',
    consequence: 'Der Vorfall wird zur Anekdote; dieselbe Fehlerklasse trifft als Nächstes einen anderen Fall.',
    realWorldContext: 'Reife Teams wandeln Incidents in Regeln, Evals und Guards — nicht in Einzel-Patches.',
    failureMode: 'Wiederkehrender Incident, jedes Mal manuell behoben.',
    architectureRule: 'Jeder Incident endet in einer durable Änderung: Regel, Eval oder Guard.',
    improvedSolution: 'Ursache fixen UND als Regel/Regressionsfall festhalten (z. B. im Decision-Log).',
    reviewHook: 'postmortem_transfer',
  },
  clean: {
    id: 'FB-SPM-CLEAN',
    severity: 'strong',
    decision: 'Ursache korrekt aus dem Trace bestimmt und in eine durable Regel gewandelt.',
    consequence: 'Die ganze Fehlerklasse ist vorgebeugt — nicht nur dieser eine Vorfall.',
    realWorldContext: 'So werden aus Vorfällen dauerhafte System-Verbesserungen.',
    failureMode: 'Vermieden: Symptom-Patch und wiederkehrende Incidents.',
    architectureRule: 'Trace → Ursache → durable Regel/Eval/Guard.',
    improvedSolution: 'Die Regel im Decision-Log verankern und einen Regressionsfall ergänzen.',
    reviewHook: 'postmortem_transfer',
  },
} satisfies Record<string, Feedback>
