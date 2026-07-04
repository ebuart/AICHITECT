import type { Feedback } from '@/types'

// Feedback library for the Agent Trace Debugger (interactions/23 trace patterns).
export const traceFeedback = {
  wrongOrigin: {
    id: 'FB-TRACE-WRONG-ORIGIN',
    severity: 'critical',
    decision: 'Du hast nicht den frühesten ursächlichen Schritt als Fehlerursache markiert.',
    consequence: 'Die Reparatur zielt auf ein Symptom oder den Endfehler, nicht auf die Ursache.',
    realWorldContext: 'Agent-Traces zeigen Model-Calls, Retrieval und Tool-Calls — der letzte Fehler ist selten die Ursache.',
    failureMode: 'Wiederkehrender Vorfall, weil die eigentliche Entscheidung unverändert bleibt.',
    architectureRule: 'Finde den frühesten Schritt, an dem das System vom richtigen Pfad abweicht.',
    improvedSolution: 'Markiere den Ursprungsschritt, ordne ihn der Ebene zu und repariere dort.',
    reviewHook: 'trace_failure_transfer',
  },
  wrongRepair: {
    id: 'FB-TRACE-WRONG-REPAIR',
    severity: 'risk',
    decision: 'Die Reparatur passt nicht zur identifizierten Ursache.',
    consequence: 'Symptom kann verschwinden, die Ursache bleibt und schlägt erneut zu.',
    realWorldContext: 'Ohne kausalen Bezug werden Fixes zu teuren Workarounds.',
    failureMode: 'Instabile „Reparatur“, die unter neuen Eingaben bricht.',
    architectureRule: 'Wähle die Reparatur, die genau die ursächliche Ebene adressiert.',
    improvedSolution: 'Setze Tool-Contract/Context/Observability dort an, wo der Ursprungsschritt liegt.',
    reviewHook: 'observability_gap_transfer',
  },
  clean: {
    id: 'FB-TRACE-CLEAN',
    severity: 'strong',
    decision: 'Du hast den Ursprungsschritt korrekt isoliert und passend repariert.',
    consequence: 'Die Reparatur trifft die ursächliche Ebene statt das Symptom.',
    realWorldContext: 'Saubere Trace-Diagnose macht Agent-Systeme debugbar statt rätselhaft.',
    failureMode: 'Vermieden: Schuldzuweisung an den Modell-Output und Endfehler-Fixes.',
    architectureRule: 'Trace-Literacy: frühester ursächlicher Schritt → Ebene → kausale Reparatur.',
    improvedSolution: 'Als Nächstes fehlende Observation/Eval ergänzen, um den Fall früher zu fangen.',
    reviewHook: 'capstone_failure_injection',
  },
} satisfies Record<string, Feedback>
