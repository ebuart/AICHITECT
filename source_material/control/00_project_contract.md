# /source_material/control/00_project_contract.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Define product identity, target outcome, and non-negotiable direction.

## PRODUCT_TYPE

[PC-001] Build a guided, mobile-first PWA for learning AI Engineering, Agent-driven Development, and AI-native System Architecture.

[PC-002] The app is roadmap-first. The user follows a curated sequence. Do not make the primary UX a free topic library.

[PC-003] Labs are bound to roadmap nodes. Free lab mode may exist later, but it must not replace guided progression.

[PC-004] The app teaches through tactical, visual, interactive system tasks. Do not build a passive content platform.

[PC-005] Product metaphor: AI Engineering Flight Deck + guided roadmap + tactical system boards.

## TARGET_USER

[PC-010] Primary user: CS, Wirtschaftsinformatik, Software Engineering, or adjacent technical students.

[PC-011] Assumed skills: basic programming, basic web/API understanding, some AI tool usage.

[PC-012] Not assumed: professional system design, research paper literacy, advanced ML math, backend/devops expertise.

[PC-013] Target transformation: from AI-assisted feature building to architecture-aware AI-native software engineering.

[PC-014] End-capability, stated plainly (the bar we measure against): the learner can DIRECT an AI agent to
build and maintain a non-trivial system — write a spec/plan an agent can execute, drive the build loop, and
REVIEW/CORRECT what the agent produces by naming the failing layer (context noise, missing eval, leaky tool
boundary, illegible repo) instead of just re-prompting. This is the skill that let a senior "vibecode"
Open-Claw without touching a line of code. Judgment is the necessary half; supervised build reps are the
sufficient half. The app must build the first and DELIBERATELY culminate in the second (see PC-040).

## PRIMARY_OUTCOME

[PC-020] Train architecture intuition for AI-native systems.

[PC-021] User should learn to make better decisions about:
- context management
- tool boundaries
- workflows vs agents
- retrieval systems
- memory layers
- evals
- observability
- repo conventions
- security boundaries
- long-term maintainability
- human-in-the-loop control

[PC-022] Teach concepts only when connected to system behavior and engineering consequences.

[PC-023] The decisions in [PC-021] are not the destination — they are the vocabulary for DIRECTING and
REVIEWING an AI build. Every arc must be answerable as "this is how I steer or correct an agent when X."
A learner who can name the trade-off but has never used it to unblock a real agent has only half the skill.

[PC-024] SCOPE_BOUNDARY (honest framing — surface this to the user, do not over-promise): the app trains
JUDGMENT and decision reps through high-fidelity simulation; it is the flight simulator, not the first solo
flight. It produces an AI-native systems thinker/reviewer with a real edge over a normal IT student. It does
NOT, by itself, certify someone who has shipped via AI — that requires the build capstone (PC-040) plus real
reps on a real repo. State this plainly rather than implying mastery from completion.

## CORE_PRODUCT_RULES

[PC-030] Every taught concept must include:
- system layer
- practical use case
- failure mode
- trade-off
- visual model
- interaction
- transfer task

[PC-031] If a concept cannot satisfy [PC-030], defer or remove it.

[PC-032] Prefer fewer high-quality interactive tasks over many shallow lessons.

[PC-033] Avoid buzzword drift. Frontier topics are valid only when tied to architecture decisions.

[PC-034] Roadmap order must reflect prerequisites. Later tasks may depend on earlier mental models.

[PC-035] Use German explanatory text in the app. Keep technical terms in English when they are standard in the field.

## CAPSTONE_DIRECTION

[PC-040] Final capstone: architect AND DIRECT an AI-native software team system for a large codebase over
time. The architecture draft (10-02) is the midpoint, not the end. The capstone must culminate in the
learner DIRECTING a build: given a feature, produce the spec/plan an agent executes, choose the layers it
touches, then face injected failures (10-03) and review/correct the agent's output by layer — the closest
in-app proxy to the real act that produced Open-Claw. If the capstone ends at "drew a good diagram," the
Open-Claw gap (PC-014) is still open.

[PC-041] Capstone must include:
- large codebase
- human developers
- AI agents/subagents
- repo memory
- feature ledger
- architecture decision records
- tool boundaries
- retrieval over code/docs
- eval harness
- observability
- security boundaries
- human approval gates
- long-term maintainability

[PC-042] Capstone question: How do we build an AI-assisted development system that remains understandable, testable, controllable, and maintainable over months or years?

[PC-043] Exit proof (what "done" must demonstrate, not just claim): the learner has, at least once in-app,
turned a feature request into an agent-executable plan, named the layers it touches, survived a failure
injection, and corrected the result by diagnosing the layer at fault. That round-trip — spec → direct →
review/repair — is the evidence of the end-capability (PC-014). Everything before the capstone exists to make
this round-trip possible.

## TECH_DIRECTION

[PC-050] Initial stack:
- React
- TypeScript
- Vite
- Tailwind
- PWA-ready
- Vercel-ready
- LocalStorage or IndexedDB for progress

[PC-051] Backend-free first.

[PC-052] Persistence must use an adapter boundary so Supabase can be added later without rewriting app logic.

[PC-053] Do not introduce auth, Supabase, or remote sync until the local architecture is stable.

## PRODUCT_FEEL

[PC-060] Visual feel:
- iOS-soft
- mobile-first
- calm
- premium
- tactical
- serious
- visual
- focused

[PC-061] Avoid:
- corporate LMS feel
- bright gamified kids-app feel
- generic dashboard clutter
- dry wiki pages
- unstructured topic browsing
- XP-first gamification
