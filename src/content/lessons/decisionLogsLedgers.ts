import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-06-02 · post-template redesign, HARD. Bespoke puzzle exercises (annotate a weak decision
// log · pick). The durable skill: a Decision Log entry must let a FRESH session understand the
// WHY and not re-litigate it — so it needs the criterion, the alternatives, an absolute date,
// and a concrete next step. The annotate legend teaches exactly what's missing.
export const decisionLogsLedgers: Lesson = {
  id: 'LESSON-06-02',
  roadmapNodeId: 'NODE-06-02',
  conceptIds: ['CONCEPT-MEM-003', 'CONCEPT-MEM-004'],
  prerequisites: ['NODE-06-01'],
  title: 'Decision Logs and Feature Ledgers',
  estimatedMinutes: 7,
  lessonMode: 'worked-example',
  learningGoal: 'Rationale durable festhalten — so, dass eine frische Session sie versteht und nicht neu aufrollt.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'compactFallback',
  feedbackPatternId: 'FB-PATTERN-CHAT-MEMORY-ONLY',
  reviewHooks: ['CONCEPT-MEM-003'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Decision Log',
      text: 'Ein Decision Log hält das WARUM hinter Entscheidungen fest — damit eine frische Session (oder ein neuer Agent) sie nachvollzieht, statt sie neu aufzurollen. Dafür braucht ein Eintrag mehr als nur „wir machen jetzt X".',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'weak-log',
        format: 'annotate',
        stem: 'Dieser Decision-Log-Eintrag ist schwach. Tippe jede Stelle an, die ihn in einer frischen Session unbrauchbar macht.',
        legend: [
          { label: 'Keine Begründung', hint: 'kein Kriterium, warum so entschieden wurde' },
          { label: 'Keine Alternativen', hint: 'was wurde erwogen und warum verworfen — fehlt' },
          { label: 'Relatives/fehlendes Datum', hint: '„letzte Woche" ist in 3 Monaten nicht datierbar' },
          { label: 'Vage/nicht umsetzbar', hint: 'kein konkreter nächster Schritt oder Owner' },
        ],
        segments: [
          { id: 'd1', text: 'DEC-0007: Wir wechseln zur Vektor-DB Pinecone.' },
          { id: 'd2', text: 'Das ist einfach besser.', flag: { category: 'Keine Begründung', why: '„Besser" nach welchem Kriterium? Latenz, Kosten, Hybrid-Support? Ohne das kann niemand die Entscheidung prüfen.', fix: 'Das entscheidende Kriterium nennen (z. B. „nativer Hybrid-Search, < 50 ms p95").' } },
          { id: 'd3', text: 'Andere Optionen haben wir uns nicht weiter angeschaut.', flag: { category: 'Keine Alternativen', why: 'Ohne erwogene Alternativen wird die Frage in jeder neuen Session neu aufgerollt.', fix: 'Die 2–3 erwogenen Optionen + je einen Satz, warum verworfen.' } },
          { id: 'd4', text: 'Entschieden letzte Woche im Meeting.', flag: { category: 'Relatives/fehlendes Datum', why: '„Letzte Woche" ist später nicht datierbar — die Reihenfolge von Entscheidungen geht verloren.', fix: 'Absolutes Datum (2026-06-15).' } },
          { id: 'd5', text: 'Das Team soll es dann mal verwenden.', flag: { category: 'Vage/nicht umsetzbar', why: 'Kein konkreter nächster Schritt, kein Owner — es passiert nichts oder jeder etwas anderes.', fix: 'Konkreter nächster Schritt + verantwortliche Person.' } },
          { id: 'd6', text: 'Offen: Migration der bestehenden Embeddings ist noch ungelöst.' },
        ],
        takeaway: 'Ein tragfähiger Eintrag nennt Entscheidung, Kriterium, erwogene Alternativen, ein absolutes Datum und einen konkreten nächsten Schritt — alles, was eine frische Session braucht, um nicht neu zu raten.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'log-purpose',
        format: 'pick',
        stem: 'Woran misst sich, ob ein Decision-Log-Eintrag gut ist?',
        options: [
          {
            id: 'fresh',
            text: 'Eine Person (oder ein Agent) ohne Vorwissen versteht aus dem Eintrag das Was, das Warum und die verworfenen Alternativen — und rollt die Frage nicht neu auf.',
            correct: true,
            why: 'Genau der Zweck: das Warum über Sessions hinweg durable und nachvollziehbar machen.',
          },
          {
            id: 'short',
            text: 'Er ist so kurz wie möglich.',
            correct: false,
            why: 'Kürze um den Preis des Warum ist wertlos — der Eintrag oben ist kurz und nutzlos.',
          },
          {
            id: 'everything',
            text: 'Er enthält das vollständige Meeting-Transkript.',
            correct: false,
            why: 'Das andere Extrem: Rohmasse statt destillierter Essenz bläht den Speicher und verbirgt das Wesentliche.',
          },
          {
            id: 'chat',
            text: 'Er steht im Chatverlauf, wo die Entscheidung gefallen ist.',
            correct: false,
            why: 'Der Chatverlauf ist Session-Memory — mit dem Lauf weg. Der Eintrag muss in einer durable Datei leben.',
          },
        ],
        takeaway: 'Test für jeden Eintrag: „Versteht ihn jemand ohne Vorwissen — Was, Warum, verworfene Alternativen?" Wenn ja, ist er durable nützlich.',
      },
    },
  ],
}
