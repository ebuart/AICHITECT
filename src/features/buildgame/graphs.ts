import {
  BUILDINGS,
  CHARTER_ID,
  ZONES,
  ZONE_LABEL,
  buildingById,
  isCorrectlyPlaced,
  isOwned,
  isPlaced,
  placedZone,
  requiresMet,
  tierOf,
  type GameState,
  type Zone,
} from './gameModel'
import { isQuestSkill } from '@/content/werft/questMap'
import type { CanvasEdge, CanvasLabel, CanvasNode, NodeState } from './SkillCanvas'

const questLocked = (cs: GameState, id: string) => isQuestSkill(id) && !cs.learned.includes(id)

// The two views are DIFFERENT TOOLS that need each other:
//
//  • SKILLTREE (skilltreeGraph) — the SHOP. A real branching TREE of ALL ~53 skills rooted at the
//    Charter (tidy-tree over the prerequisite graph): the root fans into 7 branch-roots, each
//    forking where a skill unlocks several. Locked / available / partial / built states. You BUY
//    here. Read-only layout (no dragging).
//
//  • SYSTEM-KARTE (systemMapGraph) — the ARCHITECTURE you BUILD. Shows ONLY the skills you already
//    OWN: a "Lager" column on the left holds owned-but-unplaced skills; you DRAG them onto the
//    canvas to wire them into the request-flow spine (User → Modell → Tools → Antwort). Placing a
//    skill grants a bonus, so you can't skip this view. No preview of un-bought skills, no
//    predetermined path — the layout is yours.

export interface Graph {
  worldW: number
  worldH: number
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  labels: CanvasLabel[]
  elbow: 'h' | 'v'
  /** Vertical guide lines (x positions) — used to draw the request-phase lane separators. */
  dividers?: number[]
}

// ── System-Karte lane geometry (the request pipeline, left→right) ─────────────
// Exported so BuildGamePage can map a drop's x → phase and decide Lager-vs-lane by y.
export const LANE_W = 190
export const LAGER_TOP = 44
export const LAGER_H = 104
export const LANES_TOP = LAGER_TOP + LAGER_H // y below this = the lanes; above = the Lager band
const LANE_BODY_H = 560
export const MAP_W = ZONES.length * LANE_W
export const MAP_H = LANES_TOP + LANE_BODY_H
export const laneCenterX = (z: Zone): number => ZONES.indexOf(z) * LANE_W + LANE_W / 2
export const laneAtX = (x: number): Zone => ZONES[Math.max(0, Math.min(ZONES.length - 1, Math.floor(x / LANE_W)))]

const levelOf = (cs: GameState, id: string) => cs.levels[id] ?? 0
const isBuilt = (cs: GameState, id: string) => id === CHARTER_ID || levelOf(cs, id) > 0
const ROOTS = BUILDINGS.filter((b) => !(b.requires?.length)).map((b) => b.id)

function stateOf(cs: GameState, id: string): NodeState {
  if (id === CHARTER_ID) return 'built'
  const b = buildingById(id)!
  const lvl = levelOf(cs, id)
  if (lvl >= b.maxLevel) return 'built'
  if (lvl > 0) return 'partial'
  if (questLocked(cs, id)) return 'locked' // quest-gated: looks locked until its lesson is done
  if (tierOf(cs) >= b.depth && requiresMet(cs, b)) return 'available'
  return 'locked'
}

// ── SKILLTREE (shop) ─────────────────────────────────────────────────────────
// Tidy-tree positions: each node sits under its PRIMARY parent (requires[0], else the Charter);
// leaves take sequential x-slots, internal nodes centre over their children → a branching tree.
function treePositions(): { pos: Record<string, { x: number; y: number }>; w: number; h: number } {
  const primaryParent = (id: string) => buildingById(id)?.requires?.[0] ?? CHARTER_ID
  const children: Record<string, string[]> = {}
  for (const b of BUILDINGS) (children[primaryParent(b.id)] ??= []).push(b.id)
  for (const k of Object.keys(children)) {
    children[k].sort((a, b) => buildingById(a)!.depth - buildingById(b)!.depth || a.localeCompare(b))
  }
  const pos: Record<string, { x: number; y: number }> = {}
  const XGAP = 168
  const YGAP = 148
  const MX = 130
  const MY = 60
  let slot = 0
  let maxDepth = 0
  const place = (id: string, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth)
    const kids = children[id] ?? []
    let x: number
    if (!kids.length) x = slot++
    else {
      const xs = kids.map((k) => place(k, depth + 1))
      x = (xs[0] + xs[xs.length - 1]) / 2
    }
    pos[id] = { x: MX + x * XGAP, y: MY + depth * YGAP }
    return x
  }
  place(CHARTER_ID, 0)
  return { pos, w: MX + slot * XGAP + 60, h: MY + maxDepth * YGAP + 120 }
}

