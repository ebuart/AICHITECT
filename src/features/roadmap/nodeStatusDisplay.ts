import type { NodeStatus } from '@/types'

type BadgeTone = 'neutral' | 'success' | 'current' | 'warning' | 'locked'

// German status labels for roadmap nodes. Status is shown as a labelled badge,
// so meaning never depends on color alone (VSS-101).
export const nodeStatusDisplay: Record<
  NodeStatus,
  { label: string; tone: BadgeTone; symbol: string }
> = {
  locked: { label: 'Gesperrt', tone: 'locked', symbol: '🔒' },
  available: { label: 'Verfügbar', tone: 'current', symbol: '→' },
  in_progress: { label: 'In Arbeit', tone: 'warning', symbol: '•' },
  completed: { label: 'Abgeschlossen', tone: 'success', symbol: '✓' },
}
