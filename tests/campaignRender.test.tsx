import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BuildCampaign } from '@/features/campaign/BuildCampaign'
import { shipKlauspilot } from '@/content/campaigns/shipKlauspilot'

// Drives the Build Campaign UI through every stage to the scorecard and asserts the completion
// callback fires once — covering the choose → consequence → advance → scorecard → onComplete loop
// (including the branching incident). Picks the first affordable option each stage.
describe('BuildCampaign — play to the scorecard', () => {
  it('walks the campaign end-to-end and completes once', () => {
    const onComplete = vi.fn()
    render(<BuildCampaign def={shipKlauspilot} onComplete={onComplete} />)

    for (let i = 0; i < 20; i++) {
      const done = screen.queryByText('Abschließen')
      if (done) {
        fireEvent.click(done)
        break
      }
      const weiter = screen.queryByText('Weiter')
      if (weiter) {
        fireEvent.click(weiter)
        continue
      }
      // at the options state: click the first enabled option
      const enabled = screen
        .getAllByRole('button')
        .filter((b) => !(b as HTMLButtonElement).disabled)
      fireEvent.click(enabled[0])
    }

    expect(onComplete).toHaveBeenCalledOnce()
    // the scorecard renders (verdict text appears at least once)
    expect(screen.getAllByText(/ausgeliefert/i).length).toBeGreaterThan(0)
  })

  it('shows the HUD meters from the first stage', () => {
    render(<BuildCampaign def={shipKlauspilot} onComplete={vi.fn()} />)
    expect(screen.getByText('Qualität')).toBeTruthy()
    expect(screen.getByText('Sicherheit')).toBeTruthy()
    expect(screen.getByText('Aufsicht')).toBeTruthy()
  })
})
