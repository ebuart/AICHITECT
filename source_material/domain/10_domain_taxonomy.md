# /source_material/domain/10_domain_taxonomy.md

STATUS: DOMAIN_DOC  
LOAD_PRIORITY: WHEN_DOMAIN_OR_CONTENT_WORK  
PURPOSE: Compact concept taxonomy for AI Engineering curriculum. Do not use as prose content.

## TAXONOMY_RULES

[DT-001] Every concept must map to PC-030 before lesson implementation.
[DT-002] Use concept IDs in roadmap, lessons, visuals, interactions, and coverage matrix.
[DT-003] Prefer system-layer grouping over buzzword grouping.
[DT-004] Advanced concepts are valid only when tied to failure modes and decisions.
[DT-005] Keep learner-facing explanations out of this file.

## SOURCE_ANCHOR_KEYS

[SRC-ANT-AGENTS] Anthropic — Building Effective Agents.
[SRC-ANT-CTXRET] Anthropic — Contextual Retrieval.
[SRC-ANT-SUBAGENTS] Anthropic Docs — Claude Code Subagents.
[SRC-OAI-STRUCT] OpenAI — Structured Outputs / Constrained Decoding.
[SRC-MCP-INTRO] Model Context Protocol Docs — MCP Introduction.
[SRC-COLPALI] ColPali paper — Visual Document Retrieval with VLMs.

## SYSTEM_LAYERS

[LAYER-00] Foundations
ROLE: shared vocabulary, AI-native system framing, reliability mindset.

[LAYER-01] Context
ROLE: manage what the model sees, ignores, retrieves, compresses, remembers, and loses.

[LAYER-02] Tools
ROLE: define safe, testable, constrained interfaces between model and external world.

[LAYER-03] Control Flow
ROLE: decide when to use single calls, workflows, agents, routers, workers, evaluators.

[LAYER-04] Retrieval
ROLE: connect models to external knowledge through searchable, ranked, grounded evidence.

[LAYER-05] Memory
ROLE: preserve useful state across turns, sessions, users, repos, and agent boundaries.

[LAYER-06] Evaluation
ROLE: measure correctness, regression, grounding, task success, safety, cost, and latency.

[LAYER-07] Observability
ROLE: make agent behavior inspectable through traces, logs, metrics, events, and postmortems.

[LAYER-08] Security
ROLE: constrain permissions, data access, prompt injection risk, tool misuse, and human approval.

[LAYER-09] Repo Systems
ROLE: make AI-assisted development durable across files, sessions, agents, teams, and time.

[LAYER-10] Product Architecture
ROLE: connect AI capabilities to user value, UX constraints, operations, and governance.

## CONCEPTS_FOUNDATION

[CONCEPT-AIE-001] AI Engineering
LAYER: LAYER-00
STATUS: core
TEACH_AS: discipline of building reliable AI-native systems.
FAILURE: feature demos without reliability, evals, observability, or maintainability.
INTERACTIONS: Architecture Builder, Failure Mode Tree.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-AIE-002] Augmented LLM
LAYER: LAYER-00
STATUS: core
TEACH_AS: LLM + retrieval + tools + memory as base building block.
FAILURE: treating model as isolated chatbot.
INTERACTIONS: Architecture Builder.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-AIE-003] System Layer Thinking
LAYER: LAYER-00
STATUS: core
TEACH_AS: separate model, context, tools, retrieval, memory, evals, observability, security, repo.
FAILURE: fixing every issue with prompt tweaks.
INTERACTIONS: Layer Stack Builder, Failure Mode Tree.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-AIE-004] Simplicity Before Agency
LAYER: LAYER-00
STATUS: core
TEACH_AS: use simplest system that meets measurable need.
FAILURE: unnecessary multi-agent complexity increases cost, latency, and compounding errors.
INTERACTIONS: Trade-off Duel, Architecture Builder.
SOURCE: SRC-ANT-AGENTS

## CONCEPTS_CONTEXT

[CONCEPT-CTX-001] Context Window
LAYER: LAYER-01
STATUS: core
TEACH_AS: finite working memory of current model call/session.
FAILURE: relevant constraints missing or buried in noise.
INTERACTIONS: Context Budget Board.

[CONCEPT-CTX-002] Context Budget
LAYER: LAYER-01
STATUS: core
TEACH_AS: allocate tokens to instructions, task, source material, retrieved evidence, history, outputs.
FAILURE: too much low-value context suppresses high-value signal.
INTERACTIONS: Context Budget Board.

