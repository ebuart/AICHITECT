# /source_material/progress/FEATURE_LEDGER.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: WHEN_FEATURE_WORK  
PURPOSE: Track implemented features without rereading codebase history.

## FORMAT_RULES

[FL-001] Add one entry per meaningful feature or refactor.
[FL-002] Keep entries short.
[FL-003] Reference files and rule IDs instead of long explanations.
[FL-004] Mark incomplete work honestly.

## STATUS_VALUES

- planned
- in_progress
- implemented
- qa_needed
- blocked
- deferred
- removed

## FEATURE_ENTRIES

### FL-0001 — Source Material Control System

STATUS: implemented  
PHASE: PHASE_0_SOURCE_AND_REPO_BOOTSTRAP  
RULE_REFS: PC-030, CTX-010, CTX-030, CW-010  
FILES:
- `/source_material/control/00_project_contract.md`
- `/source_material/control/01_non_goals.md`
- `/source_material/control/02_build_principles.md`
- `/source_material/control/03_context_policy.md`
- `/source_material/control/04_phase_plan.md`
- `/source_material/control/05_quality_gates.md`
- `/source_material/control/06_claude_workflow.md`

CHANGED:
- Created compact control-doc operating system for Claude Code.

WHY:
- Prevent context noise, scope drift, visual instability, and architecture decay.

QA:
- human_reviewed_partial

RISKS:
- Rules may need compression after real implementation starts.

NEXT:
- Create progress docs.

### FL-0002 — App Scaffold (React/Vite/TS/Tailwind/PWA)

STATUS: implemented
PHASE: PHASE_0_SOURCE_AND_REPO_BOOTSTRAP
RULE_REFS: PC-050, BP-020, PH-102, QG-010
FILES:
- `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`
- `src/main.tsx`, `src/index.css`, `src/vite-env.d.ts`
- `src/routes/router.tsx`, `src/routes/paths.ts`
- `src/components/layout/{AppShell,AppHeader,BottomNav}.tsx`
- `src/components/ui/PagePlaceholder.tsx`
- `public/{favicon.svg,pwa-192x192.png,pwa-512x512.png}`

CHANGED:
- Vite 7 + React 19 + TS (strict, project refs) + Tailwind v4 (@tailwindcss/vite) + vite-plugin-pwa baseline.
- Mobile-first app shell: sticky header + roadmap-first bottom nav + safe-area aware scroll region.
- Full feature-folder architecture per BP-020 (empty folders kept via .gitkeep).

WHY:
- Establish durable foundation before any content/visual/interaction work (BP-006, PH-100).

QA:
- build passes: `npm run build` (tsc -b clean, vite build + SW generated).
- not_run: no lint/test scripts exist yet (QG-012).
- not_run: manual browser/mobile QA (deferred to PHASE_1 layout work).

RISKS:
- npm audit reports 2 high-severity advisories in transitive deps (unaudited).
- PWA icons are 1x1 placeholders; need real assets before release.

NEXT:
- PHASE_1: typed roadmap/lesson/lab/progress models + adapter-backed progress.

### FL-0003 — Route Skeleton + Storage Adapter Boundary

STATUS: implemented
PHASE: PHASE_0_SOURCE_AND_REPO_BOOTSTRAP
RULE_REFS: PC-052, BP-005, QG-070, QG-073
FILES:
- `src/app/{HomePage,NotFoundPage}.tsx`
- `src/features/roadmap/RoadmapPage.tsx`
- `src/features/lessons/LessonPage.tsx`
- `src/features/labs/LabPage.tsx`
- `src/components/visuals/VisualLabPage.tsx`
- `src/types/progress.ts`
- `src/lib/storage/{StorageAdapter.ts,localStorageAdapter.ts,index.ts}`

CHANGED:
- Routes: `/`, `/roadmap`, `/lesson/:id`, `/lab/:id`, `/visual-lab`, `*` (404).
- All pages are deliberate PHASE-tagged placeholders (German copy, English terms).
- StorageAdapter interface + thin local-storage placeholder accessed via getStorageAdapter().

WHY:
- Prove routing + persistence boundary without implementing real lessons/labs (PH-103).

QA:
- build passes (typed, no broken imports).
- adapter fails safe to EMPTY_PROGRESS_STATE on missing/corrupt data (QG-073).

RISKS:
- Adapter not yet wired into UI; no real progress flows (intended for PHASE_1).

NEXT:
- Wire adapter into a progress feature module in PHASE_1.

### FL-0004 — App Architecture Foundation (PHASE_1)

STATUS: implemented
PHASE: PHASE_1_APP_ARCHITECTURE_FOUNDATION
RULE_REFS: PH-201, PH-204, BP-003, BP-004, BP-005, QG-070, RD-001
FILES:
- `src/types/{ids,roadmap,lesson,lab,progress,index}.ts`
- `src/content/roadmap/{arcs,nodes,index}.ts`, `src/content/labs/labs.ts`
- `src/features/roadmap/{roadmapStatus,useRoadmap,nodeStatusDisplay,RoadmapNodeCard,RoadmapArcSection,RoadmapPage}.tsx`
- `src/features/progress/{progressMutations,ProgressContext,useProgress}.ts(x)`
- `src/components/ui/{Button,Card,Badge}.tsx`, `src/lib/utils/cn.ts`
- `src/main.tsx` (ProgressProvider), `src/app/HomePage.tsx`, `src/index.css` (tokens)

CHANGED:
- Typed domain models: roadmap (arcs/nodes/graph), lesson (BP-033), lab + interaction contract (BP-034), progress.
- Full 44-node curriculum graph modeled as data from domain/11 + 12 (structure only, no lesson bodies).
- Pure unlock engine (computeNodeStatus) driving locked/available/in_progress/completed (RD-001).
- Adapter-backed ProgressProvider: loads on mount, persists every change via storage adapter (QG-071).
- Roadmap rendered from data with start→complete flow that unlocks dependents; design tokens + UI primitives.

WHY:
- Durable app shell + data contracts before content (PH-200). Exit gate PH-204 met.

QA:
- build passes (tsc -b strict + vite build, 76 modules).
- roadmap graph integrity verified: 44 nodes, no dupes, all prereq/unlock refs resolve, edges bidirectionally consistent.
- not_run: browser/mobile interaction QA (manual, pending).

RISKS:
- Progress persists whole snapshot each change (fine at current scale; revisit if state grows).

NEXT:
- PHASE_3: lesson engine + first vertical content slice.

### FL-0005 — Visual System Foundation (PHASE_2)

STATUS: implemented
PHASE: PHASE_2_VISUAL_SYSTEM_FOUNDATION
RULE_REFS: PH-301, PH-302, PH-305, BP-040..046, VSS-005, VSS-101, VCC-200
FILES:
- `src/types/visual.ts`, `src/lib/visuals/{visualState,visualMeta}.ts`
- `src/components/visuals/VisualStateChip.tsx`, `DiagramShell.tsx`, `index.ts`
- `src/components/visuals/primitives/{SystemNode,SystemEdge,LayerStack,FlowStep,BoundaryBox,TokenBudgetBar,TraceTimeline,DecisionCard,FailureModeCard,ScoreMeter,CompactFallbackView}.tsx`
- `src/components/visuals/lab/{VisualLabCase,structureDemos,contextTraceDemos,decisionDemos}.tsx`
- `src/components/visuals/VisualLabPage.tsx`

CHANGED:
- 11 reusable visual primitives built to visuals/31 contracts (typed props, SVG-free HTML/CSS, deterministic, no canvas).
- Visual state shown via labelled chips (state never color-only, VSS-101/102).
- DiagramShell container with compact-fallback toggle (VSS-007/130).
- `/visual-lab` gallery: every primitive with QA cases (short/long/dense/empty/states/fallback) + width switcher (320–430px) for mobile QA.

WHY:
- Reusable visual language before content-heavy visuals (PH-300, VSS-200). Exit gate PH-305 met.

