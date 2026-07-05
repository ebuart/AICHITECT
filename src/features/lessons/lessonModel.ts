import type {
  ConceptId,
  Feedback,
  InteractionType,
  LessonId,
  LessonMode,
  RoadmapNodeId,
} from '@/types'
import type {
  CompactFallbackViewProps,
  DecisionCardProps,
  FlowStepProps,
  LayerStackProps,
  ScoreMeterProps,
  SystemNodeProps,
  TokenBudgetBarProps,
  TraceTimelineProps,
} from '@/components/visuals'
import type { CampaignDef } from '@/features/campaign/campaignModel'

// A lesson visual reuses an existing visual primitive (VSS-003: no one-off
// lesson visuals). Type-only import keeps content presentation-agnostic at
// runtime while sharing the single source of truth for each contract.
export type LessonVisual =
  | { type: 'systemRow'; nodes: SystemNodeProps[] }
  | { type: 'layerStack'; data: LayerStackProps }
  | { type: 'tokenBudget'; data: TokenBudgetBarProps }
  | { type: 'trace'; data: TraceTimelineProps }
  | { type: 'flow'; steps: FlowStepProps[] }
  | { type: 'decisionPair'; cards: DecisionCardProps[] }
  | { type: 'scoreMeter'; data: ScoreMeterProps }
  | { type: 'compactFallback'; data: CompactFallbackViewProps }

export type LessonNoteTone = 'info' | 'warning' | 'success'

export interface LessonDecisionOption {
  id: string
  label: string
  feedback: Feedback
}

// Active step (LG-005: lessons end in action). Every option yields structured
// consequence feedback — never bare correct/wrong (NG-053). At least one strong
// path (QG-045) and one suboptimal path with feedback (QG-046) are required.
export interface LessonDecision {
  id: string
  prompt: string
  options: LessonDecisionOption[]
  bestOptionId: string
}

// Bespoke concrete exercises (post-template redesign, 2026-06-22). NOT routed through a
// mechanic engine and NOT wrapped in a scenario/constraint template — each exercise is a
// concrete question about real shown material (a ticket, a trace, a config), phrased
// impersonally ("Welche Zeile ist der Angriff?", not "Wie machst du X?"). The lesson hosts
// several DIFFERENT exercise formats; completion gates on answering them all (LG-005).
export interface PickOption {
  id: string
  text: string
  correct: boolean
  /** Shown on reveal — why this option is right/wrong (concrete, per-option). */
  why: string
}
export interface TraceLine {
  step: number
  text: string
  /** Highlighted as the failing step on reveal. */
  bad?: boolean
}
export interface SpotLine {
  id: string
  text: string
  /** The one line that is the attack / the answer. */
  isAttack?: boolean
  /** Shown on reveal when this line is involved. */
  note?: string
}
export interface OrderItem {
  id: string
  text: string
}
export interface CategorizeBucket {
  id: string
  label: string
}
export interface CategorizeItem {
  id: string
  text: string
  /** The id of the bucket this item belongs in. */
  bucketId: string
  /** Shown on reveal. */
  why?: string
}
export interface MatchPair {
  id: string
  left: string
  right: string
  /** Shown on reveal for this pairing. */
  why?: string
}
export interface ClozeBlank {
  id: string
  /** Short label for the slot (e.g. "required-Feld"). */
  label?: string
  options: PickOption[]
}
export interface StepVerdict {
  id: string
  label: string
}
export interface StepRow {
  id: string
  text: string
  /** The id of the correct verdict for this step. */
  verdictId: string
  why?: string
}
export interface BudgetItem {
  id: string
  label: string
  /** Inclusive good-range for this item's allocation. */
  min: number
  max: number
  hint?: string
}
export interface ThresholdSample {
  id: string
  label: string
  value: number
  /** True = should be admitted at/above the cutoff; false = should fall below it. */
  keep: boolean
}
export interface SourceLine {
  id: string
  text: string
}
export interface DiffLine {
  id: string
  text: string
  sign?: '+' | '-' | ' '
  /** The one changed line that introduces the problem. */
  bad?: boolean
  note?: string
}
export interface ComposeBlock {
  id: string
  text: string
  /** True = belongs in the pipeline; false = a distractor that must stay out. */
  correct: boolean
}
export interface AnnotateSegment {
  id: string
  text: string
  /** Present = this segment is a red flag the learner should catch. */
  flag?: { category: string; why: string; fix?: string }
}
export type Exercise =
  | {
      id: string
      format: 'pick'
      /** The natural, concrete question. */
      stem: string
      /** Optional shown artifact rendered above the options. */
      code?: string
      trace?: TraceLine[]
      options: PickOption[]
      /** One-line lesson shown after reveal. */
      takeaway?: string
    }
  | {
      id: string
      // Select ALL that apply — harder than pick (each option judged independently);
      // graded on the exact set. Submitted via a button, then revealed per-option.
      format: 'multi'
      stem: string
      code?: string
      options: PickOption[]
      takeaway?: string
    }
  | {
      id: string
      format: 'spot'
      stem: string
      /** Optional framing line above the material. */
      intro?: string
      lines: SpotLine[]
      takeaway?: string
    }
  // Arrange items into the correct sequence (items given in correct order, shuffled at
  // render; reorder with up/down). Pipelines, loops, incident steps.
  | { id: string; format: 'order'; stem: string; intro?: string; items: OrderItem[]; takeaway?: string }
  // Sort each item into its correct bucket (N buckets — harder than binary multi).
  | {
      id: string
      format: 'categorize'
      stem: string
      buckets: CategorizeBucket[]
      items: CategorizeItem[]
      takeaway?: string
    }
  // Connect each left item to its matching right item (right column shuffled).
  | { id: string; format: 'match'; stem: string; pairs: MatchPair[]; takeaway?: string }
  // Fill each blank in shown material from its own option chips (cloze on a config/schema).
  | {
      id: string
      format: 'cloze'
      stem: string
      intro?: string
      code?: string
      blanks: ClozeBlank[]
      takeaway?: string
    }
  // Predict the verdict of each step of a short trace (simulate the run), then reveal all.
  | {
      id: string
      format: 'stepwise'
      stem: string
      intro?: string
      verdicts: StepVerdict[]
      steps: StepRow[]
      takeaway?: string
    }
  // Tap ALL offending lines in real text (spot with several targets).
  | { id: string; format: 'multispot'; stem: string; intro?: string; lines: SpotLine[]; takeaway?: string }
  // Allocate a fixed total across items with +/- steppers; verified against good-ranges.
  | {
      id: string
      format: 'budget'
      stem: string
      intro?: string
      unit?: string
      total: number
      step?: number
      items: BudgetItem[]
      takeaway?: string
    }
  // Set a single cutoff (slider) that admits the keep-samples and rejects the rest.
  | {
      id: string
      format: 'threshold'
      stem: string
      intro?: string
      unit?: string
      min: number
      max: number
      step?: number
      samples: ThresholdSample[]
      takeaway?: string
    }
  // Tap the one line in source A and the one line in source B that contradict each other.
  | {
      id: string
      format: 'contradiction'
      stem: string
      intro?: string
      sourceA: SourceLine[]
      sourceB: SourceLine[]
      conflict: { a: string; b: string }
      why?: string
      takeaway?: string
    }
  // Tap the changed line in a diff that introduces the problem.
  | { id: string; format: 'diff'; stem: string; intro?: string; lines: DiffLine[]; takeaway?: string }
  // Build a pipeline: pick the blocks that belong (some are distractors) AND order them.
  | {
      id: string
      format: 'compose'
      stem: string
      intro?: string
      pool: ComposeBlock[]
      orderedCorrect: string[]
      takeaway?: string
    }
  // Read a big agent response and tap the segments that are red flags. A `legend` teaches
  // WHICH tells to look for up front; reveal labels each flag with its category + fix.
  | {
      id: string
      format: 'annotate'
      stem: string
      intro?: string
      legend?: { label: string; hint: string }[]
      segments: AnnotateSegment[]
      takeaway?: string
    }

