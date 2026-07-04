import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-06-04 · post-template redesign, HARD. Bespoke puzzle exercises (multispot · pick). Over
// months an agent-driven project drifts unless durable docs are kept coherent. The durable skill
// is spotting the gaps that let a long project lose its state, constraints and resumability.
export const longRunningProjects: Lesson = {
  id: 'LESSON-06-04',
  roadmapNodeId: 'NODE-06-04',
  conceptIds: ['CONCEPT-REPO-004'],
  prerequisites: ['NODE-06-03'],
  title: 'Long-Running Agent Projects',
  estimatedMinutes: 8,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Die Lücken erkennen, an denen ein langes Projekt Zustand, Constraints und Wiedereinstieg verliert.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-DOC-DUPLICATION',
  reviewHooks: ['CONCEPT-REPO-004', 'source_material_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Drift über Monate',
      text: 'Ein Projekt im fünften Monat lebt von seiner Control Plane: stabile Regeln, durable Fortschritts-Memory, klarer Wiedereinstieg. Wo diese Praxis Lücken hat, beginnt der Stand zu driften.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'drift-gaps',
        format: 'multispot',
        stem: 'Praxis-Inventar des Projekts. Tippe jede Zeile an, die eine Lücke ist, durch die das Projekt driftet.',
        lines: [
          { id: 'g1', text: 'Entscheidungen landen im Decision Log mit absolutem Datum und Begründung.' },
          { id: 'g2', text: 'Offene Fragen haben keinen festen Ort — sie leben nur im Chatverlauf.', isAttack: true, note: 'Mit der Session weg: dieselben Fragen werden Monat für Monat neu „entdeckt".' },
          { id: 'g3', text: 'Das Feature Ledger wird nach jedem Meilenstein aktualisiert.' },
          { id: 'g4', text: 'Niemand prüft, ob der Code noch zu den Control-Docs passt.', isAttack: true, note: 'Ohne Drift-Check schleichen sich Abweichungen von den eigenen Regeln unbemerkt ein.' },
          { id: 'g5', text: 'Jede Session startet mit einer Zusammenfassung des durablen Zustands.' },
          { id: 'g6', text: 'Dieselbe Architektur-Entscheidung steht in drei Dokumenten leicht unterschiedlich.', isAttack: true, note: 'Doku-Duplikation: widersprüchliche Versionen — welche ist autoritativ? Eine Quelle der Wahrheit fehlt.' },
          { id: 'g7', text: 'Es gibt keinen festen Wiedereinstiegspunkt; neue Sessions raten den Stand.', isAttack: true, note: 'Ohne klaren „Hier weitermachen"-Anker beginnt jede Session mit Raten — teuer und fehleranfällig.' },
        ],
        takeaway: 'Lange Projekte driften an fehlenden offenen Fragen, fehlenden Drift-Checks, widersprüchlicher Doku und fehlendem Wiedereinstieg — alles Eigenschaften der Control Plane, nicht des Modells.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'drift-core',
        format: 'pick',
        stem: 'Was ist die Kern-Gefahr eines monatelangen, agentengetriebenen Projekts?',
        options: [
          {
            id: 'drift',
            text: 'Ohne gepflegte durable Doku driftet es: Wissen aus alten Läufen geht verloren, Constraints werden still verletzt, Dokumente widersprechen sich.',
            correct: true,
            why: 'Der Agent trägt nichts über Läufe — nur die Doku tut es. Verfällt sie, verliert das Projekt Gedächtnis und Leitplanken.',
          },
          {
            id: 'context',
            text: 'Dass irgendwann das Context-Fenster für die ganze Historie zu klein wird.',
            correct: false,
            why: 'Man lädt nie die ganze Historie — gebraucht wird die destillierte, durable Essenz, nicht das Rohtranskript.',
          },
          {
            id: 'model',
            text: 'Dass das Modell über die Zeit „schlechter" wird.',
            correct: false,
            why: 'Das Modell ändert sich nicht von selbst; was driftet, ist der ungepflegte Projektzustand.',
          },
          {
            id: 'cost',
            text: 'Die über Monate auflaufenden Token-Kosten.',
            correct: false,
            why: 'Kosten sind ein Nebenthema; die eigentliche Gefahr ist Drift von Zustand und Constraints.',
          },
        ],
        takeaway: 'Die Gefahr ist Drift — und die Gegenmaßnahme ist eine gepflegte Control Plane (Regeln, Memory, offene Fragen, eine Quelle der Wahrheit), nicht ein größeres Modell oder Fenster.',
      },
    },
  ],
}
