import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-04-02 · post-template redesign, HARD. Bespoke puzzle exercises (match pattern↔fit ·
// pick). The durable skill: map a task shape to the SIMPLEST control-flow pattern that fits —
// chaining, routing, parallelization, orchestrator-worker, evaluator-optimizer — and resist
// reaching for an autonomous agent when a fixed workflow suffices.
export const workflowPatterns: Lesson = {
  id: 'LESSON-04-02',
  roadmapNodeId: 'NODE-04-02',
  conceptIds: ['CONCEPT-CF-002', 'CONCEPT-CF-003', 'CONCEPT-CF-004'],
  prerequisites: ['NODE-04-01'],
  title: 'Workflow Patterns',
  estimatedMinutes: 7,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Die Aufgaben-Form auf das einfachste passende Control-Flow-Pattern abbilden.',
  interactionType: 'architecture-builder',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-CF-002'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Control-Flow-Pattern',
      text: 'Deterministischer Control Flow hat ein paar feste Bausteine. Welcher passt, folgt aus der FORM der Aufgabe — nicht aus „nimm das mächtigste". Erst wenn keiner reicht, kommt ein autonomer Agent.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'pattern-fit',
        format: 'match',
        stem: 'Ordne jedem Muster die Aufgaben-Form zu, für die es gemacht ist.',
        pairs: [
          { id: 'chain', left: 'Prompt Chaining', right: 'Feste, aufeinanderfolgende Teilschritte mit Gate dazwischen', why: 'Jeder Schritt baut auf dem geprüften Ergebnis des vorigen auf.' },
          { id: 'route', left: 'Routing', right: 'Eingaben fallen in klar verschiedene Kategorien, je eigener Pfad', why: 'Erst klassifizieren, dann zum Spezialpfad — kein Pfad muss alles können.' },
          { id: 'parallel', left: 'Parallelisierung', right: 'Unabhängige Teilaufgaben, die gleichzeitig laufen können', why: 'Kein Datenfluss zwischen ihnen → parallel, dann zusammenführen.' },
          { id: 'orch', left: 'Orchestrator-Worker', right: 'Teilaufgaben erst zur Laufzeit bekannt, ein Lead verteilt dynamisch', why: 'Die Zerlegung selbst hängt vom Input ab — sie kann nicht fest verdrahtet werden.' },
          { id: 'evopt', left: 'Evaluator-Optimizer', right: 'Klares Qualitätskriterium; Output iterativ verbessern', why: 'Ein Bewerter mit prüfbaren Kriterien steuert die Überarbeitung.' },
        ],
        takeaway: 'Die Form der Aufgabe wählt das Muster: feste Schritte → Chain, Kategorien → Routing, Unabhängiges → parallel, dynamische Zerlegung → Orchestrator, prüfbares Ziel → Evaluator-Loop.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'simplest-fit',
        format: 'pick',
        stem: 'Aufgabe: eingehende Support-Mails nach Typ (Rechnung / Technik / Sonstiges) an den passenden Antwort-Prompt geben. Welche Architektur?',
        options: [
          {
            id: 'routing',
            text: 'Routing: ein Klassifikator wählt den Typ, dann der passende feste Prompt.',
            correct: true,
            why: 'Genau die Form für Routing: klar getrennte Kategorien, je ein Spezialpfad. Deterministisch, billig, testbar.',
          },
          {
            id: 'agent',
            text: 'Ein autonomer Agent mit Tools, der selbst entscheidet, was zu tun ist.',
            correct: false,
            why: 'Überbaut: für eine feste Klassifikation braucht es keine offene Autonomie — mehr Risiko und Kosten ohne Gewinn.',
          },
          {
            id: 'orch',
            text: 'Orchestrator-Worker mit dynamischer Aufgaben-Zerlegung.',
            correct: false,
            why: 'Die Teilaufgaben sind hier bekannt und fest (drei Typen) — dynamische Zerlegung löst ein Problem, das du nicht hast.',
          },
          {
            id: 'chain',
            text: 'Eine lange Prompt-Chain, die nacheinander alle drei Antworttypen erzeugt.',
            correct: false,
            why: 'Verschwendet Arbeit: zwei der drei Pfade sind pro Mail irrelevant. Erst klassifizieren, dann genau einen Pfad gehen.',
          },
        ],
        takeaway: 'Nimm das einfachste Muster, das die Aufgaben-Form trägt — ein Agent ist die Ausnahme für offene Aufgaben, nicht der Default.',
      },
    },
  ],
}