export type LessonBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'term'; term: string; definition: string; example?: string }
  | { kind: 'note'; tone: LessonNoteTone; title?: string; text: string }
  | { kind: 'visual'; caption?: string; visual: LessonVisual }
  | { kind: 'decision'; decision: LessonDecision }
  // An embedded hands-on challenge: renders a mechanic engine inline (by lab scenario
  // id). Completing the challenge completes the lesson (LR-051, the strategy-game loop).
  | { kind: 'challenge'; scenarioId: string }
  // A bespoke concrete exercise (see above). Answering it counts toward completion.
  | { kind: 'exercise'; exercise: Exercise }
  // A feel-first interactive (control/10 IX-1/IX-8): explore and manipulate BEFORE being
  // quizzed. Does not gate completion — the exercises after it do.
  | { kind: 'explorer'; explorerId: string }
  // The Build Campaign — a stateful "direct the whole build" strategy sim (the production
  // capstone). Completing the scorecard completes the lesson (like a challenge).
  | { kind: 'campaign'; campaign: CampaignDef }

// Full lesson contract: BP-033 metadata + lesson-grammar content (LG-schema).
export interface Lesson {
  id: LessonId
  roadmapNodeId: RoadmapNodeId
  conceptIds: ConceptId[]
  prerequisites: RoadmapNodeId[]
  title: string
  estimatedMinutes: number
  lessonMode: LessonMode
  learningGoal: string
  interactionType: InteractionType
  visualModelId: string | null
  feedbackPatternId: string | null
  reviewHooks: string[]
  blocks: LessonBlock[]
}

/** All decision blocks in a lesson, in order. */
export function lessonDecisions(lesson: Lesson): LessonDecision[] {
  return lesson.blocks
    .filter((b): b is Extract<LessonBlock, { kind: 'decision' }> => b.kind === 'decision')
    .map((b) => b.decision)
}

/** All bespoke exercise blocks in a lesson, in order. */
export function lessonExercises(lesson: Lesson): Exercise[] {
  return lesson.blocks
    .filter((b): b is Extract<LessonBlock, { kind: 'exercise' }> => b.kind === 'exercise')
    .map((b) => b.exercise)
}
