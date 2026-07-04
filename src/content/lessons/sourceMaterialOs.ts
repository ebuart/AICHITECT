import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-09-03 · post-template redesign, HARD. Worked-example: bespoke puzzle exercises (match ·
// pick). A doc control plane IS an agent's durable memory and rule source across runs — without
// it, knowledge from old sessions evaporates and constraints get silently re-violated.
export const sourceMaterialOs: Lesson = {
  id: 'LESSON-09-03',
  roadmapNodeId: 'NODE-09-03',
  conceptIds: ['CONCEPT-REPO-004'],
  prerequisites: ['NODE-09-02'],
  title: 'Source Material OS',
  estimatedMinutes: 7,
  lessonMode: 'worked-example',
  learningGoal: 'Die Steuer-Docs als Control Plane betreiben — autoritativ, auffindbar, ohne Constraint-Verlust.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-LOST-CONSTRAINTS',
  reviewHooks: ['CONCEPT-REPO-004', 'source_material_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Doku als Control Plane',
      text: 'Ein agentengetriebenes Projekt hat über Läufe hinweg kein Gedächtnis — außer dem, was in Dateien steht. Ein „Source Material OS" macht die Steuer-Docs zur autoritativen Quelle: jedes Dokument hat eine klare Rolle.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'doc-roles',
        format: 'match',
        stem: 'Ordne jedem Steuer-Dokument seine Rolle zu.',
        pairs: [
          { id: 'dec', left: 'Decision Log', right: 'Das WARUM hinter Entscheidungen (samt verworfener Alternativen)', why: 'Verhindert, dass dieselbe Frage in jeder Session neu aufgerollt wird.' },
          { id: 'ledger', left: 'Feature Ledger', right: 'Was bereits gebaut ist — kompakt, ohne den Code lesen zu müssen', why: 'Schneller Überblick über den Implementierungsstand.' },
          { id: 'open', left: 'Open Questions', right: 'Ungeklärte Punkte, die sonst immer wieder neu „entdeckt" werden', why: 'Macht offene Fragen über Sessions hinweg sichtbar.' },
          { id: 'mem', left: 'Project Memory', right: 'Der aktuelle durable Zustand und Kontext des Projekts', why: 'Der Wiedereinstiegspunkt für jede neue Session.' },
          { id: 'contract', left: 'Control Docs (Contract / Non-Goals)', right: 'Feste Regeln und Grenzen, an die sich jeder Lauf hält', why: 'Die autoritativen Leitplanken — kein Lauf darf sie still überschreiben.' },
        ],
        takeaway: 'Jedes Steuer-Doc hat eine Rolle: Warum (Decision Log), Was (Ledger), Offen (Open Questions), Zustand (Memory), Regeln (Control Docs).',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'why-control-plane',
        format: 'pick',
        stem: 'Warum braucht ein agentengetriebenes Projekt diese Doku-Control-Plane?',
        options: [
          {
            id: 'memory',
            text: 'Ein Agent hat über Läufe hinweg kein Gedächtnis — die Doku IST sein durables Gedächtnis und seine Regelquelle; ohne sie driftet das Projekt.',
            correct: true,
            why: 'Was nicht in den Steuer-Docs steht, existiert für den nächsten Lauf nicht. Sie tragen Wissen, Zustand und Constraints über Sessions.',
          },
          {
            id: 'humans',
            text: 'Nur, damit menschliche Mitlesende einen Überblick haben.',
            correct: false,
            why: 'Auch, aber der Kern ist: der Agent selbst braucht sie als Gedächtnis und Regelquelle.',
          },
          {
            id: 'compliance',
            text: 'Vor allem aus Compliance-/Dokumentationspflicht.',
            correct: false,
            why: 'Formpflicht ist nebensächlich; der praktische Zweck ist, Drift und Constraint-Verlust zu verhindern.',
          },
          {
            id: 'context',
            text: 'Damit man den gesamten Verlauf in den Context laden kann.',
            correct: false,
            why: 'Das Gegenteil: die Control Plane ist destilliert und on-demand — nicht das rohe Transkript, das den Context flutet.',
          },
        ],
        takeaway: 'Die Steuer-Docs sind das Gedächtnis und Regelwerk des Projekts über Läufe hinweg — fehlen sie, geht Wissen verloren und Constraints kippen still.',
      },
    },
  ],
}
