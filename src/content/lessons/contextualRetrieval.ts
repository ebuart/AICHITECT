import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-05-04 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). An
// isolated chunk with a dangling reference ("it rose 12%") is unfindable; contextual retrieval
// prepends a short context line before embedding so each chunk is self-describing. The durable
// skill: spot the chunks that lose their meaning when cut out of their document.
export const contextualRetrieval: Lesson = {
  id: 'LESSON-05-04',
  roadmapNodeId: 'NODE-05-04',
  conceptIds: ['CONCEPT-RET-007'],
  prerequisites: ['NODE-05-03'],
  title: 'Contextual Retrieval',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Chunks erkennen, die ohne Dokumentkontext unauffindbar werden — und sie eigenständig machen.',
  interactionType: 'retrieval-factory',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-RETRIEVAL-MISMATCH',
  reviewHooks: ['CONCEPT-RET-007', 'retrieval_method_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Contextual Retrieval',
      text: 'Beim Chunking verliert ein Stück seinen Dokumentkontext. „Es stieg um 12 %" ist allein unauffindbar — weder Firma noch Metrik noch Quartal stehen drin. Contextual Retrieval stellt jedem Chunk vor dem Embedding einen kurzen Kontext-Satz voran, sodass er eigenständig auffindbar wird.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'needs-context',
        format: 'categorize',
        stem: 'Welche Chunks brauchen einen vorangestellten Kontext-Satz, um auffindbar zu sein — welche stehen schon für sich?',
        buckets: [
          { id: 'context', label: 'Kontext voranstellen' },
          { id: 'self', label: 'Schon eigenständig' },
        ],
        items: [
          { id: 'r-it', text: '„Es stieg im dritten Quartal um 18 %."', bucketId: 'context', why: '„Es" ist eine hängende Referenz — ohne Firma/Metrik findet keine Query den Chunk.' },
          { id: 'r-warranty', text: '„Die Garantie auf das Modell X200 beträgt 24 Monate ab Kaufdatum."', bucketId: 'self', why: 'Enthält Subjekt, Metrik und Bedingung — eigenständig auffindbar.' },
          { id: 'r-above', text: '„Siehe oben für die vollständige Liste."', bucketId: 'context', why: '„Oben" zeigt auf etwas, das im Chunk fehlt — allein wertlos.' },
          { id: 'r-parse', text: '„parseInvoice() nutzt float und verliert Cents bei großen Beträgen."', bucketId: 'self', why: 'Benennt Funktion und Problem konkret — kein Kontext nötig.' },
          { id: 'r-except', text: '„Das gilt nicht für Bestellungen über 2 000 €."', bucketId: 'context', why: '„Das" referenziert eine Regel außerhalb des Chunks — die Ausnahme schwebt im Leeren.' },
          { id: 'r-price', text: '„Der Premium-Plan kostet 20 € pro Monat."', bucketId: 'self', why: 'Subjekt und Wert sind genannt — steht für sich.' },
        ],
        takeaway: 'Hängende Wörter („es", „das", „oben", „dieser") sind das Warnsignal: solche Chunks brauchen einen vorangestellten Kontext-Satz; konkret benannte stehen schon für sich.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'context-how',
        format: 'pick',
        stem: 'Wie machst du den Chunk „Es stieg um 18 %" zuverlässig auffindbar für die Query „ACME Q3 Umsatzwachstum"?',
        options: [
          {
            id: 'prepend',
            text: 'Vor dem Embedding einen Kontext-Satz voranstellen: „Aus ACMEs Q3-Bericht, Umsatz: Es stieg um 18 %."',
            correct: true,
            why: 'Jetzt enthält der Chunk Firma, Metrik und Quartal — die Query matcht ihn lexikalisch UND semantisch.',
          },
          {
            id: 'bigger-chunks',
            text: 'Einfach viel größere Chunks nehmen, dann ist der Kontext meist dabei.',
            correct: false,
            why: 'Große Chunks verwässern die Relevanz (mehr Rauschen pro Treffer) und garantieren den fehlenden Bezug trotzdem nicht.',
          },
          {
            id: 'rerank',
            text: 'Einen stärkeren Reranker nachschalten.',
            correct: false,
            why: 'Reranking ordnet nur, was die erste Stufe findet — einen Chunk ohne die Query-Begriffe holt es gar nicht erst.',
          },
          {
            id: 'embed-model',
            text: 'Ein besseres Embedding-Modell verwenden.',
            correct: false,
            why: 'Kein Embedding kann Firma/Quartal erfinden, die im Text fehlen — die Information muss in den Chunk, nicht ins Modell.',
          },
        ],
        takeaway: 'Fehlt der Bezug im Chunk, hilft kein besserer Retriever — der Kontext muss VOR dem Embedding hinein.',
      },
    },
  ],
}
