import { describe, it, expect } from 'vitest'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { RoadmapPage } from '@/features/roadmap/RoadmapPage'
import { HomePage } from '@/app/HomePage'

function wrap(ui: ReactNode) {
  return render(
    <ProgressProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ProgressProvider>,
  )
}

describe('app pages smoke (PHASE_1 render path)', () => {
  it('RoadmapPage renders arcs from data after progress loads', async () => {
    wrap(<RoadmapPage />)
    expect(await screen.findByText('Roadmap')).toBeTruthy()
    // first arc + a real node purpose (standalone <p>) prove data-driven rendering
    expect(await screen.findByText('Orientation')).toBeTruthy()
    expect(
      await screen.findByText(
        'Feature-Demo von verlässlichem AI-System unterscheiden.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Zurücksetzen')).toBeTruthy()
  })

  it('HomePage shows the roadmap-first CTA', async () => {
    wrap(<HomePage />)
    expect(await screen.findByText('Willkommen')).toBeTruthy()
    expect(await screen.findByText('Roadmap starten')).toBeTruthy()
  })
})
