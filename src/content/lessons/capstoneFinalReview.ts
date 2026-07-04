import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-10-05 · CAPSTONE final review, post-template redesign. Postmortem: bespoke puzzle exercises
// (annotate the ship report for overclaims · pick the mature defense). A mature architecture knows
// its trade-offs and failure modes and presents them honestly — claimed perfection is the tell.
export const capstoneFinalReview: Lesson = {
  id: 'LESSON-10-05',
  roadmapNodeId: 'NODE-10-05',
  conceptIds: ['all_core'],
  prerequisites: ['NODE-10-04'],
  title: 'Final System Review',
  estimatedMinutes: 9,
  lessonMode: 'postmortem',
  learningGoal: 'Das System ehrlich verteidigen: gemessene Zahlen und offene Risiken statt behaupteter Perfektion.',
  interactionType: 'capstone-simulator',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-CAPSTONE-DEFENSE',
  reviewHooks: ['all_core', 'capstone_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Letztes Review',
      text: 'Du legst den Abschlussbericht deines Systems vor. Eine reife Architektur behauptet keine Perfektion — sie nennt gemessene Zahlen, Trade-offs und bekannte Failure Modes. Genau daran erkennt man sie.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'review-report',
        format: 'annotate',
        stem: 'Der Abschlussbericht zum Support-Assistenten. Tippe jede Aussage an, die ein reifer Reviewer beanstandet.',
        legend: [
          { label: 'Überzogene Behauptung', hint: 'Absolutheit, die kein System halten kann' },
          { label: 'Ungemessen / ohne Beleg', hint: 'Gefühl statt Zahl' },
          { label: 'Verschwiegene Schwäche', hint: 'tut so, als gäbe es keine Risiken' },
          { label: 'Reine Geschmacksfrage', hint: 'KEIN Mangel — nicht antippen' },
        ],
        segments: [
          { id: 'f1', text: 'Der Assistent beantwortet Support-Fragen aus den Docs mit Grounding-Check.' },
          { id: 'f2', text: 'Er ist zu 100 % genau.', flag: { category: 'Überzogene Behauptung', why: 'Kein produktives System ist 100 % genau — das ist unhaltbar und verdeckt die echten Fehlerraten.', fix: 'Die gemessene Erfolgsquote nennen (z. B. „96 % auf dem Eval-Set").' } },
          { id: 'f3', text: 'Rückerstattungen über 100 € laufen über ein Approval-Gate.' },
          { id: 'f4', text: 'Sicherheitsrisiken bestehen keine mehr.', flag: { category: 'Verschwiegene Schwäche', why: '„Keine Risiken" ist nie wahr — es signalisiert, dass die Failure Modes nicht durchdacht sind.', fix: 'Die bekannten Risiken + ihre Mitigation nennen (z. B. Injection → Daten≠Befehl + Gate).' } },
          { id: 'f5', text: 'Die Antwortzeit fühlt sich schnell an.', flag: { category: 'Ungemessen / ohne Beleg', why: '„Fühlt sich an" ist keine Messung — ohne Zahl unprüfbar.', fix: 'p95-Latenz angeben.' } },
          { id: 'f6', text: 'Gegen die letzte Version gemessen: 96 % Task-Erfolg, keine kritischen Regressionen.' },
        ],
        takeaway: 'Reife klingt nach Zahlen und offenen Risiken: „96 % Erfolg, bekannte Injection-Fläche mitigiert" — nicht nach „100 % genau, keine Risiken".',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'mature-defense',
        format: 'pick',
        stem: 'Wie verteidigt ein reifer Director sein System im Abschluss-Review?',
        options: [
          {
            id: 'honest',
            text: 'Mit gemessenen Zahlen, den bewussten Trade-offs und den bekannten Failure Modes samt ihrer Mitigation — inklusive dessen, was NICHT getestet ist.',
            correct: true,
            why: 'Vertrauen entsteht durch Ehrlichkeit über Grenzen, nicht durch Perfektionsbehauptungen. Wer seine Risiken benennt, hat sie durchdacht.',
          },
          {
            id: 'perfect',
            text: 'Indem er zeigt, dass das System fehlerfrei und ohne Risiken läuft.',
            correct: false,
            why: '„Fehlerfrei" ist unglaubwürdig und verrät, dass die Failure Modes nicht analysiert wurden.',
          },
          {
            id: 'hide',
            text: 'Indem er die Schwächen weglässt, um das Projekt nicht schlechtzureden.',
            correct: false,
            why: 'Verschwiegene Schwächen werden später teuer — und ein erfahrener Reviewer erkennt die Lücke sofort.',
          },
          {
            id: 'demo',
            text: 'Indem er eine beeindruckende Live-Demo zeigt.',
            correct: false,
            why: 'Eine Demo ist die Spitze des Eisbergs — ein Review prüft die Ebenen darunter, nicht den einen gelungenen Lauf.',
          },
        ],
        takeaway: 'Ein reifer Abschluss nennt Zahlen, Trade-offs, Failure Modes und Ungetestetes — Ehrlichkeit über Grenzen schlägt behauptete Perfektion.',
      },
    },
  ],
}
