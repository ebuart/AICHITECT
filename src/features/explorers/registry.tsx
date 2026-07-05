import type { ComponentType } from 'react'
import { RequestFlowExplorer } from './requestFlow/RequestFlowExplorer'
import { LoadSimExplorer } from './loadSim/LoadSimExplorer'

// Explorer registry (control/10 IX rules): explorers are feel-first interactives embedded
// in lessons via `{ kind: 'explorer', explorerId }`. They are REQUIRED (user 2026-07-05):
// each runs a guided protocol and fires onComplete when it is worked through — the lesson
// treats that like a challenge. One entry per flagship treatment.
export const EXPLORERS: Record<string, ComponentType<{ onComplete?: () => void }>> = {
  'EXP-REQUEST-FLOW': RequestFlowExplorer,
  'EXP-LOAD': LoadSimExplorer,
}
