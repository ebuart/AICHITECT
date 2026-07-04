import type { LessonMode } from '@/types'

// Presentation framing per lesson mode (PH-402). Modes are realized as authored
// block structures + this registry, not duplicated renderers (BP-009/QG-024):
// the same block renderer serves every mode; the mode supplies the short header
// label and the ordered structure the author follows (lesson grammar STRUCTURE).
//
// NOTE: no "tagline" field. The per-mode taglines were content-free AI-slop
// ("Trace lesen, Fehlerursache von Symptom trennen.") and were cut — a header
// must carry information (title + learning goal), never motivational filler.
export interface LessonModeInfo {
  label: string
}

const info: Partial<Record<LessonMode, LessonModeInfo>> = {
  'term-first': { label: 'Term-First' },
  'task-first': { label: 'Task-First' },
  'worked-trace-first': { label: 'Worked-Trace' },
  'multiple-viewpoints': { label: 'Multiple Viewpoints' },
  'trade-off-first': { label: 'Trade-off' },
  'worked-example': { label: 'Worked Example' },
  'architecture-builder': { label: 'Architecture' },
  'refactor-first': { label: 'Refactor' },
  'incident-first': { label: 'Incident' },
  'trace-first': { label: 'Trace' },
  'scenario-first': { label: 'Scenario' },
  'eval-first': { label: 'Eval' },
  postmortem: { label: 'Postmortem' },
  'constraint-puzzle': { label: 'Constraint' },
  'paper-figure-decoder': { label: 'Paper Figure' },
}

export function lessonModeInfo(mode: LessonMode): LessonModeInfo {
  return info[mode] ?? { label: mode }
}
