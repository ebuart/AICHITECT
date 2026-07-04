import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-13-01 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (order by
// priority · pick on cutting). The product-lead skill: fund the core, cut the low-value — never
// spread capacity evenly ("a bit of everything" ships nothing finished).
export const dirPrioritizeAndCut: Lesson = {
  id: 'LESSON-13-01',
  roadmapNodeId: 'NODE-13-01',
  conceptIds: ['CONCEPT-DIR-008'],
  prerequisites: ['NODE-12-03'],
  title: 'Prioritize and Cut',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'Nach Wert priorisieren und Wenig-Wertvolles bewusst streichen statt gleich zu verteilen.',
  interactionType: 'context-allocator',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-DIR-008', 'direction_transfer', 'allocation_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Gleichmäßig verteilen ist die feige Antwort',
      text: 'Du hast immer mehr Wünsche als Kapazität. Die Arbeit ist nicht „alles ein bisschen", sondern: den Kern vollständig finanzieren und das Wenig-Wertvolle bewusst auf null setzen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'priority-order',
        format: 'order',
        stem: 'Knapper Sprint für einen Shop-Launch. Bring die Punkte in die Reihenfolge, in der du sie finanzierst (zuerst → was zuerst gestrichen wird).',
        items: [
          { id: 'p-buy', text: 'Kern-Flow: Nutzer kann das Produkt kaufen' },
          { id: 'p-errors', text: 'Fehlerbehandlung im Checkout' },
          { id: 'p-email', text: 'Bestätigungs-E-Mail nach dem Kauf' },
          { id: 'p-dark', text: 'Dark-Mode' },
          { id: 'p-anim', text: 'Animierte Seitenübergänge' },
        ],
        takeaway: 'Ohne den Kauf-Flow gibt es kein Produkt; danach Robustheit (Fehler), dann Nice-to-have (E-Mail), zuletzt Kosmetik (Dark-Mode, Animationen) — die fällt bei Knappheit zuerst.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'cut-decision',
        format: 'pick',
        stem: 'Die Deadline ist zu knapp für alles. Was tust du?',
        options: [
          {
            id: 'cut',
            text: 'Den Kern vollständig liefern und das Wenig-Wertvolle bewusst streichen — eine klare Cut-Linie ziehen.',
            correct: true,
            why: 'Ein fertiger Kern ist nutzbar; fünf halbfertige Dinge sind es nicht. Cutten ist eine Entscheidung, kein Versagen.',
          },
          {
            id: 'even',
            text: 'An allem gleichmäßig weiterarbeiten, damit nichts ganz hinten runterfällt.',
            correct: false,
            why: 'Die feige Antwort: „von allem ein bisschen" liefert am Ende nichts Fertiges, auch nicht den Kern.',
          },
          {
            id: 'faster',
            text: 'Einfach alles schneller bauen lassen, mehr Agenten drauf.',
            correct: false,
            why: 'Mehr Tempo löst kein Scope-Problem; auf dem überladenen Plan entsteht nur mehr halbfertige Arbeit + Koordinationslast.',
          },
          {
            id: 'deadline',
            text: 'Die Deadline verschieben, dann passt alles rein.',
            correct: false,
            why: 'Manchmal möglich, aber es weicht der eigentlichen Director-Arbeit aus: zu entscheiden, was den größten Wert hat — und den Rest zu schneiden.',
          },
        ],
        takeaway: 'Priorisieren heißt schneiden: den Kern fertig liefern, das Wenig-Wertvolle bewusst weglassen — nicht alles halb.',
      },
    },
  ],
}
