import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-04-04 · post-template redesign, HARD. Bespoke puzzle exercises (annotate · pick). Play
// the EVALUATOR: read a long draft answer and find the red flags an optimizer must fix. The
// `annotate` legend teaches WHICH tells to look for; the durable skill is reading model output
// critically (fabricated precision, ungrounded causation, unrequested actions, hidden hedging).
export const evaluatorOptimizer: Lesson = {
  id: 'LESSON-04-04',
  roadmapNodeId: 'NODE-04-04',
  conceptIds: ['CONCEPT-CF-006'],
  prerequisites: ['NODE-04-03'],
  title: 'Evaluator-Optimizer',
  estimatedMinutes: 8,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Den Output eines Generators kritisch lesen — die Tells finden, die ein Optimizer fixen muss.',
  interactionType: 'eval-designer',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-NO-EVAL',
  reviewHooks: ['CONCEPT-CF-006', 'CONCEPT-EVAL-001'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Evaluator-Optimizer',
      text: 'Ein Generator-Evaluator-Loop verbessert Output iterativ — der Evaluator markiert Schwächen, der Optimizer überarbeitet. Hier bist du der Evaluator: lies die Antwort und finde die Stellen, die geändert gehören.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'review-answer',
        format: 'annotate',
        stem: 'Ein Agent beantwortet „Analysiere den Q3-Umsatz und schlage Maßnahmen vor". Tippe jede Stelle an, die ein Red Flag ist.',
        legend: [
          { label: 'Erfundene Präzision', hint: 'zu exakte Zahlen ohne erkennbare Quelle/Rechnung' },
          { label: 'Ungestützte Kausalität', hint: 'Korrelation als Ursache ausgegeben, ohne Beleg' },
          { label: 'Ungefragte/riskante Aktion', hint: 'der Agent tut etwas Destruktives, das niemand verlangt hat' },
          { label: 'Verstecktes Hedging', hint: '„sollte/wahrscheinlich" tarnt fehlende Evidenz als sanfte Sicherheit' },
          { label: 'Schmeichelei/Füllwort', hint: 'Höflichkeitsfloskel ohne Informationswert' },
        ],
        segments: [
          { id: 'g1', text: 'Gerne, sehr gute Frage!', flag: { category: 'Schmeichelei/Füllwort', why: 'Trägt keine Information und kaschiert oft Unsicherheit.', fix: 'Direkt mit der Analyse beginnen.' } },
          { id: 'g2', text: 'Der Q3-Umsatz lag laut CRM-Export vom 1. Oktober bei 1,24 Mio €.' },
          { id: 'g3', text: 'Das sind exakt 18,7 % mehr als Q2.', flag: { category: 'Erfundene Präzision', why: 'Eine Nachkommastelle ohne gezeigte Rechnung wirkt belegt, ist es aber nicht.', fix: 'Die Rechnung zeigen oder runden und die Quelle nennen.' } },
          { id: 'g4', text: 'Der Anstieg kommt klar von der neuen Kampagne.', flag: { category: 'Ungestützte Kausalität', why: 'Zeitliche Nähe ist keine Ursache — Saison, Preis, Bestand könnten es genauso sein.', fix: 'Als Hypothese kennzeichnen und einen Test/Beleg nennen.' } },
          { id: 'g5', text: 'Ich habe die alten Q2-Rohdaten gelöscht, um Platz zu schaffen.', flag: { category: 'Ungefragte/riskante Aktion', why: 'Eine destruktive, nicht beauftragte Handlung — Datenverlust ohne Rückfrage.', fix: 'Niemals ungefragt löschen; nachfragen oder ein Backup behalten.' } },
          { id: 'g6', text: 'Für Q4 empfehle ich, das Kampagnenbudget moderat zu erhöhen.' },
          { id: 'g7', text: 'Das sollte den Umsatz wahrscheinlich weiter steigern.', flag: { category: 'Verstecktes Hedging', why: '„sollte/wahrscheinlich" gibt vor sicher zu sein, ohne Evidenz zu liefern.', fix: 'Die Unsicherheit beziffern oder einen A/B-Test vorschlagen.' } },
          { id: 'g8', text: 'Wenn du möchtest, erstelle ich dazu ein kurzes Dashboard.' },
        ],
        takeaway: 'Lange Antworten klingen souverän und schmuggeln dabei Tells durch: erfundene Präzision, Korrelation-als-Ursache, ungefragte Aktionen, getarntes Hedging. Genau das markiert ein guter Evaluator.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'evaluator-core',
        format: 'pick',
        stem: 'Damit der Optimizer die Antwort wirklich besser macht, woran muss der Evaluator sie messen?',
        options: [
          {
            id: 'criteria',
            text: 'An expliziten, prüfbaren Kriterien (gestützt durch Daten, keine ungefragten Aktionen, Unsicherheit beziffert).',
            correct: true,
            why: 'Der Loop klettert genau in die Richtung, die der Evaluator misst. Konkrete Kriterien lenken ihn auf echte Qualität.',
          },
          {
            id: 'length',
            text: 'An der Länge und Ausführlichkeit der Antwort.',
            correct: false,
            why: 'Länge ist ein Proxy, den der Optimizer trivial maximiert — er produziert mehr Text, nicht mehr Wahrheit.',
          },
          {
            id: 'confidence',
            text: 'Am Selbstbewusstsein des Tons — sicher klingende Antworten sind besser.',
            correct: false,
            why: 'Genau das belohnt die gefährlichen Tells (erfundene Präzision, getarntes Hedging). Ton ist kein Qualitätsmaß.',
          },
          {
            id: 'self',
            text: 'An der Selbsteinschätzung des Generators — er soll sich selbst benoten.',
            correct: false,
            why: 'Ohne externe, prüfbare Kriterien benotet sich das Modell wohlwollend; der Loop dreht sich um sich selbst.',
          },
        ],
        takeaway: 'Ein Evaluator-Loop ist nur so gut wie seine Kriterien — explizit und prüfbar, nicht Länge, Ton oder Selbstlob.',
      },
    },
  ],
}
