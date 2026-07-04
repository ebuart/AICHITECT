import type { LabScenario } from '@/features/labs/interactionModel'
import type { LayerScenarioData } from '@/features/labs/layerStackBuilder/types'

// Layer Stack Builder scenarios. Classify each failure to its ORIGIN layer (not the
// layer where it shows). Base at the Iceberg Model (00-02); transfer at the System
// Layers Map (01-03) with a different feature.
export const layerStackScenarios: LabScenario<LayerScenarioData>[] = [
  {
    id: 'LSB-BASE',
    interactionType: 'layer-stack-builder',
    labId: 'LAB-LAYER-STACK-BUILDER',
    roadmapNodeId: 'NODE-00-02',
    title: 'Layer Stack Builder',
    prompt: 'Ordne jeden Fehler der System-Ebene zu, auf der er entsteht.',
    concepts: ['CONCEPT-AIE-003'],
    prerequisites: ['NODE-00-01'],
    difficulty: 'intro',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'lsb-default',
    feedbackProfileId: 'lsb-default',
    reviewHooks: ['layer_classification_transfer'],
    scenarioData: {
      feature: 'Ein Support-Chatbot beantwortet Produktfragen.',
      task: 'Drei Fehler treten auf. Bestimme die Ursachen-Ebene, nicht die Symptom-Ebene.',
      stations: [
        {
          id: 's1', dimension: 'layer_a_fit', label: 'Fehler 1', question: 'Der Bot zitiert eine veraltete Preisangabe. Welche Ebene?',
          bestOptionId: 'retrieval',
          options: [
            { id: 'retrieval', label: 'Retrieval', rationale: 'Passt: veraltete/falsche Evidenz kommt aus dem Retrieval.' },
            { id: 'model_control', label: 'Model Control', rationale: 'Falsch: das Modell gibt korrekt wieder, was es abgerufen hat.' },
            { id: 'product', label: 'Product', rationale: 'Falsch: das ist die Symptom-Ebene, nicht die Ursache.' },
          ],
        },
        {
          id: 's2', dimension: 'layer_b_fit', label: 'Fehler 2', question: 'Nach einem Tool-Fehler bricht die Antwort leer ab. Welche Ebene?',
          bestOptionId: 'tools',
          options: [
            { id: 'tools', label: 'Tools', rationale: 'Passt: der fehlerhafte Tool-Call ist die Ursache.' },
            { id: 'context', label: 'Context', rationale: 'Falsch: der Context war nicht das Problem.' },
            { id: 'app_logic', label: 'App Logic', rationale: 'Falsch: hier bricht die Kette ab (Symptom), Ursache ist das Tool.' },
          ],
        },
        {
          id: 's3', dimension: 'layer_c_fit', label: 'Fehler 3', question: 'Der Bot ignoriert eine frühere Vorgabe im selben Chat. Welche Ebene?',
          bestOptionId: 'context',
          options: [
            { id: 'context', label: 'Context', rationale: 'Passt: die Vorgabe fiel aus dem Context-Window oder wurde überschrieben.' },
            { id: 'memory', label: 'Memory', rationale: 'Falsch: innerhalb einer Session ist es Context, nicht durable Memory.' },
            { id: 'model_control', label: 'Model Control', rationale: 'Falsch: das Modell folgt dem, was im Context steht.' },
          ],
        },
      ],
    },
  },
  {
    id: 'LSB-TRANSFER',
    interactionType: 'layer-stack-builder',
    labId: 'LAB-LAYER-STACK-BUILDER',
    roadmapNodeId: 'NODE-01-03',
    title: 'Layer Stack Builder — Transfer: Code-Assistent',
    prompt: 'Anderes Feature, gleiche Methode: ordne jeden Fehler seiner Ursachen-Ebene zu.',
    concepts: ['CONCEPT-AIE-003'],
    prerequisites: ['NODE-01-02'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'lsb-default',
    feedbackProfileId: 'lsb-default',
    reviewHooks: ['layer_classification_transfer'],
    scenarioData: {
      feature: 'Ein Code-Assistent schlägt Änderungen in einer großen Codebasis vor.',
      task: 'Drei Fehler treten auf. Bestimme jeweils die Ursachen-Ebene.',
      stations: [
        {
          id: 's1', dimension: 'layer_a_fit', label: 'Fehler 1', question: 'Er findet eine vorhandene Util-Funktion nicht und schreibt sie neu. Welche Ebene?',
          bestOptionId: 'retrieval',
          options: [
            { id: 'retrieval', label: 'Retrieval', rationale: 'Passt: das Retrieval über den Code hat die vorhandene Stelle nicht gefunden.' },
            { id: 'model_control', label: 'Model Control', rationale: 'Falsch: ohne abgerufene Evidenz kann das Modell sie nicht kennen.' },
            { id: 'tools', label: 'Tools', rationale: 'Falsch: kein Tool-Fehler, sondern fehlende Evidenz.' },
          ],
        },
        {
          id: 's2', dimension: 'layer_b_fit', label: 'Fehler 2', question: 'Sein JSON-Patch ist ungültig und lässt sich nicht anwenden. Welche Ebene?',
          bestOptionId: 'model_control',
          options: [
            { id: 'model_control', label: 'Model Control', rationale: 'Passt: ungültiges Format ist ein Generierungs-/Structured-Output-Problem.' },
            { id: 'tools', label: 'Tools', rationale: 'Falsch: der Apply-Schritt scheitert nur am kaputten Format (Symptom).' },
            { id: 'context', label: 'Context', rationale: 'Falsch: der Context war ausreichend.' },
          ],
        },
        {
          id: 's3', dimension: 'layer_c_fit', label: 'Fehler 3', question: 'Niemand merkt, dass eine Änderung einen alten Testfall bricht. Welche Ebene?',
          bestOptionId: 'evals',
          options: [
            { id: 'evals', label: 'Evals', rationale: 'Passt: ohne Regression-Eval bleibt der Bruch unbemerkt.' },
            { id: 'observability', label: 'Observability', rationale: 'Teilweise: Traces helfen, aber der fehlende Regression-Eval ist die Ursache.' },
            { id: 'security', label: 'Security', rationale: 'Falsch: kein Sicherheitsproblem.' },
          ],
        },
      ],
    },
  },
]
