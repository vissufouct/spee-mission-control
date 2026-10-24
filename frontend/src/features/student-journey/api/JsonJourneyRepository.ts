import { draftSchema, journeySnapshotSchema, registrationSchema } from '../schemas/journey.schema'
import type { JourneyRepository } from '../services/JourneyRepository'
import type { JourneySnapshot, RegistrationValues } from '../types'

export interface JsonStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
const STORAGE_KEY = 'spee.student-journey.v1'

/** Only this adapter knows the storage format and storage key. */
export class JsonJourneyRepository implements JourneyRepository {
  private readonly seed: JourneySnapshot
  constructor(seed: unknown, private readonly storage: JsonStorage) {
    this.seed = journeySnapshotSchema.parse(seed)
  }
  private read() {
    try {
      const stored = this.storage.getItem(STORAGE_KEY)
      return stored === null ? structuredClone(this.seed) : journeySnapshotSchema.parse(JSON.parse(stored))
    } catch {
      throw new Error('Não foi possível ler os dados locais. Pode repor o cenário inicial; os dados actuais não foram alterados.')
    }
  }
  async getSnapshot() { return this.read() }
  async sendGroupMessage(activityId: string, message: string, assignee: string | null, revision: number) {
    return this.commit(revision, current => {
      if (!current.blocks.some(b => b.activities.some(a => a.id === activityId))) throw new Error('Actividade inexistente.')
      if (!message.trim() || message.length > 2000) throw new Error('Escreva uma mensagem até 2000 caracteres.')
      if (assignee && !current.members.includes(assignee)) throw new Error('Seleccione um membro da empresa.')
      current.groupMessages.push({ id: crypto.randomUUID(), activityId, author: current.context.studentName, message: message.trim(), createdAt: new Date().toISOString(), assignee, doneAt: null })
    })
  }
  async completeTask(id: string, revision: number) {
    return this.commit(revision, current => {
      const task = current.groupMessages.find(item => item.id === id)
      if (!task || task.assignee !== current.context.studentName) throw new Error('Só o responsável pode marcar a tarefa como feita.')
      if (!task.doneAt) task.doneAt = new Date().toISOString()
    })
  }
  async resolveNotification(id: string, revision: number) {
    return this.commit(revision, current => {
      const group = current.groupMessages.find(item => item.id === id)
      if (group && (group.author === current.context.studentName || (group.assignee && group.assignee !== current.context.studentName))) throw new Error('Esta notificação não lhe é destinada.')
      if (!current.resolvedNotifications.some(item => item.id === id && item.recipient === current.context.studentName)) current.resolvedNotifications.push({ id, recipient: current.context.studentName })
    })
  }
  private async commit(expectedRevision: number, change: (current: JourneySnapshot) => void) {
    // Read/check/write in one synchronous turn: concurrent calls cannot share a stale revision.
    const current = this.read()
    if (current.revision !== expectedRevision)
      throw new Error('Os dados foram alterados noutra vista. Actualize a página antes de continuar.')
    change(current)
    current.revision += 1
    return this.write(current)
  }
  private write(snapshot: JourneySnapshot) {
    const parsed = journeySnapshotSchema.parse(snapshot)
    try { this.storage.setItem(STORAGE_KEY, JSON.stringify(parsed)) }
    catch { throw new Error('Não foi possível guardar neste browser. Nenhuma alteração foi confirmada. Verifique o espaço e as permissões de armazenamento.') }
    return structuredClone(parsed)
  }
  private event(snapshot: JourneySnapshot, type: string, message: string) {
    snapshot.events.push({ id: crypto.randomUUID(), type, message, actor: snapshot.context.studentName, occurredAt: new Date().toISOString() })
  }
  private validateDraft(data: RegistrationValues) {
    const result = draftSchema.safeParse(data)
    if (!result.success) throw new Error('Não foi possível guardar o rascunho. Verifique o comprimento dos campos e indique um capital entre 0 e 1 000 000 000 MZN.')
    return result.data
  }
  async createRegistration(data: RegistrationValues, expectedRevision: number) {
    const parsed = this.validateDraft(data)
    return this.commit(expectedRevision, current => {
      if (current.registration) throw new Error('Já existe um registo. Abra-o para editar.')
      current.registration = { id: crypto.randomUUID(), status: 'draft', data: parsed, updatedAt: new Date().toISOString(), receiptNumber: null }
      this.event(current, 'registration.created', 'Rascunho da empresa criado.')
    })
  }
  async updateRegistration(data: RegistrationValues, expectedRevision: number) {
    const parsed = this.validateDraft(data)
    return this.commit(expectedRevision, current => {
      if (!current.registration) throw new Error('O rascunho já não existe.')
      if (current.registration.status === 'confirmed') throw new Error('Um registo confirmado é apenas de consulta nesta experiência.')
      current.registration.data = parsed
      current.registration.updatedAt = new Date().toISOString()
      this.event(current, 'registration.updated', 'Dados do rascunho actualizados.')
    })
  }
  async removeRegistration(expectedRevision: number) {
    return this.commit(expectedRevision, current => {
      if (!current.registration || current.registration.status === 'confirmed')
        throw new Error('Só é possível eliminar um rascunho.')
      current.registration = null
      this.event(current, 'registration.removed', 'Rascunho eliminado; a actividade voltou a estar disponível.')
    })
  }
  async confirmRegistration(expectedRevision: number) {
    return this.commit(expectedRevision, current => {
      if (!current.registration) throw new Error('Guarde os dados da empresa antes de confirmar.')
      if (current.registration.status === 'confirmed') throw new Error('Este registo já está confirmado.')
      if (!registrationSchema.safeParse(current.registration.data).success)
        throw new Error('Preencha os dados obrigatórios antes de confirmar o registo.')
      current.registration.status = 'confirmed'
      current.registration.receiptNumber = 'REG-' + new Date().getUTCFullYear() + '-' + current.registration.id.slice(0, 8).toUpperCase()
      current.registration.updatedAt = new Date().toISOString()
      this.event(current, 'registration.confirmed', 'Registo confirmado e comprovativo de constituição gerado na simulação local.')
    })
  }
  async importSnapshot(json: string, expectedRevision: number) {
    let imported: JourneySnapshot
    try {
      if (json.length > 2_000_000) throw new Error('size')
      imported = journeySnapshotSchema.parse(JSON.parse(json))
    } catch { throw new Error('Ficheiro inválido. Utilize um cenário JSON SPEE da versão 1, até 2 MB.') }
    return this.commit(expectedRevision, current => {
      const revision = current.revision
      Object.assign(current, imported, { revision })
      this.event(current, 'scenario.imported', 'Cenário importado para este browser.')
    })
  }
  async exportSnapshot() { return JSON.stringify(await this.getSnapshot(), null, 2) }
  async reset() {
    const initial = structuredClone(this.seed)
    try { initial.revision = this.read().revision + 1 } catch { /* Explicit recovery from unreadable local data. */ }
    return this.write(initial)
  }
}
