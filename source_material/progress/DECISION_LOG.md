# /source_material/progress/DECISION_LOG.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: WHEN_ARCHITECTURE_CHANGES  
PURPOSE: Store durable architecture/product decisions. Keep concise.

## FORMAT_RULES

[DL-001] Add decisions that affect future implementation.
[DL-002] Do not log trivial UI choices.
[DL-003] Use short ADR-style entries.
[DL-004] If a decision replaces an older one, mark old decision superseded.

## DECISION_TEMPLATE

### DEC-YYYYMMDD-XX — Title

STATUS: accepted | superseded | proposed | rejected  
DATE: YYYY-MM-DD  
PHASE: PHASE_X  
RULE_REFS: PC-000, BP-000, CTX-000  

CONTEXT:
- One to three bullets.

DECISION:
- One to three bullets.

CONSEQUENCES:
- positive:
  - ...
- negative:
  - ...
- follow_up:
  - ...

## DECISIONS

### DEC-0001 — Roadmap-first learning model

STATUS: accepted  
DATE: YYYY-MM-DD  
PHASE: PHASE_0  
RULE_REFS: PC-002, PC-003, BP-050  

CONTEXT:
- AI Engineering concepts depend on prior mental models.
- Random topic selection would break prerequisite logic and spaced review.

DECISION:
- Main navigation is a guided roadmap.
- Labs are attached to roadmap nodes.

CONSEQUENCES:
- positive:
  - Supports progressive difficulty and spaced review.
  - Prevents advanced-topic browsing without foundations.
- negative:
  - Requires explicit dependency modeling.
- follow_up:
  - Define roadmap graph in domain docs.

### DEC-0002 — Local-first persistence with Supabase-ready boundary

STATUS: accepted  
DATE: YYYY-MM-DD  
PHASE: PHASE_0  
RULE_REFS: PC-051, PC-052, BP-005, QG-070  

CONTEXT:
- Backend-free PWA is faster and more robust for V1.
- Supabase may be valuable later for sync and long-term progress.

DECISION:
- Start with local persistence.
- Use storage adapter interface.
- Defer Supabase implementation until local architecture is stable.

CONSEQUENCES:
- positive:
  - Faster V1 development.
  - Cleaner future migration.
- negative:
  - No cross-device sync in first local version.
- follow_up:
  - Define storage adapter during Phase 1.

### DEC-0003 — Feedback analyzes systems, not user identity

STATUS: accepted  
DATE: YYYY-MM-DD  
PHASE: PHASE_0  
RULE_REFS: NG-050, NG-054, BP-060  

CONTEXT:
- Architecture feedback can easily become generic AI-sounding criticism.
- The app must avoid psychologizing the learner.

DECISION:
- Feedback explains decision, consequence, failure mode, architecture rule, and better solution.
- Do not label mistakes as personality or "vibecoder" traits.

CONSEQUENCES:
- positive:
  - More professional and less AI-slop.
  - Better transfer to real-world engineering.
- negative:
  - Requires more precise feedback authoring.
- follow_up:
  - Create feedback pattern library in interaction docs.

### DEC-0004 — Scaffold stack: Vite 7 / React 19 / TS strict / Tailwind v4 / vite-plugin-pwa

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_0
RULE_REFS: PC-050, BP-020, PH-102

CONTEXT:
- Need a PWA-ready, Vercel-ready, mobile-first baseline per PC-050.
- Tailwind v4 uses the `@tailwindcss/vite` plugin (no postcss config / tailwind.config.js).

DECISION:
- React 19 + Vite 7, TypeScript strict with project references (app/node split).
- Tailwind v4 via `@tailwindcss/vite`; design tokens declared in `@theme` in `index.css`.
- react-router-dom 7 with `createBrowserRouter`; route paths centralized in `src/routes/paths.ts`.
- PWA via `vite-plugin-pwa` (autoUpdate, generateSW), registered in production builds only.

CONSEQUENCES:
- positive:
  - Modern, fast, low-config foundation; clean feature-folder boundaries (BP-020).
- negative:
  - Tailwind v4 differs from v3 docs; contributors must use v4 conventions.
  - 2 high-severity transitive npm advisories outstanding (tracked in OPEN_QUESTIONS).
- follow_up:
  - Resolve/triage npm audit advisories before PHASE_9 release.
  - Replace placeholder PWA icons with real assets.

