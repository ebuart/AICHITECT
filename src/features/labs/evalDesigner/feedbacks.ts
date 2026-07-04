import type { Feedback } from '@/types'

// Feedback library for the Eval Designer (analyzes the eval design, not the
// learner — FB-002). Direction-neutral per dimension; the per-option rationale
// carries the scenario specifics.
export const edFeedback = {
  successMetricMismatch: {
    id: 'FB-ED-SUCCESS-METRIC',
    severity: 'critical',
    decision: 'Das Erfolgs-Kriterium misst die Oberfläche statt den echten Task-Erfolg.',
    consequence: 'Ungültige oder falsche Antworten bestehen, solange Format oder Stil stimmen.',
    realWorldContext: 'Structured Outputs lösen Parsebarkeit, nicht Korrektheit — Format ist kein Wahrheitssignal.',
    failureMode: 'Maschinenlesbar, aber inhaltlich falsch; „die Demo lief einmal“.',
    architectureRule: 'Trenne Format-Validität von semantischem Task-Erfolg und miss das Outcome.',
    improvedSolution: 'Einen task-spezifischen Grader auf das echte Ergebnis setzen, nicht auf die Struktur.',
    reviewHook: 'eval_transfer',
  },
  regressionMismatch: {
    id: 'FB-ED-NO-REGRESSION',
    severity: 'risk',
    decision: 'Kein Regression-Set sichert die bisherigen Erfolge bei jeder Änderung ab.',
    consequence: 'Eine lokale Verbesserung bricht still andere, vorher korrekte Fälle.',
    realWorldContext: 'Prompt-, Modell- und Retrieval-Änderungen verbessern einen Fall und brechen einen anderen.',
    failureMode: 'Stille Regression: „funktioniert jetzt“, anderswo schlechter.',
    architectureRule: 'Miss echten Task-Erfolg gegen einen festen Regression-Set, bevor du auslieferst.',
    improvedSolution: 'Bekannte Erfolge + Fehler als Set sichern und bei jeder Änderung automatisiert laufen lassen.',
    reviewHook: 'eval_transfer',
  },
  groundingMismatch: {
    id: 'FB-ED-GROUNDING',
    severity: 'risk',
    decision: 'Die Grounding-Entscheidung passt nicht zum System.',
    consequence: 'Entweder bestehen ungestützte Claims oder du baust einen Grounding-Check ohne Quellen.',
    realWorldContext: 'Grounding zählt, sobald Antworten aus Quellen/Retrieval stammen; bei reiner Klassifikation gibt es nichts zu prüfen.',
    failureMode: 'Plausible Halluzinationen bestehen — oder Mess-Overhead ohne Quellenbezug.',
    architectureRule: 'Setze Grounding-Eval genau dann ein, wenn das System Aussagen aus Quellen ableitet.',
    improvedSolution: 'Die Grounding-Entscheidung an die Quellen-/Retrieval-Nutzung des Systems koppeln.',
    reviewHook: 'grounding_eval_transfer',
  },
  clean: {
    id: 'FB-ED-CLEAN',
    severity: 'strong',
    decision: 'Der Eval misst echten Task-Erfolg, sichert Regressionen ab und prüft Grounding passend zum System.',
    consequence: 'Du erkennst echte Verbesserungen und stille Brüche zuverlässig — vor der Auslieferung.',
    realWorldContext: 'Gute Evals messen Outcome und Regression immer, Grounding genau dort, wo Quellen im Spiel sind.',
    failureMode: 'Vermieden: Format-only-Messung, stille Regression und ungeprüfte Claims.',
    architectureRule: 'Miss Outcome + Regression immer; ergänze Grounding, wenn das System aus Quellen antwortet.',
    improvedSolution: 'Als Nächstes die Eval-Suite an reale Failure-Cases und ein Postmortem-Set koppeln.',
    reviewHook: 'eval_transfer',
  },
} satisfies Record<string, Feedback>
