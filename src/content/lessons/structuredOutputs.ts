import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-03-02 · post-template redesign, HARD. Bespoke puzzle exercises (cloze · pick). Fill a
// real function/tool JSON schema; the durable skill is schema literacy (right type in the
// right slot, enum as an array, sensible required-set) and why ENFORCED schemas beat asking
// nicely for JSON.
export const structuredOutputs: Lesson = {
  id: 'LESSON-03-02',
  roadmapNodeId: 'NODE-03-02',
  conceptIds: ['CONCEPT-TOOL-003'],
  prerequisites: ['NODE-03-01'],
  title: 'Structured Outputs',
  estimatedMinutes: 7,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Schema-Literacy: parseable, validierbare Outputs erzwingen statt erhoffen.',
  interactionType: 'constraint-puzzle',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-AMBIGUOUS-TOOL-CONTRACT',
  reviewHooks: ['CONCEPT-TOOL-003'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Schema ist der Contract',
      text: 'Ein erzwungenes JSON-Schema (z. B. „structured outputs" / function calling) garantiert, dass der Output parseable und validierbar ist. „Bitte antworte als JSON" ist dagegen nur eine Hoffnung — das Modell bricht das Format unter Druck.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'fill-schema',
        format: 'cloze',
        stem: 'Vervollständige das Tool-Schema für „create_ticket" so, dass es einen validen Contract ergibt.',
        code: `{
  "name": "create_ticket",
  "parameters": {
    "type": "object",
    "properties": {
      "priority": { "type": ▢1, "enum": ▢2 },
      "title":    { "type": "string" }
    },
    "required": ▢3
  }
}`,
        blanks: [
          {
            id: 'b1',
            label: 'priority.type',
            options: [
              { id: 'string', text: '"string"', correct: true, why: 'Die Werte sind Labels („low"/„high") — ein String mit enum, keine Zahl.' },
              { id: 'number', text: '"number"', correct: false, why: 'Labels sind keine Zahlen; ein enum aus Strings braucht type "string".' },
              { id: 'bool', text: '"boolean"', correct: false, why: 'Priorität hat mehr als zwei Stufen — boolean kann das nicht abbilden.' },
            ],
          },
          {
            id: 'b2',
            label: 'priority.enum',
            options: [
              { id: 'arr', text: '["low","medium","high"]', correct: true, why: 'enum ist eine Liste erlaubter Werte — ein JSON-Array.' },
              { id: 'pipe', text: '"low|high"', correct: false, why: 'Das ist ein String, kein Array. Ein Schema-enum muss ein Array sein, sonst ist jeder Wert nur „ein String".' },
              { id: 'nums', text: '[1,2,3]', correct: false, why: 'Zahlen passen nicht zu type "string" und tragen keine Bedeutung der Stufen.' },
            ],
          },
          {
            id: 'b3',
            label: 'required',
            options: [
              { id: 'title', text: '["title"]', correct: true, why: 'title ist Pflicht (sonst ein leeres Ticket); priority hat einen sinnvollen Default und bleibt optional.' },
              { id: 'both', text: '["title","priority"]', correct: false, why: 'Über-streng: priority erzwingen macht jeden Aufruf ohne explizite Priorität ungültig, obwohl ein Default reicht.' },
              { id: 'none', text: '[]', correct: false, why: 'Nichts erzwingen heißt: das Modell darf den title weglassen — dann ist das Ticket wertlos.' },
            ],
          },
        ],
        takeaway: 'enum ist ein Array, der type passt zu den Werten, und required erzwingt genau das Nötige — nicht mehr (über-streng), nicht weniger (wertlos).',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'why-enforced',
        format: 'pick',
        stem: 'Warum ein erzwungenes Schema statt „Bitte antworte als JSON" in den Prompt zu schreiben?',
        options: [
          {
            id: 'guarantee',
            text: 'Das erzwungene Schema garantiert auf Decoder-Ebene parseable, validierbare Struktur — eine Prompt-Bitte kann das Modell jederzeit brechen.',
            correct: true,
            why: 'Constrained decoding lässt nur schema-konforme Tokens zu. Eine Bitte im Prompt ist unverbindlich — unter Last/Edge-Cases kommt doch mal Prosa oder ein fehlendes Komma.',
          },
          {
            id: 'shorter',
            text: 'Weil der Prompt dadurch kürzer wird und Tokens spart.',
            correct: false,
            why: 'Token-Ersparnis ist nebensächlich; der Punkt ist die Garantie der Struktur, nicht die Promptlänge.',
          },
          {
            id: 'creative',
            text: 'Damit das Modell kreativere Antworten gibt.',
            correct: false,
            why: 'Strukturzwang erhöht nicht die Kreativität — er macht den Output verlässlich maschinenlesbar.',
          },
          {
            id: 'no-validate',
            text: 'Dann muss man den Output nicht mehr validieren.',
            correct: false,
            why: 'Das Schema erzwingt die Form, nicht die Sinnhaftigkeit der Werte — validieren (Wertebereiche, Konsistenz) muss man weiterhin.',
          },
        ],
        takeaway: 'Format ist Teil des Contracts: erzwingen, nicht erbitten. Das Schema sichert die Struktur — die Werte prüfst du trotzdem.',
      },
    },
  ],
}
