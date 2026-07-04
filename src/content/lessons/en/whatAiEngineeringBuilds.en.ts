import type { Lesson } from '@/features/lessons/lessonModel'

// EN translation of NODE-00-01 (pilot arc, DEC-0015/0016). Keep in sync with the German
// original: same ids, same structure, same pedagogy — only the learner-facing text differs.
export const whatAiEngineeringBuildsEn: Lesson = {
  id: 'LESSON-00-01',
  roadmapNodeId: 'NODE-00-01',
  conceptIds: ['CONCEPT-AIE-001'],
  prerequisites: [],
  title: 'What AI Engineering Actually Builds',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Separate AI engineering (composing models into systems) from ML engineering (training models).',
  interactionType: 'failure-mode-tree',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-001', 'failure_mode_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Compose, don’t train',
      text: 'AI engineering builds reliable systems OUT OF existing models — retrieval, tools, evals, guardrails, control flow. ML engineering builds the models themselves (training, data, architecture). Two different professions.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-vs-mle',
        format: 'categorize',
        stem: 'Whose job is this?',
        buckets: [
          { id: 'aie', label: 'AI engineering' },
          { id: 'mle', label: 'ML engineering' },
        ],
        items: [
          { id: 'w-rag', text: 'Build a RAG pipeline over the company docs', bucketId: 'aie', why: 'Wiring existing models into a system — the core of AI engineering.' },
          { id: 'w-train', text: 'Train a new embedding model from scratch', bucketId: 'mle', why: 'Producing a model itself — ML engineering.' },
          { id: 'w-tools', text: 'Design tool contracts and approval gates for an agent', bucketId: 'aie', why: 'Interface and governance work around the model.' },
          { id: 'w-loss', text: 'Tune a model’s loss function and learning rate', bucketId: 'mle', why: 'Inside the training loop — ML engineering.' },
          { id: 'w-eval', text: 'Build an eval harness for task success in production', bucketId: 'aie', why: 'Measuring system quality — AI engineering.' },
          { id: 'w-data', text: 'Curate and label a pretraining dataset', bucketId: 'mle', why: 'Producing training data — part of building the model.' },
        ],
        takeaway: 'AI engineering works AROUND the model (retrieval, tools, evals, guardrails); ML engineering works INSIDE the model (data, training, architecture).',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-core',
        format: 'pick',
        stem: 'What is AI engineering fundamentally about?',
        options: [
          {
            id: 'compose',
            text: 'Composing and directing existing models into reliable systems — retrieval, tools, evals, guardrails, control flow.',
            correct: true,
            why: 'Exactly the durable competence: the system around the model, which only grows more valuable as models improve.',
          },
          {
            id: 'train',
            text: 'Training better models.',
            correct: false,
            why: 'That is ML engineering. AI engineering takes models as given and builds systems with them.',
          },
          {
            id: 'prompt',
            text: 'Writing the cleverest possible prompts.',
            correct: false,
            why: 'Prompting is a small, perishable piece — the architecture (context, tools, evals) is what carries the system.',
          },
          {
            id: 'api',
            text: 'Just calling an LLM API.',
            correct: false,
            why: 'An API call is the demo. A reliable system still needs evidence supply, measurement, and containment.',
          },
        ],
        takeaway: 'AI engineering is system-building around the model — the skill that gets more valuable with every stronger model.',
      },
    },
  ],
}
