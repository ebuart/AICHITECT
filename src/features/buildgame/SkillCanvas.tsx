import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

// A generic pan/zoom canvas of KNIME-style nodes + elbow wires. Drag empty space to pan, wheel/
// pinch to zoom, +/−/⊙ buttons. Nodes are HTML (crisp text + tap targets, status light + level
// pips + ports); wires are one SVG of orthogonal "elbow" paths behind them (white + animated when
// both ends are built). Tap a node (without dragging) selects it.
//
// Two modes:
//  • SKILLTREE (draggable=false) — read-only shop tree; tap to buy/upgrade.
//  • SYSTEM-KARTE (draggable=true) — drag owned skills to POSITION them on the architecture;
//    onMoveNode commits the new world coordinate. Node dragging beats panning when you grab a node.
export type NodeState = 'built' | 'partial' | 'available' | 'locked' | 'fixed'
export interface CanvasNode {
  id: string
  x: number
  y: number
  label: string
  sub?: string
  state: NodeState
  selectable?: boolean
  /** May this node be dragged (when the canvas is in draggable mode)? Default true. */
  draggable?: boolean
  /** Owned-but-not-yet-placed: render as a dashed "in storage" chip. */
  staged?: boolean
  /** Placement correctness badge (System-Karte): right phase ✓ / wrong phase ✗. */
  mark?: 'correct' | 'wrong'
  /** Quest-gated: not buildable until its roadmap lesson is done — shown with a 🔒 badge. */
  quest?: boolean
  /** Level pips, e.g. {filled:1,total:3}. */
  pips?: { filled: number; total: number }
}
export interface CanvasEdge {
  from: string
  to: string
  active: boolean
}
export interface CanvasLabel {
  text: string
  x: number
  y: number
}

const MIN_K = 0.4
const MAX_K = 1.8
const clampK = (k: number) => Math.max(MIN_K, Math.min(MAX_K, k))

