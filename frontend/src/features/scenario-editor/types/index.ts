import type { z } from 'zod'
import type {
  dependencySchema,
  groupDetailsSchema,
  nodeDetailsSchema,
  scenarioDocumentSchema,
  scenarioGroupSchema,
  scenarioLabelSchema,
  scenarioNodeSchema,
  scenarioSnapshotSchema,
} from '../schemas/scenario.schema'

export type ScenarioDocument = z.infer<typeof scenarioDocumentSchema>
export type ScenarioSnapshot = z.infer<typeof scenarioSnapshotSchema>
export type ScenarioNode = z.infer<typeof scenarioNodeSchema>
export type ScenarioGroup = z.infer<typeof scenarioGroupSchema>
export type ScenarioLabel = z.infer<typeof scenarioLabelSchema>
export type Dependency = z.infer<typeof dependencySchema>
export type NodeDetails = z.infer<typeof nodeDetailsSchema>
export type GroupDetails = z.infer<typeof groupDetailsSchema>

export type ScenarioCommand =
  | { type: 'add-node'; groupId: string; title: string }
  | { type: 'update-node'; nodeId: string; values: NodeDetails }
  | { type: 'delete-node'; nodeId: string }
  | { type: 'move-node'; nodeId: string; position: { x: number; y: number } }
  | { type: 'swap-nodes'; nodeId: string; targetNodeId: string }
  | { type: 'set-node-group'; nodeId: string; groupId: string }
  | { type: 'add-group'; parentId: string | null; title: string }
  | { type: 'update-group'; groupId: string; values: GroupDetails }
  | { type: 'delete-group'; groupId: string }
  | { type: 'move-group'; groupId: string; position: { x: number; y: number } }
  | { type: 'add-label'; name: string }
  | { type: 'rename-label'; labelId: string; name: string }
  | { type: 'toggle-label'; nodeId: string; labelId: string; assigned: boolean }
  | { type: 'toggle-group-tag'; nodeId: string; groupId: string; assigned: boolean }
  | { type: 'convert-label'; labelId: string; parentGroupId: string | null }
  | { type: 'add-dependency'; fromNodeId: string; toNodeId: string }
  | { type: 'delete-dependency'; dependencyId: string }

export type ScenarioDocumentCommand =
  | ScenarioCommand
  | { type: 'save-version'; name: string; note: string }
  | { type: 'switch-version'; versionId: string }
  | { type: 'import'; json: string }
  | { type: 'reset' }
