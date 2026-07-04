# /source_material/visuals/32_paper_visual_atlas.md

STATUS: VISUAL_DOC  
LOAD_PRIORITY: WHEN_PAPER_VISUAL_OR_ADVANCED_CONTENT  
PURPOSE: Map research/source visuals to original educational recreations. Not a research dump.

## ATLAS_RULES

[PVA-001] Do not copy paper/source figures directly.
[PVA-002] Recreate the architecture idea in original, simplified educational form.
[PVA-003] Every paper visual must connect to practical system decision.
[PVA-004] Every atlas entry must define when the idea applies and when it does not.
[PVA-005] Use source anchors from domain taxonomy.
[PVA-006] Do not expose raw paper complexity unless lesson mode requires it.
[PVA-007] Paper visuals enter implementation only after visual primitives are stable.
[PVA-008] Add every implemented paper visual to `/visual-lab`.

## ENTRY_SCHEMA

```txt
PVA-ID:
SOURCE_ANCHOR:
CONCEPT_IDS:
ROADMAP_NODE:
VISUAL_TYPE:
ORIGINAL_IDEA:
TEACHES:
RECREATE_AS:
INTERACTION:
APPLIES_WHEN:
DOES_NOT_APPLY_WHEN:
FAILURE_MODE:
IMPLEMENTATION_RISK:
FALLBACK:
```

## ATLAS_ENTRIES

### PVA-001 — Augmented LLM as Base Unit

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONCEPT_IDS:
- CONCEPT-AIE-002
- CONCEPT-AIE-003
ROADMAP_NODE: NODE-01-01  
VISUAL_TYPE: VTYPE-AUGMENTED-LLM-MAP

ORIGINAL_IDEA:
- Modern agentic systems often compose LLMs with tools, retrieval, and memory.

TEACHES:
- The model is only one component.
- Reliability comes from surrounding architecture.

RECREATE_AS:
- central Model node
- adjacent Context, Tools, Retrieval, Memory nodes
- Eval/Observability feedback loop
- Security boundary around side-effecting tools

INTERACTION:
- Architecture Builder intro.

APPLIES_WHEN:
- explaining base AI system structure.
- diagnosing "prompt-only" thinking.

DOES_NOT_APPLY_WHEN:
- task is deterministic and needs no LLM.
- app feature is pure UI/business logic.

FAILURE_MODE:
- treating LLM as entire system.

IMPLEMENTATION_RISK:
- visual may imply all systems need all modules.

FALLBACK:
- stacked list of modules with role and optionality.

### PVA-002 — Workflow Patterns

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONCEPT_IDS:
- CONCEPT-CF-002
- CONCEPT-CF-003
- CONCEPT-CF-004
- CONCEPT-CF-005
- CONCEPT-CF-006
ROADMAP_NODE: NODE-04-02  
VISUAL_TYPE: VTYPE-WORKFLOW-VS-AGENT

ORIGINAL_IDEA:
- Common agentic workflow patterns include prompt chaining, routing, parallelization, orchestrator-worker, and evaluator-optimizer.

TEACHES:
- Many "agent" systems are better understood as controlled workflow patterns.
- Pattern choice follows task shape.

RECREATE_AS:
- pattern cards with miniature flow diagrams.
- scenario card asks which pattern fits.

INTERACTION:
- Architecture Builder.
- Trade-off Duel.

APPLIES_WHEN:
- task has known structure or separable subtasks.

DOES_NOT_APPLY_WHEN:
- task requires long autonomous exploration with unknown steps.

FAILURE_MODE:
- using autonomous agents for predictable workflows.

IMPLEMENTATION_RISK:
- too many pattern diagrams on mobile.

FALLBACK:
- one pattern per card with "use when / failure if misused".

### PVA-003 — Workflow vs Agent Control Difference

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONCEPT_IDS:
- CONCEPT-CF-001
- CONCEPT-CF-007
ROADMAP_NODE: NODE-04-01  
VISUAL_TYPE: VTYPE-WORKFLOW-VS-AGENT

ORIGINAL_IDEA:
- Workflows follow predefined code paths; agents dynamically decide process and tool use.

TEACHES:
- Agency increases flexibility and risk.
- Control path is architecture choice.

RECREATE_AS:
- split screen:
  - left: fixed workflow chain
  - right: plan-act-observe loop
- show evaluation/control checkpoints.

INTERACTION:
- Trade-off Duel.

APPLIES_WHEN:
- choosing between predictable and dynamic task execution.

DOES_NOT_APPLY_WHEN:
- the system does not need model-driven decisions.

