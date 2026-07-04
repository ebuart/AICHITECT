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
        stem: 'Das Feature aus der glänzenden Demo liefert in Produktion teils falsche, veraltete Antworten. Das Team hat einen Nachmittag Zeit. Womit beginnt die Untersuchung?',
        options: [
          {
            id: 'below',
            text: 'Unter der Wasserlinie nachsehen: Welche Belege hat die Context-Assembly für die fehlerhaften Antworten tatsächlich geliefert? Was hat Retrieval gefunden?',
            correct: true,
            why: 'Prompt und Antwort ZEIGEN den Fehler nur an; entstanden ist er in den unsichtbaren Ebenen. Erst wer die gelieferte Evidenz ansieht, weiß, welche Ebene versagt — alles andere ist Raten.',
          },
          {
            id: 'prompt',
            text: 'Den Prompt umformulieren und testen, ob die Antworten besser werden.',
            correct: false,
            why: 'Spitzen-Arbeit auf Verdacht: selbst wenn es zufällig „hilft", weiß niemand warum — und der eigentliche Defekt (z. B. leere Retrieval-Treffer) bleibt liegen.',
          },
          {
            id: 'replay',
            text: 'Die Demo-Umgebung wiederherstellen, in der alles funktionierte, und die Unterschiede zur Produktion einzeln zurückbauen.',
            correct: false,
            why: 'Verführerisch gründlich, aber rückwärts gedacht: die Demo hat die tieferen Ebenen nie geprüft — sie ist kein „funktionierender Zustand", zu dem man zurück kann, sondern nur ein gelungener Lauf über die Spitze.',
          },
          {
            id: 'fewshot',
            text: 'Mehr gute Beispiel-Antworten in den Prompt legen, damit das Modell den Ton trifft.',
            correct: false,
            why: 'Beispiele formen Stil und Format — sie erzeugen keine fehlenden Fakten. Veraltete Antworten sind ein Versorgungsproblem, kein Vorbild-Problem.',
          },
        ],
        takeaway: 'Fehlersuche beginnt unter der Wasserlinie: erst nachsehen, welche Evidenz die unsichtbaren Ebenen geliefert haben — nicht an der Spitze (Prompt, Beispiele) polieren.',
      },
    },
  ],
}
