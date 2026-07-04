# /source_material/interactions/20_interaction_catalog.md

STATUS: INTERACTION_DOC  
LOAD_PRIORITY: WHEN_INTERACTION_OR_LESSON_WORK  
PURPOSE: Define reusable interaction types. Do not implement one-off tasks without checking this file.

## CATALOG_RULES

[IC-001] Interactions are reusable engines, not isolated lesson tricks.
[IC-002] Every core interaction must map to roadmap nodes and concept IDs.
[IC-003] Every interaction must require meaningful user action.
[IC-004] Avoid Multiple Choice unless it is a small sub-step inside a larger task.
[IC-005] Prefer tactical constraints over artificial gamification.
[IC-006] Interaction difficulty must come from system reasoning, not unclear UI.
[IC-007] Interaction config must be data-driven.
[IC-008] If an interaction is used only once, justify in DECISION_LOG.md.
[IC-009] Interactions must support feedback via decision -> consequence -> failure mode -> better rule.
[IC-010] Mobile/touch interaction must work before desktop polish.

## MECHANIC_KEYS

[MECH-RESOURCE] Limited resources: tokens, tool calls, latency, cost, review time, permissions.
[MECH-FOG] Incomplete information: stale docs, hidden constraints, uncertain sources.
[MECH-PIPELINE] Build/repair sequential systems.
[MECH-TRACE] Replay and inspect execution timeline.
[MECH-CONSTRAINT] Solve under hard rules or schemas.
[MECH-BOUNDARY] Set permissions and interfaces.
[MECH-CLASSIFY] Sort causes, risks, evidence, or system layers.
[MECH-RECONSTRUCT] Rebuild a better system from failed state.
[MECH-DEFEND] Choose and justify trade-offs.
[MECH-INJECT] Stress-test system with failure events.
[MECH-TRANSFER] Apply same concept in a changed scenario.

## CORE_INTERACTIONS

### INT-CONTEXT-BUDGET-BOARD

TYPE: resource_allocation  
PRIMARY_MECHANICS: MECH-RESOURCE, MECH-FOG, MECH-DEFEND  
PRIMARY_ARC: ARC-02  
INTRO_NODE: NODE-02-01  
CONCEPTS:
- CONCEPT-CTX-001
- CONCEPT-CTX-002
- CONCEPT-CTX-003
- CONCEPT-CTX-004
- CONCEPT-CTX-005

USER_ACTIONS:
- select context items
- assign priority
- discard noisy items
- compress items
- send items to subagent/worker
- justify final context pack

UI_MODEL:
- source-item cards
- token budget meter
- noise risk meter
- missing-context risk meter
- selected context panel
- consequence preview

GOOD_FOR:
- context window
- context noise
- compression
- subagent context isolation
- research/source selection

BAD_FOR:
- pure definitions
- large free-text answers

SUCCESS_CHECKS:
- includes critical constraints
- excludes low-value noise
- preserves source/rationale
- stays within budget
- explains trade-off

COMMON_FAILURES:
- includes everything
- drops critical constraint
- over-compresses rationale
- trusts stale memory
- ignores source quality

MOBILE_RULE:
- use tap-to-select and bottom-sheet details.
- avoid drag-only interaction.

### INT-AGENT-TRACE-DEBUGGER

TYPE: timeline_diagnosis  
PRIMARY_MECHANICS: MECH-TRACE, MECH-CLASSIFY, MECH-INJECT  
PRIMARY_ARC: ARC-04  
INTRO_NODE: NODE-02-04  
CONCEPTS:
- CONCEPT-CTX-005
- CONCEPT-CF-001
- CONCEPT-CF-005
- CONCEPT-CF-007
- CONCEPT-OBS-001

USER_ACTIONS:
- inspect timeline events
- mark failure point
- classify root cause
- compare traces
- propose repair
- identify missing observation/eval

UI_MODEL:
- vertical trace timeline
- event detail drawer
- cause tags
- failure highlight
- before/after trace compare

GOOD_FOR:
- agent loops
- workflow vs agent
- orchestrator-worker
- tool failures
- observability
- postmortems

SUCCESS_CHECKS:
- identifies earliest meaningful failure
- separates symptom from root cause
- maps failure to system layer
- proposes architecture repair

COMMON_FAILURES:
- blames model output only
- marks final error instead of earlier cause
- ignores missing observation
- ignores tool contract issue

MOBILE_RULE:
- one event expanded at a time.
- sticky failure summary.

### INT-ARCHITECTURE-BUILDER

