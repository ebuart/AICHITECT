import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import {
  ALL_ON,
  EXPERIMENTS,
  FLOW_TOGGLES,
  traceRequest,
  type StationSnapshot,
  type StationStatus,
} from './model'

// RequestFlowExplorer (EXP-REQUEST-FLOW, control/10). GUIDED PROTOCOL, not a sandbox
// (user feedback 2026-07-05): five prescribed runs, each removing a layer. After every run
// a diagnostic question must be answered by TAPPING the right station — wrong taps open
// that station's payload (reading is the point), the next run only unlocks after the
// correct tap. Every solved run fills a row of the findings board; at the end the
// layer→incident map stands as a visible artifact and the toggles unlock for free play.
// onComplete fires when the protocol is done — the lesson requires it.

const STEP_MS_FIRST = 620
const STEP_MS_FAST = 340

const statusDot: Record<StationStatus, string> = {
  ok: 'bg-deck-success',
  warn: 'bg-deck-warning',
  fail: 'bg-deck-danger',
  off: 'bg-deck-border-dim',
}
const verdictBorder = {
  good: 'border-deck-success',
  bad: 'border-deck-danger',
  blocked: 'border-deck-warning',
} as const

type Phase = 'briefing' | 'running' | 'diagnose' | 'solved' | 'free'

