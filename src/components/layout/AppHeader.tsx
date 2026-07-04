import { NavLink } from 'react-router-dom'
import { useTheme } from '@/lib/useTheme'
import { useLocale, useStrings } from '@/lib/i18n'
import { navItems } from './navItems'

// Brutalist header (PC-060): solid black, a single white hairline underneath, a
// square mark instead of a dot. No backdrop-blur (flat 2D + removes mobile lag).
// Responsive: on desktop the primary nav lives here as a top bar (the bottom-tab
// bar is mobile-only), so the app stops looking like a phone strip on a big screen.
export function AppHeader() {
  const t = useStrings()
  return (
    <header className="sticky top-0 z-10 border-b border-deck-border bg-deck-bg">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3 md:max-w-4xl md:px-10 lg:max-w-6xl 2xl:max-w-7xl">
        <span aria-hidden className="inline-block h-2.5 w-2.5 bg-white" />
        <h1 className="text-sm font-semibold uppercase tracking-widest text-white">
          AI Engineering Flight Deck
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label={t.navAria} className="hidden md:block">
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
                    {t[item.key]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

// DE ↔ EN app-chrome switch. Shows the CURRENT language; tap to flip (lib/i18n, DEC-0015).
function LanguageToggle() {
  const { locale, toggle } = useLocale()
  const t = useStrings()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.localeAria}
      className="inline-flex min-h-9 items-center border border-deck-border-dim px-2.5 text-xs font-medium uppercase tracking-wide text-deck-muted transition-colors hover:border-white hover:text-white"
    >
      {locale === 'de' ? 'DE' : 'EN'}
    </button>
  )
}

// Dark ↔ light (inverse) switch. Shows the CURRENT mode; tap to flip. Visible on every screen size.
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const t = useStrings()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? t.themeToDark : t.themeToLight}
      className="inline-flex min-h-9 items-center gap-1.5 border border-deck-border-dim px-2.5 text-xs font-medium uppercase tracking-wide text-deck-muted transition-colors hover:border-white hover:text-white"
    >
      <span aria-hidden>{theme === 'light' ? '☀' : '☾'}</span>
      <span className="hidden sm:inline">{theme === 'light' ? t.themeLight : t.themeDark}</span>
    </button>
  )
}
