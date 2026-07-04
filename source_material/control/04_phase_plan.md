# /source_material/control/04_phase_plan.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Define build phases, allowed work per phase, and phase progression rules.

## PHASE_RULES

[PH-001] Build the full V1 through phases. Do not shrink product vision to a tiny MVP.

[PH-002] All major systems may be planned from the start, but implementation must follow phase order.

[PH-003] Do not implement later-phase features before current phase gates pass.

[PH-004] Later-phase placeholders are allowed only when they clarify architecture or navigation.

[PH-005] Each phase must produce durable artifacts, not only UI progress.

[PH-006] Each phase must update progress docs before moving forward.

[PH-007] If a phase becomes too large, split it into subphases without changing phase order.

[PH-008] Prefer stable foundations over visible feature quantity.

## SESSION_GRANULARITY

[PH-010] Each session should target 1-3 concrete deliverables.

[PH-011] Avoid "big bang" implementation.

[PH-012] If a task touches too many unrelated systems, split it.

[PH-013] If context becomes noisy, stop and write/update PROJECT_MEMORY.md before continuing.

[PH-014] Do not start a new phase with unresolved blocking issues from the current phase.

## PHASE_0_SOURCE_AND_REPO_BOOTSTRAP

[PH-100] Goal: establish project structure, source-material discipline, and durable progress files.

[PH-101] Required outputs:
- `/source_material/control/*`
- `/source_material/progress/PROJECT_MEMORY.md`
- `/source_material/progress/FEATURE_LEDGER.md`
- `/source_material/progress/DECISION_LOG.md`
- `/source_material/progress/OPEN_QUESTIONS.md`
- `/source_material/progress/CONTENT_COVERAGE_MATRIX.md`
- `/source_material/progress/VISUAL_QA_LOG.md`
- initial app scaffold

[PH-102] Allowed implementation:
- create React/Vite/TypeScript/Tailwind/PWA baseline
- create folder architecture
- create empty content/data model shells
- create routing skeleton
- create basic mobile layout shell

[PH-103] Not allowed:
- content-heavy lessons
- advanced labs
- custom diagrams
- Supabase integration
- capstone implementation

[PH-104] Exit gate: repo runs locally, structure matches build principles, progress docs exist.

## PHASE_1_APP_ARCHITECTURE_FOUNDATION

[PH-200] Goal: build the durable application shell and core data contracts.

[PH-201] Required outputs:
- typed roadmap model
- typed lesson model
- typed lab model
- typed progress model
- persistence adapter interface
- local storage or IndexedDB implementation
- app shell navigation
- mobile-first layout system

[PH-202] Allowed implementation:
- roadmap skeleton
- locked/unlocked node states
- basic progress tracking
- design tokens
- layout primitives
- route structure

[PH-203] Not allowed:
- final content scale
- complex visual diagrams
- advanced scoring engines
- Supabase adapter
- one-off lesson logic

[PH-204] Exit gate: app can render roadmap shell from data and persist simple progress locally.

## PHASE_2_VISUAL_SYSTEM_FOUNDATION

[PH-300] Goal: create reusable visual language before content expansion.

[PH-301] Required outputs:
- `/visual-lab` route
- visual primitive components
- system icon/shape grammar
- reusable diagram containers
- mobile fallback rules
- visual QA cases

[PH-302] Required visual primitives:
- SystemNode
- SystemEdge
- LayerStack
- FlowStep
- BoundaryBox
- TokenBudgetBar
- TraceTimeline
- DecisionCard
- FailureModeCard
- ScoreMeter
- CompactFallbackView

[PH-303] Allowed implementation:
- static diagram components
- responsive visual test cases
- dark/light mode visual checks if theme exists
- sample data for visuals

[PH-304] Not allowed:
- complex drag-and-drop
- canvas-only systems
- lesson-specific custom graphics
- paper-visual recreations before visual primitives are stable

[PH-305] Exit gate: every visual primitive appears in `/visual-lab` with mobile test cases.

## PHASE_3_ROADMAP_AND_LESSON_ENGINE

[PH-400] Goal: implement guided learning flow and lesson rendering engine.

[PH-401] Required outputs:
- roadmap progression logic
- prerequisite checks
- lesson shell
- lesson mode renderer
- feedback renderer
- review hook model
- first thin vertical slice of content

[PH-402] Required lesson modes:
- term-first
- task-first
- worked-trace-first
- multiple-viewpoints

[PH-403] Allowed implementation:
- 3-5 representative lessons
- basic feedback rules
- simple review hooks
- roadmap-bound lab entry points

[PH-404] Not allowed:
- large content dump
- all advanced topics
- untyped lesson content
- interactions that bypass roadmap prerequisites

