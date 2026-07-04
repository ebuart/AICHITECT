import type { Feedback } from '@/types'

// Feedback library for the Architecture Builder (interactions/23 patterns).
export const archFeedback = {
  incomplete: {
    id: 'FB-ARCH-INCOMPLETE',
    severity: 'risk',
    decision: 'Dem System fehlt eine geforderte Capability (z. B. Retrieval oder Eval).',
    consequence: 'Ohne sie kann das System die Aufgabe nicht verlässlich oder messbar erfüllen.',
    realWorldContext: 'Augmented LLMs brauchen Retrieval für aktuelle Evidenz und Evals für Verlässlichkeit.',
    failureMode: 'Demo funktioniert einmal, ist aber ungegroundet oder nicht wartbar.',
    architectureRule: 'Decke alle geforderten Capabilities ab — Grounding und Messbarkeit nicht vergessen.',
    improvedSolution: 'Fehlende Komponente ergänzen (Retrieval, Eval/Observability), dann erst optimieren.',
    reviewHook: 'architecture_transfer',
  },
  overengineered: {
    id: 'FB-PATTERN-OVERENGINEERED-AGENTS',
    severity: 'critical',
    decision: 'Das System ist komplexer als nötig (verbotenes Muster oder redundante Komponente).',
    consequence: 'Kosten, Latenz und Fehlerfläche steigen ohne passenden Nutzen.',
    realWorldContext: 'Viele Systeme starten als Workflows, weil Kontrolle und Eval klarer sind.',
    failureMode: 'Aufschaukelnde Fehler und unklare Verantwortung über Komponenten hinweg.',
    architectureRule: 'Simplicity before Agency — die einfachste tragfähige Struktur gewinnt.',
    improvedSolution: 'Verbotene/überzählige Komponenten entfernen; nur Benötigtes behalten.',
    reviewHook: 'overengineering_repair',
  },
  clean: {
    id: 'FB-ARCH-CLEAN',
    severity: 'strong',
    decision: 'Du hast die einfachste Struktur gewählt, die alle Capabilities abdeckt.',
    consequence: 'Das System ist leichter zu testen, zu beobachten und zu warten.',
    realWorldContext: 'Die Basiseinheit (Augmented LLM) deckt genau die nötigen Layer ab.',
    failureMode: 'Vermieden: unnötige Agenten und vergessene Eval/Observability.',
    architectureRule: 'Capability-Coverage + Simplicity + keine Redundanz.',
    improvedSolution: 'Als Nächstes Boundaries und Trace-Punkte ergänzen, bevor du skalierst.',
    reviewHook: 'capstone_draft',
  },
} satisfies Record<string, Feedback>
