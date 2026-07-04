import { interactionRegistry, allScenarios } from '@/features/labs/interactionRegistry'
import type { LabResult } from '@/features/labs/interactionModel'

// Renders an embedded hands-on challenge inside a lesson (LR-051): resolves the mechanic
// engine by the referenced scenario id and renders it. Completing the mechanic (its
// "Abschließen") fires onComplete, which completes the lesson.
export function LessonChallenge({
  scenarioId,
  onComplete,
}: {
  scenarioId: string
  onComplete: (result: LabResult) => void
}) {
  const scenario = allScenarios.find((s) => s.id === scenarioId)
  const entry = scenario ? interactionRegistry[scenario.interactionType] : undefined

  if (!scenario || !entry) {
    return <p className="text-sm text-deck-muted">Übung nicht gefunden ({scenarioId}).</p>
  }

  return (
    <div className="rounded-xl border border-deck-border bg-deck-bg/40 p-3">
      {entry.render(scenario, onComplete)}
    </div>
  )
}
