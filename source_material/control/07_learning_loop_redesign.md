# /source_material/control/07_learning_loop_redesign.md

STATUS: DESIGN_SPEC (directional)  
LOAD_PRIORITY: WHEN_BUILDING_INTERACTIONS_OR_CONTENT  
PURPOSE: Redesign the learning loop from easy 2-option questions + verbose feedback into
strategy-game-style situational challenges. Captures the 2026-06-15 brainstorming.

## WHY (user feedback, 2026-06-15)

[LR-000] Tested feedback: (1) most questions are too easy — 2-option MCQ where one option is
obviously wrong, guessable, no real challenge; (2) the 6-part feedback is a wall of text (half a
page) for an already-correct answer; (3) concepts start with a trivial question instead of a rich
situation. Direction from user: make teaching feel like playing a strategy game — situational tasks,
lots of interaction forms (drag/allocate/sort/route), resource-spreading under scarcity with NO single
perfect answer (direction matters, not exact correctness), concise reasoning.

## VISION

[LR-001] Teach AI engineering the way strategy/indie games teach systems thinking: each node is a
tactical SITUATION you play, not a question you answer. A small set of deep, reusable MECHANICS ×
many situations = effectively unlimited unique tasks (the indie-game content model).

[LR-002] The flagship mechanic is RESOURCE ALLOCATION UNDER SCARCITY, graded on direction not
correctness: e.g. "8k tokens for situation Y — split across system-rules / task / retrieved-docs /
chat-history / examples." No perfect answer; scored on whether the learner protected what matters
HERE and didn't drown the signal. Generalizes to tool-scope, eval coverage, cost/latency/quality,
team capacity.

## PRINCIPLES

[LR-010] Situation-first: lead with a meaty, realistic scenario. The challenge IS the situation.
[LR-011] No guessable binaries: every challenge needs genuine difficulty — plausible distractors or a
graded optimum. If a 12-year-old can guess it cold, it is not shipped.
[LR-011a] Distractors must be PLAUSIBLE and domain-realistic (user feedback 2026-06-18). NEVER use lazy
filler like „Modell zu klein/zu groß", „größeres Modell" or „Prompt zu kurz/zu lang" as the wrong option —
in ~99% of real cases model size and prompt length are NOT the cause, so they read as dummy answers. Wrong
options should be things a competent engineer might actually try and get wrong: a symptom patch, an
over-engineering, a tempting-but-wrong control, the right idea on the wrong layer.
[LR-011b] No answer-announcing labels, and SPIRAL difficulty (user feedback 2026-06-19: "teach excellence
like TryHackMe, not a NotebookLM quiz"). Two rules:
  (1) NEVER pre-stamp the verdict on a choice. A card tagged „NOISE“/„KEY“/„STALE“, or an item literally
  named „Unverwandtes Marketing-Doc“ / „Langer alter Chat-Verlauf“, answers itself — that is a quiz, not a
  challenge. The learner must JUDGE from the item's nature (label, source type, token cost, the situation);
  the verdict is revealed only AFTER evaluation, as the teaching moment. Distractors should look plausibly
  right (e.g. „Marketing-Onepager zum Produkt“ — same product, but off-task), so success needs reasoning,
  not keyword-matching.
  (2) Once the app has TAUGHT a fact, do not re-teach it the same obvious way — re-test it differently and
  harder. Clear, signposted examples belong at a concept's FIRST node; every later appearance (transfer,
  cross-arc reuse, capstone) must disguise it so the learner applies the rule under a new surface. Difficulty
  ramps along the curriculum; a fact taught in ARC-02 shows up unlabeled and embedded in ARC-08/10.
