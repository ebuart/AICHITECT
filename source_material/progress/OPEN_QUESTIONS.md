# /source_material/progress/OPEN_QUESTIONS.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: WHEN_BLOCKED_OR_PLANNING  
PURPOSE: Track unresolved issues without blocking unrelated work.

## FORMAT_RULES

[OQ-001] Keep only unresolved questions here.
[OQ-002] Remove or archive resolved items.
[OQ-003] Each question needs owner/context/decision needed.
[OQ-004] Do not block current phase unless marked BLOCKING.

## PRIORITY_VALUES

- BLOCKING
- HIGH
- MEDIUM
- LOW

## QUESTIONS

### OQ-0001 — Exact local persistence choice

PRIORITY: MEDIUM  
PHASE: PHASE_1_APP_ARCHITECTURE_FOUNDATION  
STATUS: resolved  
RESOLUTION (2026-06-13):
- Typed LocalStorage adapter implemented behind StorageAdapter boundary (DEC-0002).
- Revisit IndexedDB only if interaction state grows large (PHASE_4+).

### OQ-0002 — Visual layout approach for graph-like systems

PRIORITY: HIGH  
PHASE: PHASE_2_VISUAL_SYSTEM_FOUNDATION  
STATUS: resolved  
RESOLUTION (2026-06-13):
- Primitives use deterministic HTML/CSS only — no canvas, no force-directed layout (DEC-0006).
- SystemEdge renders as a labelled connection list (mobile-safe); every dense diagram gets a CompactFallbackView.
- Open follow-up: composing primitives into full multi-node *diagrams* (e.g. Augmented-LLM map) lands in PHASE_4 lab visuals.

### OQ-0003 — First vertical slice content

PRIORITY: MEDIUM  
PHASE: PHASE_3_ROADMAP_AND_LESSON_ENGINE  
STATUS: resolved  
RESOLUTION (2026-06-13):
- Chose the first five sequential roadmap nodes (NODE-00-01..NODE-01-03) so the guided sequence is
  contiguous/unlockable from the start, and they cover all four required lesson modes (PH-402).
- Deviates from the original default (Context/Agents/Tools concepts) to prioritize a traversable chain;
  those concepts arrive in PHASE_5 once core interaction engines exist.

### OQ-0004 — npm audit high-severity advisories

PRIORITY: LOW
PHASE: PHASE_9_HARDENING_AND_RELEASE
STATUS: triaged (accepted, dev-only) — 2026-06-15
CONTEXT:
- 5 high-severity advisories, ALL in the esbuild → vite → vitest → vite-node chain (build/test toolchain):
  esbuild GHSA-gv7w-rqvm-qjhr (Deno-module RCE via NPM_CONFIG_REGISTRY) + GHSA-g7r4-m6w7-qqqr (dev-server
  arbitrary file read on Windows). Neither is in the production runtime: the deployed PWA bundle (dist/) does
  not ship esbuild/vite/vitest; the dev-server advisory affects local dev on Windows only.
TRIAGE:
- Real-world risk for the deployed app: negligible (dev-toolchain only, not on the runtime path).
- The only offered fix is `npm audit fix --force` → vite@8 (major breaking change); rejected during hardening
  to avoid breaking the build/PWA/test setup. A targeted `overrides` for esbuild risks vite@7 incompatibility.
DECISION:
- Accept for V1. Revisit on the next planned Vite major upgrade (vite@8) post-release; re-audit then.
  Do not run `--force` now.
RE-AUDIT 2026-06-21:
- Improved on its own: now only 1 LOW-severity advisory remains (esbuild GHSA-g7r4-m6w7-qqqr, dev-server
  file-read on Windows). The 5 highs are gone (transitive toolchain moved). `npm audit fix` (non-force) is a
  no-op — the remaining fix still needs an out-of-range major bump. Decision unchanged: accept (dev-only,
  Windows-only, not on the runtime path; this env is macOS). Re-check at the vite@8 upgrade.

### OQ-0005 — Human visual QA pass for PHASE_2 primitives

