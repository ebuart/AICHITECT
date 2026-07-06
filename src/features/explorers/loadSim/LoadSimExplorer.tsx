import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import {
  CAP_PRESETS,
  CARD_SPECS,
  LOAD_EXPERIMENTS,
  RATE_PRESETS,
  SLOT_PRESETS,
  TILES,
  TILE_DETAIL,
  TIMEOUT_PRESETS,
  runSim,
  tileValue,
  type CardTone,
  type Frame,
  type LoadExperiment,
  type SimConfig,
  type TileId,
} from './model'

// LoadSimExplorer (EXP-LOAD, control/10 IX-10..20 + VIS rules): the supermarket checkout
// as production system. Six prescribed runs play a precomputed queue simulation on an
// animated road; the queue-over-time mountain builds live, with the PREVIOUS run as a
// ghost silhouette for comparison. After the protocol the switchboard unlocks into a real
// experiment kit (rate, burstiness, slots, cap, timeout, retry).

const verdictBorder = {
  good: 'border-deck-success',
  bad: 'border-deck-danger',
  blocked: 'border-deck-warning',
} as const

// Fixed vertical scale for the mountain so runs stay visually comparable (VIS-5).
const HISTORY_MAX = 72

type Phase = 'briefing' | 'running' | 'diagnose' | 'solved' | 'free'

