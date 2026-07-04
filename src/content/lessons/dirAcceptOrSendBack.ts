import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-13-02 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (annotate the
// agent's delivery against the BRIEF · pick). Review against acceptance criteria, not taste:
// catch the missed criterion and scope-creep, but DON'T reject taste choices. The annotate
// legend even includes a "pure taste — NOT a reason to reject" category to defeat that reflex.
export const dirAcceptOrSendBack: Lesson = {
  id: 'LESSON-13-02',
  roadmapNodeId: 'NODE-13-02',
  conceptIds: ['CONCEPT-DIR-009'],
  prerequisites: ['NODE-13-01'],
  title: 'Accept or Send Back',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Agent-Output gegen die Akzeptanzkriterien abnehmen — nicht gegen Geschmack.',
  interactionType: 'trade-off-duel',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-DIR-009', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Review heißt: gegen den Brief, nicht gegen Geschmack',
      text: 'Brief war: CSV-Export mit allen definierten Bestellspalten; der bestehende Test bleibt grün. Der Agent meldet seine Lieferung. Prüfe gegen die Kriterien — und widerstehe der Versuchung, wegen Geschmack zurückzuweisen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'review-delivery',
        format: 'annotate',
        stem: 'Die Liefer-Notiz des Agenten. Tippe nur an, was ein echter Grund zur Zurückweisung ist — Geschmack zählt nicht.',
        legend: [
          { label: 'Akzeptanzkriterium verfehlt', hint: 'verstößt gegen den Brief' },
          { label: 'Scope verlassen', hint: 'hat Ungefragtes/Unbeauftragtes getan' },
          { label: 'Behauptung ohne Beleg', hint: '„sollte funktionieren" statt geprüft' },
          { label: 'Reine Geschmacksfrage', hint: 'KEIN Grund zur Zurückweisung — nicht antippen' },
        ],
        segments: [
          { id: 'r1', text: 'Der Export erzeugt eine CSV mit allen definierten Bestellspalten.' },
          { id: 'r2', text: 'Ich habe Komma als Trennzeichen gewählt (nicht Semikolon).' },
          { id: 'r3', text: 'Der bestehende Export-Test ist jetzt rot, aber das alte Verhalten war ohnehin seltsam.', flag: { category: 'Akzeptanzkriterium verfehlt', why: 'Der Brief verlangt: bestehender Test bleibt grün. Rot ist ein harter Verstoß — egal, wie „seltsam" das Alte war.', fix: 'Zurückweisen, bis der Test wieder grün ist (oder die Test-Änderung explizit begründet + abgesegnet).' } },
          { id: 'r4', text: 'Nebenbei habe ich die Logging-Utils umgebaut.', flag: { category: 'Scope verlassen', why: 'Nicht beauftragt; eine ungefragte Änderung ist Risiko ohne Auftrag.', fix: 'Aus der PR herauslösen — separat briefen oder verwerfen.' } },
          { id: 'r5', text: 'Große Exporte sollten funktionieren.', flag: { category: 'Behauptung ohne Beleg', why: '„Sollten" heißt: nicht geprüft. Genau die Datenmenge war kritisch.', fix: 'Mit einem großen Datensatz testen und das Ergebnis zeigen.' } },
          { id: 'r6', text: 'Die Variablennamen sind auf Englisch.' },
        ],
        takeaway: 'Echte Gründe: verfehltes Kriterium (roter Test), Scope-Verlassen, ungeprüfte Behauptung. Komma-Wahl und Englisch sind Geschmack — kein Grund zur Zurückweisung.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'accept-or-not',
        format: 'pick',
        stem: 'Nimmst du diese Lieferung ab?',
        options: [
          {
            id: 'sendback',
            text: 'Zurückweisen — ein Akzeptanzkriterium ist verfehlt (Test rot) und es wurde Scope verlassen. Die Geschmackspunkte sind kein Grund.',
            correct: true,
            why: 'Review misst gegen den Brief: roter Test und ungefragter Umbau sind harte Gründe; Komma/Englisch sind irrelevant.',
          },
          {
            id: 'accept',
            text: 'Abnehmen — es läuft, sieht sauber aus und ist „im Großen und Ganzen" fertig.',
            correct: false,
            why: '„Sieht fertig aus" ist die Falle: ein verfehltes Kriterium (roter Test) bleibt ein Fail, egal wie sauber der Rest wirkt.',
          },
          {
            id: 'taste',
            text: 'Zurückweisen, weil Semikolon als Trennzeichen schöner wäre.',
            correct: false,
            why: 'Das ist Geschmack innerhalb der Spec — kein legitimer Grund, die Arbeit zurückzuweisen.',
          },
          {
            id: 'fix-self',
            text: 'Selbst schnell den Test grün machen und es durchwinken.',
            correct: false,
            why: 'Das fällt in Builder-Arbeit zurück und verschleiert das Problem — der Agent lernt nichts, und der Scope-Umbau bleibt drin.',
          },
        ],
        takeaway: 'Abnahme ist gegen den Brief: ein verfehltes Kriterium oder Scope-Verlassen weist man zurück; Geschmack ist nie der Grund.',
      },
    },
  ],
}
