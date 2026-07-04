# /source_material/control/05_quality_gates.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Define mandatory quality gates before features or phases are considered complete.

## GENERAL_DONE_RULES

[QG-001] A feature is not done when it looks correct once. It is done when it passes its relevant gates.

[QG-002] A phase is not done until all blocking gates pass or are explicitly documented as deferred with reason.

[QG-003] Do not mark work complete if build/runtime errors remain.

[QG-004] If tests/build cannot be run, document why and list manual checks performed.

[QG-005] Prefer fixing architecture defects before adding content quantity.

## BUILD_GATE

[QG-010] Before completing a meaningful implementation task:
- app compiles
- no known blocking runtime errors
- TypeScript errors resolved or documented
- broken imports resolved
- no dead references to removed components

[QG-011] If lint/test scripts exist, run them.

[QG-012] If no lint/test scripts exist, do not invent success. State "not available" in PROJECT_MEMORY.md.

[QG-013] Do not leave console errors from normal user flows.

## ARCHITECTURE_GATE

[QG-020] New code must follow feature-folder boundaries.

[QG-021] UI, content data, scoring logic, and persistence must remain separated.

[QG-022] No new monster files.

[QG-023] If a component exceeds reasonable size or handles unrelated concerns, split it.

[QG-024] Duplicate logic must be extracted before expansion.

[QG-025] New major behavior needs typed contracts.

[QG-026] New architecture decisions must be recorded in DECISION_LOG.md.

## CONTENT_GATE

[QG-030] Every new concept must satisfy PC-030:
- system layer
- practical use case
- failure mode
- trade-off
- visual model
- interaction
- transfer task

[QG-031] Every lesson must declare prerequisites.

[QG-032] Every lesson must map to a roadmap node.

[QG-033] Every roadmap node must have a clear learning purpose.

[QG-034] Do not add content that is only definitional unless it is required for an upcoming task.

[QG-035] Content must use German explanatory text and preserve standard English technical terms.

[QG-036] Update CONTENT_COVERAGE_MATRIX.md after adding or changing curriculum.

## INTERACTION_GATE

[QG-040] Every interaction must require meaningful user action.

[QG-041] Avoid tasks solvable by simple exclusion.

[QG-042] Feedback must explain system consequences, not user psychology.

[QG-043] Feedback must include failure mode and better architecture rule.

[QG-044] Interaction state must be recoverable after reload if progress persistence exists.

[QG-045] Interaction must have at least one valid completion path.

[QG-046] Interaction must have at least one meaningful incorrect or suboptimal path with feedback.

[QG-047] Roadmap-bound labs must check prerequisites.

## VISUAL_GATE

[QG-050] Every complex visual component must appear in `/visual-lab`.

[QG-051] Visual components must be tested with:
- short labels
- long labels
- empty state
- dense state
- mobile width
- desktop width
- error or warning state if applicable

[QG-052] No overlapping labels.

[QG-053] No unreadable text on mobile.

[QG-054] Touch targets must be usable on mobile.

[QG-055] Complex diagrams need compact fallback views.

[QG-056] Do not add a new visual pattern directly inside a lesson without adding it to the visual system.

[QG-057] Update VISUAL_QA_LOG.md after changing visuals.

## ROADMAP_GATE

[QG-060] Primary navigation must remain roadmap-first.

[QG-061] Labs must be bound to roadmap nodes.

[QG-062] Advanced nodes may be visible as locked future nodes.

[QG-063] Locked content must not be the primary path before prerequisites.

[QG-064] Roadmap progression must persist.

[QG-065] Review hooks must connect to completed roadmap nodes.

## PERSISTENCE_GATE

[QG-070] Progress storage must go through adapter boundary.

[QG-071] UI must not call LocalStorage/IndexedDB directly if storage adapter exists.

[QG-072] Persistence state must be typed.

[QG-073] Missing/corrupt progress state must fail safely.

[QG-074] Supabase-ready boundary must not require Supabase in V1 local mode.

## ACCESSIBILITY_AND_MOBILE_GATE

[QG-080] Mobile-first layout must be checked before desktop polish.

[QG-081] Main flows must work at narrow mobile width.

[QG-082] Text density must stay readable for short attention spans.

[QG-083] Important actions need clear labels.

[QG-084] Do not rely on hover-only interactions.

[QG-085] Interactive elements must be keyboard reachable where practical.

## SOURCE_DOC_GATE

[QG-090] Source docs must stay concise and non-duplicative.

[QG-091] New rules need IDs.

[QG-092] Do not add motivational prose to control docs.

[QG-093] If a source doc grows too large, split it by responsibility.

[QG-094] If source docs conflict, resolve conflict in DECISION_LOG.md.

## PHASE_EXIT_GATE

[QG-100] Before phase exit:
1. Relevant build gate passed.
2. Relevant architecture gate passed.
3. Relevant visual gate passed if visuals changed.
4. Relevant content gate passed if content changed.
5. Relevant interaction gate passed if interactions changed.
6. Progress docs updated.
7. Next phase entry task documented.

[QG-101] Do not proceed to next phase by assumption.

[QG-102] If a phase gate is intentionally deferred, document:
- gate ID
- reason
- risk
- owner/future task
- maximum phase where it must be resolved