[PH-405] Exit gate: user can complete a small guided sequence with progress and feedback.

## PHASE_4_CORE_INTERACTION_ENGINES

[PH-500] Goal: build reusable engines for tactical learning tasks.

[PH-501] Required outputs:
- interaction registry
- scoring contract
- feedback contract
- action validation
- failure-mode mapping
- transfer task support

[PH-502] Required core interactions:
- Context Budget Board
- Agent Trace Debugger
- Architecture Builder
- Failure Mode Tree
- Tool Contract Forge

[PH-503] Allowed implementation:
- config-driven interaction scenarios
- reusable scoring utilities
- roadmap-bound lab screens
- visual-lab entries for each interaction

[PH-504] Not allowed:
- one-off interaction logic hidden inside lesson screens
- MCQ-only versions of core interactions
- advanced retrieval/paper/capstone labs before core engines stabilize

[PH-505] Exit gate: each core interaction works with at least one scenario and one transfer variant.

## PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION

[PH-600] Goal: expand curriculum based on durable domain graph.

[PH-601] Required outputs:
- domain taxonomy
- concept dependency graph
- roadmap node map
- content coverage matrix
- first complete foundation-to-agents learning arc

[PH-602] Required topic arcs:
- AI Engineering Foundations
- System Layers
- Context Engineering
- Tool Boundaries
- Workflows vs Agents
- Basic Retrieval
- Basic Evals

[PH-603] Allowed implementation:
- more lessons
- more scenarios for existing interactions
- spaced review items
- locked future roadmap visibility

[PH-604] Not allowed:
- advanced paper-heavy content without interaction mapping
- frontier concepts without failure modes
- content that cannot be tracked in coverage matrix

[PH-605] Exit gate: curriculum graph is coherent and every added concept maps to PC-030.

## PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS

[PH-700] Goal: introduce advanced AI Engineering topics through practical architecture tasks.

[PH-701] Required outputs:
- Retrieval Factory
- Eval Designer
- Repo Refactor Lab
- Security Incident Room
- Paper Figure Decoder
- advanced visual atlas entries

[PH-702] Advanced topics may include:
- contextual retrieval
- reranking
- hybrid search
- long-context noise
- constrained decoding
- structured outputs
- MCP/tool protocols
- subagents
- memory strategies
- multimodal retrieval
- ColPali-style visual retrieval
- LoRA/DoRA only when tied to system/product decisions

[PH-703] Allowed implementation:
- paper-inspired visuals
- advanced scenarios
- multi-step system decisions
- deeper feedback and postmortem views

[PH-704] Not allowed:
- raw paper dumps
- visual complexity without fallback
- advanced topic pages without labs
- direct copied paper figures

[PH-705] Exit gate: advanced labs teach decisions, not terminology.

## PHASE_7_REVIEW_SPACING_AND_MASTERY_SYSTEM

[PH-800] Goal: implement retention and mastery without XP-first gamification.

[PH-801] Required outputs:
- spaced review queue
- concept mastery state
- weak-area detection
- transfer task resurfacing
- roadmap recap screens
- progress insights

[PH-802] Allowed implementation:
- mastery meters
- review scheduling
- concept dependency reminders
- focused "repair missions"

[PH-803] Not allowed:
- streak-first motivation
- badge-first design
- fake progress without demonstrated understanding

[PH-804] Exit gate: completed concepts reappear later in new contexts.

## PHASE_8_CAPSTONE_SYSTEM

[PH-900] Goal: build integrated capstone for AI-native software team architecture.

[PH-901] Required outputs:
- capstone scenario engine
- multi-stage architecture challenge
- context/tool/retrieval/eval/security/repo decisions
- postmortem review
- improvement loop

[PH-902] Capstone must require:
- roadmap knowledge
- multiple interaction types
- real trade-offs
- failure diagnosis
- architecture defense
- final system review

[PH-903] Not allowed:
- capstone as simple final quiz
- capstone without earlier dependency references
- capstone that ignores maintainability and observability

[PH-904] Exit gate: capstone proves integrated architecture intuition.

## PHASE_9_HARDENING_AND_RELEASE

[PH-1000] Goal: stabilize V1 for real use.

[PH-1001] Required outputs:
- full visual QA pass
- mobile QA pass
- progress persistence QA
- roadmap completion QA
- content coverage review
- dead route cleanup
- final build check
- deployment readiness

[PH-1002] Allowed implementation:
- refactors
- bug fixes
- performance work
- accessibility improvements
- final polish

[PH-1003] Not allowed:
- adding major new systems
- expanding curriculum before stability
- replacing stable architecture without documented reason

[PH-1004] Exit gate: app is deployable and internally coherent.
