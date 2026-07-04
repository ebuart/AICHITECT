# /source_material/progress/AGENT_LEARNING_LOG.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: ONLY_WHEN_PATTERN_REPEATS  
PURPOSE: Store recurring process lessons for Claude Code. Prevent repeating mistakes.

## USE_POLICY

[ALL-001] Do not load every session unless PROJECT_MEMORY references an active recurring issue.

[ALL-002] Add an entry only when a mistake, workaround, or success pattern repeats.

[ALL-003] Keep entries short and actionable.

[ALL-004] If a lesson becomes permanent policy, move it into the relevant control doc and mark the entry migrated.

[ALL-005] Remove stale or resolved entries during cleanup phases.

## ENTRY_TEMPLATE

### ALL-YYYYMMDD-XX — Title

STATUS: active | migrated | obsolete  
TYPE: mistake | workaround | success_pattern | visual_issue | content_issue | architecture_issue  
AFFECTS:
- ...

PATTERN:
- What kept happening?

CAUSE:
- Why did it happen?

RULE:
- What should future Claude sessions do differently?

MIGRATION_TARGET:
- control doc or progress doc if promoted.

## ENTRIES

### ALL-0001 — Keep source docs compact

STATUS: active  
TYPE: success_pattern  
AFFECTS:
- source-material design
- context management

PATTERN:
- Long human-readable MDs create future context noise.

CAUSE:
- Claude Code will load these docs many times across many sessions.

RULE:
- Use rule IDs, compact bullets, and specialized docs.
- Keep PROJECT_MEMORY as hot state; load specialized docs only when needed.

MIGRATION_TARGET:
- Already reflected in CTX rules.

### ALL-0002 — No lazy distractors ("model too small / prompt too short")

STATUS: active  
TYPE: content_issue  
AFFECTS:
- every scenario/lesson with a wrong option (mechanics + decisions)

PATTERN:
- Wrong answers were repeatedly "Modell zu klein", "größeres Modell", "Prompt zu kurz" — obviously-dummy
  options the learner spots instantly, making the challenge trivial. (User feedback 2026-06-18.)

CAUSE:
- Reaching for a generic filler distractor instead of authoring a realistic wrong choice per scenario.

RULE:
- Distractors must be things a competent engineer might actually try and get wrong: a symptom patch, an
  over-engineering, a tempting-but-wrong control, the right idea on the wrong layer. Model size / prompt
  length are almost never the cause — do not use them as the wrong option.

MIGRATION_TARGET:
- Promoted to control/07 LR-011a.

### ALL-0003 — No answer-announcing labels; spiral difficulty (TryHackMe, not a quiz)

STATUS: active  
TYPE: content_issue  
AFFECTS:
- every interactive scenario (badges, item labels, option wording, curriculum ordering)

PATTERN:
- Even after the distractor fix, challenges still gave themselves away: the Context Budget Board stamped
  „NOISE“/„KEY“/„STALE“ badges on cards BEFORE the learner answered, and items were named „Unverwandtes
  Marketing-Doc“ / „Langer alter Chat-Verlauf“ — you pattern-match the label, you don't reason. User
  (2026-06-19): feels like a NotebookLM quiz; wants TryHackMe-style applied mastery.

CAUSE:
- Surfacing the scoring signal (relevance/noise/stale, required) directly in the UI, and naming distractors
  by their verdict instead of by a plausible real-world surface. Plus no difficulty ramp — the same obvious
  framing is reused after the concept was already taught.

RULE:
- Hide the verdict until AFTER evaluation (reveal = the teaching moment). Name distractors so they look
  plausibly includable; make the learner judge from situation + source + cost. Teach a fact clearly ONCE at
  its first node; disguise it on every later reuse (transfer/cross-arc/capstone). Difficulty ramps.

MIGRATION_TARGET:
- Promoted to control/07 LR-011b.

### ALL-0004 — Pointer capture on an ancestor silently breaks tap-to-click (touch)

OBSERVATION (Werft, FL-0057):
- After moving the pan/zoom canvas's `setPointerCapture` from the tapped node onto the viewport (to make
  dragging robust), tapping a node to select/buy SILENTLY stopped working — worst on touch. The drag worked;
  the "click" just never reached the node.

CAUSE:
- Capturing a pointer to an ancestor element retargets the synthesized `click` away from the original node, so
  a `<button onClick>` never fires. Selection that depends on the native click then dies.

RULE:
- For custom pan/zoom/drag surfaces, do tap-selection on `pointerup` (down-target recorded, no movement past a
  threshold) rather than relying on the native `click`. Keep `onClick` only as a convenience/test path. Also:
  in a pure black/white token system, a true LIGHT MODE is one CSS block — Tailwind v4 `bg-white`/`text-white`
  compile to `var(--color-white)`/`var(--color-black)`, so re-pointing those two vars (+ the deck tokens) under
  a root class inverts the whole app with zero per-component edits.
