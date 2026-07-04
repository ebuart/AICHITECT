import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-02-03 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). The
// durable skill: compress (not drop) durable state — but tell apart what must stay VERBATIM
// (exact IDs/numbers/code), what can be SUMMARISED (prose, discussions), and what to drop —
// without losing a decision-critical detail.
export const contextCompression: Lesson = {
  id: 'LESSON-02-03',
  roadmapNodeId: 'NODE-02-03',
  conceptIds: ['CONCEPT-CTX-004'],
  prerequisites: ['NODE-02-02'],
  title: 'Context Compression',
  estimatedMinutes: 7,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Durable State verdichten, ohne entscheidungskritische Details zu verlieren.',
  interactionType: 'context-budget-board',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-MISSING-CRITICAL-CONTEXT',
  reviewHooks: ['CONCEPT-CTX-004'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Verdichten statt droppen',
      text: 'Compression heißt: durable State kürzen, statt eine nötige Quelle ganz wegzulassen. Der Trick ist zu wissen, was exakt bleiben muss, was sich gefahrlos zusammenfassen lässt — und was raus kann.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'compress-how',
        format: 'categorize',
        stem: 'Wie behandelst du jeden Inhalt beim Komprimieren?',
        buckets: [
          { id: 'verbatim', label: 'Wörtlich behalten' },
          { id: 'summarize', label: 'Zusammenfassen' },
          { id: 'drop', label: 'Weglassen' },
        ],
        items: [
          { id: 'p-id', text: 'Bestell-ID #8842 und Betrag 2 500,00 €', bucketId: 'verbatim', why: 'IDs und exakte Zahlen verlieren bei jeder Paraphrase ihre Bedeutung — sie müssen exakt bleiben.' },
          { id: 'p-talk', text: 'Achtteiliges Hintergrundgespräch über die Beschwerde', bucketId: 'summarize', why: 'Die Kernaussage reicht; die Prosa ist gefahrlos verdichtbar.' },
          { id: 'p-code', text: 'Code-Snippet der fehlerhaften Funktion', bucketId: 'verbatim', why: 'Code muss zeichengenau bleiben — eine zusammengefasste Funktion ist nutzlos.' },
          { id: 'p-hello', text: 'Begrüßung und Smalltalk am Gesprächsanfang', bucketId: 'drop', why: 'Kein Informationswert für die Aufgabe.' },
          { id: 'p-decision', text: 'Lange Diskussion, die in einer Entscheidung mündete', bucketId: 'summarize', why: 'Entscheidung + Grund behalten, das Hin und Her verdichten.' },
          { id: 'p-secret', text: 'Ein API-Key, der im Verlauf auftauchte', bucketId: 'drop', why: 'Secrets gehören gar nicht in den Context — Rauschen und Sicherheitsrisiko zugleich.' },
        ],
        takeaway: 'Exaktes (IDs, Zahlen, Code) bleibt wörtlich, Prosa/Diskussionen werden zusammengefasst, Wertloses und Secrets fliegen raus.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'compress-risk',
        format: 'pick',
        stem: 'Was ist die größte Gefahr beim Zusammenfassen von Context?',
        options: [
          {
            id: 'lose-detail',
            text: 'Ein entscheidungskritisches Detail (eine exakte Zahl, eine Bedingung, ein „nicht") fällt weg — die Zusammenfassung wirkt vollständig, ist es aber nicht.',
            correct: true,
            why: 'Genau hier schlägt Compression um in Schaden: die geglättete Version liest sich rund und hat doch das eine „außer für Bestellungen über 2 000 €" verloren.',
          },
          {
            id: 'shorter',
            text: 'Dass die Zusammenfassung kürzer ist als das Original.',
            correct: false,
            why: 'Kürze ist das Ziel, nicht die Gefahr — solange nichts Kritisches verloren geht.',
          },
          {
            id: 'style',
            text: 'Dass sich der Schreibstil ändert.',
            correct: false,
            why: 'Stil ist irrelevant; es zählt, ob die entscheidungsrelevanten Fakten erhalten bleiben.',
          },
          {
            id: 'tokens',
            text: 'Dass das Zusammenfassen selbst Tokens kostet.',
            correct: false,
            why: 'Vernachlässigbar gegenüber dem Risiko, eine kritische Bedingung zu verlieren.',
          },
        ],
        takeaway: 'Beim Komprimieren ist der gefährlichste Fehler der stille Verlust eines kritischen Details — prüfe Zusammenfassungen gegen die harten Fakten.',
      },
    },
  ],
}
