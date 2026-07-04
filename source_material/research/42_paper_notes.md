# /source_material/research/42_paper_notes.md

STATUS: RESEARCH_DOC  
LOAD_PRIORITY: WHEN_ADVANCED_CONCEPT_OR_PAPER_VISUAL_WORK  
PURPOSE: Compact paper notes mapped to architecture decisions. Not learner-facing content.

LAST_VERIFIED: 2026-06-13

## PAPER_NOTE_RULES

[PN-001] Include only papers that affect roadmap, visual atlas, or interactions.
[PN-002] Do not add math/details unless needed for interaction.
[PN-003] Each note must end in an app use and failure mode.
[PN-004] If a paper concept is advanced, keep it locked until prerequisites exist.
[PN-005] Paper visuals must map through 32_paper_visual_atlas.md.

## PAPER_NOTES

### PN-COLPALI — Visual Document Retrieval

SOURCE: SRC-COLPALI  
STATUS: use_in_advanced_retrieval  
ROADMAP_NODE: NODE-05-05  
CONCEPTS:
- CONCEPT-RET-008
- CONCEPT-RET-009

CORE_IDEA:
- Documents contain visual information beyond extracted text.
- Page-image embeddings can retrieve evidence from visually rich pages.
- Late interaction supports fine-grained matching.

SYSTEM_DECISION:
- Use visual/page-based retrieval when layout, tables, figures, forms, or page structure affect answer.

DO_NOT_TEACH_AS:
- universal replacement for text RAG.
- beginner retrieval default.

VISUAL_USE:
- PVA-006.
- document pages as cards.
- text-only retrieval miss vs visual retrieval hit.

INTERACTION_USE:
- Paper Figure Decoder.
- Retrieval Factory advanced scenario.

FAILURE_MODE:
- OCR/text-only pipeline misses evidence that exists visually.

TRANSFER_TASK:
- choose retrieval pipeline for slide deck, PDF table, source code docs, or plain text handbook.

### PN-LORA — Low-Rank Adaptation

SOURCE: SRC-LORA  
STATUS: advanced_optional  
ROADMAP_NODE: future_model_adaptation  
CONCEPTS:
- future CONCEPT-MODEL-ADAPTATION

CORE_IDEA:
- Freeze base model weights.
- Add trainable low-rank matrices.
- Reduce trainable parameters and memory cost vs full fine-tuning.

SYSTEM_DECISION:
- Consider model adaptation when behavior must be learned into model weights and cannot be solved well by prompting/RAG/tools.

DO_NOT_TEACH_AS:
- default fix for weak AI app behavior.
- core agent architecture concept.

VISUAL_USE:
- model adaptation decision map.
- base model frozen + small trainable adapter path.

INTERACTION_USE:
- Trade-off Duel: prompt/RAG/tool/fine-tune/LoRA decision.

FAILURE_MODE:
- fine-tuning chosen when missing retrieval/evals/tool design was actual issue.

TRANSFER_TASK:
- choose between RAG, prompt examples, tool call, fine-tune, or LoRA for domain-specific support bot.

### PN-DORA — Weight-Decomposed Low-Rank Adaptation

SOURCE: SRC-DORA  
STATUS: advanced_optional  
ROADMAP_NODE: future_model_adaptation  
CONCEPTS:
- future CONCEPT-MODEL-ADAPTATION

CORE_IDEA:
- Decompose pretrained weight into magnitude and direction.
- Use LoRA for directional updates.
- Attempts to improve learning capacity/stability while avoiding additional inference overhead.

SYSTEM_DECISION:
- Consider as advanced PEFT comparison after learner understands model adaptation trade-off.

DO_NOT_TEACH_AS:
- app-level architecture foundation.
- required knowledge for agent-driven dev.

VISUAL_USE:
- optional adapter comparison visual.

INTERACTION_USE:
- Advanced Trade-off Duel only.

FAILURE_MODE:
- chasing adaptation technique without knowing product/system need.

TRANSFER_TASK:
- decide whether model adaptation is justified by data, evaluation, deployment, and maintenance constraints.

### PN-STRUCTURED-OUTPUTS-BENCH — Constrained Decoding Evaluation

SOURCE: SRC-STRUCT-BENCH  
STATUS: supporting_advanced  
ROADMAP_NODE: NODE-03-03  
CONCEPTS:
- CONCEPT-TOOL-004
- CONCEPT-EVAL-002

CORE_IDEA:
- Constrained decoding improves schema compliance.
- Evaluation should consider efficiency, constraint coverage, and output quality.
- Schema compliance alone is not full task correctness.

SYSTEM_DECISION:
- Use structured outputs for machine contracts; still evaluate semantics.

DO_NOT_TEACH_AS:
- schema = truth.
- replacement for task evals.

VISUAL_USE:
- schema gate + semantic eval gate.

INTERACTION_USE:
- Constraint Puzzle.
- Eval Designer review.

FAILURE_MODE:
- valid structured output passes parser but fails user goal.

TRANSFER_TASK:
- design evals for tool output with valid schema but wrong business logic.

### PN-RETRIEVAL-TABLE-BENCH — Mixed Text/Table Retrieval

SOURCE: SRC-RETRIEVAL-TABLE-BENCH  
STATUS: supporting_advanced  
ROADMAP_NODE: NODE-05-03  
CONCEPTS:
- CONCEPT-RET-004
- CONCEPT-RET-005
- CONCEPT-RET-006

CORE_IDEA:
- Retrieval performance depends on corpus/query type.
- Hybrid retrieval + reranking can outperform single-stage methods in mixed text/table documents.
- Semantic search is not always superior to lexical retrieval.

SYSTEM_DECISION:
- Match retrieval strategy to evidence type and task metric.

DO_NOT_TEACH_AS:
- one benchmark proves universal best pipeline.

VISUAL_USE:
- side-by-side retrieval method results.

INTERACTION_USE:
- Retrieval Factory: exact numerical/table query scenario.

FAILURE_MODE:
- semantic-only retrieval misses precise identifiers/numbers/table facts.

TRANSFER_TASK:
- choose retrieval strategy for code errors, invoice tables, conceptual docs, and visual PDFs.

### PN-CLAUDE-CODE-DESIGN — Agent System Architecture Study

SOURCE: SRC-CLAUDE-CODE-DESIGN  
STATUS: optional_advanced_reference  
ROADMAP_NODE: NODE-09-03 or capstone  
CONCEPTS:
- CONCEPT-CTX-005
- CONCEPT-MEM-005
- CONCEPT-SEC-001
- CONCEPT-REPO-004

CORE_IDEA:
- Coding agents are small loops plus substantial surrounding systems for permissions, compaction, extensibility, storage, and context management.
- Use cautiously because it is a third-party analysis, not official product spec.

SYSTEM_DECISION:
- Teach that "agent loop" is not the whole system; surrounding control plane matters.

DO_NOT_TEACH_AS:
- official Claude Code architecture.
- current implementation guarantee.

VISUAL_USE:
- iceberg visual: loop visible, control systems underneath.

INTERACTION_USE:
- Repo Refactor Lab.
- Capstone Simulator.

FAILURE_MODE:
- focusing on agent loop while ignoring permissions, context compaction, memory, and control plane.

TRANSFER_TASK:
- identify which support systems a coding agent needs beyond plan-act-observe.
