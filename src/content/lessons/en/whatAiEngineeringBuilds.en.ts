import type { Lesson } from '@/features/lessons/lessonModel'

// EN variant of NODE-00-01 (DEC-0016). Mirrors the German structurally (ids, flags,
// buckets); text follows the control/10 VX voice rules in English.
export const whatAiEngineeringBuildsEn: Lesson = {
  id: 'LESSON-00-01',
  roadmapNodeId: 'NODE-00-01',
  conceptIds: ['CONCEPT-AIE-001'],
  prerequisites: [],
  title: 'What AI Engineering Actually Builds',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Tell AI engineering (building systems out of models) apart from ML engineering (building models).',
  interactionType: 'failure-mode-tree',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-001', 'failure_mode_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Two jobs, one buzzword',
      text: "AI engineers don't train models. They take finished ones (Claude, GPT, an off-the-shelf embedding model) and build the part that turns a demo into a system: retrieval, tools, evals, guardrails. Training the model itself, curating training data, tuning the loss function — that's ML engineering. Different job, different toolbox.",
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-vs-mle',
        format: 'categorize',
        stem: "Sprint planning at a startup building a support assistant. Six tickets on the board. Which are yours (AI engineering), which go to the ML team?",
        buckets: [
          { id: 'aie', label: 'Your board' },
          { id: 'mle', label: 'ML team' },
        ],
        items: [
          { id: 'w-rag', text: '"Wire up search across our 4,000 help articles"', bucketId: 'aie', why: 'Retrieval over an existing corpus, using off-the-shelf embedding models. A classic AI engineering ticket.' },
          { id: 'w-train', text: '"Train a custom embedding model for our domain terms"', bucketId: 'mle', why: 'Training means training data, GPU time, loss curves. ML team.' },
          { id: 'w-tools', text: '"Lock down the refund() tool: contract + approval step"', bucketId: 'aie', why: 'Interface and governance work around a model that already exists.' },
          { id: 'w-loss', text: '"Tune the learning rate of the fine-tuning runs"', bucketId: 'mle', why: "That happens inside training. No training pipeline, nothing to do here." },
          { id: 'w-eval', text: '"Measure how often the bot actually resolves a ticket"', bucketId: 'aie', why: 'Measuring task success is system work. ARC-07 goes deep on this.' },
          { id: 'w-data', text: '"Label 100,000 old support chats for pretraining"', bucketId: 'mle', why: 'Producing training data. Model side.' },
        ],
        takeaway: 'Rule of thumb for the board: if the ticket needs training data or GPU hours, it\'s ML. If it needs contracts, evidence, or measurement, it\'s yours.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-core',
        format: 'pick',
        stem: 'The CTO asks, deadpan: "If you don\'t build the models — what is it you build, exactly?" Which answer holds up?',
        options: [
          {
            id: 'compose',
            text: 'The system around the model: supplying it the right evidence, wiring the tools, measuring outcomes, containing the risks. The model is one component of that.',
            correct: true,
            why: "And it's the swappable component. When a better model ships next year, your work stays standing and starts feeding a stronger model.",
          },
          {
            id: 'train',
            text: '"We fine-tune models on our domain."',
            correct: false,
            why: 'Occasionally a tool, but not the job. Most production systems run without any custom training at all.',
          },
          {
            id: 'prompt',
            text: '"We write really good prompts."',
            correct: false,
            why: "Prompts are a small piece and go stale with every model release. If your job description fits inside a prompt, the CTO has a follow-up question you won't enjoy.",
          },
          {
            id: 'api',
            text: '"At the core, we call an API."',
            correct: false,
            why: "That's the prototype. Between the API call and a system a company trusts with its customers sits the rest of this roadmap.",
          },
        ],
        takeaway: 'Keep the CTO answer handy. It also answers "won\'t AI replace your job soon?" — models get better; somebody still builds the system around them.',
      },
    },
  ],
}
