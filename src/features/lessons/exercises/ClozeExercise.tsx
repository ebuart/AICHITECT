import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise, PickOption } from '../lessonModel'
import { CodeBlock, ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `cloze` — fill each blank in shown material (a config / schema / tool definition) from
// that blank's own option chips. Crossword-like; great for "complete the structure".
export function ClozeExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'cloze' }>
  onAnswered: (id: string) => void
}) {
  const [shuffled] = useState<Record<string, PickOption[]>>(() =>
    Object.fromEntries(exercise.blanks.map((b) => [b.id, shuffle(b.options)])),
  )
  const [choice, setChoice] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const allChosen = exercise.blanks.every((b) => choice[b.id])

  const submit = () => {
    if (checked || !allChosen) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}
      {exercise.code && <CodeBlock code={exercise.code} />}

      <div className="flex flex-col gap-2.5">
        {exercise.blanks.map((b, i) => {
          const picked = choice[b.id]
          const chosenOpt = b.options.find((o) => o.id === picked)
          return (
            <div key={b.id} className="flex flex-col gap-1">
              <p className="font-typer text-[11px] uppercase tracking-wide text-deck-muted">
                ▢{i + 1} {b.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {shuffled[b.id].map((o) => {
                  const state = !checked
                    ? picked === o.id
                      ? 'sel'
                      : 'idle'
                    : o.correct
                      ? 'correct'
                      : o.id === picked
                        ? 'wrong'
                        : 'dim'
                  return (
                    <button
                      key={o.id}
                      type="button"
                      disabled={checked}
                      onClick={() => setChoice((p) => ({ ...p, [b.id]: o.id }))}
                      className={cn(
                        'border px-2 py-1 text-[12px] transition-colors',
                        state === 'idle' && 'border-deck-border-dim text-white hover:border-white',
                        state === 'sel' && 'border-white bg-white text-black',
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
              {checked && chosenOpt && (
                <p className="text-[11px] text-deck-muted">
                  <span className={chosenOpt.correct ? 'text-deck-success' : 'text-deck-danger'}>
                    {chosenOpt.correct ? '✓ ' : '✗ '}
                  </span>
                  {chosenOpt.why}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!checked ? (
        <Button onClick={submit} disabled={!allChosen}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
