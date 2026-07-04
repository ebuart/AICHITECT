import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-09-01 · post-template redesign, HARD. Bespoke puzzle exercises (multispot · pick). An
// agent navigates only what the repo makes EXPLICIT — implicit tribal knowledge doesn't exist
// for it. The durable skill: spot the repo traits that make it illegible (and unsafe to change).
export const repoLegibility: Lesson = {
  id: 'LESSON-09-01',
  roadmapNodeId: 'NODE-09-01',
  conceptIds: ['CONCEPT-REPO-001'],
  prerequisites: ['NODE-08-04'],
  title: 'Repo Legibility',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Repo-Eigenschaften erkennen, die Menschen und Agents das Lesen und sichere Ändern erschweren.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-ILLEGIBLE-REPO',
  reviewHooks: ['CONCEPT-REPO-001', 'repo_legibility_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Lesbarkeit ist die Schnittstelle',
      text: 'Ein Agent (und ein neuer Mensch) navigiert nur über das, was das Repo explizit macht: Struktur, Namen, Doku, Tests. Implizites Wissen „im Kopf des Teams" existiert für ihn nicht — fehlt es, legt er Code am falschen Ort ab und baut Vorhandenes nach.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'illegible-traits',
        format: 'multispot',
        stem: 'Tippe jede Eigenschaft an, die das Repo für einen Agenten schlecht lesbar (oder unsicher änderbar) macht.',
        lines: [
          { id: 'p1', text: 'README mit Setup-Schritten und einem Architektur-Überblick' },
          { id: 'p2', text: 'Ein 4 000-Zeilen utils.js, in dem „alles" liegt', isAttack: true, note: 'Eine Monster-Datei ohne klare Verantwortung — niemand (und kein Agent) erfasst, was drin ist; Änderungen sind riskant.' },
          { id: 'p3', text: 'Konsistente Namens- und Ordner-Konventionen' },
          { id: 'p4', text: 'Überall tote, auskommentierte Code-Blöcke', isAttack: true, note: 'Rauschen, das echte von obsoleter Logik ununterscheidbar macht — der Agent kann auf totem Code aufbauen.' },
          { id: 'p5', text: 'Tests neben dem Code, die das erwartete Verhalten zeigen' },
          { id: 'p6', text: 'Ein Build-Schritt, den nur ein Teammitglied „im Kopf" hat', isAttack: true, note: 'Tribal Knowledge: für einen Agenten existiert es nicht. Was nicht im Repo steht, kann er nicht befolgen.' },
          { id: 'p7', text: 'Tief verschachtelte, magische Abkürzungen ohne Kommentar', isAttack: true, note: 'Ohne erklärten Zweck muss der Agent raten — er trifft den Sinn oft nicht und ändert das Falsche.' },
        ],
        takeaway: 'Illegibel sind Monster-Dateien, toter Code, undokumentiertes Tribal Knowledge und magische Kürzel. Lesbar sind klare Struktur, Namen, Doku und Tests.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'why-legible',
        format: 'pick',
        stem: 'Warum ist Lesbarkeit für einen Agenten besonders wichtig?',
        options: [
          {
            id: 'explicit',
            text: 'Ein Agent kann nur nutzen, was das Repo explizit macht — implizites Team-Wissen existiert für ihn nicht; das Repo IST seine Schnittstelle.',
            correct: true,
            why: 'Er liest Struktur, Namen, Doku und Tests. Steht der Sinn nicht im Repo, rät er — und legt Code falsch ab oder baut Vorhandenes nach.',
          },
          {
            id: 'humans-only',
            text: 'Lesbarkeit ist nur für menschliche Entwickler relevant.',
            correct: false,
            why: 'Gerade Agents sind auf Explizitheit angewiesen — sie können niemanden „kurz fragen".',
          },
          {
            id: 'style',
            text: 'Vor allem, damit der Code schön aussieht.',
            correct: false,
            why: 'Ästhetik ist nebensächlich; es geht um zuverlässige Navigation und sichere Änderbarkeit.',
          },
          {
            id: 'smarter',
            text: 'Mit einem stärkeren Modell braucht man auf Lesbarkeit nicht zu achten.',
            correct: false,
            why: 'Kein Modell errät Wissen, das nirgends steht. Lesbarkeit ist eine Eigenschaft des Repos, nicht des Modells.',
          },
        ],
        takeaway: 'Das Repo ist die Schnittstelle des Agenten: explizite Struktur, Namen, Doku und Tests — nicht Wissen, das nur im Team-Kopf lebt.',
      },
    },
  ],
}
