import { confirmedProgress } from '@/shared/lib/progress'
import type { Company, TeacherActivity, TeacherSnapshot, TeacherStatus } from '../types'

export const teacherPaths = {
  home: '/docente/mission-control',
  company: (id: string) => '/docente/mission-control/empresas/' + encodeURIComponent(id),
  contribution: (id: string) => '/docente/mission-control/empresas/' + encodeURIComponent(id) + '/contribuicoes',
}
export const statusLabels: Record<TeacherStatus, string> = {
  completed: 'Concluído', 'in-progress': 'Em curso',
  'not-started': 'Por iniciar', blocked: 'Bloqueado',
}
export function companyProgress(company: Company) {
  return confirmedProgress(company.activities.filter(a => a.status === 'completed').length, company.activities.length)
}
export function aggregateStatus(activities: TeacherActivity[]): TeacherStatus {
  if (!activities.length) return 'not-started'
  if (activities.every(a => a.status === 'completed')) return 'completed'
  if (activities.some(a => a.status === 'in-progress' || a.status === 'completed')) return 'in-progress'
  if (activities.some(a => a.status === 'blocked')) return 'blocked'
  return 'not-started'
}
export function daysUntil(date: string | null, asOf: string) {
  if (!date) return Infinity
  return Math.round((Date.parse(date + 'T00:00:00Z') - Date.parse(asOf.slice(0, 10) + 'T00:00:00Z')) / 86_400_000)
}
export function activityAlerts(activity: TeacherActivity, snapshot: TeacherSnapshot) {
  if (activity.status === 'completed') return []
  const alerts: string[] = []
  if (activity.status === 'blocked') alerts.push('Dependência por concluir')
  const days = daysUntil(activity.dueDate, snapshot.context.asOf)
  if (days < 0) alerts.push('Prazo ultrapassado')
  else if (days <= snapshot.context.dueSoonDays) alerts.push('Prazo próximo')
  return alerts
}
export function companyAlerts(company: Company, snapshot: TeacherSnapshot) {
  return company.activities.filter(a => activityAlerts(a, snapshot).length > 0)
}
export type MatrixFilters = { classId: string; status: string; deadline: string; search: string; columns: Record<string, string> }
export function readFilters(params: URLSearchParams): MatrixFilters {
  return {
    classId: params.get('turma') ?? 'all',
    status: params.get('estado') ?? 'all', deadline: params.get('prazo') ?? 'all',
    search: params.get('q') ?? '',
    columns: Object.fromEntries([...params].filter(([key]) => key.startsWith('marco.')).map(([key, value]) => [key.slice(6), value])),
  }
}
const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT')
export function filterCompanies(snapshot: TeacherSnapshot, filters: MatrixFilters) {
  return snapshot.companies.filter(company => {
    if (filters.classId !== 'all' && company.classId !== filters.classId) return false
    if (filters.search && !normalized(company.name + ' ' + company.participants.map(p => p.name).join(' ')).includes(normalized(filters.search))) return false
    if (filters.status !== 'all' && !company.activities.some(a => a.status === filters.status)) return false
    if (filters.deadline !== 'all' && !company.activities.some(a => {
      if (a.status === 'completed') return false
      const days = daysUntil(a.dueDate, snapshot.context.asOf)
      return filters.deadline === 'overdue' ? days < 0 : days >= 0 && days <= snapshot.context.dueSoonDays
    })) return false
    return Object.entries(filters.columns).every(([milestone, state]) => state === 'all' || aggregateStatus(company.activities.filter(a => a.milestone === milestone)) === state)
  })
}
export function pendingOrientationRequests(snapshot: TeacherSnapshot, companyId?: string) {
  return snapshot.orientationRequests.filter(request => request.status === 'awaiting-teacher' && (!companyId || request.companyId === companyId))
}
export function contributionEvents(company: Company, category: string) {
  return company.events.filter(e => e.confirmed && e.role !== 'teacher' && (category === 'all' || (category === 'confirmed' ? e.role !== 'system' : e.category === category)))
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
}
export const formatDay = (date: string | null) => date ? new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z')) : 'Sem prazo'
export const formatInstant = (date: string) => new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tallinn' }).format(new Date(date))