QA:
- build passes (tsc -b strict + vite build, 96 modules).
- visual_lab: all 11 primitives + DiagramShell present with deterministic sample data.
- not_run: human pixel/mobile inspection (VQA-001: agents can't see graphical bugs) — see VISUAL_QA_LOG.

RISKS:
- Visual states are compile-verified, NOT yet visually inspected by a human.
- Desktop widths (768/1200px) not testable inside the mobile-first shell; only ≤430px emulated.

NEXT:
- Human visual QA pass over `/visual-lab` at mobile widths before using primitives in lessons (VQA-200).

### FL-0006 — Automated test harness (vitest + jsdom + RTL)

STATUS: implemented
PHASE: PHASE_2_VISUAL_SYSTEM_FOUNDATION
RULE_REFS: QG-010, QG-011, VQA-001
FILES:
- `vitest.config.ts`, `tests/setup.ts`
- `tests/{roadmapStatus,progressMutations,localStorageAdapter}.test.ts`
- `tests/{visualLab.smoke,pages.smoke}.test.tsx`
- `package.json` (`test`, `test:watch`); exported `PROGRESS_STORAGE_KEY`

CHANGED:
- 18 tests: unlock engine + graph integrity, progress mutations, storage adapter fail-safe (QG-073).
- Visual smoke: renders the full `/visual-lab` (all 11 primitives + DiagramShell + demos) without throwing.
- Pages smoke: RoadmapPage (data-driven render via ProgressProvider+Router) + HomePage CTA.
- In-memory Web Storage polyfill in setup (jsdom opaque-origin localStorage was non-functional).

WHY:
- Catch runtime/throw regressions automatically (chosen over a human-only visual pass).

QA:
- `npm test` → 18 passed; `npm run build` still green.
- LIMIT: smoke tests catch throws/missing output, NOT pixel-level layout bugs (VQA-001) — human pass still recommended (OQ-0005).

NEXT:
- Keep adding logic tests as PHASE_3 lesson/feedback engines land.

### FL-0007 — Lesson engine + feedback renderer (PHASE_3)

STATUS: implemented
PHASE: PHASE_3_ROADMAP_AND_LESSON_ENGINE
RULE_REFS: PH-401, PH-402, PH-405, BP-030, LG-001..009, FB-001..010, QG-047
FILES:
- `src/types/feedback.ts` (Feedback 6-part); `src/types/lesson.ts` (modes only now)
- `src/features/lessons/{lessonModel,lessonModes,reviewModel}.ts`
- `src/features/lessons/{LessonView,LessonBlockView,LessonVisualRenderer,FeedbackCard,LessonPage}.tsx`
- `src/features/progress/{progressMutations,ProgressContext}` (completeLesson + withLessonCompleted)
- `src/features/roadmap/RoadmapNodeCard.tsx` (routes lesson-bearing nodes into the lesson engine)

CHANGED:
- Data-driven lesson content model (BP-033 metadata + block sequence): prose/term/note/visual/decision.
- Four lesson modes (term/task/worked-trace/multiple-viewpoints) as authored block structures + a mode
  registry framing, served by one renderer (DEC-0008).
- FeedbackCard renders the 6-part feedback (decision→consequence→context→failure→rule→solution); analyzes
  the decision, never the learner (FB-002).
- LessonVisualRenderer maps content visuals to existing primitives (no one-off lesson visuals, VSS-003).
- Completion requires answering every decision; finishing completes the bound node → unlocks dependents.
- LessonPage enforces roadmap prerequisites before rendering (QG-047, PH-404).

WHY:
- The guided lesson loop is the core product experience (PC-002/PC-004). Exit gate PH-405 met.

QA:
- build green (109 modules); `npm test` 29 passed.
- tests: lesson integrity (node/prereq refs, best-option present, full feedback), completion→unlock,
  render smoke for all 5 lessons, decision→feedback→completion, prereq gating, not-found.

RISKS:
- Lesson visuals render but are pixel-unverified by a human (OQ-0005).

NEXT:
- PHASE_4 interaction engines replace the lightweight in-lesson decisions with reusable scored interactions.

### FL-0008 — First content slice: 5 lessons (PHASE_3)

STATUS: implemented
PHASE: PHASE_3_ROADMAP_AND_LESSON_ENGINE
RULE_REFS: PH-403, PC-030, PC-035, LG-300, CW-060
FILES:
- `src/content/lessons/{whatAiEngineeringBuilds,icebergModel,augmentedLlm,simplicityBeforeAgency,systemLayersMap}.ts`
- `src/content/lessons/index.ts` (registry + dev integrity check)

CHANGED:
- 5 lessons bound to the first 5 roadmap nodes (NODE-00-01..NODE-01-03), a contiguous unlockable chain.
- Modes covered: task-first, worked-trace-first, term-first, trade-off-first, multiple-viewpoints (PH-402).
- German explanatory text, English technical terms (PC-035); every decision option has 6-part feedback.

WHY:
- Thin vertical slice proving roadmap → lesson → interaction → feedback → progress (PH-401), not content scale.

QA:
- build + tests green; content integrity asserted in `tests/lessons.test.ts`.

RISKS:
- Per-concept PC-030 mapping is implicit in lessons; CONTENT_COVERAGE_MATRIX now tracks the slice.

NEXT:
- Expand curriculum in PHASE_5 against the domain graph; keep matrix in sync.

### FL-0009 — Interaction framework + LabPage host (PHASE_4)

STATUS: implemented
PHASE: PHASE_4_CORE_INTERACTION_ENGINES
RULE_REFS: PH-501, IC-001, IC-007, LS-001, LS-005, LS-006, LS-007, LS-009, QG-047
FILES:
- `src/features/labs/interactionModel.ts` (LabScenario, LabResult, LabEngineEntry, intro/transfer helpers)
- `src/features/labs/interactionRegistry.ts`
- `src/features/labs/LabPage.tsx` (host: resolve engine, gate prereqs, base/transfer switch, persist)
- `src/features/progress/{progressMutations,ProgressContext}` (withLabCompleted + completeLab)
- `src/types/progress.ts` (LabProgress + score/weakSignals)

CHANGED:
- Reusable interaction contracts shared by all engines: config-driven scenarios (no hardcoded data, LS-009),
  normalized 0..1 score + mastery/weak signals + feedback list.
- LabPage resolves the engine by the lab's interactionType, enforces roadmap prerequisites (QG-047),
  supports a transfer-variant toggle (LS-005), and persists result + completes the node (LS-006/007).

WHY:
- "Reusable engines beat duplicated screens" (PH-500/MP-006). Engines differ only in scenario + scoring.

QA:
- build green (122 modules); `npm test` 44 passed (registry/binding + lab-host gating tests).

RISKS:
- Interaction previews not in `/visual-lab` yet (layering) — covered by render-smoke (OQ-0006).

NEXT:
- Add the remaining 3 engine entries to the registry.

### FL-0010 — Core engines: Context Budget Board + Failure Mode Tree (PHASE_4)

STATUS: implemented
PHASE: PHASE_4_CORE_INTERACTION_ENGINES
RULE_REFS: PH-502, IC-003, IC-009, FB-001..010, VCC-201
FILES:
- `src/features/labs/contextBudgetBoard/{types,scoring,feedbacks,ContextBudgetBoard,entry}.ts(x)`
- `src/features/labs/failureModeTree/{types,scoring,feedbacks,FailureModeTree,entry}.ts(x)`
- `src/content/labs/{contextBudgetScenarios,failureModeScenarios}.ts`

CHANGED:
- Context Budget Board (resource_allocation): tap-to-set include/compress/exclude per context item,
  live TokenBudgetBar + risk meters, pure scoring over 5 dimensions, FB-PATTERN feedback, base+transfer.
- Failure Mode Tree (causal_classification): card-sort cause/symptom/distractor + repair pick, reveals
  correctness after evaluation, pure scoring over 4 dimensions, FMT feedback, base+transfer.
- Both reuse `/visual-lab` primitives (TokenBudgetBar/ScoreMeter/FailureModeCard/DecisionCard/CompactFallbackView);
  scoring is pure + UI-free (VCC-201), feedback analyzes the decision not the learner (FB-002).

WHY:
- Two distinct interaction types prove the framework's reusability before scaling engines.

QA:
- build + `npm test` green; scoring unit-tested (optimal→full marks+strong; failure modes→correct weak signals+feedback);
  engine render/evaluate smoke tested.

RISKS:
- Pixel layout of the engines is human-unverified (OQ-0005).

NEXT:
- Mirror this pattern for Agent Trace Debugger, Architecture Builder, Tool Contract Forge (PH-505).

### FL-0011 — Remaining 3 core engines → PH-505 closed (PHASE_4)

STATUS: implemented
PHASE: PHASE_4_CORE_INTERACTION_ENGINES
RULE_REFS: PH-502, PH-505, IC-001, FB-001..010
FILES:
- `src/features/labs/agentTraceDebugger/*` + `src/content/labs/agentTraceScenarios.ts`
- `src/features/labs/toolContractForge/*` + `src/content/labs/toolContractScenarios.ts`
- `src/features/labs/architectureBuilder/*` + `src/content/labs/architectureScenarios.ts`
- `src/features/labs/interactionRegistry.ts` (all 5 engines registered)

CHANGED:
- Agent Trace Debugger (timeline diagnosis): tap to mark failure origin on TraceTimeline + repair pick;
  reveals origin/symptom after evaluation; 3 dimensions.
- Tool Contract Forge (interface design): allow-needed-actions + least-privilege permission + approval
  gate + typed-output toggles; live BoundaryBox; 4 dimensions.
- Architecture Builder (system composition): staged component selection to cover required capabilities
  without forbidden/redundant parts; live capability checklist; 4 dimensions.
- All reuse `/visual-lab` primitives; pure scoring; FB-pattern feedback; base + transfer each.

WHY:
- Closes PH-505: every core interaction works with ≥1 scenario + 1 transfer.

QA:
- build green (137 modules); `npm test` 54 passed (scoring per engine + registry/binding + render).

RISKS:
- Engine pixel layout human-unverified (OQ-0005).

NEXT:
- PHASE_5: lessons that consume these labs across the foundation-to-agents arc.

### FL-0012 — Context Engineering arc lessons (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-601, PH-602, PC-030, PC-035, CW-060
FILES:
- `src/content/lessons/{contextWindowBudget,contextNoise,contextCompression,contextIsolation}.ts`
- `src/content/lessons/index.ts` (registry → 9 lessons)

CHANGED:
- 4 lessons for ARC-02 (NODE-02-01..02-04): Context Window/Budget (term-first), Context Noise (task-first),
  Context Compression (worked-trace), Context Isolation/Subagents (worked-trace).
- Each reuses primitives (tokenBudget/trace) and points to its lab (Context Budget Board at 02-01,
  Agent Trace Debugger at 02-04). Contiguous unlockable chain NODE-00-01 → 02-04.
- CONTENT_COVERAGE_MATRIX rows added for CONCEPT-CTX-001..005.

WHY:
- Completes the Foundations→Context arc as the first coherent slice of PH-601's foundation-to-agents arc.

QA:
- build green; `npm test` 54 passed — lesson integrity + render-smoke tests iterate the registry, so the
  4 new lessons are validated (node/prereq refs, best-option present, full 6-part feedback, mode coverage).

RISKS:
- foundation-to-agents arc not yet complete: Tool Boundaries, Control Flow/Agents, Retrieval, Evals lessons remain.
- Lesson visuals human-unverified (OQ-0005).

NEXT:
- Author Tool Boundaries (NODE-03-*) + Workflow-vs-Agent (NODE-04-*) lessons, consuming Tool Contract Forge
  + Architecture Builder labs.

### FL-0013 — Complete foundation-to-agents arc + basic Retrieval/Evals (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-601, PH-602, PH-605, PC-030, PC-035
FILES:
- `src/content/lessons/{toolsAreInterfaces,structuredOutputs,constrainedDecoding,mcpToolEcosystems}.ts`
- `src/content/lessons/{workflowVsAgent,workflowPatterns,orchestratorWorker,evaluatorOptimizer,autonomousAgentLoop}.ts`
- `src/content/lessons/{ragBasics,evalHarness}.ts`
- `src/content/lessons/index.ts` (registry → 20 lessons)

CHANGED:
- Tool Boundaries arc (NODE-03-01..03-04) wired to Tool Contract Forge + Architecture Builder.
- Control Flow & Agents arc (NODE-04-01..04-05) — completes the foundation-to-agents arc (ARC-00..04).
- Basic Retrieval (NODE-05-01) + Basic Evals (NODE-07-01) lesson entry-points (advanced labs are PHASE_6).
- 20 lessons total; contiguous unlockable chain NODE-00-01 → 04-05; all 7 PH-602 topic arcs covered.

WHY:
- Closes PH-601 (complete foundation-to-agents arc) and PH-602 (required topic arcs). PH-605 coherent.

QA:
- build green (152 modules); `npm test` 54 passed — lesson integrity + render tests iterate the registry,
  validating all 20 lessons (node/prereq refs, best-option present, full 6-part feedback, mode coverage).

RISKS:
- Deeper arcs (Memory/Security/Repo/advanced Retrieval+Eval) not yet authored.
- Lesson visuals human-unverified (OQ-0005). RAG/Eval labs (Retrieval Factory, Eval Designer) are PHASE_6.

NEXT:
- PHASE_5 cont. or PHASE_6: deeper-arc lessons + advanced labs; then review/spacing (PHASE_7).

### FL-0014 — Memory & Long-Running Work arc (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-601, PC-030, PC-035
FILES:
- `src/content/lessons/{sessionVsProjectMemory,decisionLogsLedgers,agentLearningLoops,longRunningProjects}.ts`
- `src/features/lessons/lessonModes.ts` (mode-label registry extended to all LessonMode values)
- `src/content/lessons/index.ts` (registry → 24 lessons)

CHANGED:
- ARC-06 lessons (NODE-06-01..06-04): session vs project memory, decision logs/ledgers, agent learning
  loops, long-running control plane — the discipline this app itself embodies (source_material system).
- lessonModes registry now labels every mode (worked-example, architecture-builder, postmortem, …).

WHY:
- Extends curriculum into Memory/repo-systems; reinforces durable-state architecture (CONCEPT-MEM-*/REPO-004).

QA:
- build green (156 modules); `npm test` 54 passed (lesson integrity + render auto-cover the 4 new lessons).

RISKS:
- Repo Refactor lab (consumed by this arc) is PHASE_6 — not yet built; node cards show "Lab folgt".

NEXT:
- Observability/Security/Repo lessons, or PHASE_6 advanced labs (Retrieval Factory, Eval Designer, …).

### FL-0015 — Security & Governance arc (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-601, PC-021, PC-030
FILES:
- `src/content/lessons/{leastPrivilege,humanApprovalGates,promptInjection,sandboxingGovernance}.ts`
- `src/content/lessons/index.ts` (registry → 28 lessons)

CHANGED:
- ARC-08 lessons (NODE-08-01..08-04): Least Privilege (task-first), Human Approval Gates (task-first),
  Prompt Injection (incident-first; injection trace), Sandboxing & Governance (multiple-viewpoints).
- Reinforces security as a first-class architecture concern (PC-021); connects to Tool Contract Forge +
  the (PHASE_6) Security Incident Room lab.

QA:
- build green (160 modules); `npm test` 54 passed (lesson integrity + render auto-cover the 4 new lessons).

RISKS:
- Security Incident Room lab (consumed here) is PHASE_6 — node cards show "Lab folgt".

NEXT:
- Observability/Postmortem (07-02..07-04) + Repo arc (09-*) lessons, or PHASE_6 advanced labs.

### FL-0016 — Deeper Retrieval arc (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-603, PC-021, PC-030, PC-034
FILES:
- `src/content/lessons/{lexicalVsSemanticRetrieval,hybridSearchReranking,contextualRetrieval}.ts`
- `src/content/lessons/index.ts` (registry → 31 lessons)

CHANGED:
- ARC-05 deeper-retrieval lessons (NODE-05-02..05-04): Lexical vs Semantic (task-first; decisionPair),
  Hybrid Search & Reranking (worked-trace; two-stage flow), Contextual Retrieval (task-first; flow).
- Replaces the manual-complete placeholders for those nodes; closes the chain gap between RAG Basics
  (05-01) and Memory arc (06-01). Each reuses FB-PATTERN-RETRIEVAL-MISMATCH (no new pattern).

WHY:
- Fills the earliest curriculum gap in prerequisite order (PC-034); makes retrieval a real decision arc
  that later Grounding-Eval (07-03) and Prompt-Injection (08-03) lessons depend on.

QA:
- build green (163 modules); `npm test` 54 passed (lesson integrity + render auto-cover the 3 new lessons).

RISKS:
- NODE-05-05 (Visual Document Retrieval / ColPali) deferred to PHASE_6 as advanced paper-visual (OQ-0008);
  node still uses the manual-complete placeholder until then.
- Retrieval Factory lab (referenced by these lessons) is PHASE_6 — node cards show the lab as a future entry.

NEXT:
- Evals/Observability deep (07-02..07-04) + Repo arc (09-*) lessons, or PHASE_6 advanced labs.

### FL-0017 — Evals & Observability arc (PHASE_5)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-603, PC-021, PC-030, PC-034
FILES:
- `src/content/lessons/{taskSuccessRegression,groundingEvaluation,tracesPostmortems}.ts`
- `src/content/lessons/index.ts` (registry → 34 lessons)

CHANGED:
- ARC-07 deep lessons (NODE-07-02..07-04): Task Success & Regression (task-first; flow), Grounding
  Evaluation (worked-trace; flow), Traces & Postmortems (trace-first; TraceTimeline primitive with
  failure_origin→symptom). Completes the Evals/Observability arc on top of Eval Harness (07-01).
- First lesson use of the `trace` LessonVisual (07-04). Two new feedback patterns:
  FB-PATTERN-NO-REGRESSION-SET, FB-PATTERN-UNGROUNDED-CLAIM; 07-04 reuses FB-PATTERN-NO-OBSERVABILITY.
- Threads reviewHooks across arcs: 07-03 resolves `grounding_eval_transfer` (seeded by ragBasics 05-01 /
  hybridSearchReranking 05-03); 07-04 loops back to agentLearningLoops (06-03): incident → durable rule.

WHY:
- Makes measurement + observability real decision arcs (PC-021): regression safety, grounding vs fluency,
  and trace-to-root-cause → postmortem. Prereqs for the capstone eval/governance stages (PH-901).

QA:
- build green (166 modules); `npm test` 54 passed (lesson integrity + render auto-cover the 3 new lessons,
  including the trace visual).

RISKS:
- Eval Designer + System Postmortem labs (referenced here) are PHASE_6 — node cards show them as future entries.

NEXT:
- Repo arc (NODE-09-01..09-04) lessons closes PHASE_5 curriculum; or start PHASE_6 advanced labs.

### FL-0018 — Repo & Conventions arc (PHASE_5; closes curriculum chain)

STATUS: implemented
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
RULE_REFS: PH-603, PH-605, PC-021, PC-030, BP-001, BP-006, BP-007
FILES:
- `src/content/lessons/{repoLegibility,conventionsSmallComponents,sourceMaterialOs,teamScale}.ts`
- `src/content/lessons/index.ts` (registry → 38 lessons; header comment updated to ARC-00..09)

CHANGED:
- ARC-09 lessons (NODE-09-01..09-04): Repo Legibility (task-first; decisionPair), Conventions & Small
  Components (refactor-first; decisionPair), Source Material OS (worked-example; flow), Team Scale
  (multiple-viewpoints; systemRow with human/agent/repo nodes).
- Closes the contiguous unlockable chain ARC-00..ARC-09 (38 lessons). The arc teaches the discipline this
  codebase itself embodies (feature-folders, small files, the source_material control plane).
- Kept distinct from earlier reuse of the same concepts: 09-03 (REPO-004) covers the doc-OS *operating
  protocol* + conflict-by-priority vs 06-04's *structure/duplication*; 09-04 (PROD-003) covers *team
  ownership / maintainability* vs 08-04's *security sandbox/governance*.
- New feedback patterns: FB-PATTERN-ILLEGIBLE-REPO, FB-PATTERN-MONSTER-FILE, FB-PATTERN-LOST-CONSTRAINTS,
  FB-PATTERN-UNCLEAR-OWNERSHIP.

WHY:
- Completes PHASE_5 curriculum (PH-605): every node ARC-00..09 maps to a PC-030 coverage-matrix row.
  Repo conventions + source-material OS are prerequisites for the capstone's maintainability/governance.

QA:
- build green (170 modules); `npm test` 54 passed (lesson integrity + render auto-cover the 4 new lessons).

RISKS:
- Repo Refactor / Architecture Builder labs referenced here: Architecture Builder exists; Repo Refactor is
  PHASE_6 (node cards show it as a future entry).
- NODE-05-05 still deferred (OQ-0008); ARC-10 capstone is PHASE_8.

NEXT:
- PHASE_5 curriculum complete. Start PHASE_6 advanced labs (Retrieval Factory, Eval Designer, Repo Refactor,
  Security Incident Room, Paper Figure Decoder + NODE-05-05) — one engine at a time — OR PHASE_7 review/spacing.

### FL-0019 — Retrieval Factory lab (PHASE_6, first advanced engine)

STATUS: implemented
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS
RULE_REFS: PH-701, PH-705, PH-503, PH-505, PC-032, BP-009, BP-031
FILES:
- `src/features/labs/retrievalFactory/{types,scoring,feedbacks}.ts`
- `src/features/labs/retrievalFactory/{RetrievalFactory.tsx,entry.tsx}`
- `src/content/labs/retrievalFactoryScenarios.ts` (base + transfer)
- `src/features/labs/interactionRegistry.ts` (registered → 6 engines)
- `tests/interactions.test.ts` (+Retrieval Factory scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- New interaction engine built to the existing framework (copied failureModeTree/* shape): pure scoring
  (3 dimensions: method_fit / reranking_fit / context_fit), FB-pattern feedback, tap-to-select stations
  (no drag, mobile rule), reveal-after-evaluate, ScoreMeter + FeedbackCard result.
- The learner configures a retrieval pipeline (method · reranking · contextual chunking) to fit a corpus/
  query profile. Base profile makes the SIMPLE pipeline correct (semantic, no rerank, no contextual);
  transfer (code+logs) makes the FULL pipeline correct — teaches a fit decision, not "always add more" (PH-705).
- Node cards for NODE-05-01..05-04 now resolve a working lab instead of the "Lab folgt" placeholder.

WHY:
- First PHASE_6 advanced lab (PH-701). Turns the retrieval lessons (05-01..05-04) into a tactical decision:
  build the simplest retrieval architecture the profile actually requires (PC-032).

QA:
- build green (175 modules); `npm test` 59 passed (interactions 22 incl. 4 new RF scoring tests; labRender 8
  incl. RF render+evaluate smoke). Engine reuses logged primitives (DecisionCard/ScoreMeter); no /visual-lab
  entry per OQ-0006 (interaction previews deferred — covered by render-smoke + real lab route). VR-0001 graph
  risk N/A here (deterministic stacked cards).

RISKS:
- Pixel/mobile layout still human-unverified (OQ-0005). 4 advanced labs remain (Eval Designer, Repo Refactor,
  Security Incident Room, Paper Figure Decoder + NODE-05-05).

NEXT:
- Next PHASE_6 engine — recommend Eval Designer (NODE-07-01..07-03 reference it) — one at a time; bundle
  NODE-05-05 with Paper Figure Decoder. Or PHASE_7 review/spacing.

### FL-0020 — Eval Designer lab + shared station-config core (PHASE_6)

STATUS: implemented
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS
RULE_REFS: PH-701, PH-705, BP-009, QG-024, CTX-066, CW-043, DEC-0010
FILES:
- `src/features/labs/stationConfig/{types.ts,scoreStations.ts,StationConfigBoard.tsx}` (NEW shared core)
- `src/features/labs/retrievalFactory/{types,scoring}.ts + RetrievalFactory.tsx` (REFACTORED onto core)
- `src/features/labs/evalDesigner/{types,scoring,feedbacks}.ts + EvalDesigner.tsx + entry.tsx`
- `src/content/labs/evalDesignerScenarios.ts` (base + transfer)
- `src/features/labs/interactionRegistry.ts` (registered → 7 engines)
- `tests/interactions.test.ts` (+Eval Designer scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Extracted a shared "station configuration" engine (DEC-0010): pure `scoreStations` best-fit scorer +
  `StationConfigBoard` (single-select, reveal-after-evaluate, ScoreMeter + FeedbackCard). Refactored
  Retrieval Factory onto it with its public API unchanged (existing RF tests stayed green = regression net).
- New Eval Designer engine as a thin binding: design an eval harness for a system across 3 stations —
  success metric (task-success vs format-only), regression (regression-set vs spot-check), grounding.
  4 FB patterns (FB-ED-*). Node cards for NODE-04-04 / 07-01 / 07-02 / 07-03 now resolve a working lab.
- Pedagogy (PH-705): success + regression are always the rigorous choice (format-only/spot-check are real
  traps); the grounding station carries the fit decision — base (a classifier, no sources) correctly SKIPS
  grounding, transfer (a RAG assistant) REQUIRES it. Teaches fit, not "measure everything".

WHY:
- Second PHASE_6 advanced lab (PH-701); turns the eval lessons (07-01..07-03) into a design decision.
  Extracting the shared core satisfies QG-024/CTX-066 before adding the duplicate (CW-043).

QA:
- build green (182 modules); `npm test` 64 passed (interactions 26 incl. 4 new ED scoring tests that assert
  base-skips-grounding vs transfer-requires-grounding; labRender 9 incl. ED render+evaluate smoke). RF tests
  unchanged and green → refactor preserved behaviour. Reuses logged primitives; no /visual-lab entry (OQ-0006).

RISKS:
- Pixel/mobile layout still human-unverified (OQ-0005). 3 advanced labs remain (Repo Refactor, Security
  Incident Room, Paper Figure Decoder + NODE-05-05) — different interaction shapes, stay standalone.

NEXT:
- Next PHASE_6 engine — Repo Refactor or Security Incident Room — one at a time; bundle NODE-05-05 with
  Paper Figure Decoder. Or PHASE_7 review/spacing.

### FL-0021 — Security Incident Room lab (PHASE_6)

STATUS: implemented
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS
RULE_REFS: PH-701, PH-705, BP-009, DEC-0010, PC-021
FILES:
- `src/features/labs/securityIncidentRoom/{types,scoring,feedbacks}.ts + SecurityIncidentRoom.tsx + entry.tsx`
- `src/content/labs/securityIncidentScenarios.ts` (base + transfer)
- `src/features/labs/interactionRegistry.ts` (registered → 8 engines)
- `tests/interactions.test.ts` (+SIR scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Third PHASE_6 advanced lab, built by REUSING the shared station-config core (DEC-0010) — incident triage
  fits three coupled single-select decisions, so no new board/scoring: just types + feedbacks + a thin
  wrapper. The core now serves 3 labs (Retrieval Factory, Eval Designer, Security Incident Room).
- Interaction: triage a security incident across vector → containment → durable control. 4 FB patterns
  (FB-SIR-*). Node cards for NODE-08-01..08-04 (+ capstone NODE-10-03) now resolve a working lab.
- Pedagogy (PH-705): base = over-broad permission + missing approval (SEC-001/002, NODE-08-01); transfer =
  prompt injection (SEC-003/001, NODE-08-03). Different vector → different correct containment + control,
  so the learner must read the trace, not pattern-match one fixed answer.

WHY:
- Turns the security arc (08-01..04) into incident response: identify the exploited vector, stop the damage,
  then convert the incident into a durable architectural control (incident → system change, not anecdote).

QA:
- build green (187 modules); `npm test` 69 passed (interactions 30 incl. 4 new SIR scoring tests that assert
  base-permission vs transfer-injection need different responses; labRender 10 incl. SIR render+evaluate smoke).
  Reuses logged primitives + the shared board; no /visual-lab entry (OQ-0006).

RISKS:
- Pixel/mobile layout still human-unverified (OQ-0005). 2 advanced labs remain: Repo Refactor, Paper Figure
  Decoder (+ NODE-05-05) — different interaction shapes, build standalone.

NEXT:
- Next PHASE_6 engine — Repo Refactor (NODE-06-*/09-* reference it) or Paper Figure Decoder (bundle NODE-05-05).
  Or PHASE_7 review/spacing.

### FL-0022 — Repo Refactor lab (PHASE_6)

STATUS: implemented
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS
RULE_REFS: PH-701, PH-705, BP-009, DEC-0010, PC-021, BP-006, BP-007
FILES:
- `src/features/labs/repoRefactor/{types,scoring,feedbacks}.ts + RepoRefactor.tsx + entry.tsx`
- `src/content/labs/repoRefactorScenarios.ts` (base + transfer)
- `src/features/labs/interactionRegistry.ts` (registered → 9 engines)
- `tests/interactions.test.ts` (+Repo Refactor scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Fourth PHASE_6 advanced lab, REUSING the shared station-config core (DEC-0010) — per-problem refactor
  decisions fit single-select stations. Checked Architecture Builder first (multi-select capability scoring)
  to avoid cloning it (QG-024); repo refactor is a different, per-issue decision, so stationConfig fits.
  Core now serves 4 labs (Retrieval Factory, Eval Designer, Security Incident Room, Repo Refactor).
- Interaction: fix 3 repo problems (durable state · small components · legibility), each as root-cause fix
  vs symptom patch vs over-engineering. 4 FB patterns (FB-RR-*). Node cards NODE-06-01..04 / 09-01..03 now
  resolve a working lab.
- Pedagogy (PH-705): base = a project losing durable state (06-arc, NODE-06-01 → decision-log); transfer =
  an illegible repo (09-arc, NODE-09-01 → owner-doc consolidation). Same dimensions, different right move
  per problem — so the durable-state fix differs (write a log vs consolidate to an owner-doc).

WHY:
- Turns the memory + repo arcs (06-*/09-*) into a maintainability decision: fix the cause on its layer
  (durable docs, small units, legible structure) — the discipline this codebase itself embodies (BP-001).

QA:
- build green (192 modules); `npm test` 74 passed (interactions 34 incl. 4 new RR scoring tests asserting
  base-decision-log vs transfer-owner-doc differ; labRender 11 incl. RR render+evaluate smoke). Reuses the
  shared board + logged primitives; no /visual-lab entry (OQ-0006).

RISKS:
- Pixel/mobile layout still human-unverified (OQ-0005). 1 advanced lab remains: Paper Figure Decoder
  (+ NODE-05-05) — a different interaction shape, build standalone.

NEXT:
- Last PHASE_6 engine: Paper Figure Decoder (NODE-05-05) — bundle with the deferred NODE-05-05 lesson
  (OQ-0008). Then PHASE_6 advanced labs complete → PHASE_7 review/spacing.

### FL-0023 — Paper Figure Decoder lab + NODE-05-05 lesson (PHASE_6 advanced labs COMPLETE)

STATUS: implemented
PHASE: PHASE_6_ADVANCED_LABS_AND_PAPER_VISUALS
RULE_REFS: PH-701, PH-702, PH-704, PH-705, BP-009, DEC-0010, NG-021
FILES:
- `src/features/labs/paperFigureDecoder/{types,scoring,feedbacks}.ts + PaperFigureDecoder.tsx + entry.tsx`
- `src/features/labs/stationConfig/StationConfigBoard.tsx` (added optional `intro` figure slot — backward-compatible)
- `src/content/labs/paperFigureScenarios.ts` (base + transfer)
- `src/content/lessons/paperVisualRetrieval.ts` (NODE-05-05) + `src/content/lessons/index.ts` (→ 39 lessons)
- `src/features/labs/interactionRegistry.ts` (registered → 10 engines)
- `tests/interactions.test.ts` (+PFD scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Fifth and FINAL PHASE_6 advanced lab (PH-701 labs complete). Reuses the shared station-config core
  (DEC-0010) with a new optional figure slot; the figure is RECREATED from ScoreMeter primitives — no copied
  paper image (PH-704), deterministic + mobile-safe. Core now serves 5 labs.
- Interaction: read a benchmark figure (what it shows + the architecture decision it supports). 3 FB patterns
  (FB-PFD-*). Node card NODE-05-05 now resolves a working lab.
- Pedagogy (PH-705/NG-021): base figure = page-image retrieval beats text/OCR on visually-rich docs → use it
  there; transfer figure = on plain text it gives no gain and costs more → keep text retrieval. Teaches a
  CONDITIONAL decision, not "frontier method = always better".
- Authored the deferred NODE-05-05 lesson (Visual Document Retrieval, ColPali-sourced RET-008/009) →
  ARC-05 fully lesson-covered (39 lessons); resolves OQ-0008. Lesson points into the Paper Figure Decoder lab.

WHY:
- Completes PHASE_6 advanced labs (PH-701) and the paper-visual requirement via a recreated figure (PH-702).
  Frontier topic tied to a concrete, conditional decision (the deferral condition in OQ-0008 is now satisfied).

QA:
- build green (198 modules); `npm test` 79 passed (interactions 38 incl. 4 new PFD scoring tests asserting
  visual-rich-vs-plain-text figures need different readings; labRender 12 incl. PFD render+evaluate smoke;
  lesson integrity + render auto-cover NODE-05-05). The `intro` slot change is backward-compatible (other 4
  config labs pass no intro → render unchanged, their tests stayed green).

RISKS:
- Pixel/mobile layout still human-unverified (OQ-0005). PHASE_6 advanced labs done; remaining product work is
  PHASE_7 (review/spacing), PHASE_8 (capstone, ARC-10), PHASE_9 (hardening).

NEXT:
- PHASE_7 review/spacing: a spaced-review queue + concept-mastery state from completed nodes' reviewHooks
  (the reviewHooks already authored across lessons/labs are the seed). Then PHASE_8 capstone.

### FL-0024 — Review & mastery surface (PHASE_7 first slice)

STATUS: implemented
PHASE: PHASE_7_REVIEW_SPACING_AND_MASTERY_SYSTEM
RULE_REFS: PH-800, PH-801, PH-802, PH-803, PH-804, DEC-0011, QG-070
FILES:
- `src/features/review/reviewModel.ts` (pure projection) + `src/features/review/ReviewPage.tsx`
- `src/routes/paths.ts` + `src/routes/router.tsx` (`/review` route) + `src/components/layout/BottomNav.tsx` (nav)
- `tests/reviewModel.test.ts` (7 pure tests) + `tests/reviewRender.test.tsx` (page smoke)

CHANGED:
- `buildReviewState(progress, deps, now)` projects ProgressState into: mastery per completed node
  (introduced / practiced / needs_repair from lab score + weakSignals), a due-ordered spaced queue
  (age in days + a repair bonus), repair missions (nodes with weak lab signals), recurring themes
  (reviewHooks shared by 2+ completed nodes), and a mastery summary. Pure + deterministic (DEC-0011).
- ReviewPage renders the recap (ScoreMeter mastery), repair missions, the spaced queue, and recurring
  themes — each card links back to the bound lab/lesson to revisit. Empty state for fresh progress.
- New top-level `/review` surface in the bottom nav (roadmap-first preserved; Review is a recap surface).

WHY:
- PH-801/PH-802: spaced review, mastery state, weak-area detection, transfer resurfacing (themes + revisit
  links), roadmap recap, progress insights — WITHOUT XP/streaks/badges (PH-803). Mastery reflects demonstrated
  work only. Realizes the seeds already authored (reviewHooks on lessons/labs, persisted lab weakSignals).

QA:
- build green (200 modules); `npm test` 87 passed (+8: 7 reviewModel unit tests covering mastery
  classification, due ordering, repairs, themes, summary, empty state; 1 ReviewPage empty-state smoke).
  No new persistence — review is recomputed from ProgressState (QG-070).

RISKS:
- Spacing is age-based, not a full SM-2 schedule (sufficient for PH-801/PH-804). Pixel/mobile layout of the
  Review page human-unverified (OQ-0005). PH-804 met via themes + revisit links; could deepen by resurfacing
  an actual transfer task (re-run a lab scenario) rather than a link.

NEXT:
- Optional PHASE_7 deepening (interactive transfer resurfacing) OR proceed to PHASE_8 capstone (ARC-10,
  NODE-10-01..05): a multi-stage architecture challenge integrating context/tool/retrieval/eval/security/repo.

### FL-0025 — Interactive transfer resurfacing (PHASE_7 deepening)

STATUS: implemented
PHASE: PHASE_7_REVIEW_SPACING_AND_MASTERY_SYSTEM
RULE_REFS: PH-801, PH-804, DEC-0011, BP-009, QG-047
FILES:
- `src/features/review/reviewMission.ts` (findMission/hasMission — node → re-runnable task)
- `src/features/review/ReviewRunPage.tsx` (review-mission host) + `/review/:nodeId` route (paths/router)
- `src/features/review/ReviewPage.tsx` (cards now link to a Review-Mission, MissionLink)
- `tests/reviewMission.test.ts` (4) + `tests/reviewRender.test.tsx` (+ReviewRunPage smoke)

CHANGED:
- The review queue now resurfaces an ACTUAL tactical task instead of a plain link (PH-804). `findMission`
  maps a completed node to its lab engine and picks the TRANSFER scenario (the changed-context variant) when
  available, else the base. `ReviewRunPage` renders that scenario via the existing interaction registry and,
  on completion, persists the re-attempt through `completeLab` (best score + fresh weakSignals) — so the
  mastery projection refreshes and a cleared repair flips needs_repair → practiced.
- ReviewPage repair/queue cards now show "Review-Mission (Transfer) starten" when a mission exists, falling
  back to the lesson/lab link otherwise (lesson-only nodes, or labs with no engine).

WHY:
- Strengthens PH-801 "transfer task resurfacing" + the PH-804 exit gate ("completed concepts reappear later
  in new contexts") — the idea genuinely re-appears as a scored task in a new context, not just a link.
  Reuses the lab engines + completeLab (no new persistence; DEC-0011 projection unchanged).

QA:
- build green (202 modules); `npm test` 92 passed (+5: 4 findMission tests — resolves FMT/RF transfer
  scenarios, returns undefined for engine-less labs (layer-stack-builder) + unknown nodes; 1 ReviewRunPage
  smoke re-running NODE-00-01's transfer scenario in review framing).

RISKS:
- Re-running a node's lab does not distinguish "review attempt" from a first attempt in storage (both via
  completeLab → best score). Acceptable: mastery tracks the best demonstrated result. Pixel QA pending (OQ-0005).

NEXT:
- PHASE_7 substantively complete (PH-801/802/803/804). Proceed to PHASE_8 capstone (ARC-10, NODE-10-01..05):
  multi-stage architecture challenge integrating prior arcs + postmortem + improvement loop (PH-900..904).

### FL-0026 — Capstone Simulator + briefing (PHASE_8 first slice)

STATUS: implemented
PHASE: PHASE_8_CAPSTONE_SYSTEM
RULE_REFS: PH-900, PH-901, PH-902, PH-903, PC-040, PC-041, PC-042, DEC-0010
FILES:
- `src/features/labs/capstoneSimulator/{types,scoring,feedbacks}.ts + CapstoneSimulator.tsx + entry.tsx`
- `src/content/labs/capstoneScenarios.ts` (base + transfer) + `interactionRegistry.ts` (→ 11 engines)
- `src/content/lessons/capstoneBriefing.ts` (NODE-10-01) + `src/content/lessons/index.ts` (→ 40 lessons)
- `tests/interactions.test.ts` (+Capstone scoring) + `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Capstone Simulator engine: the integrated architecture draft (NODE-10-02). Reuses the shared station-config
  core (DEC-0010, 6th config lab) with 6 stations — one per system layer (context / tools / retrieval / eval /
  security / repo). The learner designs them TOGETHER (INT-CAPSTONE-SIMULATOR "design integrated system",
  PC-040/041). 7 FB patterns (FB-CAP-*); eval + security gaps are `critical` (PH-903 forbids ignoring
  observability/maintainability/security).
- NODE-10-01 Capstone Briefing lesson (scenario-first): frames the capstone question (PC-042) and references
  every prior arc via a layerStack of integrated layers (PH-903 "must reference earlier dependencies").
- Pedagogy (PH-902): base = a large AI-native dev-team system (the full rigorous architecture is correct);
  transfer = an early prototype where retrieval is premature (no corpus) — fit the architecture to the stage
  (PC-032), while eval/security/repo stay rigorous in both (cannot be skipped).

WHY:
- Opens PHASE_8 (PH-900/901): a single task that exercises every arc at once → proves integrated architecture
  intuition (PH-904). Failure injection (10-03), eval/governance (10-04) and final defence (10-05) follow.

QA:
- build green (208 modules); `npm test` 97 passed (interactions +4: full integrated design = 1.0; eval='none'
  and security='trust' are critical gaps; prototype transfer drops retrieval but base architecture no longer
  fits it; labRender +1: 6-station render+evaluate smoke). Lesson integrity + render auto-cover NODE-10-01.

RISKS:
- Remaining ARC-10 nodes (10-03 failure injection, 10-04 eval & governance, 10-05 final review) not yet built;
  those reuse Security Incident Room / Agent Trace / Eval Designer / Capstone Simulator (postmortem). Pixel QA
  pending (OQ-0005). 6-station capstone is longer on mobile (still deterministic stacked cards).

NEXT:
- Build the rest of ARC-10 one node at a time: 10-03 failure-injection scenario (reuse securityIncidentRoom +
  agentTraceDebugger), 10-04 eval & governance (reuse evalDesigner), 10-05 final review (capstone postmortem
  scenario + lesson). Then PHASE_9 hardening/release.

### FL-0027 — Capstone arc complete (ARC-10 lessons 10-03..10-05)

STATUS: implemented
PHASE: PHASE_8_CAPSTONE_SYSTEM
RULE_REFS: PH-901, PH-902, PH-903, PH-904, PC-040, PC-041, PC-042
FILES:
- `src/content/lessons/{capstoneFailureInjection,capstoneEvalGovernance,capstoneFinalReview}.ts`
- `src/content/lessons/index.ts` (→ 43 lessons; full graph NODE-00-01..10-05 lessoned)

CHANGED:
- ARC-10 stages 10-03..10-05, each threading the SAME system the learner designed (10-02):
  · 10-03 Capstone Failure Injection (incident-first; trace primitive) — a fault is injected (untrusted
    retrieval → followed injected instruction → destructive tool action); the integrated fix spans retrieval
    isolation + tool least-privilege/approval, not a prompt patch (PH-902 "robust under failure injection").
  · 10-04 Capstone Eval & Governance (eval-first; flow) — make reliability measurable + control explicit:
    incident as a regression case + task-success + grounding, plus approval-governance for high-impact.
  · 10-05 Final System Review (postmortem; layerStack of per-layer trade-off + mitigation) — defend the
    architecture with explicit trade-offs and known failure modes, not a perfection/autonomy claim (PH-903).
- Each lesson completes its node (consistent with the curriculum; LabPage resolves labs by labId, so reusing
  an engine for a different node can't bind a node-specific scenario) and points to the bound lab for practice.

WHY:
- Completes the capstone arc (ARC-10) and the whole curriculum: every node NODE-00-01..10-05 is lesson-covered.
  The arc integrates all prior arcs across design → failure → measurement/governance → defence (PH-901/904);
  multiple interaction types across the arc (config simulator + incident + eval + postmortem, PH-902).

QA:
- build green (211 modules); `npm test` 97 passed (lesson integrity + render auto-cover the 3 new lessons,
  including the trace/flow/layerStack visuals). All 43 lessons render; full node/prereq graph resolves.

RISKS:
- Capstone is realized as the ARC-10 lessons + the Capstone Simulator (10-02) + bound practice labs; there is
  no separate "staged mission board" UI beyond the simulator (the spec's richer dashboard is optional polish).
- Pixel/mobile QA pending (OQ-0005); npm audit (OQ-0004); secondary "Lab folgt" bindings (OQ-0009).

NEXT:
- PHASE_8 complete (PH-901..904). PHASE_9 hardening/release (PH-1000): full visual/mobile QA pass (OQ-0005),
  progress-persistence + roadmap-completion QA, dead-route cleanup (OQ-0009), npm audit (OQ-0004), final build,
  deployment readiness.

### FL-0028 — Hardening: coverage/completion QA + audit triage (PHASE_9 first slice)

STATUS: implemented
PHASE: PHASE_9_HARDENING_AND_RELEASE
RULE_REFS: PH-1000, PH-1001, QG-010, OQ-0004
FILES:
- `tests/coverage.test.ts` (NEW — 4 tests)

CHANGED:
- Added durable curriculum/roadmap hardening tests (PH-1001 content coverage review + roadmap completion QA):
  · every roadmap node is completable via a lesson OR a bound lab scenario (locks in full V1 coverage; caught
    that NODE-10-02 is intentionally lab-first — the Capstone Simulator is its task, no separate lesson);
  · every node's lab binding references a real catalog lab (no dangling refs);
  · the full 44-node unlock graph is traversable end-to-end (complete the first actionable node repeatedly →
    all nodes drain; an orphan/broken prerequisite would stall the loop);
  · exactly one entry node (single root) on empty progress.
- npm audit triaged (OQ-0004): 5 high advisories, all in the esbuild→vite→vitest build/test toolchain
  (Deno-module RCE + Windows dev-server file read), none in the deployed runtime bundle. Accepted for V1;
  `--force` (→ vite@8 breaking) rejected during hardening; revisit on the next Vite major. OQ-0004 → triaged.
- Deployment-readiness check: dist/ builds clean (index.html + assets + manifest + SW/workbox + favicon);
  Vercel-ready (default root base, SPA). Fixed a PWA manifest/html lang mismatch (manifest defaulted to `en`;
  app content + index.html are `de`, PC-035) → added `lang: 'de'` to the VitePWA manifest (`vite.config.ts`).
  Finding: pwa-192/512 PNGs are 70-byte placeholders — real icon assets needed before release (design task).

WHY:
- PHASE_9 hardening: lock the finished curriculum + unlock graph against regressions, and resolve the audit
  question without a risky breaking upgrade. Pure additive tests (PH-1003: no new systems).

QA:
- build green (211 modules); `npm test` 101 passed (+4 coverage/completion tests).

RISKS:
- OQ-0009 (4 engine-less secondary lab bindings showing "Lab folgt") still open — a build-vs-remove UX/scope
  decision deferred (removing touches node data + the LabPage "Lab folgt" test). OQ-0005 human pixel/mobile QA
  is the user's step (AI cannot see pixels). PWA icons are placeholders.

NEXT:
- Remaining PHASE_9: OQ-0009 decision (build the 4 small labs vs remove the bindings), human pixel/mobile QA
  pass (OQ-0005), PWA icon assets, deployment readiness check. Exit gate PH-1004: deployable + coherent.

### FL-0029 — 4 secondary labs (OQ-0009) + PWA game icon (PHASE_9)

STATUS: implemented
PHASE: PHASE_9_HARDENING_AND_RELEASE
RULE_REFS: PH-701, PH-705, BP-009, DEC-0010, OQ-0009, PC-060
FILES:
- `src/features/labs/{layerStackBuilder,tradeOffDuel,constraintPuzzle,systemPostmortem}/*` (4 engines)
- `src/content/labs/{layerStack,tradeOff,constraint,systemPostmortem}Scenarios.ts`
- `src/features/labs/interactionRegistry.ts` (→ 15 engines)
- `tests/interactions.test.ts` (+4 scoring), `tests/labRender.test.tsx` (+4 render smokes, −obsolete placeholder),
  `tests/coverage.test.ts` (+every-catalog-lab-has-an-engine), `tests/reviewMission.test.ts` (updated)
- `public/icon.svg` (NEW); `vite.config.ts` + `index.html` (icon wiring); removed favicon.svg + placeholder PNGs

CHANGED:
- Built the 4 remaining cataloged labs on the shared stationConfig core (DEC-0010), resolving OQ-0009 — every
  node lab binding now opens a working lab (no "Lab folgt" left):
  · Layer Stack Builder (00-02/01-03) — classify each failure to its ORIGIN layer (Iceberg / System Layers).
  · Trade-off Duel (01-02/04-01) — pick the fitting architecture; base = simple/workflow, transfer = agent +
    bigger model for an open/high-accuracy task (fit, not "always simplest").
  · Constraint Puzzle (03-02/03-03) — enforce a schema; transfer = constrain format not meaning (too-strict trap).
  · System Postmortem (07-04) — trace → root cause → durable rule, not a one-off patch.
  Each: base + transfer, pure scoring, FB patterns (FB-LSB/TOD/CP/SPM-*). 15 engines total; stationConfig serves 10.
- PWA/app icon: a low-poly faceted crystal (cyan-on-dark, deck theme, PC-060), full-bleed rounded tile,
  maskable-safe. Wired into the manifest (svg, `any maskable`, lang `de`) + favicon; removed the 70-byte
  placeholder PNGs and old favicon. Deployed dist/ ships a real scalable icon.
- Removed the now-obsolete labRender "Lab folgt" test (no engine-less catalog lab exists); added a coverage
  assertion that every catalog lab resolves an engine.

WHY:
- Closes OQ-0009 with the higher-value option (more tactical practice for early/ARC-03/ARC-07 nodes) and gives
  V1 a real app icon. Reuse kept each lab a thin config (BP-009).

QA:
- build green (231 modules); `npm test` 109 passed (+8 net: 4 scoring + 4 render smokes + coverage assertion,
  − removed/updated obsolete tests). Manifest verified (icon.svg, maskable, lang de); dist/ ships icon.svg.

RISKS:
- Icon look is human-unverified at pixel level (sent to user to confirm). Human pixel/mobile QA of the
  screens (OQ-0005) still the user's step.

NEXT:
- PHASE_9 remaining: human pixel/mobile QA pass (OQ-0005); then deployment. Exit gate PH-1004.

### FL-0030 — Learning redesign Slice 1: concise feedback + Allocator mechanic (DEC-0012)

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-060)
RULE_REFS: DEC-0012, LR-014/015/030/040/051/060, DEC-0010, NG-034
FILES:
- `src/types/feedback.ts` (detail fields → optional, + `summary`); `src/features/lessons/FeedbackCard.tsx` (concise)
- `src/features/labs/contextAllocator/*` (types, scoring, feedbacks, AllocatorBoard, entry) + scenarios
- `src/content/labs/contextAllocatorScenarios.ts`; `labs.ts` + `nodes.ts` (LAB-CONTEXT-ALLOCATOR → NODE-02-01)
- `src/types/lesson.ts` (+'context-allocator'); `interactionRegistry.ts` (→ 16 engines)
- `src/content/lessons/contextWindowBudget.ts` (NODE-02-01 rebuilt: concise framing, no easy decision)
- `tests/interactions.test.ts` (+Allocator scoring), `tests/labRender.test.tsx` (+smoke), `tests/lessons.test.ts` (relaxed)

CHANGED:
- (1) GLOBAL: FeedbackCard now renders a severity chip + a one-line takeaway (summary ?? consequence) +
  the rule — no six-part wall (LR-040). Feedback detail fields relaxed to optional (backward-compatible;
  all authored feedback still has them). Fixes every feedback in the app at once.
- (2) MECH-ALLOCATE — the flagship mechanic: distribute a finite budget across categories with sliders
  (mobile direct-manipulation) + a live split bar. GRADED scoring (LR-030): score = 1 − total-variation-
  distance to the ideal split, capped at 0.5 by hard min/max violations; "direction matters", no single
  right answer. Feedback is DERIVED — the worst deviation names the trade-off ("alter Verlauf verdrängt
  Constraints — das Signal ertrinkt"). Reveals your-share vs target after evaluation.
- (3) NODE-02-01 rebuilt as the reference template: concise concept framing in the lesson, the real
  challenge in the bound Allocator (replaces the guessable "drop constraints vs drop history" decision).

WHY:
- First slice of the strategy-game redesign (DEC-0012): proves the graded "direction not correctness"
  scoring, the concise-feedback fix (global), and the situation-first pattern on one node, for the user to play.

QA:
- build green (237 modules); `npm test` 115 passed (+6: 5 Allocator scoring tests — ideal=1.0, near-ideal
  rewarded, drowning=critical-capped, starving a must-keep caught, empty prompts; 1 render+evaluate smoke).
  lessons.test relaxed: lessons may delegate the challenge to a bound lab (LR-051); decisions validated where present.

RISKS:
- Slider/mobile feel + the new feedback length are human-unverified (user is testing live). The old binary
  Context Budget Board still exists at NODE-02-01 alongside the Allocator (full CBB migration is later).

NEXT:
- User plays NODE-02-01 → confirm the feel. Then build the mechanic library (boundary/connect/triage/sort/
  dial/weigh) one at a time + roll situational challenges out arc by arc (LR-061), replacing micro-MCQs.

### FL-0031 — Redesign mechanic #2: MECH-BOUNDARY (Trust Boundary Map)

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-061)
RULE_REFS: DEC-0012, LR-012/015/031, NG-034
FILES:
- `src/features/labs/trustBoundary/*` (types, scoring, feedbacks, TrustBoundaryBoard, entry) + scenarios
- `src/content/labs/trustBoundaryScenarios.ts`; `labs.ts` + `nodes.ts` (LAB-TRUST-BOUNDARY → NODE-08-04)
- `src/types/lesson.ts` (+'trust-boundary'); `interactionRegistry.ts` (→ 17 engines)
- `tests/interactions.test.ts` (+boundary scoring), `tests/labRender.test.tsx` (+render smoke)

CHANGED:
- Second strategy-game mechanic, a different modality from the Allocator's sliders: PLACE each system
  element into a trust zone (Trusted / Approval / Sandbox / Isoliert) via tap-to-zone (mobile-safe, LR-015).
  Scoring = share correctly contained, capped at 0.5 if any HIGH-risk element is left exposed (a destructive
  tool in Trusted, untrusted input not isolated). Feedback names the worst exposure. Reveals correct zones.
- Base = a dev agent (read/list trusted, delete/deploy approval, shell sandbox, web/doc isolate); transfer =
  a customer support agent (refund/export approval, ticket isolate). Bound to NODE-08-04 (design boundaries).

WHY:
- Builds the mechanic library (LR-061) and proves a second, structurally-different interaction (placement vs
  the Allocator's allocation) — the variety of task forms the redesign calls for.

QA:
- build green (242 modules); `npm test` 119 passed (+4: 3 boundary scoring — contained=1.0, exposed-high-risk
  =critical-capped, over-restricting harmless=risk-not-critical; 1 render smoke).

RISKS:
- Feel still human-unverified. STRONGLY recommend a playtest of the two new mechanics (NODE-02-01 Allocator +
  NODE-08-04 Trust Boundary) to lock the pattern BEFORE mass-producing the remaining mechanics + content.

NEXT:
- Recommended checkpoint: user playtests the 2 mechanics. Then either more mechanics (connect/triage/dial/
  sort/weigh) or begin the arc-by-arc content rollout (LR-061).

### FL-0032 — Redesign mechanics #3 + #4: MECH-TRIAGE + MECH-CONNECT

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-061)
RULE_REFS: DEC-0012, LR-012/013/015/030/031
FILES:
- `src/features/labs/incidentTriage/*` + `src/content/labs/incidentTriageScenarios.ts` (→ NODE-08-03)
- `src/features/labs/pipelineBuilder/*` + `src/content/labs/pipelineScenarios.ts` (→ NODE-05-01)
- `labs.ts` + `nodes.ts` + `types/lesson.ts` (+'incident-triage', +'pipeline-builder'); `interactionRegistry.ts` (→ 19 engines)
- `tests/interactions.test.ts` (+triage +pipeline scoring), `tests/labRender.test.tsx` (+2 smokes),
  `tests/reviewMission.test.ts` (NODE-05-01 primary lab is now Pipeline Builder)

CHANGED:
- MECH-TRIAGE (Incident Triage, NODE-08-03): order the response to a live incident with ▲/▼ (no drag).
  Graded on ORDER proximity (1 − positional displacement / max), capped at 0.5 if containment is not first.
  Base = injection response, transfer = destructive-delete response. Feedback names the worst-placed step.
- MECH-CONNECT (Pipeline Builder, NODE-05-01): assemble a pipeline — tap palette stages to add, reorder
  with ▲/▼, remove with ✕. Graded on position-match vs the ideal pipeline; a forbidden stage (fine-tuning)
  is a critical cap; missing/extra stages penalized. Base = basic RAG, transfer = code/table pipeline
  (contextual chunk + hybrid + rerank). Now the 4 mechanics cover the core verbs: allocate / place / order / build.

WHY:
- Round out a distinct-modality core library (LR-061) so the redesign demonstrates real variety of task
  forms (the user's ask) before the arc-by-arc content rollout.

QA:
- build green (252 modules); `npm test` 128 passed (+8: 3 triage + 4 pipeline scoring + 2 render smokes,
  − reviewMission updated). 19 engines; every catalog lab resolves (coverage test green).

RISKS:
- Still no user playtest (they couldn't access the app yet; dev server is healthy at localhost:5173). Building
  more mechanics or rewriting 43 lessons before feel-confirmation is the main risk — recommend playtest now.

NEXT:
- Strong recommendation: user plays the 4 new mechanics (NODE-02-01 allocate, 08-04 boundary, 08-03 triage,
  05-01 pipeline) to lock the pattern. Then remaining mechanics (dial/sort/weigh) and/or the content rollout.

### FL-0033 — Dev-only roadmap unlock (playtest convenience)

STATUS: implemented
PHASE: redesign support
RULE_REFS: PC-002, RD-201, QG-047 (preserved in prod)
FILES:
- `src/lib/devFlags.ts` (NEW: `UNLOCK_ALL = import.meta.env.DEV`)
- `src/features/roadmap/RoadmapNodeCard.tsx` (locked nodes greyed but show links in dev)
- `src/features/lessons/LessonPage.tsx` + `src/features/labs/LabPage.tsx` (skip the "Noch gesperrt" gate in dev)
- `tests/lessonRender.test.tsx` + `tests/labRender.test.tsx` (gating tests → dev-unlock behavior)

CHANGED:
- User couldn't playtest because every node is gated behind roadmap prerequisite completion. Added a single
  dev flag `UNLOCK_ALL = import.meta.env.DEV`: in `npm run dev`, locked nodes stay greyed (opacity + "Gesperrt"
  badge) but their lesson/lab links render and the Lesson/Lab pages skip the prereq block — so ANY node is
  playable. The PRODUCTION build (`import.meta.env.DEV === false`) keeps full gating (PC-002/RD-201/QG-047).
- Gating CORRECTNESS stays covered by roadmapStatus.test (pure functions); the two LessonPage/LabPage gating
  integration tests now assert the dev-unlock (content renders despite unmet prereqs), since vitest runs in DEV.

WHY:
- Unblock the user's playtest of the redesign without weakening the shipped product. Auto-reverts for release
  (tied to DEV) so it cannot accidentally ship unlocked.

QA:
- build green (253 modules; prod build has gating on); `npm test` 128 passed (dev-unlock asserted).

RISKS:
- None for prod (flag is DEV-only). If a real "preview/sandbox unlocked mode" is ever wanted in prod, promote
  the flag to a user setting; for now it is strictly a dev convenience.

### FL-0034 — Lessons ARE the challenge: embedded mechanics (fixes the real miss)

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-051)
RULE_REFS: DEC-0012, LR-010/051, NG-032 (no fake "click continue")
FILES:
- `src/features/lessons/lessonModel.ts` (+`challenge` block kind), `src/features/lessons/LessonChallenge.tsx` (NEW)
- `src/features/lessons/LessonBlockView.tsx` + `LessonView.tsx` (render challenge inline; it drives completion)
- `src/content/lessons/{contextWindowBudget,ragBasics,promptInjection,sandboxingGovernance}.ts` (rebuilt)
- `tests/lessonRender.test.tsx` (+embedded-challenge assertion)

CHANGED:
- USER FEEDBACK (harsh + correct): the mechanics were built as optional LABS, so the LESSONS — the thing the
  learner actually opens — were unchanged (still 2-option MCQ, e.g. 08-04) or empty with a finish button
  (02-01). "Viewpoints" = different EXERCISE TYPES across the curriculum (TryHackMe/Scratch hands-on), not
  one lesson with viewpoint paragraphs. The mechanics-as-separate-labs approach was the wrong execution.
- FIX: a lesson can now contain a `{ kind: 'challenge', scenarioId }` block that renders the mechanic engine
  INLINE (via the interaction registry). Completing the mechanic completes the lesson (the manual "Lektion
  abschließen" button is hidden when a challenge is present) — so opening the lesson drops you straight into
  a hands-on task, no MCQ, no empty finish.
- Rebuilt the 4 mechanic nodes as hands-on lessons with DIFFERENT exercise types: 02-01 Allocate (sliders),
  05-01 Build (assemble a RAG pipeline), 08-03 Order (triage an incident), 08-04 Place (trust boundary map).
  Removed their 2-option decisions + passive viewpoint paragraphs; each is now a short frame + the task.

WHY:
- Directly addresses the core complaint: the interactive challenge must BE the lesson, and the curriculum
  needs varied exercise types. This is the execution control/07 (LR-051) always specified; FL-0030/31/32
  built the mechanics, this wires them into the lessons.

QA:
- build green (254 modules); `npm test` 129 passed (+1: a challenge lesson shows the mechanic inline with no
  manual finish; the "renders every slice lesson" smoke now exercises the 4 embedded challenges).

RISKS:
- Only 4 of 43 lessons are converted; the other 39 are still framing + MCQ. The rollout is now unblocked
  (drop a `challenge` block per node, pick the fitting mechanic) — pending user confirmation of the feel.

NEXT:
- User reopens NODE-02-01 / 05-01 / 08-03 / 08-04 → now hands-on. If the feel is right: roll the pattern
  across the curriculum (one fitting mechanic per node) + build the remaining mechanics (dial/sort/weigh) for
  concepts that need them.

### FL-0035 — Hands-on rollout batch: 10 nodes, 10 interaction types

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-061)
RULE_REFS: DEC-0012, LR-012/051
FILES:
- `src/content/lessons/{whatAiEngineeringBuilds,icebergModel,augmentedLlm,simplicityBeforeAgency,
  toolsAreInterfaces,evalHarness}.ts` (rebuilt as embedded-challenge lessons)
- `tests/lessonRender.test.tsx` (decision-gating test now targets a decision lesson, not lessons[0])

CHANGED:
- KEY INSIGHT: the existing core/config lab engines are already VARIED hands-on mechanics (card-sort, trace,
  toggles, multi-select, classify, eval-design) — they were just hidden in labs. Embedding each node's bound
  base scenario into its lesson (the `challenge` block, FL-0034) converts lessons to hands-on with no new
  engine work.
- Converted 6 more lessons (on top of the 4 in FL-0034) → 10 hands-on nodes, each a DIFFERENT exercise type:
  00-01 card-sort (Failure Mode Tree) · 00-02 layer-classify · 01-01 multi-select build (Architecture) ·
  01-02 trade-off duel · 02-01 allocate (sliders) · 03-01 permission toggles (Tool Contract) · 05-01 build
  (pipeline) · 07-01 eval design · 08-03 order (triage) · 08-04 place (trust boundary). Each lesson = a short
  frame + the embedded task; the old 2-option MCQs + passive viewpoint paragraphs are gone.

WHY:
- Roll out the hands-on pattern (LR-061) across the early/most-tested arcs, demonstrating real variety of
  exercise types — directly the user's ask — by reusing the mechanics already built.

QA:
- build green (254 modules); `npm test` 129 passed. The "renders every slice lesson" smoke exercises all 10
  embedded challenges; the embedded-challenge test asserts the mechanic renders inline with no manual finish.

RISKS:
- ~33 lessons still framing + MCQ (Context 02-02/03/04, Tools 03-02/03/04, Agents 04-*, Retrieval 05-02..05,
  Memory 06-*, Evals/Obs 07-02..04, Security 08-02, Repo 09-*, Capstone 10-*). Some need their own scenario
  (concept has no bound mechanic yet) or a new mechanic (dial/sort/weigh).

NEXT:
- Continue the rollout: convert the remaining nodes (reuse bound scenarios where they exist; author new
  scenarios or mechanics where needed). Build dial/sort/weigh for concepts that fit them.

### FL-0036 — Kill lazy distractors ("Modell zu klein / größeres Modell / Prompt zu kurz")

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-011a)
RULE_REFS: LR-011a, ALL-0002
FILES:
- `src/content/labs/{failureMode,securityIncident,systemPostmortem,paperFigure,agentTrace}Scenarios.ts`

CHANGED:
- Replaced 10 filler wrong-options (model-size / prompt-length / temperature / "halluziniert") with
  domain-realistic distractors a competent engineer might actually pick: symptom-patch, over-engineering,
  tempting-but-wrong control, right-idea-wrong-layer. Examples: SIR vector "Modell zu klein" → "Mehrdeutig
  formulierter Task" (blames input not the missing approval-gate); SIR containment "Größeres Modell" →
  "Gesamte Plattform abschalten" (over-broad, still no restore); SPM cause "Temperatur zu hoch" → "Prompt-
  Update hat Regeln geändert" (correlation trap); SPM runaway "Modell zu groß" → "Tool-Budget zu niedrig"
  (raise-the-budget reflex); PFD "größeres Modell" → "besseres OCR" / "Hybrid kombinieren"; ATD "Größeres
  Modell" → "Output nachträglich prüfen" (symptom-patch); FMT noise distractor → recency-ordering trap.
- Each new distractor keeps a one-line rationale explaining WHY it is tempting-but-wrong (revealed on eval).

WHY:
- User feedback 2026-06-18: "model too small / prompt too short are always the obvious errors and seem like
  dummy answers." Lazy fillers made challenges guessable, defeating the redesign's whole point (LR-011).

QA:
- grep (DE+EN patterns) across `src` now clean except the legit cost/latency/quality trade-off in
  `tradeOffScenarios` (intentionally KEPT — model size IS the real lesson there). build green; `npm test` 129
  passed. Scoring/feedback untouched (only option labels/rationales/ids changed; bestOptionId/correct intact).

RISKS:
- Option `id`s renamed (e.g. small-model→ambiguous-task); ids are local to scenarioData and not referenced by
  tests or scoring (which key off bestOptionId / correct), so no breakage. Future scenarios must follow
  LR-011a — distractor realism is now a content gate, not a nicety.

NEXT:
- Apply LR-011a while authoring scenarios for the remaining ~33 lesson conversions (continue FL-0035 rollout).

### FL-0037 — Hands-on rollout batch 2: +8 nodes (reuse already-bound scenarios)

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-061)
RULE_REFS: LR-051, FL-0034/0035
FILES:
- `src/content/lessons/{systemLayersMap,contextIsolation,structuredOutputs,constrainedDecoding,
  contextualRetrieval,paperVisualRetrieval,groundingEvaluation,tracesPostmortems}.ts` (rebuilt as
  embedded-challenge lessons)

CHANGED:
- 8 more lessons whose nodes ALREADY had a bound scenario (no new engine work) converted from framing +
  2-option `decision` MCQ → concise frame + `{ kind: 'challenge', scenarioId }`. Bindings: 01-03 ← LSB-
  TRANSFER (layer-sort) · 02-04 ← ATD-BASE (trace) · 03-02 ← CP-BASE (constraint puzzle) · 03-03 ← CP-
  TRANSFER · 05-04 ← RF-TRANSFER (retrieval connect) · 05-05 ← PFD-BASE (figure weigh) · 07-03 ← ED-TRANSFER
  (eval connect) · 07-04 ← SPM-BASE (postmortem triage).
- structuredOutputs.interactionType corrected 'tool-contract-forge' → 'constraint-puzzle' to match its
  embedded scenario (the only scenario bound to 03-02). Each lesson keeps ONE short frame block (note/prose/
  term) so the situation leads; the old decision walls + "next step: see the lab" notes are gone (the lab IS
  the lesson now).

WHY:
- Continue LR-061 rollout across Foundations/Context/Tools/Retrieval/Evals arcs by reusing the varied
  mechanics already built — cheapest possible conversions, maximal variety per the user's "each exercise a
  different viewpoint" ask.

QA:
- build green; `npm test` 129 passed. "renders every slice lesson without throwing" exercises all 18 embedded
  challenges (10 from FL-0035 + these 8); each resolves via allScenarios + interactionRegistry and renders
  inline with no manual finish button.

RISKS:
- 25 lessons still framing + MCQ — and unlike this batch, their nodes have NO bound scenario, so each needs a
  NEW scenario authored (for an existing mechanic) or a NEW mechanic (dial/sort/weigh). Heavier than batches
  1–2. List: agentLearningLoops, autonomousAgentLoop, capstone{Briefing,EvalGovernance,FailureInjection,
  FinalReview}, contextCompression, contextNoise, conventionsSmallComponents, decisionLogsLedgers,
  evaluatorOptimizer, humanApprovalGates, hybridSearchReranking, leastPrivilege, lexicalVsSemanticRetrieval,
  longRunningProjects, mcpToolEcosystems, orchestratorWorker, repoLegibility, sessionVsProjectMemory,
  sourceMaterialOs, taskSuccessRegression, teamScale, workflowPatterns, workflowVsAgent.

NEXT:
- Batch 3: author NEW scenarios (data-only, LR-011a distractors) for the existing mechanics and embed them —
  e.g. contextNoise/contextCompression → allocator; leastPrivilege/humanApprovalGates → trust-boundary;
  hybridSearchReranking/lexicalVsSemantic → retrieval-factory/pipeline; evaluatorOptimizer/taskSuccess →
  eval-designer; orchestratorWorker/workflowVsAgent → pipeline/trace. Build dial/weigh mechanics where no
  existing engine fits (e.g. a tuning/trade-off node).

### FL-0038 — Hands-on rollout COMPLETE: 43/43 lessons, 0 MCQ

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-051/061) — rollout milestone
RULE_REFS: DEC-0012, LR-011a/012/051/061
FILES:
- 23 lesson files (the remainder) rebuilt as embedded-challenge lessons
- new data-only scenarios added to existing scenario files: `architectureScenarios` (+5: WVA/WFP/ORW/MCP/TSC),
  `contextBudgetScenarios` (+2: CBN/CBC), `retrievalFactoryScenarios` (+2: RFL/RFH), `evalDesignerScenarios`
  (+3: EVO/TSR/CEG), `securityIncidentScenarios` (+2: SIR-APPROVAL/SIR-INJECT-CAP), `repoRefactorScenarios`
  (+5: DLL/AGL/LRP/CSC/SMO), `agentTraceScenarios` (+1: ALP), `capstoneScenarios` (+2: CAP-BRIEF/CAP-REVIEW)
- `tests/lessons.test.ts` (dropped the stale ">10 decisions" floor — terminal state is 0), `tests/
  lessonRender.test.tsx` (decision-gating test now runs on a self-contained fixture, not content)

CHANGED:
- Every one of the 43 lessons is now `concise frame + { kind: 'challenge', scenarioId }` — the lesson IS the
  hands-on task (LR-051). 0 classic 2-option `decision` blocks remain in content. NO new ENGINE was needed:
  all 19 registered mechanics already covered the curriculum; the work was authoring 22 new DATA-only
  scenarios (LR-011a-realistic distractors) + reusing 2 already-bound (SIR-BASE@08-01, RR-BASE/TRANSFER) and
  the 8 from FL-0037.
- Mechanic spread across the 43: architecture-builder (workflow/agent/MCP/team), context-budget/allocator
  (budget/noise/compression), retrieval-factory + pipeline (lexical/hybrid/contextual), eval-designer
  (success/regression/grounding/evaluator-loop/governance), security-incident-room (least-priv/approval/
  injection), repo-refactor (memory + repo arcs), agent-trace + incident-triage + system-postmortem
  (debugging/postmortems), trust-boundary (sandbox), failure-mode-tree + layer-stack (foundations),
  paper-figure-decoder (visual retrieval), capstone-simulator (briefing/defense), constraint-puzzle,
  tool-contract-forge, trade-off-duel. Genuine variety of task TYPE per node — the user's core ask.

WHY:
- Completes DEC-0012: the user demanded every lesson be a hands-on strategy-game challenge, not a guessable
  MCQ, with variety across the curriculum. Done end-to-end, arc by arc, each batch shippable + green.

QA:
- build green; `npm test` 129 passed. "renders every slice lesson" smoke now exercises all 43 embedded
  challenges; each resolves via allScenarios + interactionRegistry and renders inline with no manual finish.
  grep confirms 0 `kind: 'decision'` in `src/content/lessons`. No lazy distractors (FL-0036 grep clean).

RISKS:
- Some engines now carry several scenarios with the same station structure (e.g. repo-refactor ×7,
  eval-designer ×6) — variety lives in the situation/distractors, not the widget. If playtest finds an arc
  feels repetitive, that arc is the candidate for a new mechanic (dial/weigh) — engine slots already exist.
- Scenarios are authored but only render-smoke-tested; per-scenario scoring/feedback not unit-tested
  individually (the engines' scoring is). Human playtest (OQ-0005) is the next real gate.

NEXT:
- User playtest of the full hands-on curriculum (dev: UNLOCK_ALL greys-but-plays all nodes). Then: optional
  dial/weigh mechanics for any arc that feels samey; per-arc difficulty pass; then V1 hardening/deploy.

### FL-0039 — De-spoiler: hide verdict badges pre-answer + de-keyword distractor labels

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-011b)
RULE_REFS: LR-011b, ALL-0003
FILES:
- `src/features/labs/contextBudgetBoard/ContextBudgetBoard.tsx` (NOISE/STALE/KEY badges + `required` hint now
  gated behind `revealed = !!result`; `ItemRow` takes `revealed`)
- `src/features/labs/trustBoundary/TrustBoundaryBoard.tsx` (`hoch-Risiko` badge gated behind `result`)
- `src/content/labs/contextBudgetScenarios.ts` (CBN/CBC/CBB-TRANSFER + softened CBB-BASE item labels)
- `src/content/labs/trustBoundaryScenarios.ts` (notes that echoed zone vocab „Read-only“/„Untrusted“ rewritten
  to describe BEHAVIOUR)

CHANGED:
- User (2026-06-19) caught the Context Budget Board stamping NOISE/KEY/STALE on cards BEFORE evaluation — the
  verdict is the answer, so the task graded itself. Now all verdict badges (+ the `required` flag, + the
  allocator's „Ziel %“ which was already gated, + trust-boundary „hoch-Risiko“) appear only AFTER „auswerten“,
  as the teaching reveal. Pre-answer the learner sees only label + source + token cost and must reason.
- Distractor LABELS that announced their own verdict were rewritten to look plausibly-includable: „Langer
  alter Chat-Verlauf“ → „Chat-Verlauf einer früheren, anderen Anfrage“; „Unverwandtes Marketing-Doc“ →
  „Marketing-Onepager zum selben Produkt“ (same product, off-task — needs reasoning); „Roher Such-Dump“ →
  „Volltext-Suche: Top-50 ungefiltert“; trust-boundary notes „Read-only.“/„Untrusted…“ → behaviour text
  („Liest Dateien, schreibt nie.“ / „Text von externen Seiten, frei befüllbar.“). Spiral difficulty (LR-011b
  rule 2): the FIRST node of each concept stays the clearest teaching instance (CBB-BASE@02-01 softened but
  still transparent); later nodes (02-02 noise, 02-03 compress, transfers, cross-arc) are disguised so the
  learner APPLIES the rule, not keyword-matches it.

WHY:
- "Teach excellence like TryHackMe, not a NotebookLM quiz." A challenge that prints its own answer is a quiz.
  Pre-stamped verdicts + verdict-named distractors let the learner pass without the reasoning the node teaches.

QA:
- build green; `npm test` 129 passed. Audited all 10 boards: agent-trace, incident-triage, pipeline-builder,
  allocator, failure-mode-tree already gated correctness to post-eval; only CBB + trust-boundary leaked. grep
  for giveaway adjectives in labels now only hits intro nodes (00-01/02-01), which is correct per LR-011b.

RISKS:
- Other station-config scenarios (eval/security/retrieval/repo/capstone) use single-select option lists whose
  rationale is post-reveal already; their OPTION wording was checked under FL-0036 but not re-audited for
  subtle keyword-echo. If playtest finds a giveaway, apply LR-011b: describe the surface, not the verdict.

NEXT:
- Same playtest. While playing, watch for any remaining option that reads as self-announcing and flag the arc.

### FL-0040 — Option-label audit + executable LR-011a/b guardrail test

STATUS: implemented
PHASE: POST-V1 redesign (control/07, LR-011a/011b)
RULE_REFS: LR-011a, LR-011b, ALL-0002, ALL-0003
FILES:
- `tests/contentQuality.test.ts` (NEW — walks every `allScenarios` data, fails on banned filler / hedge
  giveaways / empty content)
- `src/content/labs/constraintScenarios.ts` („Best-Effort irgendwie parsen“ → „Output mit Regex tolerant
  nachparsen“)
- `src/content/labs/evalDesignerScenarios.ts` (5× „Auf überzeugende Formulierung/Begründung vertrauen“ →
  „… nach Formulierungsqualität/Plausibilität bewerten“; „Nur die einfachen Smoke-Fälle“ → „Eine Handvoll
  Smoke-Tests müssen grün sein“)
- `src/content/labs/securityIncidentScenarios.ts` („Den Task einfach erneut ausführen“ → „Den
  fehlgeschlagenen Task erneut ausführen“)
- `src/content/labs/repoRefactorScenarios.ts` (3× dropped the „Nur …“ self-flag: TOC ×2, Linter)
- `src/content/labs/capstoneScenarios.ts` (CAP-REVIEW „Sicherheitshalber JEDE Aktion gaten“ → „Jede Aktion
  durch ein Approval-Gate führen“ — caught by the new test)

CHANGED:
- Re-audited the open risk from FL-0039: the single-select OPTION labels (visible pre-answer) across all
  station-config scenarios. Most „Nur …“ / „…vertrauen“ options are legit tempting-but-wrong traps (recency
  bias, "models learn over time", symptom-patch "just document it") and were KEPT. ~9 that announced their
  verdict by FORM (hedge words „irgendwie“/„einfach“/„sicherheitshalber“, the repeated „trust fluency“ foil)
  were reworded to read as plausible flawed choices that need reasoning, not pattern-matching.
- Turned LR-011a + LR-011b into an executable guardrail: `contentQuality.test.ts` recursively collects every
  string in every scenario's data and asserts (a) no model-size/prompt-length filler distractor (LR-011a;
  trade-off-duel lab exempted — model size IS its lesson), (b) no hedge-giveaway wording (LR-011b), (c) every
  scenario has a non-empty id/prompt/data. +3 tests → 132 total.

WHY:
- "Teach excellence like TryHackMe, not a NotebookLM quiz." Documented rules drift; an executable rule can't.
  The test paid off instantly — it flagged a hedge ("Sicherheitshalber…") I had just written into CAP-REVIEW,
  proving the guardrail catches real regressions a human review would skim past.

QA:
- build green; `npm test` 132 passed (was 129). The guardrail failed first on CAP-REVIEW, then went green
  after the fix. tradeOffScenarios intentionally exempt; verified its model-size options don't match the
  banned regex anyway.

RISKS:
- The hedge regex is deliberately narrow (`irgendwie|auf gut Glück|sicherheitshalber`) to avoid false
  positives on legit „einfachste tragfähige …“. It catches the obvious form-tells, not every subtle one —
  human playtest is still the judge of whether an option "feels" like a giveaway. Extend the regex when a new
  pattern is found, rather than broadening it speculatively.

NEXT:
- Playtest remains the real gate. Candidate deeper work if an arc feels samey: a new dial/weigh mechanic.
- DONE this session: difficulty-ramp audit (LR-011b rule 2). Extracted node→difficulty for all 60 scenarios;
  ramp is sound (intro at arc openers 00/01-01/02-01/03-01 · core through middles · advanced concentrated in
  05/09 · capstone at 10; mechanic reuse ramps: repo-refactor 06 core→09 advanced, security 08 core→10
  advanced). One blemish fixed: ATD-BASE@02-04 was `intro` (a backward dip below the core 02-02/02-03) → bumped
  to `core`. `difficulty` is a display chip only (introScenario keys off isTransfer), so the change is cosmetic
  and safe.

### FL-0041 — Route code-splitting: cut initial mobile bundle ~40%

STATUS: implemented
PHASE: PHASE_9 hardening (PH-1000/1001) — perf, non-content
RULE_REFS: PH-1003 (hardening allows perf, not new systems), mobile-first 320–430px
FILES:
- `src/routes/router.tsx` (LessonPage/LabPage/ReviewPage/ReviewRunPage/VisualLabPage → `React.lazy` dynamic
  imports; Home/Roadmap/NotFound stay eager for instant first paint)
- `src/components/layout/AppShell.tsx` (`<Suspense fallback>` around `<Outlet/>`; minimal „Lädt …“ fallback)

CHANGED:
- The build self-warned: single 595 kB JS chunk (>500 kB), heavy for a mobile PWA. Root cause: every page was
  eager-imported, so the whole interaction registry (19 engines + ~60 scenarios) AND the dev/QA VisualLab
  (every visual primitive) sat in the initial bundle even on the home/roadmap landing.
- Split the heavy routes via `React.lazy`. Result (gzip): initial `index` 178→110 kB; the 198 kB registry
  (50 kB gz) now loads only when the user first opens a lesson/lab/review; VisualLabPage (16 kB) is off the
  critical path entirely (dev/QA only). Per-route chunks: LessonPage 6.8 kB, LabPage 2.1 kB, ReviewPage
  5.2 kB, ReviewRunPage 1.5 kB. „chunks larger than 500 kB“ warning gone.

WHY:
- Mobile-first (320–430px) on slow phones: shipping 178 kB gz of JS before first paint hurts TTI. The landing
  (roadmap) needs none of the lab machinery; lazy-loading defers it to the moment of use. Standard hardening,
  no behaviour change.

QA:
- build green, warning cleared; `npm test` 132 passed. Lazy pages are rendered directly (by import) in
  labRender/lessonRender/reviewRender tests, so their coverage is unchanged; Suspense only affects router
  resolution, which the successful build + emitted chunks confirm. Eager landing path (home/roadmap)
  unchanged.

RISKS:
- A route now shows a brief „Lädt …“ on first navigation while its chunk downloads (then cached). On a fast
  connection it's imperceptible; on a slow one it's a deliberate trade for a faster first paint. If a future
  e2e test asserts instant lab render via the router (not direct import), it must await the Suspense.

NEXT:
- Remaining PHASE_9 hardening (non-human): npm audit triage (OQ-0004); manifest/PWA-icon check for deploy;
  OQ-0009 dead lab-binding cleanup. Human pixel QA (OQ-0005) still the one thing AI can't do.

### FL-0042 — Shared ResultActions: retry-when-weak mastery nudge across all engines

STATUS: implemented
PHASE: POST-V1 redesign (control/07) — game-feel polish
RULE_REFS: LR-013 (direction-not-correctness, non-gating), LR-001 (strategy-game feel)
FILES:
- `src/features/labs/ResultActions.tsx` (NEW — shared post-eval action pair)
- `tests/resultActions.test.tsx` (NEW — locks the nudge behaviour)
- 10 engine boards wired to it: StationConfigBoard (covers ~11 station-config scenario types) + ContextBudget,
  ContextAllocator, ArchitectureBuilder, AgentTraceDebugger, FailureModeTree, IncidentTriage, PipelineBuilder,
  ToolContractForge, TrustBoundary

CHANGED:
- The post-evaluation "Nochmal / Abschließen" button pair was duplicated across 14 sites, with „Abschließen“
  always primary — even after a weak attempt, the UI led the learner to move on rather than master. Replaced
  every copy with one `<ResultActions strong onRetry onFinish>`: when the attempt hit the good region
  (weakSignals.length === 0) „Abschließen“ leads; when weak, „Nochmal“ becomes the prominent (accent) action
  plus a one-line nudge („Nah dran — … ein zweiter Versuch“). Still NON-GATING (LR-013): finishing always
  works; only the emphasis changes. DRY win: 14 hand-rolled button blocks → 1 component.
- `strong` is derived from each engine's existing score (`weakSignals.length === 0`), so no scoring change.

WHY:
- TryHackMe-feel: a learner who half-solves a challenge should feel invited to try again with the feedback,
  not nudged to click past it. The previous always-primary „Abschließen“ made even a weak result feel like a
  quiz you complete. This is the smallest change that makes mastery the default pull without forcing it.

QA:
- build green (no unused Button imports — every board keeps Button for its evaluate action); `npm test` 134
  passed (+2 ResultActions). Text labels unchanged, so the existing tests that click „Abschließen“ by text
  still pass; the new test pins the weak→nudge / strong→no-nudge behaviour.

RISKS:
- Threshold is binary (any weak signal → nudge). A 5/6-correct attempt gets the same "retry" emphasis as 1/6.
  Fine for now (the feedback above the buttons shows what's weak); if playtest wants a softer gradient, pass a
  ratio instead of a boolean. The nudge copy is German-only, consistent with the rest of the content.

### FL-0042b — Durability reframes of the 3 at-risk existing nodes

STATUS: implemented
PHASE: PRE-SHIP (control/08 SPINE-003..006, OQ-0010 [F])
FILES: `src/content/lessons/{constrainedDecoding,mcpToolEcosystems,ragBasics}.ts` (frame copy only)
CHANGED:
- Reframed the 3 nodes that risked reading as ephemeral technique/brand to teach the DURABLE PRINCIPLE
  instead (SPINE-004): Constrained Decoding → "force valid structure; format ≠ truth" (technique named as the
  current mechanism) · MCP → "standardize tool integration over one protocol/contract (today MCP)" · RAG →
  "get the right EVIDENCE in front of the model; bigger context windows only shift WHEN you reach for
  retrieval, not the need." Addresses the user's future-proofing concern head-on. Reflexive scan first
  confirmed no prompt-trick rot anywhere (NG-007 held).
QA: build green; `npm test` 134. Copy-only; no mechanic/scoring change.

### FL-0043 — ARC-11 "The Director's Seat": first DIRECTION-track arc shipped

STATUS: implemented
PHASE: DIRECTION EXPANSION (DEC-0013, control/09 DIR-031..033)
RULE_REFS: PC-014/023, SPINE-002/004/011, DIR-019/031, LR-011a/b, LR-013
FILES:
- `src/content/roadmap/arcs.ts` (+ARC-11), `nodes.ts` (10-05 unlocks→11-01; +NODE-11-01..03, chained, last
  unlocks []), `lessons/index.ts` (+3), 3 new lessons `dir{FromBuilderToDirector,OneBeeOrMany,AllocateOversight}.ts`
- 3 new scenarios reusing EXISTING engines: `contextBudgetScenarios` (DIR-FEED-BASE), `architectureScenarios`
  (DIR-SWARM-BASE), `contextAllocatorScenarios` (DIR-OVERSIGHT-BASE)
- `tests/roadmapStatus.test.ts` (node count 44→47)

CHANGED:
- Built the first slice of the BIGGEST gap (DIRECTION). An ADDITIVE arc gated behind the capstone (existing
  experience untouched; new arc only unlocks after 10-05). 4 nodes = the director's setup loop, each a
  different engine (variety, no new UI built overnight = nothing unreviewable): 11-01 From Builder to Director
  (Context-ROI: what to feed the bee, cut the dump — contextBudgetBoard) · 11-02 One Bee or Many (match
  execution structure, don't over-swarm a defined task — architectureBuilder) · 11-03 Allocate Your Oversight
  (risk-weighted attention across parallel agents — contextAllocator) · 11-04 Set the Delegation Boundaries
  (what each bee may touch: trusted/approval/sandbox/isolate — trustBoundary).
- The "bees" framing (senior directs the swarm) is the through-line; all 3 are durable (grow as models
  improve) and clear the edge bar (things a junior gets wrong: over-feeds context, over-swarms, reviews
  evenly).

WHY:
- Start closing the Open-Claw gap with VERIFIED, self-reviewed work the user can wake to green. Chose the 3
  nodes that map CLEANLY to existing engines (no new mechanic = nothing that needs visual QA the user can't do
  while asleep). Deferred the nodes needing BRIEF-BUILDER/SWARM-BOARD (DIR-035) to when the user can review UX.

QA:
- build green; `npm test` 134 passed. Structural tests all held (graph traversable end-to-end 10-05→11-03,
  single entry point preserved, every node lesson-covered, lesson-prereqs match node-prereqs, labIds resolve);
  contentQuality guardrail passed (no lazy/hedge distractors). Self-reviewed against SPINE-002/004 (durability +
  edge bar) — passes. PEDAGOGY made executable: `tests/directionScenarios.test.ts` (+4) asserts each ARC-11
  scenario's INTENDED director move outscores the rookie move (feed-signal > feed-all; one-bee = full marks,
  over-swarm < 1; risk-weighted oversight > even split; right-zones = full marks, trust-all < 1) — proves the
  nodes TEACH, not just render. Source docs (domain/11,12) kept in sync (no drift). NOT human-playtested
  (user asleep) — the one gate left.

RISKS:
- Placement: ARC-11 sits AFTER the capstone (DIR-030 sanctioned "after current nodes"). If the user later
  decides DIRECTION should weave EARLIER (OQ-0010 [C] reorder), these nodes move — they're self-contained so
  re-pointing prerequisites is cheap.
- Only 4 nodes (curate/structure/oversight/boundaries) — the decompose/brief/target/track/integrate skills (DIR-010..017)
  are still spec-only; they mostly need the 2 new mechanics, deferred for UX review.

NEXT:
- On user OK: build BRIEF-BUILDER + SWARM-BOARD mechanics → ARC-13; or weave Phase-1 director retrofits
  (DIR-020) into the early arcs; or the ARC-15 doc-control-plane cluster (reuses existing engines, buildable
  next without new UI).

### FL-0044 — ARC-12 "Targeting the Swarm": research-backed direction arc

STATUS: implemented
PHASE: DIRECTION EXPANSION (DEC-0013, control/09 DIR-032; research anchors DIR-003a..g)
RULE_REFS: PC-014, SPINE-002/004/006, DIR-010/011/014, LR-011a/b/013
FILES:
- `arcs.ts` (+ARC-12), `nodes.ts` (11-04 unlocks→12-01; +NODE-12-01..03 chained), `lessons/index.ts` (+3),
  3 lessons `dir{BriefBottleneck,SequenceDependencies,TriageSwarm}.ts`
- 3 scenarios reusing fresh existing engines: `tradeOffScenarios` (DIR-BRIEF-BASE), `pipelineScenarios`
  (DIR-DEPS-BASE), `incidentTriageScenarios` (DIR-SWARM-TRIAGE)
- `tests/directionScenarios.test.ts` (+3 pedagogy assertions), `roadmapStatus.test.ts` (48→51)
- `control/09` (RESEARCH ANCHORS DIR-003a..g), `domain/11,12` (synced — no drift)

CHANGED:
- Built the second DIRECTION arc, this time RESEARCH-GROUNDED per the user (multi-source web research, not a
  single study — the user's signal: big tech → 3-person pods). 3 nodes, 3 fresh engines, each tied to a
  convergent finding: 12-01 The Brief Is the Bottleneck (tradeOffDuel — "spec quality is almost the entire
  difference between mediocre and exceptional", DIR-003d) · 12-02 Sequence the Dependencies (pipelineBuilder —
  "context has gravity, systems have coupling", DIR-003e) · 12-03 Triage the Swarm (incidentTriage — shared
  task list + catch drift early; stop the wrong-work bleeding before the idle blockade, DIR-003e).
- Captured the research as durable anchors in control/09 (DIR-003a..g) with sources, so future direction
  nodes stay grounded — and honored the durability filter (teach the workflow that survives model progress,
  not the tool).

WHY:
- The user asked for ARC-12+ built on research-backed, future-proof, high-ROI info. The research strongly
  VALIDATES the whole DIRECTION thesis ("orchestration mastery, not prompt engineering, is the critical
  skill") and pinpoints spec quality as the #1 lever — so 12-01 leads the arc. Pods/anti-over-swarm confirm
  11-02 was right.

QA:
- build green; `npm test` 141 passed (+3 pedagogy). Structural tests held (graph traversable 11-04→12-03,
  single entry point, coverage, lesson-prereqs match, labIds resolve); contentQuality guardrail passed.
  PEDAGOGY proven executable: intended director move scores highest (right-sized brief = full marks vs vague/
  over; dependency order = full marks vs scope-creep violation; drift-first = full marks vs review-first
  capped failure). Self-reviewed vs SPINE-002/004 — passes.

RISKS:
- tradeOffDuel/pipelineBuilder/incidentTriage are reused with director-framed scenarios (no new engine = no
  unreviewable UI overnight). If a future playtest finds the swarm-triage reuses the incident-triage feel too
  closely, that's the trigger for a dedicated SWARM-BOARD mechanic (DIR-035). Still NOT human-playtested.
- "Studies lag practice" (user) — anchors are convergent signals, not settled science; re-research at the
  next authoring pass (DIR-003g / SPINE-006).

NEXT:
- ARC-13 (Keeping the Overview) likely wants the SWARM-BOARD mechanic (new UI → user review first). ARC-15
  (doc control plane) is buildable next on existing engines without new UI if continuing autonomously.

### FL-0045 — Multi-viewpoint lessons: a concept from several angles, in-flow (best-UX breadth)

STATUS: implemented
PHASE: POST-V1 content depth (OQ-0011 / control/07 LR-063)
RULE_REFS: LR-001/051/063, OQ-0011, LG-005 (completion requires engagement)
FILES:
- `src/features/lessons/LessonView.tsx` (multi-challenge support: sequential reveal + complete-after-all)
- `src/content/lessons/contextWindowBudget.ts` (02-01: ALLOC-BASE + CBB-BASE — allocate then curate)
- `src/content/lessons/ragBasics.ts` (05-01: PIPE-BASE + RF-BASE — build then configure)
- `tests/lessonRender.test.tsx` (+1: reveal + complete-after-all flow)

CHANGED:
- User chose "best version for UX" for the breadth backlog (OQ-0011) → multi-challenge LESSONS over the safe
  transfer/review route. A lesson can now embed 2+ challenge blocks; LessonView reveals them ONE AT A TIME
  (the next angle appears only after the current challenge is finished — guided, not all-boards-dumped) and
  completes the lesson once EVERY challenge is done (useRef fire-once guard; was: the first completion
  finished the lesson). A "n/N Blickwinkel" progress hint shows for multi-angle lessons.
- Demonstrated on two high-ROI concepts, each via a DIFFERENT mechanic per angle (genuine facets, not reskins),
  reusing scenarios ALREADY bound to the node (zero new scenarios/engines): 02-01 Context Budget = ALLOCATE
  (split the budget) + CURATE (include/compress/exclude); 05-01 RAG = BUILD the pipeline (connect stages) +
  CONFIGURE it (method/rerank/contextual to fit the corpus).

WHY:
- The mechanics×situations model (LR-001) exists to teach each idea from several points of view; we were
  seeing each concept once, one angle. Multi-viewpoint lessons make the breadth part of the core flow (best
  UX) rather than buried in /review — the learner actually experiences the facets back-to-back.

QA:
- build green; `npm test` 142 passed (+1). New test drives the full flow: angle 1 visible / angle 2 hidden →
  finish angle 1 → angle 2 reveals + lesson NOT complete → finish angle 2 → completes exactly once. Existing
  single-challenge lessons unchanged (one challenge → reveal-all → completes as before); "renders every slice
  lesson" + "embeds inline (no manual finish)" still green.

RISKS:
- Multi-angle lessons are longer; only apply where ROI is high (don't make every lesson multi-angle — grindy,
  against best UX). Not human-playtested (the sequential-reveal feel) — the one gate left.

NEXT:
- Continue OQ-0011 incrementally: more viewpoints on the durable spine + DIRECTION nodes; cheapest are nodes
  with 2 already-bound scenarios (08-03 triage+incident-room, etc.). Author fresh facets for 11-*/12-* where
  a second mechanic genuinely adds an angle.

### FL-0046 — Breadth rollout: all natural multi-viewpoint nodes converted (+2)

STATUS: implemented
PHASE: POST-V1 content depth (OQ-0011 / LR-063)
FILES: `src/content/lessons/{workflowVsAgent,promptInjection}.ts`
CHANGED:
- Converted the remaining two nodes that already had 2 distinct mechanics bound (zero new scenarios) to
  multi-viewpoint, completing the cheap-win set (all 4 such nodes now teach two facets): 04-01 Workflow vs
  Agent = BUILD the predictable case (architecture-builder, WVA-BASE) + WEIGH the open case (trade-off-duel,
  TOD-TRANSFER) — the decision from BOTH sides · 08-03 Prompt Injection = ORDER the response (incident-triage,
  TRI-BASE) + DIAGNOSE it (security-incident-room, SIR-TRANSFER, vector/containment/control).
- All four multi-viewpoint lessons (02-01, 04-01, 05-01, 08-03) pair two GENUINELY different mechanics on one
  high-ROI durable concept, reusing already-bound + already-tested scenarios. estimatedMinutes bumped to ~9.
WHY:
- "Continue" the breadth (user). These are the nodes where two existing mechanics genuinely illuminate two
  facets — the natural multi-viewpoint set. Done with zero new scenarios = lowest risk, immediate depth.
QA:
- build green; `npm test` 142 (the multi-challenge flow test + every-slice smoke cover it; the second-angle
  scenarios are pre-existing & already scoring-tested in interactions.test). No new pedagogy test needed.
RISKS:
- The cheap wins are now EXHAUSTED. Further multi-viewpoint breadth requires AUTHORING new facet scenarios
  (a 2nd mechanic per concept) — real design work, and must avoid re-teaching an adjacent node's skill (e.g.
  don't give 12-01 a context-curate angle that duplicates 11-01). Best done deliberately / with user steering
  on which concepts deserve depth. Not human-playtested (the sequential-reveal feel).
NEXT:
- Tier 2 breadth (deliberate): author genuinely-distinct second facets for the DIRECTION nodes + evals/
  boundaries, each clearing LR-011a/b + SPINE-004/005 + a pedagogy assertion. Or hold for user priority.

### FL-0047 — Tier-2 breadth: distinct second facets for two DIRECTION nodes

STATUS: implemented
PHASE: POST-V1 content depth (OQ-0011 / LR-063, DIRECTION track)
RULE_REFS: OQ-0011, LR-063, SPINE-004/005, DIR-003b, LR-011a/b/013
FILES:
- `src/content/labs/tradeOffScenarios.ts` (+2: DIR-SWARM-COST, DIR-INTERVENE)
- `src/content/lessons/{dirOneBeeOrMany,dirTriageSwarm}.ts` (→ multi-viewpoint)
- `tests/directionScenarios.test.ts` (+2 pedagogy assertions)

CHANGED:
- First Tier-2 breadth (authoring NEW facet scenarios, not reusing pre-bound ones). Two DIRECTION nodes get a
  genuinely-distinct second angle via a DIFFERENT mechanic than their angle 1:
  · 11-02 One Bee or Many: angle 1 = pick the STRUCTURE (architecture-builder); angle 2 = the COORDINATION-
    COST trade-off (tradeOffDuel — small pod beats max-bees; parallelism pays only on truly independent work).
    Research DIR-003b ("adding agents reintroduces coordination costs").
  · 12-03 Triage the Swarm: angle 1 = which bee FIRST (incident-triage, drift before idle); angle 2 = what to
    DO about the drifting bee (tradeOffDuel — re-brief beats the sunk-cost "let it finish" and the over-the-top
    "hard restart"; early checkpoints beat micromanaging).
- HONEST SCOPE: only these two DIRECTION nodes have a clean distinct second mechanic. The other five stay
  single-facet on purpose — a forced second angle would re-teach an adjacent node (12-01 brief vs 11-01
  curate; 11-03 oversight vs 11-04 boundaries) or jam a mismatched engine. Per "depth only where it genuinely
  adds a viewpoint" (best UX = deliberate, not bloated).

WHY:
- User: "Push into Tier 2 with the DIRECTION nodes." Delivered the facets that genuinely add a lens (the
  economics of swarming; the intervene-vs-let-run call) — both high-ROI, durable, and missing until now.

QA:
- build green; `npm test` 144 (+2 pedagogy: intended move = full marks, rookie move < 1). Multi-challenge
  flow already covered by lessonRender. Self-reviewed vs SPINE-004/005 — passes.

RISKS:
- tradeOffDuel now hosts 4 direction scenarios (brief, swarm-cost, intervene + the 2 core). Still distinct
  decisions, but if an arc starts to feel tradeOff-heavy in playtest, that's the trigger for a dedicated
  WEIGH/PICK mechanic. Not human-playtested.

NEXT:
- Single-facet DIRECTION nodes can still get spaced-review breadth via TRANSFER variants (same mechanic,
  harder situation) surfaced by /review — lower-priority, different kind of breadth than in-lesson POV. Or
  move to a new arc / hold for user priority.

### FL-0048 — Realness pass: kill the live spoiler + the AI-slop question

STATUS: implemented
PHASE: POST-V1 content quality (control/07 LR-011c, OQ-0012)
RULE_REFS: LR-011b/011c, OQ-0012
FILES:
- `src/features/labs/contextBudgetBoard/ContextBudgetBoard.tsx` (gate noise/missing-risk gauges post-eval)
- `src/content/labs/tradeOffScenarios.ts` (DIR-BRIEF-BASE fully redesigned)
- `source_material/control/07_*` (LR-011c), `tests/contentQuality.test.ts` (+SLOP_PHRASE guardrail),
  `tests/directionScenarios.test.ts` (12-01 assertions updated to new stations)

CHANGED:
- User playtested 02-03 + 12-01 and hit two realness failures:
  (1) SPOILER — the Context Budget Board showed a LIVE "Noise-Risk: hoch (67%) / Missing-Context-Risk: hoch
  (75%)" readout as you toggled items — a hot/cold thermometer on the exact scoring dimensions. Now the risk
  gauges render only AFTER evaluation (the used/max budget bar stays — that's a legit visible constraint).
  (2) AI-SLOP — 12-01 "The Brief" had the obviously-right verbose option vs caricature wrongs („bau das
  Feature, du weißt schon"; „jede Zeile vorgeben") + a filler „Constraint" line. You could not get it wrong
  and it read as AI-written. REDESIGNED around a CONCRETE brief („CSV-Export für Bestellungen — schnell und
  sicher") with REALISTIC traps a competent engineer actually falls for: the qualitative goal that FEELS
  specified („schnell/sicher reicht"), the over-diligent implementation spec (give exact SQL + signatures),
  and the responsible-feeling manual review („ein Senior reviewt vor Release") / untestable „keine
  offensichtlichen Lücken". Right = make it measurable + testable.
- Encoded the bar (LR-011c): no AI-slop, no free wins — distractors are the tempting REAL mistake in a
  concrete situation; prose carries information; if a concept has no hard call, switch mechanic or cut.
  Litmus: read as a skeptical senior — smells AI or can't-get-it-wrong → doesn't ship.
- Mechanical guardrail: SLOP_PHRASE in contentQuality catches crude caricature phrasings (regression
  protection); tightened to avoid German false positives ("wird schon geladen" ≠ "wird schon gut gehen").

WHY:
- The user's sharpest bar yet: "could people tell it's AI? then it's bad — we want a real feel." A spoiler or
  a free-win question breaks the TryHackMe-grade trust the whole redesign is built on.

QA:
- build green; `npm test` 145 (+1 slop guardrail; 12-01 pedagogy updated: measurable+testable = full marks,
  the three realistic traps each score < 1). Spoiler fix verified by code-path (gauges gated on `result`).

RISKS:
- The crude slop is guarded; the SUBTLE "too obvious" (2-option good-vs-bad) is not mechanizable → OQ-0012,
  playtest-driven (user flags → I fix; no blind sweep, since many 2-option wrongs ARE real traps). Not
  human-playtested for the new 12-01 feel.

NEXT:
- As the user playtests, flag any question that "smells AI" or is unmissable → redesign per LR-011c. Prime
  suspects: 2-option stations. Consider converting the weakest to 3-option with a second realistic trap.

### FL-0049 — Shipping-criteria audit + ARC-13 "Delivery & Acceptance" (close the PM edge)

STATUS: implemented (ARC-13) + audit recorded
PHASE: PRE-SHIP / DIRECTION EXPANSION (control/09 DIR-017/018)
RULE_REFS: PC-014/043, SPINE-002, DIR-017/018, LR-011c

AUDIT (user asked "are all shipping criteria checked? edge in SE AND PM?"):
- Edge SE (architecture/judgment/review, arcs 00–09): ✅ checked.
- Edge PM (direct the swarm): was PARTIAL — ARC-11/12 covered decompose/brief/target/oversight/triage/
  intervene; the DELIVERY half (prioritize/scope, accept/review, integrate, track) was unbuilt. ARC-13 now
  adds scope + accept (this entry). Integrate + track (SWARM-BOARD) still pending.
- Psychologically sound: ✅ ramp/memory/active/multi-viewpoint/anti-slop — EXCEPT SPINE-040 intro-visuals
  ("I'm just guessing") still UNBUILT (visual; can't verify feel while user is away).
- Signal not noise: ✅ (back-half redundancy flagged, non-blocking).
- Open-Claw / direct-a-build (PC-043): ❌ STILL UNMET — capstone (10-*) is all capstone-simulator decision
  boards, not a spec→direct→inject→review round-trip. The keystone; needs deliberate restructure + ideally
  the SWARM-BOARD. THIS is the top remaining ship-blocker for the "can they build it" claim.

CHANGED (ARC-13):
- Built the PM delivery half on existing engines (no new UI): 13-01 Prioritize and Cut (contextAllocator —
  allocate sprint capacity by value × risk; fund the core, de-risk the uncertain early, cut the nice-to-have;
  even-spread scores worse) · 13-02 Accept or Send Back (tradeOffDuel — judge the agent's PR against the
  BRIEF's acceptance criteria: send back the unmet `orders:read` gap with a specific reason; the realistic
  traps are the rubber-stamp "looks done/clean" and the style-nitpick + vague feedback). 13-02 closes the loop
  with 12-01 (write the acceptance criteria → enforce them).

WHY:
- The PM edge was the weaker half of "edge in SE and PM". Scope (own the roadmap) and Accept (review against
  criteria, Writer/Reviewer) are the two most distinctively-PM skills and were missing — both buildable now,
  both high-ROI, both durable.

QA:
- build green; `npm test` 147 (+2 pedagogy: prioritised > even-spread; send-back-gap+specific = full marks,
  rubber-stamp/nitpick/vague < 1). Structural tests held (traversable 12-03→13-02, coverage, lesson-prereqs);
  contentQuality LR-011a/b/c clean. domain/11,12 synced. Self-reviewed vs SPINE-002/004 + LR-011c — passes.

RISKS:
- PM edge now strong on decompose→target→track-ish→deliver→accept, but TWO real gaps remain: (1) the
  capstone-as-build (PC-043) — the integration that proves the whole thing; (2) overview/SWARM-BOARD tracking
  + integrate. Both want a new mechanic or restructure (user review). Not human-playtested.

NEXT (ranked for ship-readiness):
1. Capstone-as-build (PC-043) — the Open-Claw keystone; biggest unmet criterion. Restructure 10-01..05 into a
   spec→decompose→direct→inject→review round-trip (can reuse direction + capstone mechanics; SWARM-BOARD optional).
2. SPINE-040 intro-visuals (the "I'm just guessing" novice fix) — visual, needs user to see.
3. ARC-14 integrate + the SWARM-BOARD tracking node (new mechanic → user review).

### FL-0050 — Direct the Build: the PC-043 round-trip (Open-Claw exit proof) — keystone MET

STATUS: implemented
PHASE: PRE-SHIP keystone (control/00 PC-043, control/09 DIR-034)
RULE_REFS: PC-014/043, SPINE-001/050, DIR-010/011/017, LR-011c, FL-0045 (multi-challenge)
FILES:
- `src/content/lessons/dirDirectTheBuild.ts` (NEW — 4-challenge round-trip lesson, NODE-13-03)
- 4 scenarios: `tradeOffScenarios` (RT-BRIEF, RT-ACCEPT), `pipelineScenarios` (RT-DECOMPOSE),
  `failureModeScenarios` (RT-DIAGNOSE)
- `nodes.ts` (13-02 unlocks→13-03; +NODE-13-03), `arcs.ts`/`index.ts`, `roadmapStatus.test` (53→54),
  `directionScenarios.test` (+4 phase assertions), `domain/11,12` synced

CHANGED:
- Closed the #1 unmet shipping criterion. NODE-13-03 "Direct the Build" is the in-app proxy for "direct an
  agent to build a feature" (PC-043 exit proof / the Open-Claw question Q4). ONE concrete feature — "add 2FA
  to login" — directed end-to-end across FOUR phases, each a DIFFERENT mechanic, revealed one at a time via
  the multi-challenge LessonView (FL-0045): (1) BRIEF — make "sicher/nicht nervig" measurable+testable
  (trade-off; traps: „nach Best-Practices“ feels-clear, always-2FA confuses friction with security); (2)
  DECOMPOSE — dependency-ordered build plan, cut the "rewrite all of auth" scope-creep (pipeline); (3)
  DIAGNOSE — users locked out → root cause = missing recovery flow (product layer), NOT the TOTP-window
  distractor (failure-mode); (4) ACCEPT — the PR is green+clean but recovery-codes (a brief criterion) are
  missing → send back + add a regression test (trade-off; traps: rubber-stamp green tests, "merge & fix
  later" on a security criterion).
- Built with ZERO new mechanic/UI — chains existing engines through the multi-challenge lesson. Correctly
  SEQUENCED at the END of the direction track (after 11/12/13-01/02 teach the skills), not in the early ARC-10
  capstone (which would precede the direction skills).

WHY:
- The whole "could an IT student build Open-Claw" claim rested on this. The learner now actually DIRECTS a
  real build in-app (spec→decompose→diagnose→accept), integrating every direction skill on one feature.
  Honest caveat stands (PC-024): still a simulator, not real reps — but the keystone exit proof is now present.

QA:
- build green; `npm test` 151 (+4 phase pedagogy: each phase's intended move = full marks, the realistic traps
  < 1). Structural tests held (traversable 13-02→13-03; coverage; lesson-prereqs; labIds resolve);
  contentQuality LR-011a/b/c clean. Self-reviewed vs SPINE-001/050 + LR-011c (concrete feature, realistic
  traps, no spoilers, no slop). NOT human-playtested (the 4-phase length/feel).

REVISED SHIPPING AUDIT:
- Q1 edge SE ✅ · edge PM ✅ (decompose→target→deliver→accept→round-trip) · Q2 ⚠️ SPINE-040 intro-visuals
  still unbuilt · Q3 signal ✅ · Q4 Open-Claw/PC-043 ✅ IN-APP PROXY (was ❌). Remaining ship-gaps:
  SPINE-040 intro-visuals (visual), and the optional ARC-14 integrate + SWARM-BOARD (new mechanic).

NEXT:
- SPINE-040 intro-visuals is now the top remaining gap (needs user to see the feel). Then optional polish:
  ARC-14 integrate/SWARM-BOARD; back-half consolidation (OQ-0010 [C]); deploy readiness.

### FL-0051 — POST-TEMPLATE REDESIGN: bespoke concrete exercises (pilot on 08-03)

STATUS: pilot implemented — awaiting user verdict on the direction
PHASE: PRE-SHIP content-FORM redesign (supersedes the "everything is a mechanic-board" reflex)
RULE_REFS: NG-002/004/005, LR-011c, PC-004, the statr comparison (2026-06-22)

THE CRITIQUE (user, after studying their statr app — Flask R-tutor, 343 questions / 17 ch / 8 formats / runs R):
- Our app forced ONE template onto everything: abstract "you-are-the-director, here's a scenario + constraint,
  pick the better approach", phrased "Wie machst DU X?". Variety of WIDGET, zero variety of FEEL. It reads as
  AI forcing a template that worked once onto every question. statr feels natural because: (a) questions are
  CONCRETE about real material (actual R code, real data, verifiable output), (b) phrased impersonally about
  the MATERIAL not the learner, (c) FORMAT follows the material (code-output / completion / interpret / match /
  spot / T-F), (d) high DENSITY (~20 items/chapter vs our ~1-2/node). Honest self-criticism: the last ~10
  turns I doubled down on the broken template (ARC-11/12/13 all tradeOffDuel/pick + scenario/constraint).

THE FIX (piloted):
- New bespoke EXERCISE block (`lessonModel.ts`: Exercise = pick | spot; `ExerciseView.tsx`) — NOT routed
  through a mechanic engine, NO scenario/constraint wrapper, impersonal concrete phrasing. A lesson hosts
  SEVERAL DIFFERENT exercises; completion gates on answering them all (LessonView + LessonBlockView wired).
- NODE-08-03 Prompt Injection rebuilt GROUND-UP as the pilot: 4 exercises, each a different angle+format on
  the same concept — (1) SPOT the injection in a real ticket (tap the attack line, an HTML-comment payload);
  (2) read a TRACE, why did it exfiltrate (data treated as instruction); (3) which DEFENSE actually stops it
  (data≠instructions) vs the prompt-rule that injection overrides + the spam-filter that misses it; (4) BLAST
  RADIUS — same injection, read-only tools → contained. Concrete material shown (ticket text, trace, code),
  natural phrasing ("Welche Zeile ist der Angriff?"), per-option `why` on reveal, one-line takeaway.

WHY:
- The user's core bar: "could people tell it's AI? then it's bad — we want a real feel." The template WAS the
  tell. This proves the app can deliver statr's concrete, varied, natural feel for AI-native topics.

QA:
- build green; `npm test` 153 (+2: exercise content-integrity [one correct/attack, non-empty texts] +
  answer→complete flow on 08-03). "renders every slice lesson" exercises the new renderer.

THE BIG DECISION (user's call — do NOT roll out unilaterally):
- The user said: every node must be re-evaluated FROM THE GROUND UP — deep reasoning on what/why/how each
  concept is taught, which angles give the biggest ROI, then bespoke interactive "gameplay" per exercise. This
  is a re-authoring of ~53 nodes' content FORM (engines stay available where a board genuinely fits, but stop
  being the default). Massive scope. Pilot first → user reacts → then per-arc ground-up rework.

NEXT:
- User plays/looks at 08-03 and says if this is the feel. If yes: pick the next node, repeat the ground-up
  process; build more exercise formats as the material demands (predict-output, completion, interpret, match,
  order) — each conceived for its concept, not templated. Likely retire/relegate the scenario/constraint
  tradeOffDuel framing.

### FL-0052 — Monochrome "polygon typer" visual pass + 2nd bespoke pilot (05-03), HARD

STATUS: implemented — awaiting user verdict on feel
PHASE: PRE-SHIP content-FORM redesign (cont. of FL-0051)
RULE_REFS: LR-011a/b/c/d, the statr comparison, VSS-101 (colour rare/thin/borders-only)

VISUAL (user direction: "black & white monochrome polygon typer feel, rare+thin colour — only borders,
not filled — two-dimensional"):
- `index.css` @theme retoned monochrome/flat: bg #0a0a0a, surface #121212, border #2e2e2e, accent #ededed
  (near-white — selection is BRIGHTNESS not hue), desaturated status colours used as THIN BORDERS + text only,
  radius 0.25rem (sharp), body font → monospace stack (the "typer" feel; bonus: ranked-list ASCII tables align).
- `ExerciseView.tsx` restyled to thin-border / no-fill: reveal states = border+text only (correct→success border,
  wrong→danger border), Takeaway = `border-l-2` no bg fill, sharp corners.

2nd PILOT — NODE-05-03 Hybrid Search & Reranking, rebuilt GROUND-UP + HARD ("same feel but way harder"):
- 4 exercises, each a DIFFERENT angle, all future-proof (mechanism/judgment, not prompt tricks), statr-flavoured
  with concrete ranked lists + numbers: (1) `pick` DIAGNOSE — read BM25 vs Vektor top-5, locate gold C7 (#1 lex
  / #11 sem) → lexical-blindness; trap = the inverted "semantic always wins". (2) `pick` PREDICT — compute the
  RRF winner (k=60) from two short lists; trap = the #1-in-one-list doc (D-A) instead of the #2-in-both (D-B).
  (3) `multi` HEADROOM — when reranking actually helps; killer trap = "gold not in top-10" (reranker can't fix
  recall) + storage category-error. (4) `pick` DESIGN — exact-code catalog → lexical-first; trap = overbuilt
  "full pipeline auf Nummer sicher".
- Difficulty bar honoured ("could a skeptical senior slip if careless?" — yes on all 4). Options shuffled at
  render (no fixed answer position), no telegraphing hints (no "stupid AI tagging").

WHY:
- Two user asks in one: the FORM felt like AI-template-slop visually AND the pilot was "too simple". This pins
  both — a 2D monochrome look that matches the typer/terminal feel, and a node where the concrete material does
  the teaching and a careless reader genuinely fails.

QA:
- build green; `npm test` 153/153 (visual edits compile; new node's 4 exercises pass the content-integrity gate;
  "renders every slice lesson" exercises the renderer under the new theme). Node count 54, lessons 53.

### FL-0053 — Pure-B/W refinement + two-font split + geometry + responsive + slop-tagline kill

STATUS: implemented — awaiting user verdict on feel
PHASE: PRE-SHIP visual + content-FORM (cont. of FL-0052)
RULE_REFS: LR-011e (new — no motivational meta-filler), VSS-101, PC-060, PH-202

USER FEEDBACK (2026-06-21): "totally white and totally black, not that many greyscales"; "use more geometry
objects"; "a little laggy"; "don't use the typer typography for everything — just clickable things, the rest a
normal blocky font that fits the typer look"; "add responsive design, shouldn't look THAT much like mobile on
desktop"; two header taglines are "useless AI style tagline / no information just slop".

VISUAL (`index.css`):
- Palette pushed to PURE black/white + exactly ONE working grey (#8a8a8a text) and one dim border-grey (#333,
  new `--color-deck-border-dim`). Default border is now pure white (#fff) — stark hairlines are the structure.
- Zeroed the whole Tailwind radius scale (`--radius-xs…3xl: 0`) → blocky everywhere with NO 73-site sweep
  (rounded-full dots stay circular). 
- TWO fonts: `--font-sans` (system grotesque, body/reading) + `--font-typer` (mono). Global rule puts the typer
  face ONLY on clickables (button/a/[role=button]/inputs) + code/pre — everything else reads in sans.
- Removed `backdrop-blur` from AppHeader + BottomNav (the mobile lag source); flat solid-black bars + white
  hairline. No blur/shadow/gradient anywhere (grep-clean).
- Swept all 67 `slate-*` (bluish) utilities → white / deck-muted / deck-border-dim (perl, whole src).

GEOMETRY (`ExerciseView`, primitives): square ■ mark opening every exercise; ■/□ block checkboxes; selection =
INVERSION (white block / black text); idle option borders are dim (not a wall of white); Badge + Button sharp,
border/text-only, uppercase tracking.

RESPONSIVE (`AppShell`/`AppHeader`/`BottomNav` + new `navItems.ts`): mobile = bottom-tab bar (unchanged feel);
desktop (`md:`) = content column widens to `max-w-3xl` with white side-rails (reads as a deliberate framed
panel, not a stretched phone), and the nav moves into a TOP bar in the header (`BottomNav` is `md:hidden`).

SLOP KILL: removed the per-mode `tagline` field from `lessonModes.ts` + its render in `LessonView` (codified as
LR-011e). NODE-05-03 note rewritten from meta ("erst lesen, dann rechnen…") to real prior-context (what
BM25 / vectors / hybrid / reranking ARE) — which is also the difficulty-fairness anchor.

DIFFICULTY: user confirmed 05-03 is "hard enough" and the calibration bar — solvable WITH prior-node context,
too-hard WITHOUT any. Kept as-is.

QA:
- build green; `npm test` 153/153. No new tests needed (theme/layout-only + data-field removal; existing
  "renders every slice lesson" + content-integrity cover it).

FOLLOW-UPS (same-session user feedback, 2026-06-21):
- BUG FIX (multi-select reveal): a correct answer the learner MISSED was painted red (mistake = picked !==
  correct), which reads as "this option is wrong". Now coloured by TRUTH: a correct answer is ALWAYS green
  (with a "Verpasst." tag if unselected); red is reserved for a wrongly-picked option ("Falsch gewählt.").
  `ExerciseView.MultiExercise`.
- DESKTOP GRID (use the width): `LessonView` lays exercise lessons out as a 2-col grid at `md:` with dense
  flow — intro blocks + heavy exercises (multi/spot/pick-with-code) span both columns, a plain pick takes one,
  so two short questions sit side by side. Mobile stays single-column; challenge lessons stay single-column
  (sequential reveal). `blockColSpan()` helper.
- REMOVED the per-node time estimate ("ca. N Min") from the lesson header — user: "SO off and totally wrong
  always". Field kept in the model (harmless), just not rendered. Only render site was `LessonView`.
- 3rd ground-up node built: NODE-07-03 Grounding Evaluation (spot · pick · multi · pick; grounded≠correct,
  decompose-and-check, eval-method). build green, content-integrity passes.
- WIDTH v2: desktop column widened again (md:max-w-4xl → lg:max-w-6xl → 2xl:max-w-7xl; header kept in sync) —
  the 3xl cap only used ~60%.
- EQUAL HEIGHT: removed `md:items-start` so grid rows stretch to equal height; exercise card is now
  `flex h-full` with `justify-between`, so the SHORTER of two side-by-side questions distributes the slack
  (a few extra spaces) to match its neighbour instead of leaving an empty box. Mobile unaffected (no stretch).
- 4th ground-up node built: NODE-07-02 Task Success & Regression (pick table-read · multi signal-vs-noise ·
  pick ship-decision · pick success-criterion; trap incl. "delete the failing case from the eval"). green.
  Nodes redone ground-up so far: 08-03, 05-03, 07-03, 07-02 (4 of ~53).

### FL-0054 — Puzzle-game mechanic library (11 new bespoke exercise types) + 8 nodes

STATUS: implemented — awaiting user verdict
PHASE: PRE-SHIP content-FORM redesign (cont. of FL-0051/0053)
RULE_REFS: LR-012a (new), LR-011d, LR-013

USER FEEDBACK (2026-06-22): "these 3 [order/categorize/match] are valid but not enough — I want at least 8 more
puzzle-game mechanics for the MVP." Worked autonomously (+ a background research subagent that returned 12
fully-worked mechanics with example content; folded the best in).

DELIVERED — 11 NEW mechanics (14 total with pick/multi/spot), each a focused component in
`src/features/lessons/exercises/` + a `lessonModel.Exercise` union member, dispatched by `ExerciseView`; all
single-submit, tap-first, mobile-safe, brutalist (thin-border reveal + per-item `why`), options/right/pool
shuffled at render:
- order, compose (select-belonging-blocks + order; pool has distractors)
- categorize (N buckets), match (connect left↔right), cloze (fill config/schema blanks from chips)
- stepwise (predict each trace step's verdict), multispot (tap ALL offenders)
- diff (tap the changed line that breaks it), contradiction (conflicting line across two panes)
- budget (allocate a cap; DETERMINISTIC checker — ranges + total, no stored answer)
- threshold (one slider; DETERMINISTIC — admit/reject must match labels)

SHARED: `exercises/shared.tsx` (ExerciseBody h-full/justify-between for grid equal-height, Stem, Takeaway,
CodeBlock, Intro). `LessonView.blockColSpan` makes every rich mechanic span 2 desktop cols (only a bare pick
stays narrow).

AUTHORED INTO 8 NODES (ground-up, HARD, concrete material, no telegraphing): 05-01 RAG Basics (compose+pick),
05-02 Lexical vs Semantic (categorize+match+pick), 02-01 Context Budget (budget+order+pick), 03-02 Structured
Outputs (cloze+pick), 04-05 Agent Loop (stepwise+pick), 07-03 Grounding (+contradiction, now 5 ex), 08-01 Least
Privilege (multispot+diff+categorize), 08-02 Approval Gates (threshold+pick). Content seeded from the research
agent's examples (ReAct cost-trace, context-budget, RAG config, ingestion pipeline, SQL-perms diff, pricing
grounding, moderation threshold), translated to German + hardened.

QA:
- build green; `npm test` 167/167 (+14). NEW: `tests/exerciseMechanics.test.tsx` drives all 14 formats to
  completion (onAnswered fires); `tests/lessons.test` integrity switch validates every format (incl. budget
  feasibility: sum(min)≤total≤sum(max); threshold separability: max(reject)<min(keep); compose: ordered⊆pool &
  has distractors). Repointed 2 framework tests (challenge/multi-view) off LESSON-02-01 onto registry fixtures
  (ALLOC-BASE/CBB-BASE) since that lesson migrated to exercises.
- Mechanics redone ground-up so far: 08-03, 05-03, 07-03, 07-02, 05-01, 05-02, 02-01, 03-02, 04-05, 08-01,
  08-02 (11 nodes). Every Exercise format is now exercised by ≥1 shipped node.

FOLLOW-UPS (same-session, 2026-06-22):
- NEW 12th mechanic `annotate` (`AnnotateExercise`): read a BIG agent response and tap the red-flag segments;
  a `legend` teaches WHICH tells to look for up front, reveal labels each flag with category + why + fix. Built
  per user ask ("big responses where the user spots the hints... taught where to look for what"). Wired +
  integrity (≥1 flag) + interaction test. Total formats now 15.
- BIGGER SCENARIOS (user: "bigger pseudo-codes... more like 20 lines"): NODE-07-04 Traces & Postmortems rebuilt
  with an 18-line agent trace as `multispot` (5 red flags: ungated 2 500 € refund, blind non-idempotent retry,
  swallowed errors, redundant loop, no audit) + a pick on the timeout≠failed double-refund risk. NODE-04-04
  Evaluator-Optimizer rebuilt with the `annotate` exercise (8-segment draft answer, 5 tells: fabricated
  precision, ungrounded causation, unrequested delete, hidden hedging, filler) + a pick on evaluator criteria.
- QA: build green; `npm test` 168/168 (+1 annotate interaction). 13 nodes now ground-up; 15 mechanics shipped.
- ROLLOUT cont. (2026-06-22): +6 nodes ground-up → 07-01 Eval Harness (multispot over a flawed eval set),
  03-01 Tools Are Interfaces (14-line tool-schema cloze + match + pick), 06-01 Session vs Project Memory
  (categorize), 02-02 Context Noise (multispot over an assembled context, evict the noise), 04-02 Workflow
  Patterns (match pattern↔fit), 06-02 Decision Logs (annotate a weak log entry). **19 of 53 nodes now on the
  bespoke-exercise form** (34 still embedded-challenge); all 15 mechanics in active use. build green, 168/168,
  no slop tells.
- ROLLOUT cont. (2): +5 nodes → 03-03 Constrained Decoding (stepwise over a JSON decoding trace, predict
  allow/block), 02-03 Context Compression (categorize verbatim/summarise/drop), 02-04 Context Isolation
  (categorize isolate/main), 04-03 Orchestrator-Worker (match roles), 08-04 Sandboxing & Governance (diff a
  sandbox config that voids containment + multispot governance gaps). **24 of 54 nodes** now bespoke. build
  green, 168/168, no tells. Remaining 30 = ~15 knowledge nodes (foundations, retrieval tail, repo/team, MCP,
  memory) + the DIRECTION track (dir*) and capstone* which run on purpose-built mechanic engines (open
  question whether to convert those too).
- ROLLOUT cont. (3): +6 nodes → 03-04 MCP & Tool Ecosystems (match roles + pick on the trust boundary),
  05-04 Contextual Retrieval (categorize dangling-ref chunks + pick), 04-01 Workflow vs Agent (categorize
  task-shape + default-bias pick), 09-01 Repo Legibility (multispot illegible traits), 09-02 Conventions &
  Small Components (diff the flag-parameter smell), 09-04 Team Scale (match scaling concepts + bottleneck-
  shift pick). **30 of 54 nodes** now bespoke. build green, 168/168, no tells. Remaining knowledge nodes (9):
  augmentedLlm, agentLearningLoops, icebergModel, longRunningProjects, paperVisualRetrieval, sourceMaterialOs,
  simplicityBeforeAgency, whatAiEngineeringBuilds, systemLayersMap — then only dir*/capstone* engine nodes.
- ROLLOUT cont. (4) — KNOWLEDGE-NODE ROLLOUT COMPLETE: +9 nodes → 00-01 What AI Eng Builds (categorize
  AIE/MLE), 01-01 Augmented LLM (match augmentation↔fix), 00-02 Iceberg (categorize tip/deep), 01-02
  Simplicity before Agency (order the complexity ladder), 01-03 System Layers (match layer↔responsibility),
  09-03 Source Material OS (match doc↔purpose), 06-03 Agent Learning Loops (annotate weak learnings), 06-04
  Long-Running Projects (multispot drift gaps), 05-05 Visual Retrieval (categorize visual/text). **39 of 53
  nodes bespoke; ALL knowledge nodes now converted.** build green, 168/168. Remaining 14 = the DIRECTION track
  (10× dir*) + 4 capstone*, all on purpose-built scenario engines — leave unless the user opts to convert.
  All 16 exercise formats are in active use across shipped nodes.
- ROLLOUT COMPLETE (user chose "convert them too"): +14 nodes → DIRECTION track 11-01..13-03 (categorize,
  annotate-the-brief, categorize, budget-oversight, categorize-boundaries, order-deps, multispot-swarm-board,
  order-priority, annotate-review-vs-brief, and 13-03 Direct-the-Build as a 4-phase round-trip: cloze brief →
  order decompose → pick diagnose → pick accept) + CAPSTONES 10-01..10-05 (categorize scope, multispot+pick
  failure injection, multispot+pick eval-gate, annotate the ship report for overclaims). **53 of 53 lessons
  are now on the bespoke puzzle-exercise form — the embedded-challenge template is fully retired from content.**
  build green, 168/168, no tells. Format spread across the curriculum: pick 59 · categorize 14 · multispot 10 ·
  match 9 · annotate 6 · order 5 · multi 4 · diff 3 · cloze 3 · stepwise 2 · spot 2 · budget 2 · threshold 1 ·
  contradiction 1 · compose 1. NOTE: the old lab/mechanic scenarios are now orphaned (still registered + tested,
  no lesson embeds them) — a future cleanup could prune them from the bundle.

### FL-0055 — Build Campaign: the production capstone (stateful strategy-game build sim)

STATUS: implemented
PHASE: PRE-SHIP — closing the recognition→production gap
RULE_REFS: PC-043 (Open-Claw exit proof), the self-eval critique (recognition ≠ building)

WHY (user, after my honest self-eval): "create nodes to simulate building. like a strategy game the user gets
a big project at the end where all things taught get used." The whole curriculum was recognition/judgment
(pick/categorize/spot) — no production. This adds a simulation of DOING the director's job with consequence.

WHAT — a new stateful engine, NOT another exercise:
- `features/campaign/campaignModel.ts` — pure logic: `CampaignState` (quality/security/scope meters + a finite
  `oversight` resource + `flags`), `applyOption` (clamp + spend + flag), `canAfford`, `nextStageIndex` (branching
  via per-stage `when(flags)`), `scorecard` (WEAKEST-LINK: a low critical meter caps the grade — you can't average
  past a security hole; A–F + shipped/not + causal postmortem lines).
- `features/campaign/BuildCampaign.tsx` — the UI: a persistent HUD (meters + oversight, mono bars, danger when a
  critical meter <45), staged decisions, per-choice consequence reveal, then a launch scorecard. Brutalist, tap-first.
- `content/campaigns/shipKlauspilot.ts` — the authored campaign: direct the build of an AI support assistant
  (RAG + refund/escalate) across 9 decisions using EVERY taught skill (brief → architecture → boundaries →
  oversight → triage → evals → incident → accept). Consequence loop: choosing the ungated refund early literally
  swaps which Day-2 incident fires, and (ungated-refund × untested/unfixed) → "KATASTROPHE: money drained, postmortem
  instead of launch." Oversight is scarce, so thorough choices trade off against each other.
- Wired as a new lesson block kind `campaign` (lessonModel + LessonBlockView + LessonView treats it like a
  challenge for completion). New terminal roadmap node NODE-13-04 "Ship It: The Build Campaign" (order 55, prereq
  13-03), lesson `buildCampaign.ts`, registered in index; 13-03 now unlocks 13-04.

QA: build green; `npm test` 176/176 (+8). NEW: `tests/campaign.test.ts` (pure logic: clamp/afford/branching +
strong playthrough ships A–C with no catastrophe + ungated-refund shortcut → catastrophe + F + blocked launch +
weakest-link scoring) and `tests/campaignRender.test.tsx` (drives the UI through every stage to the scorecard,
onComplete fires once). roadmapStatus node count 54→55; coverage/traversal green (55 nodes).

HONEST SCOPE: this closes the JUDGMENT-UNDER-CONSEQUENCE half of the gap (you live with your decisions; the
scorecard traces choices→outcome) — it is the in-app proxy for directing a real build. It does NOT execute code
or use real tools (still a simulation). The remaining gap (wire the real stack, ship a real repo) stays a
prescribed-external-project away — but the campaign now supplies the judgment that makes such a build succeed.

### FL-0056 — "Werft": a persistent, levelling build-sim (Clash-of-Clans-style base-builder)

STATUS: implemented
PHASE: PRE-SHIP — the management-sim the user asked for ("a simulation… with stats… that levels, where new
things get added and need to be bought, like new .MDs… a bit like Clash of Clans")

WHAT — a new persistent top-level screen (`/build`, nav tab "Werft"), not a lesson:
- `features/buildgame/gameModel.ts` — pure economy: `GameState` (budget, xp, releases, sprintsLeft, per-building
  levels, log), a 15-building CATALOG across docs(.md)/layers/team + a Project-Charter "town hall" whose level
  IS your Tier and GATES what's buildable (levelling it unlocks new tiers of docs/layers/team — the "buy new
  .md as you level"). Four stats (quality/security/velocity/resilience) DERIVED from built levels. Actions:
  `runSprint` (small budget, capped 3 per release), `shipRelease` (the risky "raid": defense = weighted stats
  vs a threat that scales with releases → clean / hotfix / incident, incident narrative tied to your weakest
  stat; refills sprints). Persists to localStorage (versioned, fail-safe). All pure + unit-tested.
- `features/buildgame/BuildGamePage.tsx` — HUD (budget/tier/releases/xp + 4 stat bars), sprint/ship actions
  with a live release-readiness gauge (Abwehr vs Bedrohung), per-cluster building rows, log. Brutalist, mobile.
- `features/buildgame/SystemBlueprint.tsx` — the VISUAL (user's idea): bird's-eye blueprint, a Core (Charter)
  AUTO-WIRED to three clusters (Docs/Layers/Team); connectors light white once a cluster has anything built;
  tapping a cluster opens its "folder" of buildings below. Merges both of the user's pitches (2D auto-connect +
  expandable folders) and fits brutalist (lines are the design). SVG viewBox lines + absolute-positioned nodes.
- Wired: `routes/paths.ts` + `router.tsx` (lazy) + `navItems.ts` (5th tab "Werft").

QA: build green; `npm test` 186/186 (+10). `tests/buildGame.test.ts` (economy: tier-gating, buy spends+raises
stats, sprint cap, fresh release fails / built-up ships clean + refills, catalog integrity) +
`tests/buildGameRender.test.tsx` (blueprint + HUD render, cluster→folder expand, sprint logs a gain).

VISUAL v2 (user direction: "busier, map-like with drag+zoom not bound by size; KNIME-style nodes; skilltree as
a separate button = the shop, sorted by topic & depth"):
- `SkillCanvas.tsx` — a generic PAN/ZOOM canvas (custom, no deps): drag to pan, wheel + pinch to zoom, +/−/⊙
  buttons, fit-on-mount. KNIME-style nodes (bordered box + status pip + input/output port nubs) as HTML in a
  transformed world; wires as one SVG behind them (white when both ends built, dashed-grey otherwise). Tap a
  node (without dragging — moved-threshold guard) selects it.
- `graphs.ts` — two layouts of the same buildings: `systemMapGraph` (KNIME left→right DATAFLOW: User → RAG →
  Modell → Tools → Antwort, docs as a top control-plane band, layers/team attached) and `skilltreeGraph`
  (top-down PREREQUISITE tree by branch+depth = the SHOP). Node state = built/partial/available/locked/fixed.
- Skilltree prerequisites added to the model: `Building.requires`, `requiresMet`, `canBuy` enforces them
  (decisionLog→featureLedger→projectMemory→sourceMaterialOs; rag→evals→observability; rag→approvalGate→sandbox→
  governance; firstBee→pod→directorPod). The tree IS the shop: tap a node → buy/upgrade panel (charter too).
- `BuildGamePage` reworked: a Skilltree·Shop / System-Karte toggle over the shared canvas + a selected-node buy
  panel; HUD/actions/log unchanged. Old cluster-blueprint + folder list removed (`SystemBlueprint.tsx` deleted).
- QA: build green; `npm test` 187/187 (tests updated: tier+prereq gating, canvas renders, node→buy panel, map
  toggle shows infra nodes, sprint logs). Pan/zoom is pointer-event based (works touch + mouse).

DEEP EXTENSION v3 (user: "feels like a whole app on its own… many skills, new variables that make new skills
needed, scaling system, big playground… not just one way to do it"). gameModel rewritten with a compact DSL:
- **~53 skills** across 7 branches (docs 10 · agents 9 · evals 8 · security 8 · team 8 · retrieval 7 · context
  4), each a prerequisite chain that EVOLVES — e.g. docs: scratchNotes(memory.md) → split into instructions.md +
  memory.md → decision log → feature ledger → [XXX-000]-Konvention → Source-Material-OS (the Pod-based-SE doc
  control plane). Charter tier gates depth.
- **World variables w/ feedback loops** (the "new variables make new skills needed"): `drift` + `debt` erode
  release defense and only the right skills hold them down (docs → drift resist; conventions/decomposition →
  debt resist); `scale` grows every release and raises the threat unless you build orchestration/observability/
  governance (scale-handling). `trust` from clean releases. Ship() advances the world each release.
- **Scaling**: threat = 30 + releases·8 + scale·(1 − scaleHandling); a fresh weak system fails, you must build
  up AND keep drift/debt down to keep shipping.
- **Multiple strategies**: defense = 0.35·quality + 0.4·security + 0.25·resilience, and each of those is feedable
  from several branches (quality ← retrieval/evals/agents/context; security ← security/observability; resilience
  ← docs/evals/context) → no single dominant path; branch roots are free entry nodes.
- graphs.ts now AUTO-LAYS OUT (branch × depth) so new skills slot in; HUD shows the 4 world variables (drift/debt
  red when high). Persistence bumped to v2 key.
- QA: build green; `npm test` 188/188 (engine: tier+prereq gating, world advance on ship, drift-resist loop,
  strong-low-drift ships clean, catalog integrity; render: variables HUD, node→buy, map toggle, sprint).
- NOTE (saved to memory): product vision = Odin/roadmap.sh/Build-Your-Own-X level (future-proof system design +
  real AI use + ROI); the Werft is to be a standalone deep playground. Visual polish (real dataflow map / KNIME
  elbows / animation) still deferred per user.

DEPTH + VISUALS v4 (autonomous overnight session, user: "continue as far as possible… visual work and game
mechanics"). All green, `npm test` 194/194, build clean.
- MECHANICS: (1) **Synergies** — 9 combos (e.g. RAG+Grounding-Eval, Decision-Log+[XXX-000], Orchestrator+
  Observability) grant bonus stats → rewards diverse, multi-branch builds ("not one way"). (2) **Missions** —
  12 goal-driven objectives auto-granting budget/XP (build 3 · tier 2 · RAG · first/clean release · drift<8 ·
  security≥35 · regression-gate · tier 4 · scale≥50 release-ready · Source-Material-OS · 5 clean) via
  `applyMissions` after every action. (3) **Events** — 5 deterministic consequences of a neglected branch fire
  on ship (injection if security low + no defense; blackout if scale≥40 + no observability; drift-crisis;
  debt-crunch; audit-pass reward) → makes specific skills matter. (4) **Prestige** — refactor & restart at 5
  clean releases for a permanent +3/stat legacy bonus (long-term replay). State v3→v4 (cleanReleases,
  missionsDone, prestige).
- VISUALS: KNIME **elbow wires** (orthogonal paths, animated stroke), **branch headers** (column/lane labels),
  **level pips** + KNIME **status light** (green/amber/outline = built/partial/available) + ports per node, and a
  **dataflow spine on the Map view** (User → Modell → Tools → Antwort with key skills wired in). Skilltree
  (=shop) and Map are the two pan/zoom views; the prereq panel now lists "Braucht: X ✓/○".
- TESTS: `tests/buildGameSystems.test.ts` (synergy bonus, mission auto-grant + idempotent, mission predicates,
  event triggers + healthy-system-no-event, prestige unlock + legacy). buildGame/buildGameRender updated.
- STILL OPEN (deferred): map-vs-tree dataflow could be richer; balance tuning by playtest; node art/animation
  polish; possibly tie lesson completion → in-game budget. Not yet eyeballed on device.

### FL-0057 — Werft v5: placement = architecture (request phases), two-view contract, light mode, fullscreen HUD

Two views made DISTINCT + mutually dependent (user direction). Skilltree = SHOP (tidy-tree of all ~53 skills,
buy/level). System-Karte = PLACEMENT, and placement now TEACHES: the map is six ordered request-phase lanes
(`Zone` = boundary→knowledge→model→tools→check→ops). Owned-but-unplaced wait in a "Lager" band; drag into a lane.
RIGHT phase → ✓ + the skill's primary-stat bonus (`PLACE_BONUS`, which feeds `releaseDefense` so good ordering
ships safer); WRONG → ✗ + a one-line lesson. New `gameModel`: `placed: Record<id,Zone>`, `zonesFor`/
`canonicalZone`/`isCorrectlyPlaced`/`architectureScore`/`placeNode(s,id,zone)`. NO preview of un-bought skills.
- Global LIGHT MODE: `html.theme-light` re-points `--color-white`/`--color-black` + deck tokens → the whole B/W
  app inverts in ONE CSS block (Tailwind v4 utilities resolve to those vars). Toggle in AppHeader; `lib/useTheme.ts`.
- FULLSCREEN OVERLAY HUD (user: "like YouTube fullscreen controls"): `/build` main is full-bleed + `overflow-hidden`;
  the canvas fills the screen and the HUD floats over it (top-left title/toggle/coach, bottom control bar, right
  Details drawer, floating SelectedPanel). `SkillCanvas` gained `fill` + lane `dividers` + correctness `mark`.
- Fixes: tap-select moved to `pointerup` (capturing the pointer retargeted the click → buying silently failed on
  touch); selected node = full INVERSE highlight (the old white-on-white ring was invisible).

### FL-0058 — Werft v6–v7: kill the economy death-spiral + tier-up clarity + node InfoBox + reset-confirm

User: "releasing over and over and losing money feels terrible if there's nothing you could do." A FAILED release
no longer hardens the world — in `shipRelease`, scale/drift/debt only grow on a SUCCESSFUL ship; incident penalty
cut. Tier-up = upgrade the Charter (costs budget); the coach surfaces this via `tierCapped(s)` and stops pushing
doomed releases (guides defense-first). Per-node **InfoBox** (ℹ button on the node panel) holds full details + the
placement lesson, off the map. Reset now needs a Ja/Abbrechen confirm.

### FL-0059 — Werft v8: Plague-Inc real-time clock + interactive event bubbles + real info texts

User: "yes I want the full Plague Inc Time idea implemented." Manual Sprint removed (it allowed infinite-money
clicking). `tick(s)` advances one in-game DAY on an interval while the player presses ▶/▶▶/▶▶▶ (paused by default;
slowed to 2.2s/day at 1×): passive `dayIncome` accrues, drift/debt creep unless docs hold them, and an
AUTO-RELEASE fires every `RELEASE_EVERY` (12) days. Weaknesses surface as tappable EVENT BUBBLES
(`GameState.events`; `EVENTS` now carry `text`/`hint`/`good`): tap in time → `handleEvent` mitigates (bad) /
collects (good); ignore → `resolveExpired` lands the penalty. Clock loop in the UI via a `csRef` + `setInterval`.
- CONTENT: new `features/buildgame/nodeInfo.ts` — real 1–3-sentence explanations for every node + 2–3-line phase
  texts (`NODE_INFO`/`ZONE_INFO`), replacing the short "AI hero-phrases" (user complaint). A test enforces every
  node + phase has substantial copy so none can regress to a stub.

### FL-0060 — Werft: full keyboard control + breathing-dot background + mm:ss clock

Full keyboard layer (user-specified; `H`/`?` opens a cheat-sheet, `⌨` button too): F Shop · Q Karte · Space =
buy-when-a-node-is-selected else time play/pause · WASD/Arrows = pan (or, with a node selected: navigate selection
SPATIALLY in the Shop / move the node's phase on the Karte) · Shift+move = zoom · Tab cycle select · X unplace ·
T info · R release · C details (+ W/S scroll) · Esc close. Bound once on `window` reading a `kb` ref (latest
view/selected/… + node positions, avoids stale closures). `SkillCanvas` is now `forwardRef` exposing `panBy`/
`zoomBy` (`SkillCanvasHandle`). Time deliberately slowed + a cosmetic **mm:ss** counter and a breathing dot-grid
"paper" background (animates only while the clock runs; respects `prefers-reduced-motion`) signal that time moves.
- QA across FL-0057..0060: build green; `npm test` 208/208 (+ placement/zone, theme, time-clock, event-handle,
  content-completeness, keyboard tests). Persistence stepped v4→v8. NOT yet eyeballed on a device by the agent.

### FL-0061 — Werft × Roadmap "Quests": learning funds + unlocks the game (Phase 1, engine bridge)

The two halves merge into one loop (DEC-0014 follow-up; spec docs/superpowers/specs/2026-06-26-werft-quests-design.md;
user reward model = "Geld + Skill-Unlock / learn it to build it"). Completing a roadmap node grants one-time
**Budget** and **unlocks its Werft skill(s)** — mapped skills are unbuildable until their lesson is done; the
"starter kit" (unmapped: charter/soloDev/scratch/instructions/smoke/vectorStore/firstBee) is always free.
- `content/werft/questMap.ts`: all 55 nodes → `{ title, budget, skills?, charterTier? }`, arc≈branch (02→context,
  04→agents, 05→retrieval, 06→docs, 07→evals, 08→security, 09+11+12→team/direction); `SKILL_QUEST` inverse;
  capstone 10-05 / 13-04 are Charter-tier keystones (6 / 7). `isQuestSkill`.
- `features/buildgame/questBridge.ts`: `reconcileQuests(s, completedNodeIds)` — idempotent budget grant
  (`GameState.questsClaimed`), `learned` set, charterTier bump; returns same ref when nothing changed.
- `gameModel`: `GameState.questsClaimed`/`learned` (v8→v9), `canBuy` quest-gate ("Quest nötig"), `isQuestSkill`.
- `BuildGamePage` consumes `useProgress`, reconciles on change; SelectedPanel shows a 🔒 quest-lock notice with
  the node title. **`/` now redirects to the Werft** (OQ-A: Werft is the default mode; roadmap stays a tab).
- QA: build green; `npm test` **212/212** (+ `werftQuests.test.ts`: grant-once/idempotent, multi-skill unlock,
  charterTier keystone, canBuy gate, catalog integrity vs BUILDINGS + roadmap nodes). render tests wrapped in
  ProgressProvider. NOT yet eyeballed on device.

### FL-0062 — Werft × Roadmap Quests Phase 2: in-game quest board + lesson deep-links + nav cleanup

The roadmap is now reachable AS quests from inside the Werft, closing the loop UI-side.
- `features/buildgame/QuestBoard.tsx`: a left-drawer board built on the existing `useRoadmap()` (status per node
  from progress) — arcs → nodes with status icon (✓/▸/○/🔒) + a reward chip (`+N € · schaltet <Skill> frei` /
  `✓ eingelöst`). Tapping a node opens its lesson (`firstLessonForNode(node.id)` → `paths.lesson`). Opened via a
  **Quests** toolbar button + the **J** keybind (Esc-aware; added to KeyHelp).
- SelectedPanel quest-lock gets a **"Zur Lektion →"** deep-link (`BuildGamePage` now `useNavigate`); the coach
  nudges newcomers to the quest loop once the 3 starter skills are built (`cs.learned.length === 0`).
- Nav cleanup: dropped the redundant "Start" item (it now redirected to the Werft anyway); `navItems` leads with
  **Werft**, then Roadmap/Review/Visual Lab. AppHeader/BottomNav `end` matching simplified (no `paths.home` in nav).
- QA: build green; `npm test` **213/213** (+ quest-board render test: board lists a node + its reward chip).
  NEXT (deferred, OQ-0013): balance/onboarding tuning on device; maybe a "recommended next quest" coach line; a
  win/end state. NOT yet eyeballed on a device by the agent.

### FL-0063 — Quest lesson returns to the Werft + an optional, replayable onboarding tour

- **Return-to-Werft:** opening a lesson from the Werft (quest board / "Zur Lektion") now appends `?return=werft`;
  `LessonPage` reads it (`useSearchParams`) and on completion navigates back to `/build` (where the reward +
  unlock land) instead of the roadmap — being dumped on the roadmap after a quest was confusing (user). The
  back-link label also flips to "Werft". Lessons opened from the roadmap still return to the roadmap.
- **Onboarding:** new `features/buildgame/Onboarding.tsx` — a 6-step brutalist modal (Willkommen · Zeit ▶ · Shop ·
  Quests · Karte · Release/Events) with Zurück/Weiter/Überspringen + progress pips. Auto-shows ONCE
  (`localStorage 'flightdeck.werft.onboarded'`), is **skippable and replayable** any time via "▶ Tutorial ansehen"
  in the Details drawer; Esc-aware (z-50, above other overlays).
- QA: build green; `npm test` **214/214** (+ onboarding render test: auto-show when unseen, skip, replay from
  Details; render tests now set the onboarded flag in `beforeEach` to suppress the auto-tour elsewhere).
- DOC PROCESS: user asked to update these progress docs EVERY prompt (they're the live control plane); now logged
  as a standing instruction (auto-memory `update-progress-docs-every-prompt`).

### FL-0064 — Onboarding made ACTIVE: a guided, do-it-yourself spotlight tour

User wanted the onboarding interactive — spotlight each step and walk WITH the player through real motions, not a
static modal. Replaced `Onboarding.tsx` with `features/buildgame/WerftTour.tsx`:
- 7 steps, mostly GATED on the real deed (auto-advance when done): info → **press ▶** (`speed>0`) → **tap the
  Projekt-Charter** (`selected==='charter'`) → a one-question **example quiz** (so quests feel tangible) →
  **switch to Karte** (`view==='map'`) → **place „Solo (du)"** (`cs.placed.soloDev`) → done. Action steps show no
  skip-ahead button ("↑ mach den Schritt …"); info/quiz steps have Weiter.
- Spotlight: targets are real DOM tagged `data-tour="play|views|canvas"`; a transparent hole + `box-shadow`
  dims the rest, ring on the target, coach bubble flips to the opposite side. The whole overlay is
  `pointer-events-none` so the real UI stays usable — the player actually performs each step. Skippable;
  still auto-shows once + replayable via "▶ Tutorial ansehen" (Details). Driven by live `signals` from BuildGamePage.
- QA: build green; `npm test` **214/214** (onboarding test upgraded: action step has no Weiter, waits for the
  deed; skip + replay). Removed the static `Onboarding.tsx`.

### FL-0065 — Werft flow + goal: recommended-next-quest nudge + a soft win ("System ausgereift")

Flow/goal pass (deferred OQ-0013 items; deliberately NOT blind number-tuning — left for device playtest).
- **Recommended next quest:** `BuildGamePage` reads `useRoadmap().currentNode` (the next available lesson in
  roadmap order) and shows a green "▸ Nächste Quest <title> · Öffnen →" chip under the coach (deep-links via the
  existing `openLesson`, i.e. opens the lesson with `?return=werft`). Hidden once the game is won.
- **Soft win:** `gameModel.isMature(s)` = Charter at max tier (`CHARTER.maxLevel` = 7, only reachable by finishing
  the capstone quests 10-05/13-04) **AND** ≥5 clean releases — i.e. "learned everything + ships reliably". Shows a
  🏆 next to the "Werft" title and a celebratory coach line; the sandbox/Prestige continue (not a hard stop).
- QA: build green; `npm test` **215/215** (+ `isMature` unit test: needs both tier 7 AND 5 clean; render test asserts
  the recommended-quest nudge appears). NOT yet eyeballed on device; balance numbers still await real playtest.

### FL-0066 — Honest skilltree: quest-gated skills now LOOK locked (not buildable)

Bug/inconsistency fix: a quest-gated skill rendered as a poppable "available" node on the Skilltree even though
`canBuy` returned "Quest nötig" — confusing. `graphs.ts` `stateOf` now returns `locked` for a quest-gated,
un-learned skill (before the tier/prereq check), and skilltree nodes carry a `quest` flag; `SkillCanvas`/NodeBox
draws a small **🔒 badge** (top-left, warning) on them. So: bright node = buildable now; dim + 🔒 = learn its
lesson first. Tapping it still opens the SelectedPanel quest-lock + "Zur Lektion →" deep-link (FL-0062). `learned`
threaded through `graphs` via `questLocked(cs,id)`.
- QA: build green; `npm test` **216/216** (+ graphs test: `rag` is `locked` + `quest:true` until NODE-05-01 done,
  then the flag clears; starter `scratchNotes` is never quest-flagged).

### FL-0067 — Publication layer: git/GitHub (AICHITECT), README, MIT, ESLint, CI (DEC-0015)

Repo initialized on `main` (360-file honest snapshot, then per-change commits) and published public:
**github.com/ebuart/AICHITECT** (description + topics set). Added: `README.md` (English; pedagogy-as-CI +
control-plane story, engineering table, honest status incl. German-first content), `LICENSE` (MIT),
package metadata (`aichitect` 0.9.0), `eslint.config.js` (flat; typescript-eslint + react-hooks v7 +
react-refresh) with all 19 pre-existing errors fixed (ternary side-effect expressions → if/else in
ExerciseView/Annotate/MultiSpot; `useState({v})` as ref → real `useRef` in BuildCampaign; uninitialized-let
+ prefer-const + unused import), compiler-lints warn-scoped to `buildgame/**` (OQ-0014g), and
`.github/workflows/ci.yml` (lint + strict build + tests). Local-only files gitignored (.claude*, CLAUDE.md,
.mcp.json, inception scratch docs, tsbuildinfo).
- QA: build green; `npx eslint .` 0 errors; `npm test` 216/216 pre-locale.

### FL-0068 — DE/EN app-chrome locale with persisted toggle (DEC-0015)

`lib/i18n.ts`: `Locale = 'de'|'en'` external store (useSyncExternalStore — no provider), persisted under
`flightdeck.locale`, `initLocale()` sets `<html lang>` before first paint (wired in main.tsx next to
initTheme). Typed chrome dictionary (`en: typeof de` → missing translation = compile error) incl.
parameterized strings (homeProgress/homeNext as functions). Header gets a DE/EN LanguageToggle next to the
ThemeToggle; navItems switched from hardcoded labels to dictionary keys (Werft → "Shipyard" in EN);
BottomNav + ThemeToggle + HomePage localized; EN shows a German-first content notice on Home. Content
translation NOT included (deliberate — rolls out per arc after OQ-0015 content fixes).
- QA: build green; `npx eslint .` 0 errors; `npm test` **221/221** (new `tests/locale.test.ts`: default de,
  stored en, html-lang application, persist+apply, DE/EN dictionaries genuinely differ + EN notice exists).

### FL-0069 — Content polish pass: duplicate/echo/restate fixes + lesson-level quality gates (OQ-0015 a–c)

Six exercises rewritten so each APPLIES its concept in a new situation instead of restating the note:
05-01 `why-rag` (was near-duplicate of 01-01 → now compliance-handbook RAG vs fine-tune vs
whole-book-in-context vs disclaimer), 04-01 `default-bias` (→ operating-cost of a correct agent),
04-03 `when-orch` → `orch-contract-breach` (return-contract diagnostic; also removed the 04-02 echo),
00-02 `iceberg-why` (→ where-to-look-first with a restore-the-demo distractor), 02-01 `budget-principle`
(→ truncation diagnosis correlated with yesterday's change), 02-02 `noise-principle` (→ wrong-source
citations with premise-reading forced). GUARDS: LAZY_FILLER regex now catches the ß spelling
("größeres Modell" slipped through — and was live in 05-01); LR-011a/b/c now also scan lesson exercise
CHOICE surfaces (300+; spot/multispot/annotate/diff exempt — weak lines there are the intended target).
- QA: 229 tests green (incl. 4 new lesson-guard tests).

### FL-0070 — EN pilot arc (DEC-0016): parallel English lessons for ARC-00 + localized exercise chrome

`content/lessons/en/*.en.ts` full Lesson variants for LESSON-00-01/00-02 (translated AFTER FL-0069, so
EN ships the fixed versions); `getLesson(id, locale)` with German fallback; LessonPage locale-aware.
Exercise/lesson chrome (Prüfen/Richtig/Daneben/Verpasst/Lektion abschließen/…) moved into the i18n
dictionary across ExerciseView, LessonView, Order/Budget/Contradiction/Threshold. NEW TEST
`lessonTranslations.test.ts`: EN must mirror DE structurally (exercise ids, option ids, correct flags,
buckets) — a translation cannot silently drift the pedagogy.

### FL-0071 — Werft file split + React-Compiler lint hygiene (closes OQ-0014g)

gameModel.ts 641→483 (catalog/types/zones → `buildings.ts`, re-exported for compat) and
BuildGamePage.tsx 940→497 (`WerftHud.tsx` + `WerftPanels.tsx` + `useWerftKeyboard.ts`). Hook fixes:
csRef/kb latest-refs written in effects (not render); release countdown reads sampled nowMs/tickAtMs
STATE instead of performance.now() in render; SkillCanvas position map = useMemo for render + ref
synced by effect for pointer handlers. `react-hooks/refs|purity|immutability` now pass at ERROR level;
only `set-state-in-effect` stays warn-scoped (two legit external-sync effects: quest reconciliation,
tick-interval arming). 229 tests green; build green.

### FL-0072 — README screenshots + capture script

`scripts/screenshots.mjs` (puppeteer-core + system Chrome against the dev server) captures
werft/roadmap/lesson/lesson-mobile into `docs/screenshots/`; embedded in the README as a 2×2 grid.
Werft shot shows the active onboarding tour; lesson shot is the 08-03 injection spot exercise.

### FL-0073 — control/10 experience-overhaul standard + voice ratchet (DEC-0017)

New control doc: VX voice rules (9 named AI-tells found in our own content + the bar + enforcement),
IX interaction doctrine (incl. IX-8 one-concept-many-uses node anatomy per user 2026-07-05, IX-9
nothing-sacred), per-arc treatment map with rollout order. `tests/voiceRatchet.test.ts` pins tell
counts (em-dash 729 · "Genau…" openers 16 · maxim-takeaways 67) as ceilings that only go down.

### FL-0074 — RequestFlowExplorer (EXP-REQUEST-FLOW): the first feel-first flagship

New block kind `explorer` (lessonModel + LessonBlockView + features/explorers/registry). The
explorer: one request travels Anfrage→Grenze→Retrieval→Context→Modell→Tool-Gate→Check; every
station is tappable and shows its actual payload (log-like lines); four layer toggles
(Retrieval/Kuration/Tool-Gate/Check) produce four DISTINCT incidents — stale-confident answer,
wrong-doc-with-citation (grounded≠correct blind spot shown honestly), unasked CRM write on a
CORRECT answer, and the check's graceful degradation (blocked > wrong). Pure model
(requestFlow/model.ts) with truth-table tests (tests/requestFlow.test.ts, 6 cases incl. all-
failures-distinct). UI: brutalist pipeline, animated hop, inverted-selection inspector, verdict
card. Screenshot-iterated (scripts/shoot-explorer.mjs; idle/run/fail/mobile shots in docs/screenshots).

### FL-0075 — ARC-00/01 voice pass + NODE-01-03 re-anatomied as overhaul pilot

NODE-01-03 = pilot of IX-8: short scene note → explorer (use #1: experiment) → incidents-to-
repair-layer categorize (use #2: apply, references what the learner just SAW) → model-upgrade/
loose-contract transfer pick (use #3). 00-01/00-02/01-01/01-02 re-authored (not paraphrased) per
VX: sprint-board scene, Friday-demo/Monday-production scene, CTO question, architecture-review
scene; EN pilot files rewritten to match; Home tagline (DE+EN) rewritten. 238 tests green.

### FL-0076 — Impersonal register (VX-B1 update) + dossier case-file block (user feedback 2026-07-05)

User verdict on the pilot: direction right, but (a) conversational du in stems reads like
generative-AI chat ("reparierst du" → the site must not talk to the learner; confirms FL-0051
impersonal rule) and (b) scenarios still feel abstract — where does the information COME from?
Fixes: VX-B1 rewritten (impersonal scenes; functional infinitive-imperatives only; EN keeps a
professional "you"); full du-sweep across everything authored in the overhaul (01-03, ARC-00/01,
explorer strings, Home DE); NEW ratchet metric duForms=109 pinned, and em-dash ceiling dropped
729→711 after the ratchet CAUGHT the new content adding one (it works). NEW `dossier` block kind
(lessonModel + DossierView): clickable case files with read-marks — desktop sidebar, mobile chips.
NODE-01-03 now opens with 4 artifacts (pricing/rabatte.md with the changed §3, the stale
sales/faq.md, tools/update_crm.json contract, the #pricing-updates Slack thread explaining WHY
the FAQ is stale) that the explorer stations then quote. Screenshot-verified desktop+mobile,
file-clicking automated (scripts/shoot-dossier.mjs). 239 tests green.

### FL-0077 — Explorer becomes a REQUIRED guided protocol (user feedback 2026-07-05)

Feedback: the sandbox explorer demanded nothing; one or two taps and done, the layer→incident
mapping stayed invisible. Rework: five prescribed runs (Referenz · ohne Retrieval · ohne Kuration ·
ohne Tool-Gate · ohne Retrieval+Check), each ending in a diagnostic question answered by TAPPING
the right station (wrong tap opens that station's payload + hint, reading is the loop; run 5's
answer is deliberately a switched-off station: the absence is the answer). Every solved run fills
a row of the FINDINGS BOARD (ohne X → Vorfall), which at 5/5 IS the visible break-map; then the
toggles unlock for free play. Runs 2+ animate faster (340ms/step). GATING: `explorer` blocks now
count as required work in LessonView (sequential reveal hides the exercises until the protocol is
done) and lesson completion additionally requires all exercises where present (no mixed legacy
lessons exist, verified). Protocol consistency pinned in tests (targets exist, verdicts match
findings, no-net exception documented). Played end-to-end via browser automation incl. a
deliberate wrong tap (scripts/shoot-protocol.mjs); the driver itself had a bug the screenshots
caught (case-sensitive text match clicked nothing) — fixed, replayed, verified. 242 tests green.
