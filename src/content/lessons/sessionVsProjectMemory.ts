import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-06-01 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). The
// durable skill: tell ephemeral SESSION context from durable, file-based PROJECT memory (and
// what to drop entirely). Anything that must stay true across sessions — decisions, conventions,
// open questions — belongs in project memory, not the chat scrollback.
export const sessionVsProjectMemory: Lesson = {
  id: 'LESSON-06-01',
  roadmapNodeId: 'NODE-06-01',
  conceptIds: ['CONCEPT-MEM-001', 'CONCEPT-MEM-002'],
  prerequisites: ['NODE-05-05'],
  title: 'Session vs Project Memory',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Ephemeren Session-Context von durable, datei-basiertem Project Memory trennen.',
  interactionType: 'repo-refactor-lab',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-CHAT-MEMORY-ONLY',
  reviewHooks: ['CONCEPT-MEM-002', 'source_material_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Session vs. Projekt',
      text: 'Session-Memory ist der flüchtige Arbeitskontext eines Laufs (Chatverlauf, Zwischenschritte). Project-Memory ist durable und datei-basiert: alles, was über einen einzelnen Lauf hinaus wahr bleiben muss — Entscheidungen, Conventions, offene Fragen. Was keins von beidem braucht, wird verworfen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'place-memory',
        format: 'categorize',
        stem: 'Wohin gehört jede Information?',
        buckets: [
          { id: 'session', label: 'Session' },
          { id: 'project', label: 'Projekt' },
          { id: 'drop', label: 'Verwerfen' },
        ],
        items: [
          { id: 'm-step', text: 'Der aktuelle Teilschritt im laufenden Task', bucketId: 'session', why: 'Nur für diesen Lauf relevant — flüchtiger Arbeitskontext.' },
          { id: 'm-decision', text: 'Eine getroffene Architektur-Entscheidung samt Begründung', bucketId: 'project', why: 'Muss über Sessions hinweg überleben — gehört ins Decision Log (durable).' },
          { id: 'm-rawtool', text: 'Roher Tool-Output, der bereits zusammengefasst wurde', bucketId: 'drop', why: 'Im Ergebnis aufgehoben; roh weiter mitzuschleppen ist nur Rauschen im Context.' },
          { id: 'm-conv', text: 'Die Coding-Conventions des Repos', bucketId: 'project', why: 'Dauerhaft gültig für jede künftige Session — first-party, versioniert.' },
          { id: 'm-recent', text: 'Was der Nutzer vor zwei Minuten in diesem Chat sagte', bucketId: 'session', why: 'Kurzfristiger Kontext dieses Laufs; nicht jede Chatzeile ist durable.' },
          { id: 'm-debug', text: 'Ein einmaliger Stacktrace einer inzwischen gefixten Exception', bucketId: 'drop', why: 'Nach dem Fix wertlos — kein Langzeitgedächtnis damit zumüllen.' },
          { id: 'm-openq', text: 'Eine noch ungeklärte offene Frage zum Projekt', bucketId: 'project', why: 'Muss über Sessions sichtbar bleiben (Open Questions), sonst wird sie ewig neu „entdeckt".' },
        ],
        takeaway: 'Faustregel: „Muss das in einer frischen Session noch stimmen?" → Projekt. „Nur jetzt?" → Session. „Gar nicht mehr?" → verwerfen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'memory-principle',
        format: 'pick',
        stem: 'Ein Agent-Projekt „vergisst" über Wochen ständig frühere Entscheidungen und entdeckt dieselben Constraints neu. Was ist die Ursache?',
        options: [
          {
            id: 'no-project',
            text: 'Durable Erkenntnisse leben nur im Chatverlauf statt in datei-basiertem Project-Memory — mit der Session sind sie weg.',
            correct: true,
            why: 'Der Chatverlauf ist Session-Memory: er endet mit dem Lauf. Was bleiben soll, muss in Dateien (Decision Log, Conventions, Open Questions) festgehalten werden.',
          },
          {
            id: 'context-small',
            text: 'Das Context-Fenster ist zu klein, um die ganze Historie zu halten.',
            correct: false,
            why: 'Selbst ein riesiges Fenster endet mit der Session. Das Problem ist nicht die Größe, sondern dass nichts durable persistiert wird.',
          },
          {
            id: 'more-history',
            text: 'Man sollte einfach den kompletten alten Chatverlauf in jede neue Session laden.',
            correct: false,
            why: 'Das bläht den Context mit Rauschen auf und skaliert nicht. Gebraucht wird die destillierte, durable Essenz — nicht das rohe Transkript.',
          },
          {
            id: 'model',
            text: 'Das Modell hat ein schlechtes Gedächtnis und sollte ausgetauscht werden.',
            correct: false,
            why: 'Kein Modell „erinnert" sich an eine vergangene Session — Persistenz ist eine Architektur-Aufgabe, kein Modell-Feature.',
          },
        ],
        takeaway: 'Gedächtnis über Sessions ist Architektur, nicht Modell: durable Erkenntnisse gehören in Dateien, nicht in den flüchtigen Chatverlauf.',
      },
    },
  ],
}