[CONCEPT-CTX-003] Context Noise
LAYER: LAYER-01
STATUS: core
TEACH_AS: irrelevant or conflicting context reduces reliability.
FAILURE: agent follows stale or irrelevant instructions.
INTERACTIONS: Context Budget Board, Trace Debugger.

[CONCEPT-CTX-004] Context Compression
LAYER: LAYER-01
STATUS: core
TEACH_AS: summarize durable state without losing decision-critical information.
FAILURE: lossy summaries remove constraints and rationale.
INTERACTIONS: Repo Refactor Lab, Context Budget Board.

[CONCEPT-CTX-005] Context Isolation
LAYER: LAYER-01
STATUS: advanced_core
TEACH_AS: move noisy exploration into isolated worker/subagent context.
FAILURE: main context flooded by logs, search results, file dumps.
INTERACTIONS: Agent Trace Debugger, Architecture Builder.
SOURCE: SRC-ANT-SUBAGENTS

[CONCEPT-CTX-006] Prompt Caching
LAYER: LAYER-01
STATUS: advanced
TEACH_AS: reuse stable context to reduce cost/latency when provider supports it.
FAILURE: repeated full context increases cost and latency.
INTERACTIONS: Cost/Latency Trade-off Duel.
SOURCE: SRC-ANT-CTXRET

## CONCEPTS_TOOLS

[CONCEPT-TOOL-001] Tool Boundary
LAYER: LAYER-02
STATUS: core
TEACH_AS: explicit permission and capability boundary around external actions.
FAILURE: model can perform unsafe, broad, or ambiguous actions.
INTERACTIONS: Tool Contract Forge, Security Incident Room.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-TOOL-002] Agent-Computer Interface
LAYER: LAYER-02
STATUS: core
TEACH_AS: tool definitions need HCI-level design quality for agents.
FAILURE: ambiguous parameters cause wrong tool calls or brittle behavior.
INTERACTIONS: Tool Contract Forge.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-TOOL-003] Structured Output
LAYER: LAYER-02
STATUS: core
TEACH_AS: force machine-readable outputs for downstream systems.
FAILURE: parser breaks, retries increase, hidden format drift.
INTERACTIONS: Tool Contract Forge, Constraint Puzzle.
SOURCE: SRC-OAI-STRUCT

[CONCEPT-TOOL-004] Constrained Decoding
LAYER: LAYER-02
STATUS: advanced_core
TEACH_AS: constrain generation to a schema/grammar when supported.
FAILURE: valid-looking but non-conforming outputs.
INTERACTIONS: Constraint Puzzle.
SOURCE: SRC-OAI-STRUCT

[CONCEPT-TOOL-005] MCP
LAYER: LAYER-02
STATUS: advanced_core
TEACH_AS: standard protocol for connecting AI apps to external systems/tools/data.
FAILURE: ad-hoc integrations without consistent contracts or permission models.
INTERACTIONS: Tool Contract Forge, Architecture Builder.
SOURCE: SRC-MCP-INTRO

## CONCEPTS_CONTROL_FLOW

[CONCEPT-CF-001] Workflow vs Agent
LAYER: LAYER-03
STATUS: core
TEACH_AS: workflows follow predefined paths; agents dynamically decide process/tool use.
FAILURE: using autonomous agents where predictable workflow is safer.
INTERACTIONS: Trade-off Duel, Agent Trace Debugger.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-002] Prompt Chaining
LAYER: LAYER-03
STATUS: core
TEACH_AS: split deterministic multi-step tasks into smaller calls with gates.
FAILURE: one large call handles too many concerns.
INTERACTIONS: Architecture Builder.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-003] Routing
LAYER: LAYER-03
STATUS: core
TEACH_AS: classify inputs and send to specialized paths.
FAILURE: one prompt optimized for all cases performs poorly for edge cases.
INTERACTIONS: Architecture Builder.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-004] Parallelization
LAYER: LAYER-03
STATUS: core
TEACH_AS: independent subtasks or multiple perspectives run in parallel.
FAILURE: unnecessary serial latency or missed independent checks.
INTERACTIONS: Architecture Builder.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-005] Orchestrator-Worker
LAYER: LAYER-03
STATUS: core
TEACH_AS: central controller delegates dynamic subtasks to workers.
FAILURE: main agent handles too many files/sources itself.
INTERACTIONS: Agent Trace Debugger, Architecture Builder.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-006] Evaluator-Optimizer
LAYER: LAYER-03
STATUS: core
TEACH_AS: generator/evaluator loop when measurable improvement criteria exist.
FAILURE: self-improvement loop without criteria becomes noise.
INTERACTIONS: Eval Designer, Trace Debugger.
SOURCE: SRC-ANT-AGENTS

