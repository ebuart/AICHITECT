# /source_material/interactions/23_feedback_patterns.md

STATUS: INTERACTION_DOC  
LOAD_PRIORITY: WHEN_FEEDBACK_OR_SCORING_WORK  
PURPOSE: Define feedback patterns that avoid AI-slop and psychologizing.

## FEEDBACK_RULES

[FB-001] Feedback analyzes decisions and system consequences.
[FB-002] Do not analyze user personality.
[FB-003] Do not use "vibecoder" as user label.
[FB-004] Do not use generic praise or generic criticism.
[FB-005] Feedback must name the system property affected.
[FB-006] Feedback must include a better architecture rule when possible.
[FB-007] Avoid long paragraphs. Use structured compact blocks.
[FB-008] For advanced tasks, include trade-off, not just correct answer.
[FB-009] Feedback may say "not sufficient" when answer misses core concept.
[FB-010] Feedback must not pretend there is only one correct design when trade-offs exist.

## STANDARD_FEEDBACK_SCHEMA

```ts
type Feedback = {
  id: string
  severity: 'info' | 'weak' | 'risk' | 'critical' | 'strong'
  decision: string
  consequence: string
  realWorldContext: string
  failureMode: string
  architectureRule: string
  improvedSolution: string
  reviewHook?: string
}
```

## SHORT_FEEDBACK_FORMAT

USE_FOR:
- small interaction steps
- mobile UI
- quick correction

FORMAT:
- Decision:
- Consequence:
- Fix:

## FULL_FEEDBACK_FORMAT

USE_FOR:
- lab completion
- architecture decisions
- capstone stages

FORMAT:
- Decision taken:
- System consequence:
- Real-world context:
- Failure mode:
- Better architecture rule:
- Improved solution:
- Review hook:

## SEVERITY_LEVELS

[FB-SEV-INFO]
MEANING: acceptable but worth noting.
TONE: neutral.

[FB-SEV-WEAK]
MEANING: partially correct but missing relevant system property.
TONE: precise.

[FB-SEV-RISK]
MEANING: could fail in larger systems.
TONE: concrete consequence.

[FB-SEV-CRITICAL]
MEANING: unsafe, untestable, or architecture-breaking.
TONE: direct.

[FB-SEV-STRONG]
MEANING: good decision with correct trade-off.
TONE: explain why it works; avoid empty praise.

## PATTERN_LIBRARY

### FB-PATTERN-CONTEXT-NOISE

APPLIES_TO:
- INT-CONTEXT-BUDGET-BOARD
- INT-AGENT-TRACE-DEBUGGER

TRIGGER:
- user includes irrelevant/stale/conflicting context.

FEEDBACK:
- decision: Included low-value or stale context in model input.
- consequence: Important constraints compete with noise inside limited context.
- realWorldContext: Long-running coding agents often receive old notes, logs, and unrelated files.
- failureMode: Agent follows stale constraints or misses the actual task boundary.
- architectureRule: Keep hot context minimal; move durable state to memory files and noisy exploration to isolated workers.
- improvedSolution: Include current task, active constraints, relevant files, and compact memory; exclude unrelated history.

### FB-PATTERN-MISSING-CRITICAL-CONTEXT

APPLIES_TO:
- INT-CONTEXT-BUDGET-BOARD
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user drops required constraint/source.

FEEDBACK:
- decision: Excluded decision-critical context.
- consequence: The model may produce locally plausible output that violates hidden constraints.
- realWorldContext: Agents often break product rules when source constraints are absent from the active context.
- failureMode: Correct-looking implementation with wrong architecture or UX.
- architectureRule: Preserve constraints that define success, even if they cost tokens.
- improvedSolution: Compress supporting details, but keep non-negotiable constraints explicit.

### FB-PATTERN-OVERENGINEERED-AGENTS

APPLIES_TO:
- INT-ARCHITECTURE-BUILDER
- INT-TRADE-OFF-DUEL
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user selects multi-agent/autonomous architecture where workflow is enough.

FEEDBACK:
- decision: Used agentic autonomy where a predictable workflow would satisfy the task.
- consequence: Cost, latency, and failure surface increase without matching benefit.
- realWorldContext: Many production AI systems start as workflows because control and evaluation are clearer.
- failureMode: Compounding errors across agents and unclear ownership of decisions.
- architectureRule: Use the simplest architecture that meets measurable requirements.
- improvedSolution: Start with workflow/prompt chain/router; introduce agents only for dynamic planning or open-ended tool use.

