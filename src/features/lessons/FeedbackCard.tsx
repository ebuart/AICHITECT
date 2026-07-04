import type { Feedback, FeedbackSeverity } from '@/types'
import { cn } from '@/lib/utils/cn'

// Concise feedback (LR-014/LR-040): a severity chip + a one-line takeaway naming the
// trade-off, and the rule as a short second line. No six-part wall of text. Analyzes
// the decision's system consequence, never the learner (FB-002).
const severityMeta: Record<
  FeedbackSeverity,
  { label: string; ring: string; chip: string }
> = {
  info: { label: 'Hinweis', ring: 'border-deck-border', chip: 'text-deck-muted' },
  weak: { label: 'Unvollständig', ring: 'border-deck-warning/50', chip: 'text-deck-warning' },
  risk: { label: 'Risiko', ring: 'border-deck-warning/60', chip: 'text-deck-warning' },
  critical: { label: 'Kritisch', ring: 'border-deck-danger/60', chip: 'text-deck-danger' },
  strong: { label: 'Starke Wahl', ring: 'border-deck-success/60', chip: 'text-deck-success' },
}

export function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const meta = severityMeta[feedback.severity]
  const takeaway = feedback.summary ?? feedback.consequence
  // The rule is a short second line, only when it adds something beyond the takeaway.
  const rule =
    feedback.architectureRule && feedback.architectureRule !== takeaway
      ? feedback.architectureRule
      : undefined

  return (
    <div className={cn('flex flex-col gap-1.5 rounded-xl border bg-deck-surface-2 p-3', meta.ring)}>
      <span className={cn('text-[10px] font-semibold uppercase tracking-wider', meta.chip)}>
        {meta.label}
      </span>
      {takeaway && <p className="text-sm leading-snug text-white">{takeaway}</p>}
      {rule && <p className="text-xs leading-snug text-deck-muted">{rule}</p>}
    </div>
  )
}
