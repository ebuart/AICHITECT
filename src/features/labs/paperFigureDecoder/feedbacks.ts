import type { Feedback } from '@/types'

// Feedback library for the Paper Figure Decoder (analyzes the reading of the figure,
// not the learner — FB-002). Frames over-generalization of a frontier result.
export const pfdFeedback = {
  figureReadingMismatch: {
    id: 'FB-PFD-MISREAD-FIGURE',
    severity: 'critical',
    decision: 'Die Figure wurde falsch gelesen oder übergeneralisiert.',
    consequence: 'Aus einem bedingten Benchmark-Ergebnis wird eine pauschale „X ist immer besser“-Regel.',
    realWorldContext: 'Paper-Figures zeigen ein Ergebnis unter konkreten Bedingungen — nicht ein universelles Gesetz.',
    failureMode: 'Eine Methode wird überall eingesetzt, wo ihr Vorteil gar nicht greift.',
    architectureRule: 'Lies zuerst, was die Figure unter welchen Bedingungen zeigt — dann erst verallgemeinere vorsichtig.',
    improvedSolution: 'Die Achsen/Bedingungen prüfen (welcher Korpus, welche Metrik) und die Aussage daran binden.',
    reviewHook: 'visual_retrieval_transfer',
  },
  decisionMismatch: {
    id: 'FB-PFD-WRONG-DECISION',
    severity: 'risk',
    decision: 'Die abgeleitete Architektur-Entscheidung passt nicht zum Figure-Ergebnis.',
    consequence: 'Du baust eine teurere/komplexere Pipeline, wo das Ergebnis sie nicht rechtfertigt — oder umgekehrt.',
    realWorldContext: 'Eine Methode lohnt nur dort, wo ihre Bedingung (z. B. visuelle Struktur) tatsächlich vorliegt.',
    failureMode: 'Frontier-Technik als Default statt als gezielte, bedingte Entscheidung.',
    architectureRule: 'Leite die Entscheidung aus der Bedingung der Figure ab, nicht aus dem Hype um die Methode.',
    improvedSolution: 'Die Methode genau dort einsetzen, wo das Profil ihren Vorteil zeigt; sonst die einfachere behalten.',
    reviewHook: 'retrieval_method_transfer',
  },
  clean: {
    id: 'FB-PFD-CLEAN',
    severity: 'strong',
    decision: 'Figure korrekt gelesen und die passende, bedingte Architektur-Entscheidung abgeleitet.',
    consequence: 'Die Methode wird genau dort eingesetzt, wo ihr Vorteil real ist — nicht pauschal.',
    realWorldContext: 'So liest man Research für Entscheidungen: Bedingung erkennen, dann gezielt anwenden.',
    failureMode: 'Vermieden: Übergeneralisierung und Frontier-Technik als Default.',
    architectureRule: 'Bedingung der Figure → gezielte Entscheidung; einfachste Methode bleibt Default.',
    improvedSolution: 'Im Zweifel mit einem Eval auf dem eigenen Korpus prüfen, bevor du umstellst.',
    reviewHook: 'visual_retrieval_transfer',
  },
} satisfies Record<string, Feedback>
