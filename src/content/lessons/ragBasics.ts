import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-05-01 · post-template redesign, HARD. Bespoke puzzle exercises (compose · pick).
// RAG = bring the right EVIDENCE in front of the model. The durable skill is the query-time
// pipeline (embed → retrieve → augment → generate) and telling it apart from offline
// ingestion / orthogonal steps (the compose pool plants those as distractors).
export const ragBasics: Lesson = {
  id: 'LESSON-05-01',
  roadmapNodeId: 'NODE-05-01',
  conceptIds: ['CONCEPT-RET-001', 'CONCEPT-RET-002', 'CONCEPT-RET-003'],
  prerequisites: ['NODE-04-05'],
  title: 'RAG Basics',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Die Retrieval-Pipeline zur Query-Zeit bauen — und von Ingestion/Modellschritten trennen.',
  interactionType: 'pipeline-builder',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-RETRIEVAL-MISMATCH',
  reviewHooks: ['CONCEPT-RET-001', 'pipeline_transfer', 'grounding_eval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'RAG: Evidenz vor das Modell bringen',
      text: 'RAG holt zur Antwortzeit passende Belege und legt sie dem Modell in den Context — statt auf veraltetes Trainingswissen zu hoffen. Wichtig: Was offline passiert (den Korpus aufbereiten), ist nicht Teil des Query-Pfades.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'build-query-path',
        format: 'compose',
        stem: 'Baue den RAG-Pfad, der pro Nutzer-Query läuft. Nicht jeder Baustein gehört hinein.',
        intro: 'Reihenfolge links→rechts = zuerst→zuletzt.',
        pool: [
          { id: 'embed-q', text: 'Query einbetten', correct: true },
          { id: 'retrieve', text: 'Top-k Chunks retrieven', correct: true },
          { id: 'augment', text: 'Chunks in den Prompt einbauen', correct: true },
          { id: 'generate', text: 'Antwort generieren', correct: true },
          { id: 'ingest', text: 'Korpus chunken & embedden', correct: false },
          { id: 'finetune', text: 'Modell fine-tunen', correct: false },
        ],
        orderedCorrect: ['embed-q', 'retrieve', 'augment', 'generate'],
        takeaway: 'Der Query-Pfad ist: Query einbetten → retrieven → in den Prompt → generieren. Korpus aufbereiten ist offline-Ingestion, Fine-Tuning ein ganz anderer Hebel — beide gehören nicht in diesen Pfad.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'why-rag',
        format: 'pick',
        stem: 'Eine Support-Bot-Antwort muss die AKTUELLEN Tarife nennen, die sich monatlich ändern. Was ist der robusteste Ansatz?',
        options: [
          {
            id: 'retrieve',
            text: 'Die aktuellen Tarife zur Antwortzeit retrieven und in den Context legen.',
            correct: true,
            why: 'Die Evidenz lebt außerhalb des Modells und bleibt aktuell; RAG bringt genau den frischen, belegbaren Stand vor das Modell.',
          },
          {
            id: 'finetune',
            text: 'Das Modell monatlich auf die neuen Tarife fine-tunen.',
            correct: false,
            why: 'Teuer, langsam und veraltet sofort wieder — Fakten, die sich häufig ändern, gehören in den Retrieval-Layer, nicht in die Gewichte.',
          },
          {
            id: 'bigger',
            text: 'Ein größeres Modell nehmen — es kennt mehr.',
            correct: false,
            why: 'Größe ändert nichts daran, dass Trainingswissen einen Stichtag hat. Die Tarife von nächstem Monat stehen in keinem Modell.',
          },
          {
            id: 'prompt',
            text: 'Ins System-Prompt schreiben „nenne immer aktuelle Tarife".',
            correct: false,
            why: 'Eine Anweisung erzeugt keine Fakten. Ohne die echten Zahlen im Context rät das Modell — oder halluziniert.',
          },
        ],
        takeaway: 'Häufig wechselnde Fakten gehören in den Retrieval-Layer, nicht in die Modellgewichte oder einen frommen Prompt-Wunsch.',
      },
    },
  ],
}
