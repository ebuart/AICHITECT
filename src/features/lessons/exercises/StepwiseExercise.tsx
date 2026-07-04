import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `stepwise` — simulate a run: predict the verdict of EACH step from a shared verdict set
// (e.g. ok/fail, or entailed/contradicted/neutral), then reveal the whole trace at once.
// One wrong mental model fails several rows — the statr "run-it-in-your-head" feel.
export function StepwiseExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'stepwise' }>
  onAnswered: (id: string) => void
}) {
  const [assign, setAssign] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const allAssigned = exercise.steps.every((s) => assign[s.id])
  const verdictLabel = (id: string) => exercise.verdicts.find((v) => v.id === id)?.label ?? ''

  const submit = () => {
    if (checked || !allAssigned) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      <ol className="flex flex-col gap-1.5">
        {exercise.steps.map((s, i) => {
          const chosen = assign[s.id]
          const correct = checked && chosen === s.verdictId
          const wrong = checked && chosen !== s.verdictId
          return (
            <li
              key={s.id}
              className={cn(
                'border px-2.5 py-2',
                !checked && 'border-deck-border-dim',
                correct && 'border-deck-success',
                wrong && 'border-deck-danger',
              )}
            >
              <div className="flex gap-2 text-[12px]">
                <span className="font-typer tabular-nums text-deck-muted">{i + 1}</span>
                <span className="flex-1 text-white">{s.text}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {exercise.verdicts.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    disabled={checked}
                    onClick={() => setAssign((p) => ({ ...p, [s.id]: v.id }))}
                    className={cn(
                      'border px-2 py-0.5 text-[11px] uppercase tracking-wide transition-colors',
                      chosen === v.id
                        ? 'border-white bg-white text-black'
                        : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {checked && (
                <p className="mt-1 text-[11px] text-deck-muted">
                  {wrong && <span className="text-deck-warning">Richtig: {verdictLabel(s.verdictId)}. </span>}
                  {s.why}
                </p>
              )}
            </li>
          )
        })}
      </ol>

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
