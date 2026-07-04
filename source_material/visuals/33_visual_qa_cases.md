# /source_material/visuals/33_visual_qa_cases.md

STATUS: VISUAL_DOC  
LOAD_PRIORITY: WHEN_VISUAL_LAB_OR_VISUAL_QA  
PURPOSE: Define visual QA cases for `/visual-lab`.

## QA_RULES

[VQA-001] Visual QA is required because AI agents cannot reliably see graphical bugs.
[VQA-002] Every complex visual needs visual-lab cases before use in lessons.
[VQA-003] QA cases must use deterministic sample data.
[VQA-004] QA must include mobile and dense states.
[VQA-005] If visual fails QA, use compact fallback before shipping.
[VQA-006] Update VISUAL_QA_LOG.md after visual changes.

## GLOBAL_TEST_WIDTHS

[VQA-010] Test widths:
- mobile_narrow: 360px
- mobile_large: 430px
- tablet: 768px
- desktop: 1200px

[VQA-011] If implementation cannot force widths in app, create visual-lab wrappers with max-width containers.

## GLOBAL_LABEL_TESTS

[VQA-020] SHORT_LABELS:
- "Model"
- "Tool"
- "Eval"
- "Memory"

[VQA-021] LONG_LABELS:
- "Long-running Agent Project Memory"
- "Human Approval Gate for Destructive Tool Actions"
- "Contextual Retrieval with Reranking and Source Grounding"
- "Visual Document Retrieval for Table-heavy PDFs"

[VQA-022] MIXED_LANGUAGE_LABELS:
- "Context Window"
- "Tool Boundary"
- "Eval Harness"
- "Repo-Konventionen"
- "Fehlerursache"

## GLOBAL_STATE_TESTS

[VQA-030] Required states:
- default
- selected
- warning
- disabled
- failure_origin
- symptom
- completed

[VQA-031] State must be visible without relying only on color.

## COMPONENT_QA_CASES

### VQA-SystemNode

COMPONENT: VIS-SystemNode  
REQUIRED_CASES:
- short labels for all node kinds
- long labels with truncation
- badges overflow
- selected state
- warning state
- disabled state
- mobile card list
- dense architecture board with 8+ nodes

FAIL_IF:
- label overlaps badge.
- touch target too small.
- kind is not visually distinguishable.
- state is color-only.

### VQA-SystemEdge

COMPONENT: VIS-SystemEdge  
REQUIRED_CASES:
- data edge
- control edge
- tool_call edge
- eval_feedback edge
- approval edge
- risk edge
- edge with label
- edge without label
- mobile fallback as connection list

FAIL_IF:
- arrow direction unclear.
- label overlaps node.
- risky edge lacks explanation access.
- mobile view requires precise line tracing.

### VQA-LayerStack

COMPONENT: VIS-LayerStack  
REQUIRED_CASES:
- 4 layers
- 8 layers
- highlighted failure layer
- layers with items
- empty layer
- mobile vertical stack
- compact mode

FAIL_IF:
- layer labels unreadable.
- highlighted layer not obvious.
- stack overflows mobile screen horizontally.

### VQA-BoundaryBox

COMPONENT: VIS-BoundaryBox  
REQUIRED_CASES:
- trust boundary
- permission boundary
- context boundary
- sandbox boundary
- nested boundary
- warning boundary
- mobile compact boundary

FAIL_IF:
- boundary label hidden.
- nested boundaries unreadable.
- permission meaning unclear.

### VQA-TokenBudgetBar

COMPONENT: VIS-TokenBudgetBar  
REQUIRED_CASES:
- under budget
- near budget
- over budget
- many small segments
- one huge segment
- high noise risk
- high missing-context risk
- mobile compact

FAIL_IF:
- token numbers hidden.
- overflow state unclear.
- risk shown only by color.
- segments too tiny to understand.

### VQA-TraceTimeline

COMPONENT: VIS-TraceTimeline  
REQUIRED_CASES:
- 3 events
- 10 events
- long event details
- failure origin
- symptom event
- selected event
- actor variety
- mobile one-event-expanded mode

FAIL_IF:
- failure origin and symptom look same.
- event details overflow.
- actor not visible.
- timeline unusable on mobile.

### VQA-DecisionCard

