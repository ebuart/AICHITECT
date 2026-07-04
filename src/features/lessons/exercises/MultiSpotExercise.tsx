import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `multispot` — tap ALL offending lines in real text (spot with several targets). Reveal
// marks every attack line green, wrongly-tapped lines red, and missed attacks as "verpasst".
export function MultiSpotExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'multispot' }>
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
      <p className="font-typer text-[11px] uppercase tracking-wide text-deck-muted">
        Tippe alle Treffer an.
      </p>

      <div className="flex flex-col gap-1 border border-deck-border-dim bg-deck-surface-2 p-2">
        {exercise.lines.map((l) => {
          const picked = sel.has(l.id)
          const hit = checked && l.isAttack
          const wrong = checked && picked && !l.isAttack
          const missed = checked && l.isAttack && !picked
          return (
            <button
              key={l.id}
              type="button"
              disabled={checked}
              onClick={() => toggle(l.id)}
              className={cn(
                'flex items-start gap-2 border px-2.5 py-1.5 text-left text-[12px] leading-relaxed transition-colors',
                !checked && picked && 'border-white bg-white text-black',
                !checked && !picked && 'border-transparent text-deck-muted hover:border-white hover:text-white',
                hit && 'border-deck-success text-deck-success',
                wrong && 'border-deck-danger text-deck-danger',
                checked && !picked && !l.isAttack && 'border-transparent text-deck-muted',
              )}
            >
              <span aria-hidden className="font-typer">
                {checked ? (l.isAttack ? '■' : picked ? '■' : '□') : picked ? '■' : '□'}
              </span>
              <span className="flex-1">
                {l.text}
                {missed && <span className="ml-1 text-deck-warning">— verpasst</span>}
                {checked && l.note && (
                  <span className="mt-0.5 block text-[11px] text-deck-muted">{l.note}</span>
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
    </ExerciseBody>
  )
}
