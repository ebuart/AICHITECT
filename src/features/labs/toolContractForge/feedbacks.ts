import type { Feedback } from '@/types'

// Feedback library for the Tool Contract Forge (interactions/23 tool patterns).
export const toolFeedback = {
  broad: {
    id: 'FB-PATTERN-BROAD-TOOL-PERMISSION',
    severity: 'critical',
    decision: 'Der Tool-Scope oder die Permission ist breiter als die Aufgabe verlangt.',
    consequence: 'Ein kleiner Modell-Fehler kann große Nebenwirkungen auslösen.',
    realWorldContext: 'Agenten mit breitem Lese-/Schreib-/Lösch-Zugriff brauchen stärkere Grenzen.',
    failureMode: 'Unsichere Aktion, Datenexposition oder irreversible Änderung.',
    architectureRule: 'Least Privilege: nur benötigte Aktionen, minimaler Permission-Scope.',
    improvedSolution: 'Scope einengen, Inputs beschränken, riskante Aktionen mit Approval gaten.',
    reviewHook: 'least_privilege_transfer',
  },
  ambiguous: {
    id: 'FB-PATTERN-AMBIGUOUS-TOOL-CONTRACT',
    severity: 'risk',
    decision: 'Der Tool-Contract lässt das Output-Format offen.',
    consequence: 'Das Modell muss raten, wie es das Tool aufruft — brittle Failures steigen.',
    realWorldContext: 'Tool-Definitionen wirken wie Interfaces; Ambiguität wird zum Laufzeitfehler.',
    failureMode: 'Falscher Tool-Call, ungültige Args oder inkonsistenter Output.',
    architectureRule: 'Enge Purpose, explizite Parameter, typed Output, definiertes Fehlerverhalten.',
    improvedSolution: 'Structured Output erzwingen und Fehlerfälle definieren.',
    reviewHook: 'tool_boundary_transfer',
  },
  approval: {
    id: 'FB-TCF-APPROVAL',
    severity: 'risk',
    decision: 'Die Approval-Entscheidung passt nicht zum Risiko der Aktionen.',
    consequence: 'Entweder läuft eine riskante Aktion ungeprüft, oder harmlose Arbeit wird blockiert.',
    realWorldContext: 'Approval gehört auf hoch-impact/irreversible Aktionen — nicht überall, nicht nirgends.',
    failureMode: 'Unkontrollierte destruktive Aktion oder unnötige Reibung.',
    architectureRule: 'Gate genau die hoch-impact Aktionen mit Human Approval.',
    improvedSolution: 'Approval aktivieren, wenn eine benötigte Aktion destruktiv ist — sonst weglassen.',
    reviewHook: 'least_privilege_transfer',
  },
  clear: {
    id: 'FB-POS-BOUNDARY-CLEAR',
    severity: 'strong',
    decision: 'Der Contract trennt erlaubte von hoch-impact Aktionen und nutzt minimale Permissions.',
    consequence: 'Der Agent arbeitet effizient, riskante Operationen bleiben kontrolliert.',
    realWorldContext: 'Least Privilege reduziert den Blast Radius, ohne nützliche Automation zu blockieren.',
    failureMode: 'Vermieden: breiter Zugriff und ungeprüfte destruktive Calls.',
    architectureRule: 'Enge Scope + typed Output + Approval nur für riskante Aktionen.',
    improvedSolution: 'Als Nächstes Test-Cases und strukturiertes Fehlerverhalten ergänzen.',
    reviewHook: 'capstone_tool_contracts',
  },
} satisfies Record<string, Feedback>
