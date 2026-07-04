import { Button } from '@/components/ui/Button'

// Shared post-evaluation actions for every mechanic (replaces the duplicated
// "Nochmal / Abschließen" button pair across the engines). Non-gating by design
// (LR-013: direction-not-correctness — you can always finish), but it nudges
// MASTERY: when the attempt was weak, "Nochmal" becomes the prominent action so the
// learner is invited to apply the feedback and try again (TryHackMe feel, not a quiz
// you click past). When strong, "Abschließen" leads.
export function ResultActions({
  strong,
  onRetry,
  onFinish,
  retryLabel = 'Nochmal',
  finishLabel = 'Abschließen',
}: {
  /** True when the attempt hit the good region (e.g. no weak signals). */
  strong: boolean
  onRetry: () => void
  onFinish: () => void
  retryLabel?: string
  finishLabel?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {!strong && (
        <p className="text-[11px] text-deck-muted">
          Nah dran — mit der Rückmeldung oben lohnt sich ein zweiter Versuch.
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant={strong ? 'subtle' : 'primary'}
          className="flex-1"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
        <Button
          variant={strong ? 'primary' : 'subtle'}
          className="flex-1"
          onClick={onFinish}
        >
          {finishLabel}
        </Button>
      </div>
    </div>
  )
}
