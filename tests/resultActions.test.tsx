import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResultActions } from '@/features/labs/ResultActions'

// Locks the mastery nudge (FL-0042): after a weak attempt the learner is invited to
// retry; after a strong one, finishing leads. Non-gating either way — both actions
// always work (LR-013 direction-not-correctness).
describe('ResultActions', () => {
  it('nudges a retry when the attempt was weak, but still lets you finish', () => {
    const onRetry = vi.fn()
    const onFinish = vi.fn()
    render(<ResultActions strong={false} onRetry={onRetry} onFinish={onFinish} />)

    // the nudge copy appears only when weak
    expect(screen.getByText(/zweiter Versuch/i)).toBeTruthy()

    // finishing is still possible (not gated)
    fireEvent.click(screen.getByText('Abschließen'))
    expect(onFinish).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByText('Nochmal'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows no retry nudge when the attempt was strong', () => {
    render(<ResultActions strong onRetry={vi.fn()} onFinish={vi.fn()} />)
    expect(screen.queryByText(/zweiter Versuch/i)).toBeNull()
    expect(screen.getByText('Abschließen')).toBeTruthy()
    expect(screen.getByText('Nochmal')).toBeTruthy()
  })
})
