# /source_material/control/02_build_principles.md

STATUS: CORE_CONTROL_DOC  
LOAD_PRIORITY: ALWAYS  
PURPOSE: Define implementation standards for durable multi-session Claude Code work.

## ARCHITECTURE_PRINCIPLES

[BP-001] Codebase must model the engineering discipline the app teaches.

[BP-002] Use feature-folder architecture.

[BP-003] Separate content data from UI rendering.

[BP-004] Separate interaction logic from visual components.

[BP-005] Separate persistence logic behind an adapter interface.

[BP-006] Keep components small and composable.

[BP-007] Keep functions short and single-purpose.

[BP-008] Prefer explicit TypeScript types over implicit object shapes.

[BP-009] Prefer reusable engines over duplicated lesson logic.

[BP-010] Every major system must have a clear owner folder and typed contract.

## SUGGESTED_FOLDER_MODEL

[BP-020] Use this structure unless a better documented decision is added to DECISION_LOG.md:

```txt
/src
  /app
  /components
    /ui
    /visuals
    /layout
  /features
    /roadmap
    /lessons
    /labs
    /progress
    /review
    /capstone
  /content
    /roadmap
    /lessons
    /labs
    /taxonomy
  /lib
    /storage
    /scoring
    /visuals
    /utils
  /types
  /routes
```

## CONTENT_MODEL_PRINCIPLES

[BP-030] Lessons must be data-driven.

[BP-031] Labs must be config-driven where possible.

[BP-032] Roadmap nodes must declare prerequisites.

[BP-033] Every lesson must declare:
- id
- roadmapNodeId
- conceptIds
- prerequisites
- learningGoal
- lessonMode
- interactionType
- visualModelId
- feedbackPatternId
- reviewHooks

[BP-034] Every interaction must declare:
- id
- type
- requiredConcepts
- prompt
- validActions
- scoringLogic
- feedbackRules
- failureModes
- transferTarget

## VISUAL_BUILD_PRINCIPLES

[BP-040] Build visual primitives before content-heavy screens.

[BP-041] All complex visuals must be reusable components.

[BP-042] Every visual component must be represented in `/visual-lab`.

[BP-043] Prefer SVG/HTML/CSS over Canvas.

[BP-044] Use fixed layout rules for graph-like components.

[BP-045] Mobile readability overrides diagram density.

[BP-046] Every complex visual needs a fallback compact view.

## ROADMAP_BUILD_PRINCIPLES

[BP-050] The primary navigation is a guided roadmap.

[BP-051] Labs unlock through roadmap progression.

[BP-052] Review tasks are scheduled from completed roadmap nodes.

[BP-053] Advanced topics may appear visually as locked future nodes, but must not be implemented early.

[BP-054] Capstone dependencies must be visible from early phases.

## FEEDBACK_PRINCIPLES

[BP-060] Feedback structure:
1. decision taken
2. system consequence
3. real-world context
4. failure mode
5. better architecture rule
6. improved solution

[BP-061] Feedback must be concrete.

[BP-062] Feedback must not infer user personality or identity.

[BP-063] Feedback must cite the failed system property, not the user.

## QUALITY_PRINCIPLES

[BP-070] After every meaningful feature, update FEATURE_LEDGER.md.

[BP-071] After every architecture decision, update DECISION_LOG.md.

[BP-072] After every phase, run self-review against quality gates.

[BP-073] If a task creates context noise, summarize and store durable state before continuing.

[BP-074] Do not leave undocumented conventions.
