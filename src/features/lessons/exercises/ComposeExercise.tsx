import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Intro, Stem, Takeaway } from './shared'

// `compose` — build a pipeline: tap blocks into an ordered sequence. Unlike `order`, the pool
// holds DISTRACTORS that belong to no slot (wrong-for-this-job), so it tests selection AND
// sequencing. Reveal marks each slot and calls out used distractors + missing blocks.
export function ComposeExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'compose' }>
  onAnswered: (id: string) => void
}) {
  const [pool] = useState(() => shuffle(exercise.pool))
  const [build, setBuild] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const textOf = (id: string) => exercise.pool.find((b) => b.id === id)!.text
  const correctOrder = exercise.orderedCorrect

  const add = (id: string) => {
    if (checked || build.includes(id)) return
    setBuild((b) => [...b, id])
  }
  const remove = (id: string) => {
    if (checked) return
    setBuild((b) => b.filter((x) => x !== id))
  }
  const move = (idx: number, dir: -1 | 1) => {
    if (checked) return
    const j = idx + dir
    if (j < 0 || j >= build.length) return
    setBuild((prev) => {
      const next = [...prev]
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }
  const submit = () => {
    if (checked || build.length === 0) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  const remaining = pool.filter((b) => !build.includes(b.id))
  const missing = checked ? correctOrder.filter((id) => !build.includes(id)) : []
  const distractorsUsed = checked
    ? build.filter((id) => !exercise.pool.find((b) => b.id === id)!.correct)
    : []

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>
      {exercise.intro && <Intro text={exercise.intro} />}

      <div className="flex flex-col gap-1.5">
        {build.length === 0 && (
          <p className="border border-dashed border-deck-border-dim px-2.5 py-2 text-[12px] text-deck-muted">
            Tippe Bausteine unten, um die Pipeline zu bauen.
          </p>
        )}
        {build.map((id, idx) => {
          const placed = checked && correctOrder[idx] === id
          const wrong = checked && correctOrder[idx] !== id
          return (
            <div
              key={id}
              className={cn(
                'flex items-center gap-2 border px-2.5 py-1.5 text-[13px]',
                !checked && 'border-deck-border-dim text-white',
                placed && 'border-deck-success text-deck-success',
                wrong && 'border-deck-danger text-deck-danger',
              )}
            >
              <span className="font-typer tabular-nums text-deck-muted">{idx + 1}</span>
              <span className="flex-1">{textOf(id)}</span>
              {!checked && (
                <span className="flex items-center gap-1">
                  <button type="button" aria-label="hoch" onClick={() => move(idx, -1)} disabled={idx === 0} className="px-1 text-deck-muted hover:text-white disabled:opacity-25">▲</button>
                  <button type="button" aria-label="runter" onClick={() => move(idx, 1)} disabled={idx === build.length - 1} className="px-1 text-deck-muted hover:text-white disabled:opacity-25">▼</button>
                  <button type="button" aria-label="entfernen" onClick={() => remove(id)} className="px-1 text-deck-muted hover:text-deck-danger">✕</button>
                </span>
              )}
            </div>
          )
        })}
      </div>

      {!checked && remaining.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-deck-border-dim pt-2">
          {remaining.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => add(b.id)}
              className="border border-deck-border-dim px-2 py-1 text-[12px] text-white transition-colors hover:border-white"
            >
              {b.text}
            </button>
          ))}
        </div>
      )}

      {checked && (missing.length > 0 || distractorsUsed.length > 0) && (
        <div className="flex flex-col gap-0.5 text-[11px]">
          {distractorsUsed.map((id) => (
            <p key={id} className="text-deck-danger">Gehört nicht in die Pipeline: {textOf(id)}</p>
          ))}
          {missing.map((id) => (
            <p key={id} className="text-deck-warning">Fehlt: {textOf(id)}</p>
          ))}
        </div>
      )}

      {!checked ? (
        <Button onClick={submit} disabled={build.length === 0}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
