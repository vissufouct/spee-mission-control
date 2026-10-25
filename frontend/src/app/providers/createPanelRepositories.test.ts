import { describe, expect, it } from 'vitest'
import legacyTeacher from '@/data/teacher-mission-control.fixture.json'
import { getActivityStatus, getLearningTasks } from '@/features/student-journey'
import { teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { createPanelRepositories } from './createPanelRepositories'
import { createStudentConversations } from './createStudentConversations'

function setup() {
  const data = new Map<string, string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value) } }
  return { data, storage, one: createPanelRepositories(storage, '1'), two: createPanelRepositories(storage, '2') }
}

describe('docente: duas empresas do mesmo roteiro', () => {
  it('projecta cada registo sem herdar os cenários, prazos ou resultados antigos', async () => {
    const { one, two } = setup()
    const snapshot = await one.teacher.getSnapshot()
    expect(snapshot).toEqual(await two.teacher.getSnapshot())
    expect(snapshot.companies.map(c => c.id)).toEqual(['horizonte-verde', 'nascente-criativa'])
    expect(snapshot.milestones.map(m => m.id)).toEqual(['acolhimento', 'ideacao', 'constituicao', 'inicio-actividades', 'primeiro-ano'])
    expect(snapshot.milestones[4].upcoming).toBe(true)
    for (const [index, panel] of [one, two].entries()) {
      const source = await panel.student.getSnapshot()
      const company = snapshot.companies[index]
      expect(company.example).toBe(String(index + 1))
      expect(company.name).toBe(source.context.companyName)
      expect(company.activities).toHaveLength(15)
      expect(company.activities.flatMap(a => a.tasks ?? [])).toHaveLength(48)
      expect(company.activities.flatMap(a => a.tasks ?? []).filter(t => t.status === 'completed')).toHaveLength(index === 0 ? 24 : 0)
      expect(company.activities.filter(a => a.status === 'completed')).toHaveLength(index === 0 ? 7 : 0)
      expect(company.events).toEqual([])
      expect(company.results).toEqual([])
      expect(company.activities.every(a => a.dueDate === null)).toBe(true)
      expect(company.blocks.map(b => b.state)).toEqual(source.blocks.map(b => b.state))
      for (const activity of source.blocks.flatMap(b => b.activities)) {
        const projected = company.activities.find(a => a.id === activity.id)!
        expect(projected.status).toBe(getActivityStatus(activity, source))
        const tasks = getLearningTasks(activity, source)
        expect(projected.tasks?.map(t => t.id)).toEqual(tasks.map(t => t.id))
        for (const task of tasks) {
          expect(projected.tasks?.find(t => t.id === task.id)).toMatchObject({
            id: task.id, title: task.title, status: task.status, required: task.required,
            ...(task.answers && { answers: task.answers }),
            ...(task.submission && { submission: task.submission }),
            ...(task.completedAt && { completedAt: task.completedAt }),
          })
        }
      }
    }
    expect(snapshot.companies[0].activities.find(a => a.id === 'registar-empresa')?.participantIds).toEqual([])
    expect(snapshot.companies[0].activities.find(a => a.id === 'auditoria-1')?.participantIds).toHaveLength(1)
    expect(snapshot.generalOrientations).toEqual([])
  })

  it('actualiza só a empresa alterada e conserva os ficheiros, autores e datas após recarregar', async () => {
    const { one, two, storage } = setup()
    const initial = await one.teacher.getSnapshot()
    const changed = await two.student.completeLearningTask('boas-vindas', 'b01-a01-t01', undefined, 0)
    let teacher = await one.teacher.getSnapshot()
    expect(teacher.companies[0]).toEqual(initial.companies[0])
    expect(teacher.companies[1].activities.find(a => a.id === 'boas-vindas')?.tasks?.filter(t => t.status === 'completed')).toHaveLength(1)
    expect(teacher.companies[1].events[0]).toMatchObject({ id: changed.events[0].id, occurredAt: changed.events[0].occurredAt, message: changed.events[0].message })
    const registration = await one.student.confirmRegistration(0)
    const declaration = await one.student.completeLearningTask('registar-empresa', 'b03-a01-t06', undefined, registration.revision)
    const file = { fileName: 'publicacao-da-equipa.pdf', dataUrl: 'data:application/pdf;base64,JVBERi0xLjcK' }
    const submitted = await one.student.completeLearningTask('registar-empresa', 'b03-a01-t07', undefined, declaration.revision, file)
    teacher = await createPanelRepositories(storage, '2').teacher.getSnapshot()
    const task = teacher.companies[0].activities.find(a => a.id === 'registar-empresa')?.tasks?.find(t => t.id === 'b03-a01-t07')
    expect(task?.submission).toEqual(submitted.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')?.tasks?.find(t => t.id === 'b03-a01-t07')?.submission)
    expect(task?.submission?.file).toEqual(file)
    expect(teacher.companies[0].results[0].reference).toBe(registration.registration?.receiptNumber)
    expect(teacher.companies[1].results).toEqual([])
    expect(teacher.companies[1].activities.filter(a => a.status === 'completed')).toHaveLength(0)
  })

  it('separa as conversas de cada empresa e partilha apenas orientações gerais da turma', async () => {
    const { one, two } = setup()
    const first = createStudentConversations(one.student, one.teacher, one.companyId)
    const second = createStudentConversations(two.student, two.teacher, two.companyId)
    await first.send('boas-vindas', 'Dúvida exclusiva da Horizonte Verde.')
    await second.send('boas-vindas', 'Dúvida exclusiva da Nascente Criativa.')
    const snapshot = await one.teacher.getSnapshot()
    const firstRequest = snapshot.orientationRequests.find(r => r.companyId === one.companyId)!
    const reply = await one.teacher.replyToOrientationRequest(firstRequest.id, { message: 'Resposta apenas para a Horizonte.' }, snapshot.revision)
    await one.teacher.publishGeneralOrientation({ classIds: [snapshot.classes[0].id], activity: 'Boas-vindas', subject: 'Preparação da turma', message: 'Leiam o guia antes de iniciar as tarefas.', reason: 'As duas equipas devem conhecer o roteiro.' }, reply.revision)
    expect((await first.read()).map(m => m.message)).toEqual(expect.arrayContaining(['Dúvida exclusiva da Horizonte Verde.', 'Resposta apenas para a Horizonte.']))
    expect((await second.read()).map(m => m.message)).not.toContain('Resposta apenas para a Horizonte.')
    expect((await second.read()).map(m => m.message)).toContain('Dúvida exclusiva da Nascente Criativa.')
    for (const gateway of [first, second]) expect((await gateway.read()).some(m => m.message.includes('Preparação da turma'))).toBe(true)
    expect(JSON.stringify(await one.teacher.getSnapshot())).not.toContain((await one.student.getSnapshot()).groupMessages[0].message)
  })

  it('conserva orientações antigas no contexto correcto, sem modificar os originais', async () => {
    const { storage, data } = setup()
    const raw = teacherSnapshotSchema.parse(legacyTeacher)
    raw.orientations = []
    raw.orientationRequests = []
    raw.generalOrientations = [{ id: 'nota-antiga', classIds: ['turma-a'], activity: 'Constituição legal da empresa', subject: 'Orientação anterior', message: 'Mensagem guardada antes da actualização.', reason: 'Manter o contexto da empresa de origem.', author: 'Vali Issufo', createdAt: '2026-10-24T12:00:00Z' }]
    const original = JSON.stringify(raw)
    const key = 'spee.roadmap-2026.2.spee.teacher-mission-control.v1'
    data.set(key, original)
    const one = createPanelRepositories(storage, '1'), two = createPanelRepositories(storage, '2')
    const before = await one.teacher.getSnapshot()
    expect(before.generalOrientations[0]).toMatchObject({ ...raw.generalOrientations[0], companyIds: ['nascente-criativa'] })
    const first = createStudentConversations(one.student, one.teacher, one.companyId)
    const second = createStudentConversations(two.student, two.teacher, two.companyId)
    expect((await first.read()).some(m => m.id === 'nota-antiga')).toBe(false)
    expect((await second.read()).find(m => m.id === 'nota-antiga')?.createdAt).toBe('2026-10-24T12:00:00Z')
    await second.send('boas-vindas', 'Mensagem nova depois da migração.')
    expect(data.get(key)).toBe(original)
    expect(data.has('spee.roadmap-2026.teacher.shared.v1')).toBe(true)
    expect((await createPanelRepositories(storage, '1').teacher.getSnapshot()).generalOrientations).toEqual(before.generalOrientations)
  })

  it('não apresenta dados iniciais como actuais se um dos exemplos estiver corrompido', async () => {
    const { one, data } = setup()
    data.set('spee.roadmap-2026.2.spee.student-journey.v1', '{invalid')
    await expect(one.teacher.getSnapshot()).rejects.toThrow('empresas ligadas')
    expect(data.size).toBe(1)
  })

  it('exige conclusão datada para usar tarefas como prova de actividade concluída', async () => {
    const { one } = setup()
    const snapshot = await one.teacher.getSnapshot()
    expect(teacherSnapshotSchema.safeParse(snapshot).success).toBe(true)
    delete snapshot.companies[0].activities[0].tasks![0].completedAt
    expect(teacherSnapshotSchema.safeParse(snapshot).success).toBe(false)
  })
})
