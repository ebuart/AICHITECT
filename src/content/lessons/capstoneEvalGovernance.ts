import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-10-04 · CAPSTONE eval+governance, post-template redesign. Eval-first: bespoke puzzle
// exercises (multispot the ship-gate gaps · pick the ship decision). Prove the fix stays fixed:
// a deploy gate over task-success + regression + grounding — and a critical regression is a hard
// block, average be damned.
export const capstoneEvalGovernance: Lesson = {
  id: 'LESSON-10-04',
  roadmapNodeId: 'NODE-10-04',
  conceptIds: ['all_core'],
  prerequisites: ['NODE-10-03'],
  title: 'Capstone Eval and Governance',
  estimatedMinutes: 8,
  lessonMode: 'eval-first',
  learningGoal: 'Den Eval als Deploy-Gate auslegen — Lücken erkennen und kritische Regressionen hart blocken.',
  interactionType: 'eval-designer',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-CAPSTONE-EVAL',
  reviewHooks: ['all_core', 'eval_transfer', 'grounding_eval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Beweisen, dass es zu bleibt',
      text: 'Der Fix aus dem Vorfall schließt die Lücke — aber wie stellst du sicher, dass sie geschlossen bleibt? Du legst den Eval als Deploy-Gate aus: kein Release ohne grün.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'gate-gaps',
        format: 'multispot',
        stem: 'Der geplante Deploy-Gate für den Assistenten. Tippe jede Lücke an, die ihn unzuverlässig macht.',
        lines: [
          { id: 'e1', text: 'Eval misst Task-Erfolg am Endzustand (richtige Aktion ausgeführt).' },
          { id: 'e2', text: 'Eval prüft Grounding: jede Antwort ist durch die Docs gedeckt.' },
          { id: 'e3', text: 'Es gibt keinen paarweisen Regressions-Vergleich zur letzten Version.', isAttack: true, note: 'Ohne Regressions-Check rutscht ein neu gebrochener Fall durch, solange der Schnitt stimmt.' },
          { id: 'e4', text: 'Der Injection-Refund-Fall aus dem Vorfall ist NICHT im Eval-Set.', isAttack: true, note: 'Genau der Fall, der live passierte, wird nicht getestet — die Lücke könnte still zurückkehren.' },
          { id: 'e5', text: 'Alle Tool-Calls werden auditiert.' },
          { id: 'e6', text: 'High-Value-Refunds haben kein Eval-Szenario, das das Approval-Gate prüft.', isAttack: true, note: 'Das wichtigste Governance-Verhalten ist ungetestet — es könnte unbemerkt deaktiviert werden.' },
          { id: 'e7', text: 'Der Gate blockt Release nur am Durchschnitts-Score, nicht an kritischen Einzelfällen.', isAttack: true, note: 'Ein hoher Schnitt kann einen kritischen Regress verdecken — kritische Fälle brauchen ein hartes Veto.' },
        ],
        takeaway: 'Ein tragfähiger Gate hat: Regressions-Vergleich, den realen Vorfall als Testfall, ein Szenario fürs Approval-Gate und ein hartes Veto für kritische Fälle — nicht nur einen Durchschnitt.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'ship-gate',
        format: 'pick',
        stem: 'Die neue Version hebt den Durchschnitts-Score um 4 % — aber der Injection-Refund-Testfall ist neu rot. Release?',
        options: [
          {
            id: 'block',
            text: 'Nein — ein kritischer Sicherheits-Regress ist ein hartes Veto, unabhängig vom gestiegenen Durchschnitt.',
            correct: true,
            why: 'Genau die Lehre aus dem Vorfall: kritische Fälle mitteln sich nicht weg. Erst grün auf dem Refund-Fall, dann Release.',
          },
          {
            id: 'ship',
            text: 'Ja — der Durchschnitt ist höher, also ist die Version besser.',
            correct: false,
            why: 'Der Schnitt verdeckt genau den Fall, der schon einmal teuer war. Das ist die Kopfzahl-Falle.',
          },
          {
            id: 'remove',
            text: 'Den roten Testfall vorerst aus dem Gate nehmen, dann ist er grün.',
            correct: false,
            why: 'Das Eval-Set zu frisieren ist der Kardinalfehler — du reparierst die Messung, nicht das System.',
          },
          {
            id: 'backlog',
            text: 'Ausrollen und den roten Fall ins Backlog legen.',
            correct: false,
            why: 'Eine bekannte, schon einmal eingetretene Sicherheitslücke live zu schalten ist kein Backlog-Ticket.',
          },
        ],
        takeaway: 'Der Deploy-Gate hat ein hartes Veto für kritische Fälle — ein höherer Durchschnitt rechtfertigt keinen bekannten Sicherheits-Regress.',
      },
    },
  ],
}
