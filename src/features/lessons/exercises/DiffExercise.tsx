import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `diff` — read an ASCII +/- diff and tap the changed line that introduces the problem.
// Couples a delta to its second-order effect (the core PR/config-review skill).
export function DiffExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'diff' }>
  onAnswered: (id: string) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const revealed = picked != null
  const chosen = exercise.lines.find((l) => l.id === picked)
  const hit = chosen?.bad ?? false
  const badLine = exercise.lines.find((l) => l.bad)

  const choose = (id: string) => {
    if (revealed) return
    setPicked(id)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      <div className="flex flex-col border border-deck-border-dim bg-deck-surface-2 p-2 font-typer text-[12px] leading-relaxed">
        {exercise.lines.map((l) => {
          const sign = l.sign ?? ' '
          const state = !revealed
            ? 'idle'
            : l.bad
              ? 'bad'
              : l.id === picked
                ? 'wrong'
                : 'dim'
          const tappable = sign !== ' '
          return (
            <button
              key={l.id}
              type="button"
              disabled={revealed || !tappable}
              onClick={() => choose(l.id)}
              className={cn(
                'flex gap-2 border px-1.5 py-0.5 text-left transition-colors',
                state === 'idle' && tappable && 'border-transparent text-white hover:border-white',
                state === 'idle' && !tappable && 'border-transparent text-deck-muted',
                state === 'bad' && 'border-deck-success text-deck-success',
                state === 'wrong' && 'border-deck-danger text-deck-danger',
                state === 'dim' && 'border-transparent text-deck-muted',
              )}
            >
              <span aria-hidden className="w-3 shrink-0 text-center text-deck-muted">
                {sign}
              </span>
              <span className="whitespace-pre-wrap">{l.text}</span>
            </button>
          )
        })}
      </div>

      {revealed && (
        <p className="text-[12px] text-deck-muted">
          <span className={hit ? 'text-deck-success' : 'text-deck-danger'}>
            {hit ? 'Erwischt. ' : 'Nicht ganz. '}
          </span>
          {chosen?.note}
          {!hit && badLine?.note && ` ${badLine.note}`}
        </p>
      )}
      {revealed && exercise.takeaway && <Takeaway text={exercise.takeaway} />}
    </ExerciseBody>
  )
}
