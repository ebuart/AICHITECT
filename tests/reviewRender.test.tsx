import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { ReviewPage } from '@/features/review/ReviewPage'
import { ReviewRunPage } from '@/features/review/ReviewRunPage'

describe('ReviewPage smoke', () => {
  it('renders the empty state for fresh progress without throwing', async () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/review']}>
          <Routes>
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/roadmap" element={<div>ROADMAP</div>} />
          </Routes>
        </MemoryRouter>
      </ProgressProvider>,
    )
    expect(await screen.findByText('Review')).toBeTruthy()
    expect(screen.getByText(/Noch nichts abgeschlossen/)).toBeTruthy()
  })
})

describe('ReviewRunPage smoke (transfer resurfacing)', () => {
  it('re-runs a node’s transfer scenario in review framing', async () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/review/NODE-00-01']}>
          <Routes>
            <Route path="/review/:nodeId" element={<ReviewRunPage />} />
            <Route path="/review" element={<div>REVIEW</div>} />
          </Routes>
        </MemoryRouter>
      </ProgressProvider>,
    )
    // FMT-TRANSFER symptom + the review-mission framing.
    expect(await screen.findByText(/ignoriert eine aktuelle Anweisung/)).toBeTruthy()
    expect(screen.getByText('Review-Mission')).toBeTruthy()
    expect(screen.getByText(/Transfer · neuer Kontext/)).toBeTruthy()
  })
})
