import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-00-02 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). The
// visible prompt/answer is the tip; the reliability lives in the hidden engineering beneath
// (context assembly, retrieval, tools, evals, guardrails). Mistaking the tip for the system is
// the demo-vs-system trap.
export const icebergModel: Lesson = {
  id: 'LESSON-00-02',
  roadmapNodeId: 'NODE-00-02',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-00-01'],
  title: 'The Iceberg Model',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Die sichtbare Spitze vom versteckten Engineering trennen, das ein AI-Feature verlässlich macht.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-003', 'layer_classification_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Spitze vs. Eisberg',
      text: 'Sichtbar ist nur die Spitze: das Prompt und die Antwort. Was ein Feature verlässlich macht, liegt darunter — Context-Assembly, Retrieval, Tool-Wiring, Evals, Guardrails. Eine Demo zeigt die Spitze; ein System ist der ganze Eisberg.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'tip-or-iceberg',
        format: 'categorize',
        stem: 'Was ist sichtbare Spitze, was das verborgene Engineering darunter?',
        buckets: [
          { id: 'tip', label: 'Sichtbare Spitze' },
          { id: 'deep', label: 'Verborgenes Engineering' },
        ],
        items: [
          { id: 'ic-prompt', text: 'Der Prompt-Text, den der Nutzer eintippt', bucketId: 'tip', why: 'Direkt sichtbar — die Oberfläche der Interaktion.' },
          { id: 'ic-answer', text: 'Die generierte Antwort', bucketId: 'tip', why: 'Das sichtbare Ergebnis — sagt nichts darüber, wie verlässlich es zustande kam.' },
          { id: 'ic-context', text: 'Welche Belege ins Context-Fenster zusammengestellt werden', bucketId: 'deep', why: 'Context-Assembly entscheidet über die Antwortqualität — und ist unsichtbar.' },
          { id: 'ic-retrieval', text: 'Die Retrieval-Pipeline, die die Belege findet', bucketId: 'deep', why: 'Das eigentliche Fundament der Antwort — tief unter der Oberfläche.' },
          { id: 'ic-evals', text: 'Der Eval-Harness, der Regressionen fängt', bucketId: 'deep', why: 'Macht das System verlässlich, sieht der Nutzer nie.' },
          { id: 'ic-guard', text: 'Approval-Gates und Guardrails für riskante Aktionen', bucketId: 'deep', why: 'Eindämmung im Verborgenen — entscheidet, was schiefgehen kann.' },
        ],
        takeaway: 'Prompt und Antwort sind die Spitze; Context-Assembly, Retrieval, Evals und Guardrails sind der Eisberg, der ein Feature verlässlich macht.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'iceberg-why',
        format: 'pick',
        stem: 'Eine Demo beeindruckt im Meeting, scheitert aber in Produktion. Was sagt das Iceberg-Modell dazu?',
        options: [
          {
            id: 'below',
            text: 'Die Demo zeigte nur die Spitze; verlässlich wird es erst durch das Engineering darunter (Evidenz-Versorgung, Evals, Guardrails).',
            correct: true,
            why: 'Ein einzelner gelungener Lauf sagt nichts über die unsichtbaren Ebenen, die über tausend Läufe entscheiden.',
          },
          {
            id: 'prompt',
            text: 'Der Prompt war nicht clever genug formuliert.',
            correct: false,
            why: 'Prompt-Politur ist Spitzen-Arbeit; das Produktionsproblem liegt fast immer in den tieferen Ebenen.',
          },
          {
            id: 'model',
            text: 'Man hätte ein stärkeres Modell nehmen müssen.',
            correct: false,
            why: 'Ein stärkeres Modell ohne Retrieval, Evals und Guardrails scheitert an denselben unsichtbaren Lücken.',
          },
          {
            id: 'luck',
            text: 'Die Demo hatte einfach Glück, mehr ist nicht dahinter.',
            correct: false,
            why: 'Halb richtig, aber unbrauchbar: das Modell sagt KONKRET, was fehlt — die tieferen Ebenen —, statt es bei „Glück" zu belassen.',
          },
        ],
        takeaway: 'Demo ≠ System: was im Meeting glänzt, ist die Spitze; Produktion testet den ganzen Eisberg.',
      },
    },
  ],
}
