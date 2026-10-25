import { describe, expect, it } from 'vitest'
import { applyScenarioCommand, createsDependencyCycle } from './scenario.commands'
import type { ScenarioSnapshot } from '../types'

const snapshot: ScenarioSnapshot = {
  groups: [
    { id: 'root', title: 'Raiz', parentId: null, position: { x: 0, y: 0 } },
    { id: 'child', title: 'Filho', parentId: 'root', position: { x: 20, y: 20 } },
  ],
  nodes: [
    { id: 'a', title: 'A', description: '', groupId: 'child', position: { x: 10, y: 20 }, labelIds: ['label'], groupTagIds: [] },
    { id: 'b', title: 'B', description: '', groupId: 'child', position: { x: 40, y: 50 }, labelIds: [], groupTagIds: [] },
    { id: 'c', title: 'C', description: '', groupId: 'child', position: { x: 70, y: 80 }, labelIds: [], groupTagIds: [] },
  ],
  labels: [{ id: 'label', name: 'Importante', color: '#1d4ed8' }],
  dependencies: [{ id: 'ab', fromNodeId: 'a', toNodeId: 'b' }],
}

let id = 0
const createId = () => `new-${++id}`

describe('comandos do editor de roteiro', () => {
  it('troca posições sem alterar os identificadores dos nós', () => {
    const result = applyScenarioCommand(snapshot, { type: 'swap-nodes', nodeId: 'a', targetNodeId: 'b' }, createId)
    expect(result.nodes.find(node => node.id === 'a')?.position).toEqual({ x: 40, y: 50 })
    expect(result.nodes.find(node => node.id === 'b')?.position).toEqual({ x: 10, y: 20 })
  })

  it('impede dependências cíclicas', () => {
    const withSecondEdge = applyScenarioCommand(snapshot, { type: 'add-dependency', fromNodeId: 'b', toNodeId: 'c' }, createId)
    expect(createsDependencyCycle(withSecondEdge, 'c', 'a')).toBe(true)
    expect(() => applyScenarioCommand(withSecondEdge, { type: 'add-dependency', fromNodeId: 'c', toNodeId: 'a' }, createId)).toThrow(/ciclo/i)
  })

  it('converte uma etiqueta em agrupamento e preserva a atribuição como etiqueta de grupo', () => {
    const result = applyScenarioCommand(snapshot, { type: 'convert-label', labelId: 'label', parentGroupId: 'root' }, createId)
    const converted = result.groups.find(group => group.title === 'Importante')!
    expect(result.labels).toHaveLength(0)
    expect(result.nodes.find(node => node.id === 'a')?.labelIds).toEqual([])
    expect(result.nodes.find(node => node.id === 'a')?.groupTagIds).toContain(converted.id)
  })

  it('apaga um grupo, descendentes e ligações associadas', () => {
    const result = applyScenarioCommand(snapshot, { type: 'delete-group', groupId: 'child' }, createId)
    expect(result.groups.map(group => group.id)).toEqual(['root'])
    expect(result.nodes).toEqual([])
    expect(result.dependencies).toEqual([])
  })
})
