# /source_material/progress/VISUAL_QA_LOG.md

STATUS: PROGRESS_DOC  
LOAD_PRIORITY: WHEN_VISUALS_CHANGE  
PURPOSE: Track visual components, test states, and known visual risks.

## FORMAT_RULES

[VQL-001] Every complex visual component needs an entry.
[VQL-002] Update after visual changes.
[VQL-003] Mark untested states honestly.
[VQL-004] Prefer adding reusable QA cases over debugging only target screens.

## TEST_VALUES

- not_built
- not_tested
- pass
- fail
- partial
- deferred

## VISUAL_COMPONENTS

Legend: `visual_lab=built` means QA cases exist in `/visual-lab`. State columns =
`not_tested` mean a deterministic case is rendered but NOT yet visually confirmed
by a human (VQA-001). `status=partial` = built + compiles + cases present; human
pixel/mobile inspection pending.

| component_id | component | phase | visual_lab | mobile | dense | long_labels | empty | error | fallback | status | notes |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| VIS-SystemNode | SystemNode | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | n/a | partial | 12 kinds, badge overflow, states. |
| VIS-SystemEdge | SystemEdge | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | n/a | partial | All edge kinds as connection list; risk/approval Details chip. |
| VIS-LayerStack | LayerStack | PHASE_2 | built | not_tested | not_tested | not_tested | not_tested | not_tested | not_tested | partial | 4/8 layers, failure highlight, items, empty. |
| VIS-FlowStep | FlowStep | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | n/a | n/a | partial | done/current/todo flow with connectors. |
| VIS-BoundaryBox | BoundaryBox | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | not_tested | partial | trust/permission/sandbox, nested, warning. |
| VIS-TokenBudgetBar | TokenBudgetBar | PHASE_2 | built | not_tested | not_tested | n/a | n/a | not_tested | not_tested | partial | under/over budget, noise+missing risk, compact. |
| VIS-TraceTimeline | TraceTimeline | PHASE_2 | built | not_tested | not_tested | not_tested | not_tested | not_tested | not_tested | partial | 3/10 events, failure_origin vs symptom, empty. |
| VIS-DecisionCard | DecisionCard | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | n/a | partial | strong/weak/selected, disabled w/ reason. |
| VIS-FailureModeCard | FailureModeCard | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | n/a | partial | symptom/root_cause/repair/distractor/risk + layer. |
| VIS-ScoreMeter | ScoreMeter | PHASE_2 | built | not_tested | n/a | n/a | n/a | n/a | n/a | partial | risk/mastery/coverage/quality, calm (no XP). |
| VIS-CompactFallbackView | CompactFallbackView | PHASE_2 | built | not_tested | not_tested | not_tested | n/a | not_tested | pass | partial | The canonical fallback (BP-046). |
| VIS-DiagramShell | DiagramShell | PHASE_2 | built | not_tested | not_tested | n/a | n/a | n/a | not_tested | partial | Container + compact-fallback toggle. |

## KNOWN_VISUAL_RISKS

### VR-0001 — Graph layout instability

STATUS: active  
AFFECTS:
- Architecture Builder
- Agent system diagrams

MITIGATION:
- Use deterministic slot layouts.
- Avoid force-directed graph layout.
- Add compact fallback.

RESOLVED_FOR:
- Retrieval Factory (FL-0019): built with deterministic stacked DecisionCards + ScoreMeter (no graph
  layout, tap-to-select per VR-0003) — graph-instability risk does not apply to this engine.

### VR-0002 — Mobile label overflow

STATUS: active  
AFFECTS:
- all diagrams with nodes/cards

MITIGATION:
- Use max label lengths.
- Use truncation with expandable detail panel.
- Test long-label cases in `/visual-lab`.

### VR-0003 — Drag-and-drop complexity

STATUS: active  
AFFECTS:
- Context Budget Board
- Architecture Builder
- Tool Contract Forge

MITIGATION:
- Prefer tap-to-select, move buttons, or staged placement first.
- Add drag-and-drop only after stable click/tap interaction exists.

### VR-0004 — Visual states compile-verified but not human-inspected

STATUS: active
AFFECTS:
- all PHASE_2 primitives

MITIGATION:
- Deterministic sample data + width switcher in `/visual-lab`.
- Automated smoke test renders the whole gallery without throwing (FL-0006) — catches runtime/throw bugs, NOT pixel bugs.
- Required: human pixel/mobile pass before primitives are used in lessons (VQA-200).

### VR-0005 — Desktop widths not testable in mobile-first shell

STATUS: active
AFFECTS:
- `/visual-lab` width switcher (only 320–430px emulated)

MITIGATION:
- Mobile widths are the priority (QG-080).
- Add a full-width visual-lab layout escape if desktop diagram QA becomes necessary.
