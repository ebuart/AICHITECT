import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useProgress } from '@/features/progress/useProgress'
import { useRoadmap } from '@/features/roadmap/useRoadmap'
import { firstLessonForNode } from '@/content/lessons'
import { paths } from '@/routes/paths'
import {
  MISSIONS,
  RELEASE_EVERY,
  activeSynergies,
  applyMissions,
  architectureScore,
  buildingById,
  buy,
  canPrestige,
  dayIncome,
  doPrestige,
  deriveStats,
  eventById,
  handleEvent,
  isMature,
  loadGame,
  releaseDefense,
  releaseThreat,
  resetGame,
  saveGame,
  shipRelease,
  tick,
  tierOf,
  unplaceNode,
  placeNode,
  type GameState,
  type ReleaseOutcome,
  type Stat,
} from './gameModel'
import { SkillCanvas, type SkillCanvasHandle } from './SkillCanvas'
import { LANES_TOP, laneAtX, skilltreeGraph, systemMapGraph } from './graphs'
import { reconcileQuests } from './questBridge'
import { QuestBoard } from './QuestBoard'
import { WerftTour } from './WerftTour'
import { Bar, Block, Kpi, STAT_LABEL, TimeBtn, Toggle, VarBar, coachLine, mmss } from './WerftHud'
import { InfoBox, KeyHelp, SelectedPanel } from './WerftPanels'
import { useWerftKeyboard, type KbSnapshot } from './useWerftKeyboard'

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
// HUD pieces live in WerftHud.tsx, overlay panels in WerftPanels.tsx, keys in useWerftKeyboard.ts.

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
  // performance.now() of the last day-tick — drives the live release countdown. State (not a
  // ref) so the countdown can be computed purely during render.
  const [tickAtMs, setTickAtMs] = useState(0)
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
  useEffect(() => {
    csRef.current = cs
  }, [cs])
  // Sampled clock for the countdown — state (not performance.now() in render) keeps render pure.
  const [nowMs, setNowMs] = useState(0)
  useEffect(() => {
    if (speed === 0) return
    const now = performance.now()
    setTickAtMs(now)
    setNowMs(now)
    const id = setInterval(() => {
      const { state, outcome } = tick(csRef.current)
      setTickAtMs(performance.now())
      setCs(applyMissions(state))
      if (outcome) setBanner(outcome)
    }, DAY_MS / speed)
    return () => clearInterval(id)
  }, [speed])
  // Sample the clock a few times a second while playing so the mm:ss release countdown animates smoothly.
  useEffect(() => {
    if (speed === 0) return
    const id = setInterval(() => setNowMs(performance.now()), 150)
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
  const intraDay = speed > 0 ? Math.min(dayMs, Math.max(0, nowMs - tickAtMs)) : 0
  const releaseSecs = Math.max(0, Math.round((daysToRelease * dayMs - intraDay) / 1000))

  const ship = () => {
    const { state, outcome } = shipRelease(csRef.current)
    setCs(applyMissions(state))
    setBanner(outcome)
  }

  // Latest values for the once-bound key handler (avoids stale closures / re-binding every
  // keypress). Written in an effect, read only inside event handlers.
  const kb = useRef<KbSnapshot>({ view, selected, detailsOpen, infoOpen, helpOpen, questsOpen, onboardOpen, selectableIds: [], nodePos: {} })
  useEffect(() => {
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
  })

  useWerftKeyboard({
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
  })

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

