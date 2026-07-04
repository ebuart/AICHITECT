import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useProgress } from '@/features/progress/useProgress'
import { useRoadmap } from '@/features/roadmap/useRoadmap'
import { QUEST_MAP, SKILL_QUEST } from '@/content/werft/questMap'
import { firstLessonForNode } from '@/content/lessons'
import { paths } from '@/routes/paths'
import {
  BRANCH_LABEL,
  MISSIONS,
  RELEASE_EVERY,
  ZONE_LABEL,
  ZONES,
  activeSynergies,
  applyMissions,
  architectureScore,
  buildingById,
  builtCount,
  buy,
  canBuy,
  canPrestige,
  canonicalZone,
  dayIncome,
  doPrestige,
  deriveStats,
  eventById,
  handleEvent,
  isCorrectlyPlaced,
  isMature,
  isOwned,
  isPlaced,
  loadGame,
  nextCost,
  placeNode,
  PLACE_BONUS,
  placedZone,
  releaseDefense,
  releaseThreat,
  resetGame,
  saveGame,
  shipRelease,
  tick,
  tierCapped,
  tierOf,
  unplaceNode,
  zonesFor,
  type Building,
  type GameState,
  type ReleaseOutcome,
  type Stat,
} from './gameModel'
import { SkillCanvas, type SkillCanvasHandle } from './SkillCanvas'
import { LANES_TOP, laneAtX, skilltreeGraph, systemMapGraph } from './graphs'
import { NODE_INFO, ZONE_INFO } from './nodeInfo'
import { reconcileQuests } from './questBridge'
import { QuestBoard } from './QuestBoard'
import { WerftTour } from './WerftTour'

const ONBOARD_KEY = 'flightdeck.werft.onboarded'
const seenOnboarding = () => {
  try {
    return !!localStorage.getItem(ONBOARD_KEY)
  } catch {
    return true
  }
}
const markOnboarded = () => {
  try {
    localStorage.setItem(ONBOARD_KEY, '1')
  } catch {
    /* storage unavailable */
  }
}

