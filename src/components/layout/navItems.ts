import { paths } from '@/routes/paths'

// Primary navigation. Shared by the mobile bottom-tab bar and the desktop top nav.
// The WERFT is the main mode (the default landing — `/` redirects to it); the roadmap
// is the quest catalogue, reachable as its own tab. Lessons/labs are reached *through*
// the Werft quest board or the roadmap, so they are not top-level nav items.
export const navItems = [
  { to: paths.build, label: 'Werft' },
  { to: paths.roadmap, label: 'Roadmap' },
  { to: paths.review, label: 'Review' },
  { to: paths.visualLab, label: 'Visual Lab' },
] as const
