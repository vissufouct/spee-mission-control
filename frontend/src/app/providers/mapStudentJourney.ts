import { getActivityStatus, getLearningTasks, type JourneySnapshot } from '@/features/student-journey'
import type { Company, TeacherEvent, TeacherStatus } from '@/features/teacher-mission-control'

function toTeacherStatus(status: ReturnType<typeof getActivityStatus>): TeacherStatus {
  if (status === 'available' || status === 'unavailable') return 'not-started'
  if (status === 'returned') return 'in-progress'
  return status
}

/** Read-only composition adapter: the teacher never maintains a second student state. */
export function mapStudentJourney(source: JourneySnapshot, template: Company): Company {
  const company = structuredClone(template)
  company.name = source.registration?.data.legalName || template.name
  company.currentBlockId = source.context.currentBlockId
  company.blocks = source.blocks.map(({ id, title }) => ({ id, title }))
  const names = [...new Set([source.context.studentName, ...source.events.filter(e => e.type === 'name.reserved' || e.type.startsWith('registration.') || e.type === 'learning-task.completed').map(e => e.actor)])]
  company.participants = names.map((name, index) => ({ id: 'source-' + index, name, initials: name.split(' ').map(n => n[0]).slice(0, 2).join('') }))
  company.results = []
  company.events = []
  company.activities = source.blocks.flatMap(block => block.activities.map(activity => {
    const metadata = template.activities.find(a => a.id === activity.id)
    return { id: activity.id, title: activity.title, blockId: block.id, milestone: metadata?.milestone ?? 'constituicao',
      status: toTeacherStatus(getActivityStatus(activity, source)), participantIds: [], dueDate: metadata?.dueDate ?? null,
      module: metadata?.module ?? 'Roteiro de Tarefas', nextStep: activity.reason || activity.description, resultIds: [],
      description: activity.description, definitionOfDone: metadata?.definitionOfDone, dependencyIds: metadata?.dependencyIds ?? [],
      tasks: getLearningTasks(activity, source).map(task => ({ ...task, status: toTeacherStatus(task.status) })) }
  }))
  const states: Record<string, TeacherEvent['newStatus']> = {
    'name.reserved': 'completed', 'registration.created': 'in-progress', 'registration.updated': 'in-progress',
    'registration.removed': 'not-started', 'registration.confirmed': 'completed',
  }
  for (const event of source.events) {
    const status = event.activityStatus ? toTeacherStatus(event.activityStatus) : states[event.type]
    if (!status) continue
    const activityId = event.activityId ?? (event.type === 'name.reserved' ? 'reserva-nome' : 'registar-empresa')
    const actor = company.participants.find(p => p.name === event.actor)!
    company.events.push({ id: event.id, activityId, occurredAt: event.occurredAt, actorIds: [actor.id],
      role: 'student', category: 'individual', message: event.message, previousStatus: null,
      newStatus: status, resultId: null, confirmed: true })
  }
  for (const activity of company.activities) {
    activity.participantIds = [...new Set(company.events.filter(e => e.activityId === activity.id).flatMap(e => e.actorIds))]
    const registrationConfirmed = activity.id === 'registar-empresa' && source.registration?.status === 'confirmed'
    if (activity.status !== 'completed' && !registrationConfirmed) continue
    const evidence = [...company.events].reverse().find(e => e.activityId === activity.id && (e.newStatus === 'completed' || (registrationConfirmed && source.events.some(original => original.id === e.id && original.type === 'registration.confirmed'))))
    const confirmedAt = evidence?.occurredAt ?? '2026-10-21T07:00:00.000Z'
    const id = 'source-result-' + activity.id
    const registration = activity.id === 'registar-empresa' ? source.registration : null
    company.results.push({ id, activityId: activity.id, title: activity.title,
      reference: registration?.receiptNumber ?? 'DEMO-' + activity.id.toUpperCase(),
      module: activity.module, confirmedAt,
      description: evidence ? 'Resultado da mesma simulação local apresentada ao estudante. Sem validade oficial.' : 'Estado concluído no cenário inicial do estudante. Não está disponível um evento de origem; não é atribuída contribuição humana.',
      fields: registration ? [
        { label: 'Denominação', value: registration.data.legalName }, { label: 'NUIT de demonstração', value: registration.data.taxId },
        { label: 'Actividade económica', value: registration.data.sector }, { label: 'Capital social', value: registration.data.capital.toLocaleString('pt-PT') + ' MZN' },
      ] : [{ label: 'Origem', value: evidence ? 'Evento confirmado do estudante' : 'Fixture inicial do estudante' }] })
    activity.resultIds.push(id)
    if (evidence) evidence.resultId = id
    else company.events.push({ id: 'source-initial-' + activity.id, activityId: activity.id, occurredAt: confirmedAt,
      actorIds: [], role: 'system', category: 'automatic', message: 'Estado inicial confirmado no cenário; sem evento de origem.',
      previousStatus: null, newStatus: 'completed', resultId: id, confirmed: true })
  }
  return company
}
