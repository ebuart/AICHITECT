# /source_material/control/09_direction_track.md

STATUS: CORE_CONTROL_DOC (SPEC — directional, not yet built)
LOAD_PRIORITY: WHEN_PLANNING_DIRECTION_CONTENT
PURPOSE: Specify the curriculum's BIGGEST missing half — DIRECTION: the senior-as-Product-Manager /
scrum-master who holds the architectural overview and "targets the bees" (aims an AI-agent swarm at the right
work). User 2026-06-21: this needs crazy attention — woven in from the start, ramped up, and expanded into a
large dedicated track after the current 43 nodes. This doc is that specification. Compact by ALL-0001.

## THE MENTAL SHIFT (what DIRECTION actually is)

[DIR-001] The learner stops being the one who builds and becomes the one who DIRECTS builders. The model: a
senior dev vibecoding a real app is a PM + scrum-master + architect at once. The "bees" are AI agents/
subagents/workers. Architectural knowledge (arcs 00–09) is the AIMING SYSTEM; DIRECTION is pulling the
trigger: decompose → brief → target → track → intervene → integrate → accept. Open-Claw exists because a
senior did this loop well, never touching code.

[DIR-002] DIRECTION is not "prompt engineering" (NG-007). It is project leadership over non-human executors:
backlog, briefs, delegation, boundaries, stand-ups, drift control, merges, acceptance, Definition-of-Done.

## RESEARCH ANCHORS (multi-source, 2026 — ground new nodes in these durable signals)

[DIR-003a] The delivery unit is collapsing to a small POD. One 3-person pod replaces a team of 8-12;
"two-pizza → one-pizza teams"; an anchor engineer now spans ~3 squads. (InteligenAI, Bessemer, Pragmatic
Engineer, cummulative.io.) → director leverage, not headcount.
[DIR-003b] Adding people/agents now HURTS — "additional humans reintroduce coordination costs AI eliminated;
optimal team smaller and more deliberate." (cummulative.io, andresmax.) → anti-over-swarm (node 11-02).
[DIR-003c] Orchestration mastery — NOT prompt engineering — is the critical technical skill; value is in
system architecture, precise objectives, guardrails. (Addy Osmani, LangChain, Mike Mason, CIO.) → validates
the whole track + its durability (SPINE-004).
[DIR-003d] SPEC QUALITY is THE differentiator — "the difference between mediocre and exceptional output comes
down almost entirely to the quality of specification." (Addy Osmani, Geeky-Gadgets, LangChain.) → node 12-01,
the highest-leverage skill.
[DIR-003e] Concrete patterns: Plan/Execute separation (strong model plans, fast executes); Writer/Reviewer;
parallel agents via git-worktrees with a shared task list + dependency tracking + file-locking; "context has
gravity, systems have coupling" (parallelism is bounded). (Addy Osmani, Kinde, LangChain, geeky-gadgets.) →
nodes 12-02 (dependencies), 12-03 (triage), future ARC-13/14.
[DIR-003f] Emerging role names: "Agentic Product Lead" / "Full-Stack Product Lead" = connective tissue
between business intent and AI execution. (Hatchworks, Medium/Bennell.) = the director / PM-of-bees.
[DIR-003g] Caveat the user set: studies lag practice — synthesize from convergent SIGNALS, not single papers.
Re-research at authoring time (SPINE-006); cite the durable workflow, not the month's tool.

## THE DIRECTION SKILL TREE (every direction node trains exactly one; the spine's SPINE-011)

[DIR-010] DECOMPOSE — split a goal/epic into agent-sized tasks; granularity judgment (too big → the bee
flails; too small → overhead); dependency order. ("Write the backlog.")
[DIR-011] BRIEF — write a task an agent can actually execute: goal, acceptance criteria, boundaries, the
context to inject, Definition-of-Done. A bad brief beats any model into bad output.
[DIR-012] TARGET ("aim the bee") — pick the executor for the task: model tier (cheap vs strong), single
agent vs parallel swarm vs orchestrator-worker, sequential vs fan-out.
[DIR-013] BOUND — set per-task scope/permission/approval/sandbox from the director seat (the tools/security
arcs, used offensively to delegate safely rather than defensively).
[DIR-014] TRACK — hold the overview across many parallel bees: status (done/blocked/drifting), the progress
ledger as a scrum board, early drift detection. ("Run the stand-up.")
[DIR-015] INTERVENE — know WHEN to stop / re-scope / re-brief a bee; stop conditions; not babysitting, not
abandoning; escalate to a human gate when judgment is required.
[DIR-016] INTEGRATE — merge multiple bees' outputs into one coherent system; resolve overlap/conflict; keep
architectural coherence at the seams.
[DIR-017] ACCEPT — review a bee's output against the brief; accept or send back with PRECISE, layer-named
feedback (this is REVIEW/REPAIR, SPINE-012, from the director seat = acceptance testing).
[DIR-018] SCOPE (PM hat) — decide what to build / cut / MVP; sequence by value and risk; target finite effort
where it moves the product. ("Own the roadmap.")
[DIR-019] CURATE — decide what context/docs to feed each bee (and each human), and what to withhold as noise.
The user-flagged crazy-ROI durable skill (SPINE-007): as context windows grow, knowing signal-vs-noise is the
director's force multiplier. Ties to the Context arc (02) but from the seat of "what do I hand the executor".

