import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-00-02 · voice per control/10 VX rules (2026-07-05). Concept: the visible prompt/answer
// is the tip; reliability lives in the engineering below the waterline. Demo ≠ system.
export const icebergModel: Lesson = {
  id: 'LESSON-00-02',
  roadmapNodeId: 'NODE-00-02',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-00-01'],
  title: 'The Iceberg Model',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Die sichtbare Spitze vom Engineering trennen, das ein AI-Feature verlässlich macht.',
  interactionType: 'layer-stack-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-003', 'layer_classification_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Freitag Demo, Montag Produktion',
      text: 'Freitagnachmittag zeigt jemand dem Management einen Chatbot. Frage rein, gute Antwort raus, Applaus. Was das Management gesehen hat: ein Prompt und eine Antwort. Was es nicht gesehen hat: dass es dazwischen nichts gibt. Keine Versorgung mit Belegen, keine Messung, keine Absicherung. Die Demo zeigt die Spitze. Ob das Ding montags 5 000 echte Anfragen übersteht, entscheidet alles unterhalb der Wasserlinie.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'tip-or-iceberg',
        format: 'categorize',
        stem: 'Sortier die Bestandteile des Chatbots: Was davon hat das Management in der Demo gesehen — und was liegt unter der Wasserlinie?',
        buckets: [
          { id: 'tip', label: 'In der Demo sichtbar' },
          { id: 'deep', label: 'Unter der Wasserlinie' },
        ],
        items: [
          { id: 'ic-prompt', text: 'Die Frage, die der Vorführende eintippt', bucketId: 'tip', why: 'Sichtbar. Und in der Demo natürlich eine, die gut funktioniert.' },
          { id: 'ic-answer', text: 'Die Antwort auf dem Beamer', bucketId: 'tip', why: 'Sichtbar. Über die anderen 4 999 möglichen Antworten sagt sie nichts.' },
          { id: 'ic-context', text: 'Was pro Anfrage an Belegen ins Context-Fenster wandert', bucketId: 'deep', why: 'Entscheidet die Antwortqualität und ist von außen unsichtbar. In der Freitags-Demo: nichts davon vorhanden.' },
          { id: 'ic-retrieval', text: 'Die Suche, die diese Belege findet', bucketId: 'deep', why: 'Ohne sie beantwortet das Modell alles aus dem Trainingsstand. Fällt erst auf, wenn jemand nach etwas Aktuellem fragt.' },
          { id: 'ic-evals', text: 'Die Messung, die Verschlechterungen meldet', bucketId: 'deep', why: 'Unsichtbar, bis sie fehlt. Dann merkt man Regressionen daran, dass Kunden sich beschweren.' },
          { id: 'ic-guard', text: 'Die Freigabe-Schranke vor riskanten Aktionen', bucketId: 'deep', why: 'Interessiert in der Demo niemanden. Nach dem ersten ungefragten Datenbank-Schreibzugriff interessiert sie alle.' },
        ],
        takeaway: 'Wenn dir jemand ein AI-Feature zeigt, frag nach der Wasserlinie: Woher kommen die Belege, wer misst, was passiert bei riskanten Aktionen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'iceberg-why',
        format: 'pick',
        stem: 'Der Chatbot ist live gegangen. Drei Wochen später: teils falsche, veraltete Antworten, das Team hat einen Nachmittag. Womit fängst du an?',
        options: [
          {
            id: 'below',
            text: 'Unter der Wasserlinie nachsehen: Für fünf falsche Antworten prüfen, welche Belege die Context-Assembly tatsächlich geliefert hat und was Retrieval fand.',
            correct: true,
            why: 'Prompt und Antwort zeigen den Fehler nur an. Entstanden ist er darunter — und erst wenn du die gelieferte Evidenz gesehen hast, weißt du, welche Ebene ihn produziert. Alles andere ist Raten mit Werkzeug.',
          },
          {
            id: 'prompt',
            text: 'Den System-Prompt umformulieren und schauen, ob die Antworten besser werden.',
            correct: false,
            why: 'Vielleicht wirkt es sogar. Nur weiß danach niemand warum, und der eigentliche Defekt (z. B. leere Retrieval-Treffer) liegt weiter da.',
          },
          {
            id: 'replay',
            text: 'Den Stand wiederherstellen, mit dem die Demo lief — da ging es ja.',
            correct: false,
            why: 'Fühlt sich nach Sorgfalt an, ist aber rückwärts gedacht: Die Demo hat die tiefen Ebenen nie benutzt. Es gibt keinen „funktionierenden Zustand", zu dem du zurück kannst. Es gab einen gelungenen Lauf.',
          },
          {
            id: 'fewshot',
            text: 'Ein paar Muster-Antworten in den Prompt legen, damit das Modell den Ton trifft.',
            correct: false,
            why: 'Beispiele formen Stil und Format. Fehlende Fakten erzeugen sie nicht — veraltete Antworten sind ein Versorgungsproblem.',
          },
        ],
        takeaway: 'Debugging-Reihenfolge für AI-Features: erst die gelieferte Evidenz ansehen, dann urteilen. An der Spitze polieren kommt zuletzt, wenn überhaupt.',
      },
    },
  ],
}
