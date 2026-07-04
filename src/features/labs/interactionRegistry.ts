import type { InteractionType } from '@/types'
import type { LabEngineEntry, LabScenario } from './interactionModel'
import { contextBudgetEntry } from './contextBudgetBoard/entry'
import { failureModeEntry } from './failureModeTree/entry'
import { agentTraceEntry } from './agentTraceDebugger/entry'
import { toolContractEntry } from './toolContractForge/entry'
import { architectureEntry } from './architectureBuilder/entry'
import { retrievalFactoryEntry } from './retrievalFactory/entry'
import { evalDesignerEntry } from './evalDesigner/entry'
import { securityIncidentEntry } from './securityIncidentRoom/entry'
import { repoRefactorEntry } from './repoRefactor/entry'
import { paperFigureEntry } from './paperFigureDecoder/entry'
import { capstoneEntry } from './capstoneSimulator/entry'
import { layerStackEntry } from './layerStackBuilder/entry'
import { tradeOffEntry } from './tradeOffDuel/entry'
import { constraintEntry } from './constraintPuzzle/entry'
import { systemPostmortemEntry } from './systemPostmortem/entry'
import { contextAllocatorEntry } from './contextAllocator/entry'
import { trustBoundaryEntry } from './trustBoundary/entry'
import { incidentTriageEntry } from './incidentTriage/entry'
import { pipelineBuilderEntry } from './pipelineBuilder/entry'

// Interaction registry (PH-501). Add an engine entry here; LabPage resolves the
// engine by the lab's interactionType. Every cataloged lab now has an engine (OQ-0009
// resolved): 5 core (PH-502) + 5 PHASE_6 advanced (PH-701) + Capstone Simulator (PH-901)
// + 4 secondary labs (layer-stack-builder, trade-off-duel, constraint-puzzle, system-postmortem).
const entries: LabEngineEntry[] = [
  contextBudgetEntry,
  failureModeEntry,
  agentTraceEntry,
  toolContractEntry,
  architectureEntry,
  retrievalFactoryEntry,
  evalDesignerEntry,
  securityIncidentEntry,
  repoRefactorEntry,
  paperFigureEntry,
  capstoneEntry,
  layerStackEntry,
  tradeOffEntry,
  constraintEntry,
  systemPostmortemEntry,
  contextAllocatorEntry,
  trustBoundaryEntry,
  incidentTriageEntry,
  pipelineBuilderEntry,
]

export const interactionRegistry = Object.fromEntries(
  entries.map((e) => [e.interactionType, e]),
) as Partial<Record<InteractionType, LabEngineEntry>>

export const allScenarios: LabScenario[] = entries.flatMap((e) => e.scenarios)
