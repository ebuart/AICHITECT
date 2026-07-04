# /source_material/interactions/21_lab_specs.md

STATUS: INTERACTION_DOC  
LOAD_PRIORITY: WHEN_LAB_IMPLEMENTATION  
PURPOSE: Define lab-level requirements and implementation contracts.

## LAB_RULES

[LS-001] A lab is a reusable interaction environment attached to roadmap nodes.
[LS-002] Labs must not become free-floating primary navigation.
[LS-003] Labs can have replay mode after unlocked.
[LS-004] Labs must support scenario configs.
[LS-005] Labs must support at least one transfer variant if core.
[LS-006] Labs must persist progress when used in roadmap flow.
[LS-007] Labs must record completion, score/status, weak dimensions, and review hook.
[LS-008] Labs must expose visual states in `/visual-lab` if they contain complex visuals.
[LS-009] Lab implementations must not hardcode roadmap data.

## COMMON_LAB_SCHEMA

```ts
type LabScenario = {
  id: string
  labType: LabType
  roadmapNodeId: string
  title: string
  concepts: string[]
  prerequisites: string[]
  difficulty: 'intro' | 'core' | 'advanced' | 'capstone'
  estimatedMinutes: number
  prompt: string
  scenarioData: unknown
  allowedActions: string[]
  scoringProfileId: string
  feedbackProfileId: string
  reviewHooks: string[]
}
```

## COMMON_RESULT_SCHEMA

```ts
type LabResult = {
  scenarioId: string
  completed: boolean
  score?: number
  masterySignals: string[]
  weakSignals: string[]
  chosenActions: unknown[]
  feedbackIds: string[]
  reviewHookIds: string[]
  completedAt: string
}
```

## LAB_DETAIL_SPECS

### LAB-CONTEXT-BUDGET-BOARD

ENGINE: INT-CONTEXT-BUDGET-BOARD  
FIRST_NODE: NODE-02-01  
PHASE: PHASE_4_CORE_INTERACTION_ENGINES  
VISUALS:
- VIS-TokenBudgetBar
- VIS-DecisionCard
- VIS-FailureModeCard
- VIS-CompactFallbackView

SCENARIO_DATA:
```ts
type ContextItem = {
  id: string
  label: string
  sourceType: 'system' | 'user' | 'repo' | 'memory' | 'research' | 'retrieval' | 'tool_doc' | 'history'
  tokens: number
  relevance: 0 | 1 | 2 | 3
  noiseRisk: 0 | 1 | 2 | 3
  staleRisk: 0 | 1 | 2 | 3
  required?: boolean
  compressible?: boolean
}
```

CORE_ACTIONS:
- include
- exclude
- compress
- mark_stale
- send_to_worker
- justify

SCORING_DIMENSIONS:
- critical_context_kept
- noise_reduced
- budget_respected
- stale_context_detected
- rationale_preserved

REVIEW_HOOKS:
- context_noise_transfer
- compression_loss_transfer
- capstone_context_strategy

### LAB-AGENT-TRACE-DEBUGGER

ENGINE: INT-AGENT-TRACE-DEBUGGER  
FIRST_NODE: NODE-02-04  
PHASE: PHASE_4_CORE_INTERACTION_ENGINES  
VISUALS:
- VIS-TraceTimeline
- VIS-FailureModeCard
- VIS-BoundaryBox
- VIS-CompactFallbackView

SCENARIO_DATA:
```ts
type TraceEvent = {
  id: string
  step: number
  actor: 'user' | 'main_agent' | 'subagent' | 'tool' | 'retriever' | 'evaluator' | 'system'
  action: string
  observation?: string
  riskTags: string[]
  isFailureOrigin?: boolean
  isSymptom?: boolean
}
```

CORE_ACTIONS:
- inspect_event
- mark_failure_origin
- classify_layer
- choose_root_cause
- choose_repair
- compare_trace

SCORING_DIMENSIONS:
- earliest_failure_found
- root_cause_accuracy
- layer_mapping
- repair_fit
- symptom_vs_cause_separation

REVIEW_HOOKS:
- trace_failure_transfer
- observability_gap_transfer
- capstone_failure_injection

### LAB-ARCHITECTURE-BUILDER

