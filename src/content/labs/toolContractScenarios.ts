import type { LabScenario } from '@/features/labs/interactionModel'
import type { ToolScenarioData } from '@/features/labs/toolContractForge/types'

// Tool Contract Forge scenarios. Intro at NODE-03-01 + a destructive-action
// transfer variant that requires an approval gate (LS-005).
export const toolContractScenarios: LabScenario<ToolScenarioData>[] = [
  {
    id: 'TCF-BASE',
    interactionType: 'tool-contract-forge',
    labId: 'LAB-TOOL-CONTRACT-FORGE',
    roadmapNodeId: 'NODE-03-01',
    title: 'Tool Contract Forge',
    prompt:
      'Entwirf den Contract für ein Datei-Lese-Tool eines Reporting-Agenten. Least Privilege — nur was die Aufgabe braucht.',
    concepts: ['CONCEPT-TOOL-001', 'CONCEPT-TOOL-002', 'CONCEPT-SEC-001'],
    prerequisites: ['NODE-02-04'],
    difficulty: 'intro',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'tcf-default',
    feedbackProfileId: 'tcf-default',
    reviewHooks: ['tool_boundary_transfer', 'least_privilege_transfer'],
    scenarioData: {
      task: 'Ein Reporting-Agent soll Report-Dateien lesen und auflisten.',
      dataSensitivity: 'medium',
      sideEffectRisk: 'low',
      actions: [
        { id: 'read', label: 'read_file', needed: true },
        { id: 'list', label: 'list_dir', needed: true },
        { id: 'write', label: 'write_file', needed: false },
        { id: 'delete', label: 'delete_file', needed: false, destructive: true },
      ],
      permissionOptions: [
        { id: 'p-read', label: 'Read-only', scope: 'read' },
        { id: 'p-rw', label: 'Read-Write', scope: 'read_write' },
        { id: 'p-full', label: 'Full Access', scope: 'full' },
      ],
      correctPermissionId: 'p-read',
      requiresApproval: false,
    },
  },
  {
    id: 'TCF-TRANSFER',
    interactionType: 'tool-contract-forge',
    labId: 'LAB-TOOL-CONTRACT-FORGE',
    roadmapNodeId: 'NODE-03-01',
    title: 'Tool Contract Forge — Transfer: Deploy Tool',
    prompt:
      'Geändertes Szenario: ein Deploy-Tool mit destruktiver Aktion. Gate das Richtige, ohne harmlose Arbeit zu blockieren.',
    concepts: ['CONCEPT-SEC-001', 'CONCEPT-SEC-002'],
    prerequisites: ['NODE-02-04'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: true,
    scoringProfileId: 'tcf-default',
    feedbackProfileId: 'tcf-default',
    reviewHooks: ['least_privilege_transfer'],
    scenarioData: {
      task: 'Ein Release-Agent soll Status lesen und ein Deployment auslösen.',
      dataSensitivity: 'high',
      sideEffectRisk: 'high',
      actions: [
        { id: 'status', label: 'read_status', needed: true },
        { id: 'deploy', label: 'trigger_deploy', needed: true, destructive: true },
        { id: 'rollback', label: 'rollback_all', needed: false, destructive: true },
        { id: 'secrets', label: 'read_secrets', needed: false },
      ],
      permissionOptions: [
        { id: 'p-read', label: 'Read-only', scope: 'read' },
        { id: 'p-rw', label: 'Read-Write (deploy)', scope: 'read_write' },
        { id: 'p-full', label: 'Full Access', scope: 'full' },
      ],
      correctPermissionId: 'p-rw',
      requiresApproval: true,
    },
  },
]
