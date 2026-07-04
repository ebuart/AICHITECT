import type { SystemNodeKind } from '@/types/visual'

// Architecture Builder scenario model (lab specs LAB-ARCHITECTURE-BUILDER).

export interface ArchComponent {
  id: string
  type: SystemNodeKind
  label: string
  capabilities: string[]
  cost?: 'low' | 'medium' | 'high'
  risk?: string
}

export interface ArchScenarioData {
  task: string
  requiredCapabilities: string[]
  /** Component types this scenario should avoid (e.g. agents when a workflow fits). */
  forbiddenTypes: SystemNodeKind[]
  /** Simplest sufficient component count. */
  maxRecommended: number
  components: ArchComponent[]
}

export type ArchSelection = string[]
