import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-07-01 · post-template redesign, HARD. Bespoke puzzle exercises (multispot over a real
// eval set · pick). The durable skill is judging eval CASES: a flawed case (leaky, flaky,
// tests-the-wrong-thing, no clear pass criterion) makes the whole harness lie. Tells are not
// telegraphed — the learner reads each case and decides.
export const evalHarness: Lesson = {
  id: 'LESSON-07-01',
  roadmapNodeId: 'NODE-07-01',
  conceptIds: ['CONCEPT-EVAL-001'],
  prerequisites: ['NODE-06-04'],
  title: 'Eval Harness',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Tragfähige Eval-Fälle von kaputten unterscheiden — die Messung muss echten Erfolg prüfen.',
  interactionType: 'eval-designer',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-EVAL-001', 'eval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Eval Harness',
      text: 'Ein Eval-Harness misst wiederholbar, ob das System seine Aufgabe erfüllt. Er ist aber nur so gut wie seine Fälle: ein einziger kaputter Fall (prüft das Falsche, ist flaky, verrät die Antwort) macht die ganze Messung unzuverlässig.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'flawed-cases',
        format: 'multispot',
        stem: 'Ein Eval-Set für einen Support-Agenten. Tippe jeden Fall an, der als Eval-Fall kaputt ist.',
        intro: 'Jeder Fall = Eingabe → erwartetes Ergebnis + Pass-Kriterium.',
        lines: [
          { id: 'c1', text: 'C1  „Storniere #8842" → Endzustand: Bestellung storniert, keine andere verändert.' },
          {
            id: 'c2',
            text: 'C2  „Wie ist das Wetter?" → Pass, wenn die Antwort hilfreich klingt.',
            isAttack: true,
            note: '„Hilfreich klingt" ist kein prüfbares Kriterium — subjektiv und nicht reproduzierbar. Pass-Bedingungen müssen objektiv prüfbar sein.',
          },
          { id: 'c3', text: 'C3  „Erstatte 50 €" → genau ein refund-Call mit amount=50, status=ok.' },
          {
            id: 'c4',
            text: 'C4  „Fasse Ticket #12 zusammen" → Pass, wenn Output == „Kunde will Rückerstattung wegen verspäteter Lieferung."',
            isAttack: true,
            note: 'Exakter String-Match auf eine freie Zusammenfassung — jede gültige Paraphrase fällt durch. Hier braucht es ein Kriterium auf Bedeutung, nicht Wortgleichheit.',
          },
          { id: 'c5', text: 'C5  „Lege Ticket für Login-Bug an" → es existiert danach genau ein Ticket mit type=bug.' },
          {
            id: 'c6',
            text: 'C6  „Antworte auf Beschwerde" → die erwartete Antwort steht wörtlich in der Eingabe mit.',
            isAttack: true,
            note: 'Leakage: die Soll-Antwort ist Teil der Eingabe. Der Agent kann sie abschreiben — der Fall misst nichts.',
          },
          { id: 'c7', text: 'C7  „Eskaliere bei Wut-Kunde" → Aktion escalate wurde ausgelöst.' },
          {
            id: 'c8',
            text: 'C8  „Nenne den aktuellen Aktienkurs" → Pass, wenn der Wert exakt 187,42 $ ist.',
            isAttack: true,
            note: 'Flaky: ein Live-Wert ändert sich ständig. Ein fest verdrahteter Ist-Wert macht den Fall mal grün, mal rot — ohne dass sich das System ändert.',
          },
        ],
        takeaway: 'Ein guter Eval-Fall hat ein objektives, reproduzierbares, leakage-freies Pass-Kriterium auf dem ECHTEN Ziel — nicht „klingt gut", nicht exakter Text auf freie Antworten, nichts Flakiges.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'good-criterion',
        format: 'pick',
        stem: 'Was macht ein Pass-Kriterium tragfähig?',
        options: [
          {
            id: 'objective',
            text: 'Es ist objektiv und reproduzierbar am Endzustand/Outcome prüfbar — zwei Läufe ohne Systemänderung urteilen gleich.',
            correct: true,
            why: 'Reproduzierbarkeit ist der Kern: nur dann unterscheidet der Eval echte Regressionen von Rauschen.',
          },
          {
            id: 'human-feel',
            text: 'Ein Mensch findet die Antwort beim Drüberlesen gut.',
            correct: false,
            why: 'Subjektiv und nicht skalierbar — über tausende Fälle nicht reproduzierbar. Gut zum Kalibrieren, nicht als Kriterium.',
          },
          {
            id: 'exact-text',
            text: 'Der Output stimmt exakt mit einer Referenz-Zeichenkette überein.',
            correct: false,
            why: 'Bestraft jede gültige Paraphrase. Nur dort richtig, wo die Antwort wirklich eindeutig ist (eine ID, eine Zahl).',
          },
          {
            id: 'no-error',
            text: 'Der Lauf wirft keine Exception.',
            correct: false,
            why: '„Kein Crash" ≠ „Aufgabe erfüllt" — der Agent kann sauber durchlaufen und das Falsche tun.',
          },
        ],
        takeaway: 'Pass-Kriterien prüfen das Outcome objektiv und reproduzierbar — sonst misst der Harness Gefühl oder Zufall.',
      },
    },
  ],
}
