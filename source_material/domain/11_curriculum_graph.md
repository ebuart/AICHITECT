# /source_material/domain/11_curriculum_graph.md

STATUS: DOMAIN_DOC  
LOAD_PRIORITY: WHEN_ROADMAP_OR_CONTENT_WORK  
PURPOSE: Define guided curriculum graph. Use IDs, not prose. Roadmap-first.

## GRAPH_RULES

[CG-001] Roadmap is primary navigation.
[CG-002] Labs are attached to roadmap nodes.
[CG-003] Nodes must declare prerequisites and unlocks.
[CG-004] Node content may expand over time; graph order should remain stable unless DECISION_LOG updates it.
[CG-005] Advanced nodes may be visible but locked.
[CG-006] Spaced review pulls from completed nodes.

## ROADMAP_ARCS

[ARC-00] Orientation
GOAL: establish product frame and system-thinking lens.
NODES: NODE-00-01, NODE-00-02

[ARC-01] Foundations
GOAL: teach AI-native system layers and augmented LLM mental model.
NODES: NODE-01-01, NODE-01-02, NODE-01-03

[ARC-02] Context Engineering
GOAL: teach token/context decisions, noise, compression, and context isolation.
NODES: NODE-02-01, NODE-02-02, NODE-02-03, NODE-02-04

[ARC-03] Tool Boundaries
GOAL: teach tools as contracts, structured outputs, constrained formats, permissions.
NODES: NODE-03-01, NODE-03-02, NODE-03-03, NODE-03-04

[ARC-04] Control Flow and Agents
GOAL: teach workflows vs agents and common agentic system patterns.
NODES: NODE-04-01, NODE-04-02, NODE-04-03, NODE-04-04, NODE-04-05

[ARC-05] Retrieval Systems
GOAL: teach RAG, hybrid retrieval, reranking, contextual retrieval, visual retrieval.
NODES: NODE-05-01, NODE-05-02, NODE-05-03, NODE-05-04, NODE-05-05

[ARC-06] Memory and Long-Running Work
GOAL: teach durable project memory and agent/team continuity.
NODES: NODE-06-01, NODE-06-02, NODE-06-03, NODE-06-04

[ARC-07] Evals and Observability
GOAL: teach how to measure and debug AI systems.
NODES: NODE-07-01, NODE-07-02, NODE-07-03, NODE-07-04

[ARC-08] Security and Governance
GOAL: teach safety boundaries, prompt injection, least privilege, approvals.
NODES: NODE-08-01, NODE-08-02, NODE-08-03, NODE-08-04

[ARC-09] Repo Architecture and Team Scale
GOAL: teach AI-friendly codebase architecture and multi-session conventions.
NODES: NODE-09-01, NODE-09-02, NODE-09-03, NODE-09-04

[ARC-10] Capstone
GOAL: integrate all layers into AI-native software team system.
NODES: NODE-10-01, NODE-10-02, NODE-10-03, NODE-10-04, NODE-10-05

[ARC-11] The Director's Seat (DIRECTION track — control/09)
GOAL: shift from building to directing; aim agent swarms ("bees") with architectural overview.
NODES: NODE-11-01, NODE-11-02, NODE-11-03, NODE-11-04
NOTE: additive arc gated behind the capstone (FL-0043). First slice of the DIRECTION track.

[ARC-12] Targeting the Swarm (DIRECTION track — control/09, research-backed)
GOAL: aim the swarm — the brief as the bottleneck, sequence dependencies, triage drift.
NODES: NODE-12-01, NODE-12-02, NODE-12-03
NOTE: FL-0044. Grounded in multi-source 2026 practice (spec quality = the differentiator; coupling limits
parallelism; catch drift early). Reuses tradeOffDuel / pipelineBuilder / incidentTriage.

