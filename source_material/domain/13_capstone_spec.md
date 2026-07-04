# /source_material/domain/13_capstone_spec.md

STATUS: DOMAIN_DOC  
LOAD_PRIORITY: WHEN_CAPSTONE_OR_LONG_RANGE_PLANNING  
PURPOSE: Define final integrated challenge. Do not implement before Phase 8.

## CAPSTONE_RULES

[CAP-001] Capstone is the final integration test, not a quiz.
[CAP-002] Capstone must require prior roadmap concepts.
[CAP-003] Capstone must combine multiple labs.
[CAP-004] Capstone must include trade-offs, not one perfect answer.
[CAP-005] Capstone feedback must be system-specific and consequence-based.
[CAP-006] Do not implement capstone before PHASE_8.
[CAP-007] Earlier phases may show locked capstone preview and dependency path.

## CAPSTONE_IDENTITY

CAPSTONE_ID: CAP-AI-NATIVE-SOFTWARE-TEAM

TITLE_DE: AI-native Software-Team-System architektieren

CORE_QUESTION:
- How do we build an AI-assisted development system that remains understandable, testable, controllable, and maintainable over months or years?

USER_ROLE:
- Junior-to-mid technical student acting as system architect for an AI-assisted software team.

TARGET_SKILL:
- architecture intuition across context, tools, agents, retrieval, memory, evals, observability, security, repo systems, and governance.

## SCENARIO_BASE

ORG:
- small software team
- 4 human developers
- 3 AI agents/subagents
- one large growing codebase
- 12-month project horizon
- frequent feature changes
- mixed source material
- deployment pressure

SYSTEM_GOAL:
- enable AI-assisted development without losing scope, architecture, quality, or control.

SOURCE_INPUTS:
- existing repo structure
- old feature notes
- user requirements
- design references
- API docs
- bug reports
- architecture decisions
- test results
- security constraints
- research snippets

CONSTRAINTS:
- limited context budget
- mixed-quality docs
- some stale memory
- visual UI requirements
- mobile-first product constraints
- no uncontrolled write access
- must support multiple sessions
- must remain understandable to future humans and agents

## REQUIRED_SYSTEM_COMPONENTS

[CAP-COMP-001] Roadmap of development workflow.
[CAP-COMP-002] Context policy for agents.
[CAP-COMP-003] Repo memory system.
[CAP-COMP-004] Feature ledger.
[CAP-COMP-005] Decision log.
[CAP-COMP-006] Tool contracts.
[CAP-COMP-007] Agent/subagent roles.
[CAP-COMP-008] Retrieval strategy over code/docs.
[CAP-COMP-009] Eval harness.
[CAP-COMP-010] Trace/observability plan.
[CAP-COMP-011] Security boundary model.
[CAP-COMP-012] Human approval gates.
[CAP-COMP-013] Failure recovery process.
[CAP-COMP-014] Team convention system.
[CAP-COMP-015] Release/hardening plan.

## CAPSTONE_STAGES

### CAP-STAGE-01 — Briefing and System Recon

UNLOCK_NODE: NODE-10-01
PRIMARY_LABS:
- Context Budget Board
- Failure Mode Tree

TASK:
- Inspect project scenario.
- Identify hidden system layers.
- Classify initial risks.

REQUIRED_OUTPUT:
- risk map
- missing information list
- first context strategy

COMMON_FAILURES:
- starts designing before recon
- ignores stale docs
- treats all source material as equal
- fails to classify system layers

### CAP-STAGE-02 — Architecture Draft

UNLOCK_NODE: NODE-10-02
PRIMARY_LABS:
- Architecture Builder
- Tool Contract Forge
- Repo Refactor Lab

TASK:
- Build first AI-native team architecture.

REQUIRED_OUTPUT:
- system diagram
- agent roles
- tool boundaries
- repo memory plan
- workflow/agent decision map

COMMON_FAILURES:
- too many autonomous agents
- no clear tool permissions
- no durable project memory
- no human review checkpoints
- no convention enforcement

### CAP-STAGE-03 — Failure Injection

UNLOCK_NODE: NODE-10-03
PRIMARY_LABS:
- Agent Trace Debugger
- Security Incident Room
- Failure Mode Tree

TASK:
- System receives stress cases and failures.

INJECTED_FAILURES:
- context overload
- stale architecture decision
- prompt injection in retrieved doc
- subagent edits wrong files
- eval gap hides regression
- visual UI bug escapes review
- ambiguous tool contract causes unsafe action

