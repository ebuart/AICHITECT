import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise } from './lessonModel'
import { CodeBlock, Stem, Takeaway } from './exercises/shared'
import { OrderExercise } from './exercises/OrderExercise'
import { CategorizeExercise } from './exercises/CategorizeExercise'
import { MatchExercise } from './exercises/MatchExercise'
import { ClozeExercise } from './exercises/ClozeExercise'
import { StepwiseExercise } from './exercises/StepwiseExercise'
import { MultiSpotExercise } from './exercises/MultiSpotExercise'
import { BudgetExercise } from './exercises/BudgetExercise'
import { ThresholdExercise } from './exercises/ThresholdExercise'
import { ContradictionExercise } from './exercises/ContradictionExercise'
import { DiffExercise } from './exercises/DiffExercise'
import { ComposeExercise } from './exercises/ComposeExercise'
import { AnnotateExercise } from './exercises/AnnotateExercise'

// Renders a bespoke concrete exercise (post-template redesign) — a puzzle-game library, not
// MCQ-only. Tap-first, mobile-safe, brutalist B/W. `pick`/`multi`/`spot` live here; the rest
// are in ./exercises/*. The square mark opens every exercise; selection is the inversion
// (white block / black text); the rare colour appears only on reveal as a thin border + text.
export function ExerciseView({
  exercise,
  onAnswered,
}: {
  exercise: Exercise
  onAnswered: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col border border-deck-border bg-deck-surface p-3">
      {exercise.format === 'pick' && <PickExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'multi' && <MultiExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'spot' && <SpotExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'order' && <OrderExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'categorize' && <CategorizeExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'match' && <MatchExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'cloze' && <ClozeExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'stepwise' && <StepwiseExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'multispot' && <MultiSpotExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'budget' && <BudgetExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'threshold' && <ThresholdExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'contradiction' && <ContradictionExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'diff' && <DiffExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'compose' && <ComposeExercise exercise={exercise} onAnswered={onAnswered} />}
      {exercise.format === 'annotate' && <AnnotateExercise exercise={exercise} onAnswered={onAnswered} />}
    </div>
  )
}

function PickExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'pick' }>
  onAnswered: (id: string) => void
}) {
  const [options] = useState(() => shuffle(exercise.options))
  const [picked, setPicked] = useState<string | null>(null)
  const revealed = picked != null
  const chosen = options.find((o) => o.id === picked)

  const choose = (id: string) => {
    if (revealed) return
    setPicked(id)
    onAnswered(exercise.id)
  }

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-2.5">
      <Stem>{exercise.stem}</Stem>

      {exercise.code && <CodeBlock code={exercise.code} />}

      {exercise.trace && (
        <ol className="flex flex-col gap-1">
          {exercise.trace.map((t) => (
            <li
              key={t.step}
              className={cn(
                'flex gap-2 border px-2.5 py-1.5 text-[12px]',
                revealed && t.bad
                  ? 'border-deck-danger text-deck-danger'
                  : 'border-deck-border-dim bg-deck-surface-2 text-deck-muted',
              )}
            >
              <span className="tabular-nums text-deck-muted">{t.step}</span>
              <span>{t.text}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-col gap-1.5">
        {options.map((o) => {
          const state = !revealed
            ? 'idle'
            : o.correct
              ? 'correct'
              : o.id === picked
                ? 'wrong'
                : 'dim'
          return (
            <button
              key={o.id}
              type="button"
              disabled={revealed}
              onClick={() => choose(o.id)}
              className={cn(
                'border px-3 py-2 text-left text-[13px] transition-colors',
                state === 'idle' && 'border-deck-border-dim text-white hover:border-white',
                state === 'correct' && 'border-deck-success text-deck-success',
                state === 'wrong' && 'border-deck-danger text-deck-danger',
                state === 'dim' && 'border-deck-border-dim text-deck-muted',
              )}
            >
              {o.text}
            </button>
          )
        })}
      </div>

      {revealed && chosen && (
        <p className="text-[12px] text-deck-muted">
          <span className={chosen.correct ? 'text-deck-success' : 'text-deck-danger'}>
            {chosen.correct ? 'Richtig. ' : 'Daneben. '}
          </span>
          {chosen.why}
        </p>
      )}
      {revealed && exercise.takeaway && <Takeaway text={exercise.takeaway} />}
    </div>
  )
}

function MultiExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'multi' }>
  onAnswered: (id: string) => void
}) {
  const [options] = useState(() => shuffle(exercise.options))
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState(false)

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const submit = () => {
    if (checked) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-2.5">
      <Stem>{exercise.stem}</Stem>
      <p className="text-[11px] uppercase tracking-wide text-deck-muted">
        Mehrfachauswahl — wähle alle zutreffenden.
      </p>

      {exercise.code && <CodeBlock code={exercise.code} />}

      <div className="flex flex-col gap-1.5">
        {options.map((o) => {
          const picked = sel.has(o.id)
          // Colour by TRUTH, never by whether it was picked: a correct answer is ALWAYS
          // green (even if missed), red is reserved for an option wrongly selected.
          const correctAns = checked && o.correct
          const wrongPick = checked && !o.correct && picked
          const missed = checked && o.correct && !picked
          return (
            <button
              key={o.id}
              type="button"
              disabled={checked}
              onClick={() => toggle(o.id)}
              className={cn(
                'flex items-start gap-2 border px-3 py-2 text-left text-[13px] transition-colors',
                !checked && picked && 'border-white bg-white text-black',
                !checked && !picked && 'border-deck-border-dim text-white hover:border-white',
                correctAns && 'border-deck-success text-deck-success',
                wrongPick && 'border-deck-danger text-deck-danger',
                checked && !o.correct && !picked && 'border-deck-border-dim text-deck-muted',
              )}
            >
              <span aria-hidden className="mt-px font-typer">
                {checked ? (o.correct || picked ? '■' : '□') : picked ? '■' : '□'}
              </span>
              <span>
                {o.text}
                {checked && (
                  <span className="mt-0.5 block text-[11px] text-deck-muted">
                    {missed && <span className="text-deck-warning">Verpasst. </span>}
                    {wrongPick && <span className="text-deck-danger">Falsch gewählt. </span>}
                    {o.why}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {!checked ? (
        <Button onClick={submit} disabled={sel.size === 0}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </div>
  )
}

function SpotExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'spot' }>
  onAnswered: (id: string) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const revealed = picked != null
  const chosen = exercise.lines.find((l) => l.id === picked)
  const hit = chosen?.isAttack ?? false

  const choose = (id: string) => {
    if (revealed) return
    setPicked(id)
    onAnswered(exercise.id)
  }

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-2.5">
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <p className="text-[12px] text-deck-muted">{exercise.intro}</p>}

      <div className="flex flex-col gap-1 border border-deck-border-dim bg-deck-surface-2 p-2">
        {exercise.lines.map((l) => {
          const state = !revealed
            ? 'idle'
            : l.isAttack
              ? 'attack'
              : l.id === picked
                ? 'wrong'
                : 'dim'
          return (
            <button
              key={l.id}
              type="button"
              disabled={revealed}
              onClick={() => choose(l.id)}
              className={cn(
                'border px-2.5 py-1.5 text-left text-[12px] leading-relaxed transition-colors',
                state === 'idle' && 'border-transparent text-deck-muted hover:border-white hover:text-white',
                state === 'attack' && 'border-deck-danger text-deck-danger',
                state === 'wrong' && 'border-deck-warning text-deck-warning',
                state === 'dim' && 'border-transparent text-deck-muted',
              )}
            >
              {l.text}
            </button>
          )
        })}
      </div>

      {revealed && (
        <p className="text-[12px] text-deck-muted">
          <span className={hit ? 'text-deck-success' : 'text-deck-danger'}>
            {hit ? 'Erwischt. ' : 'Nicht ganz. '}
          </span>
          {chosen?.note ??
            (hit
              ? ''
              : 'Diese Zeile ist Teil der echten Anfrage — der Angriff steckt woanders.')}
          {!hit &&
            exercise.lines.find((l) => l.isAttack)?.note &&
            ` ${exercise.lines.find((l) => l.isAttack)!.note}`}
        </p>
      )}
      {revealed && exercise.takeaway && <Takeaway text={exercise.takeaway} />}
    </div>
  )
}
