import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-12-02 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (order · pick).
// Agents parallelise, but dependencies have gravity — sequence the work so nothing builds on a
// not-yet-settled assumption. The durable skill is releasing dependent tasks in the right order.
export const dirSequenceDependencies: Lesson = {
  id: 'LESSON-12-02',
  roadmapNodeId: 'NODE-12-02',
  conceptIds: ['CONCEPT-DIR-006'],
  prerequisites: ['NODE-12-01'],
  title: 'Sequence the Dependencies',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Ein Feature in eine abhängigkeits-respektierende Reihenfolge bringen.',
  interactionType: 'pipeline-builder',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-RETRIEVAL-MISMATCH',
  reviewHooks: ['CONCEPT-DIR-006', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Nicht alles kann parallel',
      text: 'Bienen arbeiten parallel — aber nur an dem, was nicht aufeinander wartet. Wer das Schema braucht, kann nicht vor dem Schema starten. Abhängige Aufgaben gibst du erst frei, wenn ihre Vorbedingung steht.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'sequence-feature',
        format: 'order',
        stem: 'Ein neues Feature „Bestellungen exportieren". Bring die Teilaufgaben in eine Reihenfolge, die Abhängigkeiten respektiert (zuerst → zuletzt).',
        items: [
          { id: 'q-spec', text: 'Spec + Akzeptanzkriterien festlegen' },
          { id: 'q-schema', text: 'DB-Schema / Migration für die Export-Metadaten' },
          { id: 'q-api', text: 'API-Endpoint, der das Schema nutzt' },
          { id: 'q-ui', text: 'Frontend-Button, der den Endpoint aufruft' },
          { id: 'q-e2e', text: 'E2E-Test über den ganzen Flow' },
        ],
        takeaway: 'Spec zuerst (sie steuert alles), dann Schema → Endpoint → Frontend → E2E. Jede Stufe braucht die darunter als feste Grundlage.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'why-sequence',
        format: 'pick',
        stem: 'Warum nicht einfach alle Teilaufgaben gleichzeitig an parallele Agenten geben — das wäre doch am schnellsten?',
        options: [
          {
            id: 'rework',
            text: 'Abhängige Agenten würden auf noch wackelnden Annahmen bauen (Schema, Endpoint-Form) → teure Nacharbeit, sobald die Vorstufe sich ändert.',
            correct: true,
            why: 'Parallel gestartete Arbeit auf instabilen Vorbedingungen muss man oft wegwerfen. Erst freigeben, wenn die Grundlage steht.',
          },
          {
            id: 'tokens',
            text: 'Weil parallele Agenten zu viele Tokens verbrauchen.',
            correct: false,
            why: 'Kosten sind nicht der Punkt — das Problem ist Nacharbeit durch instabile Abhängigkeiten.',
          },
          {
            id: 'always-serial',
            text: 'Weil man Agenten grundsätzlich immer seriell laufen lassen sollte.',
            correct: false,
            why: 'Unabhängige Teile dürfen sehr wohl parallel laufen — nur abhängige nicht.',
          },
          {
            id: 'confuse',
            text: 'Weil die Agenten sich sonst gegenseitig verwirren.',
            correct: false,
            why: 'Sie laufen isoliert; das Problem ist nicht Verwirrung, sondern das Bauen auf ungesicherten Vorbedingungen.',
          },
        ],
        takeaway: 'Unabhängiges parallel, Abhängiges in Reihenfolge — sonst zahlst du die Geschwindigkeit in Nacharbeit zurück.',
      },
    },
  ],
}
