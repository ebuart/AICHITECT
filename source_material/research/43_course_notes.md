# /source_material/research/43_course_notes.md

STATUS: RESEARCH_DOC  
LOAD_PRIORITY: WHEN_LEARNING_DESIGN_OR_COURSE_ALIGNMENT  
PURPOSE: Compact notes from official courses/docs and learning-science anchors.

LAST_VERIFIED: 2026-06-13

## COURSE_NOTE_RULES

[CN-001] Course notes inform sequencing and pedagogy, not implementation details.
[CN-002] Do not copy course structure blindly.
[CN-003] This app should integrate course/paper/doc knowledge invisibly into roadmap tasks.
[CN-004] Learner does not need to know if idea came from course, docs, or paper unless source view is later added.
[CN-005] Keep notes short and convert to interactions.

## OFFICIAL_COURSE_AND_DOC_ANCHORS

### CN-ANTHROPIC-ACADEMY

SOURCE: SRC-ANT-LEARN  
STATUS: orientation  
RELEVANCE:
- Anthropic lists learning resources/courses for AI Fluency, API development, MCP, and Claude Code.
- Confirms that Claude Code and MCP are high-value curriculum anchors.

APP_USE:
- Ensure roadmap covers Claude Code-style agent-driven development, MCP, and API/product engineering.
- Do not build a certificate/course clone.

### CN-ANTHROPIC-PROMPT-OVERVIEW

SOURCE: SRC-ANT-PROMPT-OVERVIEW  
STATUS: principle  
RELEVANCE:
- Prompt work should start with success criteria and empirical tests.
- Not every failure is best solved by prompt engineering; latency/cost/model choice may be better levers.

APP_USE:
- Teach "prompt is one lever" inside system layer thinking.
- Add Eval Designer before advanced prompt-tuning content.

FAILURE_MODE:
- trying to fix architecture/eval/retrieval/tool problems with prompt tweaks only.

### CN-OPENAI-AGENTS-DOCS

SOURCE: SRC-OAI-AGENTS-DOCS  
STATUS: implementation_reference  
RELEVANCE:
- Official docs include agents, orchestration, guardrails, state/results, integrations/observability, and evaluation navigation.
- Useful for modern agent-system surface area.

APP_USE:
- Validate that roadmap includes orchestration, guardrails, observability, evaluation, and state.
- Refresh if implementing provider-specific integrations.

### CN-OPENAI-PROMPT-GUIDE

SOURCE: SRC-OAI-PROMPT-GUIDE  
STATUS: model_specific_reference  
RELEVANCE:
- Useful for prompt/context behavior and long-context notes.
- Model-specific guidance should not become universal architecture law.

APP_USE:
- Use only as optional source when building prompt/context advanced lessons.
- Keep provider-specific details out of core fundamentals unless necessary.

## LEARNING_SCIENCE_ANCHORS

### CN-WORKED-EXAMPLES

SOURCE: SRC-LEARN-WORKED  
STATUS: pedagogy_core  
RELEVANCE:
- Worked examples reduce cognitive load for complex early skill acquisition.
- Best paired with self-explanation and fading toward independent tasks.
- Expertise reversal risk: advanced learners need less scaffold and more open diagnosis.

APP_USE:
- Use MODE-WORKED-TRACE-FIRST for complex agent/retrieval/eval flows.
- Use scaffold levels.
- Fade support across roadmap.

INTERACTION_MAPPING:
- Agent Trace Debugger.
- Retrieval Factory.
- Eval Designer.

### CN-RETRIEVAL-PRACTICE

SOURCE: SRC-LEARN-RETRIEVAL  
STATUS: pedagogy_core  
RELEVANCE:
- Retrieval practice improves retention more than rereading.
- Reviews should require recall/transfer, not passive recap.

APP_USE:
- Review hooks after nodes.
- Repair missions for weak dimensions.
- No "read again" as only review.

INTERACTION_MAPPING:
- Failure Mode Tree.
- Trade-off Duel.
- Transfer tasks.

### CN-ICAP-ADAPTIVITY

SOURCE: SRC-LEARN-ICAP  
STATUS: pedagogy_core  
RELEVANCE:
- Higher cognitive engagement activities can improve learning.
- Guided examples may help lower prior knowledge; buggy/diagnostic examples can help stronger learners.

APP_USE:
- Use adaptive scaffolding levels.
- Offer hints and worked traces before full diagnosis when prerequisites are weak.
- Use buggy examples for review/advanced variants.

INTERACTION_MAPPING:
- Failure Mode Tree.
- Repo Refactor Lab.
- Security Incident Room.

## LESSON_DESIGN_POLICIES_FROM_COURSE_NOTES

[CN-POL-001] Use explicit success criteria before prompting/model-tuning lessons.
[CN-POL-002] Use worked traces before independent trace diagnosis for new complex flows.
[CN-POL-003] Use retrieval/transfer tasks for review, not passive summaries.
[CN-POL-004] Use stronger scaffold early; reduce scaffold after mastery signals.
[CN-POL-005] Use buggy examples for learners who already completed prerequisite node.
[CN-POL-006] Keep concept source invisible unless source literacy is the lesson goal.
[CN-POL-007] Do not overload tired learners with raw papers; give visual system decisions first.
