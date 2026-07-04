import type { NodeStatus } from '@/types'
import { cn } from '@/lib/utils/cn'
import { useRoadmap } from '@/features/roadmap/useRoadmap'
import { QUEST_MAP } from '@/content/werft/questMap'
import { buildingById } from './gameModel'

// The Werft quest board: the roadmap re-surfaced as quests. Each node shows its status + the reward
// it grants in the game (+Budget · unlocked skills). Tapping a node opens its lesson. Progress is the
// source of truth (via useRoadmap), so completing a lesson reflects here AND funds/unlocks the Werft.
const STATUS: Record<NodeStatus, { icon: string; cls: string }> = {
  completed: { icon: '✓', cls: 'text-deck-success' },
  in_progress: { icon: '▸', cls: 'text-white' },
  available: { icon: '○', cls: 'text-white' },
  locked: { icon: '🔒', cls: 'text-deck-muted' },
}

export function QuestBoard({ onOpenLesson, onClose }: { onOpenLesson: (nodeId: string) => void; onClose: () => void }) {
  const { arcs, completedCount, total } = useRoadmap()
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex" onClick={onClose}>
      <div
        className="flex h-full w-[min(460px,96vw)] flex-col border-r border-deck-border bg-deck-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-deck-border-dim p-3">
          <div>
            <h2 className="text-base font-semibold text-white">Quests</h2>
            <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">Lerne, um zu bauen · {completedCount}/{total} erledigt</p>
          </div>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">✕</button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          {arcs.map(({ arc, nodes, completed }) => (
            <section key={arc.id} className="flex flex-col gap-1">
              <h3 className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
                {arc.title} · {completed}/{nodes.length}
              </h3>
              {nodes.map(({ node, status }) => {
                const q = QUEST_MAP[node.id]
                const st = STATUS[status] ?? STATUS.locked
                const skills = q?.skills?.map((s) => buildingById(s)?.name ?? s).join(', ')
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      onOpenLesson(node.id)
                      onClose()
                    }}
                    className="flex flex-col gap-0.5 border-l-2 border-deck-border-dim px-2 py-1.5 text-left transition-colors hover:border-white"
                  >
                    <span className={cn('text-[12px] leading-snug', status === 'locked' ? 'text-deck-muted' : 'text-white')}>
                      <span className={cn('font-typer', st.cls)}>{st.icon} </span>
                      {node.title}
                    </span>
                    {q && (
                      <span className={cn('font-typer text-[10px]', status === 'completed' ? 'text-deck-success' : 'text-deck-muted')}>
                        {status === 'completed' ? '✓ eingelöst' : `+${q.budget} €${skills ? ` · schaltet ${skills} frei` : ''}`}
                      </span>
                    )}
                  </button>
                )
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
