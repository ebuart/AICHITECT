import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import {
  LOAD_EXPERIMENTS,
  TILES,
  TILE_DETAIL,
  runSim,
  tileValue,
  type Frame,
  type TileId,
} from './model'

// LoadSimExplorer (EXP-LOAD, control/10 protocol grammar IX-10..20): the supermarket
// checkout as production system. Five prescribed runs play a precomputed queue simulation;
// after each run a diagnostic question is answered by inspecting a metric tile and
// reporting it. The Little's-Law strip computes live from the run. Free play afterwards.

const verdictBorder = {
  good: 'border-deck-success',
  bad: 'border-deck-danger',
  blocked: 'border-deck-warning',
} as const

type Phase = 'briefing' | 'running' | 'diagnose' | 'solved' | 'free'

export function LoadSimExplorer({ onComplete }: { onComplete?: () => void }) {
  const [expIdx, setExpIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('briefing')
  const [solvedCount, setSolvedCount] = useState(0)
  const [frames, setFrames] = useState<Frame[]>(() => runSim(LOAD_EXPERIMENTS[0].config))
  const [frameIdx, setFrameIdx] = useState(0)
  const [inspected, setInspected] = useState<TileId | null>(null)
  const [missReport, setMissReport] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const completed = useRef(false)

  const exp = LOAD_EXPERIMENTS[Math.min(expIdx, LOAD_EXPERIMENTS.length - 1)]
  const inProtocol = phase !== 'free'
  const running = phase === 'running'
  const f = frames[Math.min(frameIdx, frames.length - 1)]

  const startRun = () => {
    setFrames(runSim(exp.config))
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
    setFrameIdx(0)
    setInspected(null)
    setMissReport(false)
  }

  const findings = LOAD_EXPERIMENTS.slice(0, solvedCount)
  const queueDots = Math.min(f.queued, 24)

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      {/* Header: protocol progress + this run's raw config */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
          {inProtocol ? `Protokoll ${Math.min(solvedCount + 1, LOAD_EXPERIMENTS.length)}/${LOAD_EXPERIMENTS.length}` : 'Freies Experimentieren'}
        </span>
        {exp.chips.map((c) => (
          <span key={c} className="border border-deck-border-dim px-2 py-1 font-typer text-[10px] uppercase tracking-wide text-deck-muted">
            {c}
          </span>
        ))}
        {phase === 'free' && (
          <button
            type="button"
            onClick={startRun}
            className="ml-auto border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            Nochmal abspielen ▸
          </button>
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
              <button
                type="button"
                onClick={startRun}
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

      {/* THE ROAD: arrivals → queue → workers → done (one idea, boxes and arrows) */}
      {phase !== 'briefing' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Arrivals */}
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div className="flex h-12 w-16 flex-col items-center justify-center border border-deck-border-dim bg-deck-bg">
                <span className="text-sm font-semibold tabular-nums text-white">{f.newExternal}</span>
                <span className="font-typer text-[8px] uppercase text-deck-muted">neu/s</span>
              </div>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>
            {/* Queue */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex h-12 items-center gap-1 border border-deck-border-dim bg-deck-bg px-2">
                {f.queued === 0 && <span className="font-typer text-[10px] uppercase text-deck-muted">leer</span>}
                {Array.from({ length: queueDots }, (_, i) => (
                  <span key={i} className="h-2.5 w-2.5 shrink-0 bg-white" />
                ))}
                {f.queued > queueDots && (
                  <span className="shrink-0 font-typer text-[11px] tabular-nums text-deck-warning">+{f.queued - queueDots}</span>
                )}
              </div>
              <span className="font-typer text-[8px] uppercase tracking-wide text-deck-muted">
                Warteschlange · {f.queued}
              </span>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>
            {/* Workers */}
            <div className="flex shrink-0 flex-col gap-1">
              <div className="flex h-12 items-center gap-1.5 border border-deck-border-dim bg-deck-bg px-2">
                {Array.from({ length: exp.config.slots }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center border font-typer text-[10px]',
                      i < f.inFlight ? 'animate-pulse border-white bg-white text-black' : 'border-deck-border-dim text-deck-muted',
                    )}
                  >
                    {i < f.inFlight ? '◎' : '·'}
                  </span>
                ))}
              </div>
              <span className="font-typer text-[8px] uppercase tracking-wide text-deck-muted">Slots</span>
            </div>
            <span aria-hidden className="shrink-0 text-sm leading-none text-deck-muted">▸</span>
            {/* Done */}
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div className="flex h-12 w-16 flex-col items-center justify-center border border-deck-border-dim bg-deck-bg">
                <span className="text-sm font-semibold tabular-nums text-deck-success">{f.doneTotal}</span>
                <span className="font-typer text-[8px] uppercase text-deck-muted">fertig</span>
              </div>
            </div>
            {/* Clock */}
            <span className="ml-auto shrink-0 font-typer text-[11px] tabular-nums text-deck-muted">t = {f.t}s</span>
          </div>

          {/* Little's-Law strip — computed live from the run */}
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
              {/* history strip: the tile's value over the run so far */}
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

      {/* PROTOKOLL */}
      {findings.length > 0 && phase !== 'diagnose' && (
        <div className="flex flex-col gap-1">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Protokoll {findings.length}/{LOAD_EXPERIMENTS.length}
          </span>
          <div className="flex flex-col">
            {findings.map((x) => (
              <div key={x.id} className={cn('flex items-baseline gap-2 border-l-2 bg-deck-bg px-2 py-1', verdictBorder[x.verdict])}>
                <span className="w-24 shrink-0 font-typer text-[10px] uppercase tracking-wide text-deck-muted">{x.title.split('·')[0].trim()}</span>
                <span className="text-[12px] leading-snug text-white">{x.finding}</span>
              </div>
            ))}
          </div>
          {phase === 'free' && (
            <p className="text-[11px] leading-snug text-deck-muted">
              Der letzte Lauf lässt sich beliebig oft abspielen; die Kacheln bleiben inspizierbar.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
