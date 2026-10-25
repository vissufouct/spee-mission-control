import { scenarioDocumentSchema } from '../schemas/scenario.schema'
import { applyScenarioCommand } from '../services/scenario.commands'
import type { ScenarioRepository } from '../services/ScenarioRepository'
import type { ScenarioDocument, ScenarioDocumentCommand } from '../types'

export interface JsonStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const STORAGE_KEY = 'spee.scenario-editor.v1'

export class JsonScenarioRepository implements ScenarioRepository {
  private readonly seed: ScenarioDocument
  constructor(seed: unknown, private readonly storage: JsonStorage) {
    this.seed = scenarioDocumentSchema.parse(seed)
  }

  private read() {
    try {
      const stored = this.storage.getItem(STORAGE_KEY)
      return stored === null ? structuredClone(this.seed) : scenarioDocumentSchema.parse(JSON.parse(stored))
    } catch {
      throw new Error('Não foi possível ler o roteiro local. Os dados guardados permanecem intactos; importe um JSON válido ou limpe o armazenamento deste protótipo.')
    }
  }

  private write(document: ScenarioDocument) {
    const parsed = scenarioDocumentSchema.parse(document)
    try { this.storage.setItem(STORAGE_KEY, JSON.stringify(parsed)) }
    catch { throw new Error('Não foi possível guardar neste browser. Verifique o espaço e as permissões de armazenamento.') }
    return structuredClone(parsed)
  }

  async getDocument() { return this.read() }

  async execute(command: ScenarioDocumentCommand, expectedRevision: number) {
    if (command.type === 'reset') {
      const reset = structuredClone(this.seed)
      try { reset.revision = this.read().revision + 1 } catch { reset.revision = 1 }
      return this.write(reset)
    }
    const current = this.read()
    if (current.revision !== expectedRevision)
      throw new Error('O roteiro foi alterado noutra vista. Actualize a página antes de continuar.')
    if (command.type === 'import') {
      let imported: ScenarioDocument
      try {
        if (command.json.length > 8_000_000) throw new Error('size')
        imported = scenarioDocumentSchema.parse(JSON.parse(command.json))
      } catch { throw new Error('Ficheiro inválido. Utilize um roteiro JSON SPEE da versão 1, até 8 MB.') }
      imported.revision = current.revision + 1
      return this.write(imported)
    }
    if (command.type === 'save-version') {
      const version = {
        id: crypto.randomUUID(),
        name: command.name.trim() || `Versão ${current.versions.length + 1}`,
        note: command.note.trim(),
        createdAt: new Date().toISOString(),
        snapshot: structuredClone(current.draft),
      }
      current.versions.push(version)
      current.activeVersionId = version.id
      current.dirty = false
    } else if (command.type === 'switch-version') {
      const version = current.versions.find(item => item.id === command.versionId)
      if (!version) throw new Error('A versão seleccionada já não existe.')
      current.activeVersionId = version.id
      current.draft = structuredClone(version.snapshot)
      current.dirty = false
    } else {
      current.draft = applyScenarioCommand(current.draft, command, () => crypto.randomUUID())
      current.dirty = true
    }
    current.revision += 1
    return this.write(current)
  }

  async exportDocument() {
    return JSON.stringify(this.read(), null, 2)
  }
}
