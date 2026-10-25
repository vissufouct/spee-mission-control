import { describe, expect, it } from 'vitest'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { activityParticipants, hasSimulatedParticipation, aggregateStatus, companyProgress, contributionEvents, filterCompanies, readFilters, activityAlerts, pendingOrientationRequests } from './teacher.selectors'
const snapshot = teacherSnapshotSchema.parse(fixture)
const filters = (query: string) => readFilters(new URLSearchParams(query))
describe('consulta do docente', () => {
  it('reúne nomes sem repetição e mantém participação ilustrativa fora dos eventos', () => {
    const company = structuredClone(snapshot.companies[0])
    const activity = company.activities[0]
    const ids = company.participants.slice(0, 2).map(person => person.id)
    activity.participantIds = [ids[0]]
    activity.simulatedParticipantIds = ids
    activity.status = 'completed'
    const events = contributionEvents(company, 'all')
    expect(activityParticipants(company, activity).map(person => person.id)).toEqual(ids)
    expect(hasSimulatedParticipation(activity)).toBe(true)
    expect(contributionEvents(company, 'all')).toEqual(events)
    activity.status = 'not-started'
    expect(activityParticipants(company, activity).map(person => person.id)).toEqual([ids[0]])
    expect(hasSimulatedParticipation(activity)).toBe(false)
  })
  it('mostra todas as turmas e combina filtros por coluna com AND', () => {
    expect(filterCompanies(snapshot,filters(''))).toHaveLength(10)
    expect(filterCompanies(snapshot,filters('turma=turma-b'))).toHaveLength(2)
    expect(filterCompanies(snapshot,filters('marco.constituicao=completed&marco.salarios=in-progress')).map(c => c.id)).toEqual(['nova-geracao'])
  })
  it('pesquisa empresas e estudantes sem exigir acentos', () => {
    expect(filterCompanies(snapshot,filters('q=indico'))[0].id).toBe('indico-servicos')
    expect(filterCompanies(snapshot,filters('q=joao')).length).toBeGreaterThan(0)
    expect(filterCompanies(snapshot,filters('q=inexistente'))).toHaveLength(0)
  })
  it('os alertas não incluem actividades concluídas', () => {
    const activity = snapshot.companies[0].activities[0]
    expect(activityAlerts(activity,snapshot)).toEqual([])
    expect(activityAlerts({ ...activity, status:'not-started', dueDate: null },snapshot)).toEqual([])
    expect(activityAlerts({ ...activity, status:'blocked', dueDate: '2026-10-21' },snapshot)).toContain('Prazo ultrapassado')
    expect(activityAlerts({ ...activity, status:'in-progress', dueDate: '2026-10-24' },snapshot)).toEqual(['Prazo próximo'])
  })
  it('só a conclusão conta para o progresso e devolvido é apresentado como em curso', () => {
    const company = snapshot.companies.find(c => c.id === 'nova-geracao')!
    expect(companyProgress(company)).toBe(47)
    expect(aggregateStatus(company.activities.filter(a => a.milestone === 'fiscal'))).toBe('in-progress')
    const before = companyProgress(company)
    contributionEvents(company,'confirmed')
    expect(companyProgress(company)).toBe(before)
  })
  it('conta apenas pedidos que aguardam resposta do docente', () => {
    expect(pendingOrientationRequests(snapshot)).toHaveLength(1)
    expect(pendingOrientationRequests(snapshot,'nova-geracao')).toHaveLength(1)
    expect(pendingOrientationRequests(snapshot,'horizonte-verde')).toHaveLength(0)
  })
  it('separa participação humana, colaboração e automação sem duplicar eventos', () => {
    const company = snapshot.companies[0]
    const humans = contributionEvents(company,'confirmed')
    const auto = contributionEvents(company,'automatic')
    const collective = contributionEvents(company,'collective')
    expect(humans.every(e => e.role === 'student')).toBe(true)
    expect(auto.every(e => e.role === 'system')).toBe(true)
    expect(collective.every(e => e.actorIds.length > 1)).toBe(true)
    expect(contributionEvents(company,'all')).toHaveLength(humans.length + auto.length)
    expect(new Set(humans.map(e => e.id)).size).toBe(humans.length)
  })
})