PRIORITY: MEDIUM
PHASE: PHASE_2_VISUAL_SYSTEM_FOUNDATION
STATUS: open (partially mitigated)
CONTEXT:
- Automated smoke (FL-0006) now renders every primitive without throwing, but AI still cannot see
  pixel-level layout/overlap bugs (VQA-001).
- Lessons may only consume a primitive after a human inspects it (VQA-200).

DECISION_NEEDED:
- Human runs `npm run dev`, opens `/visual-lab`, checks each primitive at 320–430px for overlap/overflow.

DEFAULT_IF_UNRESOLVED:
- Treat primitives as `partial` in VISUAL_QA_LOG; PHASE_3 roadmap/lesson-shell work may proceed, but
  block lesson *visuals* until the human pixel pass is done.

### OQ-0006 — Interaction previews in /visual-lab (layering)

PRIORITY: LOW
PHASE: PHASE_4_CORE_INTERACTION_ENGINES
STATUS: open
CONTEXT:
- PH-503/VQA-101 want a visual-lab section for interaction visuals, but `/visual-lab` lives in
  `components/visuals` and must not import `features/labs` (layering inversion).

DECISION_NEEDED:
- Where to host interaction previews without inverting layering.

DEFAULT_IF_UNRESOLVED:
- Engines are covered by render-smoke tests + reachable via real lab routes; add a features-level
  interaction gallery (or move visual-lab to a features route) when the 5 engines exist.

### OQ-0007 — PH-505 deferred: 3 of 5 core engines remain

PRIORITY: HIGH
PHASE: PHASE_4_CORE_INTERACTION_ENGINES
STATUS: resolved
RESOLUTION (2026-06-13):
- All 5 core engines implemented (CBB, FMT, Agent Trace Debugger, Tool Contract Forge, Architecture
  Builder), each with base + transfer scenarios, pure scoring, FB-pattern feedback. PH-505 met; 54 tests green.

### OQ-0008 — NODE-05-05 Visual Document Retrieval deferred to PHASE_6

PRIORITY: LOW
PHASE: PHASE_5_DOMAIN_TAXONOMY_AND_CURRICULUM_EXPANSION
STATUS: resolved
RESOLUTION (2026-06-14):
- Authored NODE-05-05 lesson (`paperVisualRetrieval.ts`, RET-008/009) together with the Paper Figure Decoder
  lab (FL-0023) in PHASE_6, satisfying the deferral condition (frontier concept + failure modes + interaction
  mapping, PH-604/PH-702). ARC-05 is now fully lesson-covered; the manual-complete placeholder is replaced.

### OQ-0009 — Secondary lab bindings without engines ("Lab folgt")

PRIORITY: LOW
PHASE: PHASE_9_HARDENING_AND_RELEASE
STATUS: resolved (built) — 2026-06-15
RESOLUTION:
- Built all 4 secondary engines on the shared stationConfig core (FL-0029): Layer Stack Builder
  (classify failures by layer), Trade-off Duel (comparative architecture decision), Constraint Puzzle
  (structured output / constraint strictness), System Postmortem (root cause → durable rule). Each has
  base + transfer scenarios, pure scoring, FB feedback, render smoke + scoring tests. → 15 engines.
- Every cataloged lab now resolves a registered engine (hardening assertion in tests/coverage.test.ts);
  no "Lab folgt" placeholder remains for any real lab. The LabPage "Lab folgt" path is retained as a
  defensive fallback but is no longer reachable via a catalog lab (its obsolete test was removed).

### OQ-0010 — Direction follow-ups from the pre-ship evaluation (user-owned product calls)

