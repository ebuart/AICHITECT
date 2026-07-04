import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-05-05 · post-template redesign, HARD. Paper-figure-decoder: bespoke puzzle exercises
// (categorize · pick). Visual document retrieval (embed page images) wins when meaning lives in
// LAYOUT — tables, charts, forms — that OCR-then-text mangles; plain prose doesn't need it.
export const paperVisualRetrieval: Lesson = {
  id: 'LESSON-05-05',
  roadmapNodeId: 'NODE-05-05',
  conceptIds: ['CONCEPT-RET-008', 'CONCEPT-RET-009'],
  prerequisites: ['NODE-05-04'],
  title: 'Visual Document Retrieval',
  estimatedMinutes: 7,
  lessonMode: 'paper-figure-decoder',
  learningGoal: 'Erkennen, wann Page-Image-Retrieval Text/OCR auf visuell-reichen Dokumenten schlägt.',
  interactionType: 'paper-figure-decoder',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-VISUAL-RETRIEVAL-FIT',
  reviewHooks: ['CONCEPT-RET-008', 'visual_retrieval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Visual vs. Text-Retrieval',
      text: 'Visual Document Retrieval bettet die Seiten als Bild ein und sucht über Layout + Text gemeinsam. Es lohnt sich, wenn die Bedeutung im visuellen Aufbau steckt (Tabellen, Diagramme, Formulare), den OCR-zu-Text zerstört — bei reinem Fließtext ist es Overkill.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'visual-or-text',
        format: 'categorize',
        stem: 'Welche Anfrage/Dokument braucht Visual Retrieval — und wo reicht Text-Retrieval?',
        buckets: [
          { id: 'visual', label: 'Visual Retrieval' },
          { id: 'text', label: 'Text reicht' },
        ],
        items: [
          { id: 'v-table', text: 'Eine Zahl aus einer komplexen Tabelle mit verbundenen Zellen', bucketId: 'visual', why: 'OCR zerreißt Tabellen-Layout; die Zuordnung Zeile/Spalte steckt im visuellen Aufbau.' },
          { id: 'v-para', text: 'Ein Fakt aus einem normalen Fließtext-Absatz', bucketId: 'text', why: 'Reiner Text — Text-Retrieval ist einfacher und genauso gut.' },
          { id: 'v-chart', text: '„Welches Diagramm zeigt den Umsatzknick im Q3?"', bucketId: 'visual', why: 'Die Information ist eine Grafik — ohne das Bild gibt es nichts zu matchen.' },
          { id: 'v-glossary', text: 'Die Definition eines Begriffs aus einem Glossar', bucketId: 'text', why: 'Strukturierter Text; ein Bild-Embedding bringt keinen Mehrwert.' },
          { id: 'v-form', text: 'Ein gescanntes Formular mit Ankreuzfeldern und Layout', bucketId: 'visual', why: 'Welches Feld angekreuzt ist, ergibt sich aus der Position — Layout-Information.' },
          { id: 'v-md', text: 'Ein Markdown-Dokument mit klarer Überschriftenstruktur', bucketId: 'text', why: 'Schon maschinenlesbarer Text mit Struktur — kein Bild nötig.' },
        ],
        takeaway: 'Visual Retrieval, wenn die Bedeutung im Layout steckt (Tabellen, Charts, Formulare); Text-Retrieval, wenn der Inhalt ohnehin sauberer Text ist.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'visual-when',
        format: 'pick',
        stem: 'Wann schlägt Page-Image-Retrieval die Pipeline „erst OCR, dann Text-Embedding"?',
        options: [
          {
            id: 'layout',
            text: 'Wenn die Bedeutung im visuellen Aufbau steckt (Tabellen, Diagramme, Formulare), den OCR-zu-Text zerstört.',
            correct: true,
            why: 'OCR linearisiert die Seite und verliert die räumliche Struktur; das Page-Image bewahrt sie und macht sie durchsuchbar.',
          },
          {
            id: 'always',
            text: 'Immer — Page-Image ist generell genauer.',
            correct: false,
            why: 'Bei sauberem Fließtext bringt es kaum etwas und kostet mehr Speicher/Compute. „Immer" ist Over-Engineering.',
          },
          {
            id: 'speed',
            text: 'Weil es schneller ist als OCR.',
            correct: false,
            why: 'Geschwindigkeit ist nicht der Punkt — und Bild-Embeddings sind nicht automatisch schneller. Es geht um erhaltene Layout-Information.',
          },
          {
            id: 'language',
            text: 'Weil es mehr Sprachen abdeckt.',
            correct: false,
            why: 'Sprachabdeckung hängt am Modell, nicht am Bild-vs-Text-Ansatz; der Vorteil ist das Layout.',
          },
        ],
        takeaway: 'Page-Image-Retrieval gewinnt genau dort, wo Layout Bedeutung trägt und OCR es zerstören würde — nicht pauschal.',
      },
    },
  ],
}
