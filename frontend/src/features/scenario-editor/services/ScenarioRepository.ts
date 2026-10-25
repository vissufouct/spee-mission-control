import type { ScenarioDocument, ScenarioDocumentCommand } from '../types'

export interface ScenarioRepository {
  getDocument(): Promise<ScenarioDocument>
  execute(command: ScenarioDocumentCommand, expectedRevision: number): Promise<ScenarioDocument>
  exportDocument(): Promise<string>
}
