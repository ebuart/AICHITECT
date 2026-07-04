import type { ReactNode } from 'react'

export type VisualLabTestState =
  | 'short'
  | 'long_labels'
  | 'dense'
  | 'empty'
  | 'mobile'
  | 'desktop'
  | 'warning'
  | 'fallback'

export interface VisualLabCaseProps {
  id: string
  componentName: string
  testState: VisualLabTestState
  notes?: string
  children: ReactNode
}

// Wraps one QA example (VIS-VisualLabCase). Internal tool only — labels the
// component, the test-state, the case id and known risks per VQA-102.
export function VisualLabCase({
  id,
  componentName,
  testState,
  notes,
  children,
}: VisualLabCaseProps) {
  return (
    <div className="rounded-lg border border-deck-border bg-deck-surface/40 p-2">
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] text-deck-muted">
        <span className="font-semibold text-deck-muted">{componentName}</span>
        <span className="rounded bg-deck-surface-2 px-1 py-0.5 uppercase tracking-wider">
          {testState}
        </span>
        <span className="text-deck-muted/70">{id}</span>
      </div>
      {children}
      {notes && <p className="mt-2 text-[10px] text-deck-muted/80">↳ {notes}</p>}
    </div>
  )
}