[ARC-13] Delivery & Acceptance + the Round-Trip (DIRECTION track — control/09; the PM delivery half + PC-043)
GOAL: prioritize/cut, accept against the brief, and DIRECT A REAL BUILD end-to-end.
NODES: NODE-13-01, NODE-13-02, NODE-13-03
NOTE: FL-0049 (13-01/02) + FL-0050 (13-03). 13-03 "Direct the Build" is the Open-Claw exit proof (PC-043): one
feature (add 2FA) directed across 4 phases (brief→decompose→diagnose→accept), 4 mechanics, one multi-challenge
lesson — built on existing engines + the multi-challenge LessonView, NO new mechanic. Remaining DIRECTION:
overview/SWARM-BOARD tracking + integrate (control/09 ARC-14, needs a new mechanic → user review).

## NODE_REGISTRY

### NODE-00-01 — What AI Engineering Actually Builds
ARC: ARC-00
PREREQ: none
CONCEPTS: CONCEPT-AIE-001
LESSON_MODES: task-first, multiple-viewpoints
LABS: Failure Mode Tree
UNLOCKS: NODE-00-02
OUTCOME: distinguish feature demo from reliable AI-native system.

### NODE-00-02 — The Iceberg Model
ARC: ARC-00
PREREQ: NODE-00-01
CONCEPTS: CONCEPT-AIE-003
LESSON_MODES: worked-trace-first
LABS: Layer Stack Builder
UNLOCKS: NODE-01-01
OUTCOME: see hidden layers beneath visible AI feature.

### NODE-01-01 — Augmented LLM
ARC: ARC-01
PREREQ: NODE-00-02
CONCEPTS: CONCEPT-AIE-002
LESSON_MODES: term-first, architecture-builder
LABS: Architecture Builder
UNLOCKS: NODE-01-02
OUTCOME: model + tools + retrieval + memory as base unit.

### NODE-01-02 — Simplicity Before Agency
ARC: ARC-01
PREREQ: NODE-01-01
CONCEPTS: CONCEPT-AIE-004, CONCEPT-PROD-001
LESSON_MODES: trade-off-first
LABS: Trade-off Duel
UNLOCKS: NODE-01-03
OUTCOME: choose simplest measurable architecture.

### NODE-01-03 — System Layers Map
ARC: ARC-01
PREREQ: NODE-01-02
CONCEPTS: LAYER-01, LAYER-02, LAYER-03, LAYER-04, LAYER-05, LAYER-06, LAYER-07, LAYER-08, LAYER-09
LESSON_MODES: multiple-viewpoints
LABS: Layer Stack Builder
UNLOCKS: NODE-02-01
OUTCOME: classify failures by system layer.

### NODE-02-01 — Context Window and Token Budget
ARC: ARC-02
PREREQ: NODE-01-03
CONCEPTS: CONCEPT-CTX-001, CONCEPT-CTX-002
LESSON_MODES: term-first
LABS: Context Budget Board
UNLOCKS: NODE-02-02
OUTCOME: allocate finite context intentionally.

### NODE-02-02 — Context Noise
ARC: ARC-02
PREREQ: NODE-02-01
CONCEPTS: CONCEPT-CTX-003
LESSON_MODES: task-first
LABS: Context Budget Board, Failure Mode Tree
UNLOCKS: NODE-02-03
OUTCOME: identify harmful irrelevant/stale context.

### NODE-02-03 — Context Compression
ARC: ARC-02
PREREQ: NODE-02-02
CONCEPTS: CONCEPT-CTX-004
LESSON_MODES: worked-trace-first
LABS: Context Budget Board
UNLOCKS: NODE-02-04
OUTCOME: summarize durable state without losing constraints.

### NODE-02-04 — Context Isolation and Subagents
ARC: ARC-02
PREREQ: NODE-02-03
CONCEPTS: CONCEPT-CTX-005
LESSON_MODES: worked-trace-first
LABS: Agent Trace Debugger
UNLOCKS: NODE-03-01
OUTCOME: move noisy exploration into separate context.

### NODE-03-01 — Tools Are Interfaces
ARC: ARC-03
PREREQ: NODE-02-04
CONCEPTS: CONCEPT-TOOL-001, CONCEPT-TOOL-002
LESSON_MODES: term-first, task-first
LABS: Tool Contract Forge
UNLOCKS: NODE-03-02
OUTCOME: design tools as agent-computer interfaces.

