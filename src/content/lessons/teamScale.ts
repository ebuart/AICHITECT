import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-09-04 · post-template redesign, HARD. Bespoke puzzle exercises (match · pick). Scaling an
// AI-native system to a team is GOVERNANCE, not more model copies — and as agents do the typing,
// the human bottleneck shifts from writing code to directing, reviewing and integrating.
export const teamScale: Lesson = {
  id: 'LESSON-09-04',
  roadmapNodeId: 'NODE-09-04',
  conceptIds: ['CONCEPT-PROD-003'],
  prerequisites: ['NODE-09-03'],
  title: 'Team Scale',
  estimatedMinutes: 7,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Für mehrere Menschen und Agents entwerfen: Kontrolle und klare Ownership statt Kopfwissen.',
  interactionType: 'architecture-builder',
  visualModelId: 'systemRow',
  feedbackPatternId: 'FB-PATTERN-UNCLEAR-OWNERSHIP',
  reviewHooks: ['CONCEPT-PROD-003', 'team_scale_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Skalierung = Governance',
      text: 'Von einem Power-User zu einem ganzen Team heißt: mehr Nutzer, mehr riskante Aktionen, mehr parallele Arbeit. Was skaliert, ist Governance (Ownership, Approval, Evals) — und während Agents das Tippen übernehmen, wird die menschliche Richtung knapp, nicht die Tippgeschwindigkeit.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'scale-concepts',
        format: 'match',
        stem: 'Ordne jedem Begriff der team-skalierten AI-Entwicklung seine Bedeutung zu.',
        pairs: [
          { id: 'pod', left: 'Pod', right: 'Kleines Team (z. B. PO + 2 Devs), das einen Agenten-Schwarm steuert', why: 'Die Einheit verschiebt sich von „Dev pro Feature" zu „kleines Team dirigiert viele Agents".' },
          { id: 'owner', left: 'Ownership', right: 'Eine klar benannte Person/ein Pod verantwortet ein Modul end-to-end', why: 'Ohne klaren Owner fällt Verantwortung zwischen Menschen und Agents durch.' },
          { id: 'bottleneck', left: 'Verschobener Engpass', right: 'Nicht mehr Code schreiben, sondern Richtung geben + Reviewen wird knapp', why: 'Wenn Agents tippen, ist menschliche Urteilskraft die Engstelle.' },
          { id: 'coord', left: 'Coordination Cost', right: 'Mit mehr Agents/Menschen steigt der Abstimmungsaufwand überproportional', why: 'Mehr Beteiligte ≠ linear mehr Output — Schnittstellen kosten.' },
        ],
        takeaway: 'Team-Scale heißt Pods mit klarer Ownership; der Engpass wandert zur Richtung/zum Review, und Koordination wird teurer, nicht billiger.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'scale-bottleneck',
        format: 'pick',
        stem: 'Agents übernehmen einen Großteil des Codens im Team. Was wird dadurch zur knappen Ressource?',
        options: [
          {
            id: 'judgment',
            text: 'Menschliche Urteilskraft: Richtung geben, Reviewen und Integrieren — der Engpass wandert vom Schreiben zum Steuern.',
            correct: true,
            why: 'Wenn das Tippen billig wird, entscheidet, wer gut briefen, prüfen und zusammenführen kann. Genau das skaliert man, nicht die Tastenanschläge.',
          },
          {
            id: 'more-devs',
            text: 'Man braucht vor allem mehr Entwickler, die mehr Code schreiben.',
            correct: false,
            why: 'Mehr Tippkapazität löst nichts, wenn Agents ohnehin tippen — und mehr Köpfe erhöhen die Koordinationskosten.',
          },
          {
            id: 'compute',
            text: 'Vor allem mehr Rechenleistung / Modell-Kopien.',
            correct: false,
            why: 'Compute ist selten der Engpass; die Integration und Qualitätssicherung der Agenten-Arbeit ist es.',
          },
          {
            id: 'tools',
            text: 'Mehr und mächtigere Tools.',
            correct: false,
            why: 'Tools helfen, aber ohne menschliche Richtung und Review vervielfachen sie nur die ungeprüfte Ausgabe.',
          },
        ],
        takeaway: 'Wenn Agents das Coden übernehmen, ist die knappe Ressource menschliche Richtung und Review — darauf richtet man Team und Prozess aus.',
      },
    },
  ],
}
