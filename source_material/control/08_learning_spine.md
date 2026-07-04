# /source_material/control/08_learning_spine.md

STATUS: CORE_CONTROL_DOC
LOAD_PRIORITY: WHEN_PLANNING_CONTENT_OR_DIRECTION
PURPOSE: The single north-star narrative — what the learner BECOMES, in what order, and why each arc earns its
place. Resolves the direction ambiguity surfaced by the 2026-06-21 evaluation (judgment vs. practice). Read
this before adding/cutting/reordering content. Compact by ALL-0001.

## THE PROMISE (the one sentence the product is accountable to)

[SPINE-001] "You arrive able to write code with AI help. You leave able to DIRECT an AI to build and maintain
a system a senior would respect — and to fix it when the AI gets it wrong." That is the transformation. The
HomePage, the arc intros, and the capstone must all ladder up to this — not to "complete 43 nodes."

[SPINE-002] THE BAR (use this for self-review and acceptance, user 2026-06-21): a learner who does ONLY these
lessons must come out with a CLEAR edge over ANY junior dev and be worth more in an uncertain IT market — a
person who can WORK IN and CREATE big systems with AI, while NOT being an ML/LLM specialist. Their value is
the human bottleneck that survives model progress: aiming, structuring, judging, integrating. If a node
doesn't visibly move a learner toward that bar, it doesn't ship.

## DURABILITY & ROI FILTER (what earns a node — apply BEFORE authoring)

[SPINE-003] FUTURE-PROOF THESIS: the better AI gets, the more human value concentrates in DIRECTION and
JUDGMENT and the less it sits in EXECUTION. Build the curriculum on skills that GROW as models improve, not
ones that rot. "Write a better prompt" is the canonical rotting skill — bigger context + smarter models make
prompt-wording tricks ~10× less load-bearing than two years ago. Teach the durable layer underneath it
(decide what context the model needs, what done looks like, which layer failed), never the trick.

[SPINE-004] DURABILITY TEST per candidate node — "is this MORE or LESS valuable as models get 10× better?"
  - DECAYING → reject or teach only as a principle, never as a technique: prompt-wording hacks, model-specific
    quirks, "say think-step-by-step", token-counting minutiae, current tool-UI walkthroughs, named-model
    benchmarks, anything that a better model erases.
  - DURABLE → the spine: system decomposition, architecture, when/what to delegate, boundary & permission
    design, eval / Definition-of-Done, CONTEXT CURATION (what to include vs exclude — signal vs noise),
    failure diagnosis by layer, integration, holding the overview, orchestrating multiple agents, deciding
    what NOT to build. These get harder-to-replace as the AI gets stronger.

[SPINE-005] ROI TEST: each node must buy a learner measurable job-market value — a thing they can DO in a big
AI system that a junior can't. Rank by "edge per node"; cut low-ROI nodes even if true/interesting (NG-020).
Prefer fewer high-ROI nodes (PC-032).

[SPINE-006] RESEARCH REQUIREMENT: new nodes must be grounded in CURRENT practice before authoring (web
research at authoring time) — the field moves fast and stale facts read as noise. Research the durable shape
of the topic (the workflow seniors actually use), not the month's hot model. Cite the durable pattern, not the
ephemeral tool. (See OQ-0010 for what to research per planned arc.)