export interface SkillCanvasHandle {
  /** Pan the view by screen-pixel deltas (keyboard control). */
  panBy: (dx: number, dy: number) => void
  /** Zoom around the viewport centre by a factor (>1 in, <1 out). */
  zoomBy: (factor: number) => void
}
interface SkillCanvasProps {
  worldW: number
  worldH: number
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  labels?: CanvasLabel[]
  /** Vertical guide lines (world x) — request-phase lane separators. */
  dividers?: number[]
  elbow?: 'h' | 'v'
  selectedId: string | null
  onSelect: (id: string) => void
  /** Enable free node-dragging (System-Karte placement mode). */
  draggable?: boolean
  /** Commit a node's new world position (called on drag end). */
  onMoveNode?: (id: string, x: number, y: number) => void
  /** Fill the parent (h-full) instead of a fixed viewport height — for the fullscreen HUD. */
  fill?: boolean
  /** Pulse the request-phase lanes (a "time is flowing" cue while the clock runs). */
  animate?: boolean
}
export const SkillCanvas = forwardRef<SkillCanvasHandle, SkillCanvasProps>(function SkillCanvas(
  { worldW, worldH, nodes, edges, labels, dividers, elbow = 'v', selectedId, onSelect, draggable = false, onMoveNode, fill = false, animate = false },
  ref,
) {
  const vpRef = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0, k: 0.8 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const lastSingle = useRef<{ x: number; y: number } | null>(null)
  const lastDist = useRef(0)
  const moved = useRef(false)
  // Node-drag + tap bookkeeping.
  const dragId = useRef<string | null>(null)
  const grab = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const downClient = useRef({ x: 0, y: 0 })
  const downNode = useRef<string | null>(null) // selectable node under the press (for tap-select)
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null)

  // Live node positions (drag overrides the graph position). Render reads the memo;
  // pointer handlers read the ref (kept in sync via effect) so they never go stale.
  const posMap = useMemo(
    () =>
      Object.fromEntries(
        nodes.map((n) => [n.id, dragPos?.id === n.id ? { x: dragPos.x, y: dragPos.y } : { x: n.x, y: n.y }]),
      ) as Record<string, { x: number; y: number }>,
    [nodes, dragPos],
  )
  const pos = useRef<Record<string, { x: number; y: number }>>({})
  useEffect(() => {
    pos.current = posMap
  }, [posMap])

  // Fit-to-view ONCE per mount. (Placement changes worldH as the Lager shrinks; re-fitting on every
  // drop would yank the camera. The parent remounts us with key={view} so each view still gets a fit.)
  const fitted = useRef(false)
  useLayoutEffect(() => {
    if (fitted.current) return
    const vp = vpRef.current
    if (!vp) return
    const k = clampK(Math.min(vp.clientWidth / worldW, vp.clientHeight / worldH) * 0.92)
    setT({ k, x: (vp.clientWidth - worldW * k) / 2, y: (vp.clientHeight - worldH * k) / 2 })
    fitted.current = true
  }, [worldW, worldH])

  const localPt = (clientX: number, clientY: number) => {
    const r = vpRef.current!.getBoundingClientRect()
    return { x: clientX - r.left, y: clientY - r.top }
  }
  // Client → world (un-translate, un-scale). Valid while t is stable (no pan/zoom mid node-drag).
  const worldPt = (clientX: number, clientY: number) => {
    const r = vpRef.current!.getBoundingClientRect()
    return { x: (clientX - r.left - t.x) / t.k, y: (clientY - r.top - t.y) / t.k }
  }
  const zoomAround = (px: number, py: number, factor: number) =>
    setT((cur) => {
      const k = clampK(cur.k * factor)
      const f = k / cur.k
      return { k, x: px - (px - cur.x) * f, y: py - (py - cur.y) * f }
    })

  const onPointerDown = (e: React.PointerEvent) => {
    // Capture keeps move/up events flowing during a drag. Guarded: jsdom doesn't implement it, and a
    // stray throw must not kill the gesture.
    try {
      vpRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* unsupported */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    moved.current = false
    downClient.current = { x: e.clientX, y: e.clientY }
    const el = (e.target as Element).closest?.('[data-node-id]') as HTMLElement | null
    downNode.current = el?.dataset.nodeId ?? null // selection happens on pointerUP, see endPointer
    // Grab a node to drag it? (placement mode only, single pointer, node opted-in via data-node-drag)
    if (draggable && pointers.current.size === 1 && el?.dataset.nodeDrag != null && downNode.current && pos.current[downNode.current]) {
      dragId.current = downNode.current
      const n = pos.current[downNode.current]
      const p = worldPt(e.clientX, e.clientY)
      grab.current = { x: p.x - n.x, y: p.y - n.y }
      lastPos.current = { x: n.x, y: n.y }
      lastSingle.current = null
      return
    }
    if (pointers.current.size === 1) lastSingle.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (dragId.current) {
      if (Math.abs(e.clientX - downClient.current.x) + Math.abs(e.clientY - downClient.current.y) > 3) moved.current = true
      const p = worldPt(e.clientX, e.clientY)
      const np = { x: p.x - grab.current.x, y: p.y - grab.current.y }
      lastPos.current = np
      setDragPos({ id: dragId.current, ...np })
      return
    }
    const pts = [...pointers.current.values()]
    if (pts.length === 1 && lastSingle.current) {
      const dx = e.clientX - lastSingle.current.x
      const dy = e.clientY - lastSingle.current.y
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
      lastSingle.current = { x: e.clientX, y: e.clientY }
      setT((cur) => ({ ...cur, x: cur.x + dx, y: cur.y + dy }))
    } else if (pts.length === 2) {
      moved.current = true
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const mid = localPt((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2)
      if (lastDist.current) zoomAround(mid.x, mid.y, dist / lastDist.current)
      lastDist.current = dist
    }
  }
  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) lastDist.current = 0
    if (dragId.current) {
      // Dragged → commit the new position; barely moved → treat as a tap and select it.
      if (moved.current) onMoveNode?.(dragId.current, lastPos.current.x, lastPos.current.y)
      else if (downNode.current) onSelect(downNode.current)
      dragId.current = null
      setDragPos(null)
      downNode.current = null
      return
    }
    if (pointers.current.size === 0) {
      // A clean tap on a node (no pan/zoom) selects it. We do this on pointerUP rather than via the
      // native click event because capturing the pointer can retarget click away from the node
      // (notably on touch) — which previously made tapping/buying silently fail.
      if (!moved.current && downNode.current) onSelect(downNode.current)
      downNode.current = null
    }
    if (pointers.current.size === 1) {
      const [p] = pointers.current.values()
      lastSingle.current = { x: p.x, y: p.y }
    }
  }

  useEffect(() => {
    const vp = vpRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const p = localPt(e.clientX, e.clientY)
      zoomAround(p.x, p.y, Math.exp(-e.deltaY * 0.0015))
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  const btnZoom = (factor: number) => {
    const vp = vpRef.current
    if (vp) zoomAround(vp.clientWidth / 2, vp.clientHeight / 2, factor)
  }
  const center = () => {
    const vp = vpRef.current
    if (vp) setT((cur) => ({ k: cur.k, x: (vp.clientWidth - worldW * cur.k) / 2, y: (vp.clientHeight - worldH * cur.k) / 2 }))
  }

  // Imperative handle for keyboard control (pan/zoom from BuildGamePage's key bindings).
  useImperativeHandle(
    ref,
    () => ({
      panBy: (dx, dy) => setT((c) => ({ ...c, x: c.x + dx, y: c.y + dy })),
      zoomBy: (factor) => {
        const vp = vpRef.current
        if (vp) zoomAround(vp.clientWidth / 2, vp.clientHeight / 2, factor)
      },
    }),
    [],
  )

  const elbowPath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    if (elbow === 'h') {
      const mx = (a.x + b.x) / 2
      return `M ${a.x} ${a.y} L ${mx} ${a.y} L ${mx} ${b.y} L ${b.x} ${b.y}`
    }
    const my = (a.y + b.y) / 2
    return `M ${a.x} ${a.y} L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${b.y}`
  }

  return (
    <div className={cn('relative', fill ? 'h-full' : '')}>
      <div
        ref={vpRef}
        className={cn(
          'relative touch-none select-none overflow-hidden border border-deck-border',
          fill ? 'h-full bg-transparent' : 'h-[66vh] min-h-80 bg-deck-bg',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: worldW, height: worldH, transform: `translate(${t.x}px,${t.y}px) scale(${t.k})` }}
        >
          <svg className="absolute left-0 top-0" width={worldW} height={worldH}>
            {animate && dividers && dividers.length > 0
              ? [0, ...dividers].map((x0, i, arr) => {
                  const x1 = arr[i + 1] ?? worldW
                  return <rect key={`lane${i}`} x={x0} y={0} width={x1 - x0} height={worldH} className="fill-deck-accent deck-lane-pulse" style={{ animationDelay: `${i * 0.7}s` }} />
                })
              : null}
            {dividers?.map((x, i) => (
              <line key={`d${i}`} x1={x} y1={0} x2={x} y2={worldH} className="stroke-deck-border-dim" strokeWidth={1} strokeDasharray="2 6" />
            ))}
            {edges.map((e, i) => {
              const a = posMap[e.from]
              const b = posMap[e.to]
              if (!a || !b) return null
              return (
                <path
                  key={i}
                  d={elbowPath(a, b)}
                  fill="none"
                  strokeWidth={1.4}
                  strokeDasharray={e.active ? undefined : '5 5'}
                  className={cn('transition-[stroke] duration-500', e.active ? 'stroke-deck-border' : 'stroke-deck-border-dim')}
                />
              )
            })}
          </svg>
          {labels?.map((l, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 whitespace-nowrap font-typer text-[10px] uppercase tracking-widest text-deck-muted"
              style={{ left: l.x, top: l.y }}
            >
              {l.text}
            </span>
          ))}
          {nodes.map((n) => {
            const p = posMap[n.id]
            return (
              <NodeBox
                key={n.id}
                n={n}
                x={p.x}
                y={p.y}
                selected={selectedId === n.id}
                draggable={draggable && n.draggable !== false && n.selectable !== false}
                onTap={() => {
                  if (!moved.current && n.selectable !== false) onSelect(n.id)
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="absolute right-1.5 top-1.5 flex flex-col gap-1">
        <CtrlBtn label="+" onClick={() => btnZoom(1.25)} />
        <CtrlBtn label="−" onClick={() => btnZoom(0.8)} />
        <CtrlBtn label="⊙" onClick={center} />
      </div>
    </div>
  )
})

function CtrlBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-7 w-7 border border-deck-border-dim bg-deck-bg font-typer text-sm text-white hover:border-white"
    >
      {label}
    </button>
  )
}

const STATE_BOX: Record<NodeState, string> = {
  built: 'border-white text-white',
  partial: 'border-white text-white',
  available: 'border-white text-white', // buildable now — pops vs locked
  locked: 'border-deck-border-dim text-deck-muted opacity-50',
  fixed: 'border-deck-border-dim text-deck-muted',
}
// KNIME-style status light.
const STATE_LIGHT: Record<NodeState, string> = {
  built: 'bg-deck-success',
  partial: 'bg-deck-warning',
  available: 'border border-white',
  locked: 'border border-deck-border-dim',
  fixed: 'bg-deck-border-dim',
}

function NodeBox({
  n,
  x,
  y,
  selected,
  draggable,
  onTap,
}: {
  n: CanvasNode
  x: number
  y: number
  selected: boolean
  draggable: boolean
  onTap: () => void
}) {
  const W = 118
  return (
    <button
      type="button"
      onClick={onTap}
      draggable={false}
      data-node-id={n.selectable === false ? undefined : n.id}
      data-node-drag={draggable ? '' : undefined}
      className={cn(
        'absolute flex flex-col gap-1 border bg-deck-bg px-2 py-1.5 text-left transition-colors',
        // Selected = full INVERSE (ink box, paper text) — unmistakable on either theme, and readable
        // (the old white-ring-on-white-border was nearly invisible).
        selected ? 'z-10 border-white bg-white text-black ring-2 ring-deck-accent ring-offset-2 ring-offset-deck-bg' : STATE_BOX[n.state],
        n.staged && !selected && 'border-dashed opacity-75',
        n.mark === 'wrong' && !selected && 'border-deck-danger',
        draggable && 'cursor-grab active:cursor-grabbing',
      )}
      style={{ left: x, top: y, width: W, transform: 'translate(-50%,-50%)' }}
    >
      {n.mark && !selected && (
        <span
          aria-hidden
          className={cn(
            'absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center border bg-deck-bg font-typer text-[8px] leading-none',
            n.mark === 'correct' ? 'border-deck-success text-deck-success' : 'border-deck-danger text-deck-danger',
          )}
        >
          {n.mark === 'correct' ? '✓' : '✗'}
        </span>
      )}
      {n.quest && !selected && (
        <span
          aria-hidden
          title="Quest nötig"
          className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center border border-deck-warning bg-deck-bg text-[9px] leading-none text-deck-warning"
        >
          🔒
        </span>
      )}
      {n.state !== 'fixed' && (
        <>
          <span aria-hidden className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 border border-deck-border-dim bg-deck-bg" />
          <span aria-hidden className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 border border-deck-border-dim bg-deck-bg" />
        </>
      )}
      <span className="flex items-center gap-1.5">
        <span aria-hidden className={cn('h-2 w-2 shrink-0 transition-colors', selected ? 'bg-black' : STATE_LIGHT[n.state])} />
        <span className="font-typer text-[11px] font-semibold leading-tight">{n.label}</span>
      </span>
      {n.pips && n.pips.total > 0 ? (
        <span className="flex items-center gap-0.5" aria-hidden>
          {Array.from({ length: n.pips.total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 w-2 border',
                i < n.pips!.filled
                  ? selected
                    ? 'border-black bg-black'
                    : 'border-white bg-white'
                  : selected
                    ? 'border-black/40'
                    : 'border-deck-border-dim',
              )}
            />
          ))}
        </span>
      ) : n.sub ? (
        <span className={cn('font-typer text-[9px] leading-none', selected ? 'text-black' : 'text-deck-muted')}>{n.sub}</span>
      ) : null}
    </button>
  )
}
