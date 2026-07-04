import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `annotate` — read a big agent response and tap the segments that are red flags. A `legend`
// teaches WHICH tells to look for up front; on reveal every flag is labelled with its category
// + why + a fix. Teaches reading long model output critically: where to look for what.
export function AnnotateExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'annotate' }>
  onAnswered: (id: string) => void
}) {
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState(false)

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const submit = () => {
    if (checked || sel.size === 0) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      {exercise.legend && (
        <div className="border border-deck-border-dim p-2">
          <p className="mb-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">
            Worauf achten
          </p>
          <ul className="flex flex-col gap-0.5">
            {exercise.legend.map((l, i) => (
              <li key={i} className="text-[11px] text-deck-muted">
                <span className="text-white">{l.label}:</span> {l.hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="border border-deck-border-dim bg-deck-surface-2 p-2.5 text-[13px] leading-relaxed">
        {exercise.segments.map((s) => {
          const picked = sel.has(s.id)
          const isFlag = !!s.flag
          const caught = checked && isFlag && picked
          const missed = checked && isFlag && !picked
          const wrong = checked && !isFlag && picked
          return (
            <span key={s.id}>
              <span
                role="button"
                tabIndex={checked ? -1 : 0}
                onClick={() => !checked && toggle(s.id)}
                className={cn(
                  'transition-colors',
                  !checked && 'cursor-pointer',
                  !checked && picked && 'bg-white text-black',
                  !checked && !picked && 'text-deck-muted hover:text-white',
                  caught && 'text-deck-success underline decoration-deck-success',
                  missed && 'text-deck-warning underline decoration-dotted decoration-deck-warning',
                  wrong && 'text-deck-danger line-through decoration-deck-danger',
                  checked && !isFlag && !picked && 'text-deck-muted',
                )}
              >
                {s.text}
              </span>{' '}
            </span>
          )
        })}
      </p>

      {checked && (
        <div className="flex flex-col gap-1.5">
          {exercise.segments
            .filter((s) => s.flag)
            .map((s) => {
              const caught = sel.has(s.id)
              return (
                <div
                  key={s.id}
                  className={cn('border-l-2 pl-2 text-[11px]', caught ? 'border-deck-success' : 'border-deck-warning')}
                >
                  <p className="text-white">
                    <span className={caught ? 'text-deck-success' : 'text-deck-warning'}>
                      {caught ? '✓ ' : 'Verpasst — '}
                    </span>
                    {s.flag!.category}
                  </p>
                  <p className="text-deck-muted">
                    {s.flag!.why}
                    {s.flag!.fix && (
                      <>
                        {' '}
                        <span className="text-white">Fix:</span> {s.flag!.fix}
                      </>
                    )}
                  </p>
                </div>
              )
            })}
        </div>
      )}

      {!checked ? (
        <Button onClick={submit} disabled={sel.size === 0}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
