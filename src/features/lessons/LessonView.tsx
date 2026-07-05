import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useStrings } from '@/lib/i18n'
import type { Lesson, LessonBlock } from './lessonModel'
import { lessonDecisions, lessonExercises } from './lessonModel'
import { lessonModeInfo } from './lessonModes'
import { LessonBlockView } from './LessonBlockView'

interface LessonViewProps {
  lesson: Lesson
  onComplete: () => void
}

// On desktop the lesson is a 2-column grid (uses the wider canvas). Intro blocks
// and the "heavy" exercises (multi-select, spot, or a pick that shows code/trace)
// span both columns; a plain pick takes one — so two short questions sit side by
// side. Dense flow backfills the gaps. On mobile it stays a single column.
function blockColSpan(block: LessonBlock): string {
  if (block.kind !== 'exercise') return 'md:col-span-2'
  const ex = block.exercise
  // Only a bare pick (stem + options, no shown material) is narrow enough to pair two-up;
  // every richer mechanic spans both columns.
  const narrow = ex.format === 'pick' && !ex.code && !ex.trace
  return narrow ? 'md:col-span-1' : 'md:col-span-2'
}

// Renders a lesson as its ordered block sequence (data-driven, BP-030). Every
// decision must be answered before the lesson can be completed — completion
// requires engagement, not just scrolling (LG-005, CW-071).
//
// A lesson may embed MULTIPLE challenge blocks (OQ-0011 / LR-063: a concept from
// several points of view). They reveal one at a time — the next angle appears only
// after the current challenge is finished — and the lesson completes once ALL of
// them are done (not the first).
export function LessonView({ lesson, onComplete }: LessonViewProps) {
  const t = useStrings()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [doneChallenges, setDoneChallenges] = useState<Set<number>>(new Set())
  const [doneExercises, setDoneExercises] = useState<Set<string>>(new Set())
  const decisions = lessonDecisions(lesson)
  const exercises = lessonExercises(lesson)
  const allAnswered =
    decisions.every((d) => answers[d.id] != null) &&
    exercises.every((e) => doneExercises.has(e.id))
  const mode = lessonModeInfo(lesson.lessonMode)

  // Challenges, campaigns AND explorer protocols are required work: the lesson completes
  // only when all of them are finished — and, where exercises exist, those too (IX-8).
  const challengeIndices = lesson.blocks.flatMap((b, i) =>
    b.kind === 'challenge' || b.kind === 'campaign' || b.kind === 'explorer' ? [i] : [],
  )
  const hasChallenge = challengeIndices.length > 0

  // Sequential reveal: show blocks up to and including the first not-yet-finished
  // challenge/explorer; hide everything after it until that block is done.
  let shownThrough = lesson.blocks.length
  for (let i = 0; i < lesson.blocks.length; i++) {
    const k = lesson.blocks[i].kind
    if ((k === 'challenge' || k === 'campaign' || k === 'explorer') && !doneChallenges.has(i)) {
      shownThrough = i + 1
      break
    }
  }

  const markChallengeDone = (i: number) =>
    setDoneChallenges((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))

  // Fire completion exactly once, when every required block is finished — all
  // challenges/explorers worked through AND (where present) every exercise answered.
  const firedRef = useRef(false)
  useEffect(() => {
    if (
      !firedRef.current &&
      hasChallenge &&
      challengeIndices.every((i) => doneChallenges.has(i)) &&
      allAnswered
    ) {
      firedRef.current = true
      onComplete()
    }
  }, [doneChallenges, hasChallenge, challengeIndices, allAnswered, onComplete])

  return (
    <div className="flex flex-col gap-4 pb-2">
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Badge tone="current">{mode.label}</Badge>
          {challengeIndices.length > 1 && (
            <span className="text-[11px] text-deck-muted">
              {Math.min(doneChallenges.size + 1, challengeIndices.length)}/
              {challengeIndices.length} Blickwinkel
            </span>
          )}
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white">{lesson.title}</h1>
        <p className="text-sm text-deck-muted">{lesson.learningGoal}</p>
      </header>

      <div
        className={cn(
          'flex flex-col gap-3',
          !hasChallenge && 'md:grid md:grid-cols-2 md:grid-flow-row-dense',
        )}
      >
        {lesson.blocks.map((block, i) =>
          i < shownThrough ? (
            <div key={`${block.kind}-${i}`} className={blockColSpan(block)}>
              <LessonBlockView
                block={block}
                answeredOptionId={
                  block.kind === 'decision' ? answers[block.decision.id] : undefined
                }
                onAnswer={(decisionId, optionId) =>
                  setAnswers((prev) => ({ ...prev, [decisionId]: optionId }))
                }
                onChallengeComplete={() => markChallengeDone(i)}
                onExerciseAnswered={(id) =>
                  setDoneExercises((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
                }
              />
            </div>
          ) : null,
        )}
      </div>

      {!hasChallenge && (
        <Button onClick={onComplete} disabled={!allAnswered}>
          {allAnswered
            ? t.lessonComplete
            : exercises.length > 0
              ? t.lessonAnswerAll
              : t.lessonDecideAll}
        </Button>
      )}
    </div>
  )
}
