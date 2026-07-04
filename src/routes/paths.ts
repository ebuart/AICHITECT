// Central route path definitions. Use these constants instead of string
// literals so routes stay refactor-safe.

export const paths = {
  home: '/',
  roadmap: '/roadmap',
  lesson: (id: string) => `/lesson/${id}`,
  lab: (id: string) => `/lab/${id}`,
  review: '/review',
  reviewRun: (nodeId: string) => `/review/${nodeId}`,
  visualLab: '/visual-lab',
  build: '/build',
} as const

export const routePatterns = {
  home: '/',
  roadmap: '/roadmap',
  lesson: '/lesson/:id',
  lab: '/lab/:id',
  review: '/review',
  reviewRun: '/review/:nodeId',
  visualLab: '/visual-lab',
  build: '/build',
} as const
