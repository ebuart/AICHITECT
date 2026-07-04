import { NavLink } from 'react-router-dom'
import { useStrings } from '@/lib/i18n'
import { navItems } from './navItems'

// Mobile-only bottom-tab bar (md:hidden — desktop uses the top nav in AppHeader).
// Brutalist: solid black, a single white hairline on top, active tab is the
// inversion (white block / black text). No backdrop-blur (flat + no mobile lag).
export function BottomNav() {
  const t = useStrings()
  return (
    <nav
      aria-label={t.navAria}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-deck-border bg-deck-bg pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-around">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  'flex min-h-12 flex-col items-center justify-center px-2 py-2 text-xs font-medium uppercase tracking-wide transition-colors',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-deck-muted hover:text-white',
                ].join(' ')
              }
            >
              {t[item.key]}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