[SPINE-007] META-SKILL worth its OWN CLUSTER (~10 nodes), not one node (user 2026-06-21): designing and
curating a documentation/context system that is good for BOTH humans and AI — the doc "control plane." Our own
`[XXX-000]` rule-coded control/progress docs (stable IDs, LOAD_PRIORITY headers, one-owner-reference-by-ID) are
the worked exemplar. This only grows in value as projects and context windows grow — a future-critical,
durable, crazy-ROI skill. Full spec: control/09 ARC-15 (DIR-036). Apply it reflexively to THIS repo's own
source_material too (keep the docs signal-dense — the user's own principle).

## THE THREE COMPETENCIES (every node serves exactly one; if it serves none, cut it)

[SPINE-010] JUDGMENT — recognise the system layers and make the right trade-off (context, tools, agents,
retrieval, memory, evals, security, repo). This is most of arcs 00–09. Necessary, not sufficient.
[SPINE-011] DIRECTION — THE BIGGEST GAP, needs the most attention (user 2026-06-21). This is the
senior-as-PRODUCT-MANAGER / SCRUM-MASTER skill: hold the architectural overview, decompose a goal into
agent-sized work, and "target the bees" — aim a swarm of AI agents/subagents at the right tasks with the right
boundaries, then integrate what comes back. A senior who vibecoded Open-Claw did exactly this: they never
wrote code; they DIRECTED. The app currently barely teaches it. It must be (a) woven in from the EARLY arcs as
small director-seat moments, (b) ramped up arc by arc, and (c) expanded into a LARGE dedicated track after the
current 43 nodes. Full specification: control/09_direction_track.md. This is the half that turns "good
reviewer" into "can actually ship via AI."
[SPINE-012] REVIEW/REPAIR — read what the agent produced, name the failing layer, and correct it instead of
blindly re-prompting. Lives in the trace/postmortem/incident mechanics (02-04, 07-04, 08, 10-03). This is the
skill that separates a senior who vibecodes successfully from a vibecoder who gets stuck.

[SPINE-013] Litmus per node: "Which competency does this give, and how does it help me steer or correct a
real agent?" If the answer is "it's good to know," it is DEPTH (optional), not SPINE.

## SPINE vs DEPTH (order smarter; delete little)

[SPINE-020] CORE SPINE (the path that delivers the promise; keep tight, keep mandatory): 00 Orientation · 01
Foundations · 02 Context · 03 Tools · 04 Control-Flow/Agents · 05-01..03 Retrieval basics · 06-01/02 Memory ·
07 Evals/Observability · 08 Security · 09-01/02 Repo legibility · 10 Capstone.
[SPINE-021] DEPTH / OPTIONAL TRACK (valuable, but not load-bearing for the promise — mark as optional or
advanced so a motivated student can skip without losing the thread): 05-04 Contextual + 05-05 Visual/ColPali
retrieval (frontier, niche decision) · 06-04 Long-Running vs 09-03 Source-Material-OS vs 09-04 Team-Scale
(these THREE overlap heavily — consolidate to ONE governance node on the spine + the rest as depth).
[SPINE-022] Redundancy to resolve (the back half re-teaches "durable docs / decision log / governance" ~4×
with the same repo-refactor mechanic). Pick the single best instance for the spine; demote the others to
review/transfer reuse. Do NOT delete the scenarios — re-point them as spaced-review variants (they already
serve that).

## TEACHING DEPTH — fixes the "I'm just guessing" problem (user: this is the BIG #2)

[SPINE-040] Ground the FIRST attempt with a VISUAL, not prose. When a topic is introduced, the learner must be
able to reason — not guess — from a graph / chart / stat / diagram that makes the trade-off legible at a
glance (e.g. a recall-vs-cost curve before "pick a retrieval method"; a token-budget bar before an allocation;
a latency/quality scatter before a model choice). This beats both walls-of-text (NG-024) and bare frames. Use
the existing visual system (BP-042 primitives, /visual-lab); add chart/stat primitives where missing. The
intro visual is the scaffolding that makes guess→reveal into reason→confirm.
[SPINE-041] The reveal is where teaching lands: per-option rationale + the layer named + the one-line rule.
Keep it concise (LR-040) but never drop the WHY — that is the lesson.
[SPINE-042] Difficulty of the SCAFFOLD ramps inversely: heavy visual grounding at a concept's first node;
thinner (or removed) on transfer/later nodes, so the learner internalises the model instead of leaning on the
chart. (Pairs with the spiral, LR-011b.)

## MOTIVATION (the SMALLEST lever — user 2026-06-21; do last, keep cheap)

[SPINE-030] Worth a light touch only: the first surface should state the promise (SPINE-001) and the stakes
(edge over a normal IT student; the Open-Claw bar) instead of "Willkommen, folge der Roadmap" — but this is
the lowest-ROI fix. Capability growth + the direction track are the real motivators; do not over-invest in
copy/landing polish.
[SPINE-032] No XP/streaks (NG-009). Motivation comes from visible capability growth and the capstone pull, not
points. Mastery surfacing (the review system) is the progress signal.

## THE OPEN-CLAW BAR (the concrete end test, restated for content authors)

[SPINE-050] A learner who finishes the spine should be able to: take a feature, write a plan an agent can run,
predict which layers it touches, run it, and when it breaks, say "this is a context/eval/tool-boundary/repo
problem" and fix THAT. The capstone (PC-040/043) is the in-app proxy for this round-trip. If a content change
does not move a learner toward this bar, it is decoration.
