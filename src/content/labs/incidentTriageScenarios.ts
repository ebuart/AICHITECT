import type { LabScenario } from '@/features/labs/interactionModel'
import type { TriageScenarioData } from '@/features/labs/incidentTriage/types'

// Incident Triage scenarios (MECH-TRIAGE, NODE-08-03 — incident response). Order the
// reaction: contain first, then root cause, then durable control, then measure + record.
// `actions` is the (wrong) starting order; `correctOrder` is the ideal sequence.
export const incidentTriageScenarios: LabScenario<TriageScenarioData>[] = [
  {
    id: 'TRI-BASE',
    interactionType: 'incident-triage',
    labId: 'LAB-INCIDENT-TRIAGE',
    roadmapNodeId: 'NODE-08-03',
    title: 'Incident Triage',
    prompt:
      'Der Vorfall läuft. Bring die Reaktion in die richtige Reihenfolge — zuerst den Schaden stoppen.',
    concepts: ['CONCEPT-SEC-003', 'CONCEPT-SEC-001', 'CONCEPT-OBS-002'],
    prerequisites: ['NODE-08-02'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tri-default',
    feedbackProfileId: 'tri-default',
    reviewHooks: ['incident_triage_transfer', 'postmortem_transfer'],
    scenarioData: {
      incident: 'Ein Agent hat über injizierten Doc-Inhalt Kundendaten an eine externe Adresse geschickt. Der Vorfall läuft noch.',
      actions: [
        { id: 'rootcause', label: 'Ursache im Trace bestätigen', note: 'Den injizierten Pfad als Ursache identifizieren.' },
        { id: 'cut', label: 'Egress sperren, Agent isolieren', note: 'Den laufenden Datenabfluss sofort stoppen.' },
        { id: 'eval', label: 'Regressionsfall + Grounding-Eval', note: 'Den Fall messbar absichern.' },
        { id: 'control', label: 'Untrusted Input isolieren + Least Privilege', note: 'Die durable Kontrolle gegen Injection.' },
        { id: 'postmortem', label: 'Regel im Decision-Log festhalten', note: 'Aus dem Vorfall eine durable Regel machen.' },
      ],
      correctOrder: ['cut', 'rootcause', 'control', 'eval', 'postmortem'],
      firstMustBe: 'cut',
    },
  },
  {
    id: 'TRI-TRANSFER',
    interactionType: 'incident-triage',
    labId: 'LAB-INCIDENT-TRIAGE',
    roadmapNodeId: 'NODE-08-03',
    title: 'Incident Triage — Transfer: Datenverlust',
    prompt:
      'Anderer Vorfall, gleiche Methode: bring die Reaktion in die richtige Reihenfolge.',
    concepts: ['CONCEPT-SEC-001', 'CONCEPT-SEC-002', 'CONCEPT-OBS-002'],
    prerequisites: ['NODE-08-02'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'tri-default',
    feedbackProfileId: 'tri-default',
    reviewHooks: ['incident_triage_transfer', 'postmortem_transfer'],
    scenarioData: {
      incident: 'Ein Agent hat mit einem delete-Tool Produktionsdaten gelöscht. Der Vorfall ist akut.',
      actions: [
        { id: 'trace', label: 'Ursache im Trace bestätigen', note: 'Over-broad delete-Permission als Ursache.' },
        { id: 'control', label: 'Least Privilege + Approval-Gate', note: 'Durable Kontrolle für destruktive Aktionen.' },
        { id: 'revoke', label: 'delete-Permission entziehen, Backup wiederherstellen', note: 'Den Schaden sofort stoppen und rückgängig machen.' },
        { id: 'eval', label: 'Regressionsfall ergänzen', note: 'Den Vorfall messbar absichern.' },
        { id: 'postmortem', label: 'Im Decision-Log als Regel festhalten', note: 'Incident → durable Regel.' },
      ],
      correctOrder: ['revoke', 'trace', 'control', 'eval', 'postmortem'],
      firstMustBe: 'revoke',
    },
  },
  {
    id: 'DIR-SWARM-TRIAGE',
    interactionType: 'incident-triage',
    labId: 'LAB-INCIDENT-TRIAGE',
    roadmapNodeId: 'NODE-12-03',
    title: 'Wo schaust du zuerst hin?',
    prompt:
      'Vier Bienen laufen parallel. Deine Aufmerksamkeit ist knapp. Bring die vier in die Reihenfolge, in der du dich kümmerst — stoppe zuerst, was gerade falsche Arbeit produziert.',
    concepts: ['CONCEPT-DIR-007'],
    prerequisites: ['NODE-12-02'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tri-default',
    feedbackProfileId: 'tri-default',
    reviewHooks: ['direction_transfer', 'incident_triage_transfer'],
    scenarioData: {
      incident: 'Vier Agenten arbeiten gleichzeitig. Einer driftet sichtbar vom Brief ab, einer ist blockiert (wartet auf einen anderen), zwei laufen sauber — einer davon ist fertig und wartet auf Integration.',
      actions: [
        { id: 'review_ok', label: 'Sauber laufende Biene kurz prüfen', note: 'Läuft im Plan — niedriges Risiko.' },
        { id: 'unblock', label: 'Blockierte Biene entsperren', note: 'Wartet auf eine Vorleistung und hält die Kette auf.' },
        { id: 'redirect', label: 'Abdriftende Biene zurück auf den Brief holen', note: 'Produziert gerade die falsche Arbeit — Schaden wächst mit jeder Minute.' },
        { id: 'integrate', label: 'Fertige Arbeit integrieren', note: 'Kann warten, bis die anderen stehen.' },
      ],
      correctOrder: ['redirect', 'unblock', 'review_ok', 'integrate'],
      firstMustBe: 'redirect',
    },
  },
]
