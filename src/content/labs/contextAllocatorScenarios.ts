import type { LabScenario } from '@/features/labs/interactionModel'
import type { AllocScenarioData } from '@/features/labs/contextAllocator/types'

// Allocator scenarios (MECH-ALLOCATE, NODE-02-01). Split a finite token budget under
// scarcity — no single right answer, graded on direction. Base: protect task +
// constraints + evidence; don't let old history drown the signal. Transfer: tight 4k
// research budget where two key sources must dominate.
export const contextAllocatorScenarios: LabScenario<AllocScenarioData>[] = [
  {
    id: 'ALLOC-BASE',
    interactionType: 'context-allocator',
    labId: 'LAB-CONTEXT-ALLOCATOR',
    roadmapNodeId: 'NODE-02-01',
    title: 'Context Budget — Allokation',
    prompt:
      'Du hast ein endliches Context-Budget für einen Coding-Agenten. Verteile es so, dass das Wichtige Platz hat und Noise nicht das Signal verdrängt. Kein perfekter Wert — die Richtung zählt.',
    concepts: ['CONCEPT-CTX-001', 'CONCEPT-CTX-002', 'CONCEPT-CTX-003'],
    prerequisites: ['NODE-01-03'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'alloc-default',
    feedbackProfileId: 'alloc-default',
    reviewHooks: ['allocation_transfer', 'context_noise_transfer'],
    scenarioData: {
      situation: 'Ein Agent implementiert ein neues API-Feld unter aktiven Architektur-Constraints. Es gibt viel alten Chat-Verlauf und veraltete Notizen, die um Platz konkurrieren.',
      budget: '8.000 Tokens',
      items: [
        { id: 'sys', label: 'System-Regeln', note: 'Rolle, Format, Leitplanken.', overText: 'aufgebläht — weniger Platz für Aufgabe und Evidenz.', underText: 'ohne Leitplanken driftet das Verhalten.' },
        { id: 'task', label: 'Task-Spezifikation', note: 'Was genau gebaut werden soll.', overText: 'überdokumentiert — verdrängt die konkrete Evidenz.', underText: 'ohne klare Aufgabe rät der Agent.' },
        { id: 'constraints', label: 'Architektur-Constraints', note: 'Die Regeln, die Erfolg definieren.', overText: 'überbetont — zu wenig Raum für die Quelldatei.', underText: 'fehlen sie, baut der Agent plausibel an den Regeln vorbei.' },
        { id: 'evidence', label: 'Relevante Quelldatei', note: 'Der konkrete Code, der geändert wird.', overText: 'zu viel Rohcode flutet den Context.', underText: 'ohne die Stelle fehlt der konkrete Bezug.' },
        { id: 'history', label: 'Alter Chat-Verlauf', note: 'Größtenteils veraltet, niedrige Relevanz.', overText: 'alter Verlauf verdrängt Constraints und Evidenz — das Signal ertrinkt.', underText: 'kaum relevant — hier ist wenig zu verlieren.' },
        { id: 'noise', label: 'Veraltete Notizen', note: 'Off-topic, stale.', overText: 'irrelevanter Noise frisst Budget.', underText: 'richtig — Noise gehört fast raus.' },
      ],
      rubric: {
        ideal: { sys: 12, task: 22, constraints: 26, evidence: 28, history: 7, noise: 5 },
        min: { sys: 8, task: 15, constraints: 18 },
        max: { history: 18, noise: 12 },
        tolerance: 9,
      },
    },
  },
  {
    id: 'ALLOC-TRANSFER',
    interactionType: 'context-allocator',
    labId: 'LAB-CONTEXT-ALLOCATOR',
    roadmapNodeId: 'NODE-02-01',
    title: 'Context Budget — Transfer: knappe Recherche',
    prompt:
      'Geändertes Profil: nur 4.000 Tokens für eine Recherche. Zwei Schlüssel-Quellen müssen dominieren, der Rest muss weichen. Verteile.',
    concepts: ['CONCEPT-CTX-002', 'CONCEPT-CTX-004'],
    prerequisites: ['NODE-01-03'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'alloc-default',
    feedbackProfileId: 'alloc-default',
    reviewHooks: ['allocation_transfer'],
    scenarioData: {
      situation: 'Beantworte eine Recherchefrage gestützt auf zwei Schlüssel-Quellen — bei sehr knappem Budget.',
      budget: '4.000 Tokens',
      items: [
        { id: 'sys', label: 'System-Regeln', note: 'Knapp halten.', overText: 'frisst Platz, den die Quellen brauchen.', underText: 'ein Minimum an Format/Rolle bleibt nötig.' },
        { id: 'question', label: 'Recherchefrage', note: 'Die präzise Frage.', overText: 'überspezifiziert auf Kosten der Evidenz.', underText: 'ohne klare Frage wird die Antwort vage.' },
        { id: 'sourceA', label: 'Schlüssel-Quelle A', note: 'Primäre Evidenz.', overText: 'gut — aber Quelle B braucht auch Platz.', underText: 'zu wenig — die Antwort wird unbelegt.' },
        { id: 'sourceB', label: 'Schlüssel-Quelle B', note: 'Zweite primäre Evidenz.', overText: 'gut — aber balanciere mit Quelle A.', underText: 'zu wenig — die zweite Perspektive fehlt.' },
        { id: 'dump', label: 'Web-Dump (gemischt)', note: 'Viel Rauschen, wenig Signal.', overText: 'verdrängt die Schlüssel-Quellen mit Noise.', underText: 'richtig — der Dump gehört fast raus.' },
      ],
      rubric: {
        ideal: { sys: 8, question: 16, sourceA: 34, sourceB: 34, dump: 8 },
        min: { sourceA: 22, sourceB: 22 },
        max: { dump: 14 },
        tolerance: 9,
      },
    },
  },
  {
    id: 'DIR-OVERSIGHT-BASE',
    interactionType: 'context-allocator',
    labId: 'LAB-CONTEXT-ALLOCATOR',
    roadmapNodeId: 'NODE-11-03',
    title: 'Verteile deine Aufsicht',
    prompt:
      'Drei Bienen laufen parallel. Deine Review-Zeit ist knapp. Verteile deine Aufmerksamkeit nach RISIKO — nicht gleichmäßig. Reversibles braucht wenig Blick, Irreversibles viel.',
    concepts: ['CONCEPT-DIR-003'],
    prerequisites: ['NODE-11-02'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'alloc-default',
    feedbackProfileId: 'alloc-default',
    reviewHooks: ['direction_transfer', 'allocation_transfer'],
    scenarioData: {
      situation: 'Drei Agenten arbeiten gleichzeitig an Teilaufgaben. Als Director kannst du nicht alles gleich genau prüfen — gewichte deine Aufsicht nach Schaden-wenn-falsch.',
      budget: 'deine Review-Aufmerksamkeit',
      items: [
        { id: 'migration', label: 'DB-Migration (irreversibel)', note: 'Verändert Produktionsdaten endgültig.', overText: 'gut investiert — hier ist ein Fehler nicht zurückzunehmen.', underText: 'gefährlich: irreversibler Schaden bei zu wenig Blick.' },
        { id: 'payments', label: 'Zahlungs-Logik', note: 'Bewegt echtes Geld.', overText: 'angemessen — hoher Schaden bei Fehlern.', underText: 'riskant: finanzielle Fehler rutschen ungeprüft durch.' },
        { id: 'copy', label: 'UI-Texte anpassen', note: 'Reversibel, niedriger Impact.', overText: 'verschwendet: harmlose, leicht rückgängige Änderung überprüft.', underText: 'richtig — wenig Risiko, wenig Aufsicht nötig.' },
        { id: 'tests', label: 'Zusätzliche Tests', note: 'Niedriges Risiko, sichern aber die anderen ab.', overText: 'etwas viel für ein Sicherheitsnetz.', underText: 'ein kurzer Blick genügt.' },
      ],
      rubric: {
        ideal: { migration: 36, payments: 34, copy: 8, tests: 22 },
        min: { migration: 25, payments: 22 },
        max: { copy: 16 },
        tolerance: 9,
      },
    },
  },
  {
    id: 'DIR-SCOPE-BASE',
    interactionType: 'context-allocator',
    labId: 'LAB-CONTEXT-ALLOCATOR',
    roadmapNodeId: 'NODE-13-01',
    title: 'Priorisieren und streichen',
    prompt:
      'Mehr Feature-Wünsche als Kapazität. Verteile den Sprint nach Wert × Risiko — finanzier den Kern, entschärfe das Ungewisse früh, und hab den Mut, Wenig-Wertvolles auf fast null zu setzen.',
    concepts: ['CONCEPT-DIR-008'],
    prerequisites: ['NODE-12-03'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'alloc-default',
    feedbackProfileId: 'alloc-default',
    reviewHooks: ['direction_transfer', 'allocation_transfer'],
    scenarioData: {
      situation: 'Ein Sprint, vier Kandidaten, nicht genug Zeit für alle. Als Product-Lead verteilst du die Kapazität — gleichmäßig wäre die feige Antwort.',
      budget: 'deine Sprint-Kapazität',
      items: [
        { id: 'core', label: 'Kern-Flow (90% der Nutzung)', note: 'Der Hauptwert des Releases.', overText: 'lass etwas Raum für das ungewisse Item.', underText: 'der Kern darf nicht hungern — hier liegt der Wert.' },
        { id: 'risky', label: 'Feature mit unklarer Machbarkeit', note: 'Technisch ungewiss; könnte spät explodieren.', overText: 'ein De-Risk-Spike reicht; nicht das ganze Budget.', underText: 'ungeprüftes Risiko schlägt am Sprintende zu — entschärfe es früh.' },
        { id: 'nice', label: 'Nettes Detail, kaum genutzt', note: 'Niedriger Wert, kein Schmerz, wenn es fehlt.', overText: 'verschwendet: niedriger Wert frisst Kapazität für den Kern.', underText: 'richtig — fast streichen.' },
        { id: 'polish', label: 'Politur an einem fertigen Bereich', note: 'Schon gut genug; geringer Grenznutzen.', overText: 'Gold-Plating: schon fertig, kaum zusätzlicher Wert.', underText: 'ein kurzer Schliff genügt.' },
      ],
      rubric: {
        ideal: { core: 48, risky: 30, nice: 6, polish: 16 },
        min: { core: 35, risky: 18 },
        max: { nice: 14, polish: 26 },
        tolerance: 9,
      },
    },
  },
]