FAILURE_MODE:
- dynamic agent used without stop conditions or observability.

IMPLEMENTATION_RISK:
- user may assume agents are "higher level" upgrade.

FALLBACK:
- comparison table.

### PVA-004 — Contextual Retrieval

SOURCE_ANCHOR: SRC-ANT-CTXRET  
CONCEPT_IDS:
- CONCEPT-RET-002
- CONCEPT-RET-007
ROADMAP_NODE: NODE-05-04  
VISUAL_TYPE: VTYPE-RETRIEVAL-PIPELINE

ORIGINAL_IDEA:
- Chunks can lose document context; adding contextual descriptions before indexing improves retrieval.

TEACHES:
- Retrieval quality depends on what the indexed chunk knows about its source.

RECREATE_AS:
- side-by-side:
  - plain chunk indexed alone
  - same chunk with contextual prefix/metadata
- query retrieves contextualized chunk.

INTERACTION:
- Retrieval Factory.

APPLIES_WHEN:
- chunks depend on surrounding document/section.
- corpus has repeated entities, sections, or ambiguous references.

DOES_NOT_APPLY_WHEN:
- documents are already atomic and self-contained.
- extra context would add noise/cost without benefit.

FAILURE_MODE:
- isolated chunks cannot be retrieved or are misinterpreted.

IMPLEMENTATION_RISK:
- visual might be too text-heavy.

FALLBACK:
- 3-step cards: chunk -> add context -> retrieve better.

### PVA-005 — Hybrid Search + Reranking

SOURCE_ANCHOR: SRC-ANT-CTXRET  
CONCEPT_IDS:
- CONCEPT-RET-003
- CONCEPT-RET-004
- CONCEPT-RET-005
- CONCEPT-RET-006
ROADMAP_NODE: NODE-05-03  
VISUAL_TYPE: VTYPE-RETRIEVAL-PIPELINE

ORIGINAL_IDEA:
- Combine semantic and lexical retrieval; rerank candidates to improve top-k context.

TEACHES:
- Single retrieval method is often insufficient.
- Reranking improves evidence quality after broad recall.

RECREATE_AS:
- two retrieval streams merge into candidate pool.
- reranker filters top evidence.
- show missed exact identifier in semantic-only path.

INTERACTION:
- Retrieval Factory.

APPLIES_WHEN:
- mixed queries with semantic meaning and exact identifiers.
- noisy corpus.

DOES_NOT_APPLY_WHEN:
- tiny corpus or simple exact lookup.

FAILURE_MODE:
- answer misses exact code/API/legal term or uses weak evidence.

IMPLEMENTATION_RISK:
- pipeline may become visually dense.

FALLBACK:
- stage cards with before/after retrieved results.

### PVA-006 — Visual Document Retrieval / ColPali-style

SOURCE_ANCHOR: SRC-COLPALI  
CONCEPT_IDS:
- CONCEPT-RET-008
- CONCEPT-RET-009
ROADMAP_NODE: NODE-05-05  
VISUAL_TYPE: VTYPE-PAPER-FIGURE-RECREATION

ORIGINAL_IDEA:
- Page images can be embedded and retrieved directly; useful when layout, tables, figures, and visual structure matter.

TEACHES:
- OCR/text-only RAG can lose visual evidence.
- Visual retrieval is system choice for visually rich documents.

RECREATE_AS:
- document pages as visual cards
- query card
- page-level embedding/index
- scoring heatmap/selection
- compare text-only miss vs visual hit

INTERACTION:
- Paper Figure Decoder.
- Retrieval Factory advanced variant.

APPLIES_WHEN:
- PDFs/slides/forms/tables/figures/layout-heavy docs.
- user asks about visual arrangement or table/figure content.

DOES_NOT_APPLY_WHEN:
- clean plain text docs.
- cost/latency constraints dominate and visual evidence not needed.

FAILURE_MODE:
- text extraction misses table/figure/layout evidence.

IMPLEMENTATION_RISK:
- heatmap/page visuals may be hard to render cleanly on mobile.

FALLBACK:
- simple page cards with "text-only missed / visual retrieval found".

### PVA-007 — Structured Outputs and Constrained Decoding

SOURCE_ANCHOR: SRC-OAI-STRUCT  
CONCEPT_IDS:
- CONCEPT-TOOL-003
- CONCEPT-TOOL-004
ROADMAP_NODE: NODE-03-02  
VISUAL_TYPE: VTYPE-TOOL-BOUNDARY-MAP