## PHASE 1 — WOVEN FROM THE START (light retrofit into the existing 43, so DIRECTION ramps early)

[DIR-020] Don't bolt direction on only at the end. Add one small DIRECTOR-SEAT moment to early arcs so the
muscle grows the whole way. Minimum retrofit (each = a short director framing on an EXISTING node, reusing its
mechanic — not new nodes):
- 01-02 Simplicity-before-Agency → frame as a DIRECTOR's first call: "what do you even delegate?" (DECOMPOSE seed)
- 03-01 Tools-are-Interfaces → "you are handing a bee a tool — what may it touch?" (BOUND seed)
- 04-01..03 Workflow/Agent/Orchestrator → the densest early direction: pick single-vs-swarm, aim the bee
  (TARGET), shape orchestrator-worker as DELEGATION not just architecture.
- 06-02 Decision-Log / 06-04 Long-Running → the progress ledger AS the swarm board (TRACK seed).
- 07-02 Task-Success → the eval AS Definition-of-Done (BRIEF/ACCEPT seed).
- 08-02 Approval-Gates → the gate AS a PM sign-off / escalation (INTERVENE seed).
[DIR-021] Each retrofit is a re-FRAME + maybe a second challenge, not a rewrite; honors "delete little".

## PHASE 2 — THE DEDICATED TRACK (the large new block, AFTER the current nodes; ARC-11..14)

[DIR-030] This is the "way more specified" the user asked for. Four new arcs, each ~4 nodes, each node a
hands-on direction challenge (reuse existing mechanics where they fit; new mechanics flagged). Difficulty:
advanced → capstone. Order them as a campaign that ends in a full real-ish build round-trip.

[DIR-031] ARC-11 — THE DIRECTOR'S SEAT (decompose & brief)
- 11-01 From Builder to Director — the shift, the PM/scrum/bees model (term + a first decomposition).
- 11-02 Decompose the Goal — epic → agent-sized tasks; granularity (mechanic: SORT/TRIAGE on task sizing).
- 11-03 Write the Brief — assemble an executable task brief (mechanic: CONNECT/assemble — goal+criteria+
  context+boundary; reveal grades whether a bee could run it).
- 11-04 Definition of Done — set acceptance criteria before delegating (mechanic: PICK/WEIGH).
- 11-05 Context ROI — curate what to feed the bee; cut the noise, keep the signal (DIR-019; mechanic: SORT/
  ALLOCATE on a doc/context set — which docs earn their tokens). The SEED/intro of the ARC-15 cluster.

[DIR-032] ARC-12 — TARGETING THE SWARM (delegate & route)
- 12-01 One Bee or Many — single vs parallel vs orchestrator-worker for THIS goal (mechanic: CONNECT/PICK).
- 12-02 Aim the Bee — model-tier/executor routing by task (mechanic: ALLOCATE/WEIGH cost-vs-strength).
- 12-03 Delegation Boundaries — scope/permission/approval per delegated task (mechanic: BOUNDARY, reused
  offensively).
- 12-04 Fan-out or Chain — dependency mapping; what parallelises safely (mechanic: CONNECT/order).

[DIR-033] ARC-13 — KEEPING THE OVERVIEW (track & intervene) — likely needs ONE new mechanic: a SWARM-BOARD.
- 13-01 The Swarm Board — read status across many bees; spot the blocked/drifting one (NEW mechanic: a
  status board you triage).
- 13-02 Spotting Drift — catch a bee going off-brief early from signals (mechanic: TRIAGE/SORT).
- 13-03 When to Intervene — stop / re-scope / re-brief / let-run (mechanic: PICK under a clock/budget).
- 13-04 Escalate to a Human — which decisions a bee may NOT make (mechanic: BOUNDARY/PICK).

[DIR-034] ARC-14 — INTEGRATION & DELIVERY (merge, accept, ship)
- 14-01 Accept or Send Back — review output vs brief; precise layer-named feedback (mechanic: the existing
  trace/postmortem/incident review, framed as acceptance).
