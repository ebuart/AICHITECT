import { useState, type ReactNode } from 'react'
import { DiagramShell, SystemNode, CompactFallbackView } from '@/components/visuals'
import { cn } from '@/lib/utils/cn'
import { VisualLabCase } from './lab/VisualLabCase'
import {
  SystemNodeDemo,
  SystemEdgeDemo,
  LayerStackDemo,
  FlowStepDemo,
  BoundaryBoxDemo,
} from './lab/structureDemos'
import {
  TokenBudgetBarDemo,
  TraceTimelineDemo,
} from './lab/contextTraceDemos'
import {
  DecisionCardDemo,
  FailureModeCardDemo,
  ScoreMeterDemo,
  CompactFallbackViewDemo,
} from './lab/decisionDemos'

// Internal QA surface (VSS-123, VQA-104). Not learner content and intentionally
// not progress-aware (VQA-103). The width switcher emulates narrow viewports so
// mobile bugs are catchable from code (VQA-010/011).
const WIDTHS = ['320', '360', '390', '430', 'full'] as const
type Width = (typeof WIDTHS)[number]

const PRIMITIVES: { name: string; contract: string; demo: ReactNode }[] = [
  { name: 'SystemNode', contract: 'VIS-SystemNode', demo: <SystemNodeDemo /> },
  { name: 'SystemEdge', contract: 'VIS-SystemEdge', demo: <SystemEdgeDemo /> },
  { name: 'LayerStack', contract: 'VIS-LayerStack', demo: <LayerStackDemo /> },
  { name: 'FlowStep', contract: 'VIS-FlowStep', demo: <FlowStepDemo /> },
  { name: 'BoundaryBox', contract: 'VIS-BoundaryBox', demo: <BoundaryBoxDemo /> },
  { name: 'TokenBudgetBar', contract: 'VIS-TokenBudgetBar', demo: <TokenBudgetBarDemo /> },
  { name: 'TraceTimeline', contract: 'VIS-TraceTimeline', demo: <TraceTimelineDemo /> },
  { name: 'DecisionCard', contract: 'VIS-DecisionCard', demo: <DecisionCardDemo /> },
  { name: 'FailureModeCard', contract: 'VIS-FailureModeCard', demo: <FailureModeCardDemo /> },
  { name: 'ScoreMeter', contract: 'VIS-ScoreMeter', demo: <ScoreMeterDemo /> },
  { name: 'CompactFallbackView', contract: 'VIS-CompactFallbackView', demo: <CompactFallbackViewDemo /> },
]

export function VisualLabPage() {
  const [width, setWidth] = useState<Width>('full')
  const maxWidth = width === 'full' ? '100%' : `${width}px`

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-white">Visual Lab</h1>
        <p className="text-xs text-deck-muted">
          Interne QA-Galerie für Visual-Primitives. Breite wählen, um Mobile-States
          zu prüfen.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWidth(w)}
              className={cn(
                'rounded-full border px-2 py-1 text-[11px]',
                width === w
                  ? 'border-deck-accent text-deck-accent'
                  : 'border-deck-border text-deck-muted',
              )}
            >
              {w === 'full' ? 'Voll' : `${w}px`}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto w-full" style={{ maxWidth }}>
        <div className="flex flex-col gap-6">
          {PRIMITIVES.map((p) => (
            <section key={p.contract} className="flex flex-col gap-2">
              <h2 className="flex items-baseline gap-2 text-sm font-semibold text-white">
                {p.name}
                <span className="text-[10px] font-normal text-deck-muted">
                  {p.contract}
                </span>
              </h2>
              {p.demo}
            </section>
          ))}

          <section className="flex flex-col gap-2">
            <h2 className="flex items-baseline gap-2 text-sm font-semibold text-white">
              DiagramShell
              <span className="text-[10px] font-normal text-deck-muted">
                VIS-DiagramShell
              </span>
            </h2>
            <VisualLabCase
              id="DS-fallback"
              componentName="DiagramShell"
              testState="fallback"
              notes="toggle Kompakt → swaps dense diagram for fallback (VSS-007)"
            >
              <DiagramShell
                title="Augmented LLM (Mini)"
                subtitle="Model + Tool + Memory"
                legend={['◍ Model', '▣ Tool', '▤ Memory']}
                compactFallback={
                  <CompactFallbackView
                    title="Augmented LLM (Kompakt)"
                    summary="Basiseinheit: Model nutzt Tools, Retrieval und Memory."
                    items={[
                      { id: 'm', label: 'Model — zentrale Einheit' },
                      { id: 't', label: 'Tool — Aktion nach außen' },
                      { id: 'me', label: 'Memory — durable State' },
                    ]}
                  />
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <SystemNode id="m" kind="model" label="Model" compact />
                  <SystemNode id="t" kind="tool" label="Tool" compact />
                  <SystemNode id="me" kind="memory" label="Memory" compact />
                  <SystemNode id="e" kind="eval" label="Eval" compact />
                </div>
              </DiagramShell>
            </VisualLabCase>
          </section>
        </div>
      </div>
    </div>
  )
}
