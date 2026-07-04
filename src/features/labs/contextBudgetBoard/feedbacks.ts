import type { Feedback } from '@/types'

// Feedback library for the Context Budget Board, derived from
// interactions/23_feedback_patterns.md. Selected by the scorer per attempt.
export const cbbFeedback = {
  missingCritical: {
    id: 'FB-PATTERN-MISSING-CRITICAL-CONTEXT',
    severity: 'critical',
    decision: 'Du hast entscheidungskritischen Context ausgeschlossen.',
    consequence: 'Das Modell erzeugt lokal plausible Outputs, die verborgene Constraints verletzen.',
    realWorldContext: 'Agenten brechen Produktregeln, wenn Quell-Constraints im aktiven Context fehlen.',
    failureMode: 'Korrekt aussehende Lösung mit falscher Architektur oder UX.',
    architectureRule: 'Bewahre Constraints, die Erfolg definieren — auch wenn sie Tokens kosten.',
    improvedSolution: 'Unterstützendes komprimieren, aber nicht-verhandelbare Constraints explizit halten.',
    reviewHook: 'compression_loss_transfer',
  },
  contextNoise: {
    id: 'FB-PATTERN-CONTEXT-NOISE',
    severity: 'risk',
    decision: 'Du hast wenig relevanten oder veralteten Context in den Input gelegt.',
    consequence: 'Wichtige Constraints konkurrieren im begrenzten Context mit Noise.',
    realWorldContext: 'Lang laufende Agenten erhalten oft alte Notizen, Logs und unzusammenhängende Dateien.',
    failureMode: 'Der Agent folgt veralteten Constraints oder verfehlt die Aufgabe.',
    architectureRule: 'Halte den Hot-Context minimal; veraltetes/irrelevantes gehört nicht hinein.',
    improvedSolution: 'Nur aktuelle Aufgabe, aktive Constraints, relevante Dateien und kompaktes Memory.',
    reviewHook: 'context_noise_transfer',
  },
  partial: {
    id: 'FB-CBB-PARTIAL',
    severity: 'weak',
    decision: 'Dein Context-Pack ist tragfähig, aber noch nicht optimal.',
    consequence: 'Einzelne Dimensionen (Noise, Stale, Budget, Rationale) sind nicht voll abgedeckt.',
    realWorldContext: 'Gute Context-Disziplin ist ein laufender Trade-off, kein Einmal-Setup.',
    failureMode: 'Schleichende Qualitätsverluste unter Last oder bei längerem Verlauf.',
    architectureRule: 'Behandle begrenzten Context als Architektur-Ressource mit klaren Prioritäten.',
    improvedSolution: 'Schwache Dimensionen gezielt nachbessern (siehe markierte Signale).',
    reviewHook: 'context_noise_transfer',
  },
  discipline: {
    id: 'FB-POS-CONTEXT-DISCIPLINE',
    severity: 'strong',
    decision: 'Du hast Constraints und Evidenz behalten und Noise ausgeschlossen.',
    consequence: 'Das Modell erhält höhere Signaldichte und weniger widersprüchliche Anweisungen.',
    realWorldContext: 'Begrenzter Context wird als Architektur-Ressource behandelt.',
    failureMode: 'Vermieden: vergifteter Context, der die Aufgabe überstimmt.',
    architectureRule: 'Kritischen Context behalten, Noise ausschließen, Rationale bewahren, Budget einhalten.',
    improvedSolution: 'Als Nächstes klären, was in durable Memory statt Hot-Context gehört.',
    reviewHook: 'capstone_context_strategy',
  },
} satisfies Record<string, Feedback>