// Build-Sim ("Werft"): a persistent base-builder over your AI system. The SKILLTREE is the shop
// (buy + level, sorted by topic & prerequisite depth); the MAP is the KNIME-style architecture
// view. Both are one pan/zoom canvas — tap a node to buy/upgrade. Persists to localStorage.
const STAT_LABEL: Record<Stat, string> = {
  quality: 'Qualität',
  security: 'Sicherheit',
  velocity: 'Tempo',
  resilience: 'Resilienz',
}
const SHORT_STAT: Record<Stat, string> = { quality: 'Qual', security: 'Sich', velocity: 'Tempo', resilience: 'Res' }
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function BuildGamePage() {
  const [cs, setCs] = useState<GameState>(() => loadGame())
  const [banner, setBanner] = useState<ReleaseOutcome | null>(null)
  const [view, setView] = useState<'tree' | 'map'>('tree')
  const [selected, setSelected] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [resetArmed, setResetArmed] = useState(false)
  const [speed, setSpeed] = useState(0) // 0 = paused, else ticks/“day” multiplier
  const [helpOpen, setHelpOpen] = useState(false)
  const [questsOpen, setQuestsOpen] = useState(false)
  const [onboardOpen, setOnboardOpen] = useState(() => !seenOnboarding()) // auto-show once
  const closeOnboard = () => {
    setOnboardOpen(false)
    markOnboarded()
  }
  const navigate = useNavigate()
  const openLesson = (nodeId: string) => {
    const lesson = firstLessonForNode(nodeId)
    // `?return=werft` so finishing the lesson comes BACK here (reward + unlock land), not the roadmap.
    navigate(lesson ? `${paths.lesson(lesson.id)}?return=werft` : paths.roadmap)
  }
  const canvasRef = useRef<SkillCanvasHandle>(null)
  const detailsScrollRef = useRef<HTMLDivElement>(null)
  const tickAt = useRef(0) // performance.now() of the last day-tick — drives the live release countdown
  useEffect(() => saveGame(cs), [cs])

  // Quests = the roadmap. Completing a lesson grants budget + unlocks its Werft skill ("learn it to
  // build it"). Progress is the source of truth; we reconcile it into the game whenever it changes.
  const { state: progress, ready } = useProgress()
  const completedNodes = useMemo(
    () => Object.entries(progress.roadmap).filter(([, v]) => v.status === 'completed').map(([id]) => id),
    [progress.roadmap],
  )
  useEffect(() => {
    if (ready) setCs((prev) => reconcileQuests(prev, completedNodes))
  }, [ready, completedNodes])
  // The next available lesson (roadmap order) — surfaced as a recommended quest in the HUD.
  const recommendedQuest = useRoadmap().currentNode

  // The clock: while playing, advance one in-game day on an interval. Deliberately leisurely (2.2s/day
  // at 1×) so you can play WHILE time moves without speedrunning. A ref keeps the loop reading the
  // latest state without re-arming the interval every tick.
  const DAY_MS = 2200
  const csRef = useRef(cs)
  csRef.current = cs
  useEffect(() => {
    if (speed === 0) return
    tickAt.current = performance.now()
    const id = setInterval(() => {
      const { state, outcome } = tick(csRef.current)
      tickAt.current = performance.now()
      setCs(applyMissions(state))
      if (outcome) setBanner(outcome)
    }, DAY_MS / speed)
    return () => clearInterval(id)
  }, [speed])
  // Re-render a few times a second while playing so the mm:ss release countdown animates smoothly.
  const [, bumpFrame] = useReducer((n: number) => n + 1, 0)
  useEffect(() => {
    if (speed === 0) return
    const id = setInterval(bumpFrame, 150)
    return () => clearInterval(id)
  }, [speed])

  const stats = deriveStats(cs)
  const defense = releaseDefense(cs)
  const threat = releaseThreat(cs)
  const readiness = defense >= threat ? 'bereit' : defense >= threat - 14 ? 'riskant' : 'zu schwach'
  const graph = view === 'tree' ? skilltreeGraph(cs) : systemMapGraph(cs)
  const sel = selected ? buildingById(selected) : undefined
  const arch = architectureScore(cs)
  // Live mm:ss countdown to the next auto-release (synced to real time at the current speed; it moves
  // fast — one day = DAY_MS/speed). Frozen while paused.
  const daysToRelease = RELEASE_EVERY - (cs.day % RELEASE_EVERY)
  const dayMs = DAY_MS / (speed || 1)
  const intraDay = speed > 0 ? Math.min(dayMs, performance.now() - tickAt.current) : 0
  const releaseSecs = Math.max(0, Math.round((daysToRelease * dayMs - intraDay) / 1000))

  const ship = () => {
    const { state, outcome } = shipRelease(csRef.current)
    setCs(applyMissions(state))
    setBanner(outcome)
  }

  // Latest values for the once-bound key handler (avoids stale closures / re-binding every keypress).
  const kb = useRef({ view, selected, detailsOpen, infoOpen, helpOpen, questsOpen, onboardOpen, selectableIds: [] as string[], nodePos: {} as Record<string, { x: number; y: number }> })
  kb.current = {
    view,
    selected,
    detailsOpen,
    infoOpen,
    helpOpen,
    questsOpen,
    onboardOpen,
    selectableIds: graph.nodes.filter((n) => n.selectable !== false).map((n) => n.id),
    nodePos: Object.fromEntries(graph.nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  }

  // ── Keyboard control: WASD/Arrows = pan (or, with a node selected, navigate selection in the Shop /
  //    move the node's phase on the Karte) · Shift+them zoom · F Shop · Q Karte · Space buy-or-time ·
  //    C details(+scroll) · Tab select · X unplace · T info · R release · H help · Esc close.
  type Dir = 'up' | 'down' | 'left' | 'right'
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
          if (st.onboardOpen) {
            setOnboardOpen(false)
            markOnboarded()
          } else if (st.helpOpen) setHelpOpen(false)
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

  return (
    <div data-tour="canvas" className="relative h-full w-full overflow-hidden">
      {/* breathing dot-paper — animates only while the clock runs (a calm "time is moving" cue) */}
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 deck-dots', speed > 0 && 'deck-dots-anim')} />

      {/* CANVAS — fills the whole screen; the HUD floats over it (YouTube-fullscreen style) */}
      <SkillCanvas
        key={view}
        ref={canvasRef}
        fill
        worldW={graph.worldW}
        worldH={graph.worldH}
        nodes={graph.nodes}
        edges={graph.edges}
        labels={graph.labels}
        dividers={graph.dividers}
        elbow={graph.elbow}
        selectedId={selected}
        onSelect={setSelected}
        draggable={view === 'map'}
        animate={speed > 0}
        onMoveNode={(id, x, y) =>
          setCs((prev) => applyMissions(y < LANES_TOP ? unplaceNode(prev, id) : placeNode(prev, id, laneAtX(x))))
        }
      />

      {/* TOP-LEFT: title + view toggle + coach + release toast (floating, doesn't block the map) */}
      <div className="pointer-events-none absolute left-2 top-2 flex w-[min(420px,76%)] flex-col gap-2 md:left-3 md:top-3">
        <div data-tour="views" className="pointer-events-auto flex items-center gap-1.5 border border-deck-border bg-deck-bg p-1.5">
          <h1 className="px-1 text-sm font-semibold uppercase tracking-tight text-white">Werft{isMature(cs) ? ' 🏆' : ''}</h1>
          <Toggle active={view === 'tree'} onClick={() => setView('tree')}>Shop</Toggle>
          <Toggle active={view === 'map'} onClick={() => setView('map')}>Karte</Toggle>
          <button
            type="button"
            onClick={() => setQuestsOpen((o) => !o)}
            title="Quests (J)"
            className="border border-deck-border-dim px-2.5 py-1.5 font-typer text-[11px] uppercase leading-none text-deck-muted hover:border-white hover:text-white"
          >
            Quests
          </button>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            title="Tastatur (H)"
            aria-label="Tastatur-Hilfe"
            className="border border-deck-border-dim px-2 py-1.5 font-typer text-[11px] leading-none text-deck-muted hover:border-white hover:text-white"
          >
            ⌨
          </button>
        </div>
        <div className="pointer-events-auto flex items-start gap-2 border-l-2 border-deck-accent bg-deck-bg px-2 py-1.5">
          <span className="mt-px shrink-0 font-typer text-[9px] uppercase tracking-wide text-deck-muted">▸ Schritt</span>
          <p className="text-[11px] leading-snug text-white">{coachLine(cs)}</p>
        </div>
        {recommendedQuest && !isMature(cs) && (
          <div className="pointer-events-auto flex items-center justify-between gap-2 border-l-2 border-deck-success bg-deck-bg px-2 py-1.5">
            <span className="min-w-0 truncate text-[11px] leading-snug text-white">
              <span className="font-typer text-[9px] uppercase tracking-wide text-deck-success">▸ Nächste Quest </span>
              {recommendedQuest.title}
            </span>
            <button
              type="button"
              onClick={() => openLesson(recommendedQuest.id)}
              className="shrink-0 border border-deck-success px-2 py-1 font-typer text-[10px] uppercase text-deck-success hover:bg-deck-success hover:text-black"
            >
              Öffnen →
            </button>
          </div>
        )}
        {banner && (
          <div
            className={cn(
              'pointer-events-auto border-l-2 bg-deck-bg px-2 py-1.5 text-[11px] leading-snug',
              banner.result === 'clean' && 'border-deck-success text-deck-success',
              banner.result === 'hotfix' && 'border-deck-warning text-deck-warning',
              banner.result === 'incident' && 'border-deck-danger text-deck-danger',
            )}
          >
            {banner.text}
          </div>
        )}
      </div>

      {/* EVENT BUBBLES — weaknesses surface here while time runs; tap in time to handle them */}
      {cs.events.length > 0 && (
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex w-[min(360px,90vw)] -translate-x-1/2 flex-col gap-1.5 md:top-3">
          {cs.events.map((ev) => {
            const def = eventById(ev.id)
            if (!def) return null
            const left = Math.max(0, ev.deadline - cs.day)
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => setCs((prev) => applyMissions(handleEvent(prev, ev.id)))}
                className={cn(
                  'pointer-events-auto flex flex-col gap-0.5 border border-l-4 bg-deck-bg px-2.5 py-1.5 text-left transition-colors hover:border-white',
                  def.good ? 'border-deck-success' : 'border-deck-danger',
                )}
              >
                <span className={cn('font-typer text-[11px] font-semibold uppercase tracking-wide', def.good ? 'text-deck-success' : 'text-deck-danger')}>
                  {def.good ? '★' : '⚠'} {def.text} · {left}d
                </span>
                <span className="text-[11px] leading-snug text-white">{def.hint}</span>
                <span className="font-typer text-[9px] uppercase tracking-wide text-deck-muted">Tippen zum {def.good ? 'Einsammeln' : 'Abwehren'}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* SELECTED node — floats above the bottom bar (extra lift on mobile to clear the tab bar) */}
      {sel && (
        <div className="pointer-events-auto absolute bottom-[calc(8rem+env(safe-area-inset-bottom))] left-2 z-20 w-[min(360px,92vw)] md:bottom-[4.5rem] md:left-3">
          <SelectedPanel
            b={sel}
            cs={cs}
            view={view}
            onBuy={() => setCs((prev) => applyMissions(buy(prev, sel.id)))}
            onUnplace={() => setCs((prev) => applyMissions(unplaceNode(prev, sel.id)))}
            onInfo={() => setInfoOpen(true)}
            onOpenLesson={openLesson}
            onClose={() => {
              setSelected(null)
              setInfoOpen(false)
            }}
          />
        </div>
      )}

      {/* NODE INFO box — full details + the placement lesson live HERE (not inline on the map) */}
      {sel && infoOpen && <InfoBox b={sel} cs={cs} onClose={() => setInfoOpen(false)} />}

      {/* quest board — the roadmap as quests (open a lesson to fund + unlock the game) */}
      {questsOpen && <QuestBoard onOpenLesson={openLesson} onClose={() => setQuestsOpen(false)} />}

      {/* keyboard cheat-sheet */}
      {helpOpen && <KeyHelp onClose={() => setHelpOpen(false)} />}

      {/* active, replayable onboarding — spotlights each control and waits for you to DO the step */}
      {onboardOpen && (
        <WerftTour signals={{ speed, view, selected, soloPlaced: !!cs.placed.soloDev }} onFinish={closeOnboard} />
      )}

      {/* DETAILS drawer (toggled) — the verbose readouts live here so the map stays clean */}
      {detailsOpen && (
        <div ref={detailsScrollRef} className="pointer-events-auto absolute right-0 top-0 z-30 flex h-full w-[min(340px,92vw)] flex-col gap-3 overflow-y-auto border-l border-deck-border bg-deck-bg p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-typer text-xs uppercase tracking-widest text-white">Details</h2>
            <button type="button" onClick={() => setDetailsOpen(false)} className="font-typer text-deck-muted hover:text-white">✕</button>
          </div>
          {cs.prestige > 0 && (
            <span className="font-typer text-[10px] uppercase text-deck-success">Prestige {cs.prestige} · +{cs.prestige * 3} Legacy</span>
          )}
          <Block title="Stats">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {(Object.keys(STAT_LABEL) as Stat[]).map((k) => (
                <Bar key={k} label={STAT_LABEL[k]} value={stats[k]} />
              ))}
            </div>
          </Block>
          <Block title="Welt">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <VarBar label="Drift" value={cs.drift} tone="bad" />
              <VarBar label="Debt" value={cs.debt} tone="bad" />
              <VarBar label="Scale" value={cs.scale} tone="neutral" />
              <VarBar label="Trust" value={cs.trust} tone="good" />
            </div>
          </Block>
          <Block title="Synergien">
            {activeSynergies(cs).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeSynergies(cs).map((sy) => (
                  <span key={sy.label} className="border border-deck-success px-2 py-0.5 font-typer text-[10px] text-deck-success">
                    {sy.label} {Object.values(sy.bonus).map((v) => `+${v}`).join(' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-typer text-[10px] text-deck-muted">Noch keine — kombiniere Skills aus mehreren Branches.</p>
            )}
          </Block>
          <Block title={`Missionen (${cs.missionsDone.length}/${MISSIONS.length})`}>
            <div className="flex flex-col gap-1">
              {MISSIONS.map((m) => {
                const done = cs.missionsDone.includes(m.id)
                return (
                  <div key={m.id} className={cn('flex items-center justify-between gap-2 border-l-2 px-2 py-1 text-[11px]', done ? 'border-deck-success' : 'border-deck-border-dim')}>
                    <span className={done ? 'text-deck-success' : 'text-white'}>
                      <span className="font-typer">{done ? '✓ ' : '○ '}</span>
                      {m.label} — <span className="text-deck-muted">{m.hint}</span>
                    </span>
                    <span className="shrink-0 font-typer text-[10px] text-deck-muted">+{m.reward.budget ?? 0}€{m.reward.xp ? ` +${m.reward.xp}XP` : ''}</span>
                  </div>
                )
              })}
            </div>
          </Block>
          <Block title="Log">
            <div className="flex flex-col gap-0.5">
              {cs.log.slice(0, 8).map((line, i) => (
                <p key={i} className={cn('font-typer text-[11px]', i === 0 ? 'text-white' : 'text-deck-muted')}>{line}</p>
              ))}
            </div>
          </Block>
          <div className="mt-auto flex flex-col gap-1 pt-2">
            <button
              type="button"
              onClick={() => { setDetailsOpen(false); setOnboardOpen(true) }}
              className="border border-deck-border-dim px-2 py-1.5 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white"
            >
              ▶ Tutorial ansehen
            </button>
            {canPrestige(cs) && !resetArmed && (
              <button
                type="button"
                onClick={() => { setCs(doPrestige(cs)); setBanner(null); setSelected(null); setSpeed(0) }}
                className="border border-deck-success px-2 py-1.5 font-typer text-[10px] uppercase text-deck-success hover:bg-deck-success hover:text-black"
              >
                Prestige {cs.prestige + 1}
              </button>
            )}
            {resetArmed ? (
              <div className="flex flex-col gap-1">
                <span className="font-typer text-[10px] uppercase text-deck-danger">Fortschritt wirklich löschen?</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => { setCs(resetGame()); setBanner(null); setSelected(null); setResetArmed(false); setSpeed(0) }}
                    className="flex-1 border border-deck-danger px-2 py-1.5 font-typer text-[10px] uppercase text-deck-danger hover:bg-deck-danger hover:text-black"
                  >
                    Ja, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetArmed(false)}
                    className="flex-1 border border-deck-border-dim px-2 py-1.5 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetArmed(true)}
                className="border border-deck-border-dim px-2 py-1.5 font-typer text-[10px] uppercase text-deck-muted hover:border-deck-danger hover:text-deck-danger"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM BAR — resources + actions, always visible (the control strip).
          On mobile, lift above the fixed bottom-tab bar so nothing is hidden. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-2 pt-2 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:p-3">
        <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2 border border-deck-border bg-deck-bg px-3 py-2">
          <div className="flex items-center gap-3 font-typer">
            <Kpi label={`Budget · +${dayIncome(cs)}/Tag`} value={`${cs.budget} €`} big />
            <Kpi label={speed > 0 ? 'Zeit ▶' : 'Zeit ⏸'} value={`Tag ${cs.day}`} tone={speed > 0 ? 'good' : undefined} />
            <Kpi label="Tier" value={`${tierOf(cs)}`} />
            <Kpi label="Release in" value={mmss(releaseSecs)} tone={daysToRelease <= 2 ? 'warn' : undefined} />
            {view === 'map' && (
              <Kpi label="Architektur ✓" value={arch.placed ? `${arch.correct}/${arch.placed}` : '–'} tone={!arch.placed ? undefined : arch.correct === arch.placed ? 'good' : 'warn'} />
            )}
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            {/* the clock: pause / play / fast-forward (Plague-Inc style) */}
            <div data-tour="play" className="flex items-center border border-deck-border-dim">
              <TimeBtn active={speed === 0} onClick={() => setSpeed(0)} label="Pause">⏸</TimeBtn>
              <TimeBtn active={speed === 1} onClick={() => setSpeed(1)} label="Play">▶</TimeBtn>
              <TimeBtn active={speed === 2} onClick={() => setSpeed(2)} label="Schnell">▶▶</TimeBtn>
              <TimeBtn active={speed === 4} onClick={() => setSpeed(4)} label="Sehr schnell">▶▶▶</TimeBtn>
            </div>
            <Button onClick={ship}>Release</Button>
            <span
              className={cn(
                'border px-2 py-1 font-typer text-[10px] uppercase tabular-nums',
                readiness === 'bereit' && 'border-deck-success text-deck-success',
                readiness === 'riskant' && 'border-deck-warning text-deck-warning',
                readiness === 'zu schwach' && 'border-deck-danger text-deck-danger',
              )}
            >
              {readiness} · {defense}/{threat}
            </span>
            <button
              type="button"
              onClick={() => setDetailsOpen((o) => !o)}
              className={cn(
                'border px-2.5 py-1.5 font-typer text-[10px] uppercase transition-colors',
                detailsOpen ? 'border-white bg-white text-black' : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
              )}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 border px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide transition-colors',
        active ? 'border-white bg-white text-black' : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

// Clock control (pause / play / fast-forward).
function TimeBtn({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn('px-2 py-1.5 font-typer text-[11px] leading-none transition-colors', active ? 'bg-white text-black' : 'text-deck-muted hover:text-white')}
    >
      {children}
    </button>
  )
}

// A titled dashboard card — the single block primitive the Werft HUD is built from.
function Block({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('flex flex-col gap-1.5 border border-deck-border p-2.5', className)}>
      {title && <h2 className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">{title}</h2>}
      {children}
    </section>
  )
}

// A dynamic next-step coach so the first steps — and how to keep progressing — are always obvious.
function coachLine(cs: GameState): string {
  if (isMature(cs))
    return '🏆 System ausgereift — Charter auf Max-Tier und 5 saubere Releases. Spiel weiter, mach Prestige, oder starte ein neues System.'
  const def = releaseDefense(cs)
  const thr = releaseThreat(cs)
  if (builtCount(cs) < 3)
    return 'Drück ▶ (unten in der Leiste), damit die Zeit läuft — Budget kommt automatisch. Kauf im „Shop" 3 Skills mit hellem Rahmen.'
  if (cs.learned.length === 0)
    return 'Die meisten Skills sind hinter Quests (🔒). Öffne „Quests" (Knopf oben oder Taste J) und schließe eine Lektion ab — das gibt Budget UND schaltet ihren Skill frei.'
  if (Object.keys(cs.placed).length === 0)
    return 'Wechsel auf „Karte" und zieh einen Skill aus dem Lager in die passende Phase (Grenze→Wissen→Modell→Tools→Prüfung→Betrieb). Richtige Phase = ✓ + Bonus.'
  const arch = architectureScore(cs)
  if (arch.placed > 0 && arch.correct < arch.placed)
    return 'Ein Skill steht falsch (✗). Tipp ihn an und drück „ℹ Info" — da steht, in welche Phase er gehört. Nur richtig platzierte geben den Bonus.'
  if (tierCapped(cs))
    return `Alles für Tier ${tierOf(cs)} ist gebaut. Lass die Zeit laufen für Budget, dann „Projekt-Charter" antippen + ausbauen → Tier ${tierOf(cs) + 1} schaltet tiefere Skills frei.`
  if (def < thr)
    return `Abwehr ${def} < Bedrohung ${thr}. Bau Skills + Docs (mit Docs sinkt Drift über die Zeit). Alle ${RELEASE_EVERY} Tage liefert das System selbst aus — sorg dafür, dass Abwehr ≥ Bedrohung ist.`
  return `Abwehr ${def} ≥ Bedrohung ${thr} — gut. Halt es so, sammle/­wehre Event-Bubbles ab und steig im Tier auf.`
}

const VAR_LABEL: Record<string, string> = { drift: 'Drift', debt: 'Debt', scale: 'Skala-Last' }
function effectSummary(b: Building): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(b.effect)) parts.push(`+${v} ${SHORT_STAT[k as Stat]}`)
  for (const [k, v] of Object.entries(b.resist ?? {})) parts.push(`−${v} ${VAR_LABEL[k]}`)
  return parts.join(' · ')
}

function SelectedPanel({
  b,
  cs,
  view,
  onBuy,
  onUnplace,
  onInfo,
  onOpenLesson,
  onClose,
}: {
  b: Building
  cs: GameState
  view: 'tree' | 'map'
  onBuy: () => void
  onUnplace: () => void
  onInfo: () => void
  onOpenLesson: (nodeId: string) => void
  onClose: () => void
}) {
  const lvl = cs.levels[b.id] ?? 0
  const cost = nextCost(cs, b)
  const check = canBuy(cs, b)
  const isCharter = b.id === 'charter'
  const owned = lvl >= 1
  const placed = isPlaced(cs, b.id)
  const zone = placedZone(cs, b.id)
  const correct = isCorrectlyPlaced(cs, b.id)
  const questNode = isCharter ? undefined : SKILL_QUEST[b.id]
  const questLocked = !!questNode && !cs.learned.includes(b.id)
  return (
    <div className="flex flex-col gap-1.5 border border-deck-border bg-deck-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">
            {b.name}
            <span className="ml-1.5 font-typer text-[10px] text-deck-muted">
              {isCharter ? `Tier ${lvl}` : `Lv ${lvl}/${b.maxLevel}`}
            </span>
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-deck-muted">{b.blurb}</p>
          {b.requires && b.requires.length > 0 && (
            <p className="mt-1 font-typer text-[10px] text-deck-muted">
              Braucht:{' '}
              {b.requires
                .map((r) => `${buildingById(r)?.name ?? r}${(cs.levels[r] ?? 0) >= 1 ? ' ✓' : ' ○'}`)
                .join(' · ')}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onInfo} className="border border-deck-border-dim px-1.5 py-0.5 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white">
            ℹ Info
          </button>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">
            ✕
          </button>
        </div>
      </div>
      {questLocked && (
        <div className="flex flex-col items-start gap-1.5 border-l-2 border-deck-warning pl-2">
          <p className="font-typer text-[11px] leading-snug text-deck-warning">
            🔒 Quest nötig: „{QUEST_MAP[questNode!].title}" abschließen, um diesen Skill freizuschalten (+Budget).
          </p>
          <button
            type="button"
            onClick={() => onOpenLesson(questNode!)}
            className="border border-deck-warning px-2 py-1 font-typer text-[10px] uppercase text-deck-warning hover:bg-deck-warning hover:text-black"
          >
            Zur Lektion →
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="font-typer text-[11px] text-deck-muted">
          {cost == null ? 'maximal ausgebaut' : check.ok ? `Nächstes Level: ${effectSummary(b)}` : check.reason}
        </span>
        {cost != null && (
          <button
            type="button"
            onClick={onBuy}
            disabled={!check.ok}
            className={cn(
              'border px-3 py-1.5 font-typer text-[11px] uppercase transition-colors',
              check.ok ? 'border-white text-white hover:bg-white hover:text-black' : 'border-deck-border-dim text-deck-muted',
            )}
          >
            {isCharter ? 'Ausbauen' : 'Bauen'} · {cost} €
          </button>
        )}
      </div>
      {view === 'map' && !isCharter && owned && (
        <div className="flex items-center justify-between gap-2 border-t border-deck-border-dim pt-1.5">
          <span className="font-typer text-[11px]">
            {!placed ? (
              <span className="text-deck-warning">○ Im Lager — in eine Phase ziehen (+{PLACE_BONUS})</span>
            ) : correct ? (
              <span className="text-deck-success">✓ Richtige Phase: {ZONE_LABEL[zone!]}</span>
            ) : (
              <span className="text-deck-danger">✗ Falsche Phase — „Info" zeigt wohin</span>
            )}
          </span>
          {placed && (
            <button type="button" onClick={onUnplace} className="shrink-0 border border-deck-border-dim px-2 py-1 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white">
              Ins Lager
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Full per-node info — opened from a node's panel. The placement LESSON lives HERE so the map stays
// clean. Click the backdrop to dismiss.
function InfoBox({ b, cs, onClose }: { b: Building; cs: GameState; onClose: () => void }) {
  const isCharter = b.id === 'charter'
  const lvl = cs.levels[b.id] ?? 0
  const placed = isPlaced(cs, b.id)
  const zone = placedZone(cs, b.id)
  const correct = isCorrectlyPlaced(cs, b.id)
  const canon = isCharter ? null : canonicalZone(b.id)
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-h-[82%] w-[min(460px,94vw)] overflow-y-auto border border-deck-border bg-deck-bg p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white">{b.name}</h3>
            <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">{BRANCH_LABEL[b.branch]}</p>
          </div>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">✕</button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-deck-muted">{NODE_INFO[b.id] ?? b.blurb}</p>
        <dl className="mt-3 flex flex-col gap-1 border-t border-deck-border-dim pt-2 font-typer text-[11px]">
          <InfoRow k="Effekt / Level" v={effectSummary(b)} />
          <InfoRow k={isCharter ? 'Tier' : 'Level'} v={`${lvl} / ${b.maxLevel}`} />
          {b.requires && b.requires.length > 0 && (
            <InfoRow k="Braucht" v={b.requires.map((r) => `${buildingById(r)?.name ?? r}${(cs.levels[r] ?? 0) >= 1 ? ' ✓' : ' ○'}`).join(' · ')} />
          )}
          {!isCharter && <InfoRow k="Richtige Phase" v={zonesFor(b.id).map((z) => ZONE_LABEL[z]).join(' / ')} />}
        </dl>
        {!isCharter && canon && (
          <div className="mt-3 border-l-2 border-deck-accent pl-2.5">
            <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">Phase · {ZONE_LABEL[canon]}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white">{ZONE_INFO[canon]}</p>
            {placed && (
              <p className={cn('mt-1.5 font-typer text-[10px] uppercase', correct ? 'text-deck-success' : 'text-deck-danger')}>
                {correct ? `✓ steht richtig (${ZONE_LABEL[zone!]})` : `✗ steht in ${ZONE_LABEL[zone!]} — verschieb es dorthin`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-deck-muted">{k}</dt>
      <dd className="text-right text-white">{v}</dd>
    </div>
  )
}

// Keyboard cheat-sheet (toggled with H / ?).
function KeyHelp({ onClose }: { onClose: () => void }) {
  const rows: [string, string][] = [
    ['F', 'Ansicht umschalten (Shop ↔ Karte)'],
    ['Q · E', 'Auswahl: voriger · nächster Node'],
    ['Leertaste', 'Bauen (Node gewählt) · sonst Zeit Play/Pause'],
    ['W A S D / Pfeile', 'Karte bewegen (Pan)'],
    ['Shift + Bewegung', 'Zoomen (rein / raus)'],
    ['W A S D (Node, Shop)', 'Auswahl räumlich bewegen'],
    ['W A S D (Node, Karte)', 'Phase des Nodes verschieben'],
    ['Tab', 'Node durchschalten (Shift = rückwärts)'],
    ['C', 'Details auf/zu — dann W/S scrollen'],
    ['J', 'Quests öffnen/schließen'],
    ['X', 'Node aus der Karte ins Lager'],
    ['T', 'Info zum gewählten Node'],
    ['R', 'Release ausliefern'],
    ['H · ?', 'Diese Hilfe'],
    ['Esc', 'Schließen / abwählen'],
  ]
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-h-[84%] w-[min(440px,94vw)] overflow-y-auto border border-deck-border bg-deck-bg p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Tastatur</h3>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">✕</button>
        </div>
        <dl className="mt-3 flex flex-col gap-1.5 font-typer text-[11px]">
          {rows.map(([key, what]) => (
            <div key={key} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-white">{key}</dt>
              <dd className="text-right text-deck-muted">{what}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

function Kpi({ label, value, big, tone }: { label: string; value: string; big?: boolean; tone?: 'good' | 'warn' }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-wide text-deck-muted">{label}</span>
      <span
        className={cn(
          'tabular-nums',
          big ? 'text-lg font-bold' : 'text-sm',
          tone === 'good' ? 'text-deck-success' : tone === 'warn' ? 'text-deck-warning' : 'text-white',
        )}
      >
        {value}
      </span>
    </div>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between font-typer text-[10px] uppercase tracking-wide text-deck-muted">
        <span>{label}</span>
        <span className="tabular-nums text-white">{value}</span>
      </div>
      <div className="h-1.5 border border-deck-border-dim">
        <div className="h-full bg-white" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

// World variables: drift/debt are bad (red when high), trust is good, scale just grows.
function VarBar({ label, value, tone }: { label: string; value: number; tone: 'bad' | 'good' | 'neutral' }) {
  const danger = tone === 'bad' && value >= 45
  const good = tone === 'good'
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between font-typer text-[9px] uppercase tracking-wide text-deck-muted">
        <span>{label}</span>
        <span className={cn('tabular-nums', danger ? 'text-deck-danger' : good ? 'text-deck-success' : 'text-white')}>{value}</span>
      </div>
      <div className="h-1 border border-deck-border-dim">
        <div
          className={cn('h-full', danger ? 'bg-deck-danger' : good ? 'bg-deck-success' : 'bg-white')}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}