[LR-011c] NO AI-SLOP, NO FREE WINS (user feedback 2026-06-21: "could people tell it's AI? then it's bad — we
want a real feel"). A challenge FAILS if a competent learner could (a) pick the right answer without thinking,
or (b) smell that it was AI-generated. Kill these symptoms:
  - CARICATURE distractors: the "right" option is the obviously-sensible/verbose one and the wrongs are
    strawmen nobody picks („bau das Feature, du weißt schon", „jede Zeile vorgeben"). The reveal teaches
    nothing because no one chose wrong.
  - OBVIOUS-good-vs-obvious-bad framing: if the option wording itself signals right/wrong, it's a quiz.
  - FILLER prose that restates the prompt without adding information („der Engpass ist dein Brief: zu vage
    trifft daneben, zu eng erstickt ihn") — generic AI cadence, zero signal.
  FIX: every distractor is the TEMPTING REAL mistake a competent engineer actually makes — the plausible,
  subtly-wrong choice (the qualitative goal that FEELS specified; the manual review that FEELS responsible;
  the over-diligent implementation spec) — set in a CONCRETE, specific situation (a named feature, real
  fields), never a generic "you delegate a task". Prose must carry information, not vibes. If a concept has no
  genuinely-hard call, it is NOT a good pick-question — use a different mechanic or cut it (NG-035, PC-031).
  LITMUS: read it as a skeptical senior — if it smells like AI or you can't get it wrong, it does not ship.
[LR-011d] BESPOKE CONCRETE EXERCISES + REAL DIFFICULTY (user feedback 2026-06-22, after comparing to their
statr app: 343 concrete questions / 8 formats / runs R / feels natural). The "everything is a mechanic-board
wrapped in scenario+constraint, phrased 'Wie machst DU X'" template IS the AI tell. Replace it:
  - GROUND-UP per node: reason about what/why/how the concept matters, which ANGLES give the biggest ROI, then
    design a DIFFERENT exercise per angle. No single template; the format follows the material.
  - CONCRETE MATERIAL shown + impersonal phrasing: a real ticket/trace/diff/config/number, asked about
    directly ("Welche Zeile ist der Angriff?"), not abstract role-play about "you the director".
  - FORMAT VARIETY by need: pick · MULTI-select (select-all, inherently harder) · spot (tap the line) · and as
    built: predict-output, completion, interpret, rank/order. New bespoke `exercise` block (lessonModel
    Exercise; ExerciseView) — NOT a mechanic engine, NO scenario/constraint. Density: several per concept.
  - HARD by default: subtle material (a real injection has NO "ignore instructions" magic words; it's
    socially engineered), CLOSE distractors, second-order ("the defense is in place — how does it still get
    through?"), compositional (trace + config together). Bar: "could a skeptical senior get it wrong if
    careless?" — if not, too easy.
  - NO FIXED ANSWER POSITION: the correct option must never sit in a constant slot. Shuffle option order at
    render (`lib/utils/shuffle`, once per mount) — applied in ExerciseView + StationConfigBoard (10 engines) +
    agentTrace + failureModeTree. "First is always right" is a free win and an authoring tell.
  - NO TELEGRAPHING / AI-META HINTS: cut intro lines that coach the answer ("Such die Zeile, die den Agenten
    zu einer Handlung bewegen will"). The stem poses the question; the learner does the work.
  PILOT: NODE-08-03 fully rebuilt to this; NODE-05-03 (Hybrid/Reranking) is the 2nd pilot.
  ROLLOUT is a per-node ground-up re-authoring (big; engines stay available but stop being the default) — do
  it node-by-node, user reacts.
[LR-011e] NO MOTIVATIONAL META-FILLER (user feedback 2026-06-21: "another useless AI style tagline... no
information just slop"). Every header line must carry INFORMATION (a definition, a concrete setup, a learning
goal) — never meta-commentary ABOUT the exercise ("erst lesen, dann rechnen, dann urteilen", "jede härter als
sie aussieht", "Trace lesen, Fehlerursache von Symptom trennen"). The per-mode `tagline` mechanism was REMOVED
from lessonModes + the lesson header for exactly this reason. A note is allowed ONLY if it teaches the prior
context the exercises assume (e.g. "BM25 matcht exakte Tokens, Vektoren matchen Bedeutung") — that doubles as
the difficulty-fairness anchor (LR-011d: hard, but solvable from in-node + prior-node context, never from
nothing).
[LR-012] Many task forms, not MCQ-only: allocate, place/boundary, connect/route, triage/order,
sort/classify, dial/tune, weigh/defend, inject/survive, and the (harder) pick. Variety per concept.
[LR-012a] BESPOKE MECHANIC LIBRARY (built 2026-06-22; user: "just picking/ordering/multi-picking is NOT okay
for all nodes — more puzzle-game types"). 14 single-submit, tap-first, mobile-safe, brutalist mechanics, each
its own component in `features/lessons/exercises/` + a union member in `lessonModel.Exercise`, dispatched by
`ExerciseView`. NO scenario/constraint wrapper. Reveal = thin border + per-item `why`. Shuffle option/right/
pool order at render. The set:
  - pick · multi · spot (originals)
  - order (up/down sequence) · compose (pick blocks that belong + order them; pool has distractors)
  - categorize (N buckets) · match (connect left↔right) · cloze (fill blanks in a config/schema from chips)
  - stepwise (predict each trace step's verdict — "run it in your head") · multispot (tap ALL offenders)
  - diff (tap the changed line that breaks it) · contradiction (tap the conflicting line across two panes)
  - budget (allocate a cap across items; DETERMINISTIC checker = ranges + total, no stored answer)
  - threshold (one slider; DETERMINISTIC = admit/reject must match labels; precision/recall made visceral)
  Validated by `tests/lessons.test` (per-format integrity switch) + `tests/exerciseMechanics.test` (drives each
  to completion). Authored into 8 nodes: 05-01 compose, 05-02 categorize/match, 02-01 budget/order, 03-02 cloze,
  04-05 stepwise, 07-03 +contradiction, 08-01 multispot/diff, 08-02 threshold.
[LR-013] Graded scoring where there is no single answer: proximity to a "good region" + hard
constraints, not exact match. Direction > correctness.
[LR-014] Concise feedback: short prose, no field labels — name the trade-off the learner made in 1–2
sentences (e.g. "40% on chat history — under scarcity that is the first thing to cut"). Optional depth
stays out of the way.
[LR-015] Mobile-bulletproof interaction (320–430px): direct-manipulation (sliders/fill-bars, tap-to-
zone) is the default; real free-form drag (dnd-kit) only where it clearly beats tapping and AFTER a
tap fallback exists (honors NG-034 / VR-0003). Resource splits are sliders, never card-DnD.
[LR-016] Reuse the engine framework: each mechanic is a thin interaction component + a graded scoring
function + a feedback selector, registered like the existing config labs (DEC-0010 precedent). Pure,
testable scoring; scenarios are data (BP-031, LS-009).

## MECHANIC_LIBRARY (the "thousands of tasks" engine)

| MECH | strategy-game inspiration | AI-eng concept | mobile interaction | scoring |
|---|---|---|---|---|
| MECH-ALLOCATE | Frostpunk heat · Civ sliders · RimWorld priorities | context budget, tool scope, eval coverage, cost/latency/quality | sliders/fill-bars, live %, sum-constraint | proximity to good region + hard constraints; names the over/under-invested dimension |
| MECH-BOUNDARY | Into the Breach · tower defense · base building | trust boundaries, approval gates, sandbox, input isolation | tap-card → tap-zone (drag bonus) | high-risk paths protected? over-blocked harmless ones? |
| MECH-CONNECT | Factorio · Opus Magnum | architecture, retrieval pipeline, workflow-vs-agent routing | tap-to-link nodes (drag bonus) | capability coverage, no redundancy, simplicity |
| MECH-TRIAGE | This War of Mine · Papers Please · dispatch | incident response, refactor order, plan-act-observe | reorder (up/down or drag), limited actions/clock | stop-the-bleeding first, root-cause second |
| MECH-SORT | card sorters | failure-by-layer, trusted/untrusted, structured/unstructured | tap-card → bin (drag bonus) | correct bin + distractor resistance |
| MECH-DIAL | Plague Inc · difficulty dials | constrained-decoding strictness, top-k, chunk size, temperature | steppers/sliders + live consequence preview | fit to the scenario profile |
| MECH-WEIGH | Disco Elysium checks · debate games | trade-off weighing, architecture defense | weight chips / commit a stance | did you weight the dominant concern for THIS situation? |
| MECH-INJECT | XCOM overwatch · roguelike events | failure injection on the learner's OWN design | replay prior choices vs an injected hit | did the earlier choices hold up? |
| MECH-PICK | dialogue choice | the genuinely-hard decision | tap option (3–4 plausible) | best-fit (existing stationConfig engine, harder content) |

[LR-020] MECH-PICK = today's stationConfig engine, kept for genuinely-hard 3–4-option calls; the other
mechanics are new. MECH-ALLOCATE is the evolution of the Context Budget Board (include/exclude → graded %).

## SCORING_MODEL

[LR-030] New graded scoring contract alongside best-fit: `score(input, rubric) → { score 0..1,
masterySignals, weakSignals, tradeoff }`. Rubric = hard constraints (must-keep / must-not-exceed →
violation is critical) + a soft optimum / good region (proximity, normalized) + per-dimension weights.
[LR-031] Feedback is DERIVED from which dimension the learner under/over-invested (the `tradeoff`),
not a fixed string — so the same mechanic narrates thousands of situations.

## FEEDBACK_MODEL

[LR-040] FeedbackCard renders short prose, no field labels: a severity chip + 1–2 sentences (the
trade-off + the rule). The `Feedback` data keeps its fields; the renderer composes a concise line
(prefer a hand-tuned `summary`, else compose from consequence + rule). Fixes ALL existing feedback
globally without rewriting content.

## ARCHITECTURE_FIT

[LR-050] Extend `features/labs/interactionModel` (LabScenario/LabResult/registry) to host the new
mechanic engines beside stationConfig. Each mechanic: `<mechanic>/types|scoring|feedbacks|<Engine>.tsx
|entry` + scenarios in `content/labs/*`. New visual primitives as needed (e.g. an allocation bar set),
each added to `/visual-lab` (BP-042) with mobile cases.
[LR-051] Lessons gain richer interactive block kinds (allocate/sort/connect/…) rendered inline, so a
node = concise framing + a situational challenge instead of a 2-option decision. Lessons stay data-
driven; the lesson engine renders the new block types. Labs remain the deeper multi-step versions.

## ROLLOUT (slices, one at a time)

[LR-060] Slice 1 (foundations): (a) FeedbackCard → concise prose (GLOBAL, instant win); (b) build
MECH-ALLOCATE (Allocator: sliders, proximity scoring, trade-off feedback) by evolving the Context
Budget Board; (c) redesign ONE node — NODE-02-01 Context Window & Token Budget — into a full
strategy-game challenge as the reference template. Then user plays it and approves the feel.
[LR-061] Slice 2+: build the mechanic library one mechanic at a time, each with a reference scenario
and tests; then roll content out arc by arc, replacing micro-MCQs with mechanic challenges.
[LR-062] Keep each slice shippable + green (build + tests) — no big-bang rewrite (PH-011, CW-003).
[LR-063] BREADTH — many viewpoints per concept (user 2026-06-21: "we only have so few tasks … more points of
view"). One task per node = one angle, seen once. Each HIGH-ROI/durable concept should be hit from 2–4
DIFFERENT mechanics, each a distinct facet (not the same task reskinned) — e.g. context-noise via curate
(budget) + allocate (scarcity) + debug (trace) + spot-the-noise (sort). This is the payoff of LR-001 (deep
mechanics × many situations). Reuse existing engines; every angle clears LR-011a/b + SPINE-004/005 + the
pedagogy-test pattern; author harder/disguised angles as later/transfer/review variants (deepens the spiral).
Tracked as OQ-0011; build incrementally, prioritising the durable spine + the DIRECTION nodes.

## NON_GOALS

[LR-070] Not gamification-for-its-own-sake: no XP/streaks/badges (PH-803/NG-009). The "game" is the
strategy/decision depth, not points.
[LR-071] No fragile free-form drag-and-drop as the default (NG-034/VR-0003); kinetic feel via direct
manipulation. dnd-kit is opt-in per task, with a tap fallback.
[LR-072] Not a from-scratch rewrite: evolve the existing engine framework; reuse stationConfig where a
hard PICK is genuinely the right mechanic.
