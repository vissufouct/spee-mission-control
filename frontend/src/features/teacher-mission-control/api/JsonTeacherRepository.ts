import { generalOrientationInputSchema, orientationInputSchema, requestReplySchema, teacherSnapshotSchema } from '../schemas/teacher.schema'
import type { LinkedCompanyReader, TeacherRepository } from '../services/TeacherRepository'
import type { GeneralOrientationInput, OrientationInput, RequestReply, TeacherSnapshot } from '../types'

interface JsonStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
const KEY = 'spee.teacher-mission-control.v1'

export class JsonTeacherRepository implements TeacherRepository {
  private readonly seed: TeacherSnapshot
  constructor(seed: unknown, private readonly storage: JsonStorage, private readonly linkedCompany?: LinkedCompanyReader) {
    this.seed = teacherSnapshotSchema.parse(seed)
  }
  private read() {
    try {
      const raw = this.storage.getItem(KEY)
      return raw === null ? structuredClone(this.seed) : teacherSnapshotSchema.parse(JSON.parse(raw))
    } catch { throw new Error('Não foi possível ler o cenário do docente. Os dados locais não foram alterados.') }
  }
  private async hydrate(snapshot: TeacherSnapshot) {
    if (this.linkedCompany) {
      try {
        const linked = await this.linkedCompany()
        snapshot.companies = snapshot.companies.map(company => company.id === linked.id ? linked : company)
      } catch { throw new Error('Não foi possível actualizar a empresa ligada ao estudante. Verifique os dados do Meu Percurso e tente novamente.') }
    }
    return teacherSnapshotSchema.parse(snapshot)
  }
  async getSnapshot() { return this.hydrate(this.read()) }
  async receiveStudentMessage(companyId: string, activityId: string, author: string, message: string, revision: number) {
    const parsed = requestReplySchema.parse({ message })
    return this.commit(revision, snapshot => {
      const company = snapshot.companies.find(c => c.id === companyId)
      const activity = company?.activities.find(a => a.id === activityId)
      if (!activity) throw new Error('Actividade inexistente nesta empresa.')
      const now = new Date().toISOString()
      let request = snapshot.orientationRequests.find(r => r.companyId === companyId && r.activityId === activityId)
      if (!request) {
        request = { id: crypto.randomUUID(), companyId, activityId, subject: activity.title, status: 'awaiting-teacher', createdAt: now, updatedAt: now, concludedAt: null, messages: [] }
        snapshot.orientationRequests.push(request)
      }
      request.messages.push({ id: crypto.randomUUID(), role: 'student', author, message: parsed.message, occurredAt: now })
      request.status = 'awaiting-teacher'
      request.concludedAt = null
      request.updatedAt = now
    })
  }
  private write(snapshot: TeacherSnapshot) {
    const parsed = teacherSnapshotSchema.parse(snapshot)
    try { this.storage.setItem(KEY, JSON.stringify(parsed)) }
    catch { throw new Error('Não foi possível guardar a alteração neste browser. Nenhuma alteração foi confirmada.') }
    return structuredClone(parsed)
  }
  private commit(revision: number, change: (snapshot: TeacherSnapshot) => void) {
    const snapshot = this.read()
    if (snapshot.revision !== revision) throw new Error('O cenário foi alterado noutra vista. Actualize os dados antes de continuar.')
    change(snapshot)
    snapshot.revision++
    return this.write(snapshot)
  }
  private audit(snapshot: TeacherSnapshot, id: string, action: TeacherSnapshot['audit'][number]['action'], previousState: string | null) {
    const note = snapshot.orientations.find(item => item.id === id)!
    snapshot.audit.push({
      id: crypto.randomUUID(), orientationId: id, companyId: note.companyId, actor: snapshot.context.teacherName,
      role: 'teacher', occurredAt: new Date().toISOString(), reason: note.reason, action,
      previousState, newState: action === 'removed' ? 'removed' : note.status,
    })
  }
  async saveOrientation(input: OrientationInput, revision: number, id?: string) {
    const parsed = orientationInputSchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)
    // Check the linked context before writing, so errors cannot occur after a successful commit.
    await this.getSnapshot()
    const saved = this.commit(revision, snapshot => {
      const company = snapshot.companies.find(c => c.id === input.companyId)
      if (!company?.activities.some(a => a.id === input.activityId)) throw new Error('Seleccione uma actividade desta empresa.')
      const note = id ? snapshot.orientations.find(item => item.id === id) : null
      if (id && (!note || note.status !== 'draft')) throw new Error('Só é possível editar um rascunho.')
      if (note && note.companyId !== input.companyId) throw new Error('Não é possível mudar a empresa de uma orientação.')
      const now = new Date().toISOString()
      if (note) {
        Object.assign(note, parsed.data, { updatedAt: now })
        this.audit(snapshot, note.id, 'updated', 'draft')
      } else {
        const newId = crypto.randomUUID()
        snapshot.orientations.push({ ...parsed.data, id: newId, status: 'draft', author: snapshot.context.teacherName, createdAt: now, updatedAt: now })
        this.audit(snapshot, newId, 'created', null)
      }
    })
    // Queries refresh and hydrate the linked source; never install this raw snapshot in the UI cache.
    return saved
  }
  async removeOrientation(id: string, revision: number) {
    return this.commit(revision, snapshot => {
      const note = snapshot.orientations.find(item => item.id === id)
      if (!note || note.status !== 'draft') throw new Error('Só é possível eliminar um rascunho.')
      this.audit(snapshot, id, 'removed', 'draft')
      snapshot.orientations = snapshot.orientations.filter(item => item.id !== id)
    })
  }
  async recordOrientation(id: string, revision: number) {
    return this.commit(revision, snapshot => {
      const note = snapshot.orientations.find(item => item.id === id)
      if (!note || note.status !== 'draft') throw new Error('Esta orientação já foi registada ou não existe.')
      note.status = 'recorded'
      note.updatedAt = new Date().toISOString()
      this.audit(snapshot, id, 'recorded', 'draft')
    })
  }
  async replyToOrientationRequest(id: string, input: RequestReply, revision: number) {
    const parsed = requestReplySchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)
    return this.commit(revision, snapshot => {
      const request = snapshot.orientationRequests.find(item => item.id === id)
      if (!request) throw new Error('O pedido de orientação já não existe.')
      if (request.status === 'concluded') throw new Error('Reabra o pedido antes de acrescentar uma resposta.')
      const now = new Date().toISOString()
      request.messages.push({ id: crypto.randomUUID(), role: 'teacher', author: snapshot.context.teacherName, message: parsed.data.message, occurredAt: now })
      request.status = 'awaiting-student'
      request.updatedAt = now
    })
  }
  async concludeOrientationRequest(id: string, revision: number) {
    return this.commit(revision, snapshot => {
      const request = snapshot.orientationRequests.find(item => item.id === id)
      if (!request) throw new Error('O pedido de orientação já não existe.')
      const now = new Date().toISOString()
      request.status = 'concluded'
      request.concludedAt = now
      request.updatedAt = now
    })
  }
  async publishGeneralOrientation(input: GeneralOrientationInput, revision: number) {
    const parsed = generalOrientationInputSchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)
    return this.commit(revision, snapshot => {
      if (!parsed.data.classIds.every(id => snapshot.classes.some(item => item.id === id)))
        throw new Error('Seleccione apenas turmas disponíveis neste ciclo.')
      snapshot.generalOrientations.push({ ...parsed.data, id: crypto.randomUUID(), author: snapshot.context.teacherName, createdAt: new Date().toISOString() })
    })
  }
  async reset() {
    const initial = structuredClone(this.seed)
    try { initial.revision = this.read().revision + 1 } catch { /* Explicit recovery. */ }
    return this.write(initial)
  }
}
