import type { LabScenario } from '@/features/labs/interactionModel'
import type { PostmortemScenarioData } from '@/features/labs/systemPostmortem/types'

// System Postmortem scenarios (NODE-07-04). Read the trace to the root cause, then turn
// the incident into a durable rule/eval/guard — not a one-off patch. Base = stale-doc
// retrieval; transfer = a runaway agent loop. Both bind to 07-04.
export const systemPostmortemScenarios: LabScenario<PostmortemScenarioData>[] = [
  {
    id: 'SPM-BASE',
    interactionType: 'system-postmortem',
    labId: 'LAB-SYSTEM-POSTMORTEM',
    roadmapNodeId: 'NODE-07-04',
    title: 'System Postmortem',
    prompt: 'Verfolge den Trace zur Ursache und wandle den Vorfall in eine durable Regel.',
    concepts: ['CONCEPT-OBS-002'],
    prerequisites: ['NODE-07-03'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'spm-default',
    feedbackProfileId: 'spm-default',
    reviewHooks: ['postmortem_transfer'],
    scenarioData: {
      incident: 'Nach einem Prompt-Update geben einige Antworten falsche Fakten zurück.',
      trace: 'Der Trace zeigt: für bestimmte Queries lieferte das Retrieval ein veraltetes Dokument.',
      stations: [
        {
          id: 'cause', dimension: 'root_cause_fit', label: 'Ursache', question: 'Was ist die Ursache?',
          bestOptionId: 'stale-doc',
          options: [
            { id: 'stale-doc', label: 'Veraltetes Dokument im Retrieval', rationale: 'Passt: der Trace zeigt die stale Evidenz als Ursache.' },
            { id: 'prompt-update', label: 'Das neue Prompt-Update hat die Antwortregeln verändert', rationale: 'Falle: der Vorfall begann nach dem Update, aber der Trace zeigt die Ursache im Retrieval — das Prompt ist nur zeitlich korreliert.' },
            { id: 'prompt-typo', label: 'Tippfehler im neuen Prompt', rationale: 'Falsch: das Symptom korreliert mit dem Doc, nicht mit dem Prompt-Text.' },
          ],
        },
        {
          id: 'rule', dimension: 'durable_rule_fit', label: 'Durable Regel', question: 'Wie verhinderst du die Wiederkehr?',
          bestOptionId: 'pin-regression',
          options: [
            { id: 'pin-regression', label: 'Doc-Version pinnen + Grounding-Eval + Regressionsfall', rationale: 'Passt: die ganze Fehlerklasse ist vorgebeugt und messbar.' },
            { id: 'fix-one', label: 'Die eine falsche Antwort korrigieren', rationale: 'Falle: Symptom-Patch — der stale-Pfad bleibt offen.' },
            { id: 'restart', label: 'Den Service neu starten', rationale: 'Falle: ändert nichts an der veralteten Evidenz.' },
          ],
        },
      ],
    },
  },
  {
    id: 'SPM-TRANSFER',
    interactionType: 'system-postmortem',
    labId: 'LAB-SYSTEM-POSTMORTEM',
    roadmapNodeId: 'NODE-07-04',
    title: 'System Postmortem — Transfer: Runaway-Loop',
    prompt: 'Anderer Vorfall, gleiche Methode: Ursache im Trace, dann durable Regel.',
    concepts: ['CONCEPT-OBS-002'],
    prerequisites: ['NODE-07-03'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'spm-default',
    feedbackProfileId: 'spm-default',
    reviewHooks: ['postmortem_transfer'],
    scenarioData: {
      incident: 'Ein Agent verbraucht gelegentlich sein gesamtes Tool-Budget und liefert nichts.',
      trace: 'Der Trace zeigt: eine Teilaufgabe läuft ohne Stop-Bedingung in einer Schleife.',
      stations: [
        {
          id: 'cause', dimension: 'root_cause_fit', label: 'Ursache', question: 'Was ist die Ursache?',
          bestOptionId: 'no-stop',
          options: [
            { id: 'no-stop', label: 'Fehlende Stop-Bedingung in der Teilaufgabe', rationale: 'Passt: der Trace zeigt die Schleife ohne Abbruchkriterium.' },
            { id: 'slow-net', label: 'Langsames Netzwerk', rationale: 'Falsch: die Schleife läuft unabhängig von der Latenz weiter.' },
            { id: 'low-budget', label: 'Das Tool-Budget ist zu niedrig angesetzt', rationale: 'Falle: das Budget läuft nur leer, weil die Schleife nie stoppt — mehr Budget verbrennt nur mehr.' },
          ],
        },
        {
          id: 'rule', dimension: 'durable_rule_fit', label: 'Durable Regel', question: 'Wie verhinderst du die Wiederkehr?',
          bestOptionId: 'stop-budget',
          options: [
            { id: 'stop-budget', label: 'Stop-Bedingung + Budget + Checkpoint als Regel', rationale: 'Passt: begrenzt jede zukünftige Loop, nicht nur diese.' },
            { id: 'kill-once', label: 'Diesen Run manuell abbrechen', rationale: 'Falle: einmalig — die nächste Loop läuft wieder.' },
            { id: 'bigger-timeout', label: 'Das Timeout erhöhen', rationale: 'Falle: verschiebt das Problem, statt die Loop zu stoppen.' },
          ],
        },
      ],
    },
  },
]
