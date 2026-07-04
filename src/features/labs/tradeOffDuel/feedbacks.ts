import type { Feedback } from '@/types'

// Feedback for the Trade-off Duel (analyzes the decision, not the learner).
export const todFeedback = {
  simplicityMismatch: {
    id: 'FB-TOD-COMPLEXITY',
    severity: 'risk',
    decision: 'Die Komplexität der Architektur passt nicht zur Aufgabe.',
    consequence: 'Zu viel Autonomie kostet Kontrolle und Geld; zu wenig scheitert an einer offenen Aufgabe.',
    realWorldContext: 'Vorhersehbare, stabile Aufgaben gehören in Workflows; offene, dynamische Planung rechtfertigt Agenten.',
    failureMode: 'Über- oder unterdimensionierte Architektur für die tatsächliche Aufgabe.',
    architectureRule: 'Wähle die einfachste Architektur, die die messbare Anforderung erfüllt — Simplicity before Agency.',
    improvedSolution: 'Aufgabe prüfen: stabil → Workflow/Router; offen/dynamisch → Agent.',
    reviewHook: 'tradeoff_transfer',
  },
  tradeoffMismatch: {
    id: 'FB-TOD-COST-QUALITY',
    severity: 'risk',
    decision: 'Die Cost/Latency/Quality-Entscheidung passt nicht zur Anforderung.',
    consequence: 'Entweder zu langsam/teuer oder zu ungenau für den geforderten Zweck.',
    realWorldContext: 'Architektur-Entscheidungen verschieben Kosten, Latenz und Qualität — der Default ist selten richtig.',
    failureMode: 'Akkurates System zu teuer/langsam — oder billiges System zu unzuverlässig.',
    architectureRule: 'Leite Modell-/Pipeline-Wahl aus der konkreten Anforderung ab, nicht aus „größer ist besser“.',
    improvedSolution: 'Latenz-/Kosten-Budget gegen die Qualitätsanforderung stellen und passend wählen.',
    reviewHook: 'tradeoff_transfer',
  },
  clean: {
    id: 'FB-TOD-CLEAN',
    severity: 'strong',
    decision: 'Beide Entscheidungen passen zur Aufgabe und zu ihren Constraints.',
    consequence: 'Die Architektur ist so einfach wie möglich und so leistungsfähig wie nötig.',
    realWorldContext: 'Gute Architektur ist eine begründete Trade-off-Entscheidung, kein Reflex.',
    failureMode: 'Vermieden: Overengineering ebenso wie unterdimensionierte Systeme.',
    architectureRule: 'Einfachste messbare Architektur; Cost/Latency/Quality an die Anforderung koppeln.',
    improvedSolution: 'Entscheidung bei geänderten Constraints erneut prüfen.',
    reviewHook: 'tradeoff_transfer',
  },
} satisfies Record<string, Feedback>
