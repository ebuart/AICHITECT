import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisualLabPage } from '@/components/visuals/VisualLabPage'

// Rendering the gallery exercises every primitive + DiagramShell + all demo
// sample data in one pass. Catches runtime/throw bugs the type checker cannot
// (it does NOT catch pixel-level layout issues — VQA-001).
const PRIMITIVES = [
  'SystemNode',
  'SystemEdge',
  'LayerStack',
  'FlowStep',
  'BoundaryBox',
  'TokenBudgetBar',
  'TraceTimeline',
  'DecisionCard',
  'FailureModeCard',
  'ScoreMeter',
  'CompactFallbackView',
  'DiagramShell',
]

describe('VisualLabPage smoke', () => {
  it('renders all primitives without throwing', () => {
    render(<VisualLabPage />)
    expect(screen.getByText('Visual Lab')).toBeTruthy()
    for (const name of PRIMITIVES) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    }
  })
})
