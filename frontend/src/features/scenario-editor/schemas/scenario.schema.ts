import { z } from 'zod'

export const positionSchema = z.object({
  x: z.number().finite().min(-50_000).max(50_000),
  y: z.number().finite().min(-50_000).max(50_000),
})

export const sourceCellSchema = z.object({
  sheet: z.string().min(1).max(120),
  row: z.number().int().positive(),
  column: z.string().regex(/^[A-Z]{1,3}$/),
})

export const scenarioGroupSchema = z.object({
  id: z.string().min(1).max(160),
  title: z.string().trim().min(1).max(160),
  parentId: z.string().nullable(),
  position: positionSchema,
  source: sourceCellSchema.optional(),
})

export const scenarioNodeSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(300),
  description: z.string().max(2_000),
  groupId: z.string().min(1),
  position: positionSchema,
  labelIds: z.array(z.string()),
  groupTagIds: z.array(z.string()),
  source: sourceCellSchema.optional(),
})

export const scenarioLabelSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export const dependencySchema = z.object({
  id: z.string().min(1),
  fromNodeId: z.string().min(1),
  toNodeId: z.string().min(1),
})

function hasDirectedCycle(pairs: { fromNodeId: string; toNodeId: string }[]) {
  const next = new Map<string, string[]>()
  for (const pair of pairs) next.set(pair.fromNodeId, [...(next.get(pair.fromNodeId) ?? []), pair.toNodeId])
  const visiting = new Set<string>()
  const visited = new Set<string>()
  function visit(id: string): boolean {
    if (visiting.has(id)) return true
    if (visited.has(id)) return false
    visiting.add(id)
    if ((next.get(id) ?? []).some(visit)) return true
    visiting.delete(id)
    visited.add(id)
    return false
  }
  return [...next.keys()].some(visit)
}

export const scenarioSnapshotSchema = z.object({
  groups: z.array(scenarioGroupSchema).min(1),
  nodes: z.array(scenarioNodeSchema),
  dependencies: z.array(dependencySchema),
  labels: z.array(scenarioLabelSchema),
}).superRefine((snapshot, ctx) => {
  const unique = (ids: string[]) => new Set(ids).size === ids.length
  if (!unique(snapshot.groups.map(item => item.id)) || !unique(snapshot.nodes.map(item => item.id)) ||
      !unique(snapshot.dependencies.map(item => item.id)) || !unique(snapshot.labels.map(item => item.id))) {
    ctx.addIssue({ code: 'custom', message: 'O roteiro contém identificadores repetidos.' })
  }
  const groupIds = new Set(snapshot.groups.map(item => item.id))
  const nodeIds = new Set(snapshot.nodes.map(item => item.id))
  const labelIds = new Set(snapshot.labels.map(item => item.id))
  for (const group of snapshot.groups) {
    if (group.parentId && (!groupIds.has(group.parentId) || group.parentId === group.id))
      ctx.addIssue({ code: 'custom', message: 'Um agrupamento tem uma referência hierárquica inválida.' })
    const seen = new Set([group.id])
    let parentId = group.parentId
    while (parentId) {
      if (seen.has(parentId)) {
        ctx.addIssue({ code: 'custom', message: 'A hierarquia de agrupamentos contém um ciclo.' })
        break
      }
      seen.add(parentId)
      parentId = snapshot.groups.find(item => item.id === parentId)?.parentId ?? null
    }
  }
  for (const node of snapshot.nodes) {
    if (!groupIds.has(node.groupId) || !node.labelIds.every(id => labelIds.has(id)) ||
        !node.groupTagIds.every(id => groupIds.has(id)))
      ctx.addIssue({ code: 'custom', message: 'Um nó contém referências inválidas.' })
  }
  const pairs = new Set<string>()
  for (const dependency of snapshot.dependencies) {
    const pair = `${dependency.fromNodeId}>${dependency.toNodeId}`
    if (!nodeIds.has(dependency.fromNodeId) || !nodeIds.has(dependency.toNodeId) ||
        dependency.fromNodeId === dependency.toNodeId || pairs.has(pair))
      ctx.addIssue({ code: 'custom', message: 'Uma ligação de precedência é inválida ou repetida.' })
    pairs.add(pair)
  }
  if (hasDirectedCycle(snapshot.dependencies))
    ctx.addIssue({ code: 'custom', message: 'As ligações de precedência não podem formar ciclos.' })
})

export const scenarioVersionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  note: z.string().max(500),
  createdAt: z.iso.datetime(),
  snapshot: scenarioSnapshotSchema,
})

export const scenarioDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  documentId: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  source: z.object({
    fileName: z.string().min(1),
    sheet: z.string().min(1),
    importedAt: z.iso.datetime(),
    notes: z.string().max(1_000),
  }),
  revision: z.number().int().nonnegative(),
  activeVersionId: z.string().min(1),
  dirty: z.boolean(),
  draft: scenarioSnapshotSchema,
  versions: z.array(scenarioVersionSchema).min(1),
}).superRefine((document, ctx) => {
  if (!document.versions.some(version => version.id === document.activeVersionId))
    ctx.addIssue({ code: 'custom', message: 'A versão activa não existe.' })
  if (new Set(document.versions.map(version => version.id)).size !== document.versions.length)
    ctx.addIssue({ code: 'custom', message: 'Existem versões com identificadores repetidos.' })
})

export const nodeDetailsSchema = z.object({
  title: z.string().trim().min(1, 'Indique um nome.').max(300, 'Utilize até 300 caracteres.'),
  description: z.string().max(2_000, 'Utilize até 2 000 caracteres.'),
})

export const groupDetailsSchema = z.object({
  title: z.string().trim().min(1, 'Indique um nome.').max(160, 'Utilize até 160 caracteres.'),
})
