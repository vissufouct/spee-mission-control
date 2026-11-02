import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import type { TeacherSnapshot } from '../types'

interface Storage { getItem(key: string): string | null; setItem(key: string, value: string): void }
type LegacySource = { key: string; companyId: string }
const KEY = 'spee.roadmap-2026.teacher.shared.v1'

/** Consolidates only relevant communications. Original snapshots remain intact. */
export class RoadmapTeacherStorage {
  constructor(private readonly storage: Storage, private readonly seed: TeacherSnapshot, private readonly sources: LegacySource[]) {}
  getItem() {
    const current = this.storage.getItem(KEY)
    if (current !== null) {
      const snapshot = teacherSnapshotSchema.parse(JSON.parse(current))
      // Extend older two-company scenarios without replacing records or communications.
      snapshot.classes.push(...structuredClone(this.seed.classes.filter(item => !snapshot.classes.some(existing => existing.id === item.id))))
      snapshot.companies.push(...structuredClone(this.seed.companies.filter(item => !snapshot.companies.some(existing => existing.id === item.id))))
      for (const company of snapshot.companies.filter(item => !item.linkedToStudent)) {
        const source = this.seed.companies.find(item => item.id === company.id)
        const savedTasks = new Map(company.activities.flatMap(activity => activity.tasks ?? []).map(task => [task.id, task]))
        const supplier = savedTasks.get('b03-a03-t01')
        const aggregateSupplier = supplier && (supplier.links?.length === 4 || supplier.title === 'Contratar fornecedores') ? supplier : undefined
        for (const activity of company.activities) {
          const definitions = source?.activities.find(item => item.id === activity.id)?.tasks
          if (!definitions) continue
          const existing = savedTasks
          activity.tasks = definitions.map(definition => {
            const saved = existing.get(definition.id) ?? (['b03-a03-t03', 'b03-a03-t04', 'b03-a03-t05'].includes(definition.id) ? aggregateSupplier : undefined)
            if (!saved) return structuredClone(definition)
            return definition.links ? { ...saved, id: definition.id, title: definition.title, description: definition.description, links: definition.links, ...(definition.resource ? { resource: definition.resource } : {}) } : saved
          })
          if (['contratos-servicos', 'preparar-banca'].includes(activity.id)) {
            const states = activity.tasks.filter(task => task.required).map(task => task.status)
            activity.status = states.every(state => state === 'completed') ? 'completed'
              : states.some(state => state === 'completed' || state === 'in-progress') ? 'in-progress'
                : states.every(state => state === 'blocked') ? 'blocked' : 'not-started'
          }
          if (activity.status === 'completed' && activity.tasks.some(task => task.required && task.status !== 'completed')) activity.status = 'in-progress'
        }
        for (const block of company.blocks) {
          const activities = company.activities.filter(activity => activity.blockId === block.id)
          if (activities.length && activities.every(activity => activity.status === 'completed')) block.state = 'completed'
          if (block.state === 'completed' && activities.some(activity => activity.status !== 'completed')) block.state = 'in-progress'
        }
      }
      if (snapshot.demoCommunicationsVersion !== 1) {
        snapshot.orientationRequests.push(...structuredClone(this.seed.orientationRequests.filter(item => !snapshot.orientationRequests.some(existing => existing.id === item.id))))
        snapshot.generalOrientations.push(...structuredClone(this.seed.generalOrientations.filter(item => !snapshot.generalOrientations.some(existing => existing.id === item.id))))
        snapshot.demoCommunicationsVersion = 1
      }
      return JSON.stringify(teacherSnapshotSchema.parse(snapshot))
    }
    const merged = structuredClone(this.seed)
    let found = false
    for (const source of this.sources) {
      const raw = this.storage.getItem(source.key)
      if (raw === null) continue
      found = true
      const legacy = teacherSnapshotSchema.parse(JSON.parse(raw))
      const company = merged.companies.find(item => item.id === source.companyId)!
      const activityIds = new Set(company.activities.map(activity => activity.id))
      const titles = new Set(company.activities.map(activity => activity.title))
      const linkedId = legacy.companies.find(item => item.linkedToStudent)?.id
      const orientationIds = new Map<string, string>()
      for (const note of legacy.orientations.filter(item => item.companyId === linkedId && activityIds.has(item.activityId))) {
        const id = this.uniqueId(note.id, merged.orientations, company.id)
        orientationIds.set(note.id, id)
        merged.orientations.push({ ...note, id, companyId: company.id })
      }
      for (const request of legacy.orientationRequests.filter(item => item.companyId === linkedId && activityIds.has(item.activityId))) {
        merged.orientationRequests.push({ ...request, id: this.uniqueId(request.id, merged.orientationRequests, company.id), companyId: company.id })
      }
      for (const note of legacy.generalOrientations.filter(item => titles.has(item.activity) && item.classIds.includes(company.classId))) {
        merged.generalOrientations.push({ ...note, id: this.uniqueId(note.id, merged.generalOrientations, company.id), classIds: [company.classId], companyIds: [company.id] })
      }
      for (const event of legacy.audit.filter(item => item.companyId === linkedId)) {
        merged.audit.push({ ...event, id: this.uniqueId(event.id, merged.audit, company.id), companyId: company.id, orientationId: orientationIds.get(event.orientationId) ?? event.orientationId })
      }
      merged.revision += legacy.revision
    }
    return found ? JSON.stringify(teacherSnapshotSchema.parse(merged)) : null
  }
  private uniqueId(id: string, values: { id: string }[], companyId: string) {
    let result = id
    while (values.some(item => item.id === result)) result = companyId + ':' + result
    return result
  }
  setItem(_key: string, value: string) { this.storage.setItem(KEY, value) }
}
