import type { ComponentType } from 'react'
import { RequestFlowExplorer } from './requestFlow/RequestFlowExplorer'

// Explorer registry (control/10 IX rules): explorers are exploratory, feel-first
// interactives embedded in lessons via `{ kind: 'explorer', explorerId }`. They do NOT
// gate completion — the exercises that follow do. One entry per flagship treatment.
export const EXPLORERS: Record<string, ComponentType> = {
  'EXP-REQUEST-FLOW': RequestFlowExplorer,
}
