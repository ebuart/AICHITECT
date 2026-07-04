import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `order` — arrange items into the correct sequence. Items are authored IN the correct
// order; shuffled at render. Mobile: up/down buttons (no drag). Reveal marks each row and
// shows where a misplaced one belongs.
export function OrderExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'order' }>
  onAnswered: (id: string) => void
}) {
  const correctIds = exercise.items.map((i) => i.id)
  const [order, setOrder] = useState<string[]>(() => {
    let s = shuffle(correctIds)
    if (correctIds.length > 2 && s.every((id, i) => id === correctIds[i])) s = shuffle(correctIds)
    return s
  })
  const [checked, setChecked] = useState(false)
  const textOf = (id: string) => exercise.items.find((i) => i.id === id)!.text

  const move = (idx: number, dir: -1 | 1) => {
    if (checked) return
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }
  const submit = () => {
    if (checked) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}
      <ol className="flex flex-col gap-1.5">
        {order.map((id, idx) => {
          const correctPos = correctIds.indexOf(id)
          const placed = checked && correctPos === idx
          const wrong = checked && correctPos !== idx
          return (
            <li
              key={id}
              className={cn(
                'flex items-center gap-2 border px-2.5 py-2 text-[13px]',
                !checked && 'border-deck-border-dim text-white',
                placed && 'border-deck-success text-deck-success',
                wrong && 'border-deck-danger text-deck-danger',
              )}
            >
              <span aria-hidden className="font-typer tabular-nums text-deck-muted">
                {idx + 1}
              </span>
              <span className="flex-1">{textOf(id)}</span>
              {checked ? (
                <span className="font-typer text-[11px] text-deck-muted">
                  {placed ? '✓' : `→ ${correctPos + 1}`}
                </span>
              ) : (
                <span className="flex flex-col leading-none">
                  <button
                    type="button"
                    aria-label="nach oben"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="px-1 text-deck-muted hover:text-white disabled:opacity-25"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="nach unten"
                    onClick={() => move(idx, 1)}
                    disabled={idx === order.length - 1}
                    className="px-1 text-deck-muted hover:text-white disabled:opacity-25"
                  >
                    ▼
                  </button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!checked ? (
        <Button onClick={submit}>Prüfen</Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
