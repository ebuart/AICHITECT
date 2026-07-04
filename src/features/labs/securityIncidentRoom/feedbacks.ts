import type { Feedback } from '@/types'

// Feedback library for the Security Incident Room (analyzes the response, not the
// learner — FB-002). Per-option rationale carries the scenario specifics.
export const sirFeedback = {
  vectorMismatch: {
    id: 'FB-SIR-WRONG-VECTOR',
    severity: 'critical',
    decision: 'Der identifizierte Angriffsvektor passt nicht zum Trace.',
    consequence: 'Containment und durable Fix zielen auf die falsche Schwachstelle — der Vorfall bleibt offen.',
    realWorldContext: 'Incident Response beginnt mit der korrekten Ursache; der erste sichtbare Effekt ist selten der Vektor.',
    failureMode: 'Reparatur am falschen Ort; der echte Vektor bleibt ausnutzbar.',
    architectureRule: 'Bestimme zuerst den ausgenutzten Vektor aus dem Trace, dann reagiere.',
    improvedSolution: 'Den Trace zur ausgenutzten Schwachstelle zurückverfolgen, bevor du containst.',
    reviewHook: 'security_incident_transfer',
  },
  containmentMismatch: {
    id: 'FB-SIR-WEAK-CONTAINMENT',
    severity: 'risk',
    decision: 'Die Sofortmaßnahme stoppt den laufenden Schaden nicht wirklich.',
    consequence: 'Der Agent kann die schädliche Aktion weiter ausführen, während du „reparierst“.',
    realWorldContext: 'Containment heißt: die Blutung sofort stoppen (Zugriff/Egress kappen), nicht neu starten und hoffen.',
    failureMode: 'Der Schaden läuft weiter; Symptom behandelt statt Zugriff entzogen.',
    architectureRule: 'Entziehe zuerst den ausgenutzten Zugriff/Pfad, bevor du Ursachen behebst.',
    improvedSolution: 'Den schädlichen Pfad (Permission/Egress) sofort sperren oder den Agenten isolieren.',
    reviewHook: 'security_incident_transfer',
  },
  controlMismatch: {
    id: 'FB-SIR-NO-DURABLE-CONTROL',
    severity: 'risk',
    decision: 'Der gewählte durable Fix verhindert die Wiederkehr nicht.',
    consequence: 'Dieselbe Schwachstelle trifft als Nächstes einen anderen Fall — der Vorfall wird zur Anekdote.',
    realWorldContext: 'Prompt-Warnungen oder Einzel-Patches halten Injection/Over-Permission nicht auf.',
    failureMode: 'Wiederkehrender Incident, jedes Mal neu von Hand behandelt.',
    architectureRule: 'Wandle den Incident in eine architektonische Kontrolle: Least Privilege, Approval, Input-Isolation, Sandbox.',
    improvedSolution: 'Die Kontrolle auf der Vektor-Ebene setzen und als Regel/Eval festhalten (Postmortem).',
    reviewHook: 'postmortem_transfer',
  },
  clean: {
    id: 'FB-SIR-CLEAN',
    severity: 'strong',
    decision: 'Vektor korrekt bestimmt, Schaden sofort gestoppt und eine durable Kontrolle gesetzt.',
    consequence: 'Der Vorfall ist eingedämmt und kann auf demselben Weg nicht wiederkehren.',
    realWorldContext: 'Reife Teams schließen Incidents mit einer System-Änderung ab, nicht mit einer Notiz.',
    failureMode: 'Vermieden: falsche Ursache, weiterlaufender Schaden, wiederkehrender Angriff.',
    architectureRule: 'Vektor → Containment → durable Kontrolle: jede Stufe auf der richtigen Ebene.',
    improvedSolution: 'Die Kontrolle als Regel + Regressionsfall/Eval verankern (Incident → System-Verbesserung).',
    reviewHook: 'postmortem_transfer',
  },
} satisfies Record<string, Feedback>
