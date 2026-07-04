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
        stem: 'Ein interner Assistent beantwortet Fragen zum Compliance-Handbuch (400 Seiten, ändert sich quartalsweise; Antworten müssen die einschlägige Stelle nennen). Drei Teams schlagen je einen Ansatz vor — welcher trägt?',
        options: [
          {
            id: 'retrieve',
            text: 'Das Handbuch indexieren und pro Frage die passenden Abschnitte retrieven — Antwort mit Verweis auf die Stelle.',
            correct: true,
            why: 'Retrieval zielt pro Frage auf die relevanten Passagen, bleibt beim Quartals-Update aktuell (neu indexieren) und liefert die zitierbare Stelle gleich mit.',
          },
          {
            id: 'finetune',
            text: 'Das Modell jedes Quartal auf das neue Handbuch fine-tunen — dann „kennt" es die Regeln selbst.',
            correct: false,
            why: 'Fühlt sich gründlich an, ist aber der falsche Hebel: Gewichte geben keine zitierbare Stelle her, einzelne Klauseln werden unzuverlässig erinnert, und zwischen den Tunings ist der Stand alt.',
          },
          {
            id: 'longctx',
            text: 'Das ganze Handbuch bei jedem Aufruf in den Context legen — die Fenster sind heute groß genug.',
            correct: false,
            why: 'Geht technisch, skaliert aber schlecht: 400 Seiten pro Aufruf kosten Latenz und Geld, verdünnen die Aufmerksamkeit auf die eine relevante Klausel und machen den Verweis nicht präziser. Retrieval holt gezielt statt alles.',
          },
          {
            id: 'disclaimer',
            text: 'Das Modell aus seinem Allgemeinwissen antworten lassen und einen Hinweis „ohne Gewähr" anhängen.',
            correct: false,
            why: 'Verantwortungsvoll verpackt, aber ungestützt: Compliance-Antworten ohne Quellen-Deckung sind genau der Vorfall, den man vermeiden will — ein Disclaimer repariert keine falsche Auskunft.',
          },
        ],
        takeaway: 'Retrieval ist der Hebel, wenn Antworten auf einen großen, wechselnden Korpus zeigen müssen: gezielt holen schlägt Gewichte (nicht zitierbar, träge) und Volltext-Dumps (teuer, verwässert).',
      },
    },
  ],
}