PRIORITY: HIGH (these close the Open-Claw gap; they are the difference between "good simulator" and "ships")
PHASE: PRE-SHIP / POST-V1
STATUS: open — needs user direction before build
CONTEXT:
- The 2026-06-21 evaluation (DEC-0013, control/08) found the app trains JUDGMENT well but under-teaches
  DIRECTION and never has the learner direct a real build. Direction is now sharpened in the docs; these are
  the concrete builds that realise it. Each is a product call (don't unilaterally delete/rewrite content).
REPRIORITISED (user 2026-06-21):
- [A] ★BIGGEST — DIRECTION track ("PM-of-bees"): build the orchestration curriculum spec'd in
  control/09_direction_track.md. Two parts: (a) Phase-1 light director-seat retrofits woven into the existing
  early arcs (DIR-020) so direction ramps from the start; (b) the large new ARC-11..14 track (DIR-031..034)
  after the current 43, ending in the full direct-a-build round-trip that also upgrades the capstone
  (PC-040/043). Needs ~2 new mechanics (BRIEF-BUILDER, SWARM-BOARD). This is the Open-Claw closer and wants
  the most attention. Now also includes ARC-15 THE DOC CONTROL PLANE (DIR-036): a ~10-node cluster on designing
  docs good for humans AND AI (the user's `[XXX-000]`-system meta-skill), routing facts between doc-types,
  keeping the corpus lean — reuses existing mechanics, no new engine. Future-critical for large projects.
- [B] BIG — Intro VISUALS to kill "I'm just guessing" (SPINE-040): when a topic is introduced, ground the
  first attempt with a graph/stat/diagram (recall-vs-cost curve, token-budget bar, latency/quality scatter)
  so the learner reasons, not guesses. Add chart/stat primitives to the visual system; apply heaviest at each
  concept's first node, thin out on transfers (SPINE-042).
- [C] Back-half consolidation (SPINE-021/022): 06-04 / 09-03 / 09-04 overlap on governance — keep ONE on the
  spine, demote the rest to review/transfer reuse (re-point, don't delete). Reorders the roadmap → sign-off.
- [D] Optional-depth marking: 05-04 + 05-05 flagged as skippable depth (badge + ordering). Cosmetic.
- [E] SMALLEST — motivation surface (mission-first HomePage + arc pay-offs, SPINE-030). Lowest ROI; do last.
- [F] Durability reframe of existing nodes (SPINE-003..005): reflexive scan = GOOD (no prompt-trick rot; NG-007
  held). Watch list — teach the DURABLE PRINCIPLE, not the ephemeral technique/brand: 03-03 Constrained
  Decoding (principle = "force valid structure", not the decoding feature) · 03-04 MCP (principle =
  "standardize tool integration over one protocol", survives if MCP-the-brand doesn't) · 05-01..05 Retrieval
  (principle = "get the right EVIDENCE in front of the model"; address head-on that growing context windows
  shift WHEN you reach for retrieval — RAG-the-acronym may date, evidence-provisioning won't) · 05-05 Visual
  already optional-depth. Reframe (copy), don't delete. Research current senior practice at reframe time
  (SPINE-006).
RECOMMENDATION:
- [B] first (cheap, directly fixes the #2 "guessing" pain, reusable primitives), in parallel with [A]'s
  Phase-1 retrofits (cheap, make direction present early). Then [A]'s ARC-11..14 (the big build — design
  deliberately), then [C]/[D] reorder, then [E] last. No node deletions without sign-off ("delete not too
  much").

### OQ-0011 — BREADTH: more tasks per concept, multiple points of view

PRIORITY: HIGH (depth-of-practice; the user 2026-06-21: "we only have so few tasks … extend amount so we get
important info from more points of view")
PHASE: POST-V1 content depth (LR-061 "situations × mechanics"); ongoing
STATUS: open — backlog, build incrementally
CONTEXT:
- Today most nodes have ONE base scenario (sometimes + one transfer) = a concept is seen from a SINGLE angle,
  then never again except in review. The engine model (control/07 LR-001: a few deep mechanics × many
  situations = ~unlimited tasks) exists exactly to teach each idea from several viewpoints — we are
  under-using it. This is also the user's original redesign ask ("each exercise covering 1 point of view",
  DEC-0012): a concept should be hit from allocate + sort + debug + decide angles so it STICKS.
THE WORK:
- For each HIGH-ROI / durable concept, author 2–4 scenarios across DIFFERENT mechanics, each illuminating a
  distinct facet (not the same task reskinned). Example — "context noise": curate-a-doc-set (budget board) +
  allocate-under-scarcity (allocator) + find-the-symptom (trace) + spot-the-noise (sort). Each angle = a new
  point of view on the same durable idea.
- Reuse the EXISTING engine library (no new engines needed — this is content breadth, not new mechanics).
- Every new task must clear the bars already set: LR-011a (realistic distractors) + LR-011b (no spoilers,
  spiral difficulty) + SPINE-004 (durable) + SPINE-005 (ROI) + the pedagogy test pattern (intended move wins,
  tests/directionScenarios-style). Author the harder/disguised angles as later-difficulty / transfer / review
  variants so breadth also deepens the spiral.
PRIORITISE (most viewpoints first): the durable spine concepts — context curation, DIRECTION/orchestration
  (the new ARC-11/12 nodes especially), evals/Definition-of-Done, trust boundaries, failure-diagnosis-by-layer.
  These are where extra angles buy the most mastery.
NOTE: this is the natural home for spaced-review variety too — more angles per concept = a richer review queue
  (reviewModel already surfaces transfer/themes).
DELIVERY SUB-DECISION — RESOLVED + BUILT (user 2026-06-21 "best version for UX" → option ii; FL-0045):
  (ii) MULTI-CHALLENGE LESSON shipped. LessonView now supports 2+ challenge blocks with GUIDED SEQUENTIAL
      REVEAL (the next angle appears only after the current challenge is finished) and completes once ALL
      challenges are done (fire-once guarded). A "n/N Blickwinkel" progress hint shows for multi-angle lessons.
      Tested (reveal + complete-after-all, tests/lessonRender). References: LESSON-02-01 (allocate + curate),
      LESSON-05-01 (build + configure). Route (i) transfer/review still available for review-only variety.
  CHEAP TIER DONE (FL-0045/0046): all 4 nodes with two distinct mechanics already bound are now
      multi-viewpoint — 02-01 (allocate+curate), 05-01 (build+configure), 04-01 (build-predictable +
      weigh-open), 08-03 (order-response + diagnose). Zero new scenarios.
  TIER 2 STARTED (FL-0047): 2 DIRECTION nodes got a genuinely-distinct 2nd facet via a NEW scenario on a
      different mechanic — 11-02 (structure + coordination-cost trade-off), 12-03 (triage + intervene). Each
      pedagogy-tested. HONEST FINDING: only those 2 of the 7 DIRECTION nodes had a clean distinct 2nd
      mechanic; the other 5 (11-01/03/04, 12-01/02) stay single-facet — a forced 2nd angle would re-teach an
      adjacent node (12-01 brief ↔ 11-01 curate; 11-03 oversight ↔ 11-04 boundaries) or jam a mismatched
      engine. Did NOT force them (quality > quantity).
  REMAINING breadth options (lower priority): (a) TRANSFER variants (same mechanic, harder situation) on the
      single-facet nodes → spaced-review depth via /review, not in-lesson POV; (b) evals/boundaries
      multi-viewpoint if a clean 2nd mechanic exists; (c) new DIRECTION arcs (ARC-13+) over more facets on
      existing nodes. Each new task clears LR-011a/b + SPINE-004/005 + a pedagogy assertion.

### OQ-0012 — AI-slop / "too obvious" audit (realness pass)

PRIORITY: HIGH (the user's "real feel" bar — a question you can't get wrong, or that smells AI-written, is bad)
PHASE: POST-V1 content quality (control/07 LR-011c)
STATUS: open — playtest-driven, ongoing
CONTEXT:
- User 2026-06-21 tested 12-01 + 02-03 and hit two failure modes: (1) a live spoiler readout (02-03 budget
  board showed "Noise-Risk: hoch 67%" as you built — FIXED, gated post-eval, FL-0048); (2) AI-SLOP question
  (12-01 brief: the right answer was the obviously-sensible one, the wrongs were caricatures nobody picks
  „bau das Feature, du weißt schon", plus a filler „Constraint" line — REDESIGNED with realistic traps in a
  concrete CSV-export situation, FL-0048). Principle encoded as LR-011c.
DONE:
- LR-011c (control/07): no AI-slop, no free wins — distractors must be the TEMPTING REAL mistake, concrete
  situations, prose carries info not vibes; if a concept has no hard call, use another mechanic or cut.
- Mechanical guardrail: `contentQuality.test.ts` SLOP_PHRASE catches crude caricature tells (du-weißt-schon,
  "siehst es wenn du es siehst", …). Crude-phrasing grep across all scenarios = clean.
REMAINING (NOT mechanizable — needs the playtest "feel" judgment):
- The subtle "you'd never pick the wrong answer" cases. PRIME SUSPECTS: 2-OPTION stations (right vs one
  weak) — inherently the most guessable. Many are fine (the wrong is a real trap: „retry the task", „just
  document it", „best-effort parse") but some are too obvious. FIX per case: add a 3rd realistic trap, sharpen
  the wrong into a mistake a competent engineer makes, switch mechanic, or cut. Best driven by the user
  flagging during playtest → I fix (don't blind-sweep; risk "fixing" questions whose wrong IS a real trap).
LITMUS for each: read as a skeptical senior — smells like AI, or can't get it wrong → redesign.

### OQ-0013 — Werft balance, win-condition, and wiring to the lessons (user-owned product calls)

PRIORITY: MEDIUM (the Werft is playable + green, but unplaytested for feel; see DEC-0014, FL-0057..0060)
PHASE: Werft post-build, playtest-driven
STATUS: open — needs device playtest + user direction
CONTEXT:
- The Werft is now a real-time strategy game (clock, auto-release every 12 days, event bubbles, phase-placement).
  All numbers are FIRST-PASS and agent-unplaytested: `dayIncome`, `releaseThreat`, drift/debt creep, event
  cadence (`EVENT_CHECK`/`EVENT_TTL`), `RELEASE_EVERY`, tick speed (2.2s/day at 1×).
OPEN:
- (a) Balance: is the loop too easy/slow/fast? Does tier-up pace feel right? Are events frequent/fair enough to
  matter without nagging? (Drive by the user playtesting on a device, then I tune — don't blind-sweep numbers.)
- (b) Is there a WIN / end-state, or is it an endless sandbox + missions + prestige? (none defined yet.)
- (c) Should the Werft connect to the lessons — e.g. completing a node → starting budget or unlocking a skill —
  so the two halves reinforce each other? (currently independent.)
- (d) HUD / keyboard / animated-background FEEL is human-unverified.

### OQ-0014 — Resume-readiness gaps (deep audit 2026-07-04)

PRIORITY: HIGH (user wants this project on CS-job resume)
PHASE: post-hardening, pre-publication
STATUS: mostly RESOLVED 2026-07-04 (DEC-0015, FL-0067/0068) — (a) git + public GitHub repo
`ebuart/AICHITECT` ✅ · (b) README ✅ (screenshots/GIF still missing) · (d) CI ✅ · (e) ESLint ✅ (0 errors)
· (f) language: chrome DE/EN toggle shipped, content translation staged per arc · (h) LICENSE+metadata ✅.
(c) DEPLOYED same day: https://aichitect-theta.vercel.app (GitHub-connected auto-deploy).
REMAINING: (g) split BuildGamePage/gameModel + fix the warn-scoped react-hooks compiler findings in
buildgame, (i) documented save-wipe trade-off, README screenshots.
CONTEXT (audit result):
- CODE HEALTH GOOD: build green (tsc -b strict + vite, 3.1s), 216/216 tests, tsconfig max-strict,
  0 `any` / 0 `@ts-ignore` / 0 console.log, pure-logic-vs-render separation, adapter boundary,
  executable content-quality gates (`contentQuality.test.ts`), code-split 110kB gz, PWA. 1 low audit vuln
  (esbuild dev-server, dev-only — GHSA-g7r4-m6w7-qqqr, `npm audit fix` available).
OPEN (ordered):
- (a) NO GIT REPO — no history, no GitHub. Must `git init` + publish; all future work in small commits.
- (b) NO README.md — the #1 recruiter artifact. Needs: what/why, screenshots/GIF, live-demo link,
  architecture overview, test philosophy (pedagogy-as-CI is the differentiator), AI-native workflow story
  (source_material control plane = the meta-proof of the skill the app teaches).
- (c) NOT DEPLOYED (DEPLOY_STATUS: not_started) — needs live URL (Vercel-ready already).
- (d) NO CI — add GitHub Actions: install → build → test on push/PR.
- (e) NO ESLint/Prettier config — standard hygiene signal reviewers look for.
- (f) LANGUAGE MIX: `lang="de"`, German lesson prose, English titles/code. Decide target audience;
  minimum = English README + note. (user decision)
- (g) 2 files >500-line rule: BuildGamePage.tsx (940, subcomponents extractable), gameModel.ts (641).
- (h) package.json metadata: version 0.0.0, no author/license/repository; no LICENSE file.
- (i) Save-wipe on version bump (adapter + gameModel reset instead of migrating) — fine local-first,
  document as known trade-off.

### OQ-0015 — Content audit findings (deep read 2026-07-04): fix redundancy, then translate

PRIORITY: MEDIUM-HIGH (drives the per-node re-authoring order + blocks EN content translation)
PHASE: content polish, pre-translation
STATUS: (a)–(c) RESOLVED 2026-07-05 (FL-0069: six exercises rewritten as apply-not-restate; lesson-level LR-011 guards added). REMAINING: (d) sources surface (→ merged into OQ-0016e) · (e) translation sequencing (architecture decided, DEC-0016; ARC-00 pilot shipped)
CONTEXT (audit method: full read of ~30 lessons across all arcs + stem/takeaway sweep of the rest +
scenario samples + nodeInfo; judged against SPINE durability, LR-011a/b/c, and technical correctness):
- VERDICT: content is genuinely strong. No factual errors found (BM25/vector blind spots, RRF, contextual
  retrieval, constrained-decoding masking, ReAct tool economy, grounding-as-entailment, delimiter-forgery,
  trust-laundering, least-privilege scoping, eval-case pathologies — all accurate and current). Exercises
  operate on concrete material with tempting-real-mistake distractors; ARC-08/13 clearly meet the
  "skeptical senior could get it wrong" bar. Direction track + doc-control-plane cluster are genuinely
  differentiated content. nodeInfo/Werft prose is real teaching text.
OPEN (ordered):
- (a) CROSS-ARC DUPLICATE: LESSON-01-01 `augment-which` and LESSON-05-01 `why-rag` are near-identical
  (support bot needs CURRENT monthly-changing tariffs → retrieval; same distractor trio fine-tune /
  bigger-model / prompt-plea). Second encounter is a free win. Re-skin one (different domain + subtler
  distractors, e.g. compliance rules where fine-tuning is genuinely tempting).
- (b) SOFT ECHOES (same principle re-asked with same answer shape, weaker offense): 02-04 `isolate-why`
  ↔ 04-03 worker-isolation rationale; 01-02 `climb-when` ↔ 04-01 `default-bias`. Consider varying the
  angle (cost/failure-mode/ops) instead of the same "why is X the point" pick.
- (c) CLOSING-PICK REDUNDANCY inside easier lessons: the final `pick` is often answerable verbatim from
  the intro note (e.g. 00-02 `iceberg-why`, 02-01 `budget-principle`, 02-02 `noise-principle`). The HARD-
  pass lessons (05-03, 07-03, 08-03, 13-03) don't have this. Matches the existing per-node ground-up
  re-authoring directive (PROJECT_MEMORY REDESIGN_PIVOT) — these picks should move from "restate the note"
  to "apply it somewhere the note didn't cover".
- (d) SOURCES SURFACE (optional, product): research notes exist in /source_material/research but lessons
  cite nothing in-app. A per-lesson "sources" line would raise credibility (roadmap.sh style). User call.
- (e) TRANSLATION SEQUENCING: translate only after (a)-(c) fixes per arc; needs a LocalizedText decision
  in lessonModel (per-field `{de,en}` vs parallel lesson files) — spec before the pilot arc.

### OQ-0016 — External validity audit (2026-07-05): coverage gaps vs. industry/OWASP + the "real reps" ceiling

PRIORITY: MEDIUM-HIGH (product calls — these decide whether the app is "TryHackMe-valuable" or "very good quiz")
PHASE: post-V1 curriculum expansion
STATUS: open — audited against external sources, needs user direction
CONTEXT (checked against 2026 hiring data, OWASP LLM Top 10 v2 + OWASP Agentic Top 10 2026, and the
TryHackMe learning model):
- COVERAGE CONFIRMED STRONG: 2026 role demand = RAG, agent workflows, tool use, MCP, eval literacy
  ("the single biggest hire signal"), context engineering (now a job title), translating AI capability
  into product behavior — every one of these is a dedicated arc here; the DIRECTION track maps to the
  emerging lead/PM-of-agents roles almost verbatim. Pedagogy aligns with testing-effect/active-learning
  research: forced retrieval, immediate diagnostic feedback, spaced review, transfer scenarios.
OPEN (ordered by value):
- (a) SECURITY GAPS vs OWASP LLM Top 10 v2: RAG/data POISONING (LLM04) and vector/embedding weaknesses
  (LLM08) are untaught; unbounded consumption/cost-DoS (LLM10) only implicitly (loop stop-conditions).
  Candidates for 2–3 new ARC-08 nodes — poisoned-corpus incident fits the existing incident-room engine.
- (b) THE "REAL REPS" CEILING (PC-024, now sharpened): TryHackMe's edge is real VMs — learners DO the
  thing. Everything here is simulated judgment. The bridge exists already: the capstone/direction track
  could end in a REAL directed build (learner writes an actual brief → runs a real agent (Claude Code
  or similar) → accepts/rejects real output against their brief). Even ONE real round-trip would move
  the app from "excellent simulator" to "practice ground". Big product call: scope, safety, cost.
- (c) OPERATIONS THINNESS vs job listings: deployment/serving, streaming UX, latency/cost engineering
  beyond the trade-off duel, RAG-corpus upkeep (re-indexing, freshness) are barely present. Fine for
  the architecture-first thesis — but worth one "ops reality" node or arc.
- (d) ROLE SIGNAL: THM converts learning into hireable signal (role paths, certificates, shareable
  profiles). Nearest cheap equivalent: a shareable capstone/mastery summary (static export). Optional.
- (e) SOURCES SURFACE (carried from OQ-0015d): research notes exist in /source_material/research but
  the app cites nothing. A per-lesson "sources" line = credibility + follow-up reading. Cheap, high value.

### OQ-0017 — ARCHITECTURE-PHYSICS track (user 2026-07-05: "we don't really teach senior level architectural knowledge")

PRIORITY: HIGH (the user is right — audited)
PHASE: curriculum expansion, runs with the experience overhaul
STATUS: open — ARC-14 created, first node shipped (NODE-14-01), rest needs authoring
CONTEXT (honest gap assessment):
- What exists teaches AI-LAYER judgment (context/retrieval/evals/security) and DIRECTION. What was
  missing is the timeless mechanics seniors are actually hired for: behavior under load, failure
  containment, state, cost. These are provider-independent, model-independent — maximum SPINE
  durability — and the most life-pattern-visual topics in the whole field.
PLANNED NODES (each: Akte → protocol-grammar interactive → compute + transfer; life-pattern first):
- (a) ✅ NODE-14-01 Under Load: queues, capacity, retry storms, load shedding, Little's Law
  (supermarket checkout; EXP-LOAD). SHIPPED 2026-07-05.
- (b) Caching & Staleness: pantry vs. store run; hit rate, TTL vs. invalidation, thundering herd.
- (c) Latency Budgets: a pizza-delivery promise decomposed; p50 vs p99, budget per hop, timeouts
  as contracts (fits the request-flow explorer with a stopwatch overlay).
- (d) Retries & Idempotency: the double-charged credit card; retry-safe vs. not, dedup keys.
- (e) Blast Radius & Bulkheads: ship compartments; isolation pools, circuit breakers (reuses
  LoadSim with two pools).
- (f) State & Consistency: two cash registers, one inventory; read-after-write surprises.
- (g) Cost Physics: tokens×requests×margin; the unit-economics dashboard.
ORDER: (c) next (composes with EXP-REQUEST-FLOW), then (b)/(d). Each node = one everyday pattern,
one interactive, laws pinned in tests like tests/loadSim.test.ts.
