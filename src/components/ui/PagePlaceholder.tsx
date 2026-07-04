import type { ReactNode } from 'react'

interface PagePlaceholderProps {
  /** English technical term / screen name kept in English (PC-035). */
  title: string
  /** German one-line explanation of what this surface will become. */
  description: string
  /** Phase tag, e.g. "PHASE_1". Signals this is a deliberate placeholder. */
  phase: string
  children?: ReactNode
}

// Reusable placeholder for PHASE_0 route skeletons. Avoids per-page duplication
// and makes it obvious that real logic is intentionally deferred.
export function PagePlaceholder({
  title,
  description,
  phase,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="w-fit rounded-full border border-deck-border bg-deck-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-deck-muted">
          {phase} · Platzhalter
        </span>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm leading-relaxed text-deck-muted">{description}</p>
      </div>
      {children}
    </section>
  )
}