export function LoadSimExplorer({ onComplete }: { onComplete?: () => void }) {
  const [expIdx, setExpIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('briefing')
  const [solvedCount, setSolvedCount] = useState(0)
  const [frames, setFrames] = useState<Frame[]>(() => runSim(LOAD_EXPERIMENTS[0].config))
  const [ghost, setGhost] = useState<Frame[] | null>(null)
  const [frameIdx, setFrameIdx] = useState(0)
  const [inspected, setInspected] = useState<TileId | null>(null)
  const [missReport, setMissReport] = useState(false)
  // Free-play switchboard state (preset indices).
  const [rateIdx, setRateIdx] = useState(2)
  const [burst, setBurst] = useState(false)
  const [slotIdx, setSlotIdx] = useState(1)
  const [capIdx, setCapIdx] = useState(0)
  const [timeoutIdx, setTimeoutIdx] = useState(0)
  const [retry, setRetry] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const completed = useRef(false)

  const exp = LOAD_EXPERIMENTS[Math.min(expIdx, LOAD_EXPERIMENTS.length - 1)]
  const inProtocol = phase !== 'free'
  const running = phase === 'running'
  const f = frames[Math.min(frameIdx, frames.length - 1)]
  const prev = frames[Math.max(0, Math.min(frameIdx, frames.length - 1) - 1)]

  const freeConfig = (): SimConfig => ({
    pattern: burst ? RATE_PRESETS[rateIdx].burst : RATE_PRESETS[rateIdx].even,
    seconds: 45,
    slots: SLOT_PRESETS[slotIdx],
    queueCap: CAP_PRESETS[capIdx],
    timeoutSec: TIMEOUT_PRESETS[timeoutIdx],
    retryOnTimeout: retry,
  })

  const startRun = (config: SimConfig) => {
    setGhost(frameIdx > 0 ? frames : null)
    setFrames(runSim(config))
    setFrameIdx(0)
    setInspected(null)
    setMissReport(false)
    setPhase('running')
  }

  useEffect(() => {
    if (!running) return
    const ms = solvedCount === 0 ? 300 : 160
    timer.current = setInterval(() => {
      setFrameIdx((i) => {
        if (i + 1 >= frames.length) {
          if (timer.current) clearInterval(timer.current)
          setPhase(inProtocol ? 'diagnose' : 'free')
          return i
        }
        return i + 1
      })
    }, ms)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // re-arm per run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, frames])

  const reportInspected = () => {
    if (phase !== 'diagnose' || inspected == null) return
    if (inspected === exp.target) {
      setMissReport(false)
      setPhase('solved')
      const solved = solvedCount + 1
      setSolvedCount(solved)
      if (solved === LOAD_EXPERIMENTS.length && !completed.current) {
        completed.current = true
        onComplete?.()
      }
    } else {
      setMissReport(true)
    }
  }

  const nextRun = () => {
    if (solvedCount >= LOAD_EXPERIMENTS.length) {
      setPhase('free')
      return
    }
    setExpIdx(solvedCount)
    setPhase('briefing')
    setInspected(null)
    setMissReport(false)
  }

  const findings = LOAD_EXPERIMENTS.slice(0, solvedCount)
  // Once anything ran, the road stays on screen — frozen at the last frame between runs.
  const everRan = solvedCount > 0 || phase !== 'briefing' || frameIdx > 0
  // All six runs precomputed once for the dashboard cards (deterministic, cheap).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runsCache = useMemo(() => Object.fromEntries(LOAD_EXPERIMENTS.map((e) => [e.id, runSim(e.config)])), [])

  // Road rendering values
  const cap = (inProtocol ? exp.config.queueCap : CAP_PRESETS[capIdx]) ?? null
  const slots = inProtocol ? exp.config.slots : SLOT_PRESETS[slotIdx]
  const rejectedNow = f.rejectedTotal - prev.rejectedTotal > 0
  const timeoutsNow = f.timeoutsTotal - prev.timeoutsTotal
  const retriesNow = Math.max(0, f.entered - f.newExternal)
  const doneTicked = f.doneTotal > prev.doneTotal

  const cycle = (i: number, len: number) => (i + 1) % len

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      {/* Header: protocol progress + config (chips in protocol, switchboard in free play) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
          {inProtocol ? `Protokoll ${Math.min(solvedCount + 1, LOAD_EXPERIMENTS.length)}/${LOAD_EXPERIMENTS.length}` : 'Freies Experimentieren'}
        </span>
        {inProtocol ? (
          exp.chips.map((c) => (
            <span key={c} className="border border-deck-border-dim px-2 py-1 font-typer text-[10px] uppercase tracking-wide text-deck-muted">
              {c}
            </span>
          ))
        ) : (
          <>
            <FreeKnob label={`Neu ${RATE_PRESETS[rateIdx].label}`} onClick={() => setRateIdx((i) => cycle(i, RATE_PRESETS.length))} disabled={running} />
            <FreeKnob label={burst ? 'Schübe' : 'gleichmäßig'} onClick={() => setBurst((b) => !b)} disabled={running} />
            <FreeKnob label={`${SLOT_PRESETS[slotIdx]} Slots`} onClick={() => setSlotIdx((i) => cycle(i, SLOT_PRESETS.length))} disabled={running} />
            <FreeKnob label={`Queue ${CAP_PRESETS[capIdx] ?? '∞'}`} onClick={() => setCapIdx((i) => cycle(i, CAP_PRESETS.length))} disabled={running} />
            <FreeKnob label={`Timeout ${TIMEOUT_PRESETS[timeoutIdx] != null ? `${TIMEOUT_PRESETS[timeoutIdx]} s` : '–'}`} onClick={() => setTimeoutIdx((i) => cycle(i, TIMEOUT_PRESETS.length))} disabled={running} />
            <FreeKnob label={`Retry ${retry ? 'an' : 'aus'}`} onClick={() => setRetry((r) => !r)} disabled={running} />
            <button
              type="button"
              onClick={() => startRun(freeConfig())}
              disabled={running}
              className="ml-auto border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black disabled:border-deck-border-dim disabled:text-deck-muted"
            >
              Lauf starten ▸
            </button>
          </>
        )}
      </div>

      {/* AUFGABE */}
      {inProtocol && (
        <div
          className={cn(
            'flex flex-col gap-1.5 border-l-2 bg-deck-bg px-3 py-2',
            phase === 'solved' ? 'border-deck-success' : 'border-deck-accent',
          )}
        >
          <span className="font-typer text-[9px] uppercase tracking-widest text-deck-muted">
            Aufgabe · {exp.title}
          </span>
          {phase === 'briefing' && (
            <>
              <p className="text-[12px] leading-snug text-deck-muted">{exp.watch}</p>
              {solvedCount === 0 && (
                <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">
                  Lesehilfe, einmalig: □ = wartende Anfrage · ◎ = Slot arbeitet · Gebirge unten = Schlange über Zeit
                </p>
              )}
              <button
                type="button"
                onClick={() => startRun(exp.config)}
                className="mt-0.5 self-start border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
              >
                Lauf starten ▸
              </button>
            </>
          )}
          {phase === 'running' && <p className="text-[12px] leading-snug text-deck-muted">{exp.watch}</p>}
          {phase === 'diagnose' && (
            <>
              <p className="text-[13px] font-medium leading-snug text-white">{exp.prompt}</p>
              {solvedCount === 0 && (
                <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">
                  Kacheln antippen und lesen · melden im Detail-Fenster
                </p>
              )}
            </>
          )}
          {phase === 'solved' && (
            <>
              <p className="text-[13px] leading-snug text-white">{exp.solvedNote}</p>
              <button
                type="button"
                onClick={nextRun}
                className="mt-0.5 self-start border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
              >
                {solvedCount >= LOAD_EXPERIMENTS.length ? 'Protokoll abschließen ▸' : `Weiter zu Lauf ${solvedCount + 1} ▸`}
              </button>
            </>
          )}
        </div>
      )}

      {/* THE ROAD (VIS-2): arrivals ▸ queue ▸ slots ▸ done, data visible as it moves */}
      {everRan && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 border border-deck-border-dim bg-deck-bg">
              <span className={cn('text-base font-semibold tabular-nums text-white', f.newExternal > 0 && 'deck-pop')} key={`n${f.t}-${f.newExternal}`}>
                {f.newExternal}
              </span>
              <span className="font-typer text-[8px] uppercase text-deck-muted">neu/s</span>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>

            {/* Queue: bounded → exactly cap outlined cells (the wall is visible); unbounded → dots + overflow */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div
                className={cn(
                  'flex h-16 items-center gap-1 border border-deck-border-dim bg-deck-bg px-2',
                  rejectedNow && 'deck-flash-danger',
                )}
              >
                {cap != null ? (
                  <>
                    {Array.from({ length: cap }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-3.5 w-3.5 shrink-0 border',
                          i < f.queued ? 'deck-pop border-white bg-white' : 'border-deck-border-dim',
                        )}
                      />
                    ))}
                    <span className="ml-1 shrink-0 font-typer text-[9px] uppercase text-deck-muted">| Wand</span>
                  </>
                ) : (
                  <>
                    {f.queued === 0 && <span className="font-typer text-[10px] uppercase text-deck-muted">leer</span>}
                    {Array.from({ length: Math.min(f.queued, 26) }, (_, i) => (
                      <span
                        key={i}
                        className={cn('h-3.5 w-3.5 shrink-0 bg-white', i >= prev.queued && 'deck-pop')}
                      />
                    ))}
                    {f.queued > 26 && (
                      <span className="shrink-0 font-typer text-[12px] font-semibold tabular-nums text-deck-warning">
                        +{f.queued - 26}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 font-typer text-[9px] uppercase tracking-wide text-deck-muted">
                <span>Warteschlange · {f.queued}</span>
                {retriesNow > 0 && <span className="text-deck-warning">↻ {retriesNow} Retry</span>}
                {timeoutsNow > 0 && <span className="text-deck-warning">↓ {timeoutsNow} Timeout</span>}
                {rejectedNow && <span className="text-deck-danger">✕ 429</span>}
              </div>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>

            {/* Slots */}
            <div className="flex shrink-0 flex-col gap-1">
              <div className="flex h-16 items-center gap-1.5 border border-deck-border-dim bg-deck-bg px-2">
                {Array.from({ length: slots }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center border text-sm',
                      i < f.inFlight ? 'animate-pulse border-white bg-white text-black' : 'border-deck-border-dim text-deck-muted',
                    )}
                  >
                    {i < f.inFlight ? '◎' : '·'}
                  </span>
                ))}
              </div>
              <span className="font-typer text-[9px] uppercase tracking-wide text-deck-muted">Slots · 1 s/Antwort</span>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>

            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 border border-deck-border-dim bg-deck-bg">
              <span key={`d${f.doneTotal}`} className={cn('text-base font-semibold tabular-nums text-deck-success', doneTicked && 'deck-pop')}>
                {f.doneTotal}
              </span>
              <span className="font-typer text-[8px] uppercase text-deck-muted">fertig</span>
            </div>
            <span className="ml-auto shrink-0 font-typer text-[11px] tabular-nums text-deck-muted">t = {f.t}s</span>
          </div>

          {/* The mountain: queue over time, current run building over the previous run's ghost */}
          <div className="flex flex-col gap-1">
            <div className="relative h-16 border border-deck-border-dim bg-deck-bg">
              {ghost && (
                <div className="absolute inset-x-1 bottom-0 top-1 flex items-end gap-px opacity-40">
                  {ghost.map((g, i) => (
                    <span
                      key={i}
                      className="min-w-0 flex-1 bg-deck-border-dim"
                      style={{ height: `${Math.min(100, (g.queued / HISTORY_MAX) * 100)}%` }}
                    />
                  ))}
                </div>
              )}
              <div className="absolute inset-x-1 bottom-0 top-1 flex items-end gap-px">
                {frames.map((fr, i) => (
                  <span
                    key={i}
                    className={cn('min-w-0 flex-1', i <= frameIdx ? 'bg-white' : 'bg-transparent')}
                    style={{ height: `${Math.max(fr.queued > 0 ? 3 : 0, Math.min(100, (fr.queued / HISTORY_MAX) * 100))}%` }}
                  />
                ))}
              </div>
            </div>
            <span className="font-typer text-[9px] uppercase tracking-wide text-deck-muted">
              Schlange über Zeit{ghost ? ' · grau: voriger Lauf' : ''}
            </span>
          </div>

          {/* Little's-Law strip — computed live from the run (VIS-5) */}
          <div className="flex flex-wrap items-baseline gap-x-2 border border-deck-border-dim bg-deck-bg px-2 py-1 font-typer text-[11px]">
            <span className="text-deck-muted">Schlange ≈ Zugänge × Wartezeit:</span>
            <span className="tabular-nums text-white">
              {f.littleL} ≈ {f.lambda} × {f.avgWait} s
            </span>
            <span className="text-deck-muted">(Little&apos;s Law, Fenster 15 s)</span>
          </div>

          {/* Metric tiles */}
          <div className="grid grid-cols-4 gap-1 sm:grid-cols-7">
            {TILES.map((tile) => {
              const isShown = inspected === tile.id
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => !running && setInspected(tile.id)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 border px-1 py-1.5 transition-colors',
                    isShown ? 'border-white bg-white' : 'border-deck-border-dim bg-deck-bg',
                    phase === 'diagnose' && !isShown && 'hover:border-white',
                  )}
                >
                  <span className={cn('text-sm font-semibold tabular-nums', isShown ? 'text-black' : 'text-white')}>
                    {tileValue(f, tile.id)}
                  </span>
                  <span className={cn('truncate font-typer text-[8px] uppercase tracking-wide', isShown ? 'text-black/70' : 'text-deck-muted')}>
                    {tile.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tile detail (inspection + reporting) */}
          {inspected && (
            <div className="flex flex-col gap-1.5 border-l-2 border-deck-border pl-2.5">
              <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
                Detail · {TILES.find((x) => x.id === inspected)!.label}
              </span>
              <div className="flex h-10 items-end gap-px border border-deck-border-dim bg-deck-bg px-1 pt-1">
                {frames.slice(0, frameIdx + 1).slice(-48).map((fr, i) => {
                  const v = tileValue(fr, inspected)
                  const max = Math.max(1, ...frames.slice(0, frameIdx + 1).map((x) => tileValue(x, inspected)))
                  return <span key={i} className="w-1.5 shrink-0 bg-white" style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
                })}
              </div>
              <p className="text-[12px] leading-snug text-deck-muted">{TILE_DETAIL[inspected]}</p>
              {phase === 'diagnose' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={reportInspected}
                    className="border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Diese Kachel · melden ▸
                  </button>
                  {missReport && (
                    <span className="font-typer text-[11px] text-deck-warning">
                      Nicht diese. Der Verlauf einer anderen Kachel passt zur Frage.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PROTOKOLL as dashboard (user 2026-07-05): one CARD per solved run — the law as a
          mini-diagram from the run's own frames. Grows 2-wide toward the full 3×2 grid. */}
      {findings.length > 0 && phase !== 'diagnose' && (
        <div className="flex flex-col gap-1.5">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Protokoll {findings.length}/{LOAD_EXPERIMENTS.length}
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {findings.map((x) => (
              <FindingCard key={x.id} exp={x} frames={runsCache[x.id]} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const toneBg: Record<CardTone, string> = {
  white: 'bg-white',
  success: 'bg-deck-success',
  warning: 'bg-deck-warning',
  danger: 'bg-deck-danger',
  dim: 'bg-deck-border-dim',
}
const toneBorder: Record<CardTone, string> = {
  white: 'border-white',
  success: 'border-deck-success',
  warning: 'border-deck-warning',
  danger: 'border-deck-danger',
  dim: 'border-deck-border-dim',
}

function FindingCard({ exp, frames }: { exp: LoadExperiment; frames: Frame[] }) {
  const spec = CARD_SPECS[exp.id]
  if (!spec) return null
  return (
    <div className={cn('flex flex-col gap-1.5 border-l-2 bg-deck-bg p-2', verdictBorder[exp.verdict])}>
      <span className="font-typer text-[10px] uppercase tracking-wide text-white">{exp.title}</span>
      <MiniChart frames={frames} spec={spec} config={exp.config} />
      <span className="font-typer text-[10px] tabular-nums text-deck-muted">{spec.stat(frames)}</span>
      <span className="text-[12px] leading-snug text-white">{exp.finding}</span>
      <span className="font-typer text-[8px] uppercase tracking-wide text-deck-muted">{spec.legend}</span>
    </div>
  )
}

function MiniChart({
  frames,
  spec,
  config,
}: {
  frames: Frame[]
  spec: (typeof CARD_SPECS)[string]
  config: SimConfig
}) {
  const barVals = frames.map(spec.bars)
  const edgeVals = spec.edge ? frames.map(spec.edge) : null
  const refVals = (spec.refs ?? []).map((r) => r.value(frames, config))
  const max = Math.max(1, ...barVals, ...(edgeVals ?? []), ...refVals) * 1.1
  const h = (v: number) => `${Math.max(v > 0 ? 3 : 0, Math.min(100, (v / max) * 100))}%`
  return (
    <div className="relative h-20 border border-deck-border-dim bg-deck-surface">
      {/* bars */}
      <div className="absolute inset-x-1 bottom-0 top-1 flex items-end gap-px">
        {barVals.map((v, i) => (
          <span key={i} className={cn('min-w-0 flex-1', toneBg[spec.barTone])} style={{ height: h(v) }} />
        ))}
      </div>
      {/* edge markers: a second series drawn as top edges */}
      {edgeVals && (
        <div className="pointer-events-none absolute inset-x-1 bottom-0 top-1">
          {edgeVals.map((v, i) => (
            <span
              key={i}
              className={cn('absolute h-[2px]', toneBg[spec.edgeTone ?? 'white'])}
              style={{
                bottom: h(v),
                left: `${(i / edgeVals.length) * 100}%`,
                width: `${100 / edgeVals.length}%`,
              }}
            />
          ))}
        </div>
      )}
      {/* reference lines */}
      {(spec.refs ?? []).map((r, i) => (
        <span
          key={i}
          className={cn('pointer-events-none absolute inset-x-0 border-t', toneBorder[r.tone], r.dashed && 'border-dashed')}
          style={{ bottom: h(r.value(frames, config)) }}
        />
      ))}
    </div>
  )
}

function FreeKnob({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border border-deck-border-dim px-2 py-1 font-typer text-[10px] uppercase tracking-wide text-white transition-colors hover:border-white disabled:text-deck-muted"
    >
      {label} ↺
    </button>
  )
}