export function skilltreeGraph(cs: GameState): Graph {
  const { pos, w, h } = treePositions()
  const mkNode = (id: string): CanvasNode => {
    const b = buildingById(id)!
    const filled = id === CHARTER_ID ? tierOf(cs) : levelOf(cs, id)
    return {
      id,
      x: pos[id].x,
      y: pos[id].y,
      label: b.name,
      sub: id === CHARTER_ID ? `Tier ${tierOf(cs)}` : undefined,
      state: stateOf(cs, id),
      selectable: true,
      quest: id !== CHARTER_ID && questLocked(cs, id),
      pips: { filled, total: b.maxLevel },
    }
  }
  const nodes = [CHARTER_ID, ...BUILDINGS.map((b) => b.id)].map(mkNode)
  const edges: CanvasEdge[] = []
  for (const b of BUILDINGS) {
    for (const req of b.requires ?? []) edges.push({ from: req, to: b.id, active: isBuilt(cs, req) && isBuilt(cs, b.id) })
  }
  for (const root of ROOTS) edges.push({ from: CHARTER_ID, to: root, active: isBuilt(cs, root) })
  return { worldW: w, worldH: h, nodes, edges, labels: [], elbow: 'v' }
}

// ── SYSTEM-KARTE (placement = architecture) ───────────────────────────────────
// Only OWNED skills appear. Unplaced ones wait in the "Lager" band along the top; you drag each into
// one of the request-phase LANES (Grenze → Wissen → Modell → Tools → Prüfung → Betrieb). Dropping in
// the RIGHT phase marks it correct (✓ + its stat bonus); the wrong phase marks it ✗ (with a lesson in
// the side panel). Within a lane, skills auto-stack — the meaningful choice is WHICH phase, not x/y.
const NODE_GAP = 56

export function systemMapGraph(cs: GameState): Graph {
  const owned = BUILDINGS.filter((b) => isOwned(cs, b.id))
  const placedList = owned.filter((b) => isPlaced(cs, b.id))
  const staged = owned.filter((b) => !isPlaced(cs, b.id))

  // Fit width to the Lager row if it's long; height to the fullest lane.
  const lagerW = Math.max(MAP_W, 80 + staged.length * 150 + 60)
  const perLane: Record<string, number> = {}
  let tallest = 0
  for (const b of placedList) {
    const z = placedZone(cs, b.id)!
    perLane[z] = (perLane[z] ?? 0) + 1
    tallest = Math.max(tallest, perLane[z])
  }
  const worldW = lagerW
  const worldH = Math.max(MAP_H, LANES_TOP + 40 + tallest * NODE_GAP + 40)

  const nodes: CanvasNode[] = []
  // Lager band (unplaced owned skills) — drag one DOWN into a phase to place it.
  staged.forEach((b, i) =>
    nodes.push({
      id: b.id,
      x: 80 + i * 150,
      y: LAGER_TOP + LAGER_H / 2,
      label: b.name,
      state: stateOf(cs, b.id),
      selectable: true,
      draggable: true,
      staged: true,
      pips: { filled: levelOf(cs, b.id), total: b.maxLevel },
    }),
  )
  // Placed skills — auto-stacked inside their lane (phase).
  const fill: Record<string, number> = {}
  for (const b of placedList) {
    const z = placedZone(cs, b.id)!
    const row = fill[z] ?? 0
    fill[z] = row + 1
    nodes.push({
      id: b.id,
      x: laneCenterX(z),
      y: LANES_TOP + 40 + row * NODE_GAP,
      label: b.name,
      state: stateOf(cs, b.id),
      selectable: true,
      draggable: true,
      mark: isCorrectlyPlaced(cs, b.id) ? 'correct' : 'wrong',
      pips: { filled: levelOf(cs, b.id), total: b.maxLevel },
    })
  }

  // Prerequisite wires — only between skills you've actually PLACED (your real architecture).
  const edges: CanvasEdge[] = []
  for (const b of placedList) {
    for (const req of b.requires ?? []) {
      if (isOwned(cs, req) && isPlaced(cs, req)) edges.push({ from: req, to: b.id, active: true })
    }
  }

  // Lane separators + phase headers (numbered to read as a left→right flow).
  const dividers = ZONES.slice(1).map((_, i) => (i + 1) * LANE_W)
  const labels: CanvasLabel[] = [{ text: 'Lager — in die richtige Phase ziehen ↓', x: lagerW / 2, y: LAGER_TOP - 22 }]
  ZONES.forEach((z, i) => labels.push({ text: `${i + 1} · ${ZONE_LABEL[z].toUpperCase()}`, x: laneCenterX(z), y: LANES_TOP - 18 }))

  return { worldW, worldH, nodes, edges, labels, elbow: 'h', dividers }
}
