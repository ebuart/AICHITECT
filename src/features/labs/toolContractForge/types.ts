// Tool Contract Forge scenario model (lab specs LAB-TOOL-CONTRACT-FORGE).

export type ToolScope = 'read' | 'read_write' | 'full'

export interface ToolAction {
  id: string
  label: string
  needed: boolean
  destructive?: boolean
}

export interface ToolPermissionOption {
  id: string
  label: string
  scope: ToolScope
}

export interface ToolScenarioData {
  task: string
  dataSensitivity: 'low' | 'medium' | 'high'
  sideEffectRisk: 'none' | 'low' | 'medium' | 'high'
  actions: ToolAction[]
  permissionOptions: ToolPermissionOption[]
  /** Least-privilege option that still covers the needed actions. */
  correctPermissionId: string
  /** True when a needed action is destructive and must be gated. */
  requiresApproval: boolean
}

export interface ToolContractChoice {
  allowedActionIds: string[]
  permissionId: string | null
  requireApproval: boolean
  structuredOutput: boolean
}
