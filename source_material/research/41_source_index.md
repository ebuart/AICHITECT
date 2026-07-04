# /source_material/research/41_source_index.md

STATUS: RESEARCH_DOC  
LOAD_PRIORITY: WHEN_CHECKING_SOURCE_ANCHORS  
PURPOSE: Source anchors, URLs, trust level, and curriculum relevance.

LAST_VERIFIED: 2026-06-13

## INDEX_RULES

[SI-001] Use source anchors instead of repeating URLs across docs.
[SI-002] Add a source only if it maps to concepts, visuals, or interactions.
[SI-003] Prefer official docs for API/product behavior.
[SI-004] Prefer peer-reviewed/arXiv papers for mechanisms and advanced concepts.
[SI-005] If a source changes frequently, mark REFRESH: yes.
[SI-006] Do not load all sources in implementation context.

## SOURCE_INDEX

### SRC-ANT-AGENTS

TITLE: Building effective agents  
TYPE: official_engineering_guide  
PROVIDER: Anthropic  
URL: https://www.anthropic.com/engineering/building-effective-agents  
TRUST: high  
REFRESH: medium  
MAPS_TO:
- CONCEPT-AIE-002
- CONCEPT-AIE-004
- CONCEPT-CF-001
- CONCEPT-CF-002
- CONCEPT-CF-003
- CONCEPT-CF-004
- CONCEPT-CF-005
- CONCEPT-CF-006
- CONCEPT-CF-007
- CONCEPT-TOOL-002
- CONCEPT-EVAL-001
KEY_USE:
- workflows vs agents
- augmented LLM
- pattern taxonomy
- ACI/tool design
- simplicity principle

### SRC-ANT-CTXRET

TITLE: Introducing Contextual Retrieval  
TYPE: official_engineering_guide  
PROVIDER: Anthropic  
URL: https://www.anthropic.com/engineering/contextual-retrieval  
TRUST: high  
REFRESH: medium  
MAPS_TO:
- CONCEPT-RET-001
- CONCEPT-RET-002
- CONCEPT-RET-003
- CONCEPT-RET-004
- CONCEPT-RET-005
- CONCEPT-RET-006
- CONCEPT-RET-007
- CONCEPT-CTX-006
KEY_USE:
- RAG primer
- chunk context loss
- contextual embeddings/BM25
- reranking
- prompt caching trade-off

### SRC-ANT-SUBAGENTS

TITLE: Create custom subagents  
TYPE: official_docs  
PROVIDER: Anthropic / Claude Code  
URL: https://code.claude.com/docs/en/sub-agents  
TRUST: high  
REFRESH: high  
MAPS_TO:
- CONCEPT-CTX-005
- CONCEPT-CF-005
- CONCEPT-MEM-005
- CONCEPT-SEC-001
KEY_USE:
- subagent context isolation
- specialized prompts/tools/permissions
- delegation for noisy side tasks

### SRC-ANT-LEARN

TITLE: Anthropic Academy / Learn  
TYPE: official_learning_portal  
PROVIDER: Anthropic  
URL: https://www.anthropic.com/learn  
TRUST: high  
REFRESH: high  
MAPS_TO:
- course references
- Claude Code
- MCP
- API development
KEY_USE:
- course/topic coverage sanity check
- not direct implementation spec

### SRC-ANT-PROMPT-OVERVIEW

TITLE: Prompt engineering overview  
TYPE: official_docs  
PROVIDER: Anthropic  
URL: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview  
TRUST: high  
REFRESH: high  
MAPS_TO:
- CONCEPT-EVAL-001
- CONCEPT-PROD-002
KEY_USE:
- prompt work should start from success criteria and empirical tests.
- prompt engineering is not always the right lever for every failure.

### SRC-OAI-STRUCT

TITLE: Introducing Structured Outputs in the API  
TYPE: official_engineering_post  
PROVIDER: OpenAI  
URL: https://openai.com/index/introducing-structured-outputs-in-the-api/  
TRUST: high  
REFRESH: medium  
MAPS_TO:
- CONCEPT-TOOL-003
- CONCEPT-TOOL-004
KEY_USE:
- strict schemas
- tool/function output reliability
- constrained decoding framing

### SRC-OAI-AGENTS-DOCS

TITLE: Agents SDK / Agents guides  
TYPE: official_docs  
PROVIDER: OpenAI  
URL: https://developers.openai.com/api/docs/guides/agents  
TRUST: high  
REFRESH: high  
MAPS_TO:
- CONCEPT-CF-007
- CONCEPT-OBS-001
- CONCEPT-EVAL-001
- CONCEPT-SEC-001
KEY_USE:
- modern agent implementation reference
- observability/eval/security docs navigation

### SRC-OAI-PROMPT-GUIDE

TITLE: GPT-4.1 Prompting Guide  
TYPE: official_cookbook  
PROVIDER: OpenAI  
URL: https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide  
TRUST: high  
REFRESH: high  
MAPS_TO:
- context management
- prompting
- long context behavior
KEY_USE:
- model-specific prompt/context behavior reference.
- do not treat as universal across models.

### SRC-MCP-INTRO

