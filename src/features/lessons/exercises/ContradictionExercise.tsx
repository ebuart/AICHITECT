import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useStrings } from '@/lib/i18n'
import type { Exercise, SourceLine } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `contradiction` — tap the one line in source A and the one line in source B that conflict.
// The cross-source faithfulness/grounding skill (does the claim follow from the evidence?).
export function ContradictionExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'contradiction' }>
  onAnswered: (id: string) => void
}) {
  const t = useStrings()
  const [selA, setSelA] = useState<string | null>(null)
  const [selB, setSelB] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const ready = selA != null && selB != null

  const submit = () => {
    if (checked || !ready) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  const pane = (
    title: string,
    lines: SourceLine[],
    sel: string | null,
    setSel: (id: string) => void,
    truthId: string,
  ) => (
    <div className="border border-deck-border-dim bg-deck-surface-2 p-2">
      <p className="mb-1 font-typer text-[10px] uppercase tracking-widest text-deck-muted">{title}</p>
      <div className="flex flex-col gap-1">
        {lines.map((l) => {
          const isTruth = checked && l.id === truthId
          const wrong = checked && sel === l.id && l.id !== truthId
          return (
            <button
              key={l.id}
              type="button"
              disabled={checked}
              onClick={() => setSel(l.id)}
              className={cn(
                'border px-2 py-1 text-left text-[12px] leading-relaxed transition-colors',
                !checked && sel === l.id && 'border-white bg-white text-black',
                !checked && sel !== l.id && 'border-transparent text-deck-muted hover:border-white hover:text-white',
                isTruth && 'border-deck-success text-deck-success',
                wrong && 'border-deck-danger text-deck-danger',
                checked && !isTruth && !wrong && 'border-transparent text-deck-muted',
              )}
            >
              {l.text}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      {pane('Quelle A', exercise.sourceA, selA, setSelA, exercise.conflict.a)}
      {pane('Quelle B', exercise.sourceB, selB, setSelB, exercise.conflict.b)}

      {checked && exercise.why && <p className="text-[12px] text-deck-muted">{exercise.why}</p>}

      {!checked ? (
        <Button onClick={submit} disabled={!ready}>
          {ready ? t.exCheck : 'Je eine Zeile aus A und B wählen'}
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
