import type { Feedback } from '@/types'

// Feedback library for the Repo Refactor lab (analyzes the refactor choice, not the
// learner — FB-002). Each entry frames a root-cause fix vs a symptom patch.
export const rrFeedback = {
  durableStateMismatch: {
    id: 'FB-RR-DURABLE-STATE',
    severity: 'risk',
    decision: 'Der gewählte Umgang mit durable State fixt die Ursache nicht.',
    consequence: 'Entscheidungen/Constraints driften oder gehen verloren; jeder, der später dazukommt, rät.',
    realWorldContext: 'Chat-Memory ist flüchtig; duplizierte Regeln driften — durable State braucht eine Owner-Stelle.',
    failureMode: 'Verlorene oder widersprüchliche Entscheidungen über Sessions/Docs hinweg.',
    architectureRule: 'Durable State gehört in eine Owner-Doc (Decision-Log/Ledger), referenziert per ID — nicht in Chat oder Kopien.',
    improvedSolution: 'Die Entscheidung an die autoritative Stelle schreiben und andernorts nur referenzieren.',
    reviewHook: 'source_material_transfer',
  },
  smallComponentsMismatch: {
    id: 'FB-RR-MONSTER-FILE',
    severity: 'risk',
    decision: 'Die Monster-Datei wurde nicht nach Verantwortung getrennt.',
    consequence: 'Änderungen bleiben riskant und schwer testbar; der Agent kann nicht gezielt editieren.',
    realWorldContext: 'Kommentare oder eine Abstraktionsschicht obendrauf machen ein überladenes File nicht testbar.',
    failureMode: 'Eine Änderung bricht unverwandte Logik im selben File.',
    architectureRule: 'Splitte nach Verantwortung in kleine, einzweckige Units, bevor du erweiterst.',
    improvedSolution: 'UI/Logik/Content (bzw. plan/act/observe) in eigene Module trennen.',
    reviewHook: 'conventions_transfer',
  },
  legibilityMismatch: {
    id: 'FB-RR-ILLEGIBLE',
    severity: 'risk',
    decision: 'Die Lesbarkeit des Repos wurde nicht verbessert.',
    consequence: 'Menschen und Agents missverstehen die Architektur weiter und legen Code falsch ab.',
    realWorldContext: 'Längere Prompts oder zufälliges Umbenennen beheben keine unlesbare Struktur.',
    failureMode: 'Wiederholtes Fehlplatzieren und Re-Implementieren vorhandener Teile.',
    architectureRule: 'Mache die Struktur selbst lesbar: Feature-Folder, klare Namen, vorhersehbare Orte.',
    improvedSolution: 'Nach Feature gliedern und sprechend benennen, statt das Symptom im Prompt zu patchen.',
    reviewHook: 'repo_legibility_transfer',
  },
  clean: {
    id: 'FB-RR-CLEAN',
    severity: 'strong',
    decision: 'Jedes Problem auf der richtigen Ebene behoben: durable State, kleine Units, lesbare Struktur.',
    consequence: 'Das Repo bleibt für Menschen und Agents wartbar — Änderungen sind lokal und sicher.',
    realWorldContext: 'Wartbarkeit entsteht aus Owner-Docs, kleinen Units und lesbarer Struktur, nicht aus Prompt-Patches.',
    failureMode: 'Vermieden: verlorene Entscheidungen, Monster-Files und unlesbare Repos.',
    architectureRule: 'Fixe die Ursache auf ihrer Ebene; das Repo ist die erste Doku.',
    improvedSolution: 'Als Nächstes die Konventionen als Regel festhalten, damit sie für das Team gelten.',
    reviewHook: 'team_scale_transfer',
  },
} satisfies Record<string, Feedback>
