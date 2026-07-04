# /source_material/progress/CONTENT_COVERAGE_MATRIX.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: WHEN_CONTENT_CHANGES  
PURPOSE: Track concept coverage and prevent buzzword drift.

## FORMAT_RULES

[CCM-001] Every concept must map to PC-030.
[CCM-002] Keep entries compact.
[CCM-003] Use IDs, not long prose.
[CCM-004] Add entries before or during content implementation.
[CCM-005] Mark missing fields honestly.

## FIELD_VALUES

COVERAGE_STATUS:
- planned
- drafted
- implemented
- needs_interaction
- needs_visual
- needs_review
- complete
- deferred

CHECK_VALUES:
- yes
- no
- partial
- n/a

## MATRIX

| concept_id | roadmap_node | status | layer | use_case | failure_mode | tradeoff | visual | interaction | transfer | notes |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| CONCEPT-AIE-001 | NODE-00-01 | implemented | yes | yes | yes | partial | yes | yes | yes | task-first; systemRow visual; eval/observability feedback. |
| CONCEPT-AIE-003 | NODE-00-02 | implemented | yes | yes | yes | partial | yes | yes | yes | worked-trace; trace + layerStack; symptom vs root cause. |
| CONCEPT-AIE-002 | NODE-01-01 | implemented | yes | yes | partial | yes | yes | yes | yes | term-first; systemRow; retrieval vs memory decision. |
| CONCEPT-AIE-004 / CONCEPT-PROD-001 | NODE-01-02 | implemented | yes | yes | yes | yes | yes | yes | yes | trade-off; decisionPair; overengineered-agents feedback. |
| CONCEPT-AIE-003 (layers) | NODE-01-03 | implemented | yes | yes | yes | yes | yes | yes | partial | multiple-viewpoints; 8-layer layerStack; classify failure by layer. |
| CONCEPT-CTX-001 / CONCEPT-CTX-002 | NODE-02-01 | implemented | yes | yes | yes | yes | yes | yes | yes | term-first; tokenBudget; Context Budget Board lab. |
| CONCEPT-CTX-003 | NODE-02-02 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; over-budget noise; CBB + Failure Mode Tree labs. |
| CONCEPT-CTX-004 | NODE-02-03 | implemented | yes | yes | yes | yes | yes | yes | partial | worked-trace; compression keeps constraints+rationale. |
| CONCEPT-CTX-005 | NODE-02-04 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-trace; orchestrator-worker trace; Agent Trace Debugger lab. |
| CONCEPT-TOOL-001/002 | NODE-03-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; Tool Contract Forge lab. |
| CONCEPT-TOOL-003 | NODE-03-02 | implemented | yes | yes | yes | yes | yes | yes | partial | worked-trace; parse-fail flow. |
| CONCEPT-TOOL-004 | NODE-03-03 | implemented | yes | yes | yes | yes | yes | yes | partial | term-first; format ≠ semantics. |
| CONCEPT-TOOL-005 | NODE-03-04 | implemented | yes | yes | yes | yes | yes | yes | partial | multiple-viewpoints; MCP vs ad-hoc; Architecture Builder lab. |
| CONCEPT-CF-001 | NODE-04-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; decisionPair; overengineered-agents feedback. |
| CONCEPT-CF-002/003/004 | NODE-04-02 | implemented | yes | yes | yes | yes | yes | yes | partial | multiple-viewpoints; chaining/routing/parallel. |
| CONCEPT-CF-005 | NODE-04-03 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-trace; orchestrator-worker; context-noise feedback. |
| CONCEPT-CF-006 | NODE-04-04 | implemented | yes | yes | yes | yes | yes | yes | partial | worked-trace; evaluator-optimizer needs criteria. |
| CONCEPT-CF-007 | NODE-04-05 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-trace; plan-act-observe + stop conditions. |
| CONCEPT-RET-001/002/003 | NODE-05-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; RAG flow; Retrieval Factory lab built (FL-0019). |
| CONCEPT-RET-003/004 | NODE-05-02 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; decisionPair; lexical/BM25 vs semantic for exact identifiers. |
| CONCEPT-RET-005/006 | NODE-05-03 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-trace; two-stage flow; hybrid recall + reranking precision. |
| CONCEPT-RET-007 | NODE-05-04 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; flow; per-chunk doc-context vs bigger chunks. |
| CONCEPT-RET-008/009 | NODE-05-05 | implemented | yes | yes | yes | yes | yes | yes | yes | paper-figure-decoder; decisionPair; page-image vs text/OCR; Paper Figure Decoder lab (FL-0023). |
| CONCEPT-EVAL-001 | NODE-07-01 | implemented | yes | yes | yes | yes | yes | yes | yes | term-first; task-success vs format-only; Eval Designer lab built (FL-0020). |
| CONCEPT-EVAL-002/004 | NODE-07-02 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; flow; regression-set vs manual spot-check (silent regression). |
| CONCEPT-EVAL-003 | NODE-07-03 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-trace; flow; claim-vs-source grounding vs fluency trust. |
| CONCEPT-OBS-001/002 | NODE-07-04 | implemented | yes | yes | yes | yes | yes | yes | yes | trace-first; trace primitive; root cause → durable postmortem rule. |
| CONCEPT-MEM-001/002 | NODE-06-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; session vs durable file memory. |
| CONCEPT-MEM-003/004 | NODE-06-02 | implemented | yes | yes | yes | yes | yes | yes | partial | worked-example; decision log + feature ledger. |
| CONCEPT-MEM-005 | NODE-06-03 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; recurring failure → durable rule. |
| CONCEPT-REPO-004 | NODE-06-04 | implemented | yes | yes | yes | yes | yes | yes | yes | multiple-viewpoints; control plane; doc-duplication feedback. |
| CONCEPT-SEC-001 | NODE-08-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; least privilege; broad-permission feedback. |
| CONCEPT-SEC-002 | NODE-08-02 | implemented | yes | yes | yes | yes | yes | yes | partial | task-first; approval gate flow; high-impact only. |
| CONCEPT-SEC-003 | NODE-08-03 | implemented | yes | yes | yes | yes | yes | yes | yes | incident-first; injection trace; untrusted-data defense. |
| CONCEPT-SEC-004/PROD-003 | NODE-08-04 | implemented | yes | yes | yes | yes | yes | yes | partial | multiple-viewpoints; sandbox + governance layers. |
| CONCEPT-REPO-001 | NODE-09-01 | implemented | yes | yes | yes | yes | yes | yes | yes | task-first; decisionPair; legible structure vs prompt-patching. |
| CONCEPT-REPO-002/003 | NODE-09-02 | implemented | yes | yes | yes | yes | yes | yes | yes | refactor-first; decisionPair; split monster-file before extending. |
| CONCEPT-REPO-004 | NODE-09-03 | implemented | yes | yes | yes | yes | yes | yes | yes | worked-example; flow; doc-OS operating protocol + conflict-by-priority (distinct from 06-04). |
| CONCEPT-PROD-003 | NODE-09-04 | implemented | yes | yes | yes | yes | yes | yes | yes | multiple-viewpoints; systemRow; team ownership vs tribal knowledge (distinct from 08-04). |
| all_core | NODE-10-01 | implemented | yes | yes | yes | yes | yes | yes | yes | scenario-first; layerStack of integrated layers; capstone framing (PC-042), references all arcs. |
| all_core | NODE-10-02 | implemented | yes | yes | yes | yes | yes | yes | yes | architecture-builder; Capstone Simulator (6-layer integrated design, FL-0026); base full vs prototype transfer. |
| all_core | NODE-10-03 | implemented | yes | yes | yes | yes | yes | yes | yes | incident-first; trace; injected retrieval→injection→tool failure; integrated fix (FL-0027). |
| all_core | NODE-10-04 | implemented | yes | yes | yes | yes | yes | yes | yes | eval-first; flow; incident→regression + grounding + approval-governance (FL-0027). |
| all_core | NODE-10-05 | implemented | yes | yes | yes | yes | yes | yes | yes | postmortem; layerStack; defend with trade-offs + failure modes (FL-0027). |

