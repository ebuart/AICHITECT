import { NavLink } from 'react-router-dom'
import { useTheme } from '@/lib/useTheme'
import { navItems } from './navItems'

// Brutalist header (PC-060): solid black, a single white hairline underneath, a
// square mark instead of a dot. No backdrop-blur (flat 2D + removes mobile lag).
// Responsive: on desktop the primary nav lives here as a top bar (the bottom-tab
// bar is mobile-only), so the app stops looking like a phone strip on a big screen.
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-deck-border bg-deck-bg">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3 md:max-w-4xl md:px-10 lg:max-w-6xl 2xl:max-w-7xl">
        <span aria-hidden className="inline-block h-2.5 w-2.5 bg-white" />
        <h1 className="text-sm font-semibold uppercase tracking-widest text-white">
          AI Engineering Flight Deck
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      [
                        'inline-flex min-h-9 items-center border px-3 text-xs font-medium uppercase tracking-wide transition-colors',
                        isActive
                          ? 'border-white bg-white text-black'
                          : 'border-transparent text-deck-muted hover:border-deck-border-dim hover:text-white',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

// Dark ↔ light (inverse) switch. Shows the CURRENT mode; tap to flip. Visible on every screen size.
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Zu Dunkelmodus wechseln' : 'Zu Hellmodus wechseln'}
      className="inline-flex min-h-9 items-center gap-1.5 border border-deck-border-dim px-2.5 text-xs font-medium uppercase tracking-wide text-deck-muted transition-colors hover:border-white hover:text-white"
    >
      <span aria-hidden>{theme === 'light' ? '☀' : '☾'}</span>
      <span className="hidden sm:inline">{theme === 'light' ? 'Hell' : 'Dunkel'}</span>
    </button>
  )
}