### DEC-0005 — Roadmap modeled as data from domain graph; unlock via prerequisites

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_1
RULE_REFS: BP-003, BP-032, RD-001, CG-003, PC-002

CONTEXT:
- domain/11_curriculum_graph + 12_roadmap_dependencies already define a complete 44-node graph.
- Roadmap is primary navigation and must reflect prerequisites.

DECISION:
- Transcribe the full graph into `src/content/roadmap/nodes.ts` as typed data (structure + German purpose line; no lesson bodies).
- Derive node status with a pure engine: a node is `available` only when all prerequisites are `completed` (RD-001); status persisted via the storage adapter.
- `unlocks` kept for locked-node previews but status is computed from `prerequisites` (single source of truth).

CONSEQUENCES:
- positive:
  - Roadmap-first UX renders entirely from data; unlock logic is testable and reusable.
  - Lessons/labs can attach to existing node IDs in later phases without graph churn.
- negative:
  - Hand-transcribed graph must be kept in sync if domain docs change (RD-006).
- follow_up:
  - Lesson engine (PHASE_3) binds Lesson records to these node IDs.

### DEC-0006 — Visual primitives built to typed contracts; state never color-only; no canvas

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_2
RULE_REFS: VSS-005, VSS-007, VSS-101, BP-043, VCC-200, VCC-201

CONTEXT:
- AI agents cannot see graphical bugs (VQA-001); visuals must be deterministic and code-reasonable.

DECISION:
- Implement the 11 required primitives to visuals/31 contracts using HTML/CSS only (no canvas, no force layout).
- Encode every visual state with a labelled chip (symbol + text), so meaning never depends on color alone.
- Keep scoring/feature logic out of visual components; they emit selection events only (VCC-201/202).
- Build/QA all primitives in `/visual-lab` before any lesson use (VQA-200).

CONSEQUENCES:
- positive:
  - Stable, mobile-first, reusable visual language; AI-legible layout (VSS-147).
- negative:
  - Some research-faithful diagrams (PaperFigureRecreation) deferred to PHASE_6 by design.
  - Desktop-width QA constrained by the mobile-first shell (tracked in OPEN_QUESTIONS).
- follow_up:
  - Human visual QA pass at mobile widths before lessons consume primitives.

### DEC-0007 — Test harness: vitest + jsdom + Testing Library, smoke + logic

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_2
RULE_REFS: QG-010, QG-011, VQA-001

CONTEXT:
- No test scripts existed (QG-012). Visual correctness can't be auto-verified at pixel level (VQA-001).

DECISION:
- Add vitest (jsdom + Testing Library) with tests under `/tests`, separate `vitest.config.ts` so the
  production build never compiles test code.
- Cover: pure unlock engine + graph integrity, progress mutations, storage adapter fail-safe; render
  smoke for the full `/visual-lab` and the PHASE_1 page path.
- In-memory Web Storage polyfill in setup (jsdom opaque-origin localStorage is non-functional).

CONSEQUENCES:
- positive:
  - Automated regression guard for logic + runtime render throws; `npm test` green (18).
- negative:
  - Smoke tests do NOT catch pixel/layout bugs — human pass still required (OQ-0005).
  - Added dev-only npm advisories (tracked in OQ-0004).
- follow_up:
  - Expand logic tests as PHASE_3+ engines land.

### DEC-0008 — Lesson modes as authored block structures + one renderer (not per-mode components)

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_3
RULE_REFS: PH-402, BP-009, BP-030, QG-024, LG-002

CONTEXT:
- PH-402 requires four lesson modes. Lesson grammar defines each mode as a *structure* (ordered blocks),
  not a distinct visual layout.

DECISION:
- Represent lessons as a data-driven ordered block sequence (prose/term/note/visual/decision).
- A single `LessonView` renders any mode; the mode supplies header framing via a registry and dictates
  the authored block order. No duplicated per-mode renderer components.
- The full Lesson content contract lives in `features/lessons/lessonModel` (it references visual prop
  types); `types/lesson` keeps only the leaf mode/interaction unions.

CONSEQUENCES:
- positive:
  - One renderer, no duplication (BP-009/QG-024); modes are pure data → easy to add/extend.
  - Lessons reuse `/visual-lab` primitives; no one-off lesson visuals (VSS-003).
- negative:
  - "Mode" is framing + authoring discipline, not enforced layout — relies on authors following grammar.
