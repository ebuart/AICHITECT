import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-11-03 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (budget ·
// pick). A director's attention is finite — allocate review effort by damage-if-wrong, not
// evenly. The `budget` mechanic verifies a risk-weighted allocation against per-task ranges.
export const dirAllocateOversight: Lesson = {
  id: 'LESSON-11-03',
  roadmapNodeId: 'NODE-11-03',
  conceptIds: ['CONCEPT-DIR-003'],
  prerequisites: ['NODE-11-02'],
  title: 'Allocate Your Oversight',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Knappe Aufsicht risikogewichtet verteilen statt gleichmäßig.',
  interactionType: 'context-allocator',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-CONTEXT-NOISE',
  reviewHooks: ['CONCEPT-DIR-003', 'direction_transfer', 'allocation_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Aufmerksamkeit ist die knappste Ressource',
      text: 'Arbeiten mehrere Bienen parallel, kannst du nicht alles gleich genau prüfen. Gewichte die Aufsicht nach Schaden-wenn-falsch: irreversibel und teuer = genau hinsehen; reversibel und harmlos = durchwinken.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'allocate-review',
        format: 'budget',
        stem: 'Du hast 60 Minuten Review-Zeit für fünf parallele Agenten-Tasks. Verteile sie nach Risiko.',
        unit: 'Min',
        total: 60,
        step: 5,
        items: [
          { id: 'payment', label: 'Payment-Logik ändern (irreversibel, Geld)', min: 20, max: 30, hint: 'Hoher, irreversibler Schaden — genau prüfen.' },
          { id: 'migration', label: 'DB-Migration (potenziell destruktiv)', min: 15, max: 25, hint: 'Datenverlust möglich — gründlich.' },
          { id: 'auth', label: 'Auth-/Permission-Check', min: 15, max: 25, hint: 'Sicherheitskritisch.' },
          { id: 'readme', label: 'README aktualisieren', min: 0, max: 5, hint: 'Trivial, reversibel — durchwinken.' },
          { id: 'styling', label: 'Button-Styling anpassen', min: 0, max: 5, hint: 'Harmlos, sofort sichtbar.' },
        ],
        takeaway: 'Die Aufsicht folgt dem Schaden-wenn-falsch: Payment, Migration und Auth bekommen fast deine ganze Zeit; README und Styling kaum welche.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'even-is-wrong',
        format: 'pick',
        stem: 'Warum ist „jede Aufgabe gleich genau prüfen" die falsche Default-Haltung?',
        options: [
          {
            id: 'risk',
            text: 'Aufmerksamkeit ist endlich — gleichmäßig verteilt bekommt der gefährliche Payment-Task zu wenig und das harmlose Styling zu viel.',
            correct: true,
            why: 'Gleichverteilung ignoriert das Risiko. Die knappe Ressource gehört dorthin, wo ein Fehler am meisten kostet.',
          },
          {
            id: 'fair',
            text: 'Gleichmäßig ist am fairsten gegenüber den Agenten.',
            correct: false,
            why: 'Fairness gegenüber Tasks ist kein Ziel — Schadensbegrenzung ist es.',
          },
          {
            id: 'time',
            text: 'Gar nicht falsch — man sollte einfach alles gründlich prüfen.',
            correct: false,
            why: 'Bei mehreren parallelen Agenten reicht die Zeit dafür nicht; du musst priorisieren.',
          },
          {
            id: 'auto',
            text: 'Man sollte stattdessen gar nichts prüfen und den Agenten vertrauen.',
            correct: false,
            why: 'Das andere Extrem: gerade die irreversiblen, teuren Tasks brauchen deinen Blick.',
          },
        ],
        takeaway: 'Gleichverteilung ist die feige Antwort — gewichte die Aufsicht nach Schaden-wenn-falsch.',
      },
    },
  ],
}