export function RequestFlowExplorer({ onComplete }: { onComplete?: () => void }) {
  const [expIdx, setExpIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('briefing')
  const [solvedCount, setSolvedCount] = useState(0)
  const [active, setActive] = useState<Set<string>>(new Set(EXPERIMENTS[0].active))
  const [trace, setTrace] = useState(() => traceRequest(new Set(EXPERIMENTS[0].active)))
  const [step, setStep] = useState(-1)
  const [inspected, setInspected] = useState<number | null>(null)
  const [missTap, setMissTap] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const completed = useRef(false)

  const exp = EXPERIMENTS[expIdx]
  const inProtocol = phase !== 'free'
  const running = phase === 'running'

  const startRun = (toggles: Set<string>) => {
    const t = traceRequest(toggles)
    setTrace(t)
    setInspected(null)
    setMissTap(false)
    setStep(0)
    setPhase('running')
  }

  useEffect(() => {
    if (!running) return
    const ms = solvedCount === 0 ? STEP_MS_FIRST : STEP_MS_FAST
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s + 1 >= trace.steps.length) {
          if (timer.current) clearInterval(timer.current)
          setPhase(inProtocol ? 'diagnose' : 'free')
          return trace.steps.length
        }
        return s + 1
      })
    }, ms)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // re-arm per run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, trace])

  const tapStation = (i: number) => {
    if (running) return
    setInspected(i)
    if (phase !== 'diagnose') return
    if (trace.steps[i]?.station === exp.target) {
      setMissTap(false)
      setPhase('solved')
      const solved = solvedCount + 1
      setSolvedCount(solved)
      if (solved === EXPERIMENTS.length && !completed.current) {
        completed.current = true
        onComplete?.()
      }
    } else {
      setMissTap(true)
    }
  }

  const nextRun = () => {
    if (solvedCount >= EXPERIMENTS.length) {
      setPhase('free')
      setActive(new Set(ALL_ON))
      return
    }
    const next = EXPERIMENTS[solvedCount]
    setExpIdx(solvedCount)
    setActive(new Set(next.active))
    setPhase('briefing')
    setStep(-1)
    setInspected(null)
  }

  const toggleFree = (id: string) => {
    if (phase !== 'free') return
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const done = step >= trace.steps.length
  const shownIndex = inspected ?? (running ? step : done ? trace.steps.length - 1 : null)
  const shown: StationSnapshot | null = shownIndex != null ? (trace.steps[shownIndex] ?? null) : null
  const findings = EXPERIMENTS.slice(0, solvedCount)

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      {/* Protocol header / free-play switchboard */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
          {inProtocol ? `Protokoll ${Math.min(solvedCount + 1, EXPERIMENTS.length)}/${EXPERIMENTS.length}` : 'Freies Experimentieren'}
        </span>
        {FLOW_TOGGLES.map((t) => {
          const on = active.has(t.id)
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleFree(t.id)}
              disabled={phase !== 'free'}
              title={on ? t.label : t.off}
              className={cn(
                'border px-2 py-1 font-typer text-[10px] uppercase tracking-wide transition-colors',
                on ? 'border-deck-border text-white' : 'border-deck-danger text-deck-danger line-through',
                phase === 'free' && 'hover:border-white',
              )}
            >
              {t.label}
            </button>
          )
        })}
        {phase === 'free' && (
          <button
            type="button"
            onClick={() => startRun(active)}
            className="ml-auto border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            Anfrage senden ▸
          </button>
        )}
      </div>

      {/* Experiment card */}
      {phase === 'briefing' && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-l-2 border-deck-accent bg-deck-bg px-3 py-2">
          <div className="min-w-0">
            <p className="font-typer text-[11px] uppercase tracking-wide text-white">{exp.title}</p>
            <p className="text-[12px] leading-snug text-deck-muted">
              {exp.missing === '—'
                ? 'Erst die Referenz: das vollständige System.'
                : `Diesmal fehlt: ${exp.missing}. Gleiche Anfrage, anderes System.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => startRun(new Set(exp.active))}
            className="shrink-0 border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            Lauf starten ▸
          </button>
        </div>
      )}

      {/* Pipeline */}
      {phase !== 'briefing' && (
        <div className="flex items-stretch gap-0 overflow-x-auto pb-1">
          {trace.steps.map((s, i) => {
            const reached = running ? i <= step : true
            const isCurrent = running && i === step
            const isShown = shownIndex === i
            return (
              <div key={s.station} className="flex min-w-0 flex-1 items-center" style={{ minWidth: 86 }}>
                <button
                  type="button"
                  onClick={() => tapStation(i)}
                  className={cn(
                    'flex w-full flex-col items-center gap-1 border px-1.5 py-2 transition-all duration-300',
                    isShown ? 'border-white bg-white' : 'border-deck-border-dim bg-deck-bg',
                    isCurrent && 'border-white',
                    !reached && 'opacity-40',
                    phase === 'diagnose' && !isShown && 'hover:border-white',
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors duration-300',
                      reached ? statusDot[s.status] : 'bg-deck-border-dim',
                      isCurrent && 'animate-pulse',
                    )}
                  />
                  <span
                    className={cn(
                      'truncate font-typer text-[10px] uppercase tracking-wide',
                      isShown ? 'text-black' : 'text-white',
                    )}
                  >
                    {s.title}
                  </span>
                </button>
                {i < trace.steps.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      'h-px w-3 shrink-0 transition-colors duration-300 sm:w-4',
                      (running ? i < step : true) ? 'bg-white' : 'bg-deck-border-dim',
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Diagnostic prompt */}
      {phase === 'diagnose' && (
        <div className="flex flex-col gap-1 border-l-2 border-deck-warning bg-deck-bg px-3 py-2">
          <p className="text-[13px] font-medium leading-snug text-white">{exp.prompt}</p>
          {missTap && (
            <p className="font-typer text-[11px] text-deck-warning">
              Nicht diese. Die Payloads erzählen, wo es passiert ist — Stationen ansehen und nochmal.
            </p>
          )}
        </div>
      )}
      {phase === 'solved' && (
        <div className="flex flex-col gap-1.5 border-l-2 border-deck-success bg-deck-bg px-3 py-2">
          <p className="text-[13px] leading-snug text-white">{exp.solvedNote}</p>
          <button
            type="button"
            onClick={nextRun}
            className="self-start border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            {solvedCount >= EXPERIMENTS.length ? 'Protokoll abschließen ▸' : `Weiter zu Lauf ${solvedCount + 1} ▸`}
          </button>
        </div>
      )}

      {/* Inspector */}
      {phase !== 'briefing' && shown && (
        <div className="flex flex-col gap-1.5 border-l-2 border-deck-border pl-2.5">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            {shown.title} · Payload
          </span>
          <div className="flex flex-col gap-0.5 border border-deck-border-dim bg-deck-bg px-2 py-1.5">
            {shown.payload.map((line, i) => (
              <code key={i} className="font-typer text-[11px] leading-relaxed text-white">
                {line}
              </code>
            ))}
          </div>
          <p className="text-[12px] leading-snug text-deck-muted">{shown.note}</p>
        </div>
      )}

      {/* Answer */}
      {done && !running && (
        <div className={cn('flex flex-col gap-1 border-l-4 bg-deck-bg px-3 py-2', verdictBorder[trace.answer.verdict])}>
          <span className="text-[13px] font-medium leading-snug text-white">{trace.answer.text}</span>
          <span className="text-[12px] leading-snug text-deck-muted">{trace.answer.explain}</span>
        </div>
      )}

      {/* Findings board — fills run by run; at the end it IS the break-map */}
      {findings.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Befunde {findings.length}/{EXPERIMENTS.length}
          </span>
          <div className="flex flex-col">
            {findings.map((f) => (
              <div
                key={f.id}
                className={cn('flex items-baseline gap-2 border-l-2 bg-deck-bg px-2 py-1', verdictBorder[f.verdict])}
              >
                <span className="w-28 shrink-0 font-typer text-[10px] uppercase tracking-wide text-deck-muted">
                  ohne {f.missing === '—' ? 'nichts' : f.missing}
                </span>
                <span className="text-[12px] leading-snug text-white">{f.finding}</span>
              </div>
            ))}
          </div>
          {phase === 'free' && (
            <p className="text-[11px] leading-snug text-deck-muted">
              Protokoll abgeschlossen. Die Ebenen oben sind jetzt frei schaltbar — auch in Kombinationen, die im Protokoll nicht vorkamen.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
