# /source_material/visuals/30_visual_system_spec.md

STATUS: VISUAL_DOC  
LOAD_PRIORITY: WHEN_VISUAL_OR_UI_WORK  
PURPOSE: Define visual language and diagram rules. Prevent fragile one-off graphics.

## VISUAL_SYSTEM_RULES

[VSS-001] Visuals are learning infrastructure, not decoration.
[VSS-002] Every abstract concept should have a reusable visual model when useful.
[VSS-003] No lesson-specific complex visual unless added to visual system first.
[VSS-004] All complex visuals must appear in `/visual-lab`.
[VSS-005] Prefer deterministic SVG/HTML/CSS layouts over emergent graph/canvas layouts.
[VSS-006] Mobile readability overrides diagram complexity.
[VSS-007] Every complex visual needs a compact fallback.
[VSS-008] Never copy paper figures directly. Recreate architecture ideas in original educational form.
[VSS-009] Visuals must support German explanatory labels with standard English technical terms.
[VSS-010] Use consistent shapes, colors, spacing, and interaction states.

## PRODUCT_VISUAL_FEEL

[VSS-020] Style target:
- iOS-soft
- mobile-first
- calm
- premium
- tactical
- serious
- readable
- layered
- touch-friendly

[VSS-021] Avoid:
- gamer neon
- corporate LMS tables
- dense admin dashboard
- academic PDF look
- cluttered graph spaghetti
- tiny labels
- hover-only explanations

## VISUAL_PRIMITIVE_GRAMMAR

### SHAPE_MEANING

[VSS-030] Model = rounded circle or soft orb.
[VSS-031] Tool = rounded rectangle with connector notch/icon.
[VSS-032] Memory/Storage = cylinder/card-stack.
[VSS-033] Retrieval = magnifier or indexed stack.
[VSS-034] Context = bounded container/window.
[VSS-035] Human = avatar/person token.
[VSS-036] Guardrail/Security = shield/boundary.
[VSS-037] Eval = gauge/check panel.
[VSS-038] Trace/Event = timeline dot/card.
[VSS-039] Repo Artifact = document/file card.
[VSS-040] Agent/Subagent = orb + role badge.
[VSS-041] Workflow = connected step cards.
[VSS-042] Failure = warning badge + layer tag.

### LINE_MEANING

[VSS-050] Solid line = normal data/control flow.
[VSS-051] Dashed line = optional/conditional flow.
[VSS-052] Thick line = high-volume context/data flow.
[VSS-053] Red/warning-styled line = risky or broken flow.
[VSS-054] Boundary-crossing line must show permission/trust implication.
[VSS-055] Do not use unlabeled arrows in complex diagrams.

### LAYER_MEANING

[VSS-060] Use vertical layer stacks for system layers:
1. User/Product Goal
2. Application Logic
3. Model/Agent Control
4. Context/Retrieval/Memory
5. Tools/External Systems
6. Evals/Observability
7. Security/Governance
8. Repo/Team Process

[VSS-061] Use layer tags consistently in feedback and visuals.

## RESPONSIVE_LAYOUT_RULES

[VSS-070] Mobile first. Design for narrow screens before desktop.
[VSS-071] Complex diagrams collapse into staged cards on mobile.
[VSS-072] Use bottom sheets for node details on mobile.
[VSS-073] Use side panels only on desktop/tablet.
[VSS-074] Avoid horizontal scrolling unless diagram intentionally uses a stepper.
[VSS-075] If a diagram needs more than 5-7 visible nodes on mobile, use progressive disclosure.
[VSS-076] Labels must truncate safely with detail expansion.
[VSS-077] Touch targets must be large enough for thumb use.
[VSS-078] Do not rely on hover for essential information.

## DIAGRAM_TYPES

### VTYPE-LAYER-STACK

PURPOSE:
- show hidden system layers beneath AI feature.
USED_BY:
- NODE-00-02
- NODE-01-03
- Failure Mode Tree
- Eval Designer
RULES:
- max 8 layers.
- each layer has short label and one-line role.
- allow highlighted failure layer.
- mobile = vertical cards.

### VTYPE-AUGMENTED-LLM-MAP

PURPOSE:
- show LLM + tools + retrieval + memory + evals.
USED_BY:
- NODE-01-01
- Architecture Builder
RULES:
- model center or top.
- tools/retrieval/memory as adjacent modules.
- eval/observability as feedback loop.
- security boundary visible.
- avoid implying every system needs every component.

### VTYPE-CONTEXT-WINDOW

PURPOSE:
- show finite input space and competing context items.
USED_BY:
- Context Budget Board
- Context Engineering nodes
RULES:
- context = container with budget meter.
- items have token cost, relevance, noise/stale risk.
- selected/excluded/compressed states visible.
- mobile = selected stack + item deck.

### VTYPE-TRACE-TIMELINE

PURPOSE:
- inspect agent/workflow execution over time.
USED_BY:
- Agent Trace Debugger
- Security Incident Room
- Capstone Failure Injection
RULES:
- one event per card.
- actor, action, observation, risk tags.
- failure origin distinct from symptom.
- mobile = vertical timeline.

