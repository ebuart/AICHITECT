# /source_material/progress/PROJECT_MEMORY.md

STATUS: HOT_MEMORY_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Compact current project state. Read first every session. Keep short.

## CURRENT_STATE

CURRENT_PHASE: DIRECTION EXPANSION (DEC-0013 / control/08+09) — pre-ship eval reset priorities; biggest build ahead is the ORCHESTRATION/"direct-the-swarm" track. Learning-loop rollout (control/07) is DONE; V1 hardening parallel  
DIRECTION_PRIORITY (user 2026-06-21, overrides earlier emphasis): (1 BIGGEST, needs massive attention) DIRECTION = senior-as-PM/scrum-master who decomposes goals + targets the agent swarm ("bees") with architectural overview. Judgment is built; DIRECTION is barely taught. Must be woven in from EARLY arcs, ramp up, and get a LARGE new specified track after the current 43 nodes → spec in control/09_direction_track.md. (2 BIG) "I'm just guessing" at topic intro → ground first attempts with VISUALS (graphs/stats/diagrams), not prose walls (SPINE-040). (3 SMALLEST) HomePage motivation — minor, do last.  
BREADTH (OQ-0011 / LR-063): MECHANISM BUILT (FL-0045) — multi-viewpoint LESSONS. LessonView embeds 2+ challenge blocks with guided SEQUENTIAL REVEAL (next angle after current finishes) + completes only after ALL done. 6 multi-viewpoint lessons. Cheap wins (FL-0045/46): 02-01 (allocate+curate), 05-01 (build+configure), 04-01 (build-predictable + weigh-open), 08-03 (order-response + diagnose). Tier-2 DIRECTION facets (FL-0047, new scenarios): 11-02 (structure + coordination-cost trade-off), 12-03 (triage + intervene-vs-let-run). HONEST: only those 2 DIRECTION nodes had a clean distinct 2nd mechanic; the other 5 stay single-facet on purpose (forcing would re-teach an adjacent node or jam a mismatched engine). REMAINING breadth = TRANSFER variants for spaced-review (lower priority, different kind) or new arcs. Don't make EVERY lesson multi-angle (grindy — depth only where it genuinely adds a viewpoint).  
AUTHORING_FILTER (control/08 SPINE-002..007): every new node must pass — DURABILITY (teach what gets MORE valuable as models improve: decompose/direct/judge/curate; NEVER prompt-tricks or model-specific tech that a better model erases) · ROI (a thing a junior can't do in a big AI system) · RESEARCH current senior practice before authoring (SPINE-006). THE BAR: a learner who does ONLY these lessons clearly out-values ANY junior dev for building/operating big AI systems — without being an ML/LLM specialist. Reflexive scan of existing 43 = clean (no prompt-trick rot); durability-reframe watch list in OQ-0010 [F]. Meta-skill = its own CLUSTER (~10+ nodes, not one): "doc control plane" — designing docs good for humans AND AI (our `[XXX-000]` system is the exemplar), routing facts between doc-types, keeping the corpus lean. Future-critical for large projects. Spec: control/09 ARC-15 (DIR-036/037), seeded early at node 11-05.  
CURRENT_GATE: PHASES 1–8 complete; PHASE_9 hardening mostly done (OQ-0009 resolved, icon, audit triaged; OQ-0005 human QA remains). Redesign rollout DONE (FL-0030..0038): concise feedback GLOBAL + all 43 lessons hands-on (embedded mechanics, 0 MCQ) + lazy distractors purged (LR-011a) — awaiting user playtest of the full curriculum  
LAST_UPDATED: 2026-06-18  
APP_STATUS: running (roadmap → 53 lessons / 54 nodes + 19 labs → feedback[concise] → progress → /review) · dev: localhost:5173. DIRECTION track: ARC-11 "Director's Seat" (FL-0043, 4) + ARC-12 "Targeting the Swarm" (FL-0044, 3, RESEARCH-BACKED control/09 DIR-003a..g) + ARC-13 "Delivery & Acceptance" (FL-0049, 2: prioritize/scope + accept-against-brief = the PM delivery half). All gated behind the capstone, existing engines, no new UI. Pedagogy executable (`directionScenarios.test.ts`). Source docs (domain/11,12) synced. SHIPPING AUDIT (FL-0050): edge-SE ✅; edge-PM ✅ (decompose→target→deliver→accept→ROUND-TRIP); PC-043 Open-Claw exit proof ✅ NOW MET — NODE-13-03 "Direct the Build" (4-phase round-trip on a 2FA feature, multi-challenge, no new UI). Remaining ship-gaps (lower priority): SPINE-040 intro-visuals ("I'm just guessing" novice fix — VISUAL, needs user to see) + optional ARC-14 integrate/SWARM-BOARD tracking (new mechanic → user review). Honest caveat (PC-024): still a simulator, not real reps.  
BUILD_STATUS: passing (tsc -b strict + vite build + PWA SW). Route code-split (FL-0041): initial JS 110 kB gz (was 178); interaction registry + visual-lab lazy-loaded. No >500kB warning.  
REDESIGN_PIVOT (FL-0051, 2026-06-22): the "everything is a mechanic-board + scenario/constraint + 'Wie machst du X'" template is the AI-slop tell. New BESPOKE EXERCISE block (lessonModel Exercise=pick|spot, ExerciseView) — concrete material shown, impersonal phrasing, several DIFFERENT exercises per lesson, no template. PILOT = NODE-08-03. User verdict: "like the feel way more, but too simple → make it way harder." HARD PASS done (FL-0051): formats now pick | MULTI-select | spot; 08-03 rebuilt hard — subtle social-engineered spot (no magic words, decoy line), 6-way multi-select trust-boundary (untrusted = customer-input + tool-output, NOT system-prompt/internal-API), second-order delimiter-injection bypass (close distractors), cross-agent trust-laundering. USER DIRECTIVE stands: re-evaluate EVERY node ground-up (what/why/how/ROI-angles → HARD bespoke gameplay). Difficulty bar = "could a skeptical senior get it wrong if careless?". FIXED (user 2026-06-22): (1) removed AI-meta hint lines that telegraph the answer; (2) SYSTEMIC TELL — correct option was always FIRST everywhere → now shuffled at render (`lib/utils/shuffle`, once/mount) in ExerciseView + StationConfigBoard (10 engines) + agentTrace + failureModeTree. Rule: LR-011d (control/07). Engines stay available but stop being the default. NEXT = per-node ground-up re-authoring to this bar.  
TEST_STATUS: passing (`npm test` — vitest, 153 tests; incl. `contentQuality` LR-011a/b/c guardrails + `directionScenarios` pedagogy (ARC-11/12/13 intended-move-wins) + `lessonRender` multi-viewpoint)  
DEV_NOTE: `src/lib/devFlags.ts UNLOCK_ALL = import.meta.env.DEV` — in dev, roadmap nodes are greyed-but-playable (prereqs bypassed for playtest); production keeps gating. Auto-reverts for release.  
REDESIGN_NOTE: ROLLOUT COMPLETE (FL-0038) — ALL 43/43 lessons are now `concise frame + { kind: 'challenge', scenarioId }`; the mechanic renders INLINE and finishing it completes the lesson. 0 classic 2-option `decision` blocks remain in content. No new ENGINE was needed (19 registered mechanics covered everything); the work was authoring ~22 NEW data-only scenarios (LR-011a-realistic distractors) + reusing bound ones. Variety of task TYPE per node achieved across architecture-builder / allocator / retrieval-factory / eval-designer / security-incident-room / repo-refactor / trace / triage / postmortem / trust-boundary / figure-decoder / capstone-simulator / constraint / tool-contract / trade-off. To convert: short note/prose + challenge block, drop the decision + "see the lab" notes (the lab IS the lesson). NEXT real gate = human playtest (OQ-0005).  
DISTRACTOR_RULE: LR-011a/ALL-0002/FL-0036 — NEVER ship "Modell zu klein/groß", "größeres Modell", "Prompt zu kurz/lang", "Temperatur senken" as wrong options (read as dummy answers). Distractors must be symptom-patch / over-engineering / tempting-but-wrong control / right-idea-wrong-layer. 10 fillers already replaced; apply when authoring new scenarios. Only legit exception: `tradeOffScenarios` (model size IS the lesson).  
SLOP_RULE: LR-011c/OQ-0012/FL-0048 — NO AI-slop, NO free wins. A question fails if a competent learner can't get it wrong or could tell it's AI-written. Distractors = the TEMPTING REAL mistake (qualitative-goal-that-feels-clear, over-diligent spec, responsible-feeling manual review), in a CONCRETE situation; prose carries info, not vibes. Also: LIVE scoring readouts are spoilers — gate risk gauges / verdicts post-eval (FL-0048 fixed the budget-board noise/missing gauges). `contentQuality` SLOP_PHRASE guards crude tells; subtle "too obvious" (esp. 2-option stations) = playtest-driven OQ-0012. Litmus: skeptical-senior read — smells AI or unmissable → redesign.  
SPOILER_RULE: LR-011b/ALL-0003/FL-0039 — NEVER pre-stamp the verdict. (1) Verdict badges (NOISE/KEY/STALE/hoch-Risiko), the `required` flag, the allocator „Ziel %“ → reveal ONLY after evaluation (gated by `result`/`revealed`). Pre-answer the learner sees only label + source + cost. (2) Distractor LABELS must look plausibly-includable, not name their own verdict ("Langer alter Chat-Verlauf" → "Chat-Verlauf einer früheren Anfrage"). (3) Spiral: FIRST node of a concept = clearest teaching; later nodes/transfers/capstone disguise it so the learner APPLIES, not keyword-matches. Boards already gated: agent-trace, incident-triage, pipeline, allocator, failure-mode. Fixed: CBB + trust-boundary.  
DEPLOY_STATUS: LIVE (2026-07-04) — https://aichitect-theta.vercel.app (Vercel project max-vo-pjt/aichitect, GitHub-connected: auto-deploy on push to main; vercel.json SPA-fallback rewrite; smoke-checked 200 on / and /roadmap)
RESUME_AUDIT (2026-07-04, updated same day): publication layer SHIPPED (DEC-0015, FL-0067/68) — public repo github.com/ebuart/AICHITECT (git main, honest per-change commits), English README (pedagogy-as-CI + control-plane story), MIT, ESLint flat (0 errors), GitHub Actions CI (lint+build+test), DE/EN chrome locale toggle (content stays German-first, translation staged per arc). Tests now 221/221. REMAINING: deploy (live URL), README screenshots, buildgame file-splits + warn-scoped react-hooks findings (OQ-0014g). CONTENT AUDIT verdict + fix list = OQ-0015 (strong content, no factual errors; fix cross-arc duplicate 01-01/05-01, soft echoes, restate-the-note closing picks — then translate).

## ACTIVE_OBJECTIVE

OBJECTIVE:
- PHASE_1–8 COMPLETE (full curriculum NODE-00-01..10-05, 43 lessons; 15 engines; review/mastery; capstone).
- NEW DIRECTION (DEC-0012 / control/07, 2026-06-15): user testing found the 2-option lessons too easy +
  feedback too verbose. Greenlit a LEARNING-LOOP REDESIGN → strategy-game mechanics (allocate/boundary/
  connect/triage/sort/dial/weigh/inject/pick), graded "direction not correctness" scoring, concise prose
  feedback, mobile direct-manipulation (sliders/tap-zone; dnd-kit only where it beats tapping). This is now
  the primary work; V1 hardening (human pixel QA OQ-0005, deploy) continues in parallel/after.

REDESIGN_SLICE_1 (DONE — FL-0030, awaiting user playtest):
- (a) ✅ FeedbackCard → concise prose (GLOBAL); Feedback detail fields optional + `summary`.
- (b) ✅ MECH-ALLOCATE engine `features/labs/contextAllocator/*` — sliders + live split bar + graded
  proximity scoring (1 − TVD to ideal, capped by hard min/max; direction matters, no single answer) +
  derived trade-off feedback. LAB-CONTEXT-ALLOCATOR bound to NODE-02-01 (16 engines).
- (c) ✅ NODE-02-01 lesson rebuilt: concise framing → Allocator challenge (dropped the guessable decision).
- MECHANIC LIBRARY (LR-061): 4/~8 built — core verbs covered: ALLOCATE (`contextAllocator/*`, sliders,
  NODE-02-01) · PLACE (`trustBoundary/*`, tap-to-zone, NODE-08-04) · ORDER (`incidentTriage/*`, ▲/▼ reorder,
  NODE-08-03) · BUILD (`pipelineBuilder/*`, select+order palette, NODE-05-01). 19 engines (FL-0030/31/32).
- NEXT: RECOMMEND user playtest these 4 first (localhost:5173). Then remaining mechanics (dial/sort/weigh)
  OR begin arc-by-arc content rollout (replace micro-MCQs). Pattern: each mechanic = types+scoring(pure,
  graded)+feedbacks(derived concise)+<Board>.tsx+entry+scenarios(base+transfer) + wire (lesson.ts union,
  labs.ts catalog, nodes.ts labIds, registry) + tests (scoring + render smoke).

NEXT_SAFE_TASK (V1 hardening, parallel):
- PHASE_9 hardening/release (PH-1000/1001). Allowed: refactors, bug fixes, perf, a11y, final polish — NOT new
  systems (PH-1003). Concrete steps:
  · Hardening test suite (pure, additive, low-risk): assert every roadmap node has a lesson (content coverage,
    PH-1001), the full unlock chain is traversable end-to-end (roadmap completion QA), and progress persists
    round-trip through the adapter. Some may already exist — check `tests/` first.
  · Dead-binding cleanup (OQ-0009): the 4 engine-less secondary lab bindings (layer-stack-builder,
    trade-off-duel, constraint-puzzle, system-postmortem) show "Lab folgt"; decide remove-vs-keep. Note the
    labRender "not-yet-implemented engine" test uses LAB-LAYER-STACK-BUILDER — update it if you remove that id.
  · npm audit triage (OQ-0004); deployment readiness (Vercel-ready; PWA icons are placeholders).
  · Human pixel/mobile QA (OQ-0005) — AI cannot do this; surface the checklist for the user.
- Exit gate PH-1004: app deployable + internally coherent.
- Capstone realized via ARC-10 lessons (10-01..05) + Capstone Simulator (10-02 design) + bound practice labs.

OPEN_VERIFICATION:
- Human pixel QA over `/visual-lab` + lessons + the 5 lab engines at 320–430px (OQ-0005).
- Interaction previews in `/visual-lab` deferred (layering) — engines covered by render-smoke tests (OQ-0006).

DO_NOT_DO_YET:
- Review/mastery must stay demonstrated-only: NO XP / streak / badge gamification (PH-803/NG-009). Keep review
  a pure projection of progress (DEC-0011) — extend the projection, do not add a separate mastery store.
- PHASE_8 capstone must integrate prior arcs (context/tool/retrieval/eval/security/repo) with real trade-offs,
  failure diagnosis and a postmortem — not a final quiz (PH-903), and must reference earlier dependencies.
- Do not add Supabase.
- Do not create one-off lesson diagrams (reuse primitives + /visual-lab).

## LOADED_CONTROL_BASELINE

ALWAYS_REFER:
- `/source_material/control/00_project_contract.md`
- `/source_material/control/01_non_goals.md`
- `/source_material/control/02_build_principles.md`
- `/source_material/control/03_context_policy.md`
- `/source_material/control/04_phase_plan.md`
- `/source_material/control/05_quality_gates.md`
- `/source_material/control/06_claude_workflow.md`

CURRENT_PHASE_DOCS:
- `/source_material/control/07_learning_loop_redesign.md` (DEC-0012 redesign spec, LR-000..072) — load when
  building interactions/content for the strategy-game learning loop.

OPTIONAL_DOCS_THIS_SESSION:
- TBD

## ARCHITECTURE_SNAPSHOT

STACK:
- React
- TypeScript
- Vite
- Tailwind
- PWA-ready
- Vercel-ready
- local-first persistence
- Supabase-ready adapter boundary later

KNOWN_STRUCTURE:
```txt
/src
  /app            HomePage, NotFoundPage
  /components
    /ui           Button, Card, Badge, PagePlaceholder
    /visuals      11 primitives + DiagramShell + VisualStateChip + /lab demos + VisualLabPage
    /layout       AppShell, AppHeader, BottomNav (roadmap-first)
  /features
    /roadmap      roadmapStatus (pure unlock), useRoadmap, RoadmapPage/ArcSection/NodeCard (→lessons)
    /progress     ProgressContext (adapter-backed: completeLesson/completeNode), progressMutations
    /lessons      lessonModel, lessonModes, LessonView/BlockView/VisualRenderer, FeedbackCard,
                  LessonPage (prereq-gated), reviewModel
    /labs         interactionModel (LabScenario/LabResult), interactionRegistry, LabPage (host),
                  stationConfig/* (shared config-lab core: scoreStations + StationConfigBoard +optional figure intro, DEC-0010; serves 5 labs),
                  15 engines/* (5 core + 5 advanced + capstoneSimulator + layerStackBuilder/tradeOffDuel/constraintPuzzle/systemPostmortem) — each: types+scoring+feedbacks+<Engine>.tsx+entry
    /review       reviewModel (pure projection: mastery/queue/repairs/themes, DEC-0011) + reviewMission
                  (node→re-runnable lab transfer task) + ReviewPage (/review) + ReviewRunPage (/review/:nodeId)
    /capstone (empty — capstone realized via labs/capstoneSimulator + content/labs/capstoneScenarios + ARC-10 lessons)
  /content
    /roadmap      arcs(11) + nodes(44, full graph) + index
    /lessons      5-lesson slice (NODE-00-01..01-03) + registry
    /labs         labs catalog + contextBudget/failureMode scenarios (base+transfer); /taxonomy (empty)
  /lib            /storage (adapter+localStorage), /visuals (state+meta), /utils (cn), /scoring (empty)
  /types          ids, roadmap, lesson, lab, progress, visual, index
  /routes         router, paths
```
ROUTES: `/`, `/roadmap`, `/lesson/:id`, `/lab/:id`, `/review`, `/review/:nodeId`, `/visual-lab`, `*` (BottomNav: Start/Roadmap/Review/Visual Lab)
KEY_CONTRACTS: StorageAdapter (persistence boundary); RoadmapGraph (44 nodes, prereq-driven unlock); visuals/31 component contracts.

PERSISTENCE:
- Adapter boundary required.
- LocalStorage or IndexedDB first.
- Supabase deferred until local adapter is stable.

## IMPLEMENTED_FEATURES_SUMMARY

COMPLETED:
- App scaffold (Vite7/React19/TS-strict/Tailwind v4/PWA), feature-folder architecture, app shell.
- Storage adapter boundary + LocalStorage impl, wired via ProgressProvider (persists every change).
- Typed domain models (roadmap/lesson/lab/progress) + full 44-node curriculum graph as data.
- Pure unlock engine + roadmap rendered from data with locked/available/in_progress/completed.
- 11 visual primitives + DiagramShell built to contracts; `/visual-lab` gallery with QA cases.
- Lesson engine: data-driven block renderer, 4 modes, 6-part feedback, prereq gating, lesson→node completion.
- First content slice: 5 lessons (first 5 roadmap nodes) covering all 4 required modes.
- Interaction framework: LabScenario/LabResult contracts, registry, prereq-gated LabPage host, lab→node completion + score/weak-signal persistence.
- 15 interaction engines: 5 core (PH-505) + 5 PHASE_6 advanced (Retrieval Factory, Eval Designer, Security
  Incident Room, Repo Refactor, Paper Figure Decoder) + Capstone Simulator (PHASE_8) + 4 secondary (Layer
  Stack Builder, Trade-off Duel, Constraint Puzzle, System Postmortem — PHASE_9, OQ-0009). 10 config labs share
  the stationConfig core (DEC-0010). Each base + transfer, pure scoring, FB feedback. Every catalog lab resolves.
- 43 lessons: FULL graph NODE-00-01..10-05 lessoned — ARC-00..09 (Foundations/Context/Tools/Agents/Retrieval/
  Memory/Evals/Observability/Security/Repo) + ARC-10 capstone (briefing → architecture draft → failure injection
  → eval & governance → final review). EVERY cataloged lab now resolves a working engine (OQ-0009 resolved):
  the 4 former "Lab folgt" bindings (layer-stack-builder, trade-off-duel, constraint-puzzle, system-postmortem)
  are built. No "Lab folgt" placeholder remains for any real lab.
- Review/mastery surface (PHASE_7, complete): `buildReviewState` pure projection (mastery, spaced queue,
  repair missions, recurring themes, DEC-0011) + ReviewPage `/review` + INTERACTIVE Review-Missions
  (`reviewMission` + ReviewRunPage `/review/:nodeId`) that re-run a node's transfer scenario and persist via
  completeLab → mastery refreshes. Derived from progress, no new store; no XP/streaks.

IN_PROGRESS:
- PHASE_9 hardening: coverage/completion QA tests; npm audit triaged (OQ-0004); all 15 labs built (OQ-0009
  resolved); real PWA icon (public/icon.svg). Remaining: human pixel QA + deploy.

NOT_STARTED:
- PHASE_9 remaining: human pixel/mobile QA pass (OQ-0005, user's step) + deployment readiness. Exit gate PH-1004.
- Lesson engine.
- Interaction engines.
- Curriculum content.
- Capstone.

## ACTIVE_DECISIONS_SUMMARY

[MEM-DEC-001] Product is roadmap-first, not topic-library-first.  
[MEM-DEC-002] Labs are bound to roadmap nodes.  
[MEM-DEC-003] Feedback analyzes system consequence, not user identity.  
[MEM-DEC-004] Source docs must be compact, rule-based, and non-essay.  
[MEM-DEC-005] Backend-free first; Supabase-ready later.

## ACTIVE_RISKS

[RISK-001] Context noise from too many source docs.
MITIGATION: Keep this PROJECT_MEMORY compact; load specialized docs only when needed.

[RISK-002] Visual complexity hard to debug.
MITIGATION: Build `/visual-lab` before content-heavy visuals.

[RISK-003] Buzzword drift.
MITIGATION: Enforce PC-030 for every concept.

[RISK-004] Large components/functions.
MITIGATION: Enforce BP-006 and BP-007 before expanding features.

## SELF_LEARNING_LOOP

SESSION_PATTERN_NOTES:
- Add recurring implementation mistakes here only if they affect future sessions.
- Keep each note one line.
- Remove stale notes after they are encoded into control docs or architecture.

CURRENT_AGENT_LESSONS:
- Prefer compact source docs with IDs over explanatory prose.
- Use PROJECT_MEMORY as hot state to avoid rereading all documents.

REVIEW_TRIGGERS:
- If the same mistake happens twice, add a rule to DECISION_LOG or relevant control doc.
- If a workaround becomes repeated, extract a pattern or component.
- If a visual bug repeats, add a VISUAL_QA case.
- If content gets bloated, update CONTENT_COVERAGE_MATRIX and split nodes.

## LAST_SESSION_SUMMARY

CHANGED (latest, FL-0061..0063, DEC-0014) — WERFT × ROADMAP MERGED into one "learn it to build it" loop:
- Completing a roadmap node grants Budget + UNLOCKS its Werft skill (`content/werft/questMap.ts`,
  `questBridge.reconcileQuests`, `GameState.questsClaimed/learned` v9, `canBuy` quest-gate). Starter kit is free.
- Werft is now the DEFAULT mode (`/`→`/build`; nav leads with Werft, roadmap is the quest catalogue). In-game
  **quest board** (`QuestBoard.tsx`, J key) with reward chips → tap opens the lesson; SelectedPanel "Zur Lektion →".
- A lesson opened from the Werft (`?return=werft`) RETURNS to the Werft on completion (reward lands there), not
  the roadmap. **Active onboarding** (`WerftTour.tsx`, FL-0064): a spotlight tour GATED on real actions (press ▶,
  tap the Charter, one example quiz, switch to Karte, place „Solo") — `pointer-events-none` so the player really
  does each step. Auto-once + replayable via "Tutorial" in Details.
- FLOW/GOAL (FL-0065): a **recommended-next-quest** chip in the HUD (`useRoadmap().currentNode` → deep-link) +
  a soft **win** `isMature(s)` (max Charter tier via capstone quests + 5 clean releases → 🏆 + coach line).
- HONEST TREE (FL-0066): quest-gated skills now render `locked` + 🔒 on the Skilltree (`graphs.stateOf`/`quest`
  flag) instead of looking buildable; tap → SelectedPanel quest-lock + "Zur Lektion".
- Build green; `npm test` 215/215. NEXT (OQ-0013): the remaining open item is a real DEVICE PLAYTEST for BALANCE
  (numbers — income/threat/quest budgets/tier costs — are first-pass; hard-unlock means a fresh player has ~6
  starter skills until they learn). Deliberately NOT tuned blind; awaiting the user's playtest feel.

PRIOR (FL-0057..0060) — the WERFT became a deep standalone real-time strategy game (DEC-0014):
- PLACEMENT TEACHES ARCHITECTURE. System-Karte = six ordered request phases
  (boundary→knowledge→model→tools→check→ops); dropping a bought skill in the RIGHT phase = ✓ + stat bonus that
  feeds release defense, WRONG = ✗ + a one-line why. Skilltree stays the SHOP. `gameModel` gained
  `placed:Record<id,Zone>`, `zonesFor`/`isCorrectlyPlaced`/`architectureScore`.
- PLAGUE-INC REAL-TIME LOOP. Manual Sprint removed (infinite-money clicking). `tick(s)` advances one in-game DAY
  while playing (▶/▶▶/▶▶▶, paused by default, 2.2s/day at 1×): passive income, drift/debt creep, AUTO-RELEASE
  every 12 days, and tappable EVENT BUBBLES (`handleEvent`/`resolveExpired`). A failed release no longer
  spirals (world only hardens on success).
- WHOLE-APP POLISH the game pulled in: global LIGHT MODE (`html.theme-light`, `lib/useTheme.ts`); FULLSCREEN
  OVERLAY HUD (`/build` full-bleed, canvas fills screen, HUD floats); FULL KEYBOARD CONTROL (`H` cheat-sheet);
  breathing dot-grid background + mm:ss clock as "time-moving" cues; per-node InfoBox; reset-confirm.
- CONTENT: `features/buildgame/nodeInfo.ts` — real 1–3-sentence explanations for every node + 2–3-line phase
  texts (killed the short "AI hero-phrases" per user). Test enforces completeness.
- Build green; `npm test` 208/208. Persistence stepped v4→v8. PROGRESS DOCS (this file, FEATURE_LEDGER,
  DECISION_LOG) updated — earlier Werft sessions had drifted out of sync (user flagged "you missed a lot of
  MDs-Updating").

WHY:
- The app trained judgment but never let the learner DIRECT a system over time (DEC-0013 gap). The Werft, as a
  real-time game where correct request-pipeline ordering and live incident-handling decide outcomes, is the
  "do, not just recognise" half — and is meant to be a standalone playground (Odin/Build-Your-Own-X level).

RISKS:
- Balance is FIRST-PASS + agent-unplaytested: income, releaseThreat, event cadence, RELEASE_EVERY are guessed
  numbers; the loop may be too easy/slow/fast on a real device. HUD/keyboard feel + the animated bg are
  human-unverified. The Werft is NOT yet wired to lesson progress. No explicit win/end condition yet.
- This is parallel to the lessons track; the older learning-loop NEXT (below) is still open.

NEXT:
- Device playtest the Werft for balance + HUD/keyboard/animation feel; tune numbers; consider a win condition +
  tying lesson completion → starting budget. (Lessons track, still open: roll embedded-challenge mechanics across
  the remaining MCQ lessons; build dial/sort/weigh mechanics.)

CONTEXT_NOTE: Checkpointed per MP-014/PH-013/CTX-014 — context is large across PHASES 0–5;
durable state captured so a fresh session resumes cleanly from NEXT_SAFE_TASK.
