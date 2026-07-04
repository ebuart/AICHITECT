import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-12-03 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (multispot over
// a swarm status board · pick). Your attention is the bottleneck when many bees run — intervene
// on drift, stuck-loops, boundary breaks and cascades; let normal progress run (don't micromanage).
export const dirTriageSwarm: Lesson = {
  id: 'LESSON-12-03',
  roadmapNodeId: 'NODE-12-03',
  conceptIds: ['CONCEPT-DIR-007'],
  prerequisites: ['NODE-12-02'],
  title: 'Triage the Swarm',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Über parallele Agenten priorisieren: erkennen, welche sofort Eingriff brauchen.',
  interactionType: 'incident-triage',
  visualModelId: 'trace',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-DIR-007', 'direction_transfer', 'tradeoff_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Wo zuerst hinsehen',
      text: 'Laufen mehrere Bienen, ist deine Aufmerksamkeit die Engstelle. Eine abdriftende oder grenzverletzende Biene produziert mit jeder Minute Schaden; eine, die normal Fortschritt macht, braucht dich nicht.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'swarm-board',
        format: 'multispot',
        stem: 'Status-Board deines Agenten-Schwarms. Tippe jede Biene an, bei der du jetzt eingreifen musst.',
        lines: [
          { id: 'a-A', text: 'Agent A: Task fertig, Tests grün, wartet auf dein Review.' },
          { id: 'a-B', text: 'Agent B: seit 40 Min am selben Test, 12 identische Fehlversuche.', isAttack: true, note: 'Stuck-Loop: er kommt allein nicht raus und verbrennt Zeit/Tokens. Re-briefen oder stoppen.' },
          { id: 'a-C', text: 'Agent C: hat den Auftrag verlassen und refactored jetzt das Auth-Modul.', isAttack: true, note: 'Scope-Drift: er baut mit jeder Minute mehr ungewollte Arbeit. Sofort stoppen.' },
          { id: 'a-D', text: 'Agent D: läuft normal, Schritt 3 von 5, plausible Zwischenergebnisse.' },
          { id: 'a-E', text: 'Agent E: hat eine destruktive Migration ohne Rückfrage ausgeführt.', isAttack: true, note: 'Grenzverletzung mit möglichem Datenschaden — höchste Priorität, prüfen und ggf. zurückrollen.' },
          { id: 'a-F', text: 'Agent F: blockiert, wartet auf den (nie kommenden) Output von Agent B.', isAttack: true, note: 'Kaskade: hängt an der stuck-Biene B. Ohne Eingriff steht F dauerhaft still.' },
          { id: 'a-G', text: 'Agent G: meldet „fertig", erfüllt aber die Akzeptanzkriterien nicht.', isAttack: true, note: 'Done-but-wrong: „fertig" ohne erfülltes Kriterium ist nicht fertig — zurückweisen.' },
        ],
        takeaway: 'Eingreifen bei Stuck-Loops, Scope-Drift, Grenzverletzung, Kaskaden und „fertig-aber-falsch". Was normal Fortschritt macht (A, D), lässt du laufen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'intervene-how',
        format: 'pick',
        stem: 'Eine Biene ist seit Langem „fast fertig", aber sichtbar auf dem falschen Weg. Was tust du?',
        options: [
          {
            id: 'stop',
            text: 'Stoppen und mit geschärftem Brief neu ansetzen — „fast fertig" auf dem falschen Weg ist eine Sunk-Cost-Falle.',
            correct: true,
            why: 'Investierte Zeit ist verloren, egal was du tust. Was zählt, ist der erwartete Wert ab jetzt — und der ist auf dem falschen Pfad negativ.',
          },
          {
            id: 'wait',
            text: 'Laufen lassen — sie hat schon so viel investiert, gleich ist es fertig.',
            correct: false,
            why: 'Genau der Sunk-Cost-Fehler: die bisherige Arbeit rechtfertigt nicht, dem falschen Weg weiter zu folgen.',
          },
          {
            id: 'micromanage',
            text: 'Künftig jeden einzelnen Schritt jeder Biene vorab freigeben.',
            correct: false,
            why: 'Micromanagement skaliert nicht und hebt den Sinn des Schwarms auf — Drift fängt man über Checkpoints, nicht über Totalkontrolle.',
          },
          {
            id: 'addagent',
            text: 'Eine zweite Biene danebensetzen, die hilft.',
            correct: false,
            why: 'Mehr Agenten auf einem schon driftenden Task erhöhen nur Koordination und Konflikt — erst Richtung klären.',
          },
        ],
        takeaway: 'Auf dem falschen Weg zählt nur der Wert ab jetzt: stoppen und neu briefen schlägt „gleich fertig". Drift fängst du über Checkpoints, nicht über Micromanagement.',
      },
    },
  ],
}
