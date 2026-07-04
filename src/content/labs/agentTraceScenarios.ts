import type { LabScenario } from '@/features/labs/interactionModel'
import type { TraceScenarioData } from '@/features/labs/agentTraceDebugger/types'

// Agent Trace Debugger scenarios. Intro at NODE-02-04 + an orchestrator-worker
// transfer variant (LS-005).
export const agentTraceScenarios: LabScenario<TraceScenarioData>[] = [
  {
    id: 'ATD-BASE',
    interactionType: 'agent-trace-debugger',
    labId: 'LAB-AGENT-TRACE-DEBUGGER',
    roadmapNodeId: 'NODE-02-04',
    title: 'Agent Trace Debugger',
    prompt:
      'Lies den Trace. Markiere den frühesten ursächlichen Schritt — nicht das Symptom — und wähle die passende Reparatur.',
    concepts: ['CONCEPT-CTX-005', 'CONCEPT-OBS-001'],
    prerequisites: ['NODE-02-03'],
    // core, not intro: this is the LAST node of the context arc (02-04), so it must not
    // dip below the core challenges at 02-02/02-03 (difficulty ramp, LR-011b rule 2).
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'trace-default',
    feedbackProfileId: 'trace-default',
    reviewHooks: ['trace_failure_transfer', 'observability_gap_transfer'],
    scenarioData: {
      task: 'Ein Agent soll eine Datei zusammenfassen, liefert aber Unsinn.',
      events: [
        { id: 'e1', step: 1, actor: 'user', action: 'Anfrage: fasse report.md zusammen', riskTags: ['input'] },
        { id: 'e2', step: 2, actor: 'retriever', action: 'Falsche Datei geladen (draft.md)', observation: 'Pfad-Verwechslung im Tool-Call', riskTags: ['retrieval'], isFailureOrigin: true },
        { id: 'e3', step: 3, actor: 'main_agent', action: 'Fasst draft.md zusammen', observation: 'Arbeitet auf falscher Quelle', riskTags: ['context'] },
        { id: 'e4', step: 4, actor: 'system', action: 'Antwort wirkt unzusammenhängend', riskTags: ['output'], isSymptom: true },
      ],
      repairRules: [
        { id: 'r1', label: 'Tool-Call validieren: angeforderten Pfad gegen Whitelist prüfen', correct: true, rationale: 'Setzt am Ursprung (falscher Datei-Pfad) an.' },
        { id: 'r2', label: 'Zusammenfassungs-Prompt verbessern', correct: false, rationale: 'Behandelt das Symptom, nicht die falsche Quelle.' },
        { id: 'r3', label: 'Den Output nachträglich gegen das Original prüfen lassen', correct: false, rationale: 'Symptom-Patch: prüft erst am Ende — die falsche Quelle wird schon im Tool-Call geladen.' },
      ],
    },
  },
  {
    id: 'ATD-TRANSFER',
    interactionType: 'agent-trace-debugger',
    labId: 'LAB-AGENT-TRACE-DEBUGGER',
    roadmapNodeId: 'NODE-02-04',
    title: 'Agent Trace Debugger — Transfer: Orchestrator-Worker',
    prompt:
      'Geändertes Szenario: ein Worker flutet den Main-Context. Finde den Ursprung und repariere ihn.',
    concepts: ['CONCEPT-CF-005', 'CONCEPT-OBS-001'],
    prerequisites: ['NODE-02-03'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: true,
    scoringProfileId: 'trace-default',
    feedbackProfileId: 'trace-default',
    reviewHooks: ['trace_failure_transfer'],
    scenarioData: {
      task: 'Ein Orchestrator delegiert an einen Worker; danach driftet die Antwort ab.',
      events: [
        { id: 'e1', step: 1, actor: 'main_agent', action: 'Delegiert Recherche an Worker', riskTags: ['control'] },
        { id: 'e2', step: 2, actor: 'subagent', action: 'Gibt 6k Token rohe Logs zurück', observation: 'Kein Summary, nur Dump', riskTags: ['context'], isFailureOrigin: true },
        { id: 'e3', step: 3, actor: 'main_agent', action: 'Hauptkontext mit Logs überflutet', riskTags: ['context'] },
        { id: 'e4', step: 4, actor: 'system', action: 'Antwort verliert die eigentliche Aufgabe', riskTags: ['output'], isSymptom: true },
      ],
      repairRules: [
        { id: 'r1', label: 'Worker muss ein kompaktes Summary statt Rohdaten zurückgeben', correct: true, rationale: 'Ursprung: Worker liefert Noise statt Ergebnis.' },
        { id: 'r2', label: 'Hauptkontext nach dem Lauf kürzen', correct: false, rationale: 'Behandelt das Symptom, nicht die Worker-Schnittstelle.' },
        { id: 'r3', label: 'Mehr Worker hinzufügen', correct: false, rationale: 'Erhöht Komplexität ohne die Ursache zu beheben.' },
      ],
    },
  },
  {
    id: 'ALP-BASE',
    interactionType: 'agent-trace-debugger',
    labId: 'LAB-AGENT-TRACE-DEBUGGER',
    roadmapNodeId: 'NODE-04-05',
    title: 'Autonomous Agent Loop — Runaway',
    prompt:
      'Lies den Trace des autonomen Loops: finde den Schritt, an dem die Kontrolle verloren geht, und repariere ihn.',
    concepts: ['CONCEPT-CF-007', 'CONCEPT-SEC-002'],
    prerequisites: ['NODE-04-04'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'trace-default',
    feedbackProfileId: 'trace-default',
    reviewHooks: ['trace_failure_transfer', 'observability_gap_transfer'],
    scenarioData: {
      task: 'Ein autonomer Agent soll offene Tickets der Reihe nach bearbeiten und schließen.',
      events: [
        { id: 'e1', step: 1, actor: 'user', action: 'Auftrag: arbeite alle offenen Tickets ab', riskTags: ['input'] },
        { id: 'e2', step: 2, actor: 'main_agent', action: 'Plant: Ticket lösen, dann das nächste', riskTags: ['control'] },
        { id: 'e3', step: 3, actor: 'main_agent', action: 'Handelt weiter, ohne das Ergebnis zu prüfen', observation: 'Kein Observe-Schritt, keine Stop-Bedingung', riskTags: ['control'], isFailureOrigin: true },
        { id: 'e4', step: 4, actor: 'system', action: 'Loop wiederholt sich, Budget erschöpft, nichts abgeschlossen', riskTags: ['output'], isSymptom: true },
      ],
      repairRules: [
        { id: 'r1', label: 'Observe-Schritt + Stop-Bedingung (Erfolg/Budget) in den Loop einbauen', correct: true, rationale: 'Setzt am Ursprung an: der Loop prüft das Ergebnis und bricht definiert ab.' },
        { id: 'r2', label: 'Das Tool-Timeout erhöhen', correct: false, rationale: 'Falle: verschiebt den Runaway nach hinten, statt die fehlende Stop-Bedingung zu beheben.' },
        { id: 'r3', label: 'Vor JEDE Aktion ein Human-Approval setzen', correct: false, rationale: 'Überzogen: bremst auch harmlose Schritte — es fehlt die Stop-Bedingung im Loop, nicht die Freigabe.' },
      ],
    },
  },
]
