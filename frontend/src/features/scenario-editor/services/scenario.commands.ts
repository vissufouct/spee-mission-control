import { scenarioSnapshotSchema } from '../schemas/scenario.schema'
import type { ScenarioCommand, ScenarioSnapshot } from '../types'

const palette = ['#0f766e', '#1d4ed8', '#7c3aed', '#b45309', '#be123c', '#047857']

function clone(snapshot: ScenarioSnapshot) {
  return structuredClone(snapshot)
}

function nextPosition(items: { position: { x: number; y: number } }[]) {
  const index = items.length
  return { x: 60 + (index % 3) * 310, y: 70 + Math.floor(index / 3) * 155 }
}

function descendants(snapshot: ScenarioSnapshot, groupId: string) {
  const ids = new Set([groupId])
  let changed = true
  while (changed) {
    changed = false
    for (const group of snapshot.groups) {
      if (group.parentId && ids.has(group.parentId) && !ids.has(group.id)) {
        ids.add(group.id)
        changed = true
      }
    }
  }
  return ids
}

export function createsDependencyCycle(snapshot: ScenarioSnapshot, fromNodeId: string, toNodeId: string) {
  const next = new Map<string, string[]>()
  for (const dependency of snapshot.dependencies)
    next.set(dependency.fromNodeId, [...(next.get(dependency.fromNodeId) ?? []), dependency.toNodeId])
  next.set(fromNodeId, [...(next.get(fromNodeId) ?? []), toNodeId])
  const stack = [toNodeId]
  const seen = new Set<string>()
  while (stack.length) {
    const current = stack.pop()!
    if (current === fromNodeId) return true
    if (seen.has(current)) continue
    seen.add(current)
    stack.push(...(next.get(current) ?? []))
  }
  return false
}

