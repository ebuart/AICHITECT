import { useEffect, useLayoutEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

// An ACTIVE onboarding: it spotlights the relevant control and waits for the player to actually DO
// each step (press Play, tap the Charter, answer one example question, switch to the Karte, place the
// first node) — so they feel the flow instead of reading about it. Targets are real DOM elements
// tagged with `data-tour="…"`; the dim/ring is pointer-events-none so the real UI stays interactive.
export interface TourSignals {
  speed: number
  view: 'tree' | 'map'
  selected: string | null
  soloPlaced: boolean
}

type Step =
  | { kind: 'info'; title: string; text: string; target?: string }
  | { kind: 'action'; title: string; text: string; target?: string; done: (s: TourSignals) => boolean }
  | { kind: 'quiz'; title: string; text: string; q: string; options: { label: string; correct?: boolean }[]; target?: string }

const STEPS: Step[] = [
  {
    kind: 'info',
    title: 'Willkommen in der Werft',
    text: 'Lass es uns einmal zusammen anfahren — du machst jeden Schritt selbst, so spürst du direkt den Flow.',
  },
  {
    kind: 'action',
    target: 'play',
    title: 'Zeit starten',
    text: 'Drück ▶ (unten in der Leiste). Die Zeit läuft und Budget kommt automatisch.',
    done: (s) => s.speed > 0,
  },
  {
    kind: 'action',
    target: 'canvas',
    title: 'Einen Skill antippen',
    text: 'Tippe oben im Shop den „Projekt-Charter" an (der Wurzel-Knoten ganz oben).',
    done: (s) => s.selected === 'charter',
  },
  {
    kind: 'quiz',
    title: 'So fühlt sich eine Quest an',
    text: 'Jeder Knoten ist eine kurze Lektion. Beantworte fix:',
    q: 'Wofür steht der Projekt-Charter?',
    options: [
      { label: 'Contract + Non-Goals — die autoritativen Leitplanken', correct: true },
      { label: 'Eine simple To-do-Liste' },
      { label: 'Der Server, auf dem alles läuft' },
    ],
  },
  {
    kind: 'action',
    target: 'views',
    title: 'Auf die Karte wechseln',
    text: 'Wechsel auf „Karte" (Knopf oben, oder Taste F).',
    done: (s) => s.view === 'map',
  },
  {
    kind: 'action',
    target: 'canvas',
    title: 'Den ersten Knoten platzieren',
    text: 'Zieh „Solo (du)" aus dem Lager (oben) runter in eine Phase. Platziert = Bonus.',
    done: (s) => s.soloPlaced,
  },
  {
    kind: 'info',
    title: 'Geschafft!',
    text: 'Du hast den Flow gespürt: Zeit läuft → im Shop lernen & kaufen → auf der Karte richtig platzieren → Releases liefern. Ab hier baust du frei. Viel Erfolg!',
  },
]

export function WerftTour({ signals, onFinish }: { signals: TourSignals; onFinish: () => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const step = STEPS[i]
  const last = i === STEPS.length - 1
  const advance = () => {
    if (last) onFinish()
    else {
      setPicked(null)
      setI((n) => n + 1)
    }
  }

  // Action steps auto-advance once the player has actually done the thing (brief beat for feedback).
  useEffect(() => {
    if (step.kind === 'action' && step.done(signals)) {
      const t = setTimeout(advance, 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, step.kind === 'action' && step.done(signals)])

  // Track the highlight rectangle of the current target (the page container + HUD bars are stable, so
  // measuring on step change + resize is enough — no polling churn).
  const [rect, setRect] = useState<DOMRect | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = step.target ? document.querySelector(`[data-tour="${step.target}"]`) : null
      setRect(el ? el.getBoundingClientRect() : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [i, step.target])

  const quizCorrect = step.kind === 'quiz' && picked != null && !!step.options[picked].correct
  const canContinue = step.kind === 'info' || quizCorrect
  const bubbleTop = rect ? rect.top > window.innerHeight / 2 : false

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* spotlight: a transparent hole over the target with a huge box-shadow dimming the rest */}
      {rect ? (
        <div
          aria-hidden
          className="absolute border-2 border-white transition-all duration-200"
          style={{ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)' }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-black/55" />
      )}

      {/* coach bubble (interactive) — flips to the opposite side of the highlight */}
      <div
        className="pointer-events-auto absolute left-1/2 w-[min(460px,92vw)] -translate-x-1/2 border border-deck-border bg-deck-bg p-4"
        style={bubbleTop ? { top: 16 } : { bottom: 16 }}
      >
        <div className="flex items-center justify-between">
          <span className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">Tutorial · {i + 1}/{STEPS.length}</span>
          <button type="button" onClick={onFinish} className="font-typer text-[10px] uppercase text-deck-muted hover:text-white">Überspringen ✕</button>
        </div>
        <h2 className="mt-1.5 text-base font-semibold text-white">{step.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-deck-muted">{step.text}</p>

        {step.kind === 'quiz' && (
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="font-typer text-[11px] text-white">{step.q}</p>
            {step.options.map((o, k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPicked(k)}
                className={cn(
                  'border px-2 py-1.5 text-left text-[12px] transition-colors',
                  picked === k ? (o.correct ? 'border-deck-success text-deck-success' : 'border-deck-danger text-deck-danger') : 'border-deck-border-dim text-white hover:border-white',
                )}
              >
                {o.label}
                {picked === k ? (o.correct ? ' ✓' : ' ✗') : ''}
              </button>
            ))}
            {picked != null && !quizCorrect && <p className="font-typer text-[10px] text-deck-warning">Nicht ganz — tipp die richtige Option.</p>}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">{step.kind === 'action' ? '↑ mach den Schritt …' : ''}</span>
          {canContinue && (
            <button
              type="button"
              onClick={advance}
              className="border border-white bg-white px-4 py-1.5 font-typer text-[11px] uppercase text-black transition-colors hover:bg-transparent hover:text-white"
            >
              {last ? 'Fertig' : 'Weiter'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
