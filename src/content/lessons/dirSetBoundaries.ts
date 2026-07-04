import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-11-04 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (categorize ·
// pick). The director sets boundaries BEFORE launch: what a delegated agent may do directly,
// what needs a check-back, what is forbidden — so a misunderstanding can't become damage.
export const dirSetBoundaries: Lesson = {
  id: 'LESSON-11-04',
  roadmapNodeId: 'NODE-11-04',
  conceptIds: ['CONCEPT-DIR-004'],
  prerequisites: ['NODE-11-03'],
  title: 'Set the Delegation Boundaries',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Vor dem Delegieren festlegen, was ein Agent direkt darf, was er rückfragen muss, was verboten ist.',
  interactionType: 'trust-boundary',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-BROAD-TOOL-PERMISSION',
  reviewHooks: ['CONCEPT-DIR-004', 'direction_transfer', 'trust_boundary_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Grenzen ziehst du VOR dem Start',
      text: 'Ein Agent mit zu breitem Zugriff macht aus einem Missverständnis einen Schaden. Vor dem Delegieren legst du fest, was die Biene direkt anfassen darf, was sie erst rückfragen muss und was tabu ist.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'delegation-scope',
        format: 'categorize',
        stem: 'Auftrag: „Füge der API einen Rate-Limiter hinzu." Was darf der Agent — was nicht?',
        buckets: [
          { id: 'allowed', label: 'Direkt erlaubt' },
          { id: 'ask', label: 'Erst rückfragen' },
          { id: 'forbidden', label: 'Verboten' },
        ],
        items: [
          { id: 's-add', text: 'Den Rate-Limiter-Code im api/-Ordner hinzufügen', bucketId: 'allowed', why: 'Genau die beauftragte Arbeit am erwarteten Ort.' },
          { id: 's-tests', text: 'Bestehende Tests anpassen, die durch die Änderung brechen', bucketId: 'allowed', why: 'Erwarteter Teil der Aufgabe — solange die Intention der Tests erhalten bleibt.' },
          { id: 's-dep', text: 'Eine neue externe Dependency hinzufügen', bucketId: 'ask', why: 'Wirkt über die Aufgabe hinaus (Security, Wartung) — kurz rückfragen.' },
          { id: 's-schema', text: 'Das Datenbank-Schema migrieren', bucketId: 'ask', why: 'Außerhalb des erwarteten Scopes und potenziell destruktiv — erst klären.' },
          { id: 's-refactor', text: 'Unbeteiligte Module refactoren, die ihm im Weg scheinen', bucketId: 'forbidden', why: 'Klassischer Scope-Creep — gehört nicht zum Auftrag, erzeugt Risiko ohne Auftrag.' },
          { id: 's-secrets', text: 'Produktions-Config oder Secrets ändern', bucketId: 'forbidden', why: 'Hochriskant und nie Teil eines Feature-Auftrags — hartes Tabu.' },
        ],
        takeaway: 'Erlaubt ist die beauftragte Arbeit am erwarteten Ort; rückfragen bei Wirkung über den Scope hinaus; verboten sind Scope-Creep und Prod-/Secret-Zugriff.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'when-boundaries',
        format: 'pick',
        stem: 'Wann legst du diese Grenzen fest?',
        options: [
          {
            id: 'before',
            text: 'Vor dem Start, explizit im Brief — danach kann der Agent nicht mehr versehentlich anrichten, was er gar nicht durfte.',
            correct: true,
            why: 'Grenzen vorab sind Prävention. Hinterher ist der Scope-Creep oder die Migration schon passiert.',
          },
          {
            id: 'after',
            text: 'Hinterher beim Review — da sieht man ja, was er gemacht hat.',
            correct: false,
            why: 'Dann ist der Schaden schon da; Review fängt nur, was die fehlende Grenze bereits zugelassen hat.',
          },
          {
            id: 'never',
            text: 'Gar nicht — ein guter Agent hält sich schon an den Sinn der Aufgabe.',
            correct: false,
            why: 'Ohne explizite Grenzen interpretiert er Lücken nach eigenem Gutdünken — genau dort entsteht Scope-Creep.',
          },
          {
            id: 'onlyrisky',
            text: 'Nur bei offensichtlich riskanten Aufträgen.',
            correct: false,
            why: 'Auch harmlose Aufträge driften ohne Grenzen (unbeteiligte Refactors, neue Deps) — Grenzen gehören zu jedem Brief.',
          },
        ],
        takeaway: 'Grenzen setzt du vorab im Brief — sie sind Prävention, nicht Nachkontrolle.',
      },
    },
  ],
}
