import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-04-05 · post-template redesign, HARD. Bespoke puzzle exercises (stepwise · pick).
// Simulate a ReAct loop step by step: the durable skill is tool economy (don't fetch what
// you already hold) and a stop condition (finish when the answer is known, don't loop).
export const autonomousAgentLoop: Lesson = {
  id: 'LESSON-04-05',
  roadmapNodeId: 'NODE-04-05',
  conceptIds: ['CONCEPT-CF-007'],
  prerequisites: ['NODE-04-04'],
  title: 'Autonomous Agent Loop',
  estimatedMinutes: 8,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Plan-Act-Observe-Loops mit Tool-Ökonomie und klarer Stop-Bedingung steuern.',
  interactionType: 'agent-trace-debugger',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-CF-007', 'CONCEPT-SEC-002'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'ReAct-Loop',
      text: 'Ein Agent wechselt Thought → Action → Observation, bis er „finish" aufruft. Zwei Dinge halten ihn gesund: er ruft nur Tools, deren Ergebnis er noch nicht hat, und er stoppt, sobald die Antwort steht.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'react-economy',
        format: 'stepwise',
        stem: 'Aufgabe: „Was kosten 3 Jahre Pro, wenn Pro 12 €/Monat kostet und ab Jahr 2 ein Treuerabatt von 10 % gilt?" Bewerte jeden Schritt des Agenten.',
        intro: 'Tools: search(q), calc(expr), finish(ans). Im Kontext bekannt: Pro = 12 €/Monat.',
        verdicts: [
          { id: 'ok', label: 'Sinnvoll' },
          { id: 'waste', label: 'Verschwendet' },
        ],
        steps: [
          { id: 's1', text: 'search("Pro Preis pro Monat")', verdictId: 'waste', why: 'Der Preis (12 €) steht schon im Kontext — ein Tool-Call für bereits bekannte Information ist verschwendet.' },
          { id: 's2', text: 'calc("12*12")  → 144  (Jahr 1)', verdictId: 'ok', why: 'Nötige Rechnung, deren Ergebnis nicht im Kontext steht.' },
          { id: 's3', text: 'calc("144*2*0.9")  → 259.2  (Jahr 2+3, −10 %)', verdictId: 'ok', why: 'Korrekt: zwei rabattierte Jahre. Sinnvoller Tool-Call.' },
          { id: 's4', text: 'calc("144+259.2")  → 403.2  (Summe)', verdictId: 'ok', why: 'Die letzte nötige Rechnung — Ergebnis steht jetzt fest.' },
          { id: 's5', text: 'search("gibt es weitere Rabatte?")', verdictId: 'waste', why: 'Die Antwort ist bereits berechnet. Weiterzusuchen heißt schleifen statt stoppen — und kann die fertige Antwort verfälschen.' },
          { id: 's6', text: 'finish("403,20 €")', verdictId: 'ok', why: 'Terminaler Schritt: die Antwort steht, der Agent hört auf. Genau richtig.' },
        ],
        takeaway: 'Ein gesunder Loop ruft nur Tools für Unbekanntes und stoppt, sobald die Antwort steht — beides spart Kosten und verhindert Abdriften.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'stop-condition',
        format: 'pick',
        stem: 'Der Agent hat 403,20 € berechnet — die vollständige Antwort auf die Frage. Was ist der richtige nächste Schritt?',
        options: [
          {
            id: 'finish',
            text: 'finish("403,20 €") aufrufen und stoppen.',
            correct: true,
            why: 'Die Stop-Bedingung ist erfüllt: die Frage ist beantwortet. Weiterlaufen bringt nur Risiko und Kosten.',
          },
          {
            id: 'verify-search',
            text: 'Zur Sicherheit nochmal nach Rabatten und Preisen suchen.',
            correct: false,
            why: 'Das ist die Schleifen-Falle: ein weiterer Tool-Call ohne offene Frage kann die fertige Antwort sogar wieder verwässern.',
          },
          {
            id: 'recompute',
            text: 'Die Summe mit einem zweiten calc-Aufruf erneut berechnen.',
            correct: false,
            why: 'Redundante Rechnung — das Ergebnis steht schon. Verschwendete Tokens ohne neuen Informationsgewinn.',
          },
          {
            id: 'ask-user',
            text: 'Den Nutzer fragen, ob das Ergebnis passt, bevor man antwortet.',
            correct: false,
            why: 'Bei einer einfachen, eindeutigen Rechnung ist eine Rückfrage unnötige Reibung — Approval spart man sich für riskante, irreversible Aktionen auf.',
          },
        ],
        takeaway: 'Die wichtigste Stop-Bedingung ist die einfachste: Antwort steht → finish. Ohne sie läuft der Loop weiter und driftet ab.',
      },
    },
  ],
}
