import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-01 · post-template redesign, HARD. Bespoke puzzle exercises (match · pick). A raw model
// is augmented by what surrounds it; each augmentation fixes a SPECIFIC limitation — and you add
// only the ones the requirement needs.
export const augmentedLlm: Lesson = {
  id: 'LESSON-01-01',
  roadmapNodeId: 'NODE-01-01',
  conceptIds: ['CONCEPT-AIE-002'],
  prerequisites: ['NODE-00-02'],
  title: 'Augmented LLM',
  estimatedMinutes: 6,
  lessonMode: 'architecture-builder',
  learningGoal: 'Jede Augmentierung der Limitierung zuordnen, die sie behebt — und nur Nötiges hinzufügen.',
  interactionType: 'architecture-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-002', 'overengineering_repair'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Augmented LLM',
      text: 'Ein rohes Modell kann nur aus seinem (veralteten) Trainingswissen antworten und nichts in der Welt tun. Augmentierungen — Retrieval, Tools, Memory, strukturierte Ausgabe — beheben je eine bestimmte Schwäche.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'augment-fixes',
        format: 'match',
        stem: 'Welche Augmentierung behebt welche Schwäche des rohen Modells?',
        pairs: [
          { id: 'retrieval', left: 'Retrieval', right: 'Frische/private Fakten, die nicht im Training stehen', why: 'Holt Evidenz von außen in den Context — gegen veraltetes/abwesendes Wissen.' },
          { id: 'tools', left: 'Tools', right: 'In der Welt handeln + exakt rechnen (statt schätzen)', why: 'Das Modell delegiert Aktionen und präzise Berechnung an Code.' },
          { id: 'memory', left: 'Memory', right: 'Persistenz über die Session / das Context-Fenster hinaus', why: 'Hält durable State, den der flüchtige Verlauf verliert.' },
          { id: 'structured', left: 'Strukturierte Ausgabe', right: 'Verlässlich maschinenlesbares Ergebnis für nachgelagerte Systeme', why: 'Erzwingt ein parsebares Schema statt freier Prosa.' },
        ],
        takeaway: 'Jede Augmentierung hat einen Zweck: Retrieval gegen Wissenslücken, Tools fürs Handeln/Rechnen, Memory für Persistenz, Schema für Parsebarkeit.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'augment-which',
        format: 'pick',
        stem: 'Ein Bot soll Fragen zu den AKTUELLEN, sich monatlich ändernden Firmen-Tarifen beantworten. Welche Augmentierung ist die entscheidende?',
        options: [
          {
            id: 'retrieval',
            text: 'Retrieval — die aktuellen Tarife zur Antwortzeit holen und in den Context legen.',
            correct: true,
            why: 'Die Schwäche ist fehlendes/veraltetes Wissen; Retrieval bringt die frischen Fakten genau dann, wenn sie gebraucht werden.',
          },
          {
            id: 'memory',
            text: 'Memory — sich die Tarife dauerhaft merken.',
            correct: false,
            why: 'Memory hält State, hält ihn aber nicht aktuell. Monatlich wechselnde Fakten müssen geholt, nicht gemerkt werden.',
          },
          {
            id: 'tools',
            text: 'Tools — eine Berechnung ausführen.',
            correct: false,
            why: 'Hier fehlt nicht Rechnen oder Handeln, sondern aktuelles Wissen.',
          },
          {
            id: 'structured',
            text: 'Strukturierte Ausgabe — die Antwort als JSON formatieren.',
            correct: false,
            why: 'Format löst das Aktualitätsproblem nicht — ein gut formatierter veralteter Tarif ist immer noch falsch.',
          },
        ],
        takeaway: 'Wähle die Augmentierung nach der konkreten Schwäche: bei veralteten/wechselnden Fakten ist es Retrieval.',
      },
    },
  ],
}
