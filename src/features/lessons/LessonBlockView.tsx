import { DecisionCard } from '@/components/visuals'
import { cn } from '@/lib/utils/cn'
import type { LabResult } from '@/features/labs/interactionModel'
import type { LessonBlock, LessonDecision } from './lessonModel'
import { LessonVisualRenderer } from './LessonVisualRenderer'
import { LessonChallenge } from './LessonChallenge'
import { ExerciseView } from './ExerciseView'
import { DossierView } from './DossierView'
import { EXPLORERS } from '@/features/explorers/registry'
import { BuildCampaign } from '@/features/campaign/BuildCampaign'
import { FeedbackCard } from './FeedbackCard'

interface LessonBlockViewProps {
  block: LessonBlock
  /** Selected option id for a decision block (if answered). */
  answeredOptionId?: string
  onAnswer?: (decisionId: string, optionId: string) => void
  /** Fires when an embedded challenge OR campaign block is completed. */
  onChallengeComplete?: (result?: LabResult) => void
  /** Fires when a bespoke exercise block is answered. */
  onExerciseAnswered?: (exerciseId: string) => void
}

const noteTone: Record<string, { box: string; symbol: string }> = {
  info: { box: 'border-deck-current/40 bg-deck-current/10', symbol: 'ℹ' },
  warning: { box: 'border-deck-warning/40 bg-deck-warning/10', symbol: '!' },
  success: { box: 'border-deck-success/40 bg-deck-success/10', symbol: '✓' },
}

export function LessonBlockView({
  block,
  answeredOptionId,
  onAnswer,
  onChallengeComplete,
  onExerciseAnswered,
}: LessonBlockViewProps) {
  switch (block.kind) {
    case 'prose':
      return <p className="text-sm leading-relaxed text-white">{block.text}</p>

    case 'term':
      return (
        <div className="rounded-xl border border-deck-border bg-deck-surface p-3">
          <h3 className="text-sm font-semibold text-deck-accent">{block.term}</h3>
          <p className="mt-1 text-sm leading-snug text-white">
            {block.definition}
          </p>
          {block.example && (
            <p className="mt-2 rounded-lg bg-deck-bg px-2 py-1 font-mono text-xs text-deck-muted">
              {block.example}
            </p>
          )}
        </div>
      )

    case 'note': {
      const tone = noteTone[block.tone]
      return (
        <div className={cn('rounded-xl border p-3', tone.box)}>
          {block.title && (
            <p className="text-xs font-semibold text-white">
              <span aria-hidden className="mr-1">
                {tone.symbol}
              </span>
              {block.title}
            </p>
          )}
          <p className="mt-0.5 text-sm leading-snug text-white">{block.text}</p>
        </div>
      )
    }

    case 'visual':
      return (
        <figure className="flex flex-col gap-1.5">
          <LessonVisualRenderer visual={block.visual} />
          {block.caption && (
            <figcaption className="text-[11px] text-deck-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'decision':
      return (
        <DecisionBlock
          decision={block.decision}
          answeredOptionId={answeredOptionId}
          onAnswer={onAnswer}
        />
      )

    case 'challenge':
      return (
        <LessonChallenge
          scenarioId={block.scenarioId}
          onComplete={(result) => onChallengeComplete?.(result)}
        />
      )

    case 'exercise':
      return (
        <ExerciseView
          exercise={block.exercise}
          onAnswered={(id) => onExerciseAnswered?.(id)}
        />
      )

    case 'explorer': {
      const Explorer = EXPLORERS[block.explorerId]
      return Explorer ? <Explorer onComplete={() => onChallengeComplete?.()} /> : null
    }

    case 'dossier':
      return <DossierView intro={block.intro} files={block.files} />

    case 'campaign':
      return <BuildCampaign def={block.campaign} onComplete={() => onChallengeComplete?.()} />
  }
}

function DecisionBlock({
  decision,
  answeredOptionId,
  onAnswer,
}: {
  decision: LessonDecision
  answeredOptionId?: string
  onAnswer?: (decisionId: string, optionId: string) => void
}) {
  const answered = decision.options.find((o) => o.id === answeredOptionId)
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-deck-border bg-deck-bg/40 p-3">
      <p className="text-sm font-medium text-white">{decision.prompt}</p>
      <div className="flex flex-col gap-2">
        {decision.options.map((opt) => {
          const isAnswer = opt.id === answeredOptionId
          const state = isAnswer
            ? opt.id === decision.bestOptionId
              ? 'strong_choice'
              : 'weak_choice'
            : 'default'
          return (
            <DecisionCard
              key={opt.id}
              id={opt.id}
              title={opt.label}
              state={state}
              onSelect={() => onAnswer?.(decision.id, opt.id)}
            />
          )
        })}
      </div>
      {answered && <FeedbackCard feedback={answered.feedback} />}
    </div>
  )
}
