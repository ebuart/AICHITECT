import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-11-02 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (categorize ·
// pick). Parallel agents only pay when the work is genuinely independent; shared state and
// dependencies force one bee / sequential. Every extra bee costs you coordination + review.
export const dirOneBeeOrMany: Lesson = {
  id: 'LESSON-11-02',
  roadmapNodeId: 'NODE-11-02',
  conceptIds: ['CONCEPT-DIR-002'],
  prerequisites: ['NODE-11-01'],
  title: 'One Bee or Many',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Erkennen, welche Arbeit sich auf parallele Agenten verteilen lässt — und welche nicht.',
  interactionType: 'architecture-builder',
  visualModelId: 'systemRow',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-DIR-002', 'direction_transfer', 'overengineering_repair'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Eine Biene oder viele?',
      text: 'Mehrere Agenten parallel sehen produktiv aus, kosten aber Koordination, Integration und Review. Parallelisieren lohnt nur, wo die Arbeit wirklich unabhängig ist; geteilter State und Abhängigkeiten gehören an eine Biene oder in eine Reihenfolge.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'parallel-or-not',
        format: 'categorize',
        stem: 'Verteilst du die Arbeit auf mehrere parallele Agenten — oder auf einen/seriell?',
        buckets: [
          { id: 'many', label: 'Mehrere parallel' },
          { id: 'one', label: 'Eine / seriell' },
        ],
        items: [
          { id: 'b-endpoints', text: '5 unabhängige, klar getrennte API-Endpoints implementieren', bucketId: 'many', why: 'Kein geteilter State, kein gegenseitiger Bezug — sauber parallelisierbar.' },
          { id: 'b-refactor', text: 'Ein verzahntes Refactoring quer durch ein Modul', bucketId: 'one', why: 'Alles hängt zusammen; mehrere Agenten würden sich gegenseitig die Annahmen wegziehen.' },
          { id: 'b-samefile', text: 'Dieselbe Datei aus drei Richtungen gleichzeitig ändern', bucketId: 'one', why: 'Geteilter State → Merge-Konflikte und Races; das gehört seriell an eine Biene.' },
          { id: 'b-translate', text: '10 unabhängige Doku-Seiten übersetzen', bucketId: 'many', why: 'Vollständig unabhängig — der ideale Parallelfall.' },
          { id: 'b-chain', text: 'Eine Aufgabe, deren nächster Schritt vom Ergebnis des letzten abhängt', bucketId: 'one', why: 'Abhängige Schritte sind seriell — Parallelität bringt nur Nacharbeit.' },
          { id: 'b-bugfixes', text: 'Mehrere getrennte Bugfixes in verschiedenen Komponenten', bucketId: 'many', why: 'Getrennte Komponenten ohne gemeinsamen State — parallel ok.' },
        ],
        takeaway: 'Parallel nur bei echter Unabhängigkeit; geteilter State und Abhängigkeiten gehören an eine Biene oder in eine Reihenfolge.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'swarm-cost',
        format: 'pick',
        stem: 'Warum ist „mehr Bienen" nicht automatisch besser?',
        options: [
          {
            id: 'coord',
            text: 'Jeder zusätzliche Agent kostet DICH Koordination und Review und erhöht das Konfliktrisiko bei geteiltem State — ab einer kleinen Pod-Größe bremst der nächste mehr, als er beiträgt.',
            correct: true,
            why: 'Die knappe Ressource ist deine Aufmerksamkeit. Mehr parallele Agenten heißt mehr zu integrieren und zu prüfen, nicht linear mehr Wert.',
          },
          {
            id: 'tokens-only',
            text: 'Nur wegen der zusätzlichen Token-Kosten.',
            correct: false,
            why: 'Tokens sind ein Nebeneffekt; der eigentliche Engpass ist Koordination, Integration und Review.',
          },
          {
            id: 'never',
            text: 'Man sollte nie mehr als einen Agenten nehmen.',
            correct: false,
            why: 'Zu streng: bei wirklich unabhängiger Arbeit zahlt sich Parallelität klar aus.',
          },
          {
            id: 'speed',
            text: 'Mehr Agenten sind immer langsamer.',
            correct: false,
            why: 'Bei unabhängigen Tasks sind sie schneller — das Problem ist nicht Tempo, sondern Koordinations- und Konfliktkosten bei Abhängigkeiten.',
          },
        ],
        takeaway: 'Parallelität kostet Koordination und Review — sie lohnt nur, wo die Arbeit wirklich unabhängig ist.',
      },
    },
  ],
}