- follow_up:
  - PHASE_4 interaction engines replace in-lesson decision blocks with reusable scored interactions.

### DEC-0009 — Interaction framework: shared scenario/result contracts + registry; pure scoring

STATUS: accepted
DATE: 2026-06-13
PHASE: PHASE_4
RULE_REFS: PH-501, IC-001, IC-007, VCC-201, LS-009, QG-047

CONTEXT:
- Five core interactions must be reusable engines, not one-off lesson tricks. Scoring must be testable
  and separated from rendering.

DECISION:
- One framework (`features/labs/interactionModel`): `LabScenario<Data>` (config-driven) + `LabResult`
  (normalized score + mastery/weak signals + feedback) + a registry keyed by interactionType.
- Each engine = scenarioData type + a PURE scoring function (per-dimension pass/fail → 0..1) + a feedback
  library + a component. Scenarios live in `/content/labs` (no hardcoded data in UI, LS-009).
- `LabPage` is the single host: resolves the engine, enforces prerequisites (QG-047), switches base/transfer,
  and persists result + completes the bound node (the lab is the node's tactical task).
- Completing a lab completes its node (idempotent); a node may be completed via lesson OR lab.

CONSEQUENCES:
- positive:
  - New engines are additive (scenario + scoring + component); scoring is unit-testable in isolation.
  - Engines reuse `/visual-lab` primitives — no new visual debt.
- negative:
  - `scenarioData` crosses the registry as `unknown` and is cast at each engine's boundary (documented).
  - Interaction previews not yet in `/visual-lab` (layering: components/visuals must not import features) → OQ-0006.
- follow_up:
  - Implement the remaining 3 engines to satisfy PH-505; revisit a features-level interaction gallery.

### DEC-0010 — Shared station-config engine core for config-style labs

STATUS: accepted
DATE: 2026-06-14
PHASE: PHASE_6
RULE_REFS: BP-009, QG-024, CTX-066, CW-043, PH-705

CONTEXT:
- Retrieval Factory (FL-0019) introduced a "configure by single-select stations, score by best-fit"
  interaction. Eval Designer (FL-0020) needs the same shape. Cloning it would duplicate the scoring loop
  and the whole board component — exactly what QG-024/CTX-066 forbid ("same logic twice → extract").
- The 5 core engines are genuinely different interactions (card-sort, trace-select, toggles, builder), so
  no shared base existed before; this is the first repeated interaction shape.

DECISION:
- Extract `features/labs/stationConfig/`: `ConfigStation`/`ConfigOption`/`StationConfig` types,
  a pure `scoreStations(stations, config)` (best-fit → mastery/weak dimensions, 0..1), and a shared
  `StationConfigBoard` component (single-select, reveal-after-evaluate, ScoreMeter + FeedbackCard).
- Each engine stays a thin binding: its own dimension union + feedback library + a `selectFeedback`
  (weakDims → Feedback[]) + a wrapper component that maps scenarioData to profile rows. Refactored
  Retrieval Factory onto the core with its public API (`scoreRetrieval`, `RetrievalFactory`,
  `RetrievalScenarioData`, `RetrievalConfig`) unchanged — its existing tests are the regression net.
- Dimensions are engine-specific strings; the shared core is dimension-agnostic (no generics needed).

CONSEQUENCES:
- positive:
  - Adding a config-style lab = ~3 small files (types + feedbacks + scoring) + a thin wrapper + scenarios.
  - One scoring loop and one board to QA; behaviour shared, less visual/logic debt (BP-009).
- negative:
  - Two layers (shared board + per-engine wrapper) for config labs — slight indirection.
  - The core is string-typed for dimensions; engine dimension unions are authoring discipline, not enforced
    at the board boundary.
- follow_up:
  - Reuse `stationConfig` for any future config-style lab; the remaining PHASE_6 labs (Repo Refactor,
    Security Incident Room, Paper Figure Decoder) are different shapes and stay standalone unless one repeats.

### DEC-0011 — Review/mastery is a derived projection of progress, not separate state

STATUS: accepted
DATE: 2026-06-14
PHASE: PHASE_7
RULE_REFS: PH-800, PH-803, QG-070, BP-004, BP-005

CONTEXT:
- PHASE_7 needs mastery state, weak-area detection and a spaced-review queue. A naive approach adds a new
  persisted "review/mastery" store — but all needed signals already live in ProgressState (node completion +
  timestamps, lab score + weakSignals, lesson reviewHooks).

DECISION:
- `features/review/reviewModel.ts` is a PURE function `buildReviewState(progress, deps, now)` that projects
  ProgressState into mastery levels (introduced/practiced/needs_repair), a due-ordered queue (age + repair
  bonus), repair missions (lab weakSignals), and recurring themes (reviewHooks shared by 2+ completed nodes).
- No new persistence: review is recomputed from the single source of truth on render (QG-070 honored — UI
  never reaches storage directly). Mastery reflects demonstrated work only; no XP/streak/badge state (PH-803).
- The model takes `deps` (nodeById + reviewHooksForNode) and `now` as params → decoupled from content
  singletons and deterministic to test (BP-004).

CONSEQUENCES:
- positive:
  - One source of truth; review can never drift from actual progress. Fully unit-testable; no migration risk.
  - Adding signals later (e.g. lesson-level scores) extends the projection without schema changes.
- negative:
  - Recomputed each render (cheap at this scale; memoize if the graph grows large).
  - "Spacing" is age-based, not a full SM-2 schedule — sufficient for PH-801/PH-804, can deepen later.
- follow_up:
  - DONE (FL-0025): the queue resurfaces an actual transfer task — `findMission` + ReviewRunPage re-run the
    lab's transfer scenario and persist via completeLab. Projection unchanged; mastery refreshes from the result.

### DEC-0012 — Learning loop redesign: strategy-game mechanics + graded scoring + concise feedback

STATUS: accepted (design)
DATE: 2026-06-15
PHASE: POST-V1 redesign (spans content + interaction layers)
RULE_REFS: see `control/07_learning_loop_redesign.md` (LR-000..072); NG-034, VR-0003, PH-803, DEC-0010

CONTEXT:
- User testing the live app: the 2-option MCQ lessons are too easy/guessable, the 6-part feedback is a
  wall of text, and concepts open with a trivial question. User direction: make learning feel like a
  strategy game — situational tasks, many interaction forms (allocate/drag/sort/route), resource-spreading
  under scarcity with no single perfect answer (direction matters), concise reasoning.

DECISION:
- Adopt a strategy-game learning model (spec: control/07): a small library of deep, reusable MECHANICS ×
  many situations = unlimited tasks. Flagship = MECH-ALLOCATE (resource split under scarcity, graded on
  proximity to a good region, not exact correctness). Mechanics: allocate, boundary, connect, triage, sort,
  dial, weigh, inject, and the (harder) pick (= existing stationConfig).
- New GRADED scoring contract (hard constraints + soft optimum/proximity + per-dimension weights);
  feedback derived from the trade-off the learner made, not a fixed string.
- FeedbackCard → short prose, no field labels (user choice). Global, fixes all existing feedback at once.
- Interaction modality = per-task best-fit, mobile direct-manipulation first (sliders/fill-bars, tap-to-
  zone); real drag (dnd-kit) only where it clearly beats tapping and after a tap fallback exists
  (honors NG-034/VR-0003). Resource splits are sliders, never card-DnD.
- Evolve, don't rewrite: extend interactionModel + reuse stationConfig for hard PICKs; lessons gain richer
  interactive block kinds so a node = concise framing + a situational challenge.

CONSEQUENCES:
- positive: real difficulty + judgment training; one mechanic narrates thousands of situations; concise
  feedback fixes the wall-of-text globally; mobile-stable.
- negative: large content rewrite over time (43 lessons + scenarios); new scoring + new primitives to QA;
  the lesson/lab line blurs (managed by additive block kinds, not a rewrite).
- follow_up: Slice 1 = concise FeedbackCard (global) + MECH-ALLOCATE (evolve Context Budget Board) +
  redesign NODE-02-01 as the reference template; user plays + approves; then mechanic library + arc-by-arc
  content rollout (LR-060..062). No XP/streaks (PH-803); not gamification-for-its-own-sake.

### DEC-0013 — Direction sharpening: judgment-trainer that culminates in directing a build

STATUS: accepted (direction)
DATE: 2026-06-21
PHASE: PRE-SHIP content evaluation
RULE_REFS: control/00 (PC-014/023/024/040/043), control/08_learning_spine.md (SPINE-001..050)

CONTEXT:
- User asked the pre-ship mandatory questions: (1) does it give an edge over a normal IT student, (2) is it
  psychologically sound (motivation/memory/difficulty), (3) is it signal or noise, (4) could a student build
  "Open-Claw" (a real app a senior vibecoded with zero hand-written code). Evaluation (scan of all 11 arcs /
  43 nodes / control docs / live surfaces):
  - Q1: YES on JUDGMENT (coverage is the correct AI-eng surface; real edge), PARTIAL on PRACTICE.
  - Q2: difficulty ramp good, memory decent (spaced review), active learning good; WEAK on motivation
    (HomePage is a neutral menu) and on novice teaching depth (post-rollout frames may be too thin to attempt
    by reason rather than guess).
  - Q3: mostly disciplined; back half (Memory arc 06 ↔ Repo arc 09) overlaps on durable-docs/governance;
    05-05 visual retrieval is frontier-luxury.
  - Q4: NO from the app alone — it trains judgment/review but never has the learner DIRECT a real build; even
    the capstone is an architecture draft, not a build. App = necessary half, not sufficient.

DECISION:
- Name the real end-capability honestly (PC-014): direct an agent to build/maintain a system AND review/repair
  its output by layer. Judgment = necessary half; supervised build reps = sufficient half.
- Reframe the capstone (PC-040/043) to CULMINATE in directing a build (spec → direct → failure-injection →
  review/repair-by-layer), not end at an architecture diagram. Single highest-leverage change to close Q4.
- Add the learning spine (control/08) as the north star: three competencies (judgment/direction/review),
  CORE SPINE vs optional DEPTH, motivation rules (lead with the mission), teaching-depth rule (reasoned first
  attempt). Adds direction WITHOUT deleting content.
- Honest scope boundary (PC-024): the app is the flight simulator (judgment + decision reps), not the solo
  flight. Surface this; don't imply mastery from completion.

CONSEQUENCES:
- positive: clear, honest direction; a measurable end-bar (the Open-Claw round-trip); motivation + depth gaps
  named with fixes; back-half redundancy flagged for consolidation (not deletion).
- negative: the capstone needs real work to become a build-direction exercise (currently a station-config
  draft); HomePage/arc-intro motivation copy needs authoring; ~3 governance nodes to consolidate.
- follow_up (user-owned product calls, see OPEN_QUESTIONS OQ-0010): (a) build the direct-a-build capstone
  mechanic; (b) author mission-first HomePage + arc-intro pay-offs; (c) consolidate 06-04/09-03/09-04 to one
  spine governance node + demote the rest to review; (d) mark 05-04/05-05 optional-depth. No node deletions
  without user sign-off (user: "delete not too much").

### DEC-0014 — The Werft is a standalone real-time strategy game where PLACEMENT teaches architecture

STATUS: accepted (direction)
DATE: 2026-06-25
PHASE: Werft build-sim deep build (FL-0057..0060)
RULE_REFS: product-vision (Odin/roadmap.sh/Build-Your-Own-X level), build-game-is-its-own-app (memory)

CONTEXT:
- The Werft (`/build`) grew from a base-builder into the app's "do, not just recognise" half. Across several
  playtests the user steered three big calls: (1) the two views must be DIFFERENT tools that need each other;
  (2) free placement was busywork — "wouldn't it be cool if placement matters?"; (3) the turn-based sprint/
  release loop "feels terrible" (death-spiral, infinite-money clicking) → "do the full Plague Inc time idea".

DECISION:
- PLACEMENT = ARCHITECTURE LITERACY. The System-Karte is the six-phase request pipeline
  (boundary→knowledge→model→tools→check→ops). Dropping a bought skill into the RIGHT phase is the lesson
  (validate at the boundary, retrieve before the model, gate before the tool, eval before the answer, observe
  across all); right phase → stat bonus that feeds release defense, wrong → no bonus + a one-line why. Forgiving
  (skills accept ≥1 phase; cross-cutting fit ops). No predetermined path shown.
- REAL-TIME LOOP (Plague-Inc): time runs on a clock the player play/pauses/fast-forwards; income is passive,
  entropy creeps, the system auto-ships on a cadence, and neglected weaknesses pop as tappable event bubbles you
  handle in time. Removes manual-sprint money-clicking and the forced-doomed-release spiral (failures no longer
  harden the world).
- WHOLE-APP POLISH the game pulled in: a global light mode, a fullscreen overlay HUD, full keyboard control, and
  a rule that node/phase explanations are REAL teaching prose (no short "AI hero-phrases").

CONSEQUENCES:
- positive: the Werft now actually teaches request-lifecycle design + lets the player DIRECT a system over time
  (closes part of the DEC-0013 "practice/build" gap with a game, not a lesson); content quality bar raised
  app-wide (nodeInfo.ts); reusable theme + HUD + keyboard infra.
- negative: large surface in `features/buildgame/*` to maintain; balance is unplaytested by the agent (income/
  threat/event cadence are first-pass numbers); the game is not yet wired to lesson progress.
- follow_up: device playtest for balance + HUD/keyboard feel; consider tying lesson completion → starting budget;
  richer events; possibly a win/end condition. (Open idea, not built: per-node art.)

### DEC-0015 — Publication layer + DE/EN chrome locale (repo goes public for the resume)

DATE: 2026-07-04
STATUS: accepted
CONTEXT:
- The user wants the project on their CS resume; the deep audit (OQ-0014) found the code strong but the
  publication layer missing entirely (no git, README, deploy, CI, lint, license), and the user asked to
  keep German content while adding a translation option.
DECISION:
- Git repo initialized (honest initial snapshot + per-change commits) and published PUBLIC as
  github.com/ebuart/AICHITECT. `.claude*`/`.mcp.json`/CLAUDE.md and inception scratch files stay local
  (gitignored); `/source_material` IS committed — the control plane is the differentiator story.
- MIT LICENSE; package metadata (aichitect 0.9.0, author, repository).
- ESLint flat config (typescript-eslint + react-hooks v7 + react-refresh) — 0 errors; the compiler-powered
  react-hooks lints are WARN-scoped to `features/buildgame/**` only (real findings, need careful game-loop
  refactor, tracked in OQ-0014g). CI = GitHub Actions: lint + strict build + tests on push/PR.
- i18n SCOPE: app CHROME is bilingual now (lib/i18n: persisted DE↔EN store via useSyncExternalStore, html
  lang before first paint, typed dictionary where a missing EN key is a compile error, header toggle).
  CONTENT stays German-first; EN shows a German-first notice; content translation rolls out arc by arc on
  top of this mechanism. NOT chosen: full content i18n now (translating 53 lessons before the OQ-0015
  content polish would translate text that's about to change).
CONSEQUENCES:
- positive: repo is presentable (README with the pedagogy-as-CI + AI-direction story), CI badge, honest
  commit history from here on; locale infra ready for content translation.
- negative: "mobile-first" claim dropped (Werft is desktop-first); lesson content model has no per-locale
  fields yet — the content translation pass will need a `LocalizedText` decision; two >500-line game files
  still pending split (OQ-0014g).
- follow_up: deploy to Vercel (live demo URL in README), screenshots/GIF for the README, content
  translation pilot arc, OQ-0015 content fixes.

### DEC-0016 — Content translation = parallel Lesson files per locale, structurally mirrored

DATE: 2026-07-05
STATUS: accepted
CONTEXT:
- OQ-0015(e) needed an architecture for EN content on top of the DEC-0015 chrome locale. Options:
  per-field `LocalizedText = string | {de,en}` unions (touches every render site + every lesson type),
  key-based externalized strings (destroys the readable data-first authoring format), or parallel
  Lesson objects per locale.
DECISION:
- Parallel files: `content/lessons/en/<name>.en.ts` export a full `Lesson` with the SAME ids/structure,
  registered in `lessonEnById`; `getLesson(id, locale)` falls back to German. Rendering stays 100%
  untouched — a translated lesson is just another Lesson.
- Drift protection is a TEST, not discipline: `lessonTranslations.test.ts` asserts EN mirrors DE in
  exercise ids, option ids, correct flags and bucket assignments.
- Rollout order: an arc is translated only AFTER it passes the content-polish bar (OQ-0015) — never
  translate text that is about to be rewritten. Pilot = ARC-00 (2 lessons), shipped.
CONSEQUENCES:
- positive: zero type churn, zero render changes, readable EN sources, pedagogy locked to DE by test.
- negative: full duplication per lesson (~150 lines each; edits must touch both files — the mirror
  test catches structural drift but TEXT drift needs review); 52 lessons remain to translate.
- follow_up: translate ARC-01/02 after their polish pass; decide whether scenario/lab data and
  nodeInfo get the same parallel-file treatment when their turn comes.
