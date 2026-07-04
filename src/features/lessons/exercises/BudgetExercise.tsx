import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useStrings } from '@/lib/i18n'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `budget` — allocate a fixed total across items with +/- steppers. Deterministic: no stored
// answer, the checker verifies each value sits in its good-range AND the total fits the cap.
// The most game-like mechanic — tradeoff reasoning under a hard constraint.
export function BudgetExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'budget' }>
  onAnswered: (id: string) => void
}) {
  const t = useStrings()
  const step = exercise.step ?? 1
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(exercise.items.map((it) => [it.id, it.min])),
  )
  const [checked, setChecked] = useState(false)
  const used = exercise.items.reduce((s, it) => s + vals[it.id], 0)
  const over = used > exercise.total
  const unit = exercise.unit ?? ''

  const bump = (id: string, dir: -1 | 1) => {
    if (checked) return
    setVals((p) => ({ ...p, [id]: Math.max(0, Math.min(exercise.total, p[id] + dir * step)) }))
  }
  const submit = () => {
    if (checked || over) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      <div
        className={cn(
          'flex items-center justify-between border px-2.5 py-1.5 font-typer text-[12px]',
          over ? 'border-deck-danger text-deck-danger' : 'border-deck-border-dim text-white',
        )}
      >
        <span className="uppercase tracking-wide text-deck-muted">Vergeben</span>
        <span className="tabular-nums">
          {used} / {exercise.total} {unit}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {exercise.items.map((it) => {
          const v = vals[it.id]
          const inRange = checked && v >= it.min && v <= it.max
          const outRange = checked && (v < it.min || v > it.max)
          return (
            <div
              key={it.id}
              className={cn(
                'border px-2.5 py-1.5',
                !checked && 'border-deck-border-dim',
                inRange && 'border-deck-success',
                outRange && 'border-deck-danger',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-white">{it.label}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="weniger"
                    disabled={checked}
                    onClick={() => bump(it.id, -1)}
                    className="border border-deck-border-dim px-2 leading-none text-white hover:bg-white hover:text-black disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-12 text-right font-typer text-[12px] tabular-nums text-white">{v}</span>
                  <button
                    type="button"
                    aria-label="mehr"
                    disabled={checked}
                    onClick={() => bump(it.id, 1)}
                    className="border border-deck-border-dim px-2 leading-none text-white hover:bg-white hover:text-black disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              {it.hint && !checked && <p className="mt-0.5 text-[11px] text-deck-muted">{it.hint}</p>}
              {outRange && (
                <p className="mt-0.5 text-[11px] text-deck-warning">
                  Gültig: {it.min}–{it.max} {unit}. {it.hint}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!checked ? (
        <Button onClick={submit} disabled={over}>
          {over ? `${used - exercise.total} ${unit} über dem Limit` : t.exCheck}
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
