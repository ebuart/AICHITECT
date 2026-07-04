import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-08-02 · post-template redesign, HARD. Bespoke puzzle exercises (threshold · pick). Set
// the risk cutoff above which an action needs a human gate. The durable skill: gate by
// blast-radius / reversibility, catch every truly-risky action without over-gating the rest.
export const humanApprovalGates: Lesson = {
  id: 'LESSON-08-02',
  roadmapNodeId: 'NODE-08-02',
  conceptIds: ['CONCEPT-SEC-002'],
  prerequisites: ['NODE-08-01'],
  title: 'Human Approval Gates',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Die Schwelle für menschliche Freigabe nach Blast-Radius setzen — ohne über zu gaten.',
  interactionType: 'security-incident-room',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-BROAD-TOOL-PERMISSION',
  reviewHooks: ['CONCEPT-SEC-002'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Approval-Gate',
      text: 'Ein Agent darf risikoarme Aktionen selbst ausführen, riskante nur mit menschlicher Freigabe. Jede Aktion bekommt einen Risiko-Score; die Schwelle entscheidet, ab wann ein Gate greift. Ziel: alle riskanten gaten, harmlose durchlassen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'set-gate',
        format: 'threshold',
        stem: 'Setze die Freigabe-Schwelle: ab diesem Risiko-Score braucht eine Aktion menschliche Freigabe. Fang ALLE riskanten Aktionen, ohne die harmlosen unnötig zu gaten.',
        unit: 'Risiko',
        min: 0,
        max: 100,
        step: 5,
        samples: [
          { id: 'faq', label: 'FAQ-Antwort senden', value: 5, keep: false },
          { id: 'status', label: 'Bestellstatus nachschlagen', value: 20, keep: false },
          { id: 'address', label: 'Lieferadresse ändern', value: 40, keep: false },
          { id: 'refund-big', label: 'Rückerstattung über 2 000 €', value: 75, keep: true },
          { id: 'massmail', label: 'Massen-E-Mail an alle Kunden', value: 80, keep: true },
          { id: 'delete', label: 'Kundenkonto löschen', value: 95, keep: true },
        ],
        takeaway: 'Die richtige Schwelle liegt zwischen der riskantesten harmlosen (40) und der harmlosesten riskanten Aktion (75) — höher und du verpasst echte Risiken, niedriger und du gatest alles.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'gate-principle',
        format: 'pick',
        stem: 'Wonach entscheidest du, ob eine Aktion ein Approval-Gate braucht?',
        options: [
          {
            id: 'blast',
            text: 'Nach Blast-Radius und Umkehrbarkeit — irreversible, weitreichende oder teure Aktionen werden gegatet.',
            correct: true,
            why: 'Das Gate schützt vor genau dem Schaden, der sich nicht zurücknehmen lässt. Reversibel + klein = laufen lassen; irreversibel + groß = Freigabe.',
          },
          {
            id: 'confidence',
            text: 'Nach der Selbsteinschätzung des Modells — bei niedriger Confidence gaten.',
            correct: false,
            why: 'Modell-Confidence ist unzuverlässig und sagt nichts über den Schaden. Eine selbstsichere, aber irreversible Aktion (Konto löschen) rutscht so durch.',
          },
          {
            id: 'frequency',
            text: 'Nach Häufigkeit — seltene Aktionen gaten, häufige nicht.',
            correct: false,
            why: 'Häufigkeit ≠ Risiko. Eine häufige, aber teure Aktion (Rückerstattungen) bliebe ungegatet, eine seltene harmlose würde unnötig gebremst.',
          },
          {
            id: 'all',
            text: 'Jede Aktion durch ein Approval-Gate führen.',
            correct: false,
            why: 'Über-Gating erstickt den Nutzen des Agenten und trainiert Menschen darauf, blind abzunicken — dann schützt das Gate nichts mehr.',
          },
        ],
        takeaway: 'Gate nach Schaden, nicht nach Gefühl: irreversibel und weitreichend → Freigabe; klein und umkehrbar → autonom.',
      },
    },
  ],
}