TYPE: system_composition  
PRIMARY_MECHANICS: MECH-PIPELINE, MECH-BOUNDARY, MECH-DEFEND  
PRIMARY_ARC: ARC-01  
INTRO_NODE: NODE-01-01  
CONCEPTS:
- CONCEPT-AIE-002
- CONCEPT-AIE-003
- CONCEPT-CF-002
- CONCEPT-CF-003
- CONCEPT-CF-005
- CONCEPT-RET-001
- CONCEPT-EVAL-001

USER_ACTIONS:
- choose components
- place components in slots
- connect flow
- set boundaries
- choose workflow/agent pattern
- defend architecture

UI_MODEL:
- fixed-slot system board
- component palette
- connection list
- risk warnings
- architecture summary

GOOD_FOR:
- augmented LLM
- system layer thinking
- workflow patterns
- retrieval architecture
- capstone draft

SUCCESS_CHECKS:
- uses simplest sufficient structure
- components match scenario needs
- boundaries are explicit
- eval/observability not forgotten
- no unnecessary agent complexity

COMMON_FAILURES:
- too many agents
- no eval
- no retrieval grounding
- broad tools
- no memory plan

MOBILE_RULE:
- staged builder: choose component -> choose slot -> confirm connection.
- avoid free-form canvas in early versions.

### INT-FAILURE-MODE-TREE

TYPE: causal_classification  
PRIMARY_MECHANICS: MECH-CLASSIFY, MECH-RECONSTRUCT, MECH-TRANSFER  
PRIMARY_ARC: ARC-00  
INTRO_NODE: NODE-00-01  
CONCEPTS:
- CONCEPT-AIE-001
- CONCEPT-AIE-003
- CONCEPT-CTX-003
- CONCEPT-OBS-002

USER_ACTIONS:
- inspect symptom
- choose likely causes
- rank causes
- connect cause chain
- map to system layer
- choose repair rule

UI_MODEL:
- symptom card
- cause cards
- layer bins
- ranked cause stack
- repair rule selector

GOOD_FOR:
- architecture intuition
- postmortems
- context noise
- repo drift
- security incidents

SUCCESS_CHECKS:
- distinguishes cause and symptom
- identifies system layer
- selects repair with causal match
- avoids generic fixes

COMMON_FAILURES:
- selects superficial symptom
- over-fixes with complexity
- ignores missing eval/trace
- treats prompt as only lever

MOBILE_RULE:
- use card sorting with buttons, not drag-only.

### INT-TOOL-CONTRACT-FORGE

TYPE: interface_design  
PRIMARY_MECHANICS: MECH-BOUNDARY, MECH-CONSTRAINT, MECH-DEFEND  
PRIMARY_ARC: ARC-03  
INTRO_NODE: NODE-03-01  
CONCEPTS:
- CONCEPT-TOOL-001
- CONCEPT-TOOL-002
- CONCEPT-TOOL-003
- CONCEPT-SEC-001
- CONCEPT-SEC-002

USER_ACTIONS:
- define tool purpose
- choose inputs/outputs
- set permissions
- set approval requirements
- define failure behavior
- add test cases

UI_MODEL:
- tool contract form
- permission matrix
- schema preview
- risk panel
- test-case checklist

GOOD_FOR:
- tools as interfaces
- structured output
- least privilege
- human approval
- MCP preparation

SUCCESS_CHECKS:
- purpose is narrow
- parameters are unambiguous
- output is machine-readable
- permissions are minimal
- dangerous actions gated

COMMON_FAILURES:
- broad tool scope
- ambiguous params
- no error behavior
- no approval gate
- no test examples

MOBILE_RULE:
- wizard steps instead of giant form.

### INT-CONSTRAINT-PUZZLE

TYPE: constrained_solution  
PRIMARY_MECHANICS: MECH-CONSTRAINT, MECH-RESOURCE, MECH-TRANSFER  
PRIMARY_ARC: ARC-03  
INTRO_NODE: NODE-03-02  
CONCEPTS:
- CONCEPT-TOOL-003
- CONCEPT-TOOL-004
- CONCEPT-SEC-002

USER_ACTIONS:
- satisfy schema
- choose allowed moves
- repair invalid output
- decide when constraints are too strict
- identify failure from invalid structure

UI_MODEL:
- requirement card
- schema/constraint panel
- candidate output cards
- validation feedback
- repair editor or structured choices

GOOD_FOR:
- structured outputs
- constrained decoding
- approval rules
- safe output contracts

SUCCESS_CHECKS:
- output satisfies schema
- captures required semantics
- avoids brittle overconstraint
- explains constraints trade-off

