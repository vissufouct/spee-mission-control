import { describe, expect, it } from 'vitest'
import { JsonScenarioRepository } from './JsonScenarioRepository'
import type { ScenarioDocument } from '../types'

function seed(): ScenarioDocument {
  const snapshot = {
    groups: [{ id: 'root', title: 'Raiz', parentId: null, position: { x: 0, y: 0 } }],
    nodes: [], dependencies: [], labels: [],
  }
  return {
    schemaVersion: 1, documentId: 'test', title: 'Teste', revision: 0, activeVersionId: 'v1', dirty: false,
    source: { fileName: 'source.xlsx', sheet: 'Roteiro', importedAt: '2026-10-23T00:00:00.000Z', notes: '' },
    draft: snapshot,
    versions: [{ id: 'v1', name: 'Inicial', note: '', createdAt: '2026-10-23T00:00:00.000Z', snapshot }],
  }
}

function repository() {
  const storage = new Map<string, string>()
  return new JsonScenarioRepository(seed(), { getItem: key => storage.get(key) ?? null, setItem: (key, value) => { storage.set(key, value) } })
}

describe('JsonScenarioRepository', () => {
  it('persiste o rascunho, guarda uma versão e volta a carregá-la', async () => {
    const repo = repository()
    const changed = await repo.execute({ type: 'add-node', groupId: 'root', title: 'Primeiro nó' }, 0)
    expect(changed.dirty).toBe(true)
    expect(changed.draft.nodes[0]?.title).toBe('Primeiro nó')
    const saved = await repo.execute({ type: 'save-version', name: 'Revisão 1', note: 'Teste' }, changed.revision)
    expect(saved.dirty).toBe(false)
    expect(saved.versions).toHaveLength(2)
    const moved = await repo.execute({ type: 'add-node', groupId: 'root', title: 'Rascunho posterior' }, saved.revision)
    const restored = await repo.execute({ type: 'switch-version', versionId: saved.activeVersionId }, moved.revision)
    expect(restored.draft.nodes.map(node => node.title)).toEqual(['Primeiro nó'])
  })

  it('rejeita revisões concorrentes e importações inválidas', async () => {
    const repo = repository()
    await repo.execute({ type: 'add-label', name: 'Urgente' }, 0)
    await expect(repo.execute({ type: 'add-label', name: 'Outro' }, 0)).rejects.toThrow(/outra vista/i)
    const current = await repo.getDocument()
    await expect(repo.execute({ type: 'import', json: '{"invalid":true}' }, current.revision)).rejects.toThrow(/Ficheiro inválido/i)
  })
})
