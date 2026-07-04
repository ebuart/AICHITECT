import type { Feedback } from '@/types'

// Feedback library for the Retrieval Factory (analyzes the pipeline decision, not
// the learner — FB-002). Direction-neutral: a station is "wrong" whether the
// learner over- or under-built it, so each entry frames the mismatch to the
// corpus/query profile and the per-option rationale supplies the specifics.
export const rfFeedback = {
  methodMismatch: {
    id: 'FB-RF-METHOD-MISMATCH',
    severity: 'critical',
    decision: 'Die Retrieval-Methode passt nicht zum Query/Corpus-Profil.',
    consequence: 'Entweder werden exakte Identifier verfehlt oder es entsteht unnötige Komplexität.',
    realWorldContext: 'BM25 trifft exakte Tokens, Embeddings die Bedeutung, Hybrid beides — je nach Queries.',
    failureMode: 'Systematisch falsche oder fehlende Evidenz vor der Generierung.',
    architectureRule: 'Wähle die Retrieval-Methode nach Query- und Dokument-Eigenschaften, nicht per Default.',
    improvedSolution: 'Profil lesen: exakte Identifier → lexical, Bedeutung → semantic, gemischt → hybrid.',
    reviewHook: 'retrieval_method_transfer',
  },
  rerankingMismatch: {
    id: 'FB-RF-RERANK-MISMATCH',
    severity: 'risk',
    decision: 'Die Reranking-Entscheidung passt nicht zum Profil.',
    consequence: 'Entweder bleibt die richtige Evidenz außerhalb der Top-k oder du zahlst Latenz/Kosten ohne Nutzen.',
    realWorldContext: 'Reranking lohnt bei großem Kandidatenset mit schwacher Reihenfolge; bei kleinem sauberem Korpus ist es Overhead.',
    failureMode: 'Schwache Top-k-Evidenz — oder unnötiger Overhead in der Pipeline.',
    architectureRule: 'Setze Reranking nur ein, wenn First-Stage-Recall die Präzision der Reihenfolge übersteigt.',
    improvedSolution: 'Reranking an Kandidatenmenge und Trefferlage koppeln, nicht reflexhaft aktivieren.',
    reviewHook: 'grounding_eval_transfer',
  },
  contextMismatch: {
    id: 'FB-RF-CONTEXT-MISMATCH',
    severity: 'risk',
    decision: 'Die Contextual-Retrieval-Entscheidung passt nicht zum Profil.',
    consequence: 'Entweder bleiben isolierte Chunks unauffindbar oder du baust unnötige Vorverarbeitung.',
    realWorldContext: 'Doc-Context lohnt bei kontextarmen Fragmenten (Code/Logs); selbsterklärende Artikel brauchen ihn nicht.',
    failureMode: 'Verlorene Chunks ohne genug Kontext — oder Overhead ohne Mehrwert.',
    architectureRule: 'Ergänze Chunk-Context nur, wenn Chunks ohne ihn ihren Bezug verlieren.',
    improvedSolution: 'Entscheidung an die Selbsterklärbarkeit der Chunks koppeln.',
    reviewHook: 'retrieval_method_transfer',
  },
  clean: {
    id: 'FB-RF-CLEAN',
    severity: 'strong',
    decision: 'Die Pipeline passt zum Profil: Methode, Reranking und Chunk-Context stimmig gewählt.',
    consequence: 'Die richtige Evidenz landet zuverlässig und ohne unnötigen Overhead im Context.',
    realWorldContext: 'Gute Retrieval-Architektur ist so komplex wie nötig und so einfach wie möglich.',
    failureMode: 'Vermieden: Retrieval-Mismatch ebenso wie überbaute Pipelines.',
    architectureRule: 'Baue die einfachste Retrieval-Pipeline, die das Query/Corpus-Profil tatsächlich erfüllt.',
    improvedSolution: 'Als Nächstes mit einem Grounding-Eval prüfen, ob die Antworten wirklich gestützt sind.',
    reviewHook: 'grounding_eval_transfer',
  },
} satisfies Record<string, Feedback>
