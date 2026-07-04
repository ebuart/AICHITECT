import { useMemo, useState, type ReactElement } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `threshold` — set ONE cutoff (slider) that admits the keep-samples and rejects the rest.
// Deterministic: a sample is handled correctly when (value >= τ) === keep. Makes the
// precision/recall (or safety-floor) tradeoff visceral — you watch errors appear as you move τ.
export function ThresholdExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'threshold' }>
  onAnswered: (id: string) => void
}) {
  const step = exercise.step ?? 1
  const [t, setT] = useState(exercise.min)
  const [checked, setChecked] = useState(false)
  const unit = exercise.unit ?? ''

  // Render high→low so the cutoff reads as a line: everything above τ is admitted.
  const sorted = useMemo(
    () => [...exercise.samples].sort((a, b) => b.value - a.value),
    [exercise.samples],
  )
  const submit = () => {
    if (checked) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  const rows: ReactElement[] = []
  let dividerDrawn = false
  for (const s of sorted) {
    if (!dividerDrawn && s.value < t) {
      rows.push(
        <div key="divider" className="my-0.5 flex items-center gap-2 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
          <span className="h-px flex-1 bg-white" /> τ = {t} {unit} <span className="h-px flex-1 bg-white" />
        </div>,
      )
      dividerDrawn = true
    }
    const admit = s.value >= t
    const ok = checked && admit === s.keep
    const bad = checked && admit !== s.keep
    rows.push(
      <div
        key={s.id}
        className={cn(
          'flex items-center justify-between border px-2.5 py-1 text-[12px]',
          !checked && 'border-deck-border-dim',
          ok && 'border-deck-success',
          bad && 'border-deck-danger',
        )}
      >
        <span className={cn(bad ? 'text-deck-danger' : ok ? 'text-deck-success' : 'text-white')}>
          {s.label}
          <span className="ml-1.5 font-typer text-deck-muted">{s.value}</span>
        </span>
        <span className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">
          {admit ? 'zulassen' : 'ablehnen'}
          {checked && (s.keep ? ' · soll: zulassen' : ' · soll: ablehnen')}
        </span>
      </div>,
    )
  }
  if (!dividerDrawn) {
    rows.push(
      <div key="divider" className="my-0.5 flex items-center gap-2 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
        <span className="h-px flex-1 bg-white" /> τ = {t} {unit} <span className="h-px flex-1 bg-white" />
      </div>,
    )
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      <div className="flex items-center gap-2">
        <span className="font-typer text-[11px] text-deck-muted">{exercise.min}</span>
        <input
          type="range"
          min={exercise.min}
          max={exercise.max}
          step={step}
          value={t}
          disabled={checked}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none bg-deck-border-dim accent-white"
          aria-label="Schwelle"
        />
        <span className="font-typer text-[11px] text-deck-muted">{exercise.max}</span>
      </div>

      <div className="flex flex-col">{rows}</div>

      {!checked ? (
        <Button onClick={submit}>Prüfen</Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
