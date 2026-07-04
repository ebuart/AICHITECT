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
        stem: 'Ein Assistent bekommt großzügig Kontext, das Fenster ist nie voll. Trotzdem: je länger ein Gespräch läuft, desto öfter zitiert er eine FALSCHE Quelle — obwohl die richtige nachweislich im Context steht. Woran liegt es?',
        options: [
          {
            id: 'signal',
            text: 'Aufmerksamkeit ist knapper als Platz: der angesammelte irrelevante Verlauf konkurriert mit dem richtigen Beleg, der „in der Mitte" untergeht — die Relevanzdichte sinkt mit jedem Turn.',
            correct: true,
            why: 'Genau das Rausch-Symptom: nichts läuft über, aber das Signal wird verwässert. Der Fix ist Kuration (Altes raus, Duplikate raus, Breites destillieren), nicht mehr Platz.',
          },
          {
            id: 'not-retrieved',
            text: 'Die richtige Quelle wurde gar nicht erst retrievt.',
            correct: false,
            why: 'Die Voraussetzung sagt das Gegenteil: sie STEHT im Context. Das Problem ist nicht Beschaffung, sondern dass sie im Rauschen nicht mehr gewinnt.',
          },
          {
            id: 'overflow',
            text: 'Das Fenster läuft über und schneidet die richtige Quelle ab.',
            correct: false,
            why: 'Auch das widerspricht der Voraussetzung („nie voll"). Verwechslungsgefahr: Überlauf ist ein Budget-Problem — hier degradiert die Qualität lange VOR dem Limit.',
          },
          {
            id: 'format',
            text: 'Die richtige Quelle ist schlechter formatiert als die falsche.',
            correct: false,
            why: 'Formatierung ist selten der Mechanismus — und erklärt nicht, warum es mit wachsender Verlaufs-Länge schlimmer wird. Der wachsende Faktor ist das Rauschen.',
          },
        ],
        takeaway: 'Qualität kippt lange bevor das Fenster voll ist: Rauschen verdrängt den Beleg aus der Aufmerksamkeit, nicht aus dem Fenster. Kuratieren nach Relevanzdichte — und Prämissen einer Diagnose ernst nehmen.',
      },
    },
  ],
}