COMMON_FAILURES:
- valid schema but wrong semantics
- good prose but invalid structure
- overconstrained design
- missing error path

MOBILE_RULE:
- use structured selection/repair over free code editing when possible.

### INT-RETRIEVAL-FACTORY

TYPE: pipeline_design  
PRIMARY_MECHANICS: MECH-PIPELINE, MECH-RESOURCE, MECH-FOG, MECH-DEFEND  
PRIMARY_ARC: ARC-05  
INTRO_NODE: NODE-05-01  
CONCEPTS:
- CONCEPT-RET-001
- CONCEPT-RET-002
- CONCEPT-RET-003
- CONCEPT-RET-004
- CONCEPT-RET-005
- CONCEPT-RET-006
- CONCEPT-RET-007
- CONCEPT-RET-008
- CONCEPT-RET-009

USER_ACTIONS:
- choose ingestion
- choose chunking
- choose retrieval method
- choose reranking
- choose context assembly
- diagnose missed evidence
- handle visual/table-rich docs

UI_MODEL:
- pipeline board
- corpus/sample document cards
- query card
- retrieved result list
- evidence quality meter
- failure explanation panel

GOOD_FOR:
- RAG
- hybrid search
- reranking
- contextual retrieval
- visual document retrieval
- grounding

SUCCESS_CHECKS:
- retrieval matches document/query type
- evidence quality improves
- visual docs handled when needed
- context assembly is grounded
- cost/latency considered

COMMON_FAILURES:
- semantic-only for exact identifiers
- text-only for visual tables
- chunking removes context
- no reranking despite noisy candidates
- no source quality check

MOBILE_RULE:
- pipeline stages as horizontal stepper or vertical cards.

### INT-EVAL-DESIGNER

TYPE: measurement_design  
PRIMARY_MECHANICS: MECH-DEFEND, MECH-CLASSIFY, MECH-TRANSFER  
PRIMARY_ARC: ARC-07  
INTRO_NODE: NODE-07-01  
CONCEPTS:
- CONCEPT-EVAL-001
- CONCEPT-EVAL-002
- CONCEPT-EVAL-003
- CONCEPT-EVAL-004
- CONCEPT-OBS-001

USER_ACTIONS:
- define success metric
- choose test cases
- choose graders/checks
- classify regression risks
- add trace signals
- identify missing measurement

UI_MODEL:
- eval canvas
- metric cards
- test case deck
- coverage grid
- blind spot warnings

GOOD_FOR:
- task success
- regression
- grounding
- trace observability
- capstone evaluation

SUCCESS_CHECKS:
- measures semantic task success
- includes regression cases
- includes grounding if sources matter
- catches known failure modes
- does not measure only formatting

COMMON_FAILURES:
- format-only eval
- no negative cases
- no source grounding
- no cost/latency/security dimension
- no regression set

MOBILE_RULE:
- coverage grid must collapse to checklist sections.

### INT-REPO-REFACTOR-LAB

TYPE: system_repair  
PRIMARY_MECHANICS: MECH-RECONSTRUCT, MECH-CLASSIFY, MECH-TRANSFER  
PRIMARY_ARC: ARC-06  
INTRO_NODE: NODE-06-01  
CONCEPTS:
- CONCEPT-MEM-002
- CONCEPT-MEM-003
- CONCEPT-MEM-004
- CONCEPT-MEM-005
- CONCEPT-REPO-001
- CONCEPT-REPO-002
- CONCEPT-REPO-003
- CONCEPT-REPO-004

USER_ACTIONS:
- inspect messy project state
- identify missing docs/conventions
- split memory types
- propose file structure
- repair agent workflow
- define self-learning loop

UI_MODEL:
- repo/file tree cards
- issue flags
- refactor target zones
- memory artifact board
- before/after structure

GOOD_FOR:
- project memory
- decision logs
- feature ledgers
- source material OS
- conventions
- small components

SUCCESS_CHECKS:
- separates hot memory/control/research/progress
- adds durable decisions
- avoids duplicated docs
- reduces future context load
- improves agent/human legibility

COMMON_FAILURES:
- adds more docs without purpose
- duplicates rules
- keeps everything in chat memory
- ignores code structure
- no update protocol

MOBILE_RULE:
- use collapsible file tree and staged repair actions.

### INT-SECURITY-INCIDENT-ROOM