### VTYPE-TOOL-BOUNDARY-MAP

PURPOSE:
- show tool contract, permissions, approvals, trust zones.
USED_BY:
- Tool Contract Forge
- Security Incident Room
RULES:
- tool inside boundary box.
- inputs/outputs typed.
- side effects marked.
- approval gates explicit.
- trust crossing shown.

### VTYPE-WORKFLOW-VS-AGENT

PURPOSE:
- compare deterministic path vs dynamic agent loop.
USED_BY:
- NODE-04-01
- Trade-off Duel
RULES:
- workflow side = fixed path.
- agent side = plan-act-observe loop.
- show control/eval difference.
- do not visually imply agents are always better.

### VTYPE-ORCHESTRATOR-WORKER

PURPOSE:
- show main orchestrator delegating to workers/subagents.
USED_BY:
- NODE-04-03
- Architecture Builder
RULES:
- orchestrator has bounded context.
- workers have isolated context.
- return summaries/results, not raw noise.
- show failure if worker returns too much/noisy data.

### VTYPE-RETRIEVAL-PIPELINE

PURPOSE:
- show ingestion -> chunking -> indexing -> retrieval -> rerank -> context assembly -> answer.
USED_BY:
- Retrieval Factory
RULES:
- pipeline stages as step cards.
- corpus/query/result/evidence visible.
- allow stage selection/removal.
- show missed evidence and why.

### VTYPE-PAPER-FIGURE-RECREATION

PURPOSE:
- teach architecture idea from research visual without copying figure.
USED_BY:
- Paper Figure Decoder
RULES:
- original enough to avoid copying.
- simplified for system decision.
- components labeled.
- include "applies when" and "does not apply when".
- always connect to practical design choice.

### VTYPE-EVAL-LOOP

PURPOSE:
- show system -> output -> grader/eval -> regression/feedback.
USED_BY:
- Eval Designer
- Evaluator-Optimizer
RULES:
- distinguish format validity, semantic correctness, grounding, safety.
- show regression set as durable artifact.
- show trace signals when applicable.

### VTYPE-REPO-MEMORY-MAP

PURPOSE:
- show hot context vs durable project memory vs research docs vs logs.
USED_BY:
- Repo Refactor Lab
- Source Material OS
RULES:
- separate control docs, progress docs, domain docs, interaction docs, visual docs, research docs.
- show load frequency.
- show context-noise risk from duplicate docs.

### VTYPE-SECURITY-BOUNDARY-MAP

PURPOSE:
- show trusted/untrusted zones and permission flow.
USED_BY:
- Security Incident Room
RULES:
- untrusted inputs clearly marked.
- tool permissions visible.
- approval gates visible.
- sandbox zone visible if relevant.

## INTERACTION_VISUAL_STATES

[VSS-100] Required states:
- default
- selected
- excluded
- compressed
- locked
- unlocked
- completed
- warning
- failure_origin
- symptom
- strong_choice
- weak_choice
- disabled

[VSS-101] State should not depend on color only.
[VSS-102] Use label/icon/shape change in addition to color.
[VSS-103] Warning/failure states must include explanation access.

## VISUAL_LAB_REQUIREMENTS

[VSS-120] Create `/visual-lab` before scaling lesson content.
[VSS-121] `/visual-lab` must include all visual primitives and diagram types.
[VSS-122] Each visual-lab case must include:
- short labels
- long labels
- dense state
- empty state
- mobile width
- desktop width
- warning/failure state where relevant
- fallback view where relevant

[VSS-123] Visual-lab pages are internal QA tools, not primary learner content.
[VSS-124] Do not remove visual-lab after release; it protects future agent work.

## FALLBACK_RULES

[VSS-130] Every complex diagram must have a compact fallback.
[VSS-131] Fallback may be:
- ordered list
- stacked cards
- stepper
- simplified layer list
- summary table
- single selected subgraph

[VSS-132] If visual layout fails, fallback must still teach the concept.
[VSS-133] Never make learning impossible because the diagram is too complex.

## ANTI_FRAGILITY_RULES

[VSS-140] Avoid force-directed graph layout.
[VSS-141] Avoid uncontrolled absolute positioning.
[VSS-142] Avoid arbitrary canvas drawing for core learning.
[VSS-143] Avoid dynamic label placement without collision strategy.
[VSS-144] Avoid drag-only interactions.
[VSS-145] Avoid hidden state encoded only in visual position.
[VSS-146] Avoid decorative animations that obscure meaning.
[VSS-147] Prefer layout constraints that AI agents can reason about from code.

## IMPLEMENTATION_PRIORITY

[VSS-200] Build order:
1. design tokens
2. visual primitive components
3. visual-lab route
4. static diagram types
5. interactive states
6. core lab visuals
7. paper figure recreations
8. capstone visuals

[VSS-201] Do not implement paper visuals before primitive visual system is stable.
