import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { NotFoundPage } from '@/app/NotFoundPage'
import { RoadmapPage } from '@/features/roadmap/RoadmapPage'
import { paths, routePatterns } from './paths'

// Landing path (home + roadmap) stays eager so the first paint is instant. The heavy
// routes — lesson/lab/review pull the whole interaction registry (19 engines + scenarios),
// visual-lab bundles every primitive — are code-split via React.lazy, caught by the
// Suspense boundary in AppShell. Cuts the initial mobile bundle (build >500kB warning).
const LessonPage = lazy(() =>
  import('@/features/lessons/LessonPage').then((m) => ({ default: m.LessonPage })),
)
const LabPage = lazy(() =>
  import('@/features/labs/LabPage').then((m) => ({ default: m.LabPage })),
)
const ReviewPage = lazy(() =>
  import('@/features/review/ReviewPage').then((m) => ({ default: m.ReviewPage })),
)
const ReviewRunPage = lazy(() =>
  import('@/features/review/ReviewRunPage').then((m) => ({ default: m.ReviewRunPage })),
)
const VisualLabPage = lazy(() =>
  import('@/components/visuals/VisualLabPage').then((m) => ({ default: m.VisualLabPage })),
)
const BuildGamePage = lazy(() =>
  import('@/features/buildgame/BuildGamePage').then((m) => ({ default: m.BuildGamePage })),
)

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      // Default landing is the Werft (the "main mode"); the roadmap stays its own tab (OQ-A).
      { path: routePatterns.home, element: <Navigate to={paths.build} replace /> },
      { path: routePatterns.roadmap, element: <RoadmapPage /> },
      { path: routePatterns.lesson, element: <LessonPage /> },
      { path: routePatterns.lab, element: <LabPage /> },
      { path: routePatterns.review, element: <ReviewPage /> },
      { path: routePatterns.reviewRun, element: <ReviewRunPage /> },
      { path: routePatterns.visualLab, element: <VisualLabPage /> },
      { path: routePatterns.build, element: <BuildGamePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
