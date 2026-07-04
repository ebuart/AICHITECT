import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { shuffle } from '@/lib/utils/shuffle'
import type { Exercise } from '../lessonModel'
import { ExerciseBody, Stem, Takeaway } from './shared'

// `match` — connect each left item to its matching right item. Mobile flow: tap a left
// row to select it, then tap a right chip to link (a right is used once; tapping a linked
// left frees it). The pair `id` ties the correct left↔right.
export function MatchExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { format: 'match' }>
  onAnswered: (id: string) => void
}) {
  const lefts = exercise.pairs
  const [rights] = useState(() =>
    shuffle(exercise.pairs.map((p) => ({ originId: p.id, text: p.right }))),
  )
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [links, setLinks] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const rightText = (originId: string) => exercise.pairs.find((p) => p.id === originId)!.right
  const usedRight = (originId: string) => Object.values(links).includes(originId)
  const allLinked = lefts.every((p) => links[p.id])

  const tapLeft = (leftId: string) => {
    if (checked) return
    setLinks((prev) => {
      const next = { ...prev }
      delete next[leftId]
      return next
    })
    setSelLeft(leftId)
  }
  const tapRight = (originId: string) => {
    if (checked) return
    const target = selLeft ?? lefts.find((p) => !links[p.id])?.id
    if (!target) return
    setLinks((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(next)) if (next[k] === originId) delete next[k]
      next[target] = originId
      return next
    })
    setSelLeft(null)
  }
  const submit = () => {
    if (checked || !allLinked) return
    setChecked(true)
    onAnswered(exercise.id)
  }

  return (
    <ExerciseBody>
      <Stem>{exercise.stem}</Stem>

      <div className="flex flex-col gap-1.5">
        {lefts.map((p) => {
          const linked = links[p.id]
          const correct = checked && linked === p.id
          const wrong = checked && linked !== p.id
          return (
            <button
              key={p.id}
              type="button"
              disabled={checked}
              onClick={() => tapLeft(p.id)}
              className={cn(
                'flex flex-col gap-0.5 border px-2.5 py-1.5 text-left text-[12px] transition-colors',
                !checked && selLeft === p.id && 'border-white bg-white text-black',
                !checked && selLeft !== p.id && 'border-deck-border-dim text-white hover:border-white',
                correct && 'border-deck-success text-deck-success',
                wrong && 'border-deck-danger text-deck-danger',
              )}
            >
              <span className="font-medium">{p.left}</span>
              <span className={cn('font-typer text-[11px]', selLeft === p.id && !checked ? 'text-black' : 'text-deck-muted')}>
                ⟶ {linked ? rightText(linked) : '—'}
              </span>
              {checked && wrong && (
                <span className="text-[11px] text-deck-warning">Richtig: {p.right}</span>
              )}
              {checked && p.why && <span className="text-[11px] text-deck-muted">{p.why}</span>}
            </button>
          )
        })}
      </div>

      {!checked && (
        <div className="flex flex-wrap gap-1.5 border-t border-deck-border-dim pt-2">
          {rights.map((r) => (
            <button
              key={r.originId}
              type="button"
              onClick={() => tapRight(r.originId)}
              className={cn(
                'border px-2 py-1 text-[11px] transition-colors',
                usedRight(r.originId)
                  ? 'border-deck-border-dim text-deck-muted opacity-40'
                  : 'border-deck-border-dim text-white hover:border-white',
              )}
            >
              {r.text}
            </button>
          ))}
        </div>
      )}

      {!checked ? (
        <Button onClick={submit} disabled={!allLinked}>
          Prüfen
        </Button>
      ) : (
        exercise.takeaway && <Takeaway text={exercise.takeaway} />
      )}
    </ExerciseBody>
  )
}