export function applyScenarioCommand(snapshot: ScenarioSnapshot, command: ScenarioCommand, createId: () => string) {
  const next = clone(snapshot)
  const node = 'nodeId' in command ? next.nodes.find(item => item.id === command.nodeId) : undefined
  const group = 'groupId' in command ? next.groups.find(item => item.id === command.groupId) : undefined
  switch (command.type) {
    case 'add-node': {
      if (!next.groups.some(item => item.id === command.groupId)) throw new Error('O agrupamento seleccionado já não existe.')
      const siblings = next.nodes.filter(item => item.groupId === command.groupId)
      next.nodes.push({ id: createId(), title: command.title.trim() || 'Novo nó', description: '', groupId: command.groupId,
        position: nextPosition(siblings), labelIds: [], groupTagIds: [] })
      break
    }
    case 'update-node':
      if (!node) throw new Error('O nó seleccionado já não existe.')
      Object.assign(node, command.values)
      break
    case 'delete-node':
      if (!node) throw new Error('O nó seleccionado já não existe.')
      next.nodes = next.nodes.filter(item => item.id !== command.nodeId)
      next.dependencies = next.dependencies.filter(item => item.fromNodeId !== command.nodeId && item.toNodeId !== command.nodeId)
      break
    case 'move-node':
      if (!node) throw new Error('O nó seleccionado já não existe.')
      node.position = command.position
      break
    case 'swap-nodes': {
      if (!node) throw new Error('O nó arrastado já não existe.')
      const target = next.nodes.find(item => item.id === command.targetNodeId)
      if (!target || target.groupId !== node.groupId) throw new Error('Só é possível trocar nós dentro do mesmo agrupamento.')
      const original = node.position
      node.position = target.position
      target.position = original
      break
    }
    case 'set-node-group':
      if (!node || !next.groups.some(item => item.id === command.groupId)) throw new Error('O nó ou agrupamento já não existe.')
      node.groupId = command.groupId
      node.position = nextPosition(next.nodes.filter(item => item.groupId === command.groupId))
      break
    case 'add-group': {
      if (command.parentId && !next.groups.some(item => item.id === command.parentId)) throw new Error('O agrupamento superior já não existe.')
      const siblings = next.groups.filter(item => item.parentId === command.parentId)
      next.groups.push({ id: createId(), title: command.title.trim() || 'Novo agrupamento', parentId: command.parentId,
        position: nextPosition(siblings) })
      break
    }
    case 'update-group':
      if (!group) throw new Error('O agrupamento seleccionado já não existe.')
      Object.assign(group, command.values)
      break
    case 'delete-group': {
      if (!group) throw new Error('O agrupamento seleccionado já não existe.')
      const removedGroups = descendants(next, command.groupId)
      const removedNodes = new Set(next.nodes.filter(item => removedGroups.has(item.groupId)).map(item => item.id))
      next.groups = next.groups.filter(item => !removedGroups.has(item.id))
      next.nodes = next.nodes.filter(item => !removedNodes.has(item.id)).map(item => ({
        ...item, groupTagIds: item.groupTagIds.filter(id => !removedGroups.has(id)),
      }))
      next.dependencies = next.dependencies.filter(item => !removedNodes.has(item.fromNodeId) && !removedNodes.has(item.toNodeId))
      if (!next.groups.length) throw new Error('O roteiro tem de conservar pelo menos um agrupamento.')
      break
    }
    case 'move-group':
      if (!group) throw new Error('O agrupamento seleccionado já não existe.')
      group.position = command.position
      break
    case 'add-label': {
      const name = command.name.trim()
      if (!name) throw new Error('Indique um nome para a etiqueta.')
      if (next.labels.some(item => item.name.toLocaleLowerCase('pt-PT') === name.toLocaleLowerCase('pt-PT')))
        throw new Error('Já existe uma etiqueta com este nome.')
      next.labels.push({ id: createId(), name, color: palette[next.labels.length % palette.length] })
      break
    }
    case 'rename-label': {
      const label = next.labels.find(item => item.id === command.labelId)
      if (!label) throw new Error('A etiqueta já não existe.')
      label.name = command.name.trim()
      break
    }
    case 'toggle-label':
      if (!node || !next.labels.some(item => item.id === command.labelId)) throw new Error('O nó ou etiqueta já não existe.')
      node.labelIds = command.assigned
        ? [...new Set([...node.labelIds, command.labelId])]
        : node.labelIds.filter(id => id !== command.labelId)
      break
    case 'toggle-group-tag':
      if (!node || !next.groups.some(item => item.id === command.groupId)) throw new Error('O nó ou agrupamento já não existe.')
      node.groupTagIds = command.assigned
        ? [...new Set([...node.groupTagIds, command.groupId])]
        : node.groupTagIds.filter(id => id !== command.groupId)
      break
    case 'convert-label': {
      const label = next.labels.find(item => item.id === command.labelId)
      if (!label) throw new Error('A etiqueta já não existe.')
      if (command.parentGroupId && !next.groups.some(item => item.id === command.parentGroupId))
        throw new Error('O agrupamento superior já não existe.')
      const siblings = next.groups.filter(item => item.parentId === command.parentGroupId)
      const groupId = createId()
      next.groups.push({ id: groupId, title: label.name, parentId: command.parentGroupId, position: nextPosition(siblings) })
      next.nodes = next.nodes.map(item => item.labelIds.includes(label.id) ? {
        ...item,
        labelIds: item.labelIds.filter(id => id !== label.id),
        groupTagIds: [...new Set([...item.groupTagIds, groupId])],
      } : item)
      next.labels = next.labels.filter(item => item.id !== label.id)
      break
    }
    case 'add-dependency':
      if (!next.nodes.some(item => item.id === command.fromNodeId) || !next.nodes.some(item => item.id === command.toNodeId))
        throw new Error('Um dos nós da ligação já não existe.')
      if (command.fromNodeId === command.toNodeId) throw new Error('Um nó não pode depender de si próprio.')
      if (next.dependencies.some(item => item.fromNodeId === command.fromNodeId && item.toNodeId === command.toNodeId))
        throw new Error('Esta precedência já existe.')
      if (createsDependencyCycle(next, command.fromNodeId, command.toNodeId))
        throw new Error('A ligação criaria um ciclo de precedências.')
      next.dependencies.push({ id: createId(), fromNodeId: command.fromNodeId, toNodeId: command.toNodeId })
      break
    case 'delete-dependency':
      next.dependencies = next.dependencies.filter(item => item.id !== command.dependencyId)
      break
  }
  return scenarioSnapshotSchema.parse(next)
}
