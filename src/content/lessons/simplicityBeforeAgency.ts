import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-02 · voice per control/10 VX rules (2026-07-05). Concept: climb the complexity
// ladder (prompt → chain → workflow → agent) only as far as the task forces you.
export const simplicityBeforeAgency: Lesson = {
  id: 'LESSON-01-02',
  roadmapNodeId: 'NODE-01-02',
  conceptIds: ['CONCEPT-AIE-004', 'CONCEPT-PROD-001'],
  prerequisites: ['NODE-01-01'],
  title: 'Simplicity Before Agency',
  estimatedMinutes: 6,
  lessonMode: 'trade-off-first',
  learningGoal: 'Die einfachste Architektur wählen, die die Aufgabe trägt.',
  interactionType: 'trade-off-duel',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-004', 'tradeoff_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Die Leiter',
      text: 'Es gibt vier Stufen, ein LLM-Problem zu bauen: ein einzelner Prompt. Eine feste Kette von Prompts mit Prüfschritten dazwischen. Ein Workflow, der Tools nutzt und Eingaben auf verschiedene Pfade verteilt. Und ganz oben der autonome Agent, der selbst entscheidet, was als Nächstes passiert. Jede Stufe nach oben kostet: mehr Fehlerquellen, schwerere Tests, teurerer Betrieb. In Postmortems steht selten „wir haben zu klein gebaut".',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'complexity-ladder',
        format: 'order',
        stem: 'Sortier die vier Stufen, von der einfachsten zur mächtigsten.',
        items: [
          { id: 'a-prompt', text: 'Ein einzelner Prompt' },
          { id: 'a-chain', text: 'Eine feste Prompt-Kette (Schritte mit Prüfungen dazwischen)' },
          { id: 'a-workflow', text: 'Ein Workflow mit Tools (Routing, Parallelisierung)' },
          { id: 'a-agent', text: 'Ein autonomer Agent mit Tools' },
        ],
        takeaway: 'Merk dir die Leiter — ab jetzt ist bei jeder Architekturfrage die erste Überlegung: Welche Stufe reicht?',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'climb-when',
        format: 'pick',
        stem: 'Im Architektur-Review schlägt jemand vor, den Rechnungs-Extraktor (PDF rein, festes JSON raus, läuft als Prompt-Kette stabil) auf einen Agenten umzubauen. Begründung: „Dann sind wir flexibler." Wann wäre der Umbau tatsächlich dran?',
        options: [
          {
            id: 'forced',
            text: 'Wenn eine konkrete, gemessene Anforderung auf der aktuellen Stufe nachweislich scheitert — und sich zeigen lässt, dass die nächste Stufe genau das löst.',
            correct: true,
            why: 'Komplexität kauft man gegen ein belegtes Defizit, nicht gegen ein Gefühl. Solange die Kette ihre Zahlen liefert, gibt es hier nichts zu lösen.',
          },
          {
            id: 'future',
            text: 'Vorsorglich jetzt, dann ist man für kommende Anforderungen gerüstet.',
            correct: false,
            why: 'Die kommenden Anforderungen sind hypothetisch. Die zusätzlichen Fehlerquellen, Tests und Betriebskosten fangen sofort an.',
          },
          {
            id: 'impressive',
            text: 'Wenn Stakeholder Agenten sehen wollen.',
            correct: false,
            why: 'Kommt vor, ist aber kein Architekturkriterium. Zeig ihnen lieber die Fehlerquote der Kette: 0,4 %. Dann die Frage, was der Agent daran verbessern soll.',
          },
          {
            id: 'default-agent',
            text: 'Man hätte gleich als Agent starten sollen, dann stellt sich die Frage nicht.',
            correct: false,
            why: 'Dann hättest du seit Monat eins die Agenten-Betriebskosten für eine Aufgabe mit vier festen Schritten. Und zurückgebaut wird in der Praxis fast nie.',
          },
        ],
        takeaway: 'Auf „dann sind wir flexibler" ist die Standard-Rückfrage: Flexibel wofür genau? Kommt keine messbare Antwort, bleibt die Stufe.',
      },
    },
  ],
}
