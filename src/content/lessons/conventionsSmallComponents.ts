import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-09-02 · post-template redesign, HARD. Refactor-first: bespoke puzzle exercises (diff ·
// pick). Small, single-purpose units + stable conventions keep a repo agent-safe to change. The
// durable skill: spot the change that quietly gives a unit a SECOND job (the flag-parameter smell).
export const conventionsSmallComponents: Lesson = {
  id: 'LESSON-09-02',
  roadmapNodeId: 'NODE-09-02',
  conceptIds: ['CONCEPT-REPO-002', 'CONCEPT-REPO-003'],
  prerequisites: ['NODE-09-01'],
  title: 'Conventions and Small Components',
  estimatedMinutes: 7,
  lessonMode: 'refactor-first',
  learningGoal: 'Monster-Files vermeiden: kleine, einzweckige Einheiten und stabile Konventionen.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-MONSTER-FILE',
  reviewHooks: ['CONCEPT-REPO-002', 'CONCEPT-REPO-003', 'conventions_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Kleine, einzweckige Einheiten',
      text: 'Eine Funktion/Komponente, die genau eine Sache tut, lässt sich ganz erfassen und sicher ändern — von Menschen wie Agents. Das häufigste schleichende Gegenteil: ein Flag-Parameter, der eine Einheit in zwei Verhalten aufspaltet.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'flag-smell',
        format: 'diff',
        stem: 'Review dieses Diffs. Welche geänderte Zeile gibt der Funktion eine zweite Aufgabe (Code-Smell)?',
        lines: [
          { id: 'l1', text: 'function exportReport(data) {', sign: '-' },
          { id: 'l2', text: 'function exportReport(data, asPdf) {', sign: '+' },
          { id: 'l3', text: '  const rows = format(data)', sign: ' ' },
          {
            id: 'l4',
            text: '  if (asPdf) return toPdf(rows)',
            sign: '+',
            bad: true,
            note: 'Ein boolean-Flag, das das Verhalten umschaltet: die Funktion macht jetzt zwei Dinge. Sauberer sind zwei Einheiten — exportCsv() und exportPdf() — jede mit einer Aufgabe.',
          },
          { id: 'l5', text: '  return toCsv(rows)', sign: ' ' },
          { id: 'l6', text: '}', sign: ' ' },
        ],
        takeaway: 'Ein Flag-Parameter, der per if zwei Verhalten schaltet, ist das Signal „hier stecken zwei Funktionen drin" — auftrennen statt verzweigen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'small-why',
        format: 'pick',
        stem: 'Warum kleine, einzweckige Einheiten und konsistente Konventionen?',
        options: [
          {
            id: 'safe-change',
            text: 'Eine kleine, benannte Einheit lässt sich ganz erfassen und ändern, ohne unbeteiligte Teile zu brechen — und Konventionen machen das Verhalten vorhersehbar.',
            correct: true,
            why: 'Begrenzter Wirkungsradius + vorhersehbare Muster = sichere Änderungen, gerade wenn ein Agent editiert, der nicht das ganze System im Kopf hat.',
          },
          {
            id: 'smaller-always',
            text: 'Weil kleiner grundsätzlich immer besser ist — je mehr winzige Dateien, desto besser.',
            correct: false,
            why: 'Dogma. Sinnvoll geschnitten nach Verantwortung, nicht maximal zerstückelt — sonst zerfasert der Zusammenhang.',
          },
          {
            id: 'fewer-files',
            text: 'Damit das Repo weniger Dateien hat.',
            correct: false,
            why: 'Aufteilen erzeugt eher MEHR Dateien — der Gewinn ist sichere Änderbarkeit, nicht eine kleinere Dateizahl.',
          },
          {
            id: 'perf',
            text: 'Vor allem wegen der Laufzeit-Performance.',
            correct: false,
            why: 'Struktur ist eine Frage der Wartbarkeit/Lesbarkeit, nicht der Performance — die ändert sich davon kaum.',
          },
        ],
        takeaway: 'Schneide nach Verantwortung: eine Einheit, eine Aufgabe, vorhersehbare Konventionen — so bleiben Änderungen lokal und sicher.',
      },
    },
  ],
}
