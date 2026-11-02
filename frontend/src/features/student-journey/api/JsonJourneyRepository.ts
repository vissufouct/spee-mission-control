import { prepareDemoPrerequisites } from '../services/prepare-demo-prerequisites'
import { draftSchema, evidenceFileSchema, journeySnapshotSchema, registrationSchema } from '../schemas/journey.schema'
import type { EvidenceFile, JourneyRepository } from '../services/JourneyRepository'
import type { JourneySnapshot, LearningTask, RegistrationValues } from '../types'
import { getLearningTasks, quizPassed } from '../services/learning-tasks'
import { getActivityStatus } from '../services/journey.selectors'

export interface JsonStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
const STORAGE_KEY = 'spee.student-journey.v1'
const legacyParticipation = [
  ['Ana Machava', 'Coordenação da actividade, revisão e submissão dos resultados.'],
  ['João Tembe', 'Pesquisa, preparação dos dados e conferência das fontes.'],
  ['António Sitoe', 'Organização dos documentos e verificação com a equipa.'],
]

/** Only this adapter knows the storage format and storage key. */
export class JsonJourneyRepository implements JourneyRepository {
  private readonly seed: JourneySnapshot
  constructor(seed: unknown, private readonly storage: JsonStorage, private readonly storageKey = STORAGE_KEY, private readonly demoPrerequisites = false) {
    this.seed = journeySnapshotSchema.parse(seed)
  }
  private read() {
    try {
      const stored = this.storage.getItem(this.storageKey)
      const snapshot = stored === null ? structuredClone(this.seed) : journeySnapshotSchema.parse(JSON.parse(stored))
      const savedTasks = new Map(snapshot.blocks.flatMap(block => block.activities.flatMap(activity => activity.tasks ?? [])).map(task => [task.id, task]))
      const definedIds = new Set(this.seed.blocks.flatMap(block => block.activities.flatMap(activity => activity.tasks ?? [])).map(task => task.id))
      const supplier = savedTasks.get('b03-a03-t01')
      const aggregateSupplier = supplier && (supplier.links?.length === 4 || supplier.title === 'Contratar fornecedores') ? supplier : undefined
      // Backfill metadata; refresh only the exact old participation fixture, never custom data.
      for (const block of snapshot.blocks) for (const activity of block.activities) {
        const initial = this.seed.blocks.flatMap(b => b.activities).find(a => a.id === activity.id)
        if (initial) {
          activity.steps ??= structuredClone(initial.steps)
          activity.tasks ??= structuredClone(initial.tasks)
          for (const task of activity.tasks ?? []) {
            const original = initial.tasks?.find(item => item.id === task.id)
            if (original?.resource === task.resource) task.preview ??= original?.preview
            task.simulatedParticipants ??= structuredClone(original?.simulatedParticipants)
          }
          // Merge approved roadmap definitions by stable ID, preserving learner records.
          if (snapshot.context.roadmapVersion && initial.tasks && activity.tasks) {
            const saved = savedTasks
            activity.tasks = initial.tasks.map<LearningTask>(definition => {
              const existing = saved.get(definition.id) ?? (['b03-a03-t03', 'b03-a03-t04', 'b03-a03-t05'].includes(definition.id) ? aggregateSupplier : undefined)
              if (!existing) return { ...structuredClone(definition), status: 'not-started' as const, completedAt: undefined, answers: undefined, submission: undefined }
              return definition.links ? { ...existing, id: definition.id, title: definition.title, description: definition.description,
                links: structuredClone(definition.links), ...(definition.resource ? { resource: definition.resource } : {}) } : existing
            }).concat(activity.tasks.filter(task => !definedIds.has(task.id)))
          }
          // Add the two approved Ideation examples without replacing existing answers or submissions.
          if (['definir-ideia', 'registar-empresa'].includes(activity.id) && activity.tasks) {
            for (const task of initial.tasks ?? []) if (['entrepreneur-diagnostic', 'audit-report-1', 'registration-declaration'].includes(task.id) && !activity.tasks.some(existing => existing.id === task.id)) activity.tasks.push(structuredClone(task))
            const first = activity.id === 'definir-ideia' ? 'entrepreneur-diagnostic' : 'registration-quiz'
            const rank = (id: string) => id === first ? -1 : id === 'registration-declaration' ? 1 : 0
            activity.tasks.sort((a, b) => rank(a.id) - rank(b.id))
          }
          const participants = activity.simulatedParticipants
          const isLegacyParticipation = participants?.length === legacyParticipation.length && legacyParticipation.every(([name, contribution]) => participants.some(person => person.name === name && person.contribution === contribution))
          if (!participants?.length || isLegacyParticipation) activity.simulatedParticipants = structuredClone(initial.simulatedParticipants)
          activity.materials ??= structuredClone(initial.materials)
          activity.previousIds ??= structuredClone(initial.previousIds)
          activity.nextIds ??= structuredClone(initial.nextIds)
        }
      }
      if (this.demoPrerequisites) prepareDemoPrerequisites(snapshot)
      return this.refreshRoadmap(snapshot)
    } catch {
      throw new Error('Não foi possível ler os dados locais. Os dados actuais não foram alterados. Verifique o armazenamento do browser antes de tentar novamente.')
    }
  }
  async getSnapshot() { return this.read() }
  async completeLearningTask(activityId: string, taskId: string, answers: Record<string, number> | undefined, revision: number, file?: EvidenceFile) {
    return this.commit(revision, current => {
      const activity = current.blocks.flatMap(block => block.activities).find(item => item.id === activityId)
      const task = activity?.tasks?.find(item => item.id === taskId)
      if (!activity || !task) throw new Error('Tarefa inexistente.')
      if (task.kind === 'operation' && activity.id === 'registar-empresa' && (!current.context.roadmapVersion || task.id === 'b03-a01-t05')) throw new Error('Esta tarefa exige confirmação no módulo da operação.')
      if (getLearningTasks(activity, current).find(item => item.id === taskId)?.status === 'blocked') throw new Error('A tarefa está bloqueada.')
      if (task.status === 'completed') return
      if (task.kind === 'evidence') {
        if (file) {
          const parsed = evidenceFileSchema.safeParse(file)
          if (!parsed.success || !(task.accepts ?? ['pdf']).includes(file.fileName.split('.').at(-1)!.toLowerCase() as 'pdf' | 'docx' | 'xlsx')) throw new Error('Seleccione um ficheiro num dos formatos permitidos, até 2 MB.')
        } else if (!/\.(pdf|docx|xlsx)$/.test(task.resource ?? '')) throw new Error('Seleccione um ficheiro para submeter.')
        task.submission = { fileName: file?.fileName ?? task.resource!.split('/').at(-1)!, submittedBy: current.context.studentName, submittedAt: new Date().toISOString(), ...(file ? { file } : {}) }
      }
      if (task.kind === 'quiz' && !quizPassed(task, answers ?? {})) throw new Error(`Reveja as respostas: responda a todas as perguntas e obtenha pelo menos ${task.passPercent ?? 100}%. Pode tentar novamente.`)
      task.status = 'completed'
      task.completedAt = new Date().toISOString()
      if (task.kind === 'quiz') task.answers = answers
      this.event(current, 'learning-task.completed', `${activity.title}: ${task.title} — conclusão confirmada.`)
      Object.assign(current.events.at(-1)!, { activityId, activityStatus: getActivityStatus(activity, current) })
    })
  }
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
    return this.write(this.refreshRoadmap(current))
  }
  private refreshRoadmap(snapshot: JourneySnapshot) {
    if (!snapshot.context.roadmapVersion) return snapshot
    for (const block of snapshot.blocks) {
      const states = block.activities.map(activity => getActivityStatus(activity, snapshot))
      block.state = !states.length ? 'unavailable' : states.every(state => state === 'completed') ? 'completed' : states.some(state => ['completed', 'in-progress'].includes(state)) ? 'in-progress' : states.every(state => state === 'blocked') ? 'blocked' : 'not-started'
    }
    const next = snapshot.blocks.find(block => block.activities.length && block.state !== 'completed')
    if (next) snapshot.context.currentBlockId = next.id
    return snapshot
  }
  private write(snapshot: JourneySnapshot) {
    const parsed = journeySnapshotSchema.parse(snapshot)
    try { this.storage.setItem(this.storageKey, JSON.stringify(parsed)) }
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
  private registrationTask(current: JourneySnapshot) {
    if (!current.context.roadmapVersion) return undefined
    const activity = current.blocks.flatMap(block => block.activities).find(item => item.id === 'registar-empresa')
    const task = activity?.tasks?.find(item => item.id === 'b03-a01-t05')
    if (!activity || !task || getLearningTasks(activity, current).find(item => item.id === task.id)?.status === 'blocked')
      throw new Error('Conclua as tarefas anteriores à inscrição da empresa.')
    return task
  }
  async createRegistration(data: RegistrationValues, expectedRevision: number) {
    const parsed = this.validateDraft(data)
    return this.commit(expectedRevision, current => {
      if (current.registration) throw new Error('Já existe um registo. Abra-o para editar.')
      const task = this.registrationTask(current)
      if (task) task.status = 'in-progress'
      current.registration = { id: crypto.randomUUID(), status: 'draft', data: parsed, updatedAt: new Date().toISOString(), receiptNumber: null }
      this.event(current, 'registration.created', 'Rascunho da empresa criado.')
    })
  }
  async updateRegistration(data: RegistrationValues, expectedRevision: number) {
    const parsed = this.validateDraft(data)
    return this.commit(expectedRevision, current => {
      if (!current.registration) throw new Error('O rascunho já não existe.')
      if (current.registration.status === 'confirmed') throw new Error('Um registo confirmado é apenas de consulta nesta experiência.')
      const task = this.registrationTask(current)
      if (task) task.status = 'in-progress'
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
      const task = this.registrationTask(current)
      if (task) task.status = 'not-started'
      this.event(current, 'registration.removed', 'Rascunho eliminado; a actividade voltou a estar disponível.')
    })
  }
  async confirmRegistration(expectedRevision: number) {
    return this.commit(expectedRevision, current => {
      const registrationActivity = current.blocks.flatMap(block => block.activities).find(item => item.id === 'registar-empresa')!
      if (current.context.roadmapVersion && getLearningTasks(registrationActivity, current).find(task => task.id === 'b03-a01-t05')?.status === 'blocked') throw new Error('Conclua as tarefas anteriores à inscrição da empresa.')
      if (!current.registration) throw new Error('Guarde os dados da empresa antes de confirmar.')
      if (current.registration.status === 'confirmed') throw new Error('Este registo já está confirmado.')
      if (!registrationSchema.safeParse(current.registration.data).success)
        throw new Error('Preencha os dados obrigatórios antes de confirmar o registo.')
      current.registration.status = 'confirmed'
      current.registration.receiptNumber = 'REG-' + new Date().getUTCFullYear() + '-' + current.registration.id.slice(0, 8).toUpperCase()
      current.registration.updatedAt = new Date().toISOString()
      const roadmapTask = registrationActivity.tasks?.find(task => task.id === 'b03-a01-t05')
      if (roadmapTask) { roadmapTask.status = 'completed'; roadmapTask.completedAt = current.registration.updatedAt }
      this.event(current, 'registration.confirmed', 'Registo confirmado e comprovativo de constituição gerado na simulação local.')
      const activity = current.blocks.flatMap(block => block.activities).find(item => item.id === 'registar-empresa')!
      Object.assign(current.events.at(-1)!, { activityId: activity.id, activityStatus: getActivityStatus(activity, current) })
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