### FB-PATTERN-NO-EVAL

APPLIES_TO:
- INT-ARCHITECTURE-BUILDER
- INT-EVAL-DESIGNER
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user omits eval harness or success metrics.

FEEDBACK:
- decision: Designed system behavior without repeatable measurement.
- consequence: There is no reliable way to know whether changes improve or regress the system.
- realWorldContext: Prompt/model/retrieval changes can improve one case while silently breaking another.
- failureMode: Demo works once but cannot be maintained.
- architectureRule: Define task success and regression checks before scaling behavior.
- improvedSolution: Add eval cases for expected success, known failures, negative cases, and grounding when sources matter.

### FB-PATTERN-FORMAT-ONLY-EVAL

APPLIES_TO:
- INT-EVAL-DESIGNER

TRIGGER:
- user evaluates only JSON/schema/format.

FEEDBACK:
- decision: Measured output format but not semantic correctness.
- consequence: Invalid answers can pass if they look structurally correct.
- realWorldContext: Structured Outputs solve parseability, not task truth.
- failureMode: System becomes machine-readable but still wrong.
- architectureRule: Separate format validity from semantic task success.
- improvedSolution: Keep schema checks, then add task-specific graders, regression examples, and source grounding checks.

### FB-PATTERN-BROAD-TOOL-PERMISSION

APPLIES_TO:
- INT-TOOL-CONTRACT-FORGE
- INT-SECURITY-INCIDENT-ROOM

TRIGGER:
- user gives broad permissions or write access without need.

FEEDBACK:
- decision: Tool permission is broader than the task requires.
- consequence: A small model mistake can create large side effects.
- realWorldContext: Agents that can read/write/delete broadly need stronger boundaries and approvals.
- failureMode: Unsafe action, data exposure, or irreversible change.
- architectureRule: Apply least privilege and gate high-impact actions.
- improvedSolution: Narrow tool scope, restrict inputs, define allowed actions, and require human approval for risky operations.

### FB-PATTERN-AMBIGUOUS-TOOL-CONTRACT

APPLIES_TO:
- INT-TOOL-CONTRACT-FORGE

TRIGGER:
- user defines vague parameters or output.

FEEDBACK:
- decision: Tool contract leaves important behavior ambiguous.
- consequence: The agent must infer how to call the tool, increasing brittle failures.
- realWorldContext: Tool definitions act like interfaces for models; ambiguity becomes runtime error.
- failureMode: Wrong tool call, invalid args, unsafe defaults, or inconsistent output.
- architectureRule: Tool contracts need narrow purpose, explicit parameters, typed outputs, and failure behavior.
- improvedSolution: Rewrite contract with precise fields, examples, validation rules, and error cases.

### FB-PATTERN-RETRIEVAL-MISMATCH

APPLIES_TO:
- INT-RETRIEVAL-FACTORY

TRIGGER:
- user chooses retrieval method that does not fit query/corpus.

FEEDBACK:
- decision: Retrieval method does not match the evidence type.
- consequence: Relevant evidence may never enter the context.
- realWorldContext: Code identifiers, legal clauses, tables, and figures require different retrieval strategies.
- failureMode: Grounded-looking answer based on wrong or incomplete evidence.
- architectureRule: Match retrieval to corpus and query: lexical for exact terms, semantic for meaning, hybrid for mixed, visual retrieval when layout matters.
- improvedSolution: Use hybrid retrieval with reranking, or visual/page-based retrieval for layout-heavy documents.

### FB-PATTERN-CHUNK-CONTEXT-LOSS

APPLIES_TO:
- INT-RETRIEVAL-FACTORY

TRIGGER:
- user chunks documents in a way that removes surrounding meaning.

FEEDBACK:
- decision: Chunking removed document-level context.
- consequence: Correct chunks become hard to retrieve or misleading after retrieval.
- realWorldContext: Isolated chunks often lose section purpose, entity references, or table meaning.
- failureMode: Retrieval misses relevant evidence or injects ambiguous fragments.
- architectureRule: Preserve enough context around chunks for retrieval and generation.
- improvedSolution: Add contextual chunk descriptions, metadata, parent sections, or larger/overlapping chunks where needed.

### FB-PATTERN-NO-OBSERVABILITY

