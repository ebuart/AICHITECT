import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-11-01 · DIRECTION track opener, post-template redesign. Bespoke puzzle exercises
// (categorize · pick). The shift from builder to director: your leverage stops being writing
// code and becomes defining success, decomposing, setting boundaries and accepting work.
export const dirFromBuilderToDirector: Lesson = {
  id: 'LESSON-11-01',
  roadmapNodeId: 'NODE-11-01',
  conceptIds: ['CONCEPT-DIR-001'],
  prerequisites: ['NODE-10-05'],
  title: 'From Builder to Director',
  estimatedMinutes: 6,
  lessonMode: 'scenario-first',
  learningGoal: 'Vom Selbst-Bauen zum Dirigieren wechseln: den eigenen Hebel neu verorten.',
  interactionType: 'context-budget-board',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-CONTEXT-NOISE',
  reviewHooks: ['CONCEPT-DIR-001', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Du baust nicht mehr — du richtest aus',
      text: 'Ein Senior, der mit AI ein ganzes System baut, schreibt kaum Code: er DIRIGIERT die Agenten („Bienen") mit seinem Überblick. Sein Hebel verschiebt sich vom Tippen zum Ziel-Definieren, Zerlegen, Grenzen-Setzen und Abnehmen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'director-vs-builder',
        format: 'categorize',
        stem: 'Was ist deine Arbeit als Direktor — was überlässt du dem ausführenden Agenten?',
        buckets: [
          { id: 'director', label: 'Direktor (du)' },
          { id: 'builder', label: 'Ausführung (Agent)' },
        ],
        items: [
          { id: 'd-success', text: 'Den Erfolg der Aufgabe definieren (Akzeptanzkriterien)', bucketId: 'director', why: 'Niemand sonst kann sagen, wann „fertig" wirklich fertig ist — das ist Director-Kernarbeit.' },
          { id: 'd-impl', text: 'Die konkrete Funktion implementieren', bucketId: 'builder', why: 'Das Tippen ist genau die Arbeit, die der Agent übernimmt.' },
          { id: 'd-decompose', text: 'Entscheiden, welche Teilaufgaben überhaupt nötig sind', bucketId: 'director', why: 'Die Zerlegung braucht den Überblick übers Ganze — deine Aufgabe.' },
          { id: 'd-bugfix', text: 'Einen Bug im generierten Code beheben', bucketId: 'builder', why: 'Das delegierst du zurück an den Agenten (mit klarem Hinweis), statt selbst zu patchen.' },
          { id: 'd-accept', text: 'Den Output gegen den Brief abnehmen', bucketId: 'director', why: 'Abnahme ist Richtungsarbeit: nur du hältst den Brief gegen das Ergebnis.' },
          { id: 'd-boiler', text: 'Boilerplate und Tests schreiben', bucketId: 'builder', why: 'Mechanische Ausführung — billig zu delegieren.' },
        ],
        takeaway: 'Director-Arbeit ist Ziel, Zerlegung, Grenzen und Abnahme; Ausführung (Implementieren, Fixen, Boilerplate) geht an den Agenten.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'leverage-shift',
        format: 'pick',
        stem: 'Was ist dein Hebel als Direktor eines Agenten-Schwarms?',
        options: [
          {
            id: 'direction',
            text: 'Ziel und Erfolg definieren, zerlegen, Grenzen setzen und abnehmen — die Richtung, nicht das Tippen.',
            correct: true,
            why: 'Wenn Agenten den Code schreiben, entscheidet, wer gut briefen, zerlegen und prüfen kann. Genau das skaliert.',
          },
          {
            id: 'faster-code',
            text: 'Selbst schneller Code schreiben als die Agenten.',
            correct: false,
            why: 'Das ist die Builder-Rolle, die du gerade verlässt — und sie skaliert nicht über einen Schwarm.',
          },
          {
            id: 'most-tools',
            text: 'Dem Agenten möglichst viele Tools und Rechte geben.',
            correct: false,
            why: 'Mehr Fähigkeiten ohne klare Richtung erzeugt mehr ungeprüften Output, nicht mehr Wert.',
          },
          {
            id: 'review-all',
            text: 'Jede einzelne Code-Zeile selbst nachschreiben/prüfen.',
            correct: false,
            why: 'Das fällt zurück in Builder-Arbeit und wird zum Flaschenhals — du prüfst gegen den Brief, nicht Zeile für Zeile.',
          },
        ],
        takeaway: 'Als Direktor ist deine knappe, wertvolle Arbeit die Richtung: definieren, zerlegen, begrenzen, abnehmen.',
      },
    },
  ],
}