### NODE-03-02 — Structured Outputs
ARC: ARC-03
PREREQ: NODE-03-01
CONCEPTS: CONCEPT-TOOL-003
LESSON_MODES: worked-trace-first
LABS: Constraint Puzzle, Tool Contract Forge
UNLOCKS: NODE-03-03
OUTCOME: prevent downstream parsing/format drift.

### NODE-03-03 — Constrained Decoding
ARC: ARC-03
PREREQ: NODE-03-02
CONCEPTS: CONCEPT-TOOL-004
LESSON_MODES: term-first, constraint-puzzle
LABS: Constraint Puzzle
UNLOCKS: NODE-03-04
OUTCOME: understand schema-level generation constraints and limits.

### NODE-03-04 — MCP and Tool Ecosystems
ARC: ARC-03
PREREQ: NODE-03-03
CONCEPTS: CONCEPT-TOOL-005
LESSON_MODES: architecture-builder
LABS: Tool Contract Forge, Architecture Builder
UNLOCKS: NODE-04-01
OUTCOME: model standardized external tool/data integration.

### NODE-04-01 — Workflow vs Agent
ARC: ARC-04
PREREQ: NODE-03-04
CONCEPTS: CONCEPT-CF-001
LESSON_MODES: task-first
LABS: Trade-off Duel, Agent Trace Debugger
UNLOCKS: NODE-04-02
OUTCOME: choose predictable workflow vs autonomous agent.

### NODE-04-02 — Workflow Patterns
ARC: ARC-04
PREREQ: NODE-04-01
CONCEPTS: CONCEPT-CF-002, CONCEPT-CF-003, CONCEPT-CF-004
LESSON_MODES: architecture-builder
LABS: Architecture Builder
UNLOCKS: NODE-04-03
OUTCOME: compose prompt chaining, routing, and parallelization.

### NODE-04-03 — Orchestrator-Worker
ARC: ARC-04
PREREQ: NODE-04-02
CONCEPTS: CONCEPT-CF-005
LESSON_MODES: worked-trace-first
LABS: Agent Trace Debugger, Architecture Builder
UNLOCKS: NODE-04-04
OUTCOME: delegate dynamic subtasks without flooding main context.

### NODE-04-04 — Evaluator-Optimizer
ARC: ARC-04
PREREQ: NODE-04-03
CONCEPTS: CONCEPT-CF-006
LESSON_MODES: worked-trace-first
LABS: Eval Designer, Trace Debugger
UNLOCKS: NODE-04-05
OUTCOME: build improvement loops with criteria.

### NODE-04-05 — Autonomous Agent Loop
ARC: ARC-04
PREREQ: NODE-04-04
CONCEPTS: CONCEPT-CF-007
LESSON_MODES: trace-first
LABS: Agent Trace Debugger
UNLOCKS: NODE-05-01
OUTCOME: reason about plan-act-observe loops, stop conditions, and compounding error.

### NODE-05-01 — RAG Basics
ARC: ARC-05
PREREQ: NODE-04-05
CONCEPTS: CONCEPT-RET-001, CONCEPT-RET-002, CONCEPT-RET-003
LESSON_MODES: architecture-builder
LABS: Retrieval Factory
UNLOCKS: NODE-05-02
OUTCOME: build basic retrieval pipeline.

### NODE-05-02 — Lexical vs Semantic Retrieval
ARC: ARC-05
PREREQ: NODE-05-01
CONCEPTS: CONCEPT-RET-003, CONCEPT-RET-004
LESSON_MODES: task-first
LABS: Retrieval Factory
UNLOCKS: NODE-05-03
OUTCOME: choose retrieval method based on query/document properties.

