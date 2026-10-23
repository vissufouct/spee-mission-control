import { describe, expect, it } from 'vitest'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { JsonTeacherRepository } from './JsonTeacherRepository'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
const input = { companyId: 'nova-geracao', activityId: 'ano1-3', subject: 'Rever declaração', message: 'Rever a base tributável e anexar os elementos.', reason: 'A declaração foi devolvida por inconsistência.' }
function setup() {
  const data = new Map<string,string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key,value) } }
  return { data, storage, repo: new JsonTeacherRepository(fixture, storage) }
}
describe('repository do docente', () => {
  it('valida fixtures e exige evidência para conclusões', () => {
    expect(teacherSnapshotSchema.safeParse(fixture).success).toBe(true)
    const normalized = teacherSnapshotSchema.parse(fixture)
    const statuses = normalized.companies.flatMap(company =>
      company.activities.map(activity => activity.status),
    )
    expect(statuses).toContain('in-progress')
    expect(statuses.every(status => ['completed', 'in-progress', 'not-started', 'blocked'].includes(status))).toBe(true)
    const invalid = structuredClone(fixture)
    invalid.companies[0].events = []
    expect(teacherSnapshotSchema.safeParse(invalid).success).toBe(false)
  })
  it('responde, encerra e preserva o histórico dos pedidos de orientação', async () => {
    const { repo } = setup()
    const initial = await repo.getSnapshot()
    const id = 'request-nova-geracao-iva'
    const replied = await repo.replyToOrientationRequest(id,{ message: 'Consultem a declaração e confirmem os documentos de suporte.' },initial.revision)
    const request = replied.orientationRequests.find(item => item.id === id)!
    expect(request.status).toBe('awaiting-student')
    expect(request.messages.at(-1)?.role).toBe('teacher')
    const concluded = await repo.concludeOrientationRequest(id,replied.revision)
    expect(concluded.orientationRequests.find(item => item.id === id)?.status).toBe('concluded')
    expect(concluded.orientationRequests.find(item => item.id === id)?.messages).toHaveLength(2)
  })
  it('publica orientações gerais apenas para turmas existentes', async () => {
    const { repo } = setup()
    const input = { classIds: ['turma-a','turma-b'], activity: 'Processamento de salários', subject: 'Preparar salários', message: 'Confirmem os trabalhadores e o período antes de processar.', reason: 'A mesma dúvida surgiu em várias empresas.' }
    const initial = await repo.getSnapshot()
    const published = await repo.publishGeneralOrientation(input,initial.revision)
    expect(published.generalOrientations.at(-1)?.classIds).toEqual(['turma-a','turma-b'])
    await expect(repo.publishGeneralOrientation({ ...input, classIds:['inexistente'] },published.revision)).rejects.toThrow('turmas')
  })
  it('cria, edita, confirma e conserva histórico sem mudar actividades', async () => {
    const { repo, storage } = setup()
    const initial = await repo.getSnapshot()
    const created = await repo.saveOrientation(input, 0)
    const id = created.orientations[0].id
    const edited = await repo.saveOrientation({ ...input, message: 'Rever a declaração e o apuramento do imposto.' }, 1, id)
    expect(edited.orientations[0].message).toContain('apuramento')
    const recorded = await repo.recordOrientation(id, 2)
    expect(recorded.orientations[0].status).toBe('recorded')
    expect(recorded.audit.map(e => e.action)).toEqual(['created','updated','recorded'])
    expect(recorded.companies).toEqual(initial.companies)
    await expect(repo.removeOrientation(id, 3)).rejects.toThrow('rascunho')
    await expect(repo.saveOrientation(input, 3, id)).rejects.toThrow('rascunho')
    expect((await new JsonTeacherRepository(fixture, storage).getSnapshot()).orientations[0].status).toBe('recorded')
  })
  it('elimina apenas o rascunho e conserva a auditoria', async () => {
    const { repo } = setup()
    const created = await repo.saveOrientation(input,0)
    const removed = await repo.removeOrientation(created.orientations[0].id,1)
    expect(removed.orientations).toHaveLength(0)
    expect(removed.audit.map(e => e.action)).toEqual(['created','removed'])
    expect(removed.audit[1].reason).toBe(input.reason)
  })
  it('rejeita motivo vazio, actividade alheia e mudança de empresa', async () => {
    const { repo } = setup()
    await expect(repo.saveOrientation({ ...input, reason: '' },0)).rejects.toThrow('motivo')
    await expect(repo.saveOrientation({ ...input, activityId: 'inexistente' },0)).rejects.toThrow('actividade')
    const created = await repo.saveOrientation(input,0)
    await expect(repo.saveOrientation({ ...input, companyId: 'maputo-solucoes' },1,created.orientations[0].id)).rejects.toThrow('empresa')
    expect((await repo.getSnapshot()).revision).toBe(1)
  })
  it('rejeita mutações concorrentes ou com revisão antiga', async () => {
    const { repo } = setup()
    const results = await Promise.allSettled([repo.saveOrientation(input,0),repo.saveOrientation(input,0)])
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1)
    expect((await repo.getSnapshot()).orientations).toHaveLength(1)
  })
  it('não apaga dados corrompidos silenciosamente', async () => {
    const { repo, data } = setup()
    data.set('spee.teacher-mission-control.v1', '{invalido')
    await expect(repo.getSnapshot()).rejects.toThrow('não foram alterados')
    expect(data.get('spee.teacher-mission-control.v1')).toBe('{invalido')
    expect((await repo.reset()).orientations).toHaveLength(0)
  })
  it('falha de escrita não confirma nem altera o cenário', async () => {
    const repo = new JsonTeacherRepository(fixture,{ getItem: () => null, setItem: () => { throw new Error('quota') } })
    await expect(repo.saveOrientation(input,0)).rejects.toThrow('Nenhuma alteração')
    expect((await repo.getSnapshot()).orientations).toHaveLength(0)
  })
  it('falha da origem partilhada impede leitura e escrita enganadoras', async () => {
    const { storage, data } = setup()
    const repo = new JsonTeacherRepository(fixture,storage,async () => { throw new Error('source') })
    await expect(repo.getSnapshot()).rejects.toThrow('ligada ao estudante')
    await expect(repo.saveOrientation(input,0)).rejects.toThrow('ligada ao estudante')
    expect(data.size).toBe(0)
  })
})