TITLE: What is the Model Context Protocol?  
TYPE: official_docs  
PROVIDER: Model Context Protocol  
URL: https://modelcontextprotocol.io/docs/getting-started/intro  
TRUST: high  
REFRESH: high  
MAPS_TO:
- CONCEPT-TOOL-005
- CONCEPT-TOOL-001
- CONCEPT-SEC-001
KEY_USE:
- MCP as open standard for external systems.
- client/server/tool/data connector framing.

### SRC-COLPALI

TITLE: ColPali: Efficient Document Retrieval with Vision Language Models  
TYPE: research_paper  
PROVIDER: arXiv / ICLR 2025  
URL: https://arxiv.org/abs/2407.01449  
TRUST: high  
REFRESH: medium  
MAPS_TO:
- CONCEPT-RET-008
- CONCEPT-RET-009
KEY_USE:
- visual document retrieval
- page-image embeddings
- late interaction
- layout/table/figure evidence

### SRC-LORA

TITLE: LoRA: Low-Rank Adaptation of Large Language Models  
TYPE: research_paper  
PROVIDER: arXiv  
URL: https://arxiv.org/abs/2106.09685  
TRUST: high  
REFRESH: low  
MAPS_TO:
- future model adaptation concept
KEY_USE:
- parameter-efficient fine-tuning.
- model adaptation trade-off vs RAG/prompting/tooling.

### SRC-DORA

TITLE: DoRA: Weight-Decomposed Low-Rank Adaptation  
TYPE: research_paper  
PROVIDER: arXiv / ICML 2024  
URL: https://arxiv.org/abs/2402.09353  
TRUST: high  
REFRESH: medium  
MAPS_TO:
- future model adaptation concept
KEY_USE:
- LoRA variant that decomposes magnitude/direction.
- advanced model adaptation discussion only.

### SRC-STRUCT-BENCH

TITLE: Generating Structured Outputs from Language Models: Benchmark and Studies  
TYPE: research_paper  
PROVIDER: arXiv  
URL: https://arxiv.org/abs/2501.10868  
TRUST: medium_high  
REFRESH: medium  
MAPS_TO:
- CONCEPT-TOOL-004
- CONCEPT-EVAL-002
KEY_USE:
- constrained decoding evaluation caveats.
- schema compliance vs behavior quality.

### SRC-RETRIEVAL-TABLE-BENCH

TITLE: From BM25 to Corrective RAG: Benchmarking Retrieval Strategies for Text-and-Table Documents  
TYPE: research_paper  
PROVIDER: arXiv  
URL: https://arxiv.org/abs/2604.01733  
TRUST: medium  
REFRESH: high  
MAPS_TO:
- CONCEPT-RET-003
- CONCEPT-RET-004
- CONCEPT-RET-005
- CONCEPT-RET-006
- CONCEPT-RET-007
KEY_USE:
- retrieval strategy trade-offs for mixed text/table documents.
- BM25/hybrid/reranking caution against semantic-only assumptions.

### SRC-CLAUDE-CODE-DESIGN

TITLE: Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems  
TYPE: research_paper  
PROVIDER: arXiv  
URL: https://arxiv.org/abs/2604.14228  
TRUST: medium  
REFRESH: high  
MAPS_TO:
- CONCEPT-CTX-005
- CONCEPT-MEM-005
- CONCEPT-SEC-001
- CONCEPT-REPO-004
KEY_USE:
- possible advanced source for Claude Code architecture.
- use cautiously; not official.

### SRC-LEARN-WORKED

TITLE: Worked-example effect  
TYPE: learning_science_reference  
PROVIDER: secondary/reference  
URL: https://en.wikipedia.org/wiki/Worked-example_effect  
TRUST: medium  
REFRESH: low  
MAPS_TO:
- MODE-WORKED-TRACE-FIRST
- MODE-TERM-FIRST
KEY_USE:
- initial scaffolding for complex skills.
- use with self-explanation and fading.

### SRC-LEARN-RETRIEVAL

TITLE: Testing effect / Retrieval practice  
TYPE: learning_science_reference  
PROVIDER: secondary/reference  
URL: https://en.wikipedia.org/wiki/Testing_effect  
TRUST: medium  
REFRESH: low  
MAPS_TO:
- review hooks
- spaced review
KEY_USE:
- active recall over rereading.
- transfer review tasks.

### SRC-LEARN-ICAP

TITLE: ICAP framework and adaptive scaffolding research  
TYPE: learning_science_reference  
PROVIDER: research/secondary  
URLS:
- https://arxiv.org/abs/2602.07308
- https://arxiv.org/abs/2602.16806
TRUST: medium  
REFRESH: medium  
MAPS_TO:
- lesson grammar
- interaction catalog
KEY_USE:
- active/constructive/interactive engagement.
- guided vs buggy examples based on prior knowledge.

## SOURCE_GAPS

[SI-GAP-001] Need more primary sources for eval/observability tooling if implementation becomes product-real.
[SI-GAP-002] Need more security/prompt-injection primary sources before Security Incident Room expansion.
[SI-GAP-003] Need official current docs if using specific OpenAI/Anthropic SDK APIs.
[SI-GAP-004] Need UI/game-inspired interaction research only if interaction design stalls.
