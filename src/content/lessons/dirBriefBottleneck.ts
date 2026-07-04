import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-12-01 · DIRECTION track, post-template redesign. Bespoke puzzle exercises (annotate a
// weak brief · pick). Output quality tracks SPEC quality, not model choice — so the durable
// skill is reading a brief and seeing where it's vague, missing context, or has no testable
// "done". The annotate legend teaches exactly what a brief must carry.
export const dirBriefBottleneck: Lesson = {
  id: 'LESSON-12-01',
  roadmapNodeId: 'NODE-12-01',
  conceptIds: ['CONCEPT-DIR-005'],
  prerequisites: ['NODE-11-04'],
  title: 'The Brief Is the Bottleneck',
  estimatedMinutes: 7,
  lessonMode: 'trade-off-first',
  learningGoal: 'Einen Brief auf Lücken prüfen: Ziel, Kontext, Grenzen und ein prüfbares „fertig".',
  interactionType: 'trade-off-duel',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-DIR-005', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Nicht das Modell — dein Brief entscheidet',
      text: 'Bei einem starken Agenten liegt der Unterschied zwischen mittelmäßig und exzellent fast nur an deiner Spezifikation. Ein guter Brief nennt Ziel, Kontext und Grenzen und definiert prüfbar, was „fertig" heißt — den Weg lässt er offen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'weak-brief',
        format: 'annotate',
        stem: 'Dieser Brief geht an einen Agenten. Tippe jede Stelle an, die ihn vom Ziel abbringen wird.',
        legend: [
          { label: 'Kein Akzeptanzkriterium', hint: 'kein prüfbares „fertig"' },
          { label: 'Fehlender Kontext', hint: 'eine entscheidungsrelevante Tatsache fehlt oder wird weggewischt' },
          { label: 'Keine Grenzen', hint: 'der Agent darf alles anfassen' },
          { label: 'Vage/mehrdeutig', hint: 'nicht eindeutig umsetzbar' },
        ],
        segments: [
          { id: 'r1', text: 'Bau einen CSV-Export für die Bestellliste.' },
          { id: 'r2', text: 'Nimm einfach die üblichen Felder.', flag: { category: 'Vage/mehrdeutig', why: '„Üblich" ist nicht definiert — der Agent rät die Spalten.', fix: 'Die genauen Spalten auflisten.' } },
          { id: 'r3', text: 'Die Datei soll gut aussehen.', flag: { category: 'Kein Akzeptanzkriterium', why: '„Gut" ist nicht prüfbar — woran misst der Agent Erfolg?', fix: 'Messbares „fertig" angeben (valides CSV, definierte Spalten, Test grün).' } },
          { id: 'r4', text: 'Mach dir um die Datenmenge keine Gedanken.', flag: { category: 'Fehlender Kontext', why: 'Bei 1 Mio Zeilen muss gestreamt werden — das wegzuwischen produziert einen Export, der im Echtbetrieb kippt.', fix: 'Die erwartete Größenordnung nennen.' } },
          { id: 'r5', text: 'Bau es einfach so, wie du denkst.', flag: { category: 'Keine Grenzen', why: 'Ohne Grenzen fasst der Agent unbeteiligten Code an, wählt beliebige Libs — Scope-Creep ist programmiert.', fix: 'Sagen, was er anfassen darf und was nicht.' } },
          { id: 'r6', text: 'Fertig, wenn der Export eine valide CSV mit allen definierten Bestellspalten erzeugt und der bestehende Test grün bleibt.' },
        ],
        takeaway: 'Ein tragfähiger Brief nennt Ziel, fehlenden Kontext (Datenmenge!), klare Grenzen und ein prüfbares „fertig" — der Rest ist offen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'brief-bottleneck',
        format: 'pick',
        stem: 'Der Agent liefert wiederholt etwas am Ziel vorbei. Wo liegt der Engpass am wahrscheinlichsten?',
        options: [
          {
            id: 'spec',
            text: 'In deinem Brief: ein starker Agent baut genau das, was die Spec sagt — Mehrdeutigkeit und fehlende Kriterien erzeugen Output am Ziel vorbei.',
            correct: true,
            why: 'Bei guten Modellen ist die Spezifikation der limitierende Faktor, nicht das Modell. Schärfere Briefs heben die Qualität am meisten.',
          },
          {
            id: 'model',
            text: 'Am Modell — es ist zu schwach und sollte getauscht werden.',
            correct: false,
            why: 'Ein stärkeres Modell baut die unterspezifizierte Aufgabe nur souveräner falsch.',
          },
          {
            id: 'retry',
            text: 'Einfach öfter neu laufen lassen, bis es passt.',
            correct: false,
            why: 'Mehr Versuche auf demselben vagen Brief variieren nur das Danebenliegen — die Ursache bleibt.',
          },
          {
            id: 'more-tools',
            text: 'Dem Agenten mehr Tools geben.',
            correct: false,
            why: 'Tools lösen kein Spezifikationsproblem; ohne klares Ziel werden sie nur in die falsche Richtung benutzt.',
          },
        ],
        takeaway: 'Der Brief ist der Engpass: an der Spezifikation gewinnst du mehr Qualität als an jedem Modellwechsel.',
      },
    },
  ],
}
