# /source_material/control/10_experience_overhaul.md

STATUS: CONTROL_DOC
PURPOSE: The de-AI voice standard + the interaction doctrine + the per-arc treatment map (DEC-0017).
Load when writing ANY learner-visible text or building ANY interaction.

## WHY THIS DOC EXISTS

User verdict (2026-07-05): texts are correct but soulless — "sound like every generic generative AI".
Learning feels like cramming: nothing forms a mental image, nothing survives two days. The fix is not a
fake persona; it is (a) removing the machine tells, (b) writing like the people who write TryHackMe
rooms and good official courses, and (c) making concepts SEEN and FELT before they are quizzed.

## PART 1 — VOICE (VX rules)

### The tells (found in OUR content, 2026-07-05 audit — this is what "AI-feel" concretely is)

[VX-T1] MAXIM-TAKEAWAY: every exercise ends in a polished aphorism, usually "X schlägt Y — Z" or
        "nicht X, sondern Y". One is fine. Fifty identical shapes read machine-made.
[VX-T2] AFFIRMATION OPENERS: correct-answer whys open "Genau das…", "Genau dann…", "Genau hier…",
        "Exakt…". The model congratulating its own answer key.
[VX-T3] EM-DASH CADENCE: " — " as the universal joint, multiple per paragraph, always with a
        punchline after it. Humans use commas, parentheses, full stops, and sometimes nothing.
[VX-T4] PERFECT PARALLELISM: every list item the same grammatical shape, every note three clauses.
        Real writing has one long item, one two-word item.
[VX-T5] CONTRAST-TIC: "X ist kein Y, sondern Z" / "not X but Y" as the default sentence engine.
[VX-T6] TRIPLE-SAY: note says it, exercise-why says it, takeaway says it again in maxim form.
[VX-T7] ANTHROPOMORPHIZED ABSTRACTIONS delivering morals ("Autonomie muss sich ihren Platz
        verdienen"). Occasionally great; as the house style, exhausting.
[VX-T8] ZERO GROUND TRUTH: no version numbers, no real tool names, no log lines, no "bei uns hat
        das mal…", no rough edges. Textbook-Hochdeutsch with English scaffolding.
[VX-T9] RIDDLE-STEMS: "Warum ist X besser als Y?" — quiz-show framing instead of a situation you
        are IN.
[VX-T10] NETFLIX NARRATION (user 2026-07-05): saying what the UI, the artifacts, or the previous
        sentence already show. "Alle Dateien öffnen, dann geht es weiter" next to a 1/4-gelesen
        counter; a note that summarizes what the Akte exists to reveal; explaining an interaction
        whose buttons are on screen. The learner is not watching on a second monitor. Framing
        text carries ONLY what is visible nowhere else: premise and stakes. Mechanics hints are
        UI affordances, shown once, then never again.

### The bar (how TryHackMe / good official courses actually read)

[VX-B1] SITUATION FIRST, IMPERSONAL REGISTER (user 2026-07-05, confirms FL-0051): the learner is
        inside a concrete scene, but the SITE DOES NOT TALK TO THEM. No conversational du in
        stems/whys/takeaways ("reparierst du", "dein Board", "merkst du" = generative-AI chat
        feel). Scenes are stated: "Vier Vorfälle aus echten Systemen. Wo ist jeder entstanden?"
        Functional instructions use German infinitive-imperative UI style ("Anfrage abschicken,
        Station antippen"), never chatty imperatives. EN keeps a professional "you" where English
        needs it (impersonal English reads stilted) but drops all chattiness.
[VX-B2] PLAIN SENTENCES ARE ALLOWED. Not every sentence lands a punchline. Some just state a fact
        and move on. This is the single biggest de-AI lever.
[VX-B3] CONCRETE ANCHORS: real tool names, plausible numbers, one realistic log/config/payload
        line beats three abstract sentences.
[VX-B4] VARIED RHYTHM: fragments. Then a long sentence that takes its time because the thing it
        explains needs the room. Occasional aside in brackets (like this).
[VX-B5] DRY, RARE HUMOR — earned, not sprinkled. One wry line per lesson MAX, usually zero.
[VX-B6] TAKEAWAYS become "was du mitnimmst": concrete, situational, imperative — or get deleted.
        "Reservier die Output-Tokens, bevor du den Rest verteilst" not "Das Fenster ist ein
        Budget — bewusst zuteilen, nicht dem Zufall überlassen."
[VX-B7] WHYS explain the mechanism or tell the micro-story of the failure. Never grade the
        learner ("Richtig erkannt!"), never open with an affirmation tic.
[VX-B8] GERMAN THAT GERMANS WRITE: du-Form, zusammengezogene Umgangssprache wo natürlich
        ("gibt's", "läuft"), English terms unübersetzt, kein Denglisch-Zwang, keine Amtsprosa.

### Enforcement

[VX-E1] RATCHET TEST (tests/voiceRatchet.test.ts): counts measurable tells (em-dash density,
        "Genau d…" openers, maxim-shaped takeaways, conversational du-forms in stems/takeaways)
        across content. Ceilings = current counts; every rewrite lowers them; new content cannot
        raise them. Numbers go DOWN, never up.
[VX-E2] Rewrite unit = one arc. Rewrite = re-author, not paraphrase: re-imagine stem scenes,
        cut takeaways that only restate, add one concrete anchor per lesson minimum.
[VX-E3] EN translations follow the same rules in English (TryHackMe register, not BBC formal).

## PART 2 — INTERACTION DOCTRINE (IX rules)

[IX-1] FEEL BEFORE QUIZ. Every concept cluster opens with something the learner WATCHES or
       MANIPULATES and only then gets asked to judge. The quiz confirms what the hands learned.
[IX-2] NATIVE MECHANIC PER CONCEPT. The interaction must be the shape of the concept itself:
       flow-shaped concepts get a flow you trace, budget-shaped concepts get a thing that
       overflows, structure-shaped concepts get a thing you arrange. If the mechanic would work
       equally well for a different topic, it is not native enough.
[IX-3] NO RESKINS. A learner who thinks "ah, this board again with new labels" has caught us
       taking the easy route. Existing station-config style boards are legacy; they get replaced
       arc by arc, not multiplied.
[IX-4] CAUSE→EFFECT VISIBLE. The learner changes something and SEES the consequence in the same
       frame (the answer truncates, the wrong doc gets cited, the tool call sails through).
       Consequences are the memory hook — this is what survives two days.
[IX-5] INSPECTABLE, NOT NARRATED. Payloads, traces, configs are THERE to open and read, the way a
       senior reads them. Explanation text supports; the artifact is the teacher.
[IX-6] SCREENSHOT LOOP IS STANDARD PRACTICE: build → capture (scripts/screenshots.mjs) → look →
       adjust → recapture. Nothing visual ships without the agent having SEEN it. Mobile + desktop.
[IX-7] DETERMINISTIC CORE: every interactive has a pure, unit-tested model (traceFor, scoreFor…);
       the component only renders states. (Keeps DEC-0006: HTML/CSS, no canvas physics.)
[IX-8] ONE CONCEPT, MANY USES (user 2026-07-05): a node is not "read note, answer two picks".
       Node anatomy = SHORT input (a few concrete sentences max) → USE #1: feel it (explorer /
       manipulation) → USE #2: apply it in a different shape (diagnose a payload, fix a config,
       arrange an order) → USE #3: transfer it (new situation, disguised). Same knowledge,
       three different muscles. Quick-learning nodes get re-anatomied arc by arc.
