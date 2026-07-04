# /source_material/interactions/22_lesson_grammar.md

STATUS: INTERACTION_DOC  
LOAD_PRIORITY: WHEN_LESSON_ENGINE_OR_CONTENT_WORK  
PURPOSE: Define allowed lesson structures. Avoid rigid one-size-fits-all lessons.

## GRAMMAR_RULES

[LG-001] Lessons are short, active, and roadmap-bound.
[LG-002] Lessons may use different entry modes depending on concept type.
[LG-003] Do not force "briefing then interaction" for every lesson.
[LG-004] Do not start complex tasks without enough scaffold.
[LG-005] Every lesson must end in action, diagnosis, reconstruction, transfer, or review.
[LG-006] Every lesson must include or reference a visual model when concept is abstract.
[LG-007] Every lesson must declare prerequisites.
[LG-008] Every lesson must declare review hooks.
[LG-009] Avoid long prose. Use compact learner-facing blocks.

## LESSON_SCHEMA

```ts
type Lesson = {
  id: string
  roadmapNodeId: string
  conceptIds: string[]
  prerequisites: string[]
  title: string
  estimatedMinutes: number
  mode: LessonMode
  learningGoal: string
  briefings: BriefingBlock[]
  visualModelId?: string
  interactionScenarioId: string
  feedbackProfileId: string
  reviewHooks: string[]
  transferPromptId?: string
}
```

## LESSON_MODES

### MODE-TERM-FIRST

USE_WHEN:
- new hard technical term is required before task.
- concept has precise vocabulary.

GOOD_FOR:
- structured output
- constrained decoding
- context window
- eval harness
- reranking
- MCP

STRUCTURE:
1. term_card
2. minimal_example
3. visual_model
4. small_application
5. transfer_check

RULES:
- max 2-4 terms per lesson.
- terms must be used immediately.
- no glossary-only lesson.

### MODE-TASK-FIRST

USE_WHEN:
- concept is best learned through system consequence.
- learner can attempt diagnosis with existing prerequisites.

GOOD_FOR:
- context noise
- workflow vs agent
- least privilege
- repo legibility
- overengineering

STRUCTURE:
1. scenario
2. first_decision
3. consequence
4. concept_reveal
5. repair_task
6. transfer_check

RULES:
- initial task must be solvable from prerequisites.
- consequence must be concrete.
- repair must teach architecture rule.

### MODE-WORKED-TRACE-FIRST

USE_WHEN:
- process has multiple steps and hidden failure point.
- trace literacy matters.

GOOD_FOR:
- agent loop
- retrieval pipeline
- evaluator-optimizer
- tool use
- postmortems

STRUCTURE:
1. full_trace
2. guided_annotation
3. failure_point
4. corrected_trace
5. replay_task

RULES:
- show complete example before asking for independent trace diagnosis.
- distinguish symptom vs root cause.

### MODE-MULTIPLE-VIEWPOINTS

USE_WHEN:
- concept has major trade-offs across layers.
- oversimplification would mislead.

GOOD_FOR:
- memory
- agents vs workflows
- retrieval
- governance
- visual retrieval
- long-running agent systems

STRUCTURE:
1. compact_concept
2. architecture_view
3. debugging_view
4. security_or_cost_view
5. team_maintainability_view
6. decision_task

RULES:
- keep each viewpoint short.
- end with trade-off decision.

### MODE-REFRACTOR-FIRST

USE_WHEN:
- learner should repair an existing bad structure.
- concept concerns maintainability.

GOOD_FOR:
- repo architecture
- small components
- project memory
- source material OS
- conventions

STRUCTURE:
1. broken_artifact
2. inspect_flags
3. choose_refactor
4. compare_before_after
5. define_future_rule

RULES:
- broken artifact must be realistic.
- repair must reduce future complexity.

### MODE-INCIDENT-FIRST

USE_WHEN:
- security, governance, or operational risk is central.

GOOD_FOR:
- prompt injection
- permissions
- approval gates
- sandboxing
- governance

STRUCTURE:
1. incident
2. timeline
3. boundary_map
4. root_cause
5. mitigation
6. postmortem_rule

RULES:
- avoid fear-based framing.
- focus on concrete trust boundaries.

### MODE-PAPER-FIGURE-DECODER

USE_WHEN:
- paper/source visual contains important architecture insight.
- concept is advanced and visual.

GOOD_FOR:
- ColPali-style retrieval
- contextual retrieval
- agent pattern diagrams
- eval loop diagrams

STRUCTURE:
1. simplified_visual
2. component_labels
3. what_it_teaches
4. when_to_use
5. when_not_to_use
6. system_design_transfer

RULES:
- do not copy original paper figure directly.
- do not expose raw paper complexity unless necessary.
- always connect to practical architecture decision.

### MODE-CAPSTONE_STAGE

USE_WHEN:
- integrated final challenge.

GOOD_FOR:
- capstone only.

STRUCTURE:
1. mission_brief
2. system_board
3. decisions
4. failure_or_review
5. architecture_revision
6. final_defense

RULES:
- reuse existing labs.
- require prior concepts.
- persist stage state.

## BRIEFING_BLOCK_RULES

[LG-100] Briefing blocks must be short.
[LG-101] Use briefing only for decision-critical information.
[LG-102] Prefer examples over abstract explanations.
[LG-103] Do not include source citations in learner-facing content unless feature explicitly supports source view.
[LG-104] Keep technical terms in English.
[LG-105] Explanatory sentences should be German.

## SCAFFOLDING_LEVELS

[SCAFFOLD-0] Cold challenge. Use only when prerequisites are strong.
[SCAFFOLD-1] Hint available.
[SCAFFOLD-2] Worked example before task.
[SCAFFOLD-3] Step-by-step guided task.
[SCAFFOLD-4] Term-first with examples before task.

## DIFFICULTY_RAMP

[LG-200] Recognition: identify pattern or layer.
[LG-201] Explanation: explain consequence.
[LG-202] Application: choose architecture action.
[LG-203] Diagnosis: find root cause.
[LG-204] Transfer: apply in changed scenario.
[LG-205] Defense: justify trade-off.
[LG-206] Integration: combine multiple layers.

## LESSON_ACCEPTANCE_CHECK

[LG-300] Before adding lesson, verify:
- roadmap node exists
- prerequisites exist
- concept IDs exist
- lesson mode fits concept
- interaction exists or is planned
- visual model exists or is planned
- feedback profile exists
- review hook exists
- no duplicate lesson covers same outcome
