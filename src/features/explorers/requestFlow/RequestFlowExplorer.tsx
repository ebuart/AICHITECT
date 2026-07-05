import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import {
  ALL_ON,
  FLOW_TOGGLES,
  traceRequest,
  type StationSnapshot,
  type StationStatus,
} from './model'

// RequestFlowExplorer (EXP-REQUEST-FLOW, control/10 IX rules): the learner sends ONE request
// through the pipeline, watches it hop station to station, opens any station to read the
// payload at that point — then switches layers off and sends again. The failure mapping
// (missing layer → characteristic incident) is the lesson; the exercises afterwards only
// confirm what the hands already know.

const STEP_MS = 620

const statusDot: Record<StationStatus, string> = {
  ok: 'bg-deck-success',
  warn: 'bg-deck-warning',
  fail: 'bg-deck-danger',
  off: 'bg-deck-border-dim',
}

export function RequestFlowExplorer() {
  const [active, setActive] = useState<Set<string>>(new Set(ALL_ON))
  const [trace, setTrace] = useState(() => traceRequest(ALL_ON as Set<string>))
  // -1 = idle (nothing run yet or finished), otherwise index of the station the packet is at.
  const [step, setStep] = useState(-1)
  const [ran, setRan] = useState(false)
  const [inspected, setInspected] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const running = step >= 0 && step < trace.steps.length
  const done = ran && !running

  const send = () => {
    if (running) return
    const t = traceRequest(active)
    setTrace(t)
    setRan(true)
    setInspected(null)
    setStep(0)
  }
  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s + 1 >= trace.steps.length) {
          if (timer.current) clearInterval(timer.current)
          return trace.steps.length // past the end = arrived
        }
        return s + 1
      })
    }, STEP_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // re-arm only when a new run starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ran, trace])

  const toggle = (id: string) => {
    if (running) return
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const shownIndex = inspected ?? (running ? step : done ? trace.steps.length - 1 : null)
  const shown: StationSnapshot | null = shownIndex != null ? (trace.steps[shownIndex] ?? null) : null

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      {/* Switchboard */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">Ebenen</span>
        {FLOW_TOGGLES.map((t) => {
          const on = active.has(t.id)
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              disabled={running}
              title={on ? `${t.label} abschalten — ${t.off}` : t.off}
              className={cn(
                'border px-2 py-1 font-typer text-[10px] uppercase tracking-wide transition-colors',
                on
                  ? 'border-deck-border text-white hover:border-white'
                  : 'border-deck-danger text-deck-danger line-through',
              )}
            >
              {t.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={send}
          disabled={running}
          className={cn(
            'ml-auto border px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide transition-colors',
            running ? 'border-deck-border-dim text-deck-muted' : 'border-white text-white hover:bg-white hover:text-black',
          )}
        >
          {ran ? 'Nochmal senden' : 'Anfrage senden'} ▸
        </button>
      </div>

      {/* Pipeline */}
      <div className="flex items-stretch gap-0 overflow-x-auto pb-1">
        {trace.steps.map((s, i) => {
          const reached = ran && (running ? i <= step : true)
          const isCurrent = running && i === step
          const isShown = shownIndex === i
          return (
            <div key={s.station} className="flex min-w-0 flex-1 items-center" style={{ minWidth: 86 }}>
              <button
                type="button"
                onClick={() => ran && setInspected(i)}
                className={cn(
                  'flex w-full flex-col items-center gap-1 border px-1.5 py-2 transition-all duration-300',
                  isShown ? 'border-white bg-white' : 'border-deck-border-dim bg-deck-bg',
                  isCurrent && 'border-white',
                  !reached && 'opacity-40',
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
                    ran && (running ? i < step : true) ? 'bg-white' : 'bg-deck-border-dim',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Inspector */}
      {shown ? (
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
      ) : (
        <p className="text-[12px] leading-snug text-deck-muted">
          Schick die Anfrage los und tipp danach jede Station an, um zu sehen, wie sie dort aussieht.
          Dann: schalt eine Ebene ab und schick sie nochmal.
        </p>
      )}

      {/* Answer */}
      {done && (
        <div
          className={cn(
            'flex flex-col gap-1 border-l-4 bg-deck-bg px-3 py-2',
            trace.answer.verdict === 'good' && 'border-deck-success',
            trace.answer.verdict === 'bad' && 'border-deck-danger',
            trace.answer.verdict === 'blocked' && 'border-deck-warning',
          )}
        >
          <span className="text-[13px] font-medium leading-snug text-white">{trace.answer.text}</span>
          <span className="text-[12px] leading-snug text-deck-muted">{trace.answer.explain}</span>
        </div>
      )}
    </div>
  )
}
