import {
  CompactFallbackView,
  DecisionCard,
  FlowStep,
  LayerStack,
  ScoreMeter,
  SystemNode,
  TokenBudgetBar,
  TraceTimeline,
} from '@/components/visuals'
import type { LessonVisual } from './lessonModel'

// Maps a lesson's visual descriptor to a reusable visual primitive. Lessons
// never define one-off visuals (VSS-003); they compose primitives QA'd in
// `/visual-lab`. Exhaustive switch keeps content + renderer in lockstep.
export function LessonVisualRenderer({ visual }: { visual: LessonVisual }) {
  switch (visual.type) {
    case 'systemRow':
      return (
        <div className="grid grid-cols-2 gap-2">
          {visual.nodes.map((n) => (
            <SystemNode key={n.id} {...n} />
          ))}
        </div>
      )
    case 'layerStack':
      return <LayerStack {...visual.data} />
    case 'tokenBudget':
      return <TokenBudgetBar {...visual.data} />
    case 'trace':
      return <TraceTimeline {...visual.data} />
    case 'flow':
      return (
        <div>
          {visual.steps.map((s, i) => (
            <FlowStep key={s.index} {...s} connector={i < visual.steps.length - 1} />
          ))}
        </div>
      )
    case 'decisionPair':
      return (
        <div className="flex flex-col gap-2">
          {visual.cards.map((c) => (
            <DecisionCard key={c.id} {...c} />
          ))}
        </div>
      )
    case 'scoreMeter':
      return <ScoreMeter {...visual.data} />
    case 'compactFallback':
      return <CompactFallbackView {...visual.data} />
  }
}
