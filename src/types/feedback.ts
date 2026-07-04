// Feedback contract. Analyzes the *decision and its system consequence*, never the
// learner (FB-002, NG-054). Rendered concise (LR-014/LR-040): a severity chip + a one-
// line takeaway + the rule. The legacy detail fields stay optional — authored for depth
// and reused by the scorers, but no longer shown as a six-part wall of text.

export type FeedbackSeverity = 'info' | 'weak' | 'risk' | 'critical' | 'strong'

export interface Feedback {
  id: string
  severity: FeedbackSeverity
  /** Concise one-line takeaway — the preferred render (LR-040). */
  summary?: string
  /** System consequence (primary fallback when there is no summary). */
  consequence?: string
  /** The architecture rule / principle (shown as a short second line). */
  architectureRule?: string
  // Legacy detail (authored for depth; not rendered):
  decision?: string
  realWorldContext?: string
  failureMode?: string
  improvedSolution?: string
  reviewHook?: string
}