[IX-9] NOTHING IS SACRED: the current node/lesson structure (incl. the roadmap's quick-lesson
       shape) is legacy scaffolding, not the product. Where the doing-anatomy needs different
       node cuts, recut the nodes.

### The protocol grammar (earned on the NODE-01-03 pilot, user-tested 2026-07-05 — BINDING for
### every future explorer/interactive; each rule exists because its absence failed a real test)

[IX-10] REQUIRED, NOT OPTIONAL: a sandbox gets skimmed. Interactives run as guided protocols
        (prescribed runs) that gate the lesson; free play unlocks AFTER, as the reward.
[IX-11] DOSSIER FIRST, FORCE-READ: cases open with their artifacts (Akte). All files must be
        opened before anything below reveals. Traces may only reference values whose meaning
        lives in the Akte — author the Akte before the trace.
[IX-12] RAW ARTIFACTS: payloads/traces/configs show facts only (names, dates, values, statuses).
        NEVER interpretation ("alt", "ist der alte Wert" = pre-chewed food). Diagnosis must
        require cross-referencing the Akte. Guard-test the banned editorializing words across
        ALL states.
[IX-13] READING IS FREE, ANSWERING IS EXPLICIT: inspecting must never be interpreted as an
        answer. Committing is its own button, placed WHERE THE EVIDENCE IS (in the payload
        panel, so only an inspected station can be reported). Wrong answers point back to
        reading, never advance.
[IX-14] REVEAL ON SOLVE: status colors, verdict marks and explanation notes are CONFIRMATION,
        not input — hidden until the learner answered correctly (SPOILER_RULE at every level:
        evidence → own diagnosis → confirmation + annotation).
[IX-15] ONE TASK PANEL: exactly one labeled place (AUFGABE) says what to do right now —
        briefing → watch → question (with the user-visible outcome inline) → solved note.
        Everything else is evidence (PAYLOAD) or record (PROTOKOLL). No competing boxes.
[IX-16] PRIME ATTENTION, DON'T SPOIL: every run carries a "Worauf achten"-line shown before and
        during the animation. It directs where to look, never names the target (test this).
[IX-17] FINDINGS ARE AN ARTIFACT: each solved run writes one row to a visible board; the
        completed board IS the concept map the node teaches. No board, no protocol.
[IX-18] NO NETFLIX NARRATION (= VX-T10, interaction side): never explain what a visible control
        does, never restate a counter in prose, mechanics hints appear exactly once (first run)
        and never again. Framing text carries only premise and stakes.
