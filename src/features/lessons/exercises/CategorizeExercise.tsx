import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Stem, Takeaway } from './shared'

// `categorize` — sort each item into its correct bucket (N buckets; harder than binary
// multi because each item is an independent N-way choice). Tap a bucket chip per item.
export function CategorizeExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'categorize' }>
  onAnswered: (id: string) => void
}) {
  const [items] = useState(() => shuffle(exercise.items))
  const [assign, setAssign] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const allAssigned = exercise.items.every((it) => assign[it.id])
  const bucketLabel = (id: string) => exercise.buckets.find((b) => b.id === id)?.label ?? ''

  const submit = () => {
    if (checked || !allAssigned) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      <div className="flex flex-col gap-2">
        {items.map((it) => {
          const chosen = assign[it.id]
          const correct = checked && chosen === it.bucketId
          const wrong = checked && chosen !== it.bucketId
          return (
            <div
              key={it.id}
              className={cn(
                'border px-2.5 py-2',
                !checked && 'border-deck-border-dim',
                correct && 'border-deck-success',
                wrong && 'border-deck-danger',
              )}
            >
              <p
                className={cn(
                  'text-[13px]',
                  !checked && 'text-white',
                  correct && 'text-deck-success',
                  wrong && 'text-deck-danger',
                )}
              >
                {it.text}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {exercise.buckets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    disabled={checked}
                    onClick={() => setAssign((p) => ({ ...p, [it.id]: b.id }))}
                    className={cn(
                      'border px-2 py-1 text-[11px] uppercase tracking-wide transition-colors',
                      chosen === b.id
                        ? 'border-white bg-white text-black'
                        : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              {checked && (
                <p className="mt-1 text-[11px] text-deck-muted">
                  {wrong && <span className="text-deck-warning">Richtig: {bucketLabel(it.bucketId)}. </span>}
                  {it.why}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {!checked ? (
        <Button onClick={submit} disabled={!allAssigned}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