ENGINE: INT-ARCHITECTURE-BUILDER  
FIRST_NODE: NODE-01-01  
PHASE: PHASE_4_CORE_INTERACTION_ENGINES  
VISUALS:
- VIS-SystemNode
- VIS-SystemEdge
- VIS-LayerStack
- VIS-BoundaryBox
- VIS-CompactFallbackView

SCENARIO_DATA:
```ts
type ArchitectureScenario = {
  components: ArchitectureComponent[]
  slots: ArchitectureSlot[]
  constraints: ArchitectureConstraint[]
  requiredCapabilities: string[]
  forbiddenPatterns: string[]
}

type ArchitectureComponent = {
  id: string
  type: 'model' | 'tool' | 'retrieval' | 'memory' | 'eval' | 'human' | 'guardrail' | 'workflow' | 'agent' | 'storage'
  label: string
  capabilities: string[]
  costs: string[]
  risks: string[]
}
```

CORE_ACTIONS:
- select_component
- place_component
- connect_components
- set_boundary
- remove_component
- defend_choice

SCORING_DIMENSIONS:
- capability_coverage
- simplicity
- boundary_clarity
- eval_presence
- observability_presence
- security_fit

REVIEW_HOOKS:
- architecture_transfer
- overengineering_repair
- capstone_draft

### LAB-FAILURE-MODE-TREE

ENGINE: INT-FAILURE-MODE-TREE  
FIRST_NODE: NODE-00-01  
PHASE: PHASE_4_CORE_INTERACTION_ENGINES  
VISUALS:
- VIS-FailureModeCard
- VIS-LayerStack
- VIS-DecisionCard

SCENARIO_DATA:
```ts
type FailureScenario = {
  symptom: string
  context: string
  causeCards: CauseCard[]
  repairRules: RepairRule[]
  correctCauseChain: string[]
}

type CauseCard = {
  id: string
  label: string
  layer: string
  isRootCause?: boolean
  isSymptom?: boolean
  isDistractor?: boolean
}
```

CORE_ACTIONS:
- sort_cause
- rank_cause
- map_layer
- select_repair_rule
- explain_chain

SCORING_DIMENSIONS:
- root_cause_identification
- layer_accuracy
- repair_fit
- distractor_resistance

REVIEW_HOOKS:
- failure_mode_transfer
- postmortem_transfer

### LAB-TOOL-CONTRACT-FORGE

ENGINE: INT-TOOL-CONTRACT-FORGE  
FIRST_NODE: NODE-03-01  
PHASE: PHASE_4_CORE_INTERACTION_ENGINES  
VISUALS:
- VIS-BoundaryBox
- VIS-DecisionCard
- VIS-ScoreMeter

SCENARIO_DATA:
```ts
type ToolContractScenario = {
  task: string
  possibleActions: string[]
  dataSensitivity: 'low' | 'medium' | 'high'
  sideEffectRisk: 'none' | 'low' | 'medium' | 'high'
  candidateFields: ToolField[]
  permissionOptions: PermissionOption[]
}
```

CORE_ACTIONS:
- define_purpose
- choose_inputs
- choose_outputs
- set_permissions
- require_approval
- define_error_behavior
- add_test_case

SCORING_DIMENSIONS:
- narrow_scope
- parameter_clarity
- output_validity
- permission_minimization
- approval_fit
- test_coverage

REVIEW_HOOKS:
- tool_boundary_transfer
- least_privilege_transfer
- capstone_tool_contracts

### LAB-RETRIEVAL-FACTORY

ENGINE: INT-RETRIEVAL-FACTORY  
FIRST_NODE: NODE-05-01  
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS  
VISUALS:
- VIS-LayerStack
- VIS-SystemNode
- VIS-SystemEdge
- VIS-ScoreMeter
- VIS-CompactFallbackView

SCENARIO_DATA:
```ts
type RetrievalScenario = {
  corpusType: 'text_docs' | 'code' | 'pdfs' | 'tables' | 'figures' | 'mixed'
  queryType: 'semantic' | 'exact' | 'visual' | 'multi_hop' | 'freshness_sensitive'
  availableStages: RetrievalStage[]
  constraints: string[]
  expectedEvidence: string[]
}
```

