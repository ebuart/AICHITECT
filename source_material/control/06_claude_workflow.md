# /source_material/control/06_claude_workflow.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Define Claude Code operating procedure for reliable multi-session development.

## OPERATING_MODE

[CW-001] Act as a senior AI-native product engineer and architect.

[CW-002] Optimize for durable architecture, not fast demo output.

[CW-003] Prefer small, verifiable changes over large rewrites.

[CW-004] Treat source docs as project operating system.

[CW-005] Treat progress docs as durable memory.

[CW-006] Do not rely on chat-only memory for important project state.

## SESSION_START

[CW-010] At the start of every session:
1. Read `/source_material/progress/PROJECT_MEMORY.md`.
2. Read current phase from PROJECT_MEMORY.md.
3. Read relevant control docs.
4. Read current phase plan.
5. Inspect relevant existing files before editing.
6. State intended task and target files.

[CW-011] If PROJECT_MEMORY.md does not exist, create progress docs before feature work.

[CW-012] If current phase is unclear, reconstruct from progress docs and stop for confirmation only if impossible.

[CW-013] Do not begin implementation from old assumptions.

## TASK_SELECTION

[CW-020] Choose tasks that advance the current phase gate.

[CW-021] Avoid unrelated polish before foundations.

[CW-022] Avoid adding content quantity before content model is stable.

[CW-023] Avoid adding visual complexity before visual system foundation.

[CW-024] Avoid adding advanced labs before core interaction contracts.

[CW-025] If user asks for a later-phase feature early, create a documented placeholder or backlog item unless phase rules allow implementation.

## BEFORE_EDITING

[CW-030] Inspect files before modifying.

[CW-031] Identify existing conventions.

[CW-032] Preserve working behavior.

[CW-033] Decide whether change belongs in:
- UI component
- feature logic
- content data
- visual system
- persistence adapter
- type definition
- progress docs

[CW-034] Do not mix unrelated responsibilities in the same patch.

## IMPLEMENTATION_LOOP

[CW-040] Work in small patches.

[CW-041] After each patch, check for:
- broken imports
- type mismatches
- duplicated logic
- oversized components
- violated source rules

[CW-042] If adding a new pattern, document it or reuse an existing pattern.

[CW-043] If a better architecture requires refactor, prefer refactor before more feature code.

[CW-044] If blocked, document the blocker in OPEN_QUESTIONS.md and continue with the safest independent task if possible.

## VISUAL_WORKFLOW

[CW-050] For any new visual component:
1. Build reusable component.
2. Add sample to `/visual-lab`.
3. Test short/long/dense/mobile states.
4. Add compact fallback if needed.
5. Update VISUAL_QA_LOG.md.

[CW-051] Do not debug visuals only through the target lesson screen.

[CW-052] Do not create unique visuals inside content files.

[CW-053] Prefer deterministic layout over emergent graph layout.

## CONTENT_WORKFLOW

[CW-060] For any new lesson or concept:
1. Check roadmap dependency.
2. Check domain taxonomy.
3. Define concept IDs.
4. Define lesson mode.
5. Define interaction type.
6. Define visual model.
7. Define failure mode.
8. Define transfer task.
9. Update CONTENT_COVERAGE_MATRIX.md.

[CW-061] Do not add lesson content directly into React components.

[CW-062] Do not add advanced concepts without prerequisite links.

[CW-063] Keep learner-facing language German with English technical terms.

## INTERACTION_WORKFLOW

[CW-070] For any interaction:
1. Define action model.
2. Define scoring or evaluation logic.
3. Define feedback rules.
4. Define failure modes.
5. Define valid completion states.
6. Define persistence behavior.
7. Add roadmap binding.
8. Add visual-lab or isolated preview if visual.

[CW-071] Interactions must produce understanding, not just completion.

[CW-072] If interaction is only used once, justify it in DECISION_LOG.md.

## RESEARCH_WORKFLOW

[CW-080] Use research docs to inform product content, not to dump raw theory.

[CW-081] For research-derived concepts, extract:
- practical architecture use
- system layer
- failure mode
- trade-off
- visual idea
- interaction idea
- source anchor

[CW-082] Do not expose source complexity unless pedagogically useful.

[CW-083] If research is uncertain or outdated, mark it in source notes.

## END_OF_SESSION

[CW-090] At the end of a meaningful session:
1. Summarize implemented changes in PROJECT_MEMORY.md.
2. Update FEATURE_LEDGER.md.
3. Update DECISION_LOG.md if architecture changed.
4. Update CONTENT_COVERAGE_MATRIX.md if content changed.
5. Update VISUAL_QA_LOG.md if visuals changed.
6. Update OPEN_QUESTIONS.md if needed.
7. Record next safe task.

[CW-091] Never end a session with undocumented architecture changes.

[CW-092] Never leave the next step ambiguous if avoidable.

## COMMIT_MESSAGE_STYLE

[CW-100] Use concise commit-style summaries in progress docs.

[CW-101] Format:
- changed:
- why:
- risks:
- next:

## SELF_REVIEW_PROMPT

[CW-110] Before declaring completion, answer:
1. Did this follow current phase?
2. Did this violate any non-goal?
3. Did this increase context noise?
4. Did this create duplicated logic?
5. Did this preserve roadmap-first learning?
6. Did this keep content data-driven?
7. Did this pass relevant visual gates?
8. Did this update progress docs?

[CW-111] If any answer is negative, fix or document before completion.

## ESCALATION_RULES

[CW-120] Stop and document conflict if:
- user request conflicts with control docs
- source docs conflict
- implementation requires architectural rewrite
- visual approach becomes unstable
- progress state is inconsistent
- phase gate cannot be passed

[CW-121] When stopping, provide:
- conflict summary
- affected rule IDs
- options
- recommended path
