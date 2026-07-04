# source_material_manifest.md

STATUS: MANIFEST  
LOAD_PRIORITY: WHEN_NAVIGATING_SOURCE_DOCS  
PURPOSE: Explain which source docs exist and when to load them.

## LOAD_POLICY_SUMMARY

[MAN-001] Do not load all docs by default.
[MAN-002] Always start with PROJECT_MEMORY.md.
[MAN-003] Load control docs for project rules.
[MAN-004] Load progress docs only when their area changes.
[MAN-005] Load domain docs for roadmap/curriculum work.
[MAN-006] Load interaction docs for labs/lessons/feedback work.
[MAN-007] Load visual docs for visual components/visual QA.
[MAN-008] Load research docs only for source-grounded concept planning.

## ALWAYS_BASELINE

### `/source_material/progress/PROJECT_MEMORY.md`
LOAD: every session  
WHY: compact hot state and next safe task.

### `/source_material/control/00_project_contract.md`
LOAD: every session  
WHY: product identity and primary outcome.

### `/source_material/control/01_non_goals.md`
LOAD: every session  
WHY: prevents scope drift.

### `/source_material/control/02_build_principles.md`
LOAD: every session  
WHY: architecture standards.

### `/source_material/control/03_context_policy.md`
LOAD: every session  
WHY: context/token discipline.

### `/source_material/control/04_phase_plan.md`
LOAD: every session  
WHY: phase order and allowed work.

### `/source_material/control/05_quality_gates.md`
LOAD: every session  
WHY: definition of done.

### `/source_material/control/06_claude_workflow.md`
LOAD: every session  
WHY: Claude Code operating procedure.

## PROGRESS_DOCS

### `/source_material/progress/FEATURE_LEDGER.md`
LOAD_WHEN:
- feature implemented
- refactor completed
- need feature history

### `/source_material/progress/DECISION_LOG.md`
LOAD_WHEN:
- architecture decision needed
- source docs conflict
- changing folder/data/storage patterns

### `/source_material/progress/OPEN_QUESTIONS.md`
LOAD_WHEN:
- blocked
- planning next phase
- unresolved decision affects task

### `/source_material/progress/CONTENT_COVERAGE_MATRIX.md`
LOAD_WHEN:
- adding/changing concepts
- adding lessons
- curriculum coverage review

### `/source_material/progress/VISUAL_QA_LOG.md`
LOAD_WHEN:
- building/changing visuals
- visual-lab work
- debugging diagrams

### `/source_material/progress/AGENT_LEARNING_LOG.md`
LOAD_WHEN:
- recurring process mistake
- repeated workaround
- self-learning loop update

## DOMAIN_DOCS

### `/source_material/domain/10_domain_taxonomy.md`
LOAD_WHEN:
- defining concepts
- mapping concepts to layers
- adding curriculum content
- checking buzzword drift

### `/source_material/domain/11_curriculum_graph.md`
LOAD_WHEN:
- roadmap implementation
- prerequisite logic
- lesson sequencing
- node content planning

### `/source_material/domain/12_roadmap_dependencies.md`
LOAD_WHEN:
- unlock logic
- review scheduling
- lab bindings
- roadmap graph changes

### `/source_material/domain/13_capstone_spec.md`
LOAD_WHEN:
- capstone planning
- late-phase integration
- checking long-range dependency path

## INTERACTION_DOCS

### `/source_material/interactions/20_interaction_catalog.md`
LOAD_WHEN:
- choosing interaction type
- designing new lab task
- avoiding MCQ/default text lesson

### `/source_material/interactions/21_lab_specs.md`
LOAD_WHEN:
- implementing lab engine
- defining lab scenario schema
- lab persistence/scoring work

### `/source_material/interactions/22_lesson_grammar.md`
LOAD_WHEN:
- implementing lesson engine
- adding lesson content
- choosing lesson mode/scaffold

### `/source_material/interactions/23_feedback_patterns.md`
LOAD_WHEN:
- feedback implementation
- scoring implementation
- avoiding generic AI feedback

## VISUAL_DOCS

### `/source_material/visuals/30_visual_system_spec.md`
LOAD_WHEN:
- visual design
- diagram type selection
- visual-lab planning

### `/source_material/visuals/31_visual_component_contracts.md`
LOAD_WHEN:
- implementing visual components
- defining props/types
- connecting visuals to labs

### `/source_material/visuals/32_paper_visual_atlas.md`
LOAD_WHEN:
- paper-inspired visual
- advanced concept diagram
- Paper Figure Decoder work

### `/source_material/visuals/33_visual_qa_cases.md`
LOAD_WHEN:
- visual-lab
- mobile/dense/long-label QA
- visual stability work

## RESEARCH_DOCS

### `/source_material/research/40_research_brief.md`
LOAD_WHEN:
- high-level research synthesis needed
- checking if concept is source-supported

### `/source_material/research/41_source_index.md`
LOAD_WHEN:
- source anchor lookup
- citation/source mapping
- refreshing official docs

### `/source_material/research/42_paper_notes.md`
LOAD_WHEN:
- paper concepts
- advanced retrieval/model adaptation
- paper visual atlas expansion

### `/source_material/research/43_course_notes.md`
LOAD_WHEN:
- learning design
- official course alignment
- scaffolding/review principles

## TASK_TO_DOC_MAP

TASK: repo bootstrap  
LOAD:
- PROJECT_MEMORY
- all control docs
- FEATURE_LEDGER

TASK: app architecture foundation  
LOAD:
- PROJECT_MEMORY
- all control docs
- DECISION_LOG
- OPEN_QUESTIONS

TASK: roadmap implementation  
LOAD:
- PROJECT_MEMORY
- control docs
- 10_domain_taxonomy
- 11_curriculum_graph
- 12_roadmap_dependencies
- CONTENT_COVERAGE_MATRIX

TASK: visual primitive implementation  
LOAD:
- PROJECT_MEMORY
- control docs
- 30_visual_system_spec
- 31_visual_component_contracts
- 33_visual_qa_cases
- VISUAL_QA_LOG

TASK: interaction/lab implementation  
LOAD:
- PROJECT_MEMORY
- control docs
- 20_interaction_catalog
- 21_lab_specs
- 23_feedback_patterns
- relevant visual docs
- FEATURE_LEDGER

TASK: lesson content implementation  
LOAD:
- PROJECT_MEMORY
- control docs
- 10_domain_taxonomy
- 11_curriculum_graph
- 22_lesson_grammar
- 23_feedback_patterns
- CONTENT_COVERAGE_MATRIX

TASK: retrieval/paper visual content  
LOAD:
- PROJECT_MEMORY
- control docs
- relevant domain docs
- 32_paper_visual_atlas
- 40_research_brief
- 41_source_index
- 42_paper_notes

TASK: capstone implementation  
LOAD:
- PROJECT_MEMORY
- control docs
- 13_capstone_spec
- 20_interaction_catalog
- 21_lab_specs
- 23_feedback_patterns
- relevant visual docs

TASK: session end  
LOAD:
- PROJECT_MEMORY
- FEATURE_LEDGER
- DECISION_LOG if decisions changed
- OPEN_QUESTIONS if blocked
- CONTENT_COVERAGE_MATRIX if content changed
- VISUAL_QA_LOG if visuals changed
