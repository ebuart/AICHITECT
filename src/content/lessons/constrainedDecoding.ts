import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-03-03 · post-template redesign, HARD. Term-first: keep the term, then APPLY via bespoke
// exercises (stepwise over a decoding trace · pick). Constrained decoding masks tokens that
// would break the grammar — so the structure is GUARANTEED, but the values can still be wrong.
export const constrainedDecoding: Lesson = {
  id: 'LESSON-03-03',
  roadmapNodeId: 'NODE-03-03',
  conceptIds: ['CONCEPT-TOOL-004'],
  prerequisites: ['NODE-03-02'],
  title: 'Constrained Decoding',
  estimatedMinutes: 7,
  lessonMode: 'term-first',
  learningGoal: 'Schema-Grenzen der Generierung verstehen — inklusive ihrer Kosten.',
  interactionType: 'constraint-puzzle',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-FORMAT-ONLY-EVAL',
  reviewHooks: ['CONCEPT-TOOL-004'],
  blocks: [
    {
      kind: 'term',
      term: 'Struktur erzwingen (Constrained Decoding)',
      definition:
        'Die Generierung wird so eingeschränkt, dass nur Tokens erlaubt sind, die ein gültiges Ergebnis nach Schema/Grammatik fortsetzen — ungültige werden maskiert. Die Struktur ist damit GARANTIERT, nicht erhofft.',
      example: 'Bei JSON nach Schema bricht der Parser nie — der Inhalt kann trotzdem falsch sein.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'decode-mask',
        format: 'stepwise',
        stem: 'Der Decoder erzeugt JSON unter dem Schema unten. Erlaubt die Grammatik den Kandidaten-Token an dieser Stelle — oder maskiert sie ihn?',
        intro: 'Schema: { "status": "open" | "closed", "id": integer }  (beide Felder required)',
        verdicts: [
          { id: 'allow', label: 'Erlaubt' },
          { id: 'block', label: 'Blockiert' },
        ],
        steps: [
          { id: 'k1', text: 'bisher: {        Kandidat: "status"', verdictId: 'allow', why: 'Gültiger erster Key laut Schema.' },
          { id: 'k2', text: 'bisher: {"status":        Kandidat: "pending"', verdictId: 'block', why: 'Nicht im enum (nur „open"/„closed") — der Decoder maskiert „pending" komplett weg.' },
          { id: 'k3', text: 'bisher: {"status":        Kandidat: "open"', verdictId: 'allow', why: 'Gültiger enum-Wert.' },
          { id: 'k4', text: 'bisher: {"status":"open"        Kandidat: }', verdictId: 'block', why: 'Das required-Feld „id" fehlt noch — die Grammatik lässt das Objekt hier nicht schließen.' },
          { id: 'k5', text: 'bisher: {"status":"open","id":        Kandidat: "42"', verdictId: 'block', why: '„id" ist integer; ein String „42" mit Anführungszeichen ist ungültig und wird maskiert.' },
          { id: 'k6', text: 'bisher: {"status":"open","id":42        Kandidat: }', verdictId: 'allow', why: 'Beide required-Felder gesetzt, Typen passen — valides Ende.' },
        ],
        takeaway: 'Constrained Decoding maskiert an jeder Stelle alles, was die Grammatik bräche — Keys, enum-Werte, Typen, das Schließen. Heraus kommt garantiert valides JSON.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'guarantees',
        format: 'pick',
        stem: 'Was garantiert Constrained Decoding — und was nicht?',
        options: [
          {
            id: 'structure',
            text: 'Es garantiert schema-valide STRUKTUR (parsebar, richtige Typen) — nicht, dass die Werte korrekt oder wahr sind.',
            correct: true,
            why: 'Der Decoder prüft Form, nicht Bedeutung: „id": 99999 ist strukturell perfekt und inhaltlich trotzdem falsch.',
          },
          {
            id: 'correct',
            text: 'Es garantiert, dass die Werte inhaltlich richtig sind.',
            correct: false,
            why: 'Form ≠ Wahrheit. Eine schema-valide Antwort kann den falschen Status oder eine erfundene id enthalten.',
          },
          {
            id: 'nohallucinate',
            text: 'Es verhindert Halluzinationen.',
            correct: false,
            why: 'Es verhindert nur ungültige FORM. Eine fließende Halluzination im richtigen Format rutscht ungehindert durch.',
          },
          {
            id: 'noprompt',
            text: 'Es macht eine klare Aufgabenbeschreibung im Prompt überflüssig.',
            correct: false,
            why: 'Die Grammatik sagt, WIE geantwortet wird, nicht WAS — die inhaltliche Anweisung bleibt nötig.',
          },
        ],
        takeaway: 'Garantierte Struktur ist nicht garantierter Inhalt — Werte musst du weiterhin validieren und evaluieren.',
      },
    },
  ],
}
