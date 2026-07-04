import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { LessonView } from '@/features/lessons/LessonView'
import { LessonPage } from '@/features/lessons/LessonPage'
import { lessons } from '@/content/lessons'
import type { Lesson } from '@/features/lessons/lessonModel'

describe('LessonView smoke', () => {
  it('renders every slice lesson without throwing', () => {
    for (const lesson of lessons) {
      const { unmount } = render(<LessonView lesson={lesson} onComplete={() => {}} />)
      expect(screen.getAllByText(lesson.title).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('a challenge lesson embeds the mechanic inline (hands-on, no manual finish)', () => {
    // Framework behaviour, pinned to a fixture: content lessons are migrating off embedded
    // challenges to bespoke exercises, so this reuses a still-registered scenario by id
    // rather than a specific lesson. A challenge renders its mechanic inline; the mechanic —
    // not a manual button — drives completion.
    const lesson: Lesson = {
      ...lessons[0],
      id: 'LESSON-FIXTURE-CHALLENGE',
      blocks: [{ kind: 'challenge', scenarioId: 'ALLOC-BASE' }],
    }
    render(<LessonView lesson={lesson} onComplete={vi.fn()} />)
    expect(screen.getByText('Allokation auswerten')).toBeTruthy() // the Allocator is embedded
    expect(screen.queryByText('Lektion abschließen')).toBeNull() // the challenge drives completion
  })

  it('a multi-viewpoint lesson reveals the next angle only after the current is done (OQ-0011)', () => {
    const lesson: Lesson = {
      ...lessons[0],
      id: 'LESSON-FIXTURE-MULTIVIEW',
      blocks: [
        { kind: 'challenge', scenarioId: 'ALLOC-BASE' },
        { kind: 'challenge', scenarioId: 'CBB-BASE' },
      ],
    }
    const onComplete = vi.fn()
    render(<LessonView lesson={lesson} onComplete={onComplete} />)
    // angle 1 (allocator) visible; angle 2 (budget board) hidden until angle 1 is finished
    expect(screen.getByText('Allokation auswerten')).toBeTruthy()
    expect(screen.queryByText('Context auswerten')).toBeNull()

    // finish angle 1 → angle 2 reveals, lesson NOT complete yet (not the first)
    fireEvent.click(screen.getByText('Allokation auswerten'))
    fireEvent.click(screen.getByText('Abschließen'))
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByText('Context auswerten')).toBeTruthy()

    // finish angle 2 → now every challenge is done → lesson completes once
    fireEvent.click(screen.getByText('Context auswerten'))
    const finishes = screen.getAllByText('Abschließen')
    fireEvent.click(finishes[finishes.length - 1])
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('a bespoke-exercise lesson completes only after every exercise is answered (redesign pilot)', () => {
    const lesson = lessons.find((l) => l.id === 'LESSON-08-03')! // prompt injection, exercise-based
    const onComplete = vi.fn()
    render(<LessonView lesson={lesson} onComplete={onComplete} />)

    // gated initially (the complete CTA only appears once all exercises are answered)
    expect(screen.queryByText('Lektion abschließen')).toBeNull()

    // spot: tap the (subtle, no-magic-words) injection line
    fireEvent.click(screen.getByText(/Security-Check kann hier übersprungen/))
    // multi-select: mark the untrusted sources, then submit ("Prüfen")
    fireEvent.click(screen.getByText(/Nachricht, die der Kunde gerade tippt/))
    fireEvent.click(screen.getByText(/weitergeleitetes Ticket/))
    fireEvent.click(screen.getByText(/externe Webseite abruft/))
    fireEvent.click(screen.getByText('Prüfen'))
    // the two harder picks
    fireEvent.click(screen.getByText(/enthält selbst die Zeichen/))
    fireEvent.click(screen.getByText(/für B untrusted/))

    const complete = screen.getByText('Lektion abschließen')
    fireEvent.click(complete)
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('completion is gated until every decision is answered, then feedback shows', () => {
    // The rollout (LR-051) converted every content lesson to an embedded challenge, so no
    // shipped lesson still uses a classic decision block. This test pins the decision-
    // gating + concise-feedback logic against a fixture (reusing a real lesson's metadata,
    // overriding only the blocks) so the path stays covered independent of content.
    const decisionLesson: Lesson = {
      ...lessons[0],
      id: 'LESSON-FIXTURE-DECISION',
      blocks: [
        { kind: 'prose', text: 'Frame.' },
        {
          kind: 'decision',
          decision: {
            id: 'd1',
            prompt: 'Wähle.',
            bestOptionId: 'good',
            options: [
              { id: 'good', label: 'Gute Wahl', feedback: { id: 'fb-g', severity: 'strong', consequence: 'Passt.' } },
              { id: 'bad', label: 'Schwache Wahl', feedback: { id: 'fb-b', severity: 'risk', consequence: 'Nope.' } },
            ],
          },
        },
      ],
    }
    const onComplete = vi.fn()
    render(<LessonView lesson={decisionLesson} onComplete={onComplete} />)

    // gated initially
    expect(screen.queryByText('Lektion abschließen')).toBeNull()

    fireEvent.click(screen.getByText('Gute Wahl'))

    // concise feedback for a strong choice appears
    expect(screen.getAllByText('Starke Wahl').length).toBeGreaterThan(0)

    const completeBtn = screen.getByText('Lektion abschließen')
    fireEvent.click(completeBtn)
    expect(onComplete).toHaveBeenCalledOnce()
  })
})

function renderLessonRoute(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/roadmap" element={<div>ROADMAP</div>} />
        </Routes>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('LessonPage prerequisite gating (QG-047)', () => {
  // Gating CORRECTNESS (a node with unmet prereqs is locked) is covered by
  // roadmapStatus.test. In dev (UNLOCK_ALL), a prereq-locked lesson is playable so it
  // can be tested — it renders rather than showing "Noch gesperrt".
  it('a prereq-locked lesson is playable in dev (UNLOCK_ALL)', async () => {
    renderLessonRoute('/lesson/LESSON-01-01') // needs NODE-00-02, not completed
    expect((await screen.findAllByText('Augmented LLM')).length).toBeGreaterThan(0)
  })

  it('renders a lesson with no prerequisites', async () => {
    renderLessonRoute('/lesson/LESSON-00-01')
    expect(
      await screen.findByText('What AI Engineering Actually Builds'),
    ).toBeTruthy()
  })

  it('shows a not-found state for an unknown lesson id', async () => {
    renderLessonRoute('/lesson/LESSON-NOPE')
    expect(await screen.findByText('Lektion nicht gefunden')).toBeTruthy()
  })
})
