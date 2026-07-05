import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { DossierFile } from './lessonModel'

// Case-file panel (control/10 IX-5): the scenario's actual artifacts, clickable like a tiny
// file browser. Desktop: file list left, content right. Mobile: file chips above the content.
// Opened files get a subtle read-mark — a nudge to look at everything before the interactive.
export function DossierView({ intro, files }: { intro?: string; files: DossierFile[] }) {
  const [openIdx, setOpenIdx] = useState(0)
  const [read, setRead] = useState<Set<number>>(new Set([0]))
  const open = (i: number) => {
    setOpenIdx(i)
    setRead((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
  }
  const file = files[openIdx]

  return (
    <div className="flex flex-col gap-2 border border-deck-border bg-deck-surface p-3">
      {intro && <p className="text-[12px] leading-snug text-deck-muted">{intro}</p>}
      <div className="flex flex-col gap-2 md:flex-row">
        {/* File list — chips on mobile, sidebar on desktop */}
        <ul className="flex flex-row flex-wrap gap-1 md:w-56 md:shrink-0 md:flex-col">
          {files.map((f, i) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => open(i)}
                className={cn(
                  'flex w-full flex-col items-start gap-0.5 border px-2 py-1.5 text-left transition-colors',
                  i === openIdx
                    ? 'border-white bg-white text-black'
                    : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
                )}
              >
                <span className="font-typer text-[11px] leading-none">
                  {read.has(i) ? '▸ ' : '· '}
                  {f.name}
                </span>
                {f.meta && (
                  <span
                    className={cn(
                      'font-typer text-[9px] uppercase tracking-wide',
                      i === openIdx ? 'text-black/60' : 'text-deck-muted',
                    )}
                  >
                    {f.meta}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        {/* Content */}
        <div className="min-w-0 flex-1 border border-deck-border-dim bg-deck-bg px-2.5 py-2">
          <pre className="whitespace-pre-wrap font-typer text-[11px] leading-relaxed text-white">
            {file?.body}
          </pre>
        </div>
      </div>
    </div>
  )
}
