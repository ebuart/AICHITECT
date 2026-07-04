import type { LabScenario } from '@/features/labs/interactionModel'
import type { FailureScenarioData } from '@/features/labs/failureModeTree/types'

// Failure Mode Tree scenarios. Intro at NODE-00-01 (reachable from the start) +
// a context-noise transfer variant (LS-005).
export const failureModeScenarios: LabScenario<FailureScenarioData>[] = [
  {
    id: 'FMT-BASE',
    interactionType: 'failure-mode-tree',
    labId: 'LAB-FAILURE-MODE-TREE',
    roadmapNodeId: 'NODE-00-01',
    title: 'Failure Mode Tree',
    prompt:
      'Diagnostiziere den Vorfall: trenne Ursache von Symptom und Distraktor, dann wähle die passende Reparatur.',
    concepts: ['CONCEPT-AIE-001', 'CONCEPT-AIE-003', 'CONCEPT-OBS-002'],
    prerequisites: [],
    difficulty: 'intro',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'fmt-default',
    feedbackProfileId: 'fmt-default',
    reviewHooks: ['failure_mode_transfer', 'postmortem_transfer'],
    scenarioData: {
      symptom: 'Der Agent liefert eine leere Antwort, obwohl der User klare Vorgaben gab.',
      context: 'Der Trace zeigt: der Agent rief ein Tool mit falschen Parametern auf (delete statt read).',
      causeCards: [
        { id: 'c1', label: 'Falscher Tool-Call (delete statt read)', layer: 'tools', role: 'root_cause' },
        { id: 'c2', label: 'Leere Antwort an den User', layer: 'product', role: 'symptom' },
        { id: 'c3', label: 'Kette bricht nach dem Tool-Fehler ab', layer: 'app_logic', role: 'symptom' },
        { id: 'c4', label: 'Retrieval lieferte zu wenig Kontext', layer: 'retrieval', role: 'distractor' },
        { id: 'c5', label: 'Kein Timeout/Retry um den Tool-Call', layer: 'app_logic', role: 'distractor' },
      ],
      repairRules: [
        { id: 'r1', label: 'Tool-Contract härten: Pfad validieren, Scope einschränken', correct: true, rationale: 'Setzt auf der Ursachen-Ebene (Tools) an.' },
        { id: 'r2', label: 'Retry mit Backoff um den Tool-Call', correct: false, rationale: 'Wiederholt denselben falschen delete-Call — die Parameter sind das Problem, nicht die Stabilität.' },
        { id: 'r3', label: 'Vor JEDEN Tool-Call ein Approval-Gate', correct: false, rationale: 'Overkill: bremst auch harmlose Reads; die Ursache ist der falsche Parameter, nicht fehlende Approvals.' },
      ],
    },
  },
  {
    id: 'FMT-TRANSFER',
    interactionType: 'failure-mode-tree',
    labId: 'LAB-FAILURE-MODE-TREE',
    roadmapNodeId: 'NODE-00-01',
    title: 'Failure Mode Tree — Transfer: Context Noise',
    prompt:
      'Geändertes Szenario: gleiche Methode, andere Ebene. Finde die Ursache und repariere sie.',
    concepts: ['CONCEPT-CTX-003', 'CONCEPT-OBS-002'],
    prerequisites: [],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'fmt-default',
    feedbackProfileId: 'fmt-default',
    reviewHooks: ['failure_mode_transfer'],
    scenarioData: {
      symptom: 'Der Agent ignoriert eine aktuelle Anweisung des Users.',
      context: 'Der Trace zeigt veraltete Notizen mit gegenteiliger Anweisung im Context-Window.',
      causeCards: [
        { id: 'c1', label: 'Veralteter Context geladen (alte Notiz)', layer: 'context', role: 'root_cause' },
        { id: 'c2', label: 'Antwort folgt der alten statt der neuen Vorgabe', layer: 'product', role: 'symptom' },
        { id: 'c3', label: 'Neue Anweisung steht am Ende des Prompts, alte oben', layer: 'context', role: 'distractor' },
      ],
      repairRules: [
        { id: 'r1', label: 'Hot-Context bereinigen, veraltetes ausschließen', correct: true, rationale: 'Ursache liegt auf der Context-Ebene.' },
        { id: 'r2', label: 'Recency-Regel ins System-Prompt: „neueste Anweisung gewinnt“', correct: false, rationale: 'Behandelt das Symptom — der veraltete Eintrag bleibt im Context und kollidiert weiter. Erst die Quelle entfernen.' },
      ],
    },
  },
  {
    id: 'RT-DIAGNOSE',
    interactionType: 'failure-mode-tree',
    labId: 'LAB-FAILURE-MODE-TREE',
    roadmapNodeId: 'NODE-13-03',
    title: 'Round-Trip — Phase 3: diagnostizieren',
    prompt:
      'Die 2FA läuft in Produktion — und plötzlich sind Nutzer ausgesperrt. Trenne Ursache von Symptom und Distraktor, dann wähle die Reparatur auf der richtigen Ebene.',
    concepts: ['CONCEPT-AIE-003', 'all_core'],
    prerequisites: ['NODE-13-02'],
    difficulty: 'capstone',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'fmt-default',
    feedbackProfileId: 'fmt-default',
    reviewHooks: ['failure_mode_transfer', 'capstone_transfer'],
    scenarioData: {
      symptom: 'Nach dem 2FA-Rollout kommen manche Nutzer gar nicht mehr rein.',
      context: 'Der Trace zeigt: betroffen sind Nutzer, die ihr Gerät verloren haben — und es gibt keinen Weg zurück. Die TOTP-Verifikation selbst funktioniert korrekt.',
      causeCards: [
        { id: 'c1', label: 'Recovery-Flow wurde nie geliefert', layer: 'product', role: 'root_cause' },
        { id: 'c2', label: 'Nutzer ohne Gerät sind dauerhaft ausgesperrt', layer: 'product', role: 'symptom' },
        { id: 'c3', label: 'TOTP-Verifikation schlägt fehl', layer: 'app_logic', role: 'distractor' },
      ],
      repairRules: [
        { id: 'r1', label: 'Recovery-Code-Flow nachliefern + bestehende Nutzer nach-enrollen', correct: true, rationale: 'Setzt an der Ursache an: der fehlende Wiederherstellungsweg.' },
        { id: 'r2', label: 'Das TOTP-Toleranzfenster vergrößern', correct: false, rationale: 'Behandelt den Distraktor — die Verifikation ist gar nicht das Problem.' },
        { id: 'r3', label: '2FA für betroffene Nutzer abschalten', correct: false, rationale: 'Symptom-Patch, der die Sicherheit wieder entfernt — die Lücke bleibt für alle anderen.' },
      ],
    },
  },
]
