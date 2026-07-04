import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-02-01 · post-template redesign, HARD. Bespoke puzzle exercises (budget · order · pick).
// The context window is a budget with RESERVED line-items — output reserve first, retrieval
// fills the rest. The `budget` mechanic verifies a feasible allocation (ranges + cap), not a
// stored answer; the durable skill is tradeoff reasoning under a hard token cap.
export const contextWindowBudget: Lesson = {
  id: 'LESSON-02-01',
  roadmapNodeId: 'NODE-02-01',
  conceptIds: ['CONCEPT-CTX-001', 'CONCEPT-CTX-002'],
  prerequisites: ['NODE-01-03'],
  title: 'Context Window and Token Budget',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Den endlichen Context bewusst zuteilen — und entscheiden, was überhaupt hineingehört.',
  interactionType: 'context-allocator',
  visualModelId: 'tokenBudget',
  feedbackPatternId: 'FB-PATTERN-CONTEXT-NOISE',
  reviewHooks: ['CONCEPT-CTX-002', 'allocation_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Context als Budget',
      text: 'Das Context-Fenster ist endlich — alles, was zählt, konkurriert um Platz. Mehr hineinwerfen ist nicht besser; manche Posten sind reserviert (vor allem Raum für die Antwort selbst).',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'allocate',
        format: 'budget',
        stem: 'Stelle den Prompt für ein 8 192-Token-Fenster zusammen. Jeder Posten hat einen sinnvollen Bereich — bleib im Limit.',
        unit: 'Tok',
        total: 8192,
        step: 100,
        items: [
          { id: 'system', label: 'System-Prompt (Regeln)', min: 400, max: 600, hint: 'Regeln müssen intakt bleiben — kaum komprimierbar.' },
          { id: 'fewshot', label: 'Few-Shot-Beispiele', min: 100, max: 600, hint: '3 Demos, auf 1 kürzbar.' },
          { id: 'chunks', label: 'Retrieved Chunks', min: 2500, max: 4500, hint: 'Die Grundlage — aber nicht unbegrenzt; zu viel verdünnt das Signal.' },
          { id: 'history', label: 'Chat-Verlauf', min: 300, max: 1200, hint: 'Letzte Turns; ältere sind droppbar.' },
          { id: 'output', label: 'Output-Reserve', min: 1000, max: 1500, hint: 'Platz für die Antwort — sonst bricht sie mittendrin ab.' },
        ],
        takeaway: 'Reserviere die Ausgabe zuerst, dann füllt Retrieval den Rest — nicht umgekehrt. Output-Reserve auf 0 heißt: die Antwort wird abgeschnitten.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'cut-order',
        format: 'order',
        stem: 'Der Prompt ist 1 500 Token zu groß. In welcher Reihenfolge kürzt du — zuerst das am ehesten Entbehrliche, zuletzt das Unantastbare?',
        items: [
          { id: 'old-history', text: 'Älteste Chat-Turns droppen' },
          { id: 'fewshot-trim', text: 'Few-Shot von 3 auf 1 Beispiel' },
          { id: 'rerank-tight', text: 'Retrieved Chunks enger reranken (Top-3 statt Top-8)' },
          { id: 'system', text: 'System-Prompt / Regeln (fast nie anrühren)' },
          { id: 'output', text: 'Output-Reserve (niemals — sonst Abbruch)' },
        ],
        takeaway: 'Unter Knappheit zuerst das Droppbare (alter Verlauf, Demos), dann enger retrieven — Regeln und Output-Reserve bleiben.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'budget-principle',
        format: 'pick',
        stem: 'Welche Aussage über das Context-Budget stimmt?',
        options: [
          {
            id: 'reserve',
            text: 'Die Output-Reserve ist ein eigener Posten, kein Rest — fehlt sie, wird die Antwort mittendrin abgeschnitten.',
            correct: true,
            why: 'Generierte Tokens brauchen Platz im selben Fenster. Wer alles mit Input füllt, lässt dem Modell keinen Raum zu antworten.',
          },
          {
            id: 'more-chunks',
            text: 'Mehr Retrieved Chunks sind immer sicherer — fülle den Rest damit auf.',
            correct: false,
            why: 'Mehr Chunks heißt mehr Rauschen und verdrängt die Output-Reserve. Signaldichte schlägt Menge.',
          },
          {
            id: 'trim-system',
            text: 'Das System-Prompt kürzt man als Erstes, wenn der Platz knapp wird.',
            correct: false,
            why: 'Die Regeln sind das Verhalten des Systems — sie zu beschneiden ändert, was der Agent tun darf. Zuerst kürzt man Droppbares.',
          },
          {
            id: 'auto',
            text: 'Token zählen ist unnötig — das Modell kürzt von selbst sinnvoll.',
            correct: false,
            why: 'Es kürzt nicht „sinnvoll", sondern schneidet hart am Fensterende ab — oft mitten in der wichtigsten Stelle.',
          },
        ],
        takeaway: 'Das Fenster ist ein Budget mit reservierten Posten — bewusst zuteilen, nicht dem Zufall überlassen.',
      },
    },
  ],
}
