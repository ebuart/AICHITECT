import type { Lesson } from '@/features/lessons/lessonModel'

// EN variant of NODE-00-02 (DEC-0016). Mirrors the German structurally (ids, flags,
// buckets); text follows the control/10 VX voice rules in English.
export const icebergModelEn: Lesson = {
  id: 'LESSON-00-02',
  roadmapNodeId: 'NODE-00-02',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-00-01'],
  title: 'The Iceberg Model',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Separate the visible tip from the engineering that makes an AI feature reliable.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-003', 'layer_classification_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Friday demo, Monday production',
      text: "Friday afternoon, someone demos a chatbot to management. Question in, good answer out, applause. What management saw: a prompt and an answer. What they didn't see: that there is nothing in between. No evidence supply, no measurement, no containment. A demo shows the tip. Whether the thing survives 5,000 real requests on Monday is decided by everything below the waterline.",
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'tip-or-iceberg',
        format: 'categorize',
        stem: 'Sort the chatbot\'s parts: which of these did management see in the demo — and which sit below the waterline?',
        buckets: [
          { id: 'tip', label: 'Visible in the demo' },
          { id: 'deep', label: 'Below the waterline' },
        ],
        items: [
          { id: 'ic-prompt', text: 'The question the presenter types', bucketId: 'tip', why: 'Visible. And in a demo, naturally one that works well.' },
          { id: 'ic-answer', text: 'The answer on the projector', bucketId: 'tip', why: 'Visible. Says nothing about the other 4,999 possible answers.' },
          { id: 'ic-context', text: 'What evidence goes into the context window per request', bucketId: 'deep', why: 'Decides answer quality and is invisible from outside. In the Friday demo: none of it existed.' },
          { id: 'ic-retrieval', text: 'The search that finds that evidence', bucketId: 'deep', why: "Without it the model answers everything from its training snapshot. Nobody notices until someone asks about something recent." },
          { id: 'ic-evals', text: 'The measurement that reports degradations', bucketId: 'deep', why: "Invisible until it's missing. Then you learn about regressions from customer complaints." },
          { id: 'ic-guard', text: 'The approval gate in front of risky actions', bucketId: 'deep', why: 'Nobody cares in the demo. After the first unasked database write, everybody does.' },
        ],
        takeaway: 'When someone shows you an AI feature, ask about the waterline: where does the evidence come from, who measures, what happens on risky actions.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'iceberg-why',
        format: 'pick',
        stem: "The chatbot went live. Three weeks in: partly wrong, outdated answers, and the team has one afternoon. Where do you start?",
        options: [
          {
            id: 'below',
            text: 'Below the waterline: for five bad answers, check what evidence context assembly actually supplied and what retrieval found.',
            correct: true,
            why: "The prompt and answer only display the failure. It originated below — and only after you've seen the supplied evidence do you know which layer produced it. Everything else is guessing with tools.",
          },
          {
            id: 'prompt',
            text: 'Reword the system prompt and check whether answers improve.',
            correct: false,
            why: "It might even help. But then nobody knows why, and the actual defect (say, empty retrieval hits) is still sitting there.",
          },
          {
            id: 'replay',
            text: 'Restore the exact setup the demo ran on — it worked back then.',
            correct: false,
            why: 'Feels diligent, but it\'s backwards: the demo never exercised the deep layers. There is no "working state" to return to. There was one successful run.',
          },
          {
            id: 'fewshot',
            text: 'Add a few model answers to the prompt so the tone lands better.',
            correct: false,
            why: "Examples shape style and format. They don't create missing facts — outdated answers are a supply problem.",
          },
        ],
        takeaway: 'Debugging order for AI features: look at the supplied evidence first, then judge. Polishing the tip comes last, if at all.',
      },
    },
  ],
}
