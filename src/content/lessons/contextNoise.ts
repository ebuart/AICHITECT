import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-02-02 · post-template redesign, HARD. Bespoke puzzle exercises (multispot over a real
// assembled context · pick). The durable skill: judge each item's RELEVANCE to the actual
// question and evict noise — irrelevant retrievals, stale off-topic history, raw unsummarised
// dumps, duplicates, over-broad docs — even when the budget is ample.
export const contextNoise: Lesson = {
  id: 'LESSON-02-02',
  roadmapNodeId: 'NODE-02-02',
  conceptIds: ['CONCEPT-CTX-003'],
  prerequisites: ['NODE-02-01'],
  title: 'Context Noise',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Irrelevanten, veralteten oder rohen Context erkennen und entfernen, damit Signal überlebt.',
  interactionType: 'context-budget-board',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-CONTEXT-NOISE',
  reviewHooks: ['CONCEPT-CTX-003'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Rauschen kostet Qualität',
      text: 'Mehr Context ist nicht besser. Irrelevante, veraltete oder rohe Inhalte lenken das Modell ab und verwässern das Signal — selbst wenn das Budget locker reicht. Entscheidend ist Relevanz zur konkreten Frage.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'evict-noise',
        format: 'multispot',
        stem: 'Das ist der zusammengestellte Context für die Frage unten. Tippe jeden Block an, der Rauschen ist und raus sollte.',
        intro: 'Frage des Nutzers: „Kann ich meine Bestellung nach 10 Tagen noch zurückgeben?"',
        lines: [
          { id: 'x1', text: '[system]   Du bist ein Support-Agent. Antworte knapp und belegt.' },
          { id: 'x2', text: '[doc #1]   Rückgaberecht: 14 Tage ab Erhalt der Ware.' },
          {
            id: 'x3',
            text: '[doc #2]   Karriere: Wir stellen aktuell Backend-Entwickler ein.',
            isAttack: true,
            note: 'Themenfremd zur Rückgabe-Frage — reine Ablenkung.',
          },
          {
            id: 'x4',
            text: '[history]  (vor 3 Tagen) Nutzer fragte nach den Versandkosten nach Österreich.',
            isAttack: true,
            note: 'Veralteter, anderer Thread — hat mit der aktuellen Rückgabe-Frage nichts zu tun.',
          },
          {
            id: 'x5',
            text: '[tool]     {"orders":[{"id":8842,"items":[…420 Zeilen rohes JSON…]}]}',
            isAttack: true,
            note: 'Roher, unsummierter Dump: 420 Zeilen, von denen eine Zeile zählt. Erst destillieren, dann einlegen.',
          },
          {
            id: 'x6',
            text: '[doc #3]   Rückgaberecht: 14 Tage ab Erhalt der Ware.',
            isAttack: true,
            note: 'Wortgleiches Duplikat von doc #1 — kostet Platz und Aufmerksamkeit ohne neuen Informationswert.',
          },
          {
            id: 'x7',
            text: '[doc #4]   AGB §1–§40 (Volltext, allgemein).',
            isAttack: true,
            note: 'Viel zu breit: 40 Paragraphen für eine Frist-Frage. Niedrige Relevanzdichte verwässert das Signal.',
          },
          { id: 'x8', text: '[user]     „Kann ich meine Bestellung nach 10 Tagen noch zurückgeben?"' },
        ],
        takeaway: 'Behalte System-Prompt, den einen relevanten Beleg und die Frage. Raus fliegt: Themenfremdes, Veraltetes, rohe Dumps, Duplikate und Über-breites — Relevanzdichte schlägt Menge.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'noise-principle',
        format: 'pick',
        stem: 'Das Budget reicht locker — warum trotzdem aufräumen?',
        options: [
          {
            id: 'signal',
            text: 'Irrelevante Inhalte lenken das Modell ab und verwässern das Signal — die Antwortqualität sinkt, obwohl „alles dabei" ist.',
            correct: true,
            why: 'Aufmerksamkeit ist begrenzt, nicht nur Platz. Rauschen konkurriert mit dem Beleg um die Aufmerksamkeit des Modells (und versteckt ihn „in der Mitte").',
          },
          {
            id: 'cost',
            text: 'Nur wegen der Token-Kosten.',
            correct: false,
            why: 'Kosten sind ein Nebeneffekt. Der Hauptschaden ist die schlechtere Antwort, nicht die Rechnung.',
          },
          {
            id: 'safe',
            text: 'Gar nicht — „zur Sicherheit alles mitgeben" ist das Sicherste.',
            correct: false,
            why: 'Genau dieser Reflex erzeugt das Problem: mehr Kontext ist nicht mehr Sicherheit, sondern mehr Ablenkung.',
          },
          {
            id: 'window',
            text: 'Nur damit man unter das Context-Limit kommt.',
            correct: false,
            why: 'Hier reicht das Budget ausdrücklich. Das Aufräumen dient der Qualität, nicht dem Limit.',
          },
        ],
        takeaway: 'Context kuratiert man für Relevanzdichte, nicht nur fürs Budget — Rauschen kostet Qualität, lange bevor es Platz kostet.',
      },
    },
  ],
}
