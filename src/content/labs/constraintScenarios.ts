import type { LabScenario } from '@/features/labs/interactionModel'
import type { ConstraintScenarioData } from '@/features/labs/constraintPuzzle/types'

// Constraint Puzzle scenarios. Base (Structured Outputs, 03-02): enforce a schema and
// validate. Transfer (Constrained Decoding, 03-03): constrain the FORMAT, not the meaning
// — over-strict grammars block valid answers (the "too strict" decision).
export const constraintScenarios: LabScenario<ConstraintScenarioData>[] = [
  {
    id: 'CP-BASE',
    interactionType: 'constraint-puzzle',
    labId: 'LAB-CONSTRAINT-PUZZLE',
    roadmapNodeId: 'NODE-03-02',
    title: 'Constraint Puzzle',
    prompt: 'Mach den Output verlässlich parseable und wähle die passende Strenge.',
    concepts: ['CONCEPT-TOOL-003'],
    prerequisites: ['NODE-03-01'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'cp-default',
    feedbackProfileId: 'cp-default',
    reviewHooks: ['constraint_transfer'],
    scenarioData: {
      requirement: 'Downstream-Code verarbeitet die Modell-Antwort automatisch zu Feldern (Kategorie, Priorität).',
      schema: 'Erwartet wird striktes JSON mit festen Keys.',
      stations: [
        {
          id: 'format', dimension: 'structured_output_fit', label: 'Format', question: 'Wie sicherst du das Output-Format?',
          bestOptionId: 'schema',
          options: [
            { id: 'schema', label: 'Structured Output per Schema erzwingen', rationale: 'Passt: das Modell muss valides JSON nach Schema liefern.' },
            { id: 'freeform', label: 'Freitext per Regex parsen', rationale: 'Falle: bricht bei der kleinsten Formulierungsänderung.' },
          ],
        },
        {
          id: 'invalid', dimension: 'constraint_strictness_fit', label: 'Ungültiger Output', question: 'Eine Antwort verletzt das Schema. Was tust du?',
          bestOptionId: 'validate-reprompt',
          options: [
            { id: 'validate-reprompt', label: 'Validieren und bei Verstoß constrained re-prompten', rationale: 'Passt: nur gültige Struktur gelangt weiter.' },
            { id: 'best-effort', label: 'Output mit Regex tolerant nachparsen', rationale: 'Falle: bricht bei der kleinsten Formulierungsänderung und lässt ungültige Daten in die Pipeline.' },
          ],
        },
      ],
    },
  },
  {
    id: 'CP-TRANSFER',
    interactionType: 'constraint-puzzle',
    labId: 'LAB-CONSTRAINT-PUZZLE',
    roadmapNodeId: 'NODE-03-03',
    title: 'Constraint Puzzle — Transfer: zu strikt?',
    prompt: 'Geänderte Aufgabe: constrain genug, aber nicht zu viel.',
    concepts: ['CONCEPT-TOOL-004'],
    prerequisites: ['NODE-03-02'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'cp-default',
    feedbackProfileId: 'cp-default',
    reviewHooks: ['constraint_transfer'],
    scenarioData: {
      requirement: 'Die Antwort braucht eine feste Struktur (Felder), aber ein Freitext-Feld mit der Begründung.',
      schema: 'JSON mit festen Keys; ein Feld „reason“ ist natürlichsprachlich.',
      stations: [
        {
          id: 'format', dimension: 'structured_output_fit', label: 'Format', question: 'Wie erzwingst du die Struktur?',
          bestOptionId: 'schema',
          options: [
            { id: 'schema', label: 'Schema für die Keys erzwingen', rationale: 'Passt: die Struktur ist garantiert, das reason-Feld bleibt frei.' },
            { id: 'freeform', label: 'Alles als Freitext lassen', rationale: 'Falle: ohne Struktur bricht das Parsing.' },
          ],
        },
        {
          id: 'strictness', dimension: 'constraint_strictness_fit', label: 'Strenge', question: 'Wie streng constrainst du die Generierung?',
          bestOptionId: 'format-not-meaning',
          options: [
            { id: 'format-not-meaning', label: 'Struktur erzwingen, das reason-Feld semantisch frei lassen', rationale: 'Passt: Constraints sichern Format, blockieren keine gültigen Inhalte.' },
            { id: 'over-constrain', label: 'Auch den Inhalt per enger Grammatik erzwingen', rationale: 'Falle: zu strikt — gültige Begründungen werden verhindert.' },
          ],
        },
      ],
    },
  },
]
