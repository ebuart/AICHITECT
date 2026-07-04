import { useState, type ReactNode } from 'react'

export interface DiagramShellProps {
  title: string
  subtitle?: string
  legend?: string[]
  children: ReactNode
  compactFallback?: ReactNode
  qaId?: string
}

// Standard titled container for diagrams (VIS-DiagramShell). When a compact
// fallback is supplied, exposes a toggle so any dense diagram can drop to its
// readable form (VSS-007, VSS-130).
export function DiagramShell({
  title,
  subtitle,
  legend = [],
  children,
  compactFallback,
  qaId,
}: DiagramShellProps) {
  const [compact, setCompact] = useState(false)

  return (
    <figure
      data-qa-id={qaId}
      className="rounded-deck border border-deck-border bg-deck-bg/40 p-3"
    >
      <figcaption className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{title}</span>
          {subtitle && <span className="text-xs text-deck-muted">{subtitle}</span>}
        </div>
        {compactFallback && (
          <button
            type="button"
            onClick={() => setCompact((c) => !c)}
            className="shrink-0 rounded-full border border-deck-border px-2 py-1 text-[11px] text-deck-muted hover:text-white"
          >
            {compact ? 'Diagramm' : 'Kompakt'}
          </button>
        )}
      </figcaption>

      {compact && compactFallback ? compactFallback : children}

      {legend.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-deck-border pt-2">
          {legend.map((item) => (
            <span key={item} className="text-[10px] text-deck-muted">
              {item}
            </span>
          ))}
        </div>
      )}
    </figure>
  )
}
