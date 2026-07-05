import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-01-01 · voice per control/10 VX rules (2026-07-05). Concept: each augmentation fixes
// ONE specific weakness of the raw model — and you only add what the requirement needs.
export const augmentedLlm: Lesson = {
  id: 'LESSON-01-01',
  roadmapNodeId: 'NODE-01-01',
  conceptIds: ['CONCEPT-AIE-002'],
  prerequisites: ['NODE-00-02'],
  title: 'Augmented LLM',
  estimatedMinutes: 6,
  lessonMode: 'architecture-builder',
  learningGoal: 'Jede Augmentierung der Schwäche zuordnen, die sie behebt. Und nur Nötiges anbauen.',
  interactionType: 'architecture-builder',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-002', 'overengineering_repair'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Was ein rohes Modell nicht kann',
      text: 'Ein LLM ohne alles kann genau eines: aus seinem Trainingsstand Text erzeugen. Es kennt keine internen Daten, kann nichts nachschlagen, nichts ausführen, vergisst nach der Session alles und liefert Prosa, wo das Backend JSON braucht. Für jede dieser Schwächen gibt es einen Anbau: Retrieval, Tools, Memory, strukturierte Ausgabe. Der Punkt dieser Lektion: Welcher Anbau behebt welche Schwäche. Denn jeder kostet Komplexität, und die falsche Wahl behebt nichts.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'augment-fixes',
        format: 'match',
        stem: 'Ordne jeden Anbau der Schwäche zu, die er tatsächlich behebt.',
        pairs: [
          { id: 'retrieval', left: 'Retrieval', right: 'Kennt interne Daten nicht / Wissen ist veraltet', why: 'Holt zur Antwortzeit die echten Dokumente ins Fenster. Das Modell liest sie dann, statt sich zu erinnern.' },
          { id: 'tools', left: 'Tools', right: 'Kann nichts ausführen und rechnet unzuverlässig', why: '58 × 47 schätzt ein LLM. calc(58*47) rechnet. Gleiches gilt für Kalender, Datenbank, Deployment.' },
          { id: 'memory', left: 'Memory', right: 'Nach der Session ist alles weg', why: 'Persistenz ist Architektur. Kein Modell „merkt sich" etwas zwischen zwei Läufen von allein.' },
          { id: 'structured', left: 'Strukturierte Ausgabe', right: 'Backend braucht JSON, bekommt Prosa', why: 'Erzwingt ein Schema beim Generieren. Der Parser hört auf, an Kommas zu sterben.' },
        ],
        takeaway: 'Vor jedem Anbau gehört die Schwäche in einen Satz. Lässt sie sich nicht benennen, ist der Anbau noch nicht nötig.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'augment-which',
        format: 'pick',
        stem: 'Anforderung aus dem Fachbereich: „Der Bot soll Fragen zu unseren Tarifen beantworten. Die ändern sich jeden Monat." Einer der vier Anbauten ist hier der entscheidende. Welcher?',
        options: [
          {
            id: 'retrieval',
            text: 'Retrieval: die aktuelle Tariftabelle zur Antwortzeit holen und dem Modell ins Fenster legen.',
            correct: true,
            why: 'Die Schwäche heißt „Wissen veraltet monatlich". Retrieval liest immer den heutigen Stand. Mehr braucht diese Anforderung nicht.',
          },
          {
            id: 'memory',
            text: 'Memory: sich die Tarife dauerhaft merken.',
            correct: false,
            why: 'Memory konserviert einen Stand. Konservieren ist bei monatlich wechselnden Zahlen das Problem, nicht die Lösung.',
          },
          {
            id: 'tools',
            text: 'Tools: eine Berechnungsfunktion anbinden.',
            correct: false,
            why: 'Hier rechnet niemand. Die Frage ist „was kostet Tarif M?", nicht „was ist 12 × 19,90?".',
          },
          {
            id: 'structured',
            text: 'Strukturierte Ausgabe: die Antwort als sauberes JSON liefern.',
            correct: false,
            why: 'Ein korrekt formatierter alter Preis ist ein alter Preis. Format behebt keine Wissenslücke.',
          },
        ],
        takeaway: 'Anforderung lesen, Schwäche benennen, den einen passenden Anbau wählen. Wer alle vier anbaut, „weil man sie halt braucht", wartet ab jetzt alle vier.',
      },
    },
  ],
}
