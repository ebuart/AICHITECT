import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-00-01 · the entry node, post-template redesign. Bespoke puzzle exercises (categorize ·
// pick). AI Engineering = composing and directing existing models into reliable SYSTEMS
// (retrieval, tools, evals, guardrails) — distinct from ML Engineering (training models).
export const whatAiEngineeringBuilds: Lesson = {
  id: 'LESSON-00-01',
  roadmapNodeId: 'NODE-00-01',
  conceptIds: ['CONCEPT-AIE-001'],
  prerequisites: [],
  title: 'What AI Engineering Actually Builds',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'AI Engineering (Modelle zu Systemen komponieren) von ML Engineering (Modelle trainieren) trennen.',
  interactionType: 'failure-mode-tree',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-001', 'failure_mode_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Komponieren, nicht trainieren',
      text: 'AI Engineering baut verlässliche Systeme AUS vorhandenen Modellen — Retrieval, Tools, Evals, Guardrails, Kontroll-Fluss. ML Engineering baut die Modelle selbst (trainieren, Daten, Architektur). Zwei verschiedene Berufe.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-vs-mle',
        format: 'categorize',
        stem: 'Wessen Arbeit ist das?',
        buckets: [
          { id: 'aie', label: 'AI Engineering' },
          { id: 'mle', label: 'ML Engineering' },
        ],
        items: [
          { id: 'w-rag', text: 'Eine RAG-Pipeline über die Firmen-Docs bauen', bucketId: 'aie', why: 'Vorhandene Modelle zu einem System verschalten — Kerngeschäft AI Engineering.' },
          { id: 'w-train', text: 'Ein neues Embedding-Modell von Grund auf trainieren', bucketId: 'mle', why: 'Ein Modell selbst erzeugen — ML Engineering.' },
          { id: 'w-tools', text: 'Tool-Contracts und Approval-Gates für einen Agenten entwerfen', bucketId: 'aie', why: 'Interface- und Governance-Arbeit um das Modell herum.' },
          { id: 'w-loss', text: 'Loss-Funktion und Lernrate eines Modells tunen', bucketId: 'mle', why: 'Im Inneren des Trainings — ML Engineering.' },
          { id: 'w-eval', text: 'Einen Eval-Harness für Task-Erfolg in Produktion bauen', bucketId: 'aie', why: 'System-Qualität messen — AI Engineering.' },
          { id: 'w-data', text: 'Einen Pretraining-Datensatz kuratieren und labeln', bucketId: 'mle', why: 'Trainingsdaten erzeugen — gehört zum Modellbau.' },
        ],
        takeaway: 'AI Engineering arbeitet UM das Modell herum (Retrieval, Tools, Evals, Guardrails); ML Engineering arbeitet IM Modell (Daten, Training, Architektur).',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-core',
        format: 'pick',
        stem: 'Worum dreht sich AI Engineering im Kern?',
        options: [
          {
            id: 'compose',
            text: 'Vorhandene Modelle zu verlässlichen Systemen komponieren und dirigieren — Retrieval, Tools, Evals, Guardrails, Kontroll-Fluss.',
            correct: true,
            why: 'Genau das ist die durable Kompetenz: das System um das Modell, das mit besseren Modellen nur stärker wird.',
          },
          {
            id: 'train',
            text: 'Bessere Modelle trainieren.',
            correct: false,
            why: 'Das ist ML Engineering. AI Engineering nimmt Modelle als gegeben und baut Systeme damit.',
          },
          {
            id: 'prompt',
            text: 'Möglichst clevere Prompts schreiben.',
            correct: false,
            why: 'Prompting ist ein kleines, vergängliches Teilstück — die Architektur (Kontext, Tools, Evals) trägt das System.',
          },
          {
            id: 'api',
            text: 'Einfach eine LLM-API aufrufen.',
            correct: false,
            why: 'Ein API-Call ist die Demo. Zum verlässlichen System fehlen Evidenz-Versorgung, Messung und Eindämmung.',
          },
        ],
        takeaway: 'AI Engineering ist System-Bau um das Modell herum — die Fähigkeit, die mit jedem stärkeren Modell wertvoller wird.',
      },
    },
  ],
}