### NODE-05-03 — Hybrid Search and Reranking
ARC: ARC-05
PREREQ: NODE-05-02
CONCEPTS: CONCEPT-RET-005, CONCEPT-RET-006
LESSON_MODES: worked-trace-first
LABS: Retrieval Factory
UNLOCKS: NODE-05-04
OUTCOME: improve evidence quality with two-stage retrieval.

### NODE-05-04 — Contextual Retrieval
ARC: ARC-05
PREREQ: NODE-05-03
CONCEPTS: CONCEPT-RET-007
LESSON_MODES: task-first
LABS: Retrieval Factory
UNLOCKS: NODE-05-05
OUTCOME: prevent chunk context loss.

### NODE-05-05 — Visual Document Retrieval
ARC: ARC-05
PREREQ: NODE-05-04
CONCEPTS: CONCEPT-RET-008, CONCEPT-RET-009
LESSON_MODES: paper-figure-decoder
LABS: Paper Figure Decoder, Retrieval Factory
UNLOCKS: NODE-06-01
OUTCOME: know when page-image retrieval beats text-only retrieval.

### NODE-06-01 — Session vs Project Memory
ARC: ARC-06
PREREQ: NODE-05-05
CONCEPTS: CONCEPT-MEM-001, CONCEPT-MEM-002
LESSON_MODES: task-first
LABS: Repo Refactor Lab
UNLOCKS: NODE-06-02
OUTCOME: separate ephemeral chat context from durable state.

### NODE-06-02 — Decision Logs and Feature Ledgers
ARC: ARC-06
PREREQ: NODE-06-01
CONCEPTS: CONCEPT-MEM-003, CONCEPT-MEM-004
LESSON_MODES: worked-example
LABS: Repo Refactor Lab
UNLOCKS: NODE-06-03
OUTCOME: preserve rationale and implementation history.

### NODE-06-03 — Agent Learning Loops
ARC: ARC-06
PREREQ: NODE-06-02
CONCEPTS: CONCEPT-MEM-005
LESSON_MODES: task-first
LABS: Repo Refactor Lab
UNLOCKS: NODE-06-04
OUTCOME: convert repeated failures into durable rules.

### NODE-06-04 — Long-Running Agent Projects
ARC: ARC-06
PREREQ: NODE-06-03
CONCEPTS: CONCEPT-REPO-004
LESSON_MODES: multiple-viewpoints
LABS: Repo Refactor Lab, Architecture Builder
UNLOCKS: NODE-07-01
OUTCOME: design context/memory/control plane for multi-session work.

### NODE-07-01 — Eval Harness
ARC: ARC-07
PREREQ: NODE-06-04
CONCEPTS: CONCEPT-EVAL-001
LESSON_MODES: term-first, task-first
LABS: Eval Designer
UNLOCKS: NODE-07-02
OUTCOME: design repeatable measurement.

### NODE-07-02 — Task Success and Regression
ARC: ARC-07
PREREQ: NODE-07-01
CONCEPTS: CONCEPT-EVAL-002, CONCEPT-EVAL-004
LESSON_MODES: task-first
LABS: Eval Designer
UNLOCKS: NODE-07-03
OUTCOME: measure real outcomes and prevent regressions.

### NODE-07-03 — Grounding Evaluation
ARC: ARC-07
PREREQ: NODE-07-02
CONCEPTS: CONCEPT-EVAL-003
LESSON_MODES: worked-trace-first
LABS: Eval Designer, Retrieval Factory
UNLOCKS: NODE-07-04
OUTCOME: verify claims against sources.

### NODE-07-04 — Traces and Postmortems
ARC: ARC-07
PREREQ: NODE-07-03
CONCEPTS: CONCEPT-OBS-001, CONCEPT-OBS-002
LESSON_MODES: trace-first
LABS: Agent Trace Debugger, System Postmortem
UNLOCKS: NODE-08-01
OUTCOME: debug failures and convert them into system improvements.

### NODE-08-01 — Least Privilege
ARC: ARC-08
PREREQ: NODE-07-04
CONCEPTS: CONCEPT-SEC-001
LESSON_MODES: task-first
LABS: Tool Contract Forge, Security Incident Room
UNLOCKS: NODE-08-02
OUTCOME: minimize tool/agent permissions.