TYPE: incident_response  
PRIMARY_MECHANICS: MECH-INJECT, MECH-BOUNDARY, MECH-CLASSIFY  
PRIMARY_ARC: ARC-08  
INTRO_NODE: NODE-08-01  
CONCEPTS:
- CONCEPT-SEC-001
- CONCEPT-SEC-002
- CONCEPT-SEC-003
- CONCEPT-SEC-004
- CONCEPT-PROD-003

USER_ACTIONS:
- inspect incident
- classify trust boundary breach
- identify unsafe permission
- add approval/sandbox rule
- repair tool contract
- write postmortem rule

UI_MODEL:
- incident timeline
- trust boundary map
- permission matrix
- mitigation cards
- postmortem summary

GOOD_FOR:
- prompt injection
- least privilege
- human approval gates
- sandboxing
- governance

SUCCESS_CHECKS:
- identifies untrusted input
- limits permissions
- adds correct approval gate
- updates governance/rules
- avoids blocking harmless actions unnecessarily

COMMON_FAILURES:
- trusts retrieved content
- removes all useful tool access
- adds approval everywhere
- ignores logs/traces
- no postmortem rule

MOBILE_RULE:
- incident timeline first, boundary map second.

### INT-PAPER-FIGURE-DECODER

TYPE: visual_research_literacy  
PRIMARY_MECHANICS: MECH-CLASSIFY, MECH-TRANSFER, MECH-DEFEND  
PRIMARY_ARC: ARC-05  
INTRO_NODE: NODE-05-05  
CONCEPTS:
- CONCEPT-RET-008
- CONCEPT-RET-009

USER_ACTIONS:
- inspect simplified paper-inspired visual
- identify system components
- map visual to architecture decision
- choose when concept applies
- identify when it does not apply

UI_MODEL:
- recreated concept diagram
- component labels
- decision prompt
- wrong-context examples
- application checklist

GOOD_FOR:
- ColPali-style visual retrieval
- contextual retrieval visuals
- agent pattern figures
- eval loop figures

SUCCESS_CHECKS:
- explains what visual teaches
- maps figure to system use
- identifies practical trigger condition
- avoids treating paper idea as universal solution

COMMON_FAILURES:
- memorizes figure labels only
- misses failure case
- applies paper technique where simpler pipeline works
- ignores cost/complexity

MOBILE_RULE:
- diagram can open fullscreen; details in bottom sheet.

### INT-TRADE-OFF-DUEL

TYPE: comparative_decision  
PRIMARY_MECHANICS: MECH-DEFEND, MECH-RESOURCE, MECH-TRANSFER  
PRIMARY_ARC: cross_arc  
INTRO_NODE: NODE-01-02  
CONCEPTS:
- CONCEPT-AIE-004
- CONCEPT-PROD-001
- CONCEPT-PROD-002
- CONCEPT-CF-001

USER_ACTIONS:
- choose between architectures
- rank trade-offs
- identify failure risk
- defend decision
- revise under changed constraint

UI_MODEL:
- option cards
- trade-off sliders
- scenario constraints
- consequence preview
- changed-condition replay

GOOD_FOR:
- workflow vs agent
- simple vs complex architecture
- cost/latency/quality
- retrieval method choice
- security approvals

SUCCESS_CHECKS:
- decision matches constraints
- recognizes trade-offs
- avoids universal answer
- revises when constraints change

COMMON_FAILURES:
- chooses most advanced option
- ignores cost/latency
- ignores failure mode
- cannot adapt to changed constraints

MOBILE_RULE:
- two-option or three-option comparison max per screen.

### INT-CAPSTONE-SIMULATOR

TYPE: integrated_system_challenge  
PRIMARY_MECHANICS: MECH-PIPELINE, MECH-INJECT, MECH-DEFEND, MECH-TRANSFER  
PRIMARY_ARC: ARC-10  
INTRO_NODE: NODE-10-01  
CONCEPTS:
- all_core

USER_ACTIONS:
- design integrated system
- allocate context
- define agents/tools/retrieval/memory/evals/security
- survive failure injection
- defend final architecture

UI_MODEL:
- staged mission board
- architecture summary
- risk register
- injected incidents
- final review dashboard

GOOD_FOR:
- final integration
- architecture defense
- long-term maintainability
- team-scale agent-driven development

SUCCESS_CHECKS:
- integrates all core system layers
- explicit trade-offs
- robust under failure injection
- eval and observability included
- security boundaries included

COMMON_FAILURES:
- perfect-sounding untestable design
- no memory/control plane
- no failure recovery
- no human approval gates
- unnecessary complexity

MOBILE_RULE:
- split into stages; no giant board required at once.
