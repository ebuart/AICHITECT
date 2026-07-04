import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-06-03 · post-template redesign, HARD. Bespoke puzzle exercises (annotate · pick). A
// learning loop is only useful if the captured "learnings" are durable + actionable (a reusable
// observation→rule), not vague feelings, trivia, or one-off noise. The annotate legend teaches
// exactly which logged learnings are worthless.
export const agentLearningLoops: Lesson = {
  id: 'LESSON-06-03',
  roadmapNodeId: 'NODE-06-03',
  conceptIds: ['CONCEPT-MEM-005'],
  prerequisites: ['NODE-06-02'],
  title: 'Agent Learning Loops',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Wiederverwendbare, umsetzbare Lehren von wertlosen Log-Einträgen unterscheiden.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-CHAT-MEMORY-ONLY',
  reviewHooks: ['CONCEPT-MEM-005'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Lern-Schleife',
      text: 'Ein Agent verbessert sich über Läufe, indem er Lehren festhält — aber nur, wenn sie ein wiederverwendbares Muster + eine konkrete Handlung tragen (Beobachtung → Regel). Vage Befindlichkeiten oder Einmal-Ereignisse helfen nichts.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'weak-learnings',
        format: 'annotate',
        stem: 'Das ist das Lern-Log eines Agenten. Tippe jeden Eintrag an, der als „Learning" wertlos ist.',
        legend: [
          { label: 'Zu vage', hint: 'keine konkrete, extrahierbare Beobachtung' },
          { label: 'Nicht umsetzbar', hint: 'leitet keine Handlung/Regel ab' },
          { label: 'Einmal-Rauschen', hint: 'ein Einzelereignis ohne Muster oder Ursache' },
          { label: 'Triviale Selbstverständlichkeit', hint: 'trägt nichts Neues bei' },
        ],
        segments: [
          { id: 'a1', text: 'Beim Refactor von auth.ts: erst Tests laufen lassen, dann ändern — fing einen Regressions-Bug früh.' },
          { id: 'a2', text: 'Heute lief es insgesamt ganz gut.', flag: { category: 'Zu vage', why: 'Kein extrahierbares Muster — woran lag es, was wiederholt man?', fix: 'Konkret: welche Handlung führte wozu?' } },
          { id: 'a3', text: 'Der Nutzer bevorzugt kurze Antworten ohne Vorrede.' },
          { id: 'a4', text: 'Am Freitag gab es beim Deploy einen Timeout.', flag: { category: 'Einmal-Rauschen', why: 'Ein einzelner Vorfall ohne erkannte Ursache oder Muster — nichts Wiederverwendbares.', fix: 'Erst bei Wiederholung + Ursache zur Regel machen.' } },
          { id: 'a5', text: 'Der Code sollte am Ende funktionieren.', flag: { category: 'Triviale Selbstverständlichkeit', why: 'Sagt nichts, was man nicht ohnehin weiß.', fix: 'Streichen — kein Informationswert.' } },
          { id: 'a6', text: 'Nach jeder Prompt-Änderung das Eval-Set laufen lassen, bevor man ausrollt.' },
          { id: 'a7', text: 'Die neue API ist irgendwie komisch.', flag: { category: 'Nicht umsetzbar', why: 'Keine konkrete Beobachtung und keine ableitbare Handlung.', fix: 'Den konkreten Stolperstein benennen (z. B. „Pagination beginnt bei 0, nicht 1").' } },
        ],
        takeaway: 'Ein durables Learning ist Beobachtung → Regel: konkret, wiederholbar, handlungsleitend. Vages, Triviales und Einzel-Vorfälle gehören nicht ins Log.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'good-learning',
        format: 'pick',
        stem: 'Was gehört als „Learning" in ein durables Agenten-Log?',
        options: [
          {
            id: 'pattern',
            text: 'Ein wiederverwendbares Muster mit konkreter Handlung — Beobachtung → Regel, die bei der passenden Aufgabe greift.',
            correct: true,
            why: 'Nur so verbessert sich der Agent: die Lehre feuert beim nächsten ähnlichen Fall und verhindert den Fehler erneut.',
          },
          {
            id: 'everything',
            text: 'Möglichst jeder Vorgang, damit nichts verloren geht.',
            correct: false,
            why: 'Alles zu loggen erzeugt Rauschen, in dem die echten Lehren untergehen — Kuratierung schlägt Vollständigkeit.',
          },
          {
            id: 'feelings',
            text: 'Wie gut sich der Lauf „angefühlt" hat.',
            correct: false,
            why: 'Befindlichkeiten sind nicht abrufbar und nicht handlungsleitend.',
          },
          {
            id: 'once',
            text: 'Jedes einzelne ungewöhnliche Ereignis, sofort als Regel.',
            correct: false,
            why: 'Ein Einzelfall ohne Muster ist oft Rauschen — erst Wiederholung/Ursache rechtfertigt eine Regel.',
          },
        ],
        takeaway: 'Gute Lehren sind kuratiert, gemustert und umsetzbar — nicht jedes Ereignis, kein Gefühl, kein Einzelfall.',
      },
    },
  ],
}
