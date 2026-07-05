import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-03 · PILOT of the experience overhaul (control/10, DEC-0017). Anatomy (IX-8):
// dossier (the case's real files) → short input → USE #1 feel it (RequestFlowExplorer) →
// USE #2 apply it (incidents → repair layer) → USE #3 transfer. Impersonal register per
// VX-B1 (user 2026-07-05): the site does not talk to the learner.
export const systemLayersMap: Lesson = {
  id: 'LESSON-01-03',
  roadmapNodeId: 'NODE-01-03',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-01-02'],
  title: 'System Layers Map',
  estimatedMinutes: 10,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Fehler auf der Ebene reparieren, auf der sie entstehen.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-AIE-003'],
  blocks: [
    {
      kind: 'dossier',
      intro:
        'Ein Software-Händler mit internem AI-Assistenten. Die relevanten Dateien aus dem Firmen-Repo.',
      files: [
        {
          name: 'pricing/rabatte.md',
          meta: 'geändert vor 6 Tagen',
          body: `## §3 Staffelrabatt (Bestandskunden)

Ab 01.07.2026 gilt:
  · 8 %  ab  50 Stück
  · 12 % ab 250 Stück

Änderung 28.06.2026 (Pricing-Team):
Schwellen gesenkt, Sätze erhöht.
Vorher: 5 % ab 100 Stück.`,
        },
        {
          name: 'sales/faq.md',
          meta: 'Stand: März (veraltet)',
          body: `# Sales-FAQ (interner Schnellüberblick)

F: Welchen Staffelrabatt bekommen Bestandskunden?
A: 5 % ab 100 Stück. Gilt nicht für Neukunden.

F: Wer genehmigt Sonderkonditionen?
A: Teamlead Sales, ab 15 % der Vertrieb-Chef.

(Zuletzt gepflegt: 12.03.2026)`,
        },
        {
          name: 'tools/update_crm.json',
          meta: 'Tool-Contract des Assistenten',
          body: `{
  "name": "update_crm",
  "description": "Schreibt Konditionen in Kundendatensätze.",
  "parameters": {
    "segment":     { "type": "string" },
    "rabattstufe": { "type": "string" }
  },
  "scope": "write:crm/*"        // schreibt echte Daten
}`,
        },
        {
          name: '#pricing-updates (Slack)',
          meta: 'letzte Woche',
          body: `[28.06. 14:02] Lena (Pricing):
Heads-up: Staffelrabatt-Änderung ist ab 1.7. live.
rabatte.md ist aktualisiert. Die Sales-FAQ bitte
noch jemand anfassen, die hat noch die alten Zahlen.

[28.06. 14:09] Jonas: 👍 mach ich die Tage

(Stand heute: nicht passiert.)`,
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Eine Anfrage, sieben Stationen',
      text: 'Eine Mitarbeiterin fragt den Assistenten nach dem neuen Staffelrabatt. Unten läuft dieselbe Anfrage fünfmal durch das System, in jedem Lauf fehlt eine andere Ebene.',
    },
    {
      kind: 'explorer',
      explorerId: 'EXP-REQUEST-FLOW',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'layer-roles',
        format: 'categorize',
        stem: 'Vier Vorfälle aus echten Systemen. Wo ist jeder entstanden und muss folglich auch repariert werden?',
        buckets: [
          { id: 'context', label: 'Context / Retrieval' },
          { id: 'tool', label: 'Tool-Ebene' },
          { id: 'eval', label: 'Eval / Observability' },
        ],
        items: [
          { id: 'inc-stale', text: 'Der Bot nennt Preise von letztem Jahr. Klingt dabei völlig sicher.', bucketId: 'context', why: 'Der Lauf ohne Retrieval aus dem Explorer. Ein Modell kann nur wiedergeben, was ihm vorliegt. Repariert wird die Versorgung, nicht das Modell.' },
          { id: 'inc-delete', text: 'Beim Aufräumen alter Tickets hat der Agent auch drei offene gelöscht. Rückgängig geht nicht.', bucketId: 'tool', why: 'Ein irreversibler Schreibzugriff ohne Gate, dieselbe Geschichte wie der CRM-Eintrag im Explorer. Die Fähigkeit war ungeschützt, nicht der Auftrag falsch.' },
          { id: 'inc-silent', text: 'Seit drei Wochen werden die Antworten schlechter. Aufgefallen ist es, als ein Kunde sich beschwert hat.', bucketId: 'eval', why: 'Ohne Messung laufen Regressionen unbemerkt auf, bis zufällig ein Mensch hinsieht. Repariert wird die Messbarkeit, nicht die eine Antwort.' },
          { id: 'inc-noise', text: 'Die richtige Doku ist im Prompt enthalten. Zitiert wird trotzdem regelmäßig eine alte FAQ.', bucketId: 'context', why: 'Der Lauf ohne Kuration: 14 Dokumente im Fenster, der richtige Absatz auf Position 9. Zu viel Material ist ein Context-Problem, auch wenn nichts überläuft.' },
        ],
        takeaway: 'Bei jedem Vorfall zuerst die Frage: An welcher Station wäre er im Explorer sichtbar geworden? Dort wird repariert.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'which-layer',
        format: 'pick',
        stem: 'Neuer Fall, andere Baustelle: Seit dem Modell-Upgrade ruft der Agent das Buchungs-Tool mit Datumsformaten auf, die das System nicht kennt („nächsten Dienstag" statt 2026-07-14). Vorher ging das gut. Wo setzt die dauerhafte Reparatur an?',
        options: [
          {
            id: 'contract',
            text: 'Am Tool-Contract: das Datums-Feld bekommt ein festes Format im Schema (type + pattern), statt freien Text zu erlauben.',
            correct: true,
            why: 'Dass es „vorher ging", war Glück: Das alte Modell hat zufällig brav formatiert. Ein Feld, das jedes Format annimmt, bricht bei jedem Modellwechsel anders. Das Schema macht aus der Konvention eine Regel.',
          },
          {
            id: 'rollback',
            text: 'Zurück aufs alte Modell, das hat ja funktioniert.',
            correct: false,
            why: 'Kauft Zeit, repariert nichts. Der lose Contract ist noch da und wartet auf das nächste Upgrade.',
          },
          {
            id: 'prompt',
            text: 'In den System-Prompt schreiben: „Datumsangaben bitte immer als ISO 8601."',
            correct: false,
            why: 'Eine Bitte, keine Grenze. Hilft im Schnitt, garantiert nichts, und niemand misst, wann sie ignoriert wird. Die Ebene, die Formate erzwingen kann, ist das Schema.',
          },
          {
            id: 'catch',
            text: 'Im Backend einen Parser bauen, der „nächsten Dienstag" errät.',
            correct: false,
            why: 'Dann raten zwei Systeme. Die Reparatur wandert eine Ebene zu tief und macht das eigentliche Interface noch undefinierter.',
          },
        ],
        takeaway: 'Wenn ein Modellwechsel etwas kaputt macht, das „immer ging": erst prüfen, ob es je garantiert war. Meistens fehlt die Grenze, nicht das alte Modell.',
      },
    },
  ],
}