### NODE-08-02 — Human Approval Gates
ARC: ARC-08
PREREQ: NODE-08-01
CONCEPTS: CONCEPT-SEC-002
LESSON_MODES: task-first
LABS: Security Incident Room
UNLOCKS: NODE-08-03
OUTCOME: classify actions requiring approval.

### NODE-08-03 — Prompt Injection
ARC: ARC-08
PREREQ: NODE-08-02
CONCEPTS: CONCEPT-SEC-003
LESSON_MODES: incident-first
LABS: Security Incident Room, Retrieval Factory
UNLOCKS: NODE-08-04
OUTCOME: defend against untrusted input manipulating agent/tool behavior.

### NODE-08-04 — Sandboxing and Governance
ARC: ARC-08
PREREQ: NODE-08-03
CONCEPTS: CONCEPT-SEC-004, CONCEPT-PROD-003
LESSON_MODES: multiple-viewpoints
LABS: Security Incident Room
UNLOCKS: NODE-09-01
OUTCOME: design safe operational boundaries.

### NODE-09-01 — Repo Legibility
ARC: ARC-09
PREREQ: NODE-08-04
CONCEPTS: CONCEPT-REPO-001
LESSON_MODES: task-first
LABS: Repo Refactor Lab
UNLOCKS: NODE-09-02
OUTCOME: make repo readable to humans and agents.

### NODE-09-02 — Conventions and Small Components
ARC: ARC-09
PREREQ: NODE-09-01
CONCEPTS: CONCEPT-REPO-002, CONCEPT-REPO-003
LESSON_MODES: refactor-first
LABS: Repo Refactor Lab
UNLOCKS: NODE-09-03
OUTCOME: prevent monster files and unstable patterns.

### NODE-09-03 — Source Material OS
ARC: ARC-09
PREREQ: NODE-09-02
CONCEPTS: CONCEPT-REPO-004
LESSON_MODES: worked-example
LABS: Repo Refactor Lab
UNLOCKS: NODE-09-04
OUTCOME: manage long-context project instructions as control plane.

### NODE-09-04 — Team Scale
ARC: ARC-09
PREREQ: NODE-09-03
CONCEPTS: CONCEPT-PROD-003
LESSON_MODES: multiple-viewpoints
LABS: Architecture Builder
UNLOCKS: NODE-10-01
OUTCOME: design for multiple humans/agents over time.

### NODE-10-01 — Capstone Briefing
ARC: ARC-10
PREREQ: NODE-09-04
CONCEPTS: all_core
LESSON_MODES: scenario-first
LABS: Capstone Simulator
UNLOCKS: NODE-10-02
OUTCOME: understand final system challenge.

### NODE-10-02 — Capstone Architecture Draft
ARC: ARC-10
PREREQ: NODE-10-01
CONCEPTS: all_core
LESSON_MODES: architecture-builder
LABS: Capstone Simulator
UNLOCKS: NODE-10-03
OUTCOME: propose initial system.

### NODE-10-03 — Capstone Failure Injection
ARC: ARC-10
PREREQ: NODE-10-02
CONCEPTS: all_core
LESSON_MODES: incident-first
LABS: Security Incident Room, Trace Debugger
UNLOCKS: NODE-10-04
OUTCOME: diagnose failures in own architecture.

### NODE-10-04 — Capstone Eval and Governance
ARC: ARC-10
PREREQ: NODE-10-03
CONCEPTS: all_core
LESSON_MODES: eval-first
LABS: Eval Designer
UNLOCKS: NODE-10-05
OUTCOME: add measurable reliability and control.

### NODE-10-05 — Final System Review
ARC: ARC-10
PREREQ: NODE-10-04
CONCEPTS: all_core
LESSON_MODES: postmortem
LABS: Capstone Simulator
UNLOCKS: NODE-11-01
OUTCOME: defend architecture with trade-offs and failure modes.

