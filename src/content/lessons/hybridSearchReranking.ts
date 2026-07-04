import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-05-03 · 2nd PILOT of the post-template redesign, HARD pass (2026-06-21). Bespoke
// concrete exercises, no mechanic engine, no scenario/constraint wrapper. statr-flavoured:
// real ranked lists with scores, predict-the-output (RRF math), diagnose-the-miss. Every
// exercise a DIFFERENT angle — read the output, compute the output, judge the headroom,
// design under a profile — and each future-proof (mechanism/judgment, not prompt tricks).
//
// GROUND-UP: lexical and semantic retrieval have OPPOSITE blind spots; hybrid + RRF exist to
// cover for each other; reranking only reorders what the first stage already retrieved.
// The durable skill is reading retrieval output and knowing which lever — and which stage is
// just overhead. Options are shuffled at render; nothing is telegraphed.
export const hybridSearchReranking: Lesson = {
  id: 'LESSON-05-03',
  roadmapNodeId: 'NODE-05-03',
  conceptIds: ['CONCEPT-RET-005', 'CONCEPT-RET-006'],
  prerequisites: ['NODE-05-02'],
  title: 'Hybrid Search and Reranking',
  estimatedMinutes: 9,
  lessonMode: 'worked-trace-first',
  learningGoal:
    'Aus konkreter Retrieval-Ausgabe die richtige Stufe ableiten — und erkennen, welche Stufe nur Overhead ist.',
  interactionType: 'retrieval-factory',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-RETRIEVAL-MISMATCH',
  reviewHooks: ['CONCEPT-RET-005', 'CONCEPT-RET-006'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Hybrid Search & Reranking',
      text: 'Lexikalische Suche (BM25) matcht exakte Tokens, semantische Suche (Vektoren) matcht Bedeutung — ihre blinden Flecken sind gegensätzlich. Hybrid führt beide Trefferlisten zusammen; ein Reranker ordnet danach die Kandidaten der ersten Stufe neu.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'blindspot',
        format: 'pick',
        stem: 'Eine RAG über Payments-Code+Doku. Für dieselbe Query liefern beide Retriever je ihre Top-5. Nur Chunk C7 nennt die echte Ursache. Was zeigen die zwei Listen?',
        code: `QUERY  „Rundungsfehler in parseInvoice()"
nur C7 erklaert die Ursache (float verliert Cents)

BM25 (lexikalisch)     Vektor (semantisch)
#1  C7   14.2          #1  C2   0.83
#2  C3    9.1          #2  C8   0.81
#3  C9    8.7          #3  C4   0.79
#4  C1    6.4          #4  C6   0.74
#5  C5    5.9          #5  C9   0.72
                       …
                       #11 C7   0.61

(C2/C8/C4 = allgemeine Texte ueber
 Rundung, Decimal, Float — ohne Bezug
 zu parseInvoice)`,
        options: [
          {
            id: 'lexical-wins',
            text: 'Lexikalisch steht C7 auf #1, semantisch fällt es auf #11 — die Query hängt an einem seltenen exakten Token (`parseInvoice`), das die Vektor-Suche zugunsten allgemeiner „Rundung"-Texte verdrängt.',
            correct: true,
            why: 'Genau das ist die Asymmetrie: BM25 belohnt das exakte, seltene Token; die Vektor-Suche bettet den knappen Code-Kommentar nahe an die generischen Rundungs-Chunks und schiebt ihn nach hinten. Beide Hälften zusammen hätten C7 sicher vorne — das ist der Grund für Hybrid.',
          },
          {
            id: 'semantic-wins',
            text: 'Semantisch ist C7 vorne, weil es um Bedeutung (Rundung) geht; lexikalisch verliert es, weil die Wörter nicht exakt matchen.',
            correct: false,
            why: 'Umgekehrt. C7 steht lexikalisch auf #1 und semantisch erst auf #11. Wer „Vektoren sind immer besser für Bedeutung" annimmt, ohne die Listen zu lesen, liegt hier falsch.',
          },
          {
            id: 'scale-only',
            text: 'Beide finden C7 weit vorne; der einzige Unterschied ist die Score-Skala (14.2 gegen 0.83).',
            correct: false,
            why: 'C7 ist semantisch NICHT in den Top-5 — es steht auf #11. Wer nur auf die unterschiedlichen Zahlen schaut und aufhört, übersieht die eigentliche Lücke.',
          },
          {
            id: 'chunking',
            text: 'C7 fehlt in beiden Top-5 — der Korpus braucht besseres Chunking.',
            correct: false,
            why: 'C7 steht lexikalisch auf #1. Es ist kein Chunking-Problem, sondern ein Retriever-Profil-Problem: ein Verfahren trifft, das andere nicht.',
          },
        ],
        takeaway: 'Lexikalisch ist nicht die „dumme alte" Methode. Bei seltenen, exakten Tokens (Identifier, Fehlercodes, SKUs) schlägt sie Vektoren — und genau diese Asymmetrie ist der Daseinsgrund von Hybrid.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rrf',
        format: 'pick',
        stem: 'Die zwei Listen werden mit Reciprocal Rank Fusion zusammengeführt. Welches Dokument steht danach auf Platz 1?',
        code: `QUERY  „Refund-Webhook Signatur pruefen"
RRF: Score = Summe 1/(k+Rang),  k=60

Lexikalisch       Semantisch
#1  D-A           #1  D-B
#2  D-B           #2  D-D
#3  D-C           #3  D-C
(D-D nicht        (D-A nicht
 in der Liste)     in der Liste)`,
        options: [
          {
            id: 'd-b',
            text: 'D-B',
            correct: true,
            why: 'In beiden Listen weit vorne (#2 und #1): 1/62 + 1/61 ≈ 0.0325 — der höchste Wert. Übereinstimmung in beiden Quellen schlägt einen einzelnen Spitzenplatz.',
          },
          {
            id: 'd-a',
            text: 'D-A',
            correct: false,
            why: 'Steht lexikalisch auf #1, fehlt aber semantisch ganz → nur 1/61 ≈ 0.0164. Der häufige Flüchtigkeitsfehler: „#1 in einer Liste" gewinnt eben NICHT, wenn die andere Liste das Dokument gar nicht kennt.',
          },
          {
            id: 'd-c',
            text: 'D-C',
            correct: false,
            why: 'Auch in beiden Listen, aber nur #3/#3: 1/63 + 1/63 ≈ 0.0317. Stark — knapp hinter D-B, nicht #1.',
          },
          {
            id: 'd-d',
            text: 'D-D',
            correct: false,
            why: 'Nur semantisch (#2) → 1/62 ≈ 0.0161. Wie D-A: eine Liste allein reicht nicht.',
          },
        ],
        takeaway: 'RRF nutzt RÄNGE, nicht Scores — deshalb müssen die unvergleichbaren Skalen (BM25 14.2 vs. Cosine 0.83) gar nicht erst normalisiert werden. Was in beiden Quellen auftaucht, gewinnt.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rerank-headroom',
        format: 'multi',
        stem: 'Ein Cross-Encoder-Reranker bewertet Query+Dokument-Paare gemeinsam neu — teuer pro Paar, aber nur auf den Kandidaten der ersten Stufe. Wann holt er echten Gewinn?',
        options: [
          {
            id: 'in-50',
            text: 'Erste Stufe holt Top-50; das richtige Dokument ist meist dabei, aber um Rang 30.',
            correct: true,
            why: 'Genau die Aufgabe des Rerankers: vorhandene Kandidaten neu ordnen. Das Dokument ist im Set — er zieht es nach vorn.',
          },
          {
            id: 'big-corpus',
            text: 'Großer Korpus, das richtige Chunk landet in der ersten Stufe oft auf Rang 20–40 von 100 geholten.',
            correct: true,
            why: 'Headroom plus Kandidat-vorhanden: klassischer Reranking-Fall. Die erste Stufe sorgt für Recall, der Reranker für Präzision oben.',
          },
          {
            id: 'not-in-10',
            text: 'Erste Stufe holt nur Top-10; das richtige Dokument ist oft gar nicht unter den 10.',
            correct: false,
            why: 'Der Reranker ordnet nur, was schon da ist. Fehlt das Dokument im Kandidatenset, kann kein Reranking es zurückholen — erst Recall erhöhen (größeres N oder bessere erste Stufe). Das ist der meistübersehene Punkt.',
          },
          {
            id: 'small-faq',
            text: '200 saubere FAQ-Einträge, die Top-5 stimmen ohnehin schon.',
            correct: false,
            why: 'Kein Headroom: wenn oben schon das Richtige steht, kostet Reranking nur Latenz und Geld, ohne etwas zu verbessern.',
          },
          {
            id: 'storage',
            text: 'Der Vektor-Index ist zu groß und soll Speicher sparen.',
            correct: false,
            why: 'Reranking ändert nichts an Index-Größe oder Speicher — das ist die falsche Stellschraube. Ein Reranker sitzt NACH der Suche, nicht im Index.',
          },
        ],
        takeaway: 'Reranking ist eine Präzisions-Stufe, keine Recall-Stufe. Es kann nur verbessern, was die erste Stufe schon geholt hat — und nur, wenn oben Platz nach oben ist.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'design',
        format: 'pick',
        stem: 'Ein interner Such-Endpoint bedient einen Produktkatalog: 90% der Queries sind exakte Artikelnummern und Fehlercodes (`ERR-4021`, `SKU-88123`); der Katalog hat 3.000 kurze, eindeutige Einträge. Welche Auslegung passt?',
        options: [
          {
            id: 'lexical-first',
            text: 'Lexikalisch (BM25) als Hauptweg, kein Reranking.',
            correct: true,
            why: 'Exakte Codes matchen lexikalisch perfekt; bei 3.000 eindeutigen Einträgen sitzt der Treffer schon auf #1. Kein Headroom für Reranking, kaum Nutzen für die semantische Hälfte — die schlanke Lösung ist die richtige.',
          },
          {
            id: 'full-pipeline',
            text: 'Volle Hybrid-Pipeline plus Cross-Encoder-Reranking, um auf Nummer sicher zu gehen.',
            correct: false,
            why: 'Überbaut. Die semantische Hälfte bringt bei exakten Codes kaum etwas, und Reranking hat bei eindeutigen Top-1-Treffern keinen Headroom. Das ist Latenz und Kosten ohne Gegenwert — die teure Pipeline ist nicht der sichere Default.',
          },
          {
            id: 'pure-semantic',
            text: 'Rein semantisch (dense vectors), weil moderne Embeddings alles abdecken.',
            correct: false,
            why: 'Exakte, seltene Codes sind genau die Schwäche der Vektor-Suche: `ERR-4021` und `ERR-4012` liegen im Embedding-Raum gefährlich nah beieinander. Hier verlierst du die Eindeutigkeit, die du brauchst.',
          },
          {
            id: 'llm-rewrite',
            text: 'Jede Query erst per LLM zusammenfassen, dann semantisch suchen.',
            correct: false,
            why: 'Fügt Latenz und eine Fehlerquelle hinzu und zerstört gerade die exakten Tokens, auf die es ankommt. Ein Schritt, der das Signal vernichtet, das die Aufgabe trägt.',
          },
        ],
        takeaway: 'Stages kosten. Die Auslegung folgt dem Query-Profil, nicht der Featureliste — und die teure Pipeline ist nie automatisch die sichere Wahl.',
      },
    },
  ],
}