[IX-19] THE DIAGNOSIS IS NEVER DERIVABLE FROM THE CONTROLS: if a run disables layer X, the
        question must not have X's station as its answer ("ohne Tool-Gate → tap Tool-Gate" is a
        non-question). Ask where consequences ORIGINATED, where something ENTERED, where it was
        last TOUCHED — stations the toggles say nothing about. Cross-run comparisons are the one
        exception (the answer is a diff, not a toggle read). Guard-tested.
[IX-20] THE ROAD SHOWS ITS HOLES: flow visuals are directional (arrowed links, movement while
        traversing), and a disabled station renders visibly BROKEN (hatched, dashed, struck
        label, hollow marker) — structure is never a spoiler, so brokenness shows immediately;
        only VERDICTS wait for the solve (IX-14). Prompts never re-describe what the outcome
        line or the trace already shows.

## PART 2b — VISUAL BAR (VIS rules; reference = Anthropic Academy / Skilljar course diagrams,
## user 2026-07-05: "simple visuals for hard topics — deliver even harder knowledge the same way")

[VIS-1] ONE IDEA PER DIAGRAM. If a visual needs a paragraph to explain, it is two diagrams.
[VIS-2] LABELED BOXES, DIRECTED FLOW: rectangles with short labels, arrows left→right, the data
        visible as it moves (dots, chips, counts). No decoration, no gradients, no icon noise.
[VIS-3] BUILD-UP OVER TIME: complex pictures assemble step by step — in our case the RUN is the
        build-up (the queue fills, the law emerges). Never show the finished complexity first.
[VIS-4] ONE ACCENT AT A TIME: a single element carries emphasis per moment (the current station,
        the overflow count). Everything else stays quiet.
[VIS-5] THE NUMBERS ARE THE PICTURE: live values in the diagram beat a separate chart. A formula
        that computes itself from the running system (L ≈ λ·W strip) is the strongest visual we
        have — prefer emergent math over asserted math.

## PART 3 — TREATMENT MAP (what each arc's flagship interaction IS)

Each arc gets ONE native flagship + rewritten text. Legacy boards stay until their replacement lands.

| Arc | Concept shape | Native treatment |
|---|---|---|
| 00 Orientation | demo vs system | RequestFlowExplorer, minimal pipeline: watch the same question answered by "just an API call" vs the full system — inspect why one is right |
| 01 Foundations | request anatomy | REQUESTFLOWEXPLORER (built first, EXP-REQUEST-FLOW): trace a request through Boundary→Retrieval→Context→Model→Tool-Gate→Check; failure toggles show which layer breaks what |
| 02 Context | a window that fills | LIVE CONTEXT WINDOW: a real prompt assembly you resize/curate; watch the answer truncate when output reserve dies, watch the right doc drown in noise |
| 03 Tools | contracts | CONTRACT PLAYGROUND: edit a real JSON tool schema, fire simulated model calls against it, watch mis-calls happen exactly where the contract is loose |
| 04 Agents | control flow | FLOW STEPPER: step a ReAct loop / orchestrator like a debugger (step-over, inspect scratchpad); toggle patterns and compare traces |
| 05 Retrieval | ranked lists | RETRIEVAL BENCH: live query box over a small corpus; switch BM25/vector/hybrid/rerank and watch the ranking change; sliders for k |
| 06 Memory | state across time | SESSION TIMELINE: scrub across three sessions; toggle which docs exist and watch the agent remember or re-discover |
| 07 Evals | distributions & gates | EVAL DASHBOARD: sliders (threshold, sample size) over live charts; feel flakiness, feel the veto case; ship/no-ship lever |
| 08 Security | boundaries under attack | ATTACK REPLAY: step real injection attempts against the pipeline with defenses on/off (reuses RequestFlowExplorer with attack scenarios) |
| 09 Repo | a codebase | REPO EXPLORER: a simulated ~20-file VS-Code-style project; tasks like "find what the agent needs" in a legible vs illegible variant of the same repo |
| 10 Capstone | integration | existing capstone sim, upgraded to drive the explorer pipeline |
| 11–13 Direction | orchestration | SWARM BOARD (specced in control/09) + existing Build Campaign |
| 14 System Physics (OQ-0017) | load & time | LOADSIM (built, EXP-LOAD): queue road + metric tiles + live Little's-Law strip; future nodes: caching, latency budgets, retries/idempotency, blast radius |
| Werft | the world | stays — it IS the bird's-eye sim; gets voice pass |

ROLLOUT ORDER: 01 (explorer, this doc's proof) → 02 (window) → 05 (bench) → 08 (attack replay,
cheap reuse) → 07 (dashboard) → 03/04 → 09 (repo explorer, big) → rest. Voice rewrite rides along
arc by arc; ARC-00/01 + Home shipped with this doc.

## NON-GOALS

- No persona/voice cosplay, no forced jokes, no emoji inflation.
- No canvas/3D/physics (DEC-0006 stands).
- No mechanic that cannot be unit-tested through a pure model (IX-7).