[CONCEPT-CF-007] Autonomous Agent Loop
LAYER: LAYER-03
STATUS: advanced_core
TEACH_AS: plan-act-observe loop with tools, environment feedback, stopping rules, human checkpoints.
FAILURE: compounding errors, runaway loops, unclear stop conditions.
INTERACTIONS: Agent Trace Debugger, Security Incident Room.
SOURCE: SRC-ANT-AGENTS

## CONCEPTS_RETRIEVAL

[CONCEPT-RET-001] RAG
LAYER: LAYER-04
STATUS: core
TEACH_AS: retrieve relevant external evidence before generation.
FAILURE: model answers from stale or insufficient internal knowledge.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-002] Chunking
LAYER: LAYER-04
STATUS: core
TEACH_AS: split corpus into retrievable units.
FAILURE: chunks lose document context or split critical information.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-003] Embeddings
LAYER: LAYER-04
STATUS: core
TEACH_AS: semantic retrieval through vector similarity.
FAILURE: misses exact identifiers or rare technical strings.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-004] BM25
LAYER: LAYER-04
STATUS: core
TEACH_AS: lexical retrieval for exact terms, identifiers, error codes.
FAILURE: semantic-only search misses exact matches.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-005] Hybrid Search
LAYER: LAYER-04
STATUS: core
TEACH_AS: combine semantic and lexical retrieval.
FAILURE: single retrieval method misses important evidence.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-006] Reranking
LAYER: LAYER-04
STATUS: core
TEACH_AS: second-stage ranking improves top-k evidence quality.
FAILURE: retrieved candidates contain answer but top context is weak.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-007] Contextual Retrieval
LAYER: LAYER-04
STATUS: advanced_core
TEACH_AS: add document-specific context to chunks before indexing.
FAILURE: isolated chunks lack enough context to be retrieved.
INTERACTIONS: Retrieval Factory.
SOURCE: SRC-ANT-CTXRET

[CONCEPT-RET-008] Visual Document Retrieval
LAYER: LAYER-04
STATUS: advanced
TEACH_AS: retrieve page images directly when layout/tables/figures matter.
FAILURE: OCR/text extraction loses visual structure.
INTERACTIONS: Paper Figure Decoder, Retrieval Factory.
SOURCE: SRC-COLPALI

[CONCEPT-RET-009] Late Interaction Retrieval
LAYER: LAYER-04
STATUS: advanced
TEACH_AS: compare multiple query/document vectors for richer matching.
FAILURE: single-vector retrieval loses fine-grained evidence matching.
INTERACTIONS: Paper Figure Decoder.
SOURCE: SRC-COLPALI

## CONCEPTS_MEMORY

[CONCEPT-MEM-001] Session Memory
LAYER: LAYER-05
STATUS: core
TEACH_AS: state available within current conversation/session.
FAILURE: temporary state confused with durable project memory.
INTERACTIONS: Context Budget Board.

[CONCEPT-MEM-002] Project Memory
LAYER: LAYER-05
STATUS: core
TEACH_AS: durable repo/file-based state for long-running work.
FAILURE: repeated rediscovery, lost decisions, scope drift.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-MEM-003] Decision Log
LAYER: LAYER-05
STATUS: core
TEACH_AS: store rationale for architecture choices.
FAILURE: team/agent cannot explain why structure exists.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-MEM-004] Feature Ledger
LAYER: LAYER-05
STATUS: core
TEACH_AS: compact implemented-feature history.
FAILURE: repeated or conflicting implementation.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-MEM-005] Agent Learning Loop
LAYER: LAYER-05
STATUS: advanced_core
TEACH_AS: capture recurring mistakes/patterns into durable process rules.
FAILURE: same agent/process error repeats across sessions.
INTERACTIONS: Repo Refactor Lab, Eval Designer.

## CONCEPTS_EVAL_OBSERVABILITY

[CONCEPT-EVAL-001] Eval Harness
LAYER: LAYER-06
STATUS: core
TEACH_AS: repeatable tests for AI behavior and regressions.
FAILURE: no evidence that system improved or stayed correct.
INTERACTIONS: Eval Designer.

