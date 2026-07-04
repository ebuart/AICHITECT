import { Badge } from '@/components/ui/Badge'
import { RoadmapNodeCard } from './RoadmapNodeCard'
import type { RoadmapArcView } from './useRoadmap'

// One roadmap arc: header (English title + German goal + progress) and its nodes.
export function RoadmapArcSection({ view }: { view: RoadmapArcView }) {
  const { arc, nodes, completed } = view
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold tracking-wide text-white">
            {arc.title}
          </h2>
          <p className="text-xs text-deck-muted">{arc.goal}</p>
        </div>
        <Badge tone={completed === nodes.length ? 'success' : 'neutral'}>
          {completed}/{nodes.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        {nodes.map((nodeView) => (
          <RoadmapNodeCard key={nodeView.node.id} view={nodeView} />
        ))}
      </div>
    </section>
  )
}