DONE: full curriculum chain ARC-00..ARC-09 lesson-covered — Foundations..Agents (00-04) + Retrieval
(05-01..05-05, incl. Visual Document Retrieval) + Memory (06) + Evals/Observability (07) + Security (08)
+ Repo & Conventions (09). 39 lessons. PHASE_6 advanced labs all built (PH-701); 4 secondary catalog lab
bindings still "Lab folgt" (not phase-required, OQ-0009).
PENDING: none — curriculum COMPLETE. Every roadmap node NODE-00-01..10-05 maps to a PC-030 row above (43 lessons).
Remaining V1 work is PHASE_9 hardening/release (QA + polish), not new concepts.
PHASE_5 curriculum exit (PH-605) met: every node ARC-00..09 maps to a PC-030 row above.

## COVERAGE_GAPS

RESOLVED (2026-06-13):
- Domain taxonomy exists (domain/10) and 44-node roadmap graph is modeled as data (`src/content/roadmap`).
- Visual primitive IDs exist and are built (VIS-*; see VISUAL_QA_LOG).

HIGH_PRIORITY_GAPS:
- Interaction registry + scoring engines not built (PHASE_4) — in-lesson decisions are lightweight.
- Curriculum beyond the 5-node slice not authored (PHASE_5).

NEXT_CONTENT_ACTION:
- PHASE_4: build core interaction engines; then PHASE_5 expand lessons against the domain graph,
  adding a matrix row per new concept (CW-060).
