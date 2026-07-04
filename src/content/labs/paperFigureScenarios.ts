import type { LabScenario } from '@/features/labs/interactionModel'
import type { FigureScenarioData } from '@/features/labs/paperFigureDecoder/types'

// Paper Figure Decoder scenarios (PHASE_6, PH-701/PH-702, SRC-COLPALI). Base figure:
// page-image retrieval beats text/OCR on visually-rich docs → use it there. Transfer
// figure: on plain text it gives no gain and costs more → keep text retrieval. The
// pair teaches a CONDITIONAL decision, not "frontier method = always better" (PH-705).
export const paperFigureScenarios: LabScenario<FigureScenarioData>[] = [
  {
    id: 'PFD-BASE',
    interactionType: 'paper-figure-decoder',
    labId: 'LAB-PAPER-FIGURE-DECODER',
    roadmapNodeId: 'NODE-05-05',
    title: 'Paper Figure Decoder',
    prompt:
      'Lies die Figure: was zeigt sie unter welchen Bedingungen, und welche Architektur-Entscheidung stützt sie?',
    concepts: ['CONCEPT-RET-008'],
    prerequisites: ['NODE-05-04'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'pfd-default',
    feedbackProfileId: 'pfd-default',
    reviewHooks: ['visual_retrieval_transfer'],
    scenarioData: {
      source: 'Visuelles Retrieval-Benchmark auf visuell-reichen PDFs (Charts, Tabellen, gescannte Seiten).',
      caption: 'Retrieval-Genauigkeit auf visuell-reichen Dokumenten: Page-Image vs Text/OCR.',
      bars: [
        { id: 'page-image', label: 'Page-Image-Retrieval', value: 78, max: 100 },
        { id: 'text-ocr', label: 'Text/OCR-Retrieval', value: 41, max: 100 },
      ],
      stations: [
        {
          id: 'reading',
          dimension: 'figure_reading_fit',
          label: 'Figure lesen',
          question: 'Was zeigt die Figure?',
          bestOptionId: 'visual-wins',
          options: [
            { id: 'visual-wins', label: 'Auf visuell-reichen Docs schlägt Page-Image Text/OCR deutlich', rationale: 'Passt: genau die Bedingung der Figure (Charts/Tabellen/Scans).' },
            { id: 'always-visual', label: 'Page-Image-Retrieval ist immer besser', rationale: 'Übergeneralisiert: die Figure misst nur visuell-reiche Docs.' },
            { id: 'text-broken', label: 'Text-Retrieval ist generell kaputt', rationale: 'Falsch gelesen: Text verliert hier nur die visuelle Struktur, nicht überall.' },
          ],
        },
        {
          id: 'decision',
          dimension: 'decision_fit',
          label: 'Entscheidung ableiten',
          question: 'Welche Architektur-Entscheidung stützt das?',
          bestOptionId: 'visual-for-visual',
          options: [
            { id: 'visual-for-visual', label: 'Für layout-/tabellen-/figure-lastige Docs Page-Image-Retrieval einsetzen', rationale: 'Passt: gezielt dort, wo visuelle Struktur die Evidenz trägt.' },
            { id: 'replace-all', label: 'Text-Retrieval überall durch Page-Image ersetzen', rationale: 'Falle: teurer/komplexer, wo kein visueller Vorteil besteht.' },
            { id: 'better-ocr', label: 'Lieber in besseres OCR investieren', rationale: 'Falle: schärferes OCR liefert mehr Text, aber nicht die Layout-/Tabellenstruktur, die Page-Image hier gewinnt.' },
          ],
        },
      ],
    },
  },
  {
    id: 'PFD-TRANSFER',
    interactionType: 'paper-figure-decoder',
    labId: 'LAB-PAPER-FIGURE-DECODER',
    roadmapNodeId: 'NODE-05-05',
    title: 'Paper Figure Decoder — Transfer: Plain Text',
    prompt:
      'Andere Figure, gleiche Methode: lies das Ergebnis und entscheide, ob sich Page-Image hier lohnt.',
    concepts: ['CONCEPT-RET-008', 'CONCEPT-RET-009'],
    prerequisites: ['NODE-05-04'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: true,
    scoringProfileId: 'pfd-default',
    feedbackProfileId: 'pfd-default',
    reviewHooks: ['visual_retrieval_transfer', 'retrieval_method_transfer'],
    scenarioData: {
      source: 'Retrieval-Benchmark auf reinem Fließtext (Artikel ohne Layout/Figures). Page-Image kostet ~3× mehr Compute/Query.',
      caption: 'Genauigkeit auf reinem Text: Text vs Page-Image (bei höheren Kosten für Page-Image).',
      bars: [
        { id: 'text', label: 'Text-Retrieval', value: 88, max: 100 },
        { id: 'page-image', label: 'Page-Image-Retrieval', value: 84, max: 100 },
      ],
      stations: [
        {
          id: 'reading',
          dimension: 'figure_reading_fit',
          label: 'Figure lesen',
          question: 'Was zeigt die Figure?',
          bestOptionId: 'text-equal-cheaper',
          options: [
            { id: 'text-equal-cheaper', label: 'Auf reinem Text bringt Page-Image keinen Genauigkeitsvorteil und kostet mehr', rationale: 'Passt: Text ist hier minimal besser und deutlich günstiger.' },
            { id: 'visual-still-better', label: 'Page-Image ist auch hier klar überlegen', rationale: 'Falsch gelesen: die Balken sind nahezu gleich, Page-Image kostet mehr.' },
            { id: 'identical', label: 'Beide sind in jeder Hinsicht identisch', rationale: 'Unvollständig: gleiche Genauigkeit, aber unterschiedliche Kosten.' },
          ],
        },
        {
          id: 'decision',
          dimension: 'decision_fit',
          label: 'Entscheidung ableiten',
          question: 'Welche Architektur-Entscheidung stützt das?',
          bestOptionId: 'keep-text',
          options: [
            { id: 'keep-text', label: 'Für reinen Text Text-Retrieval behalten; Page-Image nur bei visueller Information', rationale: 'Passt: einfachste tragfähige Methode, Page-Image gezielt einsetzen.' },
            { id: 'use-visual-anyway', label: 'Trotzdem überall auf Page-Image umstellen', rationale: 'Falle: höhere Kosten ohne Genauigkeitsgewinn.' },
            { id: 'hybrid-both', label: 'Beide Methoden kombinieren (Hybrid), um sicherzugehen', rationale: 'Über-Engineering: verdoppelt die Kosten ohne Genauigkeitsgewinn auf reinem Text.' },
          ],
        },
      ],
    },
  },
]
