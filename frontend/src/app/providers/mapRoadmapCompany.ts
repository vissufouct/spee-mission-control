import { getActivityStatus, getLearningTasks, type JourneySnapshot } from '@/features/student-journey'
import type { Company, TeacherStatus } from '@/features/teacher-mission-control'

const statusOf = (status: ReturnType<typeof getActivityStatus>): TeacherStatus => status === 'available' || status === 'unavailable' ? 'not-started' : status === 'returned' ? 'in-progress' : status

/** Project only records present in this example; never borrow legacy dates or results. */
export function mapRoadmapCompany(source: JourneySnapshot, identity: Company): Company {
  const all = source.blocks.flatMap(block => block.activities)
  const submissions = all.flatMap(activity => (activity.tasks ?? []).flatMap(task => task.submission ? [task.submission.submittedBy] : []))
  const actors = [...new Set([...source.members, ...source.events.map(event => event.actor), ...submissions])]
  const company: Company = {
    id: identity.id, name: source.registration?.data.legalName || source.context.companyName || identity.name,
    classId: identity.classId, routeId: identity.routeId, definitionVersion: source.context.roadmapVersion!,
    example: source.context.example, currentBlockId: source.context.currentBlockId, linkedToStudent: true,
    participants: actors.map((name, index) => ({ id: 'source-' + index, name, initials: name.split(' ').map(part => part[0]).slice(0, 2).join('') })),
    blocks: source.blocks.map(block => ({ id: block.id, title: block.title, state: block.activities.length ? statusOf(block.state) : 'unavailable' })),
    activities: [], events: [], results: [],
  }
  const actorId = (name: string) => company.participants.find(person => person.name === name)!.id
  company.activities = source.blocks.flatMap(block => block.activities.map(activity => {
    const tasks = getLearningTasks(activity, source)
    const next = tasks.find(task => task.status === 'in-progress') ?? tasks.find(task => task.status === 'not-started')
    const prerequisiteIds = [...new Set((activity.tasks ?? []).flatMap(task => task.dependsOn ?? []))]
    return { id: activity.id, title: activity.title, blockId: block.id, milestone: block.id,
      status: statusOf(getActivityStatus(activity, source)), participantIds: [], dueDate: null,
      module: 'Roteiro de Tarefas', nextStep: next?.title ?? '', resultIds: [],
      description: activity.description, definitionOfDone: activity.definitionOfDone ?? 'Todas as tarefas obrigatórias desta actividade têm conclusão confirmada. Uma submissão não equivale a avaliação ou aprovação.',
      dependencyIds: all.filter(other => other.id !== activity.id && other.tasks?.some(task => prerequisiteIds.includes(task.id))).map(other => other.id),
      tasks: tasks.map(task => ({ ...task, status: statusOf(task.status) })),
    }
  }))
  for (const event of source.events) {
    const activityId = event.activityId ?? (event.type.startsWith('registration.') ? 'registar-empresa' : undefined)
    if (!activityId || !company.activities.some(activity => activity.id === activityId)) continue
    const status = event.activityStatus ? statusOf(event.activityStatus) : event.type === 'registration.confirmed' ? 'completed' : event.type === 'registration.removed' ? 'not-started' : 'in-progress'
    company.events.push({ id: event.id, activityId, occurredAt: event.occurredAt, actorIds: [actorId(event.actor)], role: 'student', category: 'individual', message: event.message, previousStatus: null, newStatus: status, resultId: null, confirmed: true })
  }
  for (const activity of company.activities) {
    // Membership and illustrative participant descriptions are not proof of contribution.
    activity.participantIds = [...new Set([
      ...company.events.filter(event => event.activityId === activity.id).flatMap(event => event.actorIds),
      ...(activity.tasks ?? []).flatMap(task => task.submission ? [actorId(task.submission.submittedBy)] : []),
    ])]
    const registration = activity.id === 'registar-empresa' && source.registration?.status === 'confirmed' ? source.registration : null
    if (!registration) continue
    const event = [...company.events].reverse().find(item => source.events.some(original => original.id === item.id && original.type === 'registration.confirmed'))
    const resultId = 'source-registration-' + registration.id
    company.results.push({ id: resultId, activityId: activity.id, title: 'Comprovativo de registo da empresa', reference: registration.receiptNumber!, module: activity.module,
      confirmedAt: event?.occurredAt ?? registration.updatedAt, description: 'Registo confirmado na simulação local. Sem validade oficial. As restantes tarefas mantêm os seus próprios estados.',
      fields: [{ label: 'Denominação', value: registration.data.legalName }, { label: 'NUIT de demonstração', value: registration.data.taxId }, { label: 'Actividade económica', value: registration.data.sector }, { label: 'Capital social', value: registration.data.capital.toLocaleString('pt-PT') + ' MZN' }] })
    activity.resultIds.push(resultId)
    if (event) event.resultId = resultId
  }
  return company
}
