import type { ReactNode } from 'react'

// Shared brutalist building blocks for every bespoke exercise (post-template redesign).
// Pure black/white, sharp, thin borders; clickable things speak monospace via the global
// rule. ExerciseBody is the standard root: fills its grid cell (h-full) and distributes
// slack (justify-between) so a short question matches a taller side-by-side neighbour.

export function ExerciseBody({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-1 flex-col justify-between gap-2.5">{children}</div>
}

// A square mark opens every exercise.
export function Stem({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2">
      <span aria-hidden className="mt-[5px] h-2 w-2 shrink-0 bg-white" />
      <p className="text-sm font-medium text-white">{children}</p>
    </div>
  )
}

export function Takeaway({ text }: { text: string }) {
  return (
    <div className="mt-2 flex gap-2 border-l-2 border-white pl-2.5">
      <p className="py-1 text-[12px] text-deck-muted">{text}</p>
    </div>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto border border-deck-border-dim bg-deck-surface-2 px-3 py-2 text-[12px] leading-relaxed text-white">
      <code>{code}</code>
    </pre>
  )
}

// A muted framing line above the material (used by several mechanics).
export function Intro({ text }: { text: string }) {
  return <p className="text-[12px] leading-relaxed text-deck-muted">{text}</p>
}
