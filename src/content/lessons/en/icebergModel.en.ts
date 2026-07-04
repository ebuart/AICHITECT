import type { Lesson } from '@/features/lessons/lessonModel'

// EN translation of NODE-00-02 (pilot arc, DEC-0015/0016). Keep in sync with the German
// original: same ids, same structure, same pedagogy — only the learner-facing text differs.
export const icebergModelEn: Lesson = {
  id: 'LESSON-00-02',
  roadmapNodeId: 'NODE-00-02',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-00-01'],
  title: 'The Iceberg Model',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Separate the visible tip from the hidden engineering that makes an AI feature reliable.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-003', 'layer_classification_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Tip vs. iceberg',
      text: 'Only the tip is visible: the prompt and the answer. What makes a feature reliable sits below — context assembly, retrieval, tool wiring, evals, guardrails. A demo shows the tip; a system is the whole iceberg.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'tip-or-iceberg',
        format: 'categorize',
        stem: 'Which of these is the visible tip, and which is the hidden engineering underneath?',
        buckets: [
          { id: 'tip', label: 'Visible tip' },
          { id: 'deep', label: 'Hidden engineering' },
        ],
        items: [
          { id: 'ic-prompt', text: 'The prompt text the user types', bucketId: 'tip', why: 'Directly visible — the surface of the interaction.' },
          { id: 'ic-answer', text: 'The generated answer', bucketId: 'tip', why: 'The visible result — it says nothing about how reliably it was produced.' },
          { id: 'ic-context', text: 'Which evidence gets assembled into the context window', bucketId: 'deep', why: 'Context assembly decides answer quality — and is invisible.' },
          { id: 'ic-retrieval', text: 'The retrieval pipeline that finds the evidence', bucketId: 'deep', why: 'The actual foundation of the answer — deep below the surface.' },
          { id: 'ic-evals', text: 'The eval harness that catches regressions', bucketId: 'deep', why: 'Makes the system reliable; the user never sees it.' },
          { id: 'ic-guard', text: 'Approval gates and guardrails for risky actions', bucketId: 'deep', why: 'Containment in the background — decides what can go wrong.' },
        ],
        takeaway: 'Prompt and answer are the tip; context assembly, retrieval, evals, and guardrails are the iceberg that makes a feature reliable.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'iceberg-why',
        format: 'pick',
        stem: 'The feature from the shiny demo now returns partly wrong, outdated answers in production. The team has one afternoon. Where does the investigation start?',
        options: [
          {
            id: 'below',
            text: 'Look below the waterline: what evidence did context assembly actually supply for the bad answers? What did retrieval find?',
            correct: true,
            why: 'The prompt and answer only DISPLAY the failure; it originated in the invisible layers. Only by inspecting the supplied evidence do you learn which layer failed — everything else is guessing.',
          },
          {
            id: 'prompt',
            text: 'Reword the prompt and test whether the answers improve.',
            correct: false,
            why: 'Tip-level work on suspicion: even if it happens to "help", nobody knows why — and the real defect (e.g. empty retrieval hits) is still there.',
          },
          {
            id: 'replay',
            text: 'Restore the demo environment where everything worked, then roll back the differences to production one by one.',
            correct: false,
            why: 'Tempting and thorough-sounding, but backwards: the demo never exercised the deeper layers — it is not a "working state" to return to, just one successful run across the tip.',
          },
          {
            id: 'fewshot',
            text: 'Add more good example answers to the prompt so the model hits the right tone.',
            correct: false,
            why: 'Examples shape style and format — they don’t create missing facts. Outdated answers are a supply problem, not a role-model problem.',
          },
        ],
        takeaway: 'Debugging starts below the waterline: first inspect what evidence the invisible layers supplied — don’t polish the tip (prompt, examples).',
      },
    },
  ],
}
