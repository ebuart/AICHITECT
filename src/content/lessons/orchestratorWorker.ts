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
        id: 'when-orch',
        format: 'pick',
        stem: 'Wann ist Orchestrator-Worker die richtige Wahl — und nicht ein einfacheres Muster?',
        options: [
          {
            id: 'dynamic',
            text: 'Wenn die Zerlegung erst zur Laufzeit feststeht (z. B. „prüfe jede in dieser Datei genannte Quelle" — wie viele, weiß man vorher nicht).',
            correct: true,
            why: 'Genau dann kann man die Teilaufgaben nicht fest verdrahten — der Orchestrator zerlegt dynamisch.',
          },
          {
            id: 'known-parallel',
            text: 'Immer wenn Dinge parallel laufen könnten.',
            correct: false,
            why: 'Sind die unabhängigen Teilaufgaben vorab bekannt, reicht das einfachere Parallelisierungs-Muster — kein dynamischer Orchestrator nötig.',
          },
          {
            id: 'fixed-steps',
            text: 'Für eine feste Folge bekannter Schritte.',
            correct: false,
            why: 'Feste Schritte sind ein Prompt-Chaining-Fall; ein Orchestrator wäre überbaut.',
          },
          {
            id: 'power',
            text: 'Wann immer möglich — es ist das mächtigste Muster.',
            correct: false,
            why: 'Mächtiger heißt mehr beweglich Teile, Kosten und Fehlerquellen. Nimm das einfachste Muster, das die Aufgaben-Form trägt.',
          },
        ],
        takeaway: 'Orchestrator-Worker zahlt sich bei dynamischer, vorab unbekannter Zerlegung aus — sonst ist ein festes Muster einfacher und robuster.',
      },
    },
  ],
}
