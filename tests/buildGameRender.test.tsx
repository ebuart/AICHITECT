import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { BuildGamePage } from '@/features/buildgame/BuildGamePage'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('flightdeck.werft.onboarded', '1') // suppress the auto-tour except where tested
})

// The Werft now reads roadmap progress (quests), so it needs the ProgressProvider (+ a Router).
const renderWerft = () =>
  render(
    <ProgressProvider>
      <MemoryRouter>
        <BuildGamePage />
      </MemoryRouter>
    </ProgressProvider>,
  )

describe('BuildGamePage (Werft)', () => {
  it('renders the canvas, the view toggle and the HUD control bar (incl. the clock)', () => {
    renderWerft()
    expect(screen.getByText('Werft')).toBeTruthy()
    expect(screen.getByText('Shop')).toBeTruthy()
    expect(screen.getByText('Karte')).toBeTruthy()
    expect(screen.getByText(/Budget ·/)).toBeTruthy() // bottom control bar KPI
    expect(screen.getByLabelText('Play')).toBeTruthy() // clock control
    expect(screen.getByText('Zeit ⏸')).toBeTruthy() // day/clock readout (paused by default)
    expect(screen.getByText('Details')).toBeTruthy() // drawer toggle
    expect(screen.getByText('RAG')).toBeTruthy() // a skill node in the tree
    expect(screen.getByText(/Nächste Quest/)).toBeTruthy() // recommended-quest nudge
  })

  it('auto-shows the ACTIVE onboarding tour, gates on real actions, and is replayable', () => {
    localStorage.removeItem('flightdeck.werft.onboarded') // first-time player
    renderWerft()
    // step 1 is an info step → has a Weiter button
    expect(screen.getByText('Willkommen in der Werft')).toBeTruthy()
    fireEvent.click(screen.getByText('Weiter'))
    // step 2 is an ACTION (start the clock) → no skip-ahead button; it waits for the deed
    expect(screen.getByText('Zeit starten')).toBeTruthy()
    expect(screen.queryByText('Weiter')).toBeNull()
    // skippable + replayable
    fireEvent.click(screen.getByText(/Überspringen/))
    expect(screen.queryByText('Willkommen in der Werft')).toBeNull()
    fireEvent.click(screen.getByText('Details'))
    fireEvent.click(screen.getByText(/Tutorial ansehen/))
    expect(screen.getByText('Willkommen in der Werft')).toBeTruthy()
  })

  it('the quest board lists roadmap nodes with their Werft reward', () => {
    renderWerft()
    fireEvent.click(screen.getByText('Quests')) // toolbar button opens the board
    expect(screen.getByText(/Lerne, um zu bauen/)).toBeTruthy()
    expect(screen.getByText('RAG Basics')).toBeTruthy() // a roadmap node
    expect(screen.getByText(/schaltet RAG frei/)).toBeTruthy() // its Werft reward chip
  })

  it('the Details drawer reveals the world-variable readouts', () => {
    renderWerft()
    expect(screen.queryByText('Drift')).toBeNull() // hidden until the drawer is opened
    fireEvent.click(screen.getByText('Details'))
    expect(screen.getByText('Drift')).toBeTruthy()
    expect(screen.getByText('Trust')).toBeTruthy()
  })

  it('tapping a node opens its buy panel', () => {
    renderWerft()
    expect(screen.queryByText(/Bauen ·/)).toBeNull()
    fireEvent.click(screen.getByText('Keyword-Suche'))
    expect(screen.getByText(/Bauen ·/)).toBeTruthy()
  })

  it('selecting works via pointer up too (the touch path that the click event can miss)', () => {
    renderWerft()
    const node = screen.getByText('Keyword-Suche')
    // A clean tap = pointerDown then pointerUp with no movement → selection on pointerUp.
    fireEvent.pointerDown(node, { pointerId: 1, clientX: 5, clientY: 5 })
    fireEvent.pointerUp(node, { pointerId: 1, clientX: 5, clientY: 5 })
    expect(screen.getByText(/Bauen ·/)).toBeTruthy()
  })

  it('the map view shows only owned skills (in the Lager), not the whole catalog', () => {
    renderWerft()
    fireEvent.click(screen.getByText('Karte'))
    expect(screen.getByText('Solo (du)')).toBeTruthy() // owned at start → in the Lager
    expect(screen.getByText(/Lager — in die richtige Phase/)).toBeTruthy()
    expect(screen.getByText(/GRENZE/)).toBeTruthy() // a request-phase lane header
    expect(screen.queryByText('RAG')).toBeNull() // un-bought skill must NOT preview on the map
  })

  it('pressing play arms the clock without crashing (paused by default)', () => {
    renderWerft()
    // default paused → Pause control is the active one; pressing Play switches it on
    fireEvent.click(screen.getByLabelText('Play'))
    expect(screen.getByLabelText('Play')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Pause')) // stop the interval so the test tears down clean
  })

  it('keyboard: F toggles Shop↔Karte, E/Q select nodes, R ships a release', () => {
    renderWerft()
    // F → Karte (lane headers appear), F again → back to Shop
    fireEvent.keyDown(document.body, { key: 'f' })
    expect(screen.getByText(/GRENZE/)).toBeTruthy()
    fireEvent.keyDown(document.body, { key: 'f' })
    expect(screen.getByText('RAG')).toBeTruthy()
    // E selects the next node (first = Charter) → its panel opens
    fireEvent.keyDown(document.body, { key: 'e' })
    expect(screen.getByText(/Ausbauen/)).toBeTruthy()
    // R ships → the outcome banner appears
    fireEvent.keyDown(document.body, { key: 'r' })
    expect(screen.getByText(/Release v1/)).toBeTruthy()
  })
})