REQUIRED_OUTPUT:
- failure diagnosis
- root cause mapping
- architecture repair plan

COMMON_FAILURES:
- patches symptom only
- blames model instead of system boundary
- ignores observability
- adds complexity without eval

### CAP-STAGE-04 — Eval and Governance Layer

UNLOCK_NODE: NODE-10-04
PRIMARY_LABS:
- Eval Designer
- Security Incident Room
- Trace Debugger

TASK:
- Add measurement and operational controls.

REQUIRED_OUTPUT:
- eval harness plan
- regression set
- grounding checks
- trace strategy
- approval gates
- governance rules

COMMON_FAILURES:
- tests only output format
- no semantic correctness check
- no security eval
- no cost/latency monitoring
- unclear owner for failures

### CAP-STAGE-05 — Final System Review

UNLOCK_NODE: NODE-10-05
PRIMARY_LABS:
- Capstone Simulator
- System Postmortem
- Trade-off Duel

TASK:
- Defend final architecture under review.

REQUIRED_OUTPUT:
- final architecture summary
- trade-off defense
- known risks
- mitigations
- future improvements
- postmortem if failure remains

COMMON_FAILURES:
- perfect-sounding but untestable design
- no explicit trade-offs
- no path for future agent/human onboarding
- no maintenance process

## SCORING_DIMENSIONS

[CAP-SCORE-001] Context Discipline
CHECKS:
- separates hot context, durable memory, research docs, and task-local context.
- avoids context noise.
- uses subagents/workers for noisy exploration when justified.

[CAP-SCORE-002] Architecture Fit
CHECKS:
- does not overuse agents.
- chooses workflows when predictable.
- uses agents when dynamic planning is necessary.

[CAP-SCORE-003] Tool Safety
CHECKS:
- tools have clear contracts.
- permissions are least-privilege.
- dangerous actions require approval.

[CAP-SCORE-004] Retrieval Quality
CHECKS:
- matches retrieval approach to document/query type.
- uses hybrid/reranking/contextual retrieval when needed.
- handles visual/table-rich docs when relevant.

[CAP-SCORE-005] Memory Durability
CHECKS:
- durable decisions and features are externalized.
- self-learning loop captures repeated failures.
- project state survives sessions.

[CAP-SCORE-006] Eval Readiness
CHECKS:
- measurable success criteria.
- regression set.
- grounding checks.
- security/cost/latency where relevant.

[CAP-SCORE-007] Observability
CHECKS:
- traceable decisions.
- tool calls and failures inspectable.
- postmortem process exists.

[CAP-SCORE-008] Security and Governance
CHECKS:
- prompt injection considered.
- sandboxing/approval boundaries.
- owner and escalation rules.

[CAP-SCORE-009] Repo Maintainability
CHECKS:
- small components.
- clear conventions.
- no monster files.
- feature-folder architecture.
- AI-readable project docs.

[CAP-SCORE-010] System Trade-off Reasoning
CHECKS:
- explains why not using more complexity.
- identifies cost/latency/reliability trade-offs.
- names unresolved risks honestly.

## FEEDBACK_FORMAT

[CAP-FB-001] Feedback must use BP-060:
1. decision taken
2. system consequence
3. real-world context
4. failure mode
5. better architecture rule
6. improved solution

[CAP-FB-002] Do not use personality labels.

[CAP-FB-003] Highlight compounding failures:
- missing context policy -> wrong agent decisions -> wrong edits -> no eval catches it.
- broad tool permission -> unsafe action -> no approval gate -> incident.
- weak retrieval -> unsupported answer -> no grounding eval -> trusted hallucination.

[CAP-FB-004] Final review must include:
- passed dimensions
- weak dimensions
- highest-risk failure path
- minimum repair set
- next-level improvement

## IMPLEMENTATION_NOTES

[CAP-IMP-001] Build capstone as scenario engine, not static page.
[CAP-IMP-002] Reuse existing lab engines.
[CAP-IMP-003] Capstone state must persist.
[CAP-IMP-004] Capstone should support staged replay.
[CAP-IMP-005] Capstone should show dependency references to earlier nodes.
[CAP-IMP-006] Avoid open-ended free text as only input; use structured decisions plus short justifications.
[CAP-IMP-007] Use deterministic scoring plus qualitative feedback templates.
