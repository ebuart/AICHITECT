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

// RequestFlowExplorer (EXP-REQUEST-FLOW, control/10). Guided protocol, reworked after user
// testing (2026-07-05): tapping a station only INSPECTS its payload — answering is the
// explicit "melden" button inside the payload panel, so reading first is free. Status
// colors stay hidden until a run is solved (SPOILER_RULE: the payloads are the evidence,
// the colors are the confirmation). One AUFGABE panel carries briefing → watch-hint →
// question (with the user-visible outcome inline) → solved note, so there is exactly one
// place that says what to do. The PROTOKOLL board fills per solved run; free play unlocks
// at the end. onComplete fires when the protocol is done — the lesson requires it.

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
  const [missReport, setMissReport] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const completed = useRef(false)

  const exp = EXPERIMENTS[expIdx]
  const inProtocol = phase !== 'free'
  const running = phase === 'running'
  // The payloads are the evidence; colors would give the diagnosis away. Reveal on solve.
  const revealColors = phase === 'solved' || phase === 'free'

  const startRun = (toggles: Set<string>) => {
    const t = traceRequest(toggles)
    setTrace(t)
    setInspected(null)
    setMissReport(false)
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

  const reportInspected = () => {
    if (phase !== 'diagnose' || inspected == null) return
    if (trace.steps[inspected]?.station === exp.target) {
      setMissReport(false)
      setPhase('solved')
      const solved = solvedCount + 1
      setSolvedCount(solved)
      if (solved === EXPERIMENTS.length && !completed.current) {
        completed.current = true
        onComplete?.()
      }
    } else {
      setMissReport(true)
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
    setMissReport(false)
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
  const shownIndex = inspected ?? (running ? step : done && phase !== 'diagnose' ? trace.steps.length - 1 : null)
  const shown: StationSnapshot | null = shownIndex != null ? (trace.steps[shownIndex] ?? null) : null
  const findings = EXPERIMENTS.slice(0, solvedCount)

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      {/* Header: protocol progress + layer state */}
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

      {/* AUFGABE — the one panel that says what to do right now */}
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
              <p className="text-[13px] leading-snug text-white">
                {exp.missing === '—'
                  ? 'Erst die Referenz: das vollständige System.'
                  : `Diesmal fehlt: ${exp.missing}. Gleiche Anfrage, anderes System.`}
              </p>
              <p className="text-[12px] leading-snug text-deck-muted">{exp.watch}</p>
              <button
                type="button"
                onClick={() => startRun(new Set(exp.active))}
                className="mt-0.5 self-start border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
              >
                Lauf starten ▸
              </button>
            </>
          )}
          {phase === 'running' && <p className="text-[12px] leading-snug text-deck-muted">{exp.watch}</p>}
          {phase === 'diagnose' && (
            <>
              <p className="text-[12px] leading-snug text-deck-muted">
                Beim Nutzer kommt an: <span className="text-white">{trace.answer.text}</span>
              </p>
              <p className="text-[13px] font-medium leading-snug text-white">{exp.prompt}</p>
              {/* Mechanics are a one-time affordance (VX-T10), not a recurring narration. */}
              {solvedCount === 0 && (
                <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">
                  Stationen antippen und Payloads lesen · melden im Payload-Fenster
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
                {solvedCount >= EXPERIMENTS.length ? 'Protokoll abschließen ▸' : `Weiter zu Lauf ${solvedCount + 1} ▸`}
              </button>
            </>
          )}
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
                  onClick={() => !running && setInspected(i)}
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
                      reached ? (revealColors ? statusDot[s.status] : isShown ? 'bg-black' : 'bg-white') : 'bg-deck-border-dim',
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

      {/* PAYLOAD — inspector; during diagnose it carries the explicit answer button */}
      {phase !== 'briefing' && shown && (
        <div className="flex flex-col gap-1.5 border-l-2 border-deck-border pl-2.5">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Payload · {shown.title}
          </span>
          <div className="flex flex-col gap-0.5 border border-deck-border-dim bg-deck-bg px-2 py-1.5">
            {shown.payload.map((line, i) => (
              <code key={i} className="font-typer text-[11px] leading-relaxed text-white">
                {line}
              </code>
            ))}
          </div>
          {/* Annotations are earned: raw trace while diagnosing, explanation after the solve. */}
          {revealColors && <p className="text-[12px] leading-snug text-deck-muted">{shown.note}</p>}
          {phase === 'diagnose' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={reportInspected}
                className="border border-white px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
              >
                Hier ist es passiert · melden ▸
              </button>
              {missReport && (
                <span className="font-typer text-[11px] text-deck-warning">
                  Nicht diese Station. Weiterlesen, der Payload einer anderen erzählt es.
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {phase === 'diagnose' && !shown && solvedCount === 0 && (
        <p className="text-[12px] leading-snug text-deck-muted">
          Eine Station antippen, um ihren Payload zu lesen.
        </p>
      )}

      {/* Answer card only in free play (during the protocol it lives inside AUFGABE) */}
      {phase === 'free' && done && (
        <div className={cn('flex flex-col gap-1 border-l-4 bg-deck-bg px-3 py-2', verdictBorder[trace.answer.verdict])}>
          <span className="text-[13px] font-medium leading-snug text-white">{trace.answer.text}</span>
          <span className="text-[12px] leading-snug text-deck-muted">{trace.answer.explain}</span>
        </div>
      )}

      {/* PROTOKOLL — fills per solved run; at 5/5 it is the layer→incident map */}
      {findings.length > 0 && phase !== 'diagnose' && (
        <div className="flex flex-col gap-1">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Protokoll {findings.length}/{EXPERIMENTS.length}
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
              Die Ebenen sind jetzt frei schaltbar, auch in Kombinationen, die im Protokoll nicht vorkamen.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
