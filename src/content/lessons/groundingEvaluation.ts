import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-07-03 · 3rd node of the post-template redesign, HARD (2026-06-21). Bespoke
// concrete exercises, no mechanic engine, no scenario/constraint wrapper. Concrete
// material (a real answer + numbered sources, a claim list) and impersonal phrasing.
// Format mix DIFFERS from 05-03: spot · pick · multi · pick.
//
// GROUND-UP: a grounding/faithfulness eval checks whether each claim is COVERED by the
// retrieved context — not whether it happens to be true in the world. The durable skill
// (grows as models hallucinate more fluently): decompose into atomic claims and check each
// against the evidence; "correct" and "grounded" are two different axes. Options shuffle at
// render; nothing is telegraphed; the note teaches only the prior context the tasks assume.
export const groundingEvaluation: Lesson = {
  id: 'LESSON-07-03',
  roadmapNodeId: 'NODE-07-03',
  conceptIds: ['CONCEPT-EVAL-003'],
  prerequisites: ['NODE-07-02'],
  title: 'Grounding Evaluation',
  estimatedMinutes: 9,
  lessonMode: 'worked-trace-first',
  learningGoal:
    'Jede Aussage gegen die Quell-Evidenz prüfen — Deckung von Plausibilität und von Weltwissen trennen.',
  interactionType: 'eval-designer',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-UNGROUNDED-CLAIM',
  reviewHooks: ['CONCEPT-EVAL-003', 'grounding_eval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Grounding / Faithfulness',
      text: 'Ein Grounding-Eval prüft, ob jede Aussage einer Antwort durch den abgerufenen Kontext GEDECKT ist — unabhängig davon, ob sie in der Welt zufällig stimmt. Vorgehen: Antwort in einzelne Aussagen zerlegen, jede gegen die Quelle halten.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'ungrounded-claim',
        format: 'spot',
        stem: 'Eine RAG beantwortet „Bis wann kann ich stornieren und wie läuft die Erstattung?". Tippe die Aussage in der Antwort, die von den Quellen NICHT gedeckt ist.',
        intro:
          'Quellen — [1] „Bestellungen können storniert werden, solange sie nicht versandt wurden." · [2] „Rückgaben sind innerhalb von 14 Tagen nach Erhalt möglich. Erstattungen werden nach Eingang der Rücksendung bearbeitet."',
        lines: [
          {
            id: 'c1',
            text: 'Eine Stornierung ist möglich, solange die Bestellung noch nicht versandt wurde. [1]',
            note: 'Gedeckt: [1] sagt genau das.',
          },
          {
            id: 'c2',
            text: 'Nach Versand gilt ein Rückgaberecht von 14 Tagen ab Erhalt. [2]',
            note: 'Gedeckt: steht wörtlich in [2].',
          },
          {
            id: 'c3',
            text: 'Die Erstattung erfolgt innerhalb von 5 Werktagen. [2]',
            isAttack: true,
            note: 'Das ist der ungestützte Claim: [2] nennt KEINE Frist — nur „nach Eingang der Rücksendung bearbeitet". „5 Werktage" klingt plausibel und ist trotzdem erfunden. Die Zitat-Marke [2] täuscht Deckung nur vor.',
          },
        ],
        takeaway: 'Grounding prüft Deckung durch die Quelle, nicht Plausibilität. Eine erfundene, plausibel klingende Zahl mit einer Pseudo-Zitatmarke ist der häufigste Halluzinations-Typ.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'grounded-vs-correct',
        format: 'pick',
        stem: 'Eine Antwort behauptet etwas, das in der Realität zutrifft — aber der abgerufene Kontext enthält diese Information nirgends. Wie wertet ein Faithfulness-Eval das?',
        options: [
          {
            id: 'mark-ungrounded',
            text: 'Als ungestützt markieren — die Aussage wird von der bereitgestellten Evidenz nicht getragen, auch wenn sie zufällig stimmt.',
            correct: true,
            why: 'Genau die Trennung, um die es geht: Faithfulness misst Deckung durch den Kontext, nicht Weltwissen. „Zufällig richtig" ist trotzdem ein Grounding-Fehler — dasselbe Modell liegt morgen bei einer ähnlichen Frage daneben, ohne dass der Eval anschlägt.',
          },
          {
            id: 'let-pass',
            text: 'Durchgehen lassen — die Aussage ist ja wahr.',
            correct: false,
            why: 'Das verwechselt Wahrheit mit Grounding. Wenn du „aus dem Modellwissen zufällig richtig" belohnst, lobst du Glück und kannst den Tag, an dem es kippt, nicht messen.',
          },
          {
            id: 'measure-relevance',
            text: 'Stattdessen die Antwort-Relevanz zur Frage messen.',
            correct: false,
            why: 'Andere Achse. Relevanz sagt, ob die Antwort zur Frage passt — nicht, ob sie durch die Evidenz gedeckt ist. Beides brauchst du, aber das eine ersetzt das andere nicht.',
          },
          {
            id: 'embedding-sim',
            text: 'Per Embedding-Ähnlichkeit zwischen Antwort und Frage bewerten.',
            correct: false,
            why: 'Misst Themennähe, nicht Deckung. Eine flüssige Halluzination liegt semantisch nah an der Frage und bestünde diesen Test mühelos.',
          },
        ],
        takeaway: '„Korrekt" und „gestützt" sind zwei Achsen. Ein Faithfulness-Eval prüft nur, ob die Evidenz die Aussage trägt — sonst misst du am Ende Glück.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'supported-set',
        format: 'multi',
        stem: 'Kontext: „Der Premium-Plan kostet 20 €/Monat und enthält Priority-Support. Ein Downgrade ist jederzeit zum Monatsende möglich. Jahres-Abos erhalten zwei Gratismonate." Welche Aussagen der Antwort sind durch diesen Kontext gedeckt?',
        options: [
          {
            id: 's-price',
            text: 'Premium kostet 20 € pro Monat.',
            correct: true,
            why: 'Wörtlich gedeckt.',
          },
          {
            id: 's-support',
            text: 'Premium beinhaltet bevorzugten Support.',
            correct: true,
            why: 'Gedeckt — „bevorzugter Support" ist eine Paraphrase von „Priority-Support". Grounding zählt Bedeutung, nicht Wortgleichheit; ein reiner Keyword-Abgleich würde das fälschlich verwerfen.',
          },
          {
            id: 's-downgrade',
            text: 'Ein Downgrade ist nur zum Jahresende möglich.',
            correct: false,
            why: 'Widersprochen: der Kontext sagt „jederzeit zum Monatsende". Gefährlicher als eine freie Erfindung, weil dieselben Wörter („Downgrade") echte Deckung vortäuschen.',
          },
          {
            id: 's-freemonths',
            text: 'Jahres-Abos bekommen zwei kostenlose Monate.',
            correct: true,
            why: 'Gedeckt — direkte Wiedergabe von „zwei Gratismonate".',
          },
          {
            id: 's-api',
            text: 'Premium enthält ein API-Kontingent.',
            correct: false,
            why: 'Der Kontext schweigt dazu. Stille ist keine Deckung — fehlende Evidenz heißt ungestützt, nicht „wahrscheinlich schon".',
          },
        ],
        takeaway: 'Atomar zerlegen und jede Aussage einzeln gegen die Quelle halten: Paraphrasen zählen als gedeckt, Widersprüche und Schweigen nicht — auch wenn die Wörter überlappen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'eval-method',
        format: 'pick',
        stem: 'Du willst diesen Grounding-Check über tausende Antworten automatisieren. Welche Methode misst tatsächlich Deckung durch die Quelle?',
        options: [
          {
            id: 'atomic-nli',
            text: 'Die Antwort in atomare Aussagen zerlegen und jede per NLI/LLM-Judge gegen den abgerufenen Kontext auf „entailed / contradicted / neutral" prüfen.',
            correct: true,
            why: 'Das misst Deckung pro Aussage — genau die Einheit, in der Halluzinationen auftreten. Paraphrasen bestehen, Widersprüche und unbelegte Zusätze fallen durch.',
          },
          {
            id: 'embedding-threshold',
            text: 'Die Embedding-Ähnlichkeit zwischen ganzer Antwort und ganzem Kontext über einen Schwellwert prüfen.',
            correct: false,
            why: 'Misst Themennähe, nicht Deckung. Eine fließende Halluzination zum selben Thema ist semantisch nah und rutscht über den Schwellwert.',
          },
          {
            id: 'exact-match',
            text: 'Die Antwort per Exact-/Keyword-Match gegen die Quelltexte abgleichen.',
            correct: false,
            why: 'Bestraft korrekte Paraphrasen („bevorzugter Support") und übersieht widersprochene Zahlen, die zufällig dieselben Wörter teilen. Oberfläche statt Bedeutung.',
          },
          {
            id: 'sample-1pct',
            text: 'Eine menschliche 1-%-Stichprobe als laufendes Gate genügt.',
            correct: false,
            why: 'Eine Stichprobe findet die seltenen, gefährlichen Fälle nicht zuverlässig. Menschen-Labels sind zum Kalibrieren des Judges gold wert — als alleiniges Gate über tausende Antworten aber zu grobmaschig.',
          },
        ],
        takeaway: 'Grounding misst man pro Aussage als Entailment gegen die Evidenz — nicht per Oberflächen- oder Themen-Ähnlichkeit. Sonst gewinnt die flüssigste Halluzination.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'cross-source',
        format: 'contradiction',
        stem: 'Quelle A ist der abgerufene Kontext, Quelle B die Antwort des Modells. Tippe die Zeile in A und die Zeile in B, die sich widersprechen.',
        sourceA: [
          { id: 'a1', text: 'Das Enterprise-Paket umfasst SSO, 99,9 % SLA und bis zu 50 Sitze.' },
          { id: 'a2', text: 'Support: E-Mail, Antwort unter 24 h.' },
          { id: 'a3', text: 'Preis Enterprise: auf Anfrage — kein öffentlicher Preis.' },
        ],
        sourceB: [
          { id: 'b1', text: 'Das Enterprise-Paket bietet Single-Sign-On und 99,9 % SLA.' },
          { id: 'b2', text: 'Es sind bis zu 50 Sitze enthalten.' },
          { id: 'b3', text: 'Der Support antwortet innerhalb von 24 Stunden.' },
          { id: 'b4', text: 'Der Preis liegt bei 499 € pro Monat.' },
        ],
        conflict: { a: 'a3', b: 'b4' },
        why: 'Quelle A sagt „auf Anfrage, kein öffentlicher Preis" — B erfindet 499 €. Das ist die klassische RAG-Halluzination: eine konkrete, plausible Zahl ohne Deckung. b1–b3 sind dagegen alle durch A gestützt (SSO, SLA, Sitze, < 24 h).',
        takeaway: 'Treue heißt: jede Aussage folgt aus dem Kontext. Eine erfundene Zahl ist ungestützt, auch wenn der Rest der Antwort stimmt.',
      },
    },
  ],
}
