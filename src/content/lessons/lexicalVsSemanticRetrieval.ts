import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-05-02 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · match ·
// pick) — no mechanic engine, concrete material. Lexical (BM25) and semantic (vectors) have
// OPPOSITE blind spots; the durable skill is reading a query/doc and knowing which fits.
export const lexicalVsSemanticRetrieval: Lesson = {
  id: 'LESSON-05-02',
  roadmapNodeId: 'NODE-05-02',
  conceptIds: ['CONCEPT-RET-003', 'CONCEPT-RET-004'],
  prerequisites: ['NODE-05-01'],
  title: 'Lexical vs Semantic Retrieval',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Die Retrieval-Methode an Query- und Dokument-Eigenschaften festmachen.',
  interactionType: 'retrieval-factory',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-RETRIEVAL-MISMATCH',
  reviewHooks: ['CONCEPT-RET-004', 'retrieval_method_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Lexikalisch vs. semantisch',
      text: 'Lexikalische Suche (BM25) matcht exakte Tokens — stark bei seltenen Codes/IDs, blind für Synonyme. Semantische Suche (Vektoren) matcht Bedeutung — stark bei Paraphrasen, blind für exakte seltene Zeichenketten. Ihre blinden Flecken sind gegensätzlich.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'route-queries',
        format: 'categorize',
        stem: 'Welche Suche findet jede Query am zuverlässigsten?',
        buckets: [
          { id: 'lex', label: 'Lexikalisch' },
          { id: 'sem', label: 'Semantisch' },
          { id: 'both', label: 'Beide nötig' },
        ],
        items: [
          { id: 'q-err', text: '„Fehlercode ERR-5023"', bucketId: 'lex', why: 'Ein exakter, seltener Token — Vektoren verwischen ihn, BM25 trifft ihn punktgenau.' },
          { id: 'q-cancel', text: '„Wie kündige ich mein Abo?" (Doku sagt „Vertrag beenden")', bucketId: 'sem', why: 'Reine Bedeutung/Synonyme, kein gemeinsamer Token — der Fall der Vektor-Suche.' },
          { id: 'q-parse', text: '„parseInvoice() Rundungsfehler bei großen Beträgen"', bucketId: 'both', why: 'Seltener Identifier (lexikalisch) UND Konzept „Rundung" (semantisch) — beide Hälften tragen.' },
          { id: 'q-sku', text: '„Lagerbestand SKU-88123"', bucketId: 'lex', why: 'Exakte Artikelnummer; jede Verwischung ist hier ein Fehler.' },
          { id: 'q-diff', text: '„Unterschied zwischen Embedding und Token"', bucketId: 'sem', why: 'Konzeptuelle Frage, die auf umschreibende Doku zeigt — keine seltenen exakten Tokens.' },
          { id: 'q-rfc', text: '„RFC 6749 Abschnitt 4.1 client_credentials"', bucketId: 'both', why: 'Exakte Referenz (RFC 6749 / client_credentials) UND das Konzept dahinter — beide helfen.' },
        ],
        takeaway: 'Die Methode folgt der Query: exakte seltene Tokens → lexikalisch, Bedeutung/Synonyme → semantisch, beides → hybrid.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'method-properties',
        format: 'match',
        stem: 'Ordne jedem Begriff die passende Eigenschaft zu.',
        pairs: [
          { id: 'bm25', left: 'BM25 (lexikalisch)', right: 'Matcht exakte Tokens; stark bei seltenen Codes/IDs, buchstabengetreu', why: 'Token-Statistik (TF-IDF-artig) — keine Bedeutung, nur Übereinstimmung.' },
          { id: 'dense', left: 'Dense-Vektor-Suche', right: 'Matcht Bedeutung und Synonyme; Schreibweise egal', why: 'Embeddings liegen nah, wenn die Bedeutung nah ist — auch ohne gemeinsame Wörter.' },
          { id: 'typo', left: 'Query mit Tippfehler („embeddng")', right: 'Lexikalisch verfehlt — exakter Token stimmt nicht mehr; semantisch evtl. noch nah', why: 'Ein Zeichen daneben bricht den exakten Match; die Bedeutung bleibt ungefähr erhalten.' },
          { id: 'lang', left: 'Query und Doku in verschiedenen Sprachen', right: 'Nur ein mehrsprachiges Embedding hat eine Chance', why: 'Kein gemeinsamer Token über Sprachen — lexikalisch chancenlos.' },
        ],
        takeaway: 'Exakte Tokens sind die Stärke des einen und die Schwäche des anderen Verfahrens — und umgekehrt für Bedeutung.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'predict-winner',
        format: 'pick',
        stem: 'Query: „OAuth2 Grant Type für Server-zu-Server ohne Nutzer". Der Goldtreffer-Chunk nennt den Fachbegriff „client_credentials". Welche Suche findet ihn zuverlässiger?',
        options: [
          {
            id: 'sem',
            text: 'Semantisch — die Query umschreibt das Konzept; der Chunk nutzt den Fachbegriff, ohne die Query-Wörter zu teilen.',
            correct: true,
            why: 'Genau der Synonym-/Umschreibungsfall: Bedeutung verbindet „Server-zu-Server ohne Nutzer" mit „client_credentials"; lexikalisch gibt es kaum Token-Overlap.',
          },
          {
            id: 'lex-oauth',
            text: 'Lexikalisch — „OAuth2" steht in Query und Chunk.',
            correct: false,
            why: '„OAuth2" steht in fast jedem Chunk des Korpus — es diskriminiert nicht. Der entscheidende Begriff „client_credentials" teilt keinen Token mit der Query.',
          },
          {
            id: 'lex-always',
            text: 'Lexikalisch — exakte Tokens gewinnen immer.',
            correct: false,
            why: 'Pauschal falsch: hier enthält die Query die exakten Tokens gar nicht. Ohne Token-Overlap hat BM25 nichts zu matchen.',
          },
          {
            id: 'finetune',
            text: 'Keine von beiden — man braucht ein feingetuntes Modell.',
            correct: false,
            why: 'Überzogen und am Problem vorbei: genau diesen Umschreibungsfall löst semantische Suche von der Stange.',
          },
        ],
        takeaway: 'Wenn die Query das Konzept umschreibt und der Treffer den Fachbegriff nutzt, verbindet beide nur die Bedeutung — ein Lehrbuchfall für semantische Suche.',
      },
    },
  ],
}