- 14-02 Integrate the Swarm — merge several bees' work; resolve conflicts/seams (mechanic: CONNECT/PICK).
- 14-03 Prioritize & Cut — PM scoping: MVP, value/risk sequencing (mechanic: ALLOCATE/WEIGH finite effort).
- 14-04 The Full Round-Trip — decompose→brief→target→track→intervene→integrate→accept in one campaign; this
  IS the in-app proxy for "vibecode a feature" (ties to PC-043, the Open-Claw exit proof).

[DIR-036] ARC-15 — THE DOC CONTROL PLANE (designing docs good for HUMANS and AI) — the meta-skill cluster
(SPINE-007). User 2026-06-21: not one node — ~10+ tasks, because the value is in the doc-TYPES and the routing
BETWEEN them. As projects scale, the information architecture both humans and agents read IS the bottleneck.
The worked exemplar is THIS repo: `[XXX-000]` IDs, LOAD_PRIORITY headers, one-owner-reference-by-ID, hot vs
on-demand. Each node = a hands-on "route this fact / fix this doc / judge its ROI" call (reuses SORT/PICK/
ALLOCATE/TRIAGE/CONNECT — no new mechanic). Three bands:
  · DUAL-READABLE FUNDAMENTALS (what makes a doc good for human+AI):
    - 15-01 ID-Addressed Docs — `[XXX-000]` codes as stable references + dedup anchors (why both win).
    - 15-02 Load-Priority — ALWAYS vs WHEN_X vs ONLY_ON_PATTERN; context economy, don't load everything.
    - 15-03 Signal Density — cut noise, keep ROI ("would an agent waste tokens on this line?").
  · ROUTE THE FACT TO THE RIGHT TYPE (the "≥2 per type-combination" the user means):
    - 15-04 Rule vs State — stable rule (control doc) vs current state (hot memory). 
    - 15-05 Why vs What — decision-log (rationale) vs feature-ledger (implementation history).
    - 15-06 Open vs Resolved — open-questions vs decision-log; promote on resolution.
    - 15-07 Lesson vs One-off — learning-log (recurring) vs drop; promote to a control rule when it's policy.
    - 15-08 Hot vs Reference — always-loaded vs load-on-demand (domain/research). 
  · SYSTEM HYGIENE (keep the corpus lean as it grows):
    - 15-09 One Owner, Reference by ID — dedup driftable copies (ties repo arc 09-03).
    - 15-10 Staleness & Cleanup — retire resolved/obsolete; the corpus must not rot.
    - 15-11 Split or Keep Whole — when a doc earns a split by TYPE vs stays one file (the user's file≠type point).
[DIR-037] DOC-DESIGN PRINCIPLE (the durable thesis of ARC-15): a doc that is good for an AI is good for a
human and vice versa — stable IDs, explicit load-priority, one source of truth, ruthless signal density. This
is future-critical: bigger context windows + more agents = more rope to hang yourself with; the curator who
keeps the corpus dual-readable and lean is the force multiplier. Teach the PRINCIPLE (addressing, priority,
ownership, density), never a specific tool's doc format (durability, SPINE-004).

[DIR-035] New mechanics this track likely needs (build only when its node is reached, BP-031 data-as-content):
a BRIEF-BUILDER (assemble an executable spec) and a SWARM-BOARD (status/triage across parallel agents). Most
other nodes reuse allocate/connect/boundary/triage/sort/weigh/pick. Visuals (SPINE-040): a dependency graph,
a swarm-status board, a cost/strength scatter for routing — add these chart/board primitives to the visual
system.

## SEQUENCING & GUARDRAILS

[DIR-040] Build order: first the Phase-1 retrofits (cheap, make direction present early) → then ARC-11 → 12 →
13 → 14. Keep each node shippable + green (PH-011/CW-003). The capstone (10) is the bridge: after ARC-14 it
can be upgraded from "architecture draft" to "direct a build" (PC-040/043).
[DIR-041] Stay honest (PC-024): even with this track, the app simulates direction; it does not replace real
reps on a real repo. The track closes the in-app half of the Open-Claw gap and makes the real reps learnable.
[DIR-042] Do not let this become prompt-tips (NG-007) or a PM-theory reader (NG-002). Every direction node is
a hands-on call with a system consequence, like every other node. The bee metaphor is a frame, not a gimmick.
[DIR-043] Every node here must pass the durability + ROI + research filter (SPINE-003..006): teach the part
that gets MORE valuable as models improve (decompose/brief/target/track/integrate/curate — the human
bottleneck), never the part a better model erases. Research current senior practice before authoring; cite
the durable workflow, not the month's tool. This is exactly why DIRECTION is the future-proof core: when the
AI can build anything, the scarce skill is aiming it.
