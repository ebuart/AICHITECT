import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-02 · post-template redesign, HARD. Trade-off-first: bespoke puzzle exercises (order ·
// pick). Climb the complexity ladder only as far as the task forces you — single prompt →
// chain → workflow-with-tools → agent. Autonomy is a cost, not a goal.
export const simplicityBeforeAgency: Lesson = {
  id: 'LESSON-01-02',
  roadmapNodeId: 'NODE-01-02',
  conceptIds: ['CONCEPT-AIE-004', 'CONCEPT-PROD-001'],
  prerequisites: ['NODE-01-01'],
  title: 'Simplicity Before Agency',
  estimatedMinutes: 6,
  lessonMode: 'trade-off-first',
  learningGoal: 'Die einfachste Architektur wählen, die die Aufgabe erfüllt — Komplexität nur bei Bedarf.',
  interactionType: 'trade-off-duel',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-004', 'tradeoff_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Simplicity before Agency',
      text: 'Autonomie ist kein Ziel, sondern ein Preis (Kosten, Fehlerquellen, schwerere Tests). Steig die Komplexitäts-Leiter nur so hoch, wie die Aufgabe dich zwingt — und keine Stufe höher.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'complexity-ladder',
        format: 'order',
        stem: 'Bring die Architektur-Optionen in die Reihenfolge von der einfachsten zur komplexesten.',
        items: [
          { id: 'a-prompt', text: 'Ein einzelner Prompt' },
          { id: 'a-chain', text: 'Eine feste Prompt-Chain (Schritte mit Gates)' },
          { id: 'a-workflow', text: 'Ein Workflow mit Tools (Routing / Parallelisierung)' },
          { id: 'a-agent', text: 'Ein autonomer Agent mit Tools' },
        ],
        takeaway: 'Die Leiter: einzelner Prompt → Prompt-Chain → Workflow mit Tools → autonomer Agent. Jede Stufe kostet mehr Komplexität und Kontrolle.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'climb-when',
        format: 'pick',
        stem: 'Wann steigst du eine Stufe höher auf der Leiter?',
        options: [
          {
            id: 'forced',
            text: 'Erst wenn die aktuelle Stufe die messbare Anforderung nachweislich nicht erfüllt.',
            correct: true,
            why: 'Komplexität fügt man gegen ein konkretes, gemessenes Defizit hinzu — nicht auf Vorrat.',
          },
          {
            id: 'future',
            text: 'Vorsorglich, damit man für künftige Anforderungen gerüstet ist.',
            correct: false,
            why: 'Spekulative Komplexität zahlt man sofort in Betrieb und Fehlern, der Nutzen bleibt hypothetisch.',
          },
          {
            id: 'impressive',
            text: 'Wenn die komplexere Lösung beeindruckender wirkt.',
            correct: false,
            why: '„Beeindruckend" ist kein Anforderungs-Kriterium — Beherrschbarkeit schlägt Eindruck.',
          },
          {
            id: 'default-agent',
            text: 'Direkt auf der Agenten-Stufe starten, dann kann man später vereinfachen.',
            correct: false,
            why: 'Vereinfachen passiert in der Praxis selten; man bleibt auf der zu hohen Stufe samt ihrer Kosten hängen.',
          },
        ],
        takeaway: 'Steig nur höher, wenn die einfachere Stufe messbar versagt — Autonomie ist die Ausnahme, die sie sich verdienen muss.',
      },
    },
  ],
}
