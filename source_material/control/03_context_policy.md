# /source_material/control/03_context_policy.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Manage Claude Code context over many sessions and prevent source-material noise.

## CONTEXT_PRIORITY_ORDER

[CTX-001] Highest priority: current user instruction.

[CTX-002] Then: `/source_material/control/*`.

[CTX-003] Then: current phase docs.

[CTX-004] Then: relevant domain/interaction/visual docs.

[CTX-005] Then: research notes.

[CTX-006] Then: old chat context or inferred memory.

[CTX-007] If sources conflict, prefer the highest priority item.

## LOAD_POLICY

[CTX-010] Load only documents needed for the current task.

[CTX-011] Always load:
- 00_project_contract.md
- 01_non_goals.md
- 02_build_principles.md
- 03_context_policy.md
- current phase plan
- relevant progress docs

[CTX-012] Do not load all research docs by default.

[CTX-013] Do not paste large research summaries into implementation context.

[CTX-014] Use source doc IDs when referencing rules.

[CTX-015] Before major implementation, state:
- loaded docs
- ignored docs
- current phase
- intended files to modify

## ANTI_NOISE_RULES

[CTX-020] Do not duplicate the same rule across multiple docs.

[CTX-021] Do not copy long explanations from research docs into control docs.

[CTX-022] Do not restate the full project vision in every file.

[CTX-023] Do not add motivational prose to source docs.

[CTX-024] Do not expand source docs unless the new rule affects future implementation.

[CTX-025] Prefer rule IDs and short constraints over essays.

## MEMORY_POLICY

[CTX-030] Durable state must be stored in `/source_material/progress`.

[CTX-031] Use PROJECT_MEMORY.md for current project state and phase summary.

[CTX-032] Use FEATURE_LEDGER.md for implemented features.

[CTX-033] Use DECISION_LOG.md for architecture decisions.

[CTX-034] Use OPEN_QUESTIONS.md for unresolved issues.

[CTX-035] Use CONTENT_COVERAGE_MATRIX.md for curriculum and lesson coverage.

[CTX-036] Use VISUAL_QA_LOG.md for visual component status.

[CTX-037] Do not rely on chat memory for important decisions.

## SESSION_START_PROTOCOL

[CTX-040] At the start of each Claude Code session:
1. Read PROJECT_MEMORY.md.
2. Read current phase plan.
3. Read relevant control docs.
4. Identify current gate.
5. Continue only from documented state.

[CTX-041] If PROJECT_MEMORY.md is missing, create it before implementation.

[CTX-042] If phase is unclear, stop and reconstruct state from progress docs.

## SESSION_END_PROTOCOL

[CTX-050] At the end of each meaningful session:
1. Update PROJECT_MEMORY.md.
2. Update FEATURE_LEDGER.md.
3. Update DECISION_LOG.md if architecture changed.
4. Update OPEN_QUESTIONS.md if unresolved issues remain.
5. Update VISUAL_QA_LOG.md if visual components changed.
6. List next safe task.

## IMPLEMENTATION_CONTEXT_POLICY

[CTX-060] Before editing, inspect existing files.

[CTX-061] Do not assume project structure.

[CTX-062] Do not rewrite large files unless required.

[CTX-063] Prefer small patches.

[CTX-064] Preserve working behavior unless current task explicitly changes it.

[CTX-065] If a file grows too large, refactor before adding more logic.

[CTX-066] If the same logic appears twice, extract reusable code.

## RESEARCH_CONTEXT_POLICY

[CTX-070] Research docs are reference material, not direct implementation instructions.

[CTX-071] Use research to inform taxonomy, visuals, and lessons.

[CTX-072] Do not expose raw research complexity to the learner unless pedagogically required.

[CTX-073] Every research-derived concept must map to:
- system layer
- failure mode
- trade-off
- interaction
- visual model

## FAILURE_POLICY

[CTX-080] If context becomes inconsistent, stop implementation and summarize conflict.

[CTX-081] If a requested feature violates control docs, explain conflict and propose compliant alternative.

[CTX-082] If visual implementation becomes unstable, fall back to simpler reusable visual components.

[CTX-083] If lesson content becomes too broad, split into roadmap nodes or defer.
