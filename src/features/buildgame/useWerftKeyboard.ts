import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'
import {
  ZONES,
  applyMissions,
  buildingById,
  buy,
  canBuy,
  isOwned,
  placeNode,
  unplaceNode,
  type GameState,
} from './gameModel'
import type { SkillCanvasHandle } from './SkillCanvas'

// Full keyboard control for the Werft (extracted from BuildGamePage, FL-0069):
// WASD/Arrows = pan (or, with a node selected, navigate selection in the Shop / move the
// node's phase on the Karte) · Shift+them zoom · F Shop↔Karte · Q/E select · Space buy-or-time ·
// C details(+scroll) · Tab select · X unplace · T info · R release · J quests · H help · Esc close.

/** Latest UI values for the once-bound key handler (written by the page each render). */
export interface KbSnapshot {
  view: 'tree' | 'map'
  selected: string | null
  detailsOpen: boolean
  infoOpen: boolean
  helpOpen: boolean
  questsOpen: boolean
  onboardOpen: boolean
  selectableIds: string[]
  nodePos: Record<string, { x: number; y: number }>
}

type Dir = 'up' | 'down' | 'left' | 'right'

export function useWerftKeyboard({
  kb,
  csRef,
  canvasRef,
  detailsScrollRef,
  setCs,
  setSelected,
  setView,
  setDetailsOpen,
  setInfoOpen,
  setHelpOpen,
  setQuestsOpen,
  setSpeed,
  closeOnboard,
  ship,
}: {
  kb: RefObject<KbSnapshot>
  csRef: RefObject<GameState>
  canvasRef: RefObject<SkillCanvasHandle | null>
  detailsScrollRef: RefObject<HTMLDivElement | null>
  setCs: Dispatch<SetStateAction<GameState>>
  setSelected: Dispatch<SetStateAction<string | null>>
  setView: Dispatch<SetStateAction<'tree' | 'map'>>
  setDetailsOpen: Dispatch<SetStateAction<boolean>>
  setInfoOpen: Dispatch<SetStateAction<boolean>>
  setHelpOpen: Dispatch<SetStateAction<boolean>>
  setQuestsOpen: Dispatch<SetStateAction<boolean>>
  setSpeed: Dispatch<SetStateAction<number>>
  closeOnboard: () => void
  ship: () => void
}): void {
  useEffect(() => {
    const PAN = 70
    const cycleSelect = (d: number) => {
      const ids = kb.current.selectableIds
      if (!ids.length) return
      const i = kb.current.selected ? ids.indexOf(kb.current.selected) : -1
      setSelected(ids[(((i + d) % ids.length) + ids.length) % ids.length])
    }
    // Spatial selection (Shop view): jump to the nearest node in the pressed direction.
    const navigateSelect = (d: Dir) => {
      const { selectableIds, selected, nodePos } = kb.current
      if (!selected || !nodePos[selected]) return cycleSelect(d === 'down' || d === 'right' ? 1 : -1)
      const cp = nodePos[selected]
      let best: string | null = null
      let bestScore = Infinity
      for (const id of selectableIds) {
        if (id === selected) continue
        const p = nodePos[id]
        if (!p) continue
        const dx = p.x - cp.x
        const dy = p.y - cp.y
        let along: number
        let across: number
        let ok: boolean
        if (d === 'right') { ok = dx > 6; along = dx; across = Math.abs(dy) }
        else if (d === 'left') { ok = dx < -6; along = -dx; across = Math.abs(dy) }
        else if (d === 'down') { ok = dy > 6; along = dy; across = Math.abs(dx) }
        else { ok = dy < -6; along = -dy; across = Math.abs(dx) }
        if (!ok) continue
        const score = along + across * 2.5 // prefer aligned + near
        if (score < bestScore) { bestScore = score; best = id }
      }
      if (best) setSelected(best)
    }
    const moveZone = (d: number) => {
      const id = kb.current.selected
      if (!id || id === 'charter') return
      setCs((prev) => {
        if (!isOwned(prev, id)) return prev
        const cur = prev.placed[id] ? ZONES.indexOf(prev.placed[id]) : -1
        const ni = Math.max(0, Math.min(ZONES.length - 1, cur < 0 ? 0 : cur + d))
        return applyMissions(placeNode(prev, id, ZONES[ni]))
      })
    }
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const st = kb.current
      const dir: Dir | null = k === 'w' || k === 'arrowup' ? 'up' : k === 's' || k === 'arrowdown' ? 'down' : k === 'a' || k === 'arrowleft' ? 'left' : k === 'd' || k === 'arrowright' ? 'right' : null
      if (dir) {
        e.preventDefault()
        if (e.shiftKey) return canvasRef.current?.zoomBy(dir === 'up' || dir === 'right' ? 1.15 : 0.87)
        if (st.detailsOpen) return void detailsScrollRef.current?.scrollBy({ top: dir === 'up' ? -80 : dir === 'down' ? 80 : 0, behavior: 'smooth' })
        if (st.selected) {
          if (st.view === 'map') return moveZone(dir === 'left' || dir === 'up' ? -1 : 1) // move phase
          return navigateSelect(dir) // Shop: navigate selection spatially
        }
        return canvasRef.current?.panBy(dir === 'left' ? PAN : dir === 'right' ? -PAN : 0, dir === 'up' ? PAN : dir === 'down' ? -PAN : 0)
      }
      switch (k) {
        case 'f': // toggle Shop ↔ Karte
          setView((v) => (v === 'tree' ? 'map' : 'tree'))
          setSelected(null)
          setInfoOpen(false)
          break
        case 'q': // select previous node
          cycleSelect(-1)
          break
        case 'e': // select next node
          cycleSelect(1)
          break
        case ' ': {
          if (el?.tagName === 'BUTTON') return // let a focused button take Space
          e.preventDefault()
          const id = st.selected
          const b = id ? buildingById(id) : undefined
          if (b && canBuy(csRef.current, b).ok) setCs((prev) => applyMissions(buy(prev, id!)))
          else setSpeed((s) => (s === 0 ? 1 : 0))
          break
        }
        case 'c':
          setDetailsOpen((o) => !o)
          break
        case 'Tab':
          e.preventDefault()
          cycleSelect(e.shiftKey ? -1 : 1)
          break
        case 'x':
          if (st.selected) setCs((prev) => applyMissions(unplaceNode(prev, st.selected!)))
          break
        case 't':
          if (st.selected) setInfoOpen((o) => !o)
          break
        case 'r':
          ship()
          break
        case 'j': // quest board (journal)
          setQuestsOpen((o) => !o)
          break
        case 'h':
        case '?':
          setHelpOpen((o) => !o)
          break
        case 'Escape':
          if (st.onboardOpen) closeOnboard()
          else if (st.helpOpen) setHelpOpen(false)
          else if (st.questsOpen) setQuestsOpen(false)
          else if (st.infoOpen) setInfoOpen(false)
          else if (st.selected) setSelected(null)
          else if (st.detailsOpen) setDetailsOpen(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
