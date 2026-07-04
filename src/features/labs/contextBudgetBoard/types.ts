// Context Budget Board scenario model (lab specs LAB-CONTEXT-BUDGET-BOARD).

export type ContextSourceType =
  | 'system'
  | 'user'
  | 'repo'
  | 'memory'
  | 'research'
  | 'retrieval'
  | 'tool_doc'
  | 'history'

export type ContextDisposition = 'exclude' | 'include' | 'compress'

export interface ContextItem {
  id: string
  label: string
  sourceType: ContextSourceType
  tokens: number
  relevance: 0 | 1 | 2 | 3
  noiseRisk: 0 | 1 | 2 | 3
  staleRisk: 0 | 1 | 2 | 3
  required?: boolean
  compressible?: boolean
}

export interface ContextBudgetData {
  task: string
  maxTokens: number
  items: ContextItem[]
}

export type Dispositions = Record<string, ContextDisposition>

/** Compressing a compressible item keeps ~40% of its tokens. */
export function effectiveTokens(
  item: ContextItem,
  disp: ContextDisposition,
): number {
  if (disp === 'exclude') return 0
  if (disp === 'compress' && item.compressible) return Math.round(item.tokens * 0.4)
  return item.tokens
}

export function usedTokens(data: ContextBudgetData, dispositions: Dispositions): number {
  return data.items.reduce(
    (sum, item) => sum + effectiveTokens(item, dispositions[item.id] ?? 'exclude'),
    0,
  )
}
