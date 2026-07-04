import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-02-04 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). The
// durable skill: push noisy, high-volume sub-work into an ISOLATED subagent context so only the
// distilled RESULT returns — keeping the main context clean and on-task.
export const contextIsolation: Lesson = {
  id: 'LESSON-02-04',
  roadmapNodeId: 'NODE-02-04',
  conceptIds: ['CONCEPT-CTX-005'],
  prerequisites: ['NODE-02-03'],
  title: 'Context Isolation and Subagents',
  estimatedMinutes: 7,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Noisy Exploration in einen isolierten Worker-Context auslagern.',
  interactionType: 'agent-trace-debugger',
  visualModelId: 'trace',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-CTX-005', 'CONCEPT-CF-005'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Isolation',
      text: 'Lärmige Teilarbeit (Durchsuchen, Ausprobieren, große Dumps) gehört in einen Subagenten mit eigenem Context. Nur das destillierte Ergebnis kommt zurück — der Hauptkontext bleibt sauber und auf das Ziel fokussiert.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'isolate-what',
        format: 'categorize',
        stem: 'Was bekommt einen eigenen, isolierten Subagent-Context — und was bleibt im Hauptkontext?',
        buckets: [
          { id: 'isolate', label: 'Subagent (isoliert)' },
          { id: 'main', label: 'Hauptkontext' },
        ],
        items: [
          { id: 'i-pdf', text: 'Ein 400-Seiten-PDF durchsuchen, um eine Zahl zu finden', bucketId: 'isolate', why: 'Der ganze Rohtext würde den Hauptkontext fluten — nur die gefundene Zahl kommt zurück.' },
          { id: 'i-goal', text: 'Die Kernanforderung der Aufgabe', bucketId: 'main', why: 'Das Ziel muss im Hauptkontext bleiben, sonst verliert der Lauf die Richtung.' },
          { id: 'i-trial', text: 'Hunderte Tool-Outputs durchprobieren, bis einer passt', bucketId: 'isolate', why: 'Der ganze Suchlärm bleibt im Subagenten; zurück kommt nur der Treffer.' },
          { id: 'i-decision', text: 'Die finale Entscheidung des Nutzers', bucketId: 'main', why: 'Zentral für den weiteren Hauptverlauf.' },
          { id: 'i-scrape', text: 'Ein langer Web-Scrape, von dem zwei Sätze relevant sind', bucketId: 'isolate', why: 'Den Rohabzug isolieren, die zwei relevanten Sätze zurückgeben.' },
          { id: 'i-plan', text: 'Der laufende Plan und Status des Haupt-Tasks', bucketId: 'main', why: 'Steuert den Hauptlauf — gehört nicht in einen Worker.' },
        ],
        takeaway: 'Faustregel: Erzeugt eine Teilarbeit viel Material, von dem wenig zurückmuss → isolieren. Steuert sie den Hauptlauf → Hauptkontext.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'isolate-why',
        format: 'pick',
        stem: 'Ein Subagent durchsucht die 400 Seiten und gibt nur die gefundene Zahl zurück. Was ist der Hauptgewinn?',
        options: [
          {
            id: 'clean',
            text: 'Der 400-Seiten-Rohtext belastet nie den Hauptkontext — dort landet nur das destillierte Ergebnis.',
            correct: true,
            why: 'Genau dafür ist Isolation da: das Rauschen der Suche verdrängt nicht das Hauptziel, und der Hauptkontext bleibt klein und fokussiert.',
          },
          {
            id: 'faster',
            text: 'Die Suche selbst wird dadurch schneller.',
            correct: false,
            why: 'Die Suche dauert gleich lang — der Gewinn ist ein sauberer Hauptkontext, nicht Tempo.',
          },
          {
            id: 'cheaper',
            text: 'Es ist immer billiger, weil weniger Tokens.',
            correct: false,
            why: 'Der Subagent verbraucht die Such-Tokens trotzdem; gespart wird im Hauptkontext, nicht zwingend insgesamt. Kosten sind nicht der Kernpunkt.',
          },
          {
            id: 'security',
            text: 'Es ist in erster Linie eine Sicherheitsmaßnahme.',
            correct: false,
            why: 'Isolation kann Trust-Grenzen stützen, aber der primäre Zweck hier ist Context-Hygiene: Lärm draußen halten.',
          },
        ],
        takeaway: 'Isolation kauft dir einen sauberen Hauptkontext: viel Lärm rein in den Worker, nur das Ergebnis zurück.',
      },
    },
  ],
}
