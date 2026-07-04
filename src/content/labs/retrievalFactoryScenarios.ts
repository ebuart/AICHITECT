import type { LabScenario } from '@/features/labs/interactionModel'
import type { RetrievalScenarioData } from '@/features/labs/retrievalFactory/types'

// Retrieval Factory scenarios (PHASE_6, PH-701). The base profile makes the
// SIMPLE pipeline correct (semantic, no rerank, no contextual); the transfer
// profile makes the FULL pipeline correct — so the lab teaches a fit decision,
// not "always add more" (PH-705).
export const retrievalFactoryScenarios: LabScenario<RetrievalScenarioData>[] = [
  {
    id: 'RF-BASE',
    interactionType: 'retrieval-factory',
    labId: 'LAB-RETRIEVAL-FACTORY',
    roadmapNodeId: 'NODE-05-01',
    title: 'Retrieval Factory',
    prompt:
      'Konfiguriere die Retrieval-Pipeline passend zum Korpus und zu den Queries — so einfach wie möglich, so komplex wie nötig.',
    concepts: ['CONCEPT-RET-001', 'CONCEPT-RET-002', 'CONCEPT-RET-003'],
    prerequisites: ['NODE-05-01'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'rf-default',
    feedbackProfileId: 'rf-default',
    reviewHooks: ['retrieval_method_transfer'],
    scenarioData: {
      corpusProfile:
        'Produkt-FAQ und Hilfe-Artikel. Jeder Artikel ist kurz, in sich geschlossen und trägt Titel + Kontext. Kleiner, sauberer Korpus.',
      queryProfile:
        'Natürliche Fragen in eigenen Worten („Wie kündige ich mein Abo?“). Keine exakten Codes, IDs oder Fehlermeldungen.',
      stations: [
        {
          id: 'method',
          dimension: 'method_fit',
          label: 'Retrieval-Methode',
          question: 'Wie suchst du in diesem Korpus?',
          bestOptionId: 'semantic',
          options: [
            { id: 'semantic', label: 'Semantic (Embeddings)', rationale: 'Passt: Bedeutungs-/Paraphrase-Queries ohne exakte Identifier.' },
            { id: 'lexical', label: 'Lexical (BM25)', rationale: 'Schwach hier: keine exakten Tokens zu matchen, Synonyme gehen verloren.' },
            { id: 'hybrid', label: 'Hybrid (semantic + lexical)', rationale: 'Überbaut: ohne exakte Identifier bringt die lexikalische Hälfte kaum Nutzen.' },
          ],
        },
        {
          id: 'reranking',
          dimension: 'reranking_fit',
          label: 'Reranking',
          question: 'Brauchst du eine zweite Ranking-Stufe?',
          bestOptionId: 'rerank-off',
          options: [
            { id: 'rerank-off', label: 'Kein Reranking', rationale: 'Passt: kleiner sauberer Korpus, die First-Stage-Top-k sind schon gut.' },
            { id: 'rerank-on', label: 'Reranking aktivieren', rationale: 'Overhead: zusätzliche Latenz/Kosten ohne nennenswerten Qualitätsgewinn.' },
          ],
        },
        {
          id: 'context',
          dimension: 'context_fit',
          label: 'Contextual Retrieval',
          question: 'Fügst du jedem Chunk Dokument-Context hinzu?',
          bestOptionId: 'ctx-off',
          options: [
            { id: 'ctx-off', label: 'Kein zusätzlicher Chunk-Context', rationale: 'Passt: Artikel sind selbsterklärend und tragen ihren Kontext bereits.' },
            { id: 'ctx-on', label: 'Doc-Context voranstellen', rationale: 'Unnötig: zusätzliche Vorverarbeitung ohne Mehrwert bei self-contained Artikeln.' },
          ],
        },
      ],
    },
  },
  {
    id: 'RF-TRANSFER',
    interactionType: 'retrieval-factory',
    labId: 'LAB-RETRIEVAL-FACTORY',
    roadmapNodeId: 'NODE-05-04',
    title: 'Retrieval Factory — Transfer: Code & Logs',
    prompt:
      'Geändertes Profil: gleicher Entscheidungsraum, anderer Korpus. Baue die Pipeline, die dieses Profil wirklich verlangt.',
    concepts: ['CONCEPT-RET-004', 'CONCEPT-RET-005', 'CONCEPT-RET-006', 'CONCEPT-RET-007'],
    prerequisites: ['NODE-05-04'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: true,
    scoringProfileId: 'rf-default',
    feedbackProfileId: 'rf-default',
    reviewHooks: ['retrieval_method_transfer', 'grounding_eval_transfer'],
    scenarioData: {
      corpusProfile:
        'Große interne Codebasis + Error-Logs. Chunks sind winzige Code-Fragmente, die ihren Datei-/Modul-Kontext verlieren. Großes Kandidatenset.',
      queryProfile:
        'Mischung: exakte Fehlercodes/Funktionsnamen („ERR_DB_2048“, „parseToken“) UND konzeptuelle „Wie funktioniert…“-Fragen.',
      stations: [
        {
          id: 'method',
          dimension: 'method_fit',
          label: 'Retrieval-Methode',
          question: 'Wie suchst du in diesem Korpus?',
          bestOptionId: 'hybrid',
          options: [
            { id: 'semantic', label: 'Semantic (Embeddings)', rationale: 'Verfehlt die exakten Identifier (Fehlercodes, Funktionsnamen).' },
            { id: 'lexical', label: 'Lexical (BM25)', rationale: 'Trifft Identifier, verliert aber die konzeptuellen Fragen.' },
            { id: 'hybrid', label: 'Hybrid (semantic + lexical)', rationale: 'Passt: exakte Tokens UND Bedeutung sind gefragt.' },
          ],
        },
        {
          id: 'reranking',
          dimension: 'reranking_fit',
          label: 'Reranking',
          question: 'Brauchst du eine zweite Ranking-Stufe?',
          bestOptionId: 'rerank-on',
          options: [
            { id: 'rerank-off', label: 'Kein Reranking', rationale: 'Riskant: bei großem Kandidatenset bleibt der richtige Chunk oft außerhalb der Top-k.' },
            { id: 'rerank-on', label: 'Reranking aktivieren', rationale: 'Passt: ordnet den relevanten Chunk aus vielen Kandidaten nach vorne.' },
          ],
        },
        {
          id: 'context',
          dimension: 'context_fit',
          label: 'Contextual Retrieval',
          question: 'Fügst du jedem Chunk Dokument-Context hinzu?',
          bestOptionId: 'ctx-on',
          options: [
            { id: 'ctx-off', label: 'Kein zusätzlicher Chunk-Context', rationale: 'Verliert kontextarme Fragmente: ein Code-Schnipsel ohne Datei/Modul ist kaum auffindbar.' },
            { id: 'ctx-on', label: 'Doc-Context voranstellen', rationale: 'Passt: Datei-/Modul-Context macht isolierte Fragmente wieder auffindbar.' },
          ],
        },
      ],
    },
  },
  {
    id: 'RFL-BASE',
    interactionType: 'retrieval-factory',
    labId: 'LAB-RETRIEVAL-FACTORY',
    roadmapNodeId: 'NODE-05-02',
    title: 'Lexical vs Semantic',
    prompt:
      'Korpus und Queries entscheiden über die Methode. Semantic ist nicht automatisch besser — wähle, was zu diesem Profil passt.',
    concepts: ['CONCEPT-RET-004'],
    prerequisites: ['NODE-05-01'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'rf-default',
    feedbackProfileId: 'rf-default',
    reviewHooks: ['retrieval_method_transfer'],
    scenarioData: {
      corpusProfile:
        'Ersatzteil-Katalog: jede Zeile trägt eine exakte Teilenummer und einen knappen Namen. Strukturiert, sauber, klein.',
      queryProfile:
        'Fast nur exakte Identifier: Teilenummern, SKUs, Fehlercodes („A-4471“, „ERR_502“). Kaum paraphrasierte Fragen.',
      stations: [
        {
          id: 'method',
          dimension: 'method_fit',
          label: 'Retrieval-Methode',
          question: 'Wie suchst du in diesem Korpus?',
          bestOptionId: 'lexical',
          options: [
            { id: 'lexical', label: 'Lexical (BM25)', rationale: 'Passt: exakte Tokens (Teilenummern, Codes) matchen direkt — genau das fragen die Queries.' },
            { id: 'semantic', label: 'Semantic (Embeddings)', rationale: 'Schwach hier: Embeddings verwischen exakte Identifier; „A-4471“ und „A-4417“ liegen im Vektorraum gefährlich nah.' },
            { id: 'hybrid', label: 'Hybrid (semantic + lexical)', rationale: 'Überbaut: die semantische Hälfte bringt bei reinen Identifier-Queries kaum Nutzen, kostet aber extra.' },
          ],
        },
        {
          id: 'reranking',
          dimension: 'reranking_fit',
          label: 'Reranking',
          question: 'Brauchst du eine zweite Ranking-Stufe?',
          bestOptionId: 'rerank-off',
          options: [
            { id: 'rerank-off', label: 'Kein Reranking', rationale: 'Passt: kleiner, exakt matchbarer Katalog — die First-Stage-Treffer sitzen schon.' },
            { id: 'rerank-on', label: 'Reranking aktivieren', rationale: 'Overhead: Latenz/Kosten ohne Gewinn bei eindeutigen Identifier-Treffern.' },
          ],
        },
        {
          id: 'context',
          dimension: 'context_fit',
          label: 'Contextual Retrieval',
          question: 'Fügst du jedem Chunk Dokument-Context hinzu?',
          bestOptionId: 'ctx-off',
          options: [
            { id: 'ctx-off', label: 'Kein zusätzlicher Chunk-Context', rationale: 'Passt: jede Katalogzeile ist bereits eindeutig und self-contained.' },
            { id: 'ctx-on', label: 'Doc-Context voranstellen', rationale: 'Unnötig: Vorverarbeitung ohne Mehrwert bei eindeutigen Zeilen.' },
          ],
        },
      ],
    },
  },
  {
    id: 'RFH-BASE',
    interactionType: 'retrieval-factory',
    labId: 'LAB-RETRIEVAL-FACTORY',
    roadmapNodeId: 'NODE-05-03',
    title: 'Hybrid Search & Reranking',
    prompt:
      'Großer, gemischter Korpus mit gemischten Queries. Entscheide, welche Stufen die Qualität wirklich heben — und welche nur Overhead sind.',
    concepts: ['CONCEPT-RET-005', 'CONCEPT-RET-006'],
    prerequisites: ['NODE-05-02'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'rf-default',
    feedbackProfileId: 'rf-default',
    reviewHooks: ['retrieval_method_transfer'],
    scenarioData: {
      corpusProfile:
        'Große gemischte Wissensbasis: Hilfe-Artikel UND Support-Tickets, zehntausende self-contained Chunks. Großes Kandidatenset pro Query.',
      queryProfile:
        'Gemischt: teils exakte Produktnamen/Fehlercodes, teils konzeptuelle „Wie funktioniert…“-Fragen.',
      stations: [
        {
          id: 'method',
          dimension: 'method_fit',
          label: 'Retrieval-Methode',
          question: 'Wie suchst du in diesem Korpus?',
          bestOptionId: 'hybrid',
          options: [
            { id: 'hybrid', label: 'Hybrid (semantic + lexical)', rationale: 'Passt: exakte Tokens UND Bedeutung kommen beide vor — beide Hälften tragen.' },
            { id: 'semantic', label: 'Semantic (Embeddings)', rationale: 'Verfehlt die exakten Produktnamen/Codes in den Queries.' },
            { id: 'lexical', label: 'Lexical (BM25)', rationale: 'Trifft Identifier, verliert aber die konzeptuellen Fragen.' },
          ],
        },
        {
          id: 'reranking',
          dimension: 'reranking_fit',
          label: 'Reranking',
          question: 'Brauchst du eine zweite Ranking-Stufe?',
          bestOptionId: 'rerank-on',
          options: [
            { id: 'rerank-on', label: 'Reranking aktivieren', rationale: 'Passt: bei großem Kandidatenset zieht ein Cross-Encoder den richtigen Chunk in die Top-k.' },
            { id: 'rerank-off', label: 'Kein Reranking', rationale: 'Riskant: bei zehntausenden Kandidaten bleibt der beste Treffer oft außerhalb der First-Stage-Top-k.' },
          ],
        },
        {
          id: 'context',
          dimension: 'context_fit',
          label: 'Contextual Retrieval',
          question: 'Fügst du jedem Chunk Dokument-Context hinzu?',
          bestOptionId: 'ctx-off',
          options: [
            { id: 'ctx-off', label: 'Kein zusätzlicher Chunk-Context', rationale: 'Passt: Artikel und Tickets tragen ihren Kontext schon — die Hebel sind hier Hybrid + Reranking.' },
            { id: 'ctx-on', label: 'Doc-Context voranstellen', rationale: 'Unnötig hier: kostet Vorverarbeitung, ohne dass die self-contained Chunks Context verlieren.' },
          ],
        },
      ],
    },
  },
]
