import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-07-04 · post-template redesign, HARD. Bespoke puzzle exercises (multispot over a big
// ~18-line trace · pick). The durable skill is reading a real agent trace and seeing the
// observability/safety problems — high-value actions without a gate, blind retries that risk
// double execution, swallowed errors, redundant loops, no audit. Tells are NOT telegraphed.
export const tracesPostmortems: Lesson = {
  id: 'LESSON-07-04',
  roadmapNodeId: 'NODE-07-04',
  conceptIds: ['CONCEPT-OBS-001', 'CONCEPT-OBS-002'],
  prerequisites: ['NODE-07-03'],
  title: 'Traces and Postmortems',
  estimatedMinutes: 8,
  lessonMode: 'trace-first',
  learningGoal: 'Im Trace die Stellen finden, an denen Beobachtbarkeit und Sicherheit fehlen.',
  interactionType: 'system-postmortem',
  visualModelId: 'trace',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-OBS-001', 'CONCEPT-OBS-002', 'postmortem_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Trace lesen',
      text: 'Ein Agent hat eine Bestellung storniert und erstattet. Lies den vollständigen Ausführungs-Trace und finde jede Zeile, an der eine Kontrolle oder ein Log fehlt — bevor du eine durable Regel daraus machst.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'trace-redflags',
        format: 'multispot',
        stem: 'Tippe jede Zeile an, die ein Beobachtbarkeits- oder Sicherheitsproblem zeigt.',
        intro: 'Aufgabe des Agenten: „Storniere Bestellung #8842 und erstatte den Betrag."',
        lines: [
          { id: 'l01', text: '01  user: "Storniere #8842 und erstatte den Betrag"' },
          { id: 'l02', text: '02  plan: get_order → refund → notify' },
          { id: 'l03', text: '03  call get_order("#8842")' },
          { id: 'l04', text: '04  obs: { total: 2500.00, status: "shipped" }' },
          {
            id: 'l05',
            text: '05  call refund(order="#8842", amount=2500.00)',
            isAttack: true,
            note: '2 500 € werden vollautomatisch erstattet — eine teure, irreversible Aktion ohne Approval-Gate.',
          },
          { id: 'l06', text: '06  obs: ERROR timeout' },
          { id: 'l07', text: '07  call refund(order="#8842", amount=2500.00)' },
          { id: 'l08', text: '08  obs: ERROR timeout' },
          {
            id: 'l09',
            text: '09  call refund(order="#8842", amount=2500.00)',
            isAttack: true,
            note: 'Dritter identischer refund nach Timeouts — ohne Idempotenz-Key. Ein Timeout heißt nicht „fehlgeschlagen": die früheren Calls könnten durchgegangen sein → Mehrfach-Erstattung.',
          },
          { id: 'l10', text: '10  obs: { ok: true, refund_id: "rf_91" }' },
          {
            id: 'l11',
            text: '11  continue  (Fehler aus 06/08 nicht gemeldet)',
            isAttack: true,
            note: 'Die Timeout-Fehler werden verschluckt — kein Alert, kein Log. Niemand erfährt, dass refund dreimal lief.',
          },
          { id: 'l12', text: '12  call send_email(to=customer, body=<…>)' },
          { id: 'l13', text: '13  obs: ok' },
          { id: 'l14', text: '14  call get_order("#8842")' },
          { id: 'l15', text: '15  obs: { status: "refunded" }' },
          {
            id: 'l16',
            text: '16  call get_order("#8842")',
            isAttack: true,
            note: 'Identischer Call wie Zeile 14 ohne neuen Grund — eine redundante Schleife, die im Trace auf eine fehlende Stop-/Dedup-Logik hindeutet.',
          },
          { id: 'l17', text: '17  obs: { status: "refunded" }' },
          {
            id: 'l18',
            text: '18  done',
            isAttack: true,
            note: 'Kein finaler Status, kein Audit-Eintrag (wer, was, wie viel). Der wichtigste Vorgang — eine 2 500-€-Erstattung — hinterlässt keine Spur.',
          },
        ],
        takeaway: 'Im Trace zeigt sich Beobachtbarkeit an konkreten Stellen: gegatete High-Value-Aktionen, idempotente Retries, gemeldete Fehler, keine blinden Schleifen, ein Audit-Eintrag am Ende.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'retry-risk',
        format: 'pick',
        stem: 'refund wird nach zwei Timeouts ein drittes Mal aufgerufen und liefert dann „ok". Was ist das eigentliche Risiko?',
        options: [
          {
            id: 'double',
            text: 'Die ersten Aufrufe könnten erfolgreich gewesen sein (Timeout ≠ fehlgeschlagen) — ohne Idempotenz-Key wird mehrfach erstattet.',
            correct: true,
            why: 'Ein Timeout sagt nur „keine Antwort", nicht „nicht ausgeführt". Blinde Retries auf eine schreibende Aktion ohne Idempotenz-Key können den Effekt verdoppeln oder verdreifachen.',
          },
          {
            id: 'slow',
            text: 'Die Retries machen den Agenten langsam.',
            correct: false,
            why: 'Latenz ist hier nebensächlich; das Geld-Risiko der Mehrfach-Erstattung wiegt weit schwerer.',
          },
          {
            id: 'tokens',
            text: 'Jeder Retry verbraucht zusätzliche Tokens.',
            correct: false,
            why: 'Tool-Calls kosten kaum Tokens, und Kosten sind nicht der Punkt — die doppelte Auszahlung ist es.',
          },
          {
            id: 'none',
            text: 'Kein Risiko — am Ende kam ja „ok".',
            correct: false,
            why: 'Das „ok" gilt nur für den letzten Call. Über die ersten beiden weiß niemand etwas — genau das ist die Gefahr.',
          },
        ],
        takeaway: 'Retries auf schreibende Aktionen brauchen einen Idempotenz-Key — sonst macht ein Timeout aus einer Erstattung schnell zwei.',
      },
    },
  ],
}