CORE_ACTIONS:
- choose_chunking
- choose_embedding
- choose_bm25
- choose_hybrid
- choose_reranker
- choose_contextualization
- choose_visual_retrieval
- diagnose_miss

SCORING_DIMENSIONS:
- evidence_recall
- evidence_precision
- method_fit
- context_preservation
- cost_latency_fit
- visual_structure_handling

REVIEW_HOOKS:
- retrieval_method_transfer
- grounding_eval_transfer
- capstone_retrieval

### LAB-EVAL-DESIGNER

ENGINE: INT-EVAL-DESIGNER  
FIRST_NODE: NODE-07-01  
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS  
VISUALS:
- VIS-ScoreMeter
- VIS-DecisionCard
- VIS-LayerStack

SCENARIO_DATA:
```ts
type EvalScenario = {
  systemGoal: string
  failureModes: string[]
  candidateMetrics: string[]
  candidateTestCases: string[]
  sourceRequirements?: string[]
  operationalConstraints: string[]
}
```

CORE_ACTIONS:
- select_metric
- add_test_case
- add_negative_case
- add_regression_case
- add_grounding_check
- add_trace_signal
- identify_blind_spot

SCORING_DIMENSIONS:
- semantic_success
- regression_coverage
- grounding_coverage
- negative_case_quality
- operational_monitoring
- blind_spot_reduction

REVIEW_HOOKS:
- eval_transfer
- capstone_eval_governance

### LAB-REPO-REFACTOR

ENGINE: INT-REPO-REFACTOR-LAB  
FIRST_NODE: NODE-06-01  
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS  
VISUALS:
- VIS-LayerStack
- VIS-DecisionCard
- VIS-FailureModeCard

SCENARIO_DATA:
```ts
type RepoRefactorScenario = {
  fileTree: RepoFileNode[]
  symptoms: string[]
  missingArtifacts: string[]
  duplicateRules: string[]
  agentFailureHistory: string[]
}
```

CORE_ACTIONS:
- classify_file
- split_memory_type
- add_artifact
- remove_duplication
- define_update_protocol
- define_self_learning_rule

SCORING_DIMENSIONS:
- memory_separation
- context_load_reduction
- convention_clarity
- update_protocol
- agent_legibility
- duplication_reduction

REVIEW_HOOKS:
- source_material_transfer
- capstone_repo_memory

### LAB-SECURITY-INCIDENT-ROOM

ENGINE: INT-SECURITY-INCIDENT-ROOM  
FIRST_NODE: NODE-08-01  
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS  
VISUALS:
- VIS-BoundaryBox
- VIS-TraceTimeline
- VIS-FailureModeCard

SCENARIO_DATA:
```ts
type SecurityIncidentScenario = {
  incident: string
  actors: string[]
  trustedZones: string[]
  untrustedInputs: string[]
  toolPermissions: string[]
  impactLevel: 'low' | 'medium' | 'high'
}
```

CORE_ACTIONS:
- identify_untrusted_input
- classify_boundary_breach
- reduce_permission
- add_approval_gate
- add_sandbox
- write_postmortem_rule

SCORING_DIMENSIONS:
- trust_boundary_accuracy
- least_privilege_fit
- approval_gate_fit
- mitigation_specificity
- postmortem_quality

REVIEW_HOOKS:
- security_transfer
- capstone_failure_injection

### LAB-PAPER-FIGURE-DECODER

ENGINE: INT-PAPER-FIGURE-DECODER  
FIRST_NODE: NODE-05-05  
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS  
VISUALS:
- VIS-PaperFigureRecreation
- VIS-SystemNode
- VIS-SystemEdge
- VIS-CompactFallbackView

SCENARIO_DATA:
```ts
type PaperFigureScenario = {
  conceptId: string
  sourceAnchor: string
  simplifiedFigure: string
  components: string[]
  architectureLesson: string
  appliesWhen: string[]
  doesNotApplyWhen: string[]
}
```

CORE_ACTIONS:
- label_component
- identify_architecture_lesson
- choose_applicability
- map_to_system_design
- reject_wrong_application

SCORING_DIMENSIONS:
- visual_understanding
- system_mapping
- applicability_judgment
- anti_hype_reasoning

REVIEW_HOOKS:
- paper_visual_transfer
- retrieval_visual_transfer
