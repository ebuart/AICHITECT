import type { Lab, LabId } from '@/types'

// Lab id constants (domain/12_roadmap_dependencies.md LAB_BINDINGS + node refs).
// Centralized so roadmap nodes reference labs without string typos.
export const LAB = {
  failureModeTree: 'LAB-FAILURE-MODE-TREE',
  layerStackBuilder: 'LAB-LAYER-STACK-BUILDER',
  architectureBuilder: 'LAB-ARCHITECTURE-BUILDER',
  tradeOffDuel: 'LAB-TRADE-OFF-DUEL',
  contextBudgetBoard: 'LAB-CONTEXT-BUDGET-BOARD',
  agentTraceDebugger: 'LAB-AGENT-TRACE-DEBUGGER',
  toolContractForge: 'LAB-TOOL-CONTRACT-FORGE',
  constraintPuzzle: 'LAB-CONSTRAINT-PUZZLE',
  retrievalFactory: 'LAB-RETRIEVAL-FACTORY',
  paperFigureDecoder: 'LAB-PAPER-FIGURE-DECODER',
  repoRefactor: 'LAB-REPO-REFACTOR',
  evalDesigner: 'LAB-EVAL-DESIGNER',
  securityIncidentRoom: 'LAB-SECURITY-INCIDENT-ROOM',
  systemPostmortem: 'LAB-SYSTEM-POSTMORTEM',
  capstoneSimulator: 'LAB-CAPSTONE-SIMULATOR',
  contextAllocator: 'LAB-CONTEXT-ALLOCATOR',
  trustBoundary: 'LAB-TRUST-BOUNDARY',
  incidentTriage: 'LAB-INCIDENT-TRIAGE',
  pipelineBuilder: 'LAB-PIPELINE-BUILDER',
} as const satisfies Record<string, LabId>

// Catalog used for display/binding only. Interaction engines arrive in PHASE_4.
export const labs: Lab[] = [
  { id: LAB.failureModeTree, title: 'Failure Mode Tree', introNodeId: 'NODE-00-01', interactionType: 'failure-mode-tree', requiredConcepts: ['CONCEPT-AIE-001'] },
  { id: LAB.layerStackBuilder, title: 'Layer Stack Builder', introNodeId: 'NODE-00-02', interactionType: 'layer-stack-builder', requiredConcepts: ['CONCEPT-AIE-003'] },
  { id: LAB.architectureBuilder, title: 'Architecture Builder', introNodeId: 'NODE-01-01', interactionType: 'architecture-builder', requiredConcepts: ['CONCEPT-AIE-002', 'CONCEPT-AIE-003'] },
  { id: LAB.tradeOffDuel, title: 'Trade-off Duel', introNodeId: 'NODE-01-02', interactionType: 'trade-off-duel', requiredConcepts: ['CONCEPT-AIE-004', 'CONCEPT-PROD-001'] },
  { id: LAB.contextBudgetBoard, title: 'Context Budget Board', introNodeId: 'NODE-02-01', interactionType: 'context-budget-board', requiredConcepts: ['CONCEPT-CTX-001', 'CONCEPT-CTX-002'] },
  { id: LAB.agentTraceDebugger, title: 'Agent Trace Debugger', introNodeId: 'NODE-02-04', interactionType: 'agent-trace-debugger', requiredConcepts: ['CONCEPT-CTX-005', 'CONCEPT-OBS-001'] },
  { id: LAB.toolContractForge, title: 'Tool Contract Forge', introNodeId: 'NODE-03-01', interactionType: 'tool-contract-forge', requiredConcepts: ['CONCEPT-TOOL-001', 'CONCEPT-TOOL-002'] },
  { id: LAB.constraintPuzzle, title: 'Constraint Puzzle', introNodeId: 'NODE-03-02', interactionType: 'constraint-puzzle', requiredConcepts: ['CONCEPT-TOOL-003'] },
  { id: LAB.retrievalFactory, title: 'Retrieval Factory', introNodeId: 'NODE-05-01', interactionType: 'retrieval-factory', requiredConcepts: ['CONCEPT-RET-001'] },
  { id: LAB.paperFigureDecoder, title: 'Paper Figure Decoder', introNodeId: 'NODE-05-05', interactionType: 'paper-figure-decoder', requiredConcepts: ['CONCEPT-RET-008', 'CONCEPT-RET-009'] },
  { id: LAB.repoRefactor, title: 'Repo Refactor Lab', introNodeId: 'NODE-06-01', interactionType: 'repo-refactor-lab', requiredConcepts: ['CONCEPT-MEM-002'] },
  { id: LAB.evalDesigner, title: 'Eval Designer', introNodeId: 'NODE-07-01', interactionType: 'eval-designer', requiredConcepts: ['CONCEPT-EVAL-001'] },
  { id: LAB.securityIncidentRoom, title: 'Security Incident Room', introNodeId: 'NODE-08-01', interactionType: 'security-incident-room', requiredConcepts: ['CONCEPT-SEC-001'] },
  { id: LAB.systemPostmortem, title: 'System Postmortem', introNodeId: 'NODE-07-04', interactionType: 'system-postmortem', requiredConcepts: ['CONCEPT-OBS-002'] },
  { id: LAB.capstoneSimulator, title: 'Capstone Simulator', introNodeId: 'NODE-10-01', interactionType: 'capstone-simulator', requiredConcepts: ['CONCEPT-AIE-001'] },
  { id: LAB.contextAllocator, title: 'Context Budget Allocator', introNodeId: 'NODE-02-01', interactionType: 'context-allocator', requiredConcepts: ['CONCEPT-CTX-001', 'CONCEPT-CTX-002'] },
  { id: LAB.trustBoundary, title: 'Trust Boundary Map', introNodeId: 'NODE-08-04', interactionType: 'trust-boundary', requiredConcepts: ['CONCEPT-SEC-001', 'CONCEPT-SEC-004'] },
  { id: LAB.incidentTriage, title: 'Incident Triage', introNodeId: 'NODE-08-03', interactionType: 'incident-triage', requiredConcepts: ['CONCEPT-SEC-003', 'CONCEPT-OBS-002'] },
  { id: LAB.pipelineBuilder, title: 'Pipeline Builder', introNodeId: 'NODE-05-01', interactionType: 'pipeline-builder', requiredConcepts: ['CONCEPT-RET-001', 'CONCEPT-RET-002'] },
]

export const labById: Record<LabId, Lab> = Object.fromEntries(
  labs.map((lab) => [lab.id, lab]),
)