### NODE-11-01 — From Builder to Director
ARC: ARC-11
PREREQ: NODE-10-05
CONCEPTS: CONCEPT-DIR-001
LESSON_MODES: scenario-first
LABS: Context Budget Board (Context-ROI: curate what the agent sees)
UNLOCKS: NODE-11-02
OUTCOME: shift from building to directing; curate what the agent sees.

### NODE-11-02 — One Bee or Many
ARC: ARC-11
PREREQ: NODE-11-01
CONCEPTS: CONCEPT-DIR-002
LESSON_MODES: task-first
LABS: Architecture Builder (match execution structure; do not over-swarm)
UNLOCKS: NODE-11-03
OUTCOME: match execution structure to the task; do not over-swarm a defined task.

### NODE-11-03 — Allocate Your Oversight
ARC: ARC-11
PREREQ: NODE-11-02
CONCEPTS: CONCEPT-DIR-003
LESSON_MODES: task-first
LABS: Context Allocator (risk-weighted oversight across parallel agents)
UNLOCKS: NODE-11-04
OUTCOME: weight finite oversight by risk, not evenly.

### NODE-11-04 — Set the Delegation Boundaries
ARC: ARC-11
PREREQ: NODE-11-03
CONCEPTS: CONCEPT-DIR-004
LESSON_MODES: task-first
LABS: Trust Boundary (what a delegated agent may touch: trusted/approval/sandbox/isolate)
UNLOCKS: NODE-12-01
OUTCOME: set what a delegated agent may touch before it runs.

### NODE-12-01 — The Brief Is the Bottleneck
ARC: ARC-12
PREREQ: NODE-11-04
CONCEPTS: CONCEPT-DIR-005
LESSON_MODES: trade-off-first
LABS: Trade-off Duel (brief detail + Definition of Done)
UNLOCKS: NODE-12-02
OUTCOME: right-size the brief; output quality tracks spec quality, not model choice.

### NODE-12-02 — Sequence the Dependencies
ARC: ARC-12
PREREQ: NODE-12-01
CONCEPTS: CONCEPT-DIR-006
LESSON_MODES: task-first
LABS: Pipeline Builder (dependency-ordered task plan; cut scope creep)
UNLOCKS: NODE-12-03
OUTCOME: order subtasks by dependency; cut scope creep.

### NODE-12-03 — Triage the Swarm
ARC: ARC-12
PREREQ: NODE-12-02
CONCEPTS: CONCEPT-DIR-007
LESSON_MODES: task-first
LABS: Incident Triage (prioritize attention across parallel agents)
UNLOCKS: NODE-13-01
OUTCOME: prioritize attention across parallel agents; stop drift first.

### NODE-13-01 — Prioritize and Cut
ARC: ARC-13
PREREQ: NODE-12-03
CONCEPTS: CONCEPT-DIR-008
LESSON_MODES: task-first
LABS: Context Allocator (allocate capacity by value × risk; cut low-value)
UNLOCKS: NODE-13-02
OUTCOME: allocate finite capacity by value × risk; cut the low-value.

### NODE-13-02 — Accept or Send Back
ARC: ARC-13
PREREQ: NODE-13-01
CONCEPTS: CONCEPT-DIR-009
LESSON_MODES: task-first
LABS: Trade-off Duel (accept vs send-back against the brief's acceptance criteria)
UNLOCKS: NODE-13-03
OUTCOME: accept against the brief; no rubber-stamp, no nitpick.

### NODE-13-03 — Direct the Build  (PC-043 Open-Claw exit proof)
ARC: ARC-13
PREREQ: NODE-13-02
CONCEPTS: all_core
LESSON_MODES: scenario-first
LABS: Trade-off Duel + Pipeline Builder + Failure Mode Tree (4-phase round-trip, multi-challenge lesson)
UNLOCKS: complete
OUTCOME: direct a real feature build end-to-end (spec → decompose → diagnose → accept). The in-app proxy for
"direct an agent to build a feature"; integrates brief/decompose/diagnose-by-layer/accept on one concrete
feature (add 2FA to login).
