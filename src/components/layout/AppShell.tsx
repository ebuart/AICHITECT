import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { paths } from '@/routes/paths'

// Responsive app shell (PH-202 / QG-080). Mobile: fixed header + bottom-tab bar.
// Desktop: the content column widens and gains white side-rails so it reads as a
// deliberate framed panel in the black void — not a stretched phone — and the nav
// lives in the top header (the bottom bar is md:hidden). Respects iOS safe areas.
// EXCEPTION: the Werft build-sim is a fullscreen canvas + floating HUD — its main area
// is full-bleed and does NOT scroll (the page manages its own height), so the map fills
// the viewport. Heavy routes are code-split (React.lazy); this Suspense catches them.
export function AppShell() {
  const full = useLocation().pathname === paths.build
  return (
    <div className="flex h-full flex-col bg-deck-bg text-white">
      <AppHeader />
      <main
        className={
          full
            ? 'w-full min-h-0 flex-1 overflow-hidden'
            : 'mx-auto w-full max-w-md flex-1 overflow-y-auto px-4 pb-24 pt-4 md:max-w-4xl md:border-x md:border-deck-border-dim md:px-10 md:pb-12 md:pt-8 lg:max-w-6xl 2xl:max-w-7xl'
        }
      >
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}

function RouteFallback() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-deck-muted" role="status">
      Lädt …
    </div>
  )
}