[CONCEPT-EVAL-002] Task Success Metric
LAYER: LAYER-06
STATUS: core
TEACH_AS: measure whether the user/system goal was achieved.
FAILURE: measure formatting but not correctness/usefulness.
INTERACTIONS: Eval Designer.

[CONCEPT-EVAL-003] Grounding Evaluation
LAYER: LAYER-06
STATUS: core
TEACH_AS: check claims against retrieved/source evidence.
FAILURE: plausible unsupported answers.
INTERACTIONS: Eval Designer, Retrieval Factory.

[CONCEPT-EVAL-004] Regression Set
LAYER: LAYER-06
STATUS: core
TEACH_AS: preserve examples that must keep working.
FAILURE: new prompt/model/version breaks old behavior unnoticed.
INTERACTIONS: Eval Designer.

[CONCEPT-OBS-001] Trace
LAYER: LAYER-07
STATUS: core
TEACH_AS: inspect model calls, retrieval, tools, decisions, errors.
FAILURE: impossible to debug why agent failed.
INTERACTIONS: Agent Trace Debugger.

[CONCEPT-OBS-002] Postmortem
LAYER: LAYER-07
STATUS: core
TEACH_AS: convert failure into system rule/change.
FAILURE: incidents become anecdotes, not architecture improvements.
INTERACTIONS: System Postmortem, Security Incident Room.

## CONCEPTS_SECURITY

[CONCEPT-SEC-001] Least Privilege
LAYER: LAYER-08
STATUS: core
TEACH_AS: give tools/agents minimum required permissions.
FAILURE: harmless task gets dangerous access.
INTERACTIONS: Tool Contract Forge, Security Incident Room.

[CONCEPT-SEC-002] Human Approval Gate
LAYER: LAYER-08
STATUS: core
TEACH_AS: require human confirmation for high-impact actions.
FAILURE: agent executes irreversible or costly actions.
INTERACTIONS: Security Incident Room.

[CONCEPT-SEC-003] Prompt Injection
LAYER: LAYER-08
STATUS: core
TEACH_AS: untrusted content can attempt to override instructions or tool use.
FAILURE: retrieved docs/web pages manipulate agent behavior.
INTERACTIONS: Security Incident Room, Retrieval Factory.

[CONCEPT-SEC-004] Sandboxing
LAYER: LAYER-08
STATUS: core
TEACH_AS: execute risky actions in constrained environments.
FAILURE: agent side effects damage real systems.
INTERACTIONS: Security Incident Room.

## CONCEPTS_REPO_SYSTEMS

[CONCEPT-REPO-001] Repo Legibility
LAYER: LAYER-09
STATUS: core
TEACH_AS: repo structure makes project understandable to humans and agents.
FAILURE: agents repeatedly misread architecture.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-REPO-002] Conventions
LAYER: LAYER-09
STATUS: core
TEACH_AS: stable file/function/component rules.
FAILURE: large files, inconsistent patterns, hard-to-refactor system.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-REPO-003] Small Components
LAYER: LAYER-09
STATUS: core
TEACH_AS: split UI/logic/content into maintainable units.
FAILURE: monster components become untestable and agent-hostile.
INTERACTIONS: Repo Refactor Lab.

[CONCEPT-REPO-004] Source Material OS
LAYER: LAYER-09
STATUS: advanced_core
TEACH_AS: docs operate as control plane for multi-session agent development.
FAILURE: long project loses constraints and decisions.
INTERACTIONS: Repo Refactor Lab, Capstone Simulator.

## CONCEPTS_PRODUCT_ARCHITECTURE

[CONCEPT-PROD-001] AI Product Fit
LAYER: LAYER-10
STATUS: core
TEACH_AS: use AI where uncertainty/flexibility creates value.
FAILURE: AI added where deterministic UI/workflow is better.
INTERACTIONS: Trade-off Duel.

[CONCEPT-PROD-002] Cost/Latency/Quality Trade-off
LAYER: LAYER-10
STATUS: core
TEACH_AS: architecture decisions change performance, cost, and UX.
FAILURE: accurate system too slow/expensive or cheap system unreliable.
INTERACTIONS: Trade-off Duel, Eval Designer.

[CONCEPT-PROD-003] Governance
LAYER: LAYER-10
STATUS: advanced_core
TEACH_AS: operational rules for safe deployment and team ownership.
FAILURE: unclear responsibility, unreviewed changes, uncontrolled data/tool access.
INTERACTIONS: Security Incident Room, Capstone Simulator.
