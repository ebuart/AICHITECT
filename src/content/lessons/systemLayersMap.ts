import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-03 · post-template redesign, HARD. Bespoke puzzle exercises (match · pick). AI-native
// systems are layered; every failure has an origin layer. The durable skill is fixing it at the
// right layer instead of patching every symptom with a prompt tweak.
export const systemLayersMap: Lesson = {
  id: 'LESSON-01-03',
  roadmapNodeId: 'NODE-01-03',
  conceptIds: ['CONCEPT-AIE-003'],
  prerequisites: ['NODE-01-02'],
  title: 'System Layers Map',
  estimatedMinutes: 7,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Verantwortung und Fehler der richtigen System-Ebene zuordnen.',
  interactionType: 'layer-stack-builder',
  visualModelId: 'layerStack-8',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-AIE-003'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'System-Ebenen',
      text: 'Ein AI-System besteht aus Ebenen, jede mit eigener Verantwortung. Wer jeden Fehler mit einem Prompt-Tweak „repariert", behandelt Symptome auf der falschen Ebene.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'layer-roles',
        format: 'match',
        stem: 'Ordne jeder Ebene ihre Verantwortung zu.',
        pairs: [
          { id: 'model', left: 'Modell-Ebene', right: 'Erzeugt Tokens — Reasoning und Sprache', why: 'Das rohe Sprachmodell; weiß nur, was im Training war.' },
          { id: 'context', left: 'Context-Ebene', right: 'Stellt zusammen, was das Modell pro Aufruf sieht (inkl. Retrieval)', why: 'Entscheidet über die Evidenz — die häufigste echte Fehlerquelle.' },
          { id: 'tool', left: 'Tool-Ebene', right: 'Lässt das Modell handeln und exakt rechnen', why: 'Aktionen und Präzision, die das Modell selbst nicht leisten kann.' },
          { id: 'control', left: 'Kontroll-Fluss', right: 'Bestimmt, welcher Schritt wann läuft (Workflow/Agent)', why: 'Die Orchestrierung über den einzelnen Aufruf hinaus.' },
          { id: 'eval', left: 'Eval / Observability', right: 'Misst Qualität und macht Verhalten nachvollziehbar', why: 'Ohne sie ist jeder Fehler ein Ratespiel.' },
        ],
        takeaway: 'Modell rechnet, Context versorgt mit Evidenz, Tools handeln, Kontroll-Fluss orchestriert, Eval/Observability misst — jede Ebene ein eigener Hebel.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'which-layer',
        format: 'pick',
        stem: 'Der Agent antwortet mit Fakten, die seit Monaten veraltet sind. Auf welcher Ebene liegt die Ursache — und damit der Fix?',
        options: [
          {
            id: 'context',
            text: 'Context-/Retrieval-Ebene: die aktuelle Evidenz wird gar nicht erst in den Context geholt.',
            correct: true,
            why: 'Das Modell kann nur wiedergeben, was es sieht. Fehlt die frische Quelle, ist es ein Versorgungsproblem der Context-Ebene.',
          },
          {
            id: 'model',
            text: 'Modell-Ebene: das Modell ist zu schwach und muss ausgetauscht werden.',
            correct: false,
            why: 'Kein Modell kennt die Fakten von diesem Monat — Aktualität kommt über Retrieval, nicht über Modellstärke.',
          },
          {
            id: 'prompt',
            text: 'Prompt-Ebene: man muss „nenne aktuelle Fakten" deutlicher schreiben.',
            correct: false,
            why: 'Eine Anweisung erzeugt keine Fakten. Ohne die echten Daten im Context bleibt es falsch.',
          },
          {
            id: 'eval',
            text: 'Eval-Ebene: man braucht einfach mehr Tests.',
            correct: false,
            why: 'Evals würden den Fehler AUFDECKEN, aber nicht beheben — der Fix sitzt in der Context-Versorgung.',
          },
        ],
        takeaway: 'Diagnostiziere auf der Ursachen-Ebene: veraltete Fakten sind ein Context-/Retrieval-Problem, kein Modell- oder Prompt-Problem.',
      },
    },
  ],
}
