# /source_material/research/40_research_brief.md

STATUS: RESEARCH_DOC  
LOAD_PRIORITY: WHEN_RESEARCH_SYNTHESIS_OR_CONTENT_PLANNING  
PURPOSE: Compact research synthesis. Do not use as implementation spec.

LAST_VERIFIED: 2026-06-13

## RESEARCH_USAGE_RULES

[RB-001] Research docs inform taxonomy, visuals, interactions, and lesson examples.
[RB-002] Research docs are lower priority than control docs.
[RB-003] Do not paste raw paper explanations into learner-facing content.
[RB-004] Convert research into system decisions, failure modes, visuals, and interactions.
[RB-005] Every research-derived concept must map to PC-030.
[RB-006] Prefer official docs for product/API behavior.
[RB-007] Prefer papers for conceptual mechanisms and frontier techniques.
[RB-008] Mark uncertain or fast-changing source claims as REFRESH_NEEDED.

## HIGH_SIGNAL_FINDINGS

### RB-FINDING-001 — Simple composable patterns before agent complexity

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-AIE-004
- CONCEPT-CF-001
- CONCEPT-CF-002
- CONCEPT-CF-003
- CONCEPT-CF-004
- CONCEPT-CF-005
- CONCEPT-CF-006
- CONCEPT-CF-007

SUMMARY:
- Start with simplest reliable design.
- Workflows provide predefined control paths.
- Agents dynamically direct process/tool use.
- Complexity trades cost/latency for task performance.
- Autonomous agents need ground truth, stopping conditions, testing, sandboxing, and guardrails.

TEACH_AS:
- architecture selection problem, not hype ladder.

INTERACTIONS:
- Trade-off Duel
- Architecture Builder
- Agent Trace Debugger

VISUALS:
- VTYPE-WORKFLOW-VS-AGENT
- VTYPE-ORCHESTRATOR-WORKER
- VTYPE-EVAL-LOOP

FAILURE_MODE:
- autonomous agent used where workflow is sufficient.

### RB-FINDING-002 — Tool definitions are Agent-Computer Interfaces

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-TOOL-001
- CONCEPT-TOOL-002
- CONCEPT-TOOL-003
- CONCEPT-SEC-001

SUMMARY:
- Tool definitions need clear documentation, examples, boundaries, input requirements, and tests.
- Tool format should avoid unnecessary model difficulty.
- Tool parameters can prevent errors by design.

TEACH_AS:
- interface design for models.

INTERACTIONS:
- Tool Contract Forge
- Security Incident Room

VISUALS:
- VTYPE-TOOL-BOUNDARY-MAP

FAILURE_MODE:
- ambiguous tool contract causes wrong tool call or unsafe default.

### RB-FINDING-003 — Contextual Retrieval addresses chunk context loss

SOURCE_ANCHOR: SRC-ANT-CTXRET  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-RET-001
- CONCEPT-RET-002
- CONCEPT-RET-005
- CONCEPT-RET-006
- CONCEPT-RET-007

SUMMARY:
- Traditional RAG chunks can lose surrounding document context.
- Contextual Retrieval adds context to chunks before indexing.
- Combining contextual retrieval with reranking can improve retrieval reliability.
- Small knowledge bases may fit directly in long context; larger ones need scalable retrieval.

TEACH_AS:
- retrieval architecture decision.

INTERACTIONS:
- Retrieval Factory
- Context Budget Board

VISUALS:
- VTYPE-RETRIEVAL-PIPELINE

FAILURE_MODE:
- isolated chunks cannot be retrieved or are misinterpreted.

### RB-FINDING-004 — Subagents preserve main context by isolating noisy work

SOURCE_ANCHOR: SRC-ANT-SUBAGENTS  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-CTX-005
- CONCEPT-CF-005
- CONCEPT-MEM-005

SUMMARY:
- Subagents handle side tasks in separate context windows.
- Useful for search results, logs, file contents, or repeatable specialized work.
- Subagents can have custom prompts, tool access, and permissions.
- Result should return compact summary/evidence.

TEACH_AS:
- context isolation and delegation boundary.

INTERACTIONS:
- Agent Trace Debugger
- Architecture Builder
- Repo Refactor Lab

VISUALS:
- VTYPE-ORCHESTRATOR-WORKER
- VTYPE-CONTEXT-WINDOW

FAILURE_MODE:
- main conversation flooded with high-volume exploration.

### RB-FINDING-005 — Structured Outputs solve schema compliance, not truth

