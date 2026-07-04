import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-04-03 · post-template redesign, HARD. Bespoke puzzle exercises (match · pick). The
// durable skill: an orchestrator plans + delegates DYNAMIC subtasks to isolated workers that
// each return only a result — and you reach for it only when the decomposition isn't known up
// front (otherwise a fixed workflow is simpler).
export const orchestratorWorker: Lesson = {
  id: 'LESSON-04-03',
  roadmapNodeId: 'NODE-04-03',
  conceptIds: ['CONCEPT-CF-005'],
  prerequisites: ['NODE-04-02'],
  title: 'Orchestrator-Worker',
  estimatedMinutes: 7,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Dynamische Teilaufgaben an isolierte Worker delegieren — und wissen, wann es sich lohnt.',
  interactionType: 'architecture-builder',
  visualModelId: 'systemRow',
  feedbackPatternId: 'FB-PATTERN-CONTEXT-NOISE',
  reviewHooks: ['CONCEPT-CF-005', 'CONCEPT-CTX-005'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Orchestrator-Worker',
      text: 'Ein Orchestrator zerlegt eine Aufgabe zur Laufzeit und verteilt die Teile an Worker. Jeder Worker arbeitet in seinem eigenen Context an einer eng umrissenen Teilaufgabe und gibt nur das Ergebnis zurück; der Orchestrator führt sie zusammen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'roles',
        format: 'match',
        stem: 'Ordne jedem Begriff seine Rolle im Muster zu.',
        pairs: [
          { id: 'orch', left: 'Orchestrator', right: 'Zerlegt zur Laufzeit, delegiert und aggregiert die Ergebnisse', why: 'Er plant dynamisch — die Zahl der Teilaufgaben steht erst beim Lauf fest.' },
          { id: 'worker', left: 'Worker', right: 'Löst eine eng umrissene Teilaufgabe, gibt nur das Ergebnis zurück', why: 'Fokussiert und ersetzbar; sein Lärm bleibt bei ihm.' },
          { id: 'wctx', left: 'Worker-Context', right: 'Sieht nur seine Teilaufgabe, nicht den ganzen Hauptverlauf', why: 'Isolation hält den Hauptkontext sauber und den Worker fokussiert.' },
          { id: 'agg', left: 'Aggregation', right: 'Der Orchestrator fügt die Worker-Ergebnisse zur Gesamtantwort zusammen', why: 'Erst hier entsteht aus Teilergebnissen das Ganze.' },
        ],
        takeaway: 'Orchestrator plant/aggregiert, Worker lösen isoliert je eine Teilaufgabe — Delegation mit sauberer Context-Grenze.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'orch-contract-breach',
        format: 'pick',
        stem: 'Das Muster ist korrekt gewählt (dynamische Zerlegung). Trotzdem wächst der Kontext des Orchestrators pro Auftrag um zehntausende Tokens und Läufe werden gegen Ende unzuverlässig. Welcher Implementierungsfehler ist am wahrscheinlichsten?',
        options: [
          {
            id: 'raw-returns',
            text: 'Die Worker geben ihr Rohmaterial zurück (ganze Suchergebnisse, volle Dateien) statt nur des destillierten Ergebnisses.',
            correct: true,
            why: 'Das bricht den Vertrag, von dem das Muster lebt: der Lärm der Teilarbeit soll beim Worker bleiben. Fließt er zurück, erbt der Orchestrator jeden Dump — und degradiert wie ein Ein-Kontext-Lauf.',
          },
          {
            id: 'too-many',
            text: 'Die Zerlegung erzeugt zu viele Teilaufgaben.',
            correct: false,
            why: 'Viele Teilaufgaben kosten Zeit und Tokens BEI DEN WORKERN — der Orchestrator-Kontext wächst pro Task nur um das, was zurückkommt. Zwanzig destillierte Ergebnisse sind klein; ein einziger Rohdump ist groß.',
          },
          {
            id: 'parallel',
            text: 'Die Worker laufen parallel statt nacheinander.',
            correct: false,
            why: 'Gleichzeitigkeit ändert nicht, WAS im Orchestrator-Kontext landet — nur wann. Das Wachstum kommt vom Inhalt der Rückgaben, nicht vom Timing.',
          },
          {
            id: 'add-layer',
            text: 'Es fehlt eine weitere Ebene: ein Sub-Orchestrator, der die Ergebnisse zusammenfasst.',
            correct: false,
            why: 'Symptom-Patch durch Mehr-Architektur: bevor man eine Ebene draufsetzt, repariert man den Rückgabe-Vertrag der bestehenden Worker — dann braucht es die Ebene gar nicht.',
          },
        ],
        takeaway: 'Orchestrator-Worker steht und fällt mit dem Rückgabe-Vertrag: nur destillierte Ergebnisse wandern nach oben. Wächst der Hauptkontext trotzdem, ist fast immer dieser Vertrag gebrochen — nicht das Muster falsch.',
      },
    },
  ],
}
