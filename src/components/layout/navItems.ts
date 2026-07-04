import { paths } from '@/routes/paths'

// Primary navigation. Shared by the mobile bottom-tab bar and the desktop top nav.
// The WERFT is the main mode (the default landing — `/` redirects to it); the roadmap
// is the quest catalogue, reachable as its own tab. Lessons/labs are reached *through*
// the Werft quest board or the roadmap, so they are not top-level nav items.
// Labels resolve through the locale dictionary (lib/i18n) — `key` indexes into it.
export const navItems = [
  { to: paths.build, key: 'navBuild' },
  { to: paths.roadmap, key: 'navRoadmap' },
  { to: paths.review, key: 'navReview' },
  { to: paths.visualLab, key: 'navVisualLab' },
] as const