ORIGINAL_IDEA:
- Model outputs can be constrained to match a developer-defined schema.

TEACHES:
- Parseability is a system contract.
- Schema validity does not equal semantic correctness.

RECREATE_AS:
- model output passes through schema gate.
- valid structure then passes/fails semantic eval.
- show invalid JSON, valid-but-wrong JSON, valid-and-correct JSON.

INTERACTION:
- Constraint Puzzle.
- Eval Designer later review.

APPLIES_WHEN:
- downstream code expects structured data.
- tool calls or workflows need reliable fields.

DOES_NOT_APPLY_WHEN:
- creative free-form generation where strict schema harms task.
- semantic correctness cannot be encoded structurally.

FAILURE_MODE:
- parser breaks or wrong semantic answer passes as valid format.

IMPLEMENTATION_RISK:
- user may overvalue schemas as truth guarantee.

FALLBACK:
- three output cards: invalid format, valid/wrong, valid/correct.

### PVA-008 — MCP Tool/Data Connector Model

SOURCE_ANCHOR: SRC-MCP-INTRO  
CONCEPT_IDS:
- CONCEPT-TOOL-005
ROADMAP_NODE: NODE-03-04  
VISUAL_TYPE: VTYPE-TOOL-BOUNDARY-MAP

ORIGINAL_IDEA:
- Standardized protocol connects AI apps to external tools/data sources.

TEACHES:
- Tool ecosystems need stable contracts and boundaries.
- Integration architecture matters beyond one-off function calls.

RECREATE_AS:
- AI app/client
- MCP server boundary
- external tools/data
- permissions and schemas
- approval/security wrapper

INTERACTION:
- Tool Contract Forge.
- Architecture Builder.

APPLIES_WHEN:
- AI app needs multiple external systems.
- tool/data connectors should be reusable and standardized.

DOES_NOT_APPLY_WHEN:
- simple internal function call is enough.
- integration is deterministic and not AI-facing.

FAILURE_MODE:
- ad-hoc tool sprawl without consistent permission/contract model.

IMPLEMENTATION_RISK:
- overcomplicate beginner tool lesson.

FALLBACK:
- client-server-tool stack cards.

### PVA-009 — Subagents and Context Isolation

SOURCE_ANCHOR: SRC-ANT-SUBAGENTS  
CONCEPT_IDS:
- CONCEPT-CTX-005
- CONCEPT-CF-005
ROADMAP_NODE: NODE-02-04  
VISUAL_TYPE: VTYPE-ORCHESTRATOR-WORKER

ORIGINAL_IDEA:
- Subagents can work in separate contexts and return compact results.

TEACHES:
- Isolation can reduce main-context noise.
- Delegation must define return contract.

RECREATE_AS:
- main agent with compact hot context
- subagent explores noisy logs/files
- subagent returns summary/evidence
- raw noise does not enter main context

INTERACTION:
- Agent Trace Debugger.
- Architecture Builder.

APPLIES_WHEN:
- exploration is noisy or specialized.
- main task needs only distilled results.

DOES_NOT_APPLY_WHEN:
- task is simple and delegation overhead dominates.
- subagent output cannot be verified.

FAILURE_MODE:
- main context flooded or subagent returns unstructured noise.

IMPLEMENTATION_RISK:
- user may add subagents everywhere.

FALLBACK:
- before/after context item list.

### PVA-010 — Eval Loop / Evaluator-Optimizer

SOURCE_ANCHOR: SRC-ANT-AGENTS  
CONCEPT_IDS:
- CONCEPT-CF-006
- CONCEPT-EVAL-001
- CONCEPT-EVAL-002
ROADMAP_NODE: NODE-04-04  
VISUAL_TYPE: VTYPE-EVAL-LOOP

ORIGINAL_IDEA:
- Generator/evaluator loop improves outputs when evaluation criteria exist.

TEACHES:
- Improvement loops need measurable feedback.
- "Self-critique" without criteria is weak.

RECREATE_AS:
- generator output
- evaluator checks
- optimizer revision
- stop condition
- regression guard

INTERACTION:
- Eval Designer.
- Agent Trace Debugger.

APPLIES_WHEN:
- quality criteria can be checked.
- iteration improves output.

DOES_NOT_APPLY_WHEN:
- no reliable evaluator exists.
- loop cost/latency unacceptable.

FAILURE_MODE:
- endless/self-reinforcing loop without objective improvement.

IMPLEMENTATION_RISK:
- diagram could imply automatic correctness.

FALLBACK:
- loop cards with "requires criteria" warning.