SOURCE_ANCHOR: SRC-OAI-STRUCT  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-TOOL-003
- CONCEPT-TOOL-004
- CONCEPT-EVAL-002

SUMMARY:
- Structured Outputs constrain model responses to developer-supplied schemas.
- Strict schemas improve machine interoperability.
- Schema validity does not guarantee semantic correctness.

TEACH_AS:
- output contract + eval separation.

INTERACTIONS:
- Constraint Puzzle
- Tool Contract Forge
- Eval Designer

VISUALS:
- VTYPE-TOOL-BOUNDARY-MAP
- VTYPE-EVAL-LOOP

FAILURE_MODE:
- valid JSON with wrong answer passes downstream parser.

### RB-FINDING-006 — MCP standardizes connections to tools/data/workflows

SOURCE_ANCHOR: SRC-MCP-INTRO  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-TOOL-005
- CONCEPT-TOOL-001
- CONCEPT-SEC-001
- CONCEPT-PROD-003

SUMMARY:
- MCP is an open standard for connecting AI applications to external systems.
- It can expose data sources, tools, and workflows to AI applications.
- Useful as integration architecture, not as beginner magic.

TEACH_AS:
- standardized connector/control-plane design.

INTERACTIONS:
- Tool Contract Forge
- Architecture Builder
- Security Incident Room

VISUALS:
- VTYPE-TOOL-BOUNDARY-MAP

FAILURE_MODE:
- ad-hoc tool sprawl without common contracts or boundaries.

### RB-FINDING-007 — Visual document retrieval matters for layout-heavy documents

SOURCE_ANCHOR: SRC-COLPALI  
CONFIDENCE: high  
APPLIES_TO:
- CONCEPT-RET-008
- CONCEPT-RET-009

SUMMARY:
- Many documents carry meaning in layout, figures, tables, fonts, and page structure.
- Text-extraction pipelines can lose visual cues.
- Page-image embeddings and late interaction can improve visual document retrieval.

TEACH_AS:
- retrieval method selection for visual evidence.

INTERACTIONS:
- Paper Figure Decoder
- Retrieval Factory

VISUALS:
- VTYPE-PAPER-FIGURE-RECREATION
- VTYPE-RETRIEVAL-PIPELINE

FAILURE_MODE:
- text-only RAG misses table/figure/layout evidence.

### RB-FINDING-008 — LoRA/DoRA belong to model adaptation decisions, not core agent architecture

SOURCE_ANCHORS:
- SRC-LORA
- SRC-DORA
CONFIDENCE: medium_high  
APPLIES_TO:
- future advanced model adaptation node only if needed.

SUMMARY:
- LoRA reduces trainable parameters by freezing base weights and adding low-rank trainable matrices.
- DoRA decomposes weight updates into magnitude and direction to improve LoRA-style adaptation.
- These concepts are relevant when the system decision is fine-tune/adapt model vs prompting/RAG/tooling.

TEACH_AS:
- model adaptation trade-off, not core roadmap driver.

INTERACTIONS:
- Trade-off Duel
- Architecture Builder advanced variant

VISUALS:
- optional model adaptation decision map

FAILURE_MODE:
- choosing fine-tuning because retrieval/prompt/tool architecture is misunderstood.

### RB-FINDING-009 — Learning design should mix worked examples, active diagnosis, retrieval practice, and transfer

SOURCE_ANCHORS:
- SRC-LEARN-WORKED
- SRC-LEARN-RETRIEVAL
- SRC-LEARN-ICAP
CONFIDENCE: medium_high  
APPLIES_TO:
- lesson grammar
- review system
- interaction design

SUMMARY:
- Worked examples reduce cognitive load during early complex skill acquisition.
- Retrieval practice supports long-term retention.
- Higher cognitive engagement activities can improve learning.
- Learners with low prior knowledge need more scaffolding; stronger learners benefit from buggy/diagnostic examples.

TEACH_AS:
- adaptive lesson modes and review hooks.

INTERACTIONS:
- Worked Trace
- Failure Mode Tree
- Repair Missions
- Transfer Tasks

VISUALS:
- mastery/review map, not XP grind.

FAILURE_MODE:
- throwing learner into open architecture tasks without enough scaffold.

## PRIORITY_RESEARCH_TO_CONVERT_NEXT

[RB-NEXT-001] Build detailed source anchors in 41_source_index.md.
[RB-NEXT-002] Add paper notes only for sources that create visuals/interactions.
[RB-NEXT-003] Add course/doc notes only when they inform roadmap or build rules.
[RB-NEXT-004] Avoid adding more sources before current source anchors are mapped to content.
