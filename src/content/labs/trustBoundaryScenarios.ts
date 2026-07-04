import type { LabScenario } from '@/features/labs/interactionModel'
import type { BoundaryScenarioData } from '@/features/labs/trustBoundary/types'

const ZONES = [
  { id: 'trusted', label: 'Trusted', hint: 'direkt erlaubt (read-only, harmlos).' },
  { id: 'approval', label: 'Approval', hint: 'Human-Approval-Gate für hoch-impact/irreversible Aktionen.' },
  { id: 'sandbox', label: 'Sandbox', hint: 'riskante Ausführung in isolierter Umgebung.' },
  { id: 'isolate', label: 'Isoliert', hint: 'untrusted Input als Daten behandeln, nie als Befehl.' },
]

// Trust Boundary scenarios (MECH-BOUNDARY, NODE-08-04 — design safe operational
// boundaries). Place each element in the zone that contains its risk. Base: a dev
// agent; transfer: a customer-facing support agent (different elements, same zones).
export const trustBoundaryScenarios: LabScenario<BoundaryScenarioData>[] = [
  {
    id: 'BND-BASE',
    interactionType: 'trust-boundary',
    labId: 'LAB-TRUST-BOUNDARY',
    roadmapNodeId: 'NODE-08-04',
    title: 'Trust Boundary Map',
    prompt:
      'Ziehe die Grenzen für dieses System: enthalte die riskanten Wirkungen, ohne harmlose Aktionen zu blockieren.',
    concepts: ['CONCEPT-SEC-001', 'CONCEPT-SEC-002', 'CONCEPT-SEC-003', 'CONCEPT-SEC-004'],
    prerequisites: ['NODE-08-03'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'bnd-default',
    feedbackProfileId: 'bnd-default',
    reviewHooks: ['trust_boundary_transfer', 'security_incident_transfer'],
    scenarioData: {
      system: 'Ein AI-Agent in einem Entwicklungssystem mit Zugriff auf Repo, Shell und externe Inhalte.',
      zones: ZONES,
      elements: [
        { id: 'read', label: 'Read-Tool (Dateien lesen)', note: 'Liest Dateien, schreibt nie.', risk: 'low', bestZone: 'trusted', wrongText: 'unnötige Reibung für eine harmlose Lese-Aktion.' },
        { id: 'list', label: 'Such-/List-Tool', note: 'Listet Treffer, ändert nichts.', risk: 'low', bestZone: 'trusted', wrongText: 'harmlose Suche unnötig blockiert.' },
        { id: 'delete', label: 'Delete-Tool', note: 'Löscht Daten endgültig.', risk: 'high', bestZone: 'approval', wrongText: 'destruktive, irreversible Aktion ohne menschliche Bestätigung.' },
        { id: 'deploy', label: 'Deploy/Release-Tool', note: 'Veröffentlicht in Produktion.', risk: 'high', bestZone: 'approval', wrongText: 'Release ohne Freigabe — hoch-impact ohne Kontrolle.' },
        { id: 'shell', label: 'Shell/Exec', note: 'Führt beliebigen Code aus.', risk: 'high', bestZone: 'sandbox', wrongText: 'ungesandboxte Ausführung kann das echte System beschädigen.' },
        { id: 'webdoc', label: 'Abgerufene Web-/Doc-Inhalte', note: 'Text von externen Seiten, frei befüllbar.', risk: 'high', bestZone: 'isolate', wrongText: 'untrusted Inhalt als Instruktion behandelt = Prompt Injection.' },
      ],
    },
  },
  {
    id: 'BND-TRANSFER',
    interactionType: 'trust-boundary',
    labId: 'LAB-TRUST-BOUNDARY',
    roadmapNodeId: 'NODE-08-04',
    title: 'Trust Boundary Map — Transfer: Support-Agent',
    prompt:
      'Anderes System, gleiche Methode: ziehe die Grenzen für einen kundenseitigen Agenten.',
    concepts: ['CONCEPT-SEC-001', 'CONCEPT-SEC-002', 'CONCEPT-SEC-003'],
    prerequisites: ['NODE-08-03'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'bnd-default',
    feedbackProfileId: 'bnd-default',
    reviewHooks: ['trust_boundary_transfer'],
    scenarioData: {
      system: 'Ein kundenseitiger Support-Agent mit Zugriff auf Kundendaten, Zahlungen und eingehende Tickets.',
      zones: ZONES,
      elements: [
        { id: 'faq', label: 'FAQ-/Hilfe-Suche', note: 'Durchsucht öffentliche Hilfetexte.', risk: 'low', bestZone: 'trusted', wrongText: 'harmlose Suche unnötig blockiert.' },
        { id: 'lookup', label: 'Kundendaten lesen', note: 'Schlägt einen Datensatz nach, ändert nichts.', risk: 'low', bestZone: 'trusted', wrongText: 'reine Lese-Abfrage unnötig gebremst.' },
        { id: 'refund', label: 'Rückerstattung auslösen', note: 'Bewegt echtes Geld.', risk: 'high', bestZone: 'approval', wrongText: 'Zahlung ohne Freigabe — direkter finanzieller Schaden.' },
        { id: 'export', label: 'Daten-Export-Tool', note: 'Exportiert Kundendaten nach außen.', risk: 'high', bestZone: 'approval', wrongText: 'Massendaten-Export ohne Kontrolle — Datenschutz-Vorfall.' },
        { id: 'script', label: 'Custom-Script ausführen', note: 'Führt beliebigen Code auf Daten aus.', risk: 'high', bestZone: 'sandbox', wrongText: 'ungesandboxte Ausführung auf Produktivdaten.' },
        { id: 'ticket', label: 'Eingehender Ticket-Text', note: 'Freitext, vom Kunden verfasst.', risk: 'high', bestZone: 'isolate', wrongText: 'Injection über den Ticket-Text in Tool-Aufrufe.' },
      ],
    },
  },
  {
    id: 'DIR-BOUND-BASE',
    interactionType: 'trust-boundary',
    labId: 'LAB-TRUST-BOUNDARY',
    roadmapNodeId: 'NODE-11-04',
    title: 'Was darf die Biene anfassen?',
    prompt:
      'Du delegierst einen Feature-Build an einen Agenten. Lege fest, was er direkt darf, was eine Freigabe braucht, was in die Sandbox gehört und was nur als Daten behandelt wird.',
    concepts: ['CONCEPT-DIR-004'],
    prerequisites: ['NODE-11-03'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'bnd-default',
    feedbackProfileId: 'bnd-default',
    reviewHooks: ['direction_transfer', 'trust_boundary_transfer'],
    scenarioData: {
      system: 'Ein Agent baut ein Feature in deiner Codebasis. Als Director setzt du die Grenzen, bevor er loslegt.',
      zones: ZONES,
      elements: [
        { id: 'read_repo', label: 'Repo-Dateien lesen', note: 'Liest Code, ändert nichts.', risk: 'low', bestZone: 'trusted', wrongText: 'harmloser Lesezugriff unnötig blockiert.' },
        { id: 'read_db', label: 'Read-only DB-Query', note: 'Liest Daten, schreibt nie.', risk: 'low', bestZone: 'trusted', wrongText: 'reine Lese-Abfrage unnötig gebremst.' },
        { id: 'run_gen', label: 'Selbst generierten Code ausführen', note: 'Führt frisch erzeugten Code aus.', risk: 'high', bestZone: 'sandbox', wrongText: 'ungeprüft generierter Code läuft direkt auf dem echten System.' },
        { id: 'deploy', label: 'Nach Produktion deployen', note: 'Veröffentlicht live.', risk: 'high', bestZone: 'approval', wrongText: 'Release ohne Freigabe — hoch-impact ohne Kontrolle.' },
        { id: 'migrate', label: 'DB-Migration ausführen', note: 'Verändert Produktionsdaten endgültig.', risk: 'high', bestZone: 'approval', wrongText: 'irreversible Datenänderung ohne menschliche Bestätigung.' },
        { id: 'fetch_web', label: 'Externe Doku aus dem Web holen', note: 'Lädt Inhalt von außen.', risk: 'high', bestZone: 'isolate', wrongText: 'externer Inhalt als Instruktion behandelt = Injection-Pfad.' },
      ],
    },
  },
]
