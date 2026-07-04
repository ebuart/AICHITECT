import type { LayerId } from '@/types/visual'

// Failure Mode Tree scenario model (lab specs LAB-FAILURE-MODE-TREE).

export type CauseRole = 'root_cause' | 'symptom' | 'distractor'

export interface CauseCard {
  id: string
  label: string
  layer: LayerId
  role: CauseRole
  explanation?: string
}

export interface RepairRule {
  id: string
  label: string
  correct: boolean
  rationale: string
}

export interface FailureScenarioData {
  symptom: string
  context: string
  causeCards: CauseCard[]
  repairRules: RepairRule[]
}

export type CauseClassification = Record<string, CauseRole>
