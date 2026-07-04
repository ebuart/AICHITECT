# /source_material/domain/12_roadmap_dependencies.md

STATUS: DOMAIN_DOC  
LOAD_PRIORITY: WHEN_ROADMAP_LOGIC_OR_CONTENT_ORDER  
PURPOSE: Machine-readable prerequisite, unlock, review, and lab-binding rules.

## DEPENDENCY_RULES

[RD-001] Do not unlock a node until all prerequisite nodes are complete.
[RD-002] Review tasks may reference only completed nodes unless explicitly marked PREVIEW.
[RD-003] Labs may be introduced only after their prerequisite concepts exist.
[RD-004] Advanced lab variants may reuse earlier lab engines with new constraints.
[RD-005] Do not add content that bypasses dependency graph.
[RD-006] If graph changes, update DECISION_LOG.md and CONTENT_COVERAGE_MATRIX.md.

## ROADMAP_SEQUENCE

SEQUENCE:
1. NODE-00-01
2. NODE-00-02
3. NODE-01-01
4. NODE-01-02
5. NODE-01-03
6. NODE-02-01
7. NODE-02-02
8. NODE-02-03
9. NODE-02-04
10. NODE-03-01
11. NODE-03-02
12. NODE-03-03
13. NODE-03-04
14. NODE-04-01
15. NODE-04-02
16. NODE-04-03
17. NODE-04-04
18. NODE-04-05
19. NODE-05-01
20. NODE-05-02
21. NODE-05-03
22. NODE-05-04
23. NODE-05-05
24. NODE-06-01
25. NODE-06-02
26. NODE-06-03
27. NODE-06-04
28. NODE-07-01
29. NODE-07-02
30. NODE-07-03
31. NODE-07-04
32. NODE-08-01
33. NODE-08-02
34. NODE-08-03
35. NODE-08-04
36. NODE-09-01
37. NODE-09-02
38. NODE-09-03
39. NODE-09-04
40. NODE-10-01
41. NODE-10-02
42. NODE-10-03
43. NODE-10-04
44. NODE-10-05
45. NODE-11-01  (ARC-11 DIRECTION track — gated behind the capstone)
46. NODE-11-02
47. NODE-11-03
48. NODE-11-04
49. NODE-12-01  (ARC-12 Targeting the Swarm — research-backed)
50. NODE-12-02
51. NODE-12-03
52. NODE-13-01  (ARC-13 Delivery & Acceptance — the PM delivery half)
53. NODE-13-02
54. NODE-13-03  (Direct the Build — PC-043 round-trip, the curriculum's true climax)

## LAB_BINDINGS

### LAB-CONTEXT-BUDGET-BOARD
INTRO_NODE: NODE-02-01
ADVANCED_VARIANTS:
- NODE-02-02: noise filtering
- NODE-02-03: compression trade-off
- NODE-02-04: isolation decision
- NODE-10-02: capstone context architecture
REQUIRES:
- CONCEPT-CTX-001
- CONCEPT-CTX-002

### LAB-AGENT-TRACE-DEBUGGER
INTRO_NODE: NODE-02-04
ADVANCED_VARIANTS:
- NODE-04-01: workflow vs agent trace
- NODE-04-03: orchestrator-worker trace
- NODE-04-05: autonomous loop trace
- NODE-07-04: observability trace
- NODE-10-03: failure injection
REQUIRES:
- CONCEPT-CTX-005
- CONCEPT-OBS-001

### LAB-ARCHITECTURE-BUILDER
INTRO_NODE: NODE-01-01
ADVANCED_VARIANTS:
- NODE-03-04: MCP/tool integration
- NODE-04-02: workflow composition
- NODE-04-03: orchestrator-worker
- NODE-09-04: team-scale architecture
- NODE-10-02: capstone draft
REQUIRES:
- CONCEPT-AIE-002
- CONCEPT-AIE-003

### LAB-FAILURE-MODE-TREE
INTRO_NODE: NODE-00-01
ADVANCED_VARIANTS:
- NODE-02-02: context noise
- NODE-07-04: postmortem
- NODE-10-03: capstone failure injection
REQUIRES:
- CONCEPT-AIE-001

### LAB-TOOL-CONTRACT-FORGE
INTRO_NODE: NODE-03-01
ADVANCED_VARIANTS:
- NODE-03-02: structured output
- NODE-03-03: constrained decoding
- NODE-03-04: MCP integration
- NODE-08-01: least privilege
REQUIRES:
- CONCEPT-TOOL-001
- CONCEPT-TOOL-002

### LAB-CONSTRAINT-PUZZLE
INTRO_NODE: NODE-03-02
ADVANCED_VARIANTS:
- NODE-03-03: constrained decoding
- NODE-08-02: approval constraints
REQUIRES:
- CONCEPT-TOOL-003

### LAB-RETRIEVAL-FACTORY
INTRO_NODE: NODE-05-01
ADVANCED_VARIANTS:
- NODE-05-02: lexical vs semantic
- NODE-05-03: hybrid + rerank
- NODE-05-04: contextual retrieval
- NODE-05-05: visual retrieval
- NODE-07-03: grounding eval
REQUIRES:
- CONCEPT-RET-001

### LAB-PAPER-FIGURE-DECODER
INTRO_NODE: NODE-05-05
ADVANCED_VARIANTS:
- future paper visuals
REQUIRES:
- CONCEPT-RET-008
- CONCEPT-RET-009

### LAB-REPO-REFACTOR
INTRO_NODE: NODE-06-01
ADVANCED_VARIANTS:
- NODE-06-02: decision/feature memory
- NODE-06-03: agent learning loop
- NODE-09-01: repo legibility
- NODE-09-02: conventions
- NODE-09-03: source material OS
REQUIRES:
- CONCEPT-MEM-002

### LAB-EVAL-DESIGNER
INTRO_NODE: NODE-07-01
ADVANCED_VARIANTS:
- NODE-07-02: task success + regression
- NODE-07-03: grounding
- NODE-10-04: capstone eval plan
REQUIRES:
- CONCEPT-EVAL-001

### LAB-SECURITY-INCIDENT-ROOM
INTRO_NODE: NODE-08-01
ADVANCED_VARIANTS:
- NODE-08-02: approval gates
- NODE-08-03: prompt injection
- NODE-08-04: sandboxing/governance
- NODE-10-03: capstone failure injection
REQUIRES:
- CONCEPT-SEC-001

### LAB-CAPSTONE-SIMULATOR
INTRO_NODE: NODE-10-01
ADVANCED_VARIANTS:
- NODE-10-02: architecture draft
- NODE-10-03: failure injection
- NODE-10-04: eval/governance
- NODE-10-05: final review
REQUIRES:
- all prior arcs

## REVIEW_SCHEDULING_RULES

[RD-100] After completing a node, schedule first review after 2-4 later nodes.
[RD-101] Review should use different interaction form when possible.
[RD-102] Do not repeat same wording for review.
[RD-103] Review should test transfer, not recall only.
[RD-104] Failed review creates repair mission linked to original node.

## CROSS_ARC_REVIEW_MAP

REVIEW_AFTER_NODE-02-02:
- review: NODE-00-02, NODE-01-03
- format: Failure Mode Tree

REVIEW_AFTER_NODE-03-02:
- review: NODE-02-01, NODE-02-02
- format: Context Budget Board

REVIEW_AFTER_NODE-04-01:
- review: NODE-01-02, NODE-03-01
- format: Trade-off Duel

REVIEW_AFTER_NODE-05-03:
- review: NODE-02-03, NODE-04-02
- format: Retrieval Factory scenario

REVIEW_AFTER_NODE-07-01:
- review: NODE-04-04, NODE-05-03
- format: Eval Designer

REVIEW_AFTER_NODE-08-03:
- review: NODE-03-01, NODE-05-04
- format: Security Incident Room

REVIEW_AFTER_NODE-09-03:
- review: NODE-02-04, NODE-06-02, NODE-07-04
- format: Repo Refactor Lab

REVIEW_BEFORE_CAPSTONE:
- review: all core arcs
- format: mixed diagnostic gauntlet

## LOCKING_RULES

[RD-200] Show future arcs as map previews, not content access.
[RD-201] Locked node preview may show:
- title
- one-line purpose
- prerequisites
- why locked
[RD-202] Locked node preview must not reveal full solution patterns.
[RD-203] User may revisit completed nodes anytime.
[RD-204] User may replay unlocked labs.
