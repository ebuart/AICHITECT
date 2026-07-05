import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-03 · PILOT of the experience overhaul (control/10, DEC-0017). New node anatomy
// (IX-8): short input → USE #1 feel it (RequestFlowExplorer: send a request, switch layers
// off, read the payloads) → USE #2 apply it (assign incidents to their repair layer) →
// USE #3 transfer it (a symptom from a different layer family). Voice per VX rules.
export const systemLayersMap: Lesson = {
  id: 'LESSON-01-03',
  roadmapNodeId: 'NODE-01-03',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-01-02'],
  title: 'System Layers Map',
  estimatedMinutes: 9,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Fehler auf der Ebene reparieren, auf der sie entstehen.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-AIE-003'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Eine Anfrage, sieben Stationen',
      text: 'Unten steht ein komplettes AI-System. Eine Mitarbeiterin fragt nach dem neuen Staffelrabatt — die Zahl hat sich vor einer Woche geändert, im Trainingswissen des Modells steht noch die alte. Schick die Anfrage ab und schau dir an jeder Station an, was dort wirklich vorliegt. Danach der interessante Teil: Schalt Ebenen ab. Jede fehlende Ebene produziert einen anderen, typischen Vorfall.',
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
        stem: 'Vier Vorfälle aus echten Systemen. Auf welcher Ebene reparierst du jeden — also dort, wo er entstanden ist?',
        buckets: [
          { id: 'context', label: 'Context / Retrieval' },
          { id: 'tool', label: 'Tool-Ebene' },
          { id: 'eval', label: 'Eval / Observability' },
        ],
        items: [
          { id: 'inc-stale', text: 'Der Bot nennt Preise von letztem Jahr. Klingt dabei völlig sicher.', bucketId: 'context', why: 'Das ist der Lauf ohne Retrieval, den du gerade gesehen hast. Das Modell kann nur wiedergeben, was man ihm hinlegt — die Reparatur ist die Versorgung, nicht das Modell.' },
          { id: 'inc-delete', text: 'Beim Aufräumen alter Tickets hat der Agent auch drei offene gelöscht. Rückgängig geht nicht.', bucketId: 'tool', why: 'Ein irreversibler Schreibzugriff ohne Gate. Dieselbe Geschichte wie der CRM-Eintrag im Explorer: die Fähigkeit war ungeschützt, nicht der Auftrag falsch.' },
          { id: 'inc-silent', text: 'Seit drei Wochen werden die Antworten schlechter. Aufgefallen ist es, als ein Kunde sich beschwert hat.', bucketId: 'eval', why: 'Kein Eval, keine Messung — Regressionen laufen unbemerkt auf, bis ein Mensch zufällig hinsieht. Repariert wird die Messbarkeit, nicht die eine Antwort.' },
          { id: 'inc-noise', text: 'Die richtige Doku ist im Prompt enthalten. Zitiert wird trotzdem regelmäßig eine alte FAQ.', bucketId: 'context', why: 'Der Lauf ohne Kuration: 14 Dokumente im Fenster, der richtige Absatz auf Position 9. Zu viel Material ist ein Context-Problem, auch wenn nichts überläuft.' },
        ],
        takeaway: 'Frag bei jedem Vorfall zuerst: Auf welcher Station wäre er im Explorer sichtbar geworden? Da wird repariert.',
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
            why: 'Dass es „vorher ging", war Glück — das alte Modell hat zufällig brav formatiert. Ein Feld, das jedes Format annimmt, bricht bei jedem Modellwechsel anders. Das Schema macht aus der Konvention eine Regel.',
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
            why: 'Eine Bitte, keine Grenze. Hilft im Schnitt, garantiert nichts — und du misst nie, wann sie ignoriert wird. Die Ebene, die Formate erzwingen kann, ist das Schema.',
          },
          {
            id: 'catch',
            text: 'Im Backend einen Parser bauen, der „nächsten Dienstag" errät.',
            correct: false,
            why: 'Jetzt gibt es zwei Systeme, die raten. Die Reparatur wandert eine Ebene zu tief und macht das eigentliche Interface noch undefinierter.',
          },
        ],
        takeaway: 'Wenn ein Modellwechsel etwas kaputt macht, das „immer ging": Erst prüfen, ob es je garantiert war. Meistens fehlt die Grenze, nicht das alte Modell.',
      },
    },
  ],
}