COMPONENT: VIS-DecisionCard  
REQUIRED_CASES:
- short decision
- long decision
- selected
- disabled with reason
- strong choice
- weak choice
- trade-offs list
- mobile two-option view

FAIL_IF:
- disabled reason unavailable.
- selected state color-only.
- long text destroys layout.

### VQA-FailureModeCard

COMPONENT: VIS-FailureModeCard  
REQUIRED_CASES:
- symptom
- root cause
- distractor
- repair rule
- risk
- with layer tag
- long label
- selected/warning states

FAIL_IF:
- symptom/root cause not distinguishable.
- layer tag missing.
- explanation inaccessible.

### VQA-ScoreMeter

COMPONENT: VIS-ScoreMeter  
REQUIRED_CASES:
- risk interpretation
- mastery interpretation
- coverage interpretation
- quality interpretation
- low/mid/high value
- compact mode

FAIL_IF:
- feels like XP/gamification meter.
- value meaning unclear.
- relies only on color.

### VQA-CompactFallbackView

COMPONENT: VIS-CompactFallbackView  
REQUIRED_CASES:
- 3 items
- 10 items
- warning item
- selected item
- long item detail
- mobile view

FAIL_IF:
- fallback loses learning objective.
- too dense for mobile.
- item states unclear.

### VQA-PaperFigureRecreation

COMPONENT: VIS-PaperFigureRecreation  
REQUIRED_CASES:
- simple 3-component figure
- 6-component figure
- applies/does-not-apply lists
- wrong application example
- fullscreen mobile mode
- compact fallback

FAIL_IF:
- resembles copied source figure too closely.
- practical decision missing.
- mobile diagram unreadable.

## DIAGRAM_TYPE_QA_CASES

### VQA-DIAGRAM-AUGMENTED-LLM-MAP

TESTS:
- minimal system: model + tool
- full system: model + tools + retrieval + memory + eval + security
- missing eval warning
- missing boundary warning
- compact fallback

FAIL_IF:
- implies all modules always required.
- model not visually central enough to understand base unit.
- security/eval loop unreadable.

### VQA-DIAGRAM-CONTEXT-WINDOW

TESTS:
- budget under limit
- budget over limit
- stale memory item
- compressed item
- excluded noise
- required missing item
- mobile item deck

FAIL_IF:
- selected vs excluded unclear.
- token budget unreadable.
- stale/noise risk hidden.

### VQA-DIAGRAM-RETRIEVAL-PIPELINE

TESTS:
- basic RAG
- hybrid search
- reranking
- contextual retrieval
- visual retrieval
- missed evidence warning
- mobile stepper fallback

FAIL_IF:
- pipeline stages too dense.
- query/corpus/result relationship unclear.
- visual retrieval not distinguishable from text retrieval.

### VQA-DIAGRAM-WORKFLOW-VS-AGENT

TESTS:
- predictable workflow wins
- dynamic agent justified
- agent overuse warning
- stop condition missing
- observability missing
- compact comparison fallback

FAIL_IF:
- agent side looks inherently superior.
- workflow side looks obsolete.
- control difference unclear.

### VQA-DIAGRAM-SECURITY-BOUNDARY-MAP

TESTS:
- untrusted retrieved doc
- broad tool permission
- approval gate
- sandbox
- prompt injection path
- mobile boundary stack

FAIL_IF:
- trust zones unclear.
- unsafe permission not visible.
- approval gate hidden.

## VISUAL_LAB_ROUTE_SPEC

[VQA-100] Route path: `/visual-lab`.

[VQA-101] Visual-lab sections:
1. primitives
2. diagram types
3. interaction visuals
4. paper visual recreations
5. mobile stress tests
6. dense stress tests
7. fallback views

[VQA-102] Each case should show:
- component/diagram name
- test case ID
- viewport wrapper
- sample data name
- known risks
- pass/fail notes field if implemented

[VQA-103] Visual-lab should not require user progress state.

[VQA-104] Visual-lab can be hidden from main navigation but accessible by route.

## QA_EXIT_RULES

[VQA-200] A visual component can be used in lessons only after:
- appears in visual-lab
- mobile case inspected
- long-label case inspected
- dense or empty case inspected when relevant
- VISUAL_QA_LOG.md updated

[VQA-201] If not passed, use compact fallback or delay feature.