APPLIES_TO:
- INT-AGENT-TRACE-DEBUGGER
- INT-EVAL-DESIGNER
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user omits trace/logging/inspection plan.

FEEDBACK:
- decision: System behavior is not inspectable.
- consequence: Failures cannot be debugged beyond guessing.
- realWorldContext: Agent systems involve model calls, retrieval, tool calls, and intermediate decisions.
- failureMode: Unknown root cause, repeated incidents, weak postmortems.
- architectureRule: Make model/tool/retrieval/eval steps traceable.
- improvedSolution: Add trace events for inputs, retrieved evidence, tool calls, outputs, errors, and evaluator decisions.

### FB-PATTERN-CHAT-MEMORY-ONLY

APPLIES_TO:
- INT-REPO-REFACTOR-LAB
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user relies on conversation memory instead of durable artifacts.

FEEDBACK:
- decision: Important project state remains only in chat/session context.
- consequence: Future sessions cannot reliably recover constraints, decisions, and progress.
- realWorldContext: Long-running agent-driven projects lose scope when state is not externalized.
- failureMode: repeated rediscovery, contradictory decisions, unfinished work, broken conventions.
- architectureRule: Store durable state in project files with clear update protocol.
- improvedSolution: Add project memory, decision log, feature ledger, open questions, and coverage/QA logs.

### FB-PATTERN-DOC-DUPLICATION

APPLIES_TO:
- INT-REPO-REFACTOR-LAB

TRIGGER:
- user duplicates rules across multiple docs.

FEEDBACK:
- decision: Same rule is stored in multiple source locations.
- consequence: Future agents may read conflicting versions or waste context on repetition.
- realWorldContext: Source-material systems become context-noisy when every file restates the same principles.
- failureMode: stale duplicates and inconsistent implementation.
- architectureRule: Each rule needs one owner doc; other docs reference the rule ID.
- improvedSolution: Move rule to the correct control doc and reference its ID elsewhere.

### FB-PATTERN-VISUAL-UNTESTED

APPLIES_TO:
- INT-ARCHITECTURE-BUILDER
- INT-PAPER-FIGURE-DECODER
- INT-CAPSTONE-SIMULATOR

TRIGGER:
- user/implementation uses visual without QA/fallback.

FEEDBACK:
- decision: Complex visual was added without isolated QA.
- consequence: Graphical errors can hide in lessons and are hard for agents to debug.
- realWorldContext: AI coding agents often cannot visually inspect overlap, spacing, and mobile readability reliably.
- failureMode: unreadable diagrams, broken mobile layout, hidden labels.
- architectureRule: Build visual primitives and test them in `/visual-lab` before content usage.
- improvedSolution: Add visual-lab cases for mobile, long labels, dense state, empty state, and fallback view.

## POSITIVE_FEEDBACK_PATTERNS

### FB-POS-SIMPLE-WORKFLOW

TRIGGER:
- user chooses workflow instead of unnecessary agent.

FEEDBACK:
- decision: Used a predictable workflow for a predictable task.
- consequence: The system is easier to test, observe, and maintain.
- why_it_works: The task has known steps and does not require open-ended autonomous planning.
- next_level: Add evals and trace points before scaling.

### FB-POS-BOUNDARY-CLEAR

TRIGGER:
- user defines narrow tool boundary with approval for risky action.

FEEDBACK:
- decision: Tool contract separates allowed actions from high-impact actions.
- consequence: Agent can operate efficiently while risky operations remain controlled.
- why_it_works: Least privilege reduces blast radius without blocking useful automation.
- next_level: Add test cases and structured error behavior.

### FB-POS-CONTEXT-DISCIPLINE

TRIGGER:
- user keeps critical context and excludes noise.

FEEDBACK:
- decision: Context pack keeps constraints and evidence while excluding low-value history.
- consequence: Model receives higher signal density and fewer conflicting instructions.
- why_it_works: Limited context is treated as architecture resource.
- next_level: Define what belongs in durable memory vs current task context.

## FEEDBACK_QUALITY_CHECK

[FB-QA-001] Does feedback mention the decision?
[FB-QA-002] Does feedback name a system consequence?
[FB-QA-003] Does feedback avoid personality labels?
[FB-QA-004] Does feedback include concrete repair?
[FB-QA-005] Does feedback avoid generic "great job" or "try again"?
[FB-QA-006] Does feedback fit mobile reading length?
